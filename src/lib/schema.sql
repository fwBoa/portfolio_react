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
  theme               text,                          -- IA, Dev, Projets, Constats, Veille

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

-- La liste du blog trie par date de publication décroissante et filtre sur le
-- statut : index partiel, plus compact qu'un index complet.
create index if not exists posts_publies_idx
  on posts (published_at desc)
  where status = 'published';

-- Filtrage par thème, une fois la liste allongée.
create index if not exists posts_theme_idx
  on posts (theme)
  where status = 'published';

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
