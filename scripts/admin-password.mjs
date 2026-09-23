#!/usr/bin/env node
/**
 * Génère le hash du mot de passe administrateur.
 *
 *   node scripts/admin-password.mjs
 *
 * Le mot de passe est saisi en aveugle (saisie masquée) plutôt que passé en
 * argument : un argument de ligne de commande se retrouve dans l'historique du
 * shell et dans la liste des processus, où il est visible de tout le système.
 *
 * Le résultat est à coller dans `ADMIN_PASSWORD_HASH`, localement dans
 * `.env.local` et sur Vercel dans les variables d'environnement du projet.
 * Le mot de passe lui-même n'est stocké nulle part.
 *
 * Les deux variables à définir pour que l'admin fonctionne :
 *   ADMIN_PASSWORD_HASH   — produit par ce script
 *   ADMIN_SESSION_SECRET  — généré avec : openssl rand -base64 32
 */
import { createInterface } from 'node:readline';
import { randomBytes } from 'node:crypto';
import { hashPassword, MIN_PASSWORD_LENGTH } from '../api/_lib/password.js';

/**
 * Lit une ligne sans l'afficher. Le contrôle du terminal permet de désactiver
 * l'écho ; le retour arrière et les autres touches restent transmis.
 */
function readHidden(prompt) {
  return new Promise((resolve) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    });

    process.stdout.write(prompt);

    // Neutralise l'affichage des caractères saisis.
    const onData = (char) => {
      const text = String(char);
      if (text === '\r' || text === '\n' || text === '\u0004') return;
      if (text === '\u0003') {
        // Ctrl+C
        rl.close();
        process.exit(130);
      }
      // \u007f = retour arrière
      if (text === '\u007f' || text === '\b') {
        readline.cursorTo(process.stdout, prompt.length);
        readline.clearLine(process.stdout, 1);
      }
    };

    const readline = rl;
    process.stdin.on('data', onData);

    rl.question(prompt, (answer) => {
      process.stdin.removeListener('data', onData);
      rl.close();
      process.stdout.write('\n');
      resolve(answer);
    });
  });
}

async function main() {
  if (!process.stdin.isTTY) {
    console.error(
      'Ce script doit être lancé depuis un terminal interactif (la saisie est masquée).'
    );
    process.exit(1);
  }

  console.log('\nGénération du mot de passe administrateur\n');

  const password = await readHidden('Mot de passe : ');

  if (password.length < MIN_PASSWORD_LENGTH) {
    console.error(
      `\nRefusé : ${MIN_PASSWORD_LENGTH} caractères minimum (saisi : ${password.length}).`
    );
    process.exit(1);
  }

  const confirmation = await readHidden('Confirmation  : ');

  if (password !== confirmation) {
    console.error('\nRefusé : les deux saisies diffèrent.');
    process.exit(1);
  }

  const hash = await hashPassword(password);
  const secret = randomBytes(32).toString('base64');

  console.log('\n' + '─'.repeat(72));
  console.log('\nÀ coller dans .env.local et dans les variables Vercel :\n');
  console.log(`ADMIN_PASSWORD_HASH="${hash}"`);
  console.log(`ADMIN_SESSION_SECRET="${secret}"`);
  console.log('\n' + '─'.repeat(72));
  console.log(
    '\nLe second secret est proposé ici pour la commodité : il change à chaque\n' +
      'exécution. Si tu en as déjà un en production, conserve-le — le remplacer\n' +
      'déconnecte la session en cours, ce qui est parfois souhaité.\n'
  );
}

main().catch((error) => {
  console.error(`\nErreur : ${error.message}`);
  process.exit(1);
});
