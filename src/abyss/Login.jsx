import { useState } from 'react';
import { login } from './api';

/**
 * Écran de connexion.
 *
 * Un seul champ : le mot de passe. Il n'y a pas de nom d'utilisateur parce
 * qu'il n'y a qu'un administrateur — demander un identifiant qui n'existe
 * qu'en un seul exemplaire serait une formalité sans valeur.
 *
 * Le message d'erreur affiché est celui du serveur : il reste volontairement
 * générique (« Mot de passe incorrect »), pour ne pas indiquer à un visiteur
 * si un compte existe ou si la configuration serveur est incomplète.
 */
const Login = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setPending(true);

    try {
      await login(password);
      // Le mot de passe est vidé avant le changement d'écran : il ne doit pas
      // rester dans l'état d'un composant qui pourrait être remonté.
      setPassword('');
      onSuccess();
    } catch (err) {
      setError(err.message);
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-os-bg text-os-text flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <span className="text-[10px] tracking-[0.3em] uppercase text-os-body font-medium font-display block mb-4">
          Administration
        </span>
        <h1 className="text-3xl font-display font-bold tracking-tight mb-8">
          Connexion.
        </h1>

        <form onSubmit={handleSubmit}>
          <label
            htmlFor="admin-password"
            className="block text-[11px] uppercase tracking-[0.15em] font-medium text-os-body mb-3"
          >
            Mot de passe
          </label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            // Le focus est placé d'emblée : c'est le seul champ de la page.
            autoFocus
            disabled={pending}
            className="w-full px-4 py-3 bg-os-surface border border-os-border rounded-lg text-os-text text-base focus:border-os-text transition-colors duration-300 disabled:opacity-50"
          />

          {error && (
            <p role="alert" className="mt-4 text-sm text-red-700 leading-relaxed">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending || password.length === 0}
            className="mt-6 w-full px-6 py-3 bg-os-text text-white rounded-lg text-sm font-medium hover:bg-os-reading transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {pending ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
