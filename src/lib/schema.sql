-- Schéma du blog.
--
-- Les articles sont stockés en base mais figés en HTML au moment du build
-- (cf. scripts/prerender.mjs) : c'est ce qui les rend lisibles par les robots
-- qui n'exécutent pas le JavaScript. La base sert donc surtout de source de
-- vérité éditoriale et de futur support pour le back-office.
--
-- Appliquer avec :
--   node --env-file=.env.local scripts/db-migrate.mjs

-- Numérotation éditoriale des notes (« Note 012 »).
-- Une séquence dédiée plutôt que l'id : l'id peut avoir des trous, la
-- numérotation des notes doit rester continue. Le numéro n'est attribué
-- qu'à la publication, pour ne pas consommer de numéros sur des brouillons.
create sequence if not exists note_number_seq;

create table if not exists posts (
  id                  bigint generated always as identity primary key,

  -- Identité éditoriale
  slug                text        not null unique,
  title               text        not null,
  summary             text,
  content             text        not null,          -- markdown
  theme_slugs         text[]      not null default '{}',  -- slugs de src/lib/themes.js

  -- Cycle de vie
  status              text        not null default 'draft',
  note_number         integer     unique,            -- attribué à la publication
  reading_minutes     integer,                       -- estimé à l'écriture
  published_at        timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),

  -- Métadonnées de partage et de référencement
  meta_title          text,
  meta_description    text,
  og_image            text,

  constraint posts_status_valide check (status in ('draft', 'published')),

  -- Un article publié doit porter une date et un numéro de note.
  -- La base refuse un état incohérent plutôt que de le laisser passer.
  constraint posts_publication_coherente check (
    (status = 'draft'   and published_at is null and note_number is null)
    or
    (status = 'published' and published_at is not null and note_number is not null)
  )
);

-- ============================================================================
-- MIGRATION 01/10/2026 — le thème passe au pluriel (1/2) : la colonne
-- ============================================================================
--
-- `theme text` devient `theme_slugs text[]`. Une note peut désormais relever de
-- plusieurs thèmes : une note sur « LangChain chez un client » est à la fois IA
-- et Projets, et le singulier forçait à en sacrifier un.
--
-- ATTENTION : `create table if not exists` ne modifie PAS une table existante.
-- Sur une base déjà en service, la colonne doit donc être ajoutée
-- explicitement, et AVANT l'index GIN ci-dessous qui la référence. Vérifié en
-- test : dans l'autre ordre, la migration échoue sur « column theme_slugs does
-- not exist ».
--
-- Sur une base neuve, la colonne est déjà déclarée dans le `create table` :
-- l'instruction est alors sans effet.
alter table posts
  add column if not exists theme_slugs text[] not null default '{}';

-- La liste du blog trie par date de publication décroissante et filtre sur le
-- statut : index partiel, plus compact qu'un index complet.
create index if not exists posts_publies_idx
  on posts (published_at desc)
  where status = 'published';

-- Filtrage par thème.
--
-- GIN et non B-tree : un tableau ne se cherche pas avec un index B-tree. C'est
-- l'opérateur de contenance (`theme_slugs @> array['ia']`) qui est indexé —
-- celui dont se servira la future page /blog/theme/ia.
create index if not exists posts_theme_slugs_idx
  on posts using gin (theme_slugs)
  where status = 'published';

-- ============================================================================
-- MIGRATION 01/10/2026 — le thème passe au pluriel (2/2) : les données
-- ============================================================================
--
-- S'exécute APRÈS la création de l'index, donc celui-ci se construit sur une
-- colonne déjà remplie — inutile de le reconstruire ensuite.
--
-- `theme` n'est jamais supprimée en aveugle : le retrait n'a lieu que si le
-- transfert s'est déroulé. Une erreur inattendue laisse l'ancienne colonne en
-- place, avec ses données.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'posts' and column_name = 'theme'
  ) then

    -- `lower(trim(...))` fait à lui seul la traduction : l'ancienne colonne
    -- contenait ce qui était AFFICHÉ (« IA », « Dev »), la nouvelle contient ce
    -- qui identifie (« ia », « dev »). Inutile d'énumérer les cinq cas.
    update posts
    set theme_slugs = array[lower(trim(theme))]
    where theme is not null and trim(theme) <> '';

    -- Signaler toute valeur non traduite : mieux vaut une note sans thème
    -- qu'un slug inventé, qui créerait une catégorie fantôme — invisible et
    -- impossible à filtrer.
    --
    -- ATTENTION : cette liste est HISTORIQUE. Elle décrit les thèmes qui
    -- existaient le 01/10/2026, date de la migration, et ne doit PAS être
    -- tenue à jour : elle sert à traduire une valeur déjà écrite, pas à
    -- autoriser les thèmes courants. La liste de référence est
    -- `src/lib/themes.js`, et la table ne porte aucune contrainte sur
    -- `theme_slugs` — vérifié. Un thème ajouté après cette date est donc
    -- accepté sans migration.
    if exists (
      select 1 from posts
      where array_length(theme_slugs, 1) is not null
        and not (theme_slugs <@ array['ia', 'dev', 'projets', 'constats', 'veille'])
    ) then
      raise warning 'Migration : thèmes non reconnus ignorés — voir la colonne theme.';
      update posts set theme_slugs = '{}'
      where not (theme_slugs <@ array['ia', 'dev', 'projets', 'constats', 'veille']);
    end if;

    drop index if exists posts_theme_idx;
    alter table posts drop column theme;

  end if;
end $$;

-- ============================================================================

-- updated_at tenu à jour par la base, jamais par le code appelant : une
-- écriture oubliée ne peut pas laisser une date périmée.
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists posts_updated_at on posts;
create trigger posts_updated_at
  before update on posts
  for each row execute function set_updated_at();

-- Attribue le numéro de note et la date de publication au passage en publié.
-- Centralisé ici pour que le back-office n'ait pas à s'en préoccuper, et pour
-- que la contrainte ci-dessus soit toujours satisfaite.
create or replace function assign_note_number() returns trigger as $$
begin
  if new.status = 'published' and new.note_number is null then
    new.note_number := nextval('note_number_seq');
    new.published_at := coalesce(new.published_at, now());
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists posts_note_number on posts;
create trigger posts_note_number
  before insert or update on posts
  for each row execute function assign_note_number();
