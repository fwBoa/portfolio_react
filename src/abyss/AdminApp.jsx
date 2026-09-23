import { useState, useEffect, useCallback } from 'react';
import Login from './Login';
import PostList from './PostList';
import Editor from './Editor';
import { getSession, listPosts, getPost, logout } from './api';

/**
 * Application d'administration.
 *
 * Trois états, et rien d'autre : connexion, liste, éditeur. Pas de routeur —
 * l'administration n'a pas d'URL à partager ni de bouton « précédent » à
 * honorer, et un routeur ne ferait qu'ajouter une couche de synchronisation
 * entre l'URL et l'affichage.
 *
 * La session est vérifiée au montage. C'est un confort, pas une protection :
 * chaque appel d'API revérifie la session côté serveur pour son propre compte.
 * Si l'interface se trompait sur l'état de la session, le serveur refuserait
 * quand même.
 */
const AdminApp = () => {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const [posts, setPosts] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  const [editing, setEditing] = useState(null);

  /** Charge la liste complète depuis le serveur. */
  const refreshList = useCallback(async () => {
    setLoadingList(true);
    try {
      const { posts: rows } = await listPosts();
      setPosts(rows);
    } catch {
      // Un échec ici signifie presque toujours une session expirée, cas déjà
      // traité par l'événement ci-dessous. On n'affiche donc pas d'erreur en
      // plus : ce serait redondant.
      setPosts([]);
    } finally {
      setLoadingList(false);
    }
  }, []);

  // Vérification initiale de la session.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { authenticated: ok } = await getSession();
        if (!cancelled) setAuthenticated(ok);
      } catch {
        if (!cancelled) setAuthenticated(false);
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Une session expirée en cours d'utilisation ramène à la connexion.
  useEffect(() => {
    const onUnauthorized = () => {
      setAuthenticated(false);
      setEditing(null);
    };
    window.addEventListener('admin:unauthorized', onUnauthorized);
    return () => window.removeEventListener('admin:unauthorized', onUnauthorized);
  }, []);

  // La liste est chargée dès que la session est ouverte.
  useEffect(() => {
    if (authenticated) refreshList();
  }, [authenticated, refreshList]);

  /**
   * Ouvre une note dans l'éditeur.
   *
   * La liste ne transporte pas le contenu (trop lourd) : il faut donc le
   * recharger pour l'article visé. Pour une note qui vient d'être créée ou
   * enregistrée, l'objet reçu contient déjà tout et on évite l'aller-retour.
   */
  const openPost = async (row) => {
    if (row.content !== undefined) {
      setEditing(row);
      return;
    }
    try {
      const { post } = await getPost(row.id);
      setEditing(post);
    } catch {
      // En cas d'échec, on ouvre avec ce qu'on a : mieux vaut un éditeur
      // partiel qu'aucun retour visuel.
      setEditing(row);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      setAuthenticated(false);
      setEditing(null);
      setPosts([]);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-os-bg text-os-body flex items-center justify-center text-sm">
        Vérification de la session…
      </div>
    );
  }

  if (!authenticated) {
    return <Login onSuccess={() => setAuthenticated(true)} />;
  }

  if (editing) {
    return (
      <Editor
        post={editing}
        onSaved={(saved) => {
          setEditing(saved);
          refreshList();
        }}
        onCancel={() => {
          setEditing(null);
          refreshList();
        }}
        onDeleted={() => {
          setEditing(null);
          refreshList();
        }}
      />
    );
  }

  return (
    <>
      <PostList
        posts={posts}
        loading={loadingList}
        onOpen={openPost}
        onRefresh={refreshList}
      />
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 pb-12">
        <div className="pt-6 border-t border-os-border flex flex-wrap items-center gap-6">
          <a
            href="/"
            className="py-2 text-xs text-os-body hover:text-os-text transition-colors duration-300"
          >
            Voir le site
          </a>
          <a
            href="/blog"
            className="py-2 text-xs text-os-body hover:text-os-text transition-colors duration-300"
          >
            Voir le blog
          </a>
          <button
            onClick={handleLogout}
            className="py-2 text-xs text-os-body hover:text-red-700 transition-colors duration-300"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminApp;
