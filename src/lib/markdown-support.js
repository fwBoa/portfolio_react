/**
 * Ce que l'éditeur accepte, et ce qu'il refuse.
 *
 * Écrit après avoir testé le pipeline réel (marked → DOMPurify) plutôt que
 * supposé : plusieurs constructions se comportent différemment de ce qu'on
 * attend, et deux d'entre elles étaient des lacunes.
 *
 * ── Fonctionne ────────────────────────────────────────────────────────────
 *
 *   Tableaux GFM              | Techno | Usage |  (+ alignement :---, :---:)
 *   Images                    ![alt](https://…)
 *   Liens                     [texte](https://… "titre")
 *   Liens dans un nouvel onglet   <a href="…" target="_blank">texte</a>
 *   Blocs de code             ```js … ```  → colorés (classe language-js)
 *   Schémas ASCII dans un bloc de code — alignement préservé par le monospace
 *   Citations                 > texte
 *   Listes de tâches          - [x] fait / - [ ] à faire
 *   Barré                     ~~texte~~
 *   Séparateur                ---
 *   Bloc dépliable            <details><summary>…</summary>…</details>
 *   Vidéo HTML                <video src="…" controls></video>
 *   Titres, listes, gras, italique — le socle du markdown
 *
 * ── Ne fonctionne pas ─────────────────────────────────────────────────────
 *
 *   Iframes (`<iframe>`) — SUPPRIMÉS par l'assainissement.
 *     C'est délibéré : une iframe est un vecteur d'injection classique (elle
 *     charge du code depuis un autre domaine), et DOMPurify les retire par
 *     défaut. Conséquence concrète : on ne peut pas intégrer une vidéo
 *     YouTube par iframe. Pour une vidéo, utiliser `<video>` avec un fichier
 *     hébergé, ou un lien.
 *
 *   Notes de bas de page GFM (`[^1]`) — non interprétées, le texte reste brut.
 *     `marked` ne les gère pas en configuration par défaut.
 *
 *   Mermaid — le bloc est conservé mais affiché comme du code, pas comme un
 *     diagramme. Pas de rendu graphique sans une bibliothèque supplémentaire.
 *
 *   Styles inline (`<div style="…">`) — retirés à l'assainissement.
 *     La mise en forme ne doit pas pouvoir être imposée depuis le contenu :
 *     c'est ce qui garantit que toute note ressemble aux autres.
 *
 * ── Recommandation pour un schéma ─────────────────────────────────────────
 *
 *   Un bloc de code avec un diagramme ASCII est le seul schéma qui fonctionne
 *   aujourd'hui, sans dépendance. Il est lisible, copiable, et reste correct
 *   même sans JavaScript — ce qui compte pour des notes destinées aussi aux
 *   agents qui n'exécutent pas les scripts.
 *
 *   Pour de vrais diagrammes, il faudrait rendre Mermaid au build. C'est
 *   possible (le pré-rendu a déjà `marked` et jsdom) mais c'est une décision
 *   à prendre : cela ajoute une dépendance lourde au build pour un usage
 *   qu'on ne sait pas encore fréquent.
 */
export const SUPPORTED = [
  'Tableaux GFM (avec alignement)',
  'Images',
  'Liens (avec titre, ou nouvel onglet)',
  'Blocs de code colorés',
  'Schémas ASCII dans un bloc de code',
  'Citations',
  'Listes de tâches',
  'Barré',
  'Bloc dépliable (details)',
  'Vidéo HTML (video)',
];

export const NOT_SUPPORTED = [
  { what: 'Iframes (YouTube, widgets)', why: "vecteur d'injection, retirés par l'assainissement" },
  { what: 'Notes de bas de page [^1]', why: 'non prises en charge par marked par défaut' },
  { what: 'Diagrammes Mermaid', why: 'affichés comme du code, pas rendus' },
  { what: 'Styles inline', why: 'retirés — la mise en forme reste celle du site' },
];
