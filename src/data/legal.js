import { site } from './site';

/**
 * Mentions légales — obligations françaises (LCEN art. 6-III) + RGPD.
 * À tenir à jour si l'hébergeur, l'éditeur ou les outils changent.
 */
export const legalSections = [
  {
    title: 'Éditeur du site',
    body: [
      'Nom : Jean-David Zamblezie',
      'Statut : Développeur web (particulier)',
      'Ville : Paris, France',
      'Adresse postale : communiquée à l\'hébergeur, conformément à l\'article 6-III-2 de la LCEN',
      `Email : ${site.email}`,
    ].join('\n'),
  },
  {
    title: 'Directeur de la publication',
    body: 'Jean-David Zamblezie, joignable à l\'adresse email ci-dessus.',
  },
  {
    title: 'Hébergement',
    body: 'Vercel Inc.\n440 N Barranca Ave #4133, Covina, CA 91723, USA\nhttps://vercel.com',
  },
  {
    title: 'Propriété intellectuelle',
    body: "L'ensemble des contenus de ce site (textes, visuels, code, identité graphique) est la propriété exclusive de Jean-David Zamblezie, sauf mention contraire. Toute reproduction, représentation ou adaptation, totale ou partielle, sans autorisation écrite préalable est interdite et constitue une contrefaçon au sens des articles L.335-2 et suivants du Code de la propriété intellectuelle.",
  },
  {
    title: 'Crédits',
    body: 'Design et développement : Jean-David Zamblezie.\nTechnologies : React, Vite, Tailwind CSS, Framer Motion.',
  },
  {
    title: 'Droit applicable',
    body: "Le présent site et ses mentions légales sont soumis au droit français. En cas de litige, et à défaut de résolution amiable, les tribunaux français sont seuls compétents.",
  },
];

/**
 * Politique de confidentialité (RGPD).
 * Ce site n'a AUCUN formulaire : aucune donnée n'est collectée auprès du visiteur.
 * Seule une mesure d'audience anonyme est effectuée via Vercel Analytics (sans cookie).
 */
export const privacySections = [
  {
    title: 'Responsable du traitement',
    body: `Jean-David Zamblezie — éditeur du site ${site.url}\nContact : ${site.email}`,
  },
  {
    title: 'Données collectées',
    body: "Ce site ne comporte aucun formulaire de contact, aucun espace membre et aucune création de compte. Aucune donnée personnelle n'est donc collectée directement auprès du visiteur.\n\nLes seules données traitées sont des statistiques de fréquentation agrégées et anonymisées (page consultée, provenance, pays, type d'appareil et de navigateur). Ces informations ne permettent pas de vous identifier et ne sont jamais recoupées entre plusieurs sites.",
  },
  {
    title: 'Mesure d\'audience',
    body: "La fréquentation est mesurée avec Vercel Analytics, conçu sans cookie et sans identifiant persistant.\n\nAucun cookie de mesure d'audience n'est déposé, aucune empreinte durable n'est conservée et votre adresse IP n'est pas enregistrée telle quelle. Les données sont agrégées et utilisées uniquement pour comprendre l'usage général du site.\n\nCe dispositif étant anonyme et strictement nécessaire au fonctionnement et au suivi du site, il ne requiert pas de consentement préalable — conformément à la position de la CNIL sur les outils de mesure d'audience exemptés.",
  },
  {
    title: 'Cookies',
    body: "Ce site n'utilise aucun cookie publicitaire, aucun cookie de réseaux sociaux et aucun traceur tiers.\n\nSeul un stockage local technique (localStorage) est utilisé pour mémoriser votre préférence d'affichage — le mode « dev » du portfolio. Cette information reste sur votre appareil, n'est jamais transmise et peut être effacée à tout moment en vidant les données du site dans votre navigateur.",
  },
  {
    title: 'Finalités et base légale',
    body: "Les données agrégées servent uniquement à :\n— assurer le bon fonctionnement et la sécurité du site ;\n— mesurer la fréquentation de manière anonyme ;\n— améliorer le contenu et les performances.\n\nBase légale : intérêt légitime de l'éditeur (article 6.1.f du RGPD) pour la mesure d'audience anonyme et la sécurité du site.",
  },
  {
    title: 'Durée de conservation',
    body: "Les statistiques de fréquentation sont conservées sous forme agrégée et anonyme. Aucune donnée permettant de vous identifier n'est conservée, il n'y a donc pas de durée de conservation associée à un profil utilisateur.",
  },
  {
    title: 'Destinataires et transferts hors Union européenne',
    body: "Les statistiques anonymes sont traitées par Vercel Inc. (États-Unis), l'hébergeur du site, agissant comme sous-traitant. Ce transfert est encadré par les clauses contractuelles types de la Commission européenne, qui garantissent un niveau de protection adéquat.\n\nAucune donnée n'est cédée, louée ou vendue à des tiers.",
  },
  {
    title: 'Vos droits',
    body: `Conformément au RGPD, vous disposez des droits suivants : accès, rectification, effacement, limitation du traitement, opposition et portabilité.\n\nCes droits ne s'appliquent qu'aux données personnelles. Ce site n'en collectant aucune auprès des visiteurs, ils concernent essentiellement les échanges par email.\n\nPour exercer un droit, écrivez à ${site.email}. Une réponse vous sera apportée dans un délai maximum d'un mois.`,
  },
  {
    title: 'Réclamation',
    body: "Si vous estimez que vos droits ne sont pas respectés, vous pouvez adresser une réclamation à la CNIL :\n\nCommission Nationale de l'Informatique et des Libertés\n3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07\nhttps://www.cnil.fr/fr/plaintes",
  },
  {
    title: 'Sécurité',
    body: "Le site est intégralement servi en HTTPS, avec un certificat TLS renouvelé automatiquement et une politique de sécurité stricte (HSTS). Aucune donnée sensible n'est stockée côté serveur.",
  },
  {
    title: 'Modification de cette politique',
    body: "Cette politique peut être mise à jour pour refléter un changement d'outil ou de réglementation. La date de dernière mise à jour figure en bas de ce document.",
  },
];
