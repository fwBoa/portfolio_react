/**
 * Fermeture de session.
 *
 * POST /api/auth/logout
 *
 * Un cookie httpOnly ne peut pas être retiré par le JavaScript du navigateur :
 * c'est la seule façon de le supprimer, et elle vient du serveur.
 *
 * Les attributs `Path`/`SameSite`/`Secure` doivent être identiques à ceux de la
 * pose, sinon le navigateur considère qu'il s'agit d'un autre cookie et
 * conserve l'ancien.
 */
import { sessionCookieOptions, SESSION_COOKIE } from '../_lib/session.js';

export default async function handler(req, res) {
  const { path, httpOnly, secure, sameSite } = sessionCookieOptions();

  res.setHeader(
    'Set-Cookie',
    [
      `${SESSION_COOKIE}=`,
      `Path=${path}`,
      'Max-Age=0',
      httpOnly ? 'HttpOnly' : '',
      secure ? 'Secure' : '',
      `SameSite=${sameSite}`,
    ]
      .filter(Boolean)
      .join('; ')
  );

  return res.status(200).json({ ok: true });
}
