import { useState } from 'react';
import { createPost } from './api';

/**
 * Liste des notes, brouillons compris.
 *
 * Tri par dernière modification, ce qui place en tête ce sur quoi on vient de
 * travailler. Les brouillons sont signalés visuellement : leur statut est
 * l'information la plus importante de la liste, puisqu'une note publiée n'est
 * plus modifiable de la même façon (elle ne peut pas redevenir brouillon).
 */

const fmtDate = (value) =>
  value
    ? new Date(value).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '—';

const PostList = ({ posts, loading, onOpen, onRefresh }) => {
  const [creating, setCreating] = useState(false);

  const create = async () => {
    setCreating(true);
    try {
      // Une note vide est créée immédiatement : l'auteur se retrouve dans
      // l'éditeur sans formulaire intermédiaire. Elle reste un brouillon, donc
      // invisible sur le site.
      const { post } = await createPost({
        title: 'Nouvelle note',
        slug: `note-${Date.now()}`,
        content: 'Contenu à écrire.',
        status: 'draft',
      });
      onOpen(post);
    } catch {
      setCreating(false);
      onRefresh();
    }
  };

  const drafts = posts.filter((post) => post.status === 'draft');
  const published = posts.filter((post) => post.status === 'published');

  return (
    <div className="min-h-screen bg-os-bg text-os-text">
      <header className="border-b border-os-border">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="block text-[10px] tracking-[0.3em] uppercase text-os-body font-medium font-display mb-1">
              Administration
            </span>
            <h1 className="text-2xl font-display font-bold tracking-tight">
              Notes du blog
            </h1>
          </div>
          <button
            onClick={create}
            disabled={creating}
            className="px-5 py-2.5 bg-os-text text-white rounded-lg text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-os-reading transition-colors duration-300 disabled:opacity-40"
          >
            {creating ? 'Création…' : 'Nouvelle note'}
          </button>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-8">
        {loading ? (
          <p className="text-sm text-os-muted">Chargement…</p>
        ) : posts.length === 0 ? (
          <p className="text-sm text-os-reading">
            Aucune note. La première arrive.
          </p>
        ) : (
          <div className="space-y-10">
            <Section
              title="Brouillons"
              hint="Visibles de vous seul, absents du site et du plan de site."
              posts={drafts}
              onOpen={onOpen}
            />
            <Section
              title="Publiées"
              hint="Figées en HTML au moment du build, lisibles par les moteurs et les IA."
              posts={published}
              onOpen={onOpen}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const Section = ({ title, hint, posts, onOpen }) => {
  if (posts.length === 0) return null;

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-[11px] uppercase tracking-[0.15em] font-medium text-os-text">
          {title} <span className="text-os-muted">· {posts.length}</span>
        </h2>
        <p className="text-xs text-os-muted mt-1">{hint}</p>
      </div>

      <ul className="border-t border-os-border">
        {posts.map((post) => (
          <li key={post.id} className="border-b border-os-border">
            <button
              onClick={() => onOpen(post)}
              className="w-full text-left py-4 flex flex-wrap items-baseline gap-x-4 gap-y-1 group"
            >
              <span className="font-display font-medium text-[11px] text-os-muted w-16 flex-shrink-0">
                {post.note_number ? `Note ${String(post.note_number).padStart(3, '0')}` : '—'}
              </span>

              <span className="flex-1 min-w-[200px] text-base font-display font-bold text-os-text group-hover:text-os-body transition-colors duration-300">
                {post.title}
              </span>

              {post.theme && (
                <span className="text-[11px] uppercase tracking-[0.15em] text-os-body font-medium">
                  {post.theme}
                </span>
              )}

              <span className="text-[11px] text-os-muted">
                {post.status === 'published'
                  ? `publiée ${fmtDate(post.published_at)}`
                  : `modifiée ${fmtDate(post.updated_at)}`}
              </span>

              {post.reading_minutes && (
                <span className="text-[11px] text-os-muted">
                  {post.reading_minutes} min
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default PostList;
