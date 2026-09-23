// Vérifie le pipeline complet : les constructions utiles survivent, celles
// qui doivent disparaître disparaissent. C'est le test qui manquait — sans lui,
// la faille du style inline est passée inaperçue.
import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';
import { marked } from 'marked';

const domPurify = createDOMPurify(new JSDOM('').window);

// Réplique exacte de la fonction du pré-rendu.
const render = (md) => {
  const shifted = (md ?? '').replace(/^\s*#\s+(.+)$/m, '## $1');
  return domPurify.sanitize(marked.parse(shifted), {
    ADD_ATTR: ['target'],
    FORBID_TAGS: ['style'],
    FORBID_ATTR: ['style'],
  });
};

let ok = 0;
let ko = 0;
const check = (label, condition) => {
  if (condition) { ok += 1; console.log(`  ✓ ${label}`); }
  else { ko += 1; console.log(`  ✗ ${label}`); }
};

console.log('\n1. Constructions qui doivent fonctionner\n');

const t = render('| a | b |\n|---|---|\n| c | d |');
check('tableau conservé', t.includes('<table>') && t.includes('<td>c</td>'));
check('en-tête conservé', t.includes('<th>a</th>'));

const ta = render('| a |\n|:---:|\n| b |');
check('alignement conservé', ta.includes('align="center"'));

check('image conservée', render('![alt](https://x.fr/i.png)').includes('<img'));
check('lien conservé', render('[t](https://x.fr)').includes('<a href="https://x.fr"'));
check('target conservé', render('<a href="https://x.fr" target="_blank">t</a>').includes('target="_blank"'));
check('bloc de code conservé', render('```js\nconst a=1\n```').includes('language-js'));
check('schéma ASCII conservé', render('```\n┌─┐\n│A│\n└─┘\n```').includes('┌─┐'));
check('citation conservée', render('> citation').includes('<blockquote>'));
check('liste de tâches conservée', render('- [x] fait').includes('type="checkbox"'));
check('barré conservé', render('~~vieux~~').includes('<del>'));
check('details conservé', render('<details><summary>S</summary>C</details>').includes('<details>'));
check('video conservée', render('<video src="https://x.fr/v.mp4" controls></video>').includes('<video'));

console.log('\n2. Constructions qui doivent disparaître\n');

check('script retiré', !render('<p>ok</p><script>alert(1)</script>').includes('<script'));
check('iframe retirée', !render('<iframe src="https://x.fr"></iframe>').includes('<iframe'));
check('gestionnaire d\'événement retiré', !render('<p onclick="alert(1)">x</p>').includes('onclick'));
check('balise style retirée', !render('<style>body{display:none}</style>').includes('<style>'));

// La lacune corrigée : cet attribut passait avant.
const withStyle = render('<div style="position:fixed;inset:0;background:red">recouvre tout</div>');
check('ATTRIBUT style retiré', !withStyle.includes('style='));
check('le contenu texte survit malgré tout', withStyle.includes('recouvre tout'));

// Une note ne doit pas pouvoir casser la mise en page du site.
const hostile = render('<div style="position:fixed;top:0;left:0;width:100vw;height:100vh">piège</div>');
check('recouvrement plein écran impossible', !hostile.includes('position') && !hostile.includes('100vw'));

console.log(`\n${'─'.repeat(50)}`);
console.log(`${ok} réussi(s), ${ko} échoué(s)`);
console.log(`${'─'.repeat(50)}\n`);

process.exit(ko > 0 ? 1 : 0);
