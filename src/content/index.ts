// Point d'entrée unique pour le contenu — importe et réexporte tout

import type { AppContent } from './types';

const CONTENT: AppContent = {

  // ── CONSEILS (orange) ──────────────────────────────────────────────────────
  conseilsIntro: "Voici quelques conseils qui peuvent vous aider à améliorer ou à vous conforter dans votre communication avec votre proche. Il existe autant d'aphasies que de personnes aphasiques : ces suggestions sont adaptables et non exhaustives. Ces conseils ne remplacent pas une prise en charge orthophonique.",

  conseils: [
    {
      id: "c1", slug: "communiquer", titre: "Conseils généraux pour communiquer",
      accroche: "Créer un environnement favorable, parler simplement, encourager.",
      aValider: false,
      blocs: [
        { t: "h2", x: "Créer un environnement favorable" },
        { t: "list", items: [
          "Réduire les bruits autour de vous (télévision, radio).",
          "Se placer face à la personne, à sa hauteur, dans un endroit calme et éclairé.",
          "Capter son attention avant de parler."
        ]},
        { t: "h2", x: "Utiliser un langage clair et simple" },
        { t: "list", items: [
          "Parler lentement, sans infantiliser.",
          "Faire des phrases courtes : une idée à la fois.",
          "Reformuler plutôt que répéter à l'identique.",
          "Laisser du temps pour répondre."
        ]},
        { t: "h2", x: "Encourager l'utilisation de supports visuels" },
        { t: "list", items: [
          "Photos, objets, écriture de mots-clés.",
          "Dessins et gestes de pointage."
        ]},
        { t: "h2", x: "Impliquer et encourager la personne" },
        { t: "list", items: [
          "Ne pas parler à sa place.",
          "L'inclure dans les conversations de groupe.",
          "Valoriser chaque réussite de communication.",
          "Accepter tous les moyens d'expression : gestes, dessin, mimiques."
        ]}
      ]
    },
    {
      id: "c2", slug: "moments-plaisants", titre: "Partager des moments plaisants au quotidien",
      accroche: "Sujets plaisants, photos, vidéos et rituels simples.",
      aValider: true,
      blocs: [
        { t: "h2", x: "Parlez de sujets plaisants" },
        { t: "p", x: "Discutez de sport, de musique, de films ou de souvenirs communs." },
        { t: "h2", x: "Utilisez des photos et vidéos" },
        { t: "p", x: "Ces supports visuels ravivent les discussions et facilitent l'échange." },
        { t: "h2", x: "Maintenez des rituels simples", aValider: true },
        { t: "list", items: [
          "Un café partagé en commentant le journal.",
          "Regarder des albums photos ensemble.",
          "Des jeux simples : loto, dominos, cartes.",
          "La musique de sa jeunesse.",
          "Cuisiner à deux."
        ]}
      ]
    },
    {
      id: "c3", slug: "trouver-ses-mots", titre: "Aider mon proche à trouver ses mots",
      accroche: "Lui laisser le temps et l'aider dans sa recherche renforce son langage.",
      aValider: true,
      blocs: [
        { t: "enc", x: "Il peut être bénéfique de ne pas toujours fournir immédiatement les mots que votre proche cherche. Lui laisser le temps de les retrouver et l'aider dans ce processus contribue à renforcer son langage." },
        { t: "h2", x: "Si je connais le mot qu'il cherche" },
        { t: "list", items: [
          "Tenir compte du contexte et des discussions en cours.",
          "Procéder par entonnoir : partir d'un sujet large et se rapprocher de ce qu'il veut dire.",
          "Poser des questions fermées : « c'est dans la cuisine ? », « c'est pour boire ? »",
          "Avoir à disposition la planche OUI / NON pour qu'il puisse pointer.",
          "Pointer les éléments autour de vous et tenir compte de ses réactions.",
          "Y revenir plus tard si vous n'êtes pas parvenus à vous comprendre."
        ]},
        { t: "lien", outil: "oui-non", x: "Ouvrir la planche OUI / NON" },
        { t: "h2", x: "Si je ne connais pas le mot", aValider: true },
        { t: "list", items: [
          "Demander la première lettre du mot.",
          "Demander de montrer, mimer ou dessiner.",
          "Proposer des catégories : « c'est une personne ? un objet ? un lieu ? »"
        ]}
      ]
    },
    {
      id: "c4", slug: "exprimer-une-douleur", titre: "Aider mon proche à exprimer une douleur et la localiser",
      accroche: "Questions simples, gestes, et schéma du corps à pointer.",
      aValider: true,
      blocs: [
        { t: "h2", x: "Poser des questions simples" },
        { t: "list", items: [
          "Utiliser des questions fermées OUI / NON. Exemple : « Tu as mal ? »",
          "Accompagner les paroles de gestes et de mimiques.",
          "Pointer les différentes parties du corps et laisser répondre par oui ou par non."
        ]},
        { t: "lien", outil: "schema-corps", x: "Ouvrir le schéma du corps" },
        { t: "enc", aValider: true, x: "En cas de doute sur une douleur aiguë, inhabituelle ou persistante, contactez un médecin. Le 114 permet d'alerter les secours par SMS." }
      ]
    },
    {
      id: "c5", slug: "eviter-isolement", titre: "Comment éviter l'isolement ?",
      accroche: "Informer l'entourage, maintenir les liens, penser à soi.",
      aValider: true,
      blocs: [
        { t: "h2", x: "Informer" },
        { t: "list", items: [
          "Informer les personnes du quotidien (famille, amis, commerçants habituels) des difficultés de votre proche.",
          "Donner à votre proche une carte expliquant qu'il est aphasique et ce qu'est l'aphasie."
        ]},
        { t: "lien", outil: "carte", x: "Voir la carte « Je suis aphasique »" },
        { t: "h2", x: "Maintenir les liens", aValider: true },
        { t: "list", items: [
          "Continuer à sortir, recevoir, accepter les invitations en préparant l'entourage.",
          "Privilégier les petits groupes.",
          "S'appuyer sur les associations d'aphasiques et les groupes de parole."
        ]},
        { t: "h2", x: "Penser à soi", aValider: true },
        { t: "p", x: "L'aidant a droit au répit : s'isoler à deux n'aide personne. Les dispositifs de répit et les associations sont là pour vous aussi." }
      ]
    },
    {
      id: "c6", slug: "telephone", titre: "Fonctionnalités du téléphone utiles",
      accroche: "Notes vocales, clavier prédictif, appels vidéo…",
      aValider: true,
      blocs: [
        { t: "h2", x: "Notes vocales" },
        { t: "p", x: "Permet à la personne aphasique d'enregistrer des phrases à l'avance pour les faire écouter aux commerçants ou aux chauffeurs de taxi." },
        { t: "h2", x: "Correcteur orthographique et clavier prédictif" },
        { t: "p", x: "Facilite l'écriture de messages lorsque la parole est difficile." },
        { t: "h2", x: "Appels FaceTime ou WhatsApp" },
        { t: "p", x: "Facilite les échanges au téléphone car la caméra permet de se voir : lecture des gestes et des mimiques." },
        { t: "h2", x: "Autres pistes", aValider: true },
        { t: "list", items: [
          "Applications de pictogrammes (par exemple GONG).",
          "Les photos du téléphone comme support de conversation.",
          "Agrandissement du texte dans les réglages du téléphone."
        ]}
      ]
    }
  ],

  // ── OUTILS (bleu clair) ────────────────────────────────────────────────────
  temoignage: {
    titre: "Témoignage",
    nom: "Yolande — aidante depuis 20 ans",
    desc: "Yolande raconte son quotidien depuis l'AVC de son mari.",
    duree: "≈ 10 min",
    dispo: false
  },

  outils: [
    {
      id: "o1", slug: "oui-non", titre: "Planche OUI / NON", sous: "Pour une réponse claire",
      desc: "Cet outil permet à la personne aphasique de répondre facilement à des questions fermées en pointant OUI ou NON. Toujours à portée de main, il favorise la communication au quotidien.",
      mode: "Le téléphone devient l'outil : tendez-le à votre proche, il appuie sur OUI ou NON. Le mot choisi est prononcé à voix haute."
    },
    {
      id: "o2", slug: "echelle", titre: "Échelle de bien-être", sous: "Exprimer son humeur",
      desc: "Un outil visuel et non verbal pour que la personne aphasique exprime son humeur, son état émotionnel ou son confort.",
      mode: "Votre proche touche le visage qui correspond à ce qu'il ressent. Le ressenti est affiché en grand et prononcé."
    },
    {
      id: "o3", slug: "schema-corps", titre: "Schéma du corps", sous: "Indiquer une douleur ou un problème",
      desc: "Grâce aux schémas du corps (masculin, féminin, de dos), la personne aphasique peut pointer l'endroit où elle ressent une douleur ou un inconfort, facilitant la communication avec l'aidant ou un professionnel de santé.",
      mode: "Votre proche touche la zone du corps concernée : elle est mise en évidence et son nom est prononcé."
    },
    {
      id: "o4", slug: "tla", titre: "Tableau de Langage Assisté", sous: "Communiquer autrement",
      desc: "Un support visuel qui permet à l'aidant et à la personne aphasique de pointer des éléments pour mieux se comprendre. Ici, un exemple pour le repas, adaptable à d'autres situations du quotidien.",
      mode: "Pointez les cases à deux pendant le repas. Chaque case touchée est prononcée à voix haute."
    },
    {
      id: "o5", slug: "carte", titre: "Carte « Je suis aphasique »", sous: "Rendre l'invisible visible",
      desc: "Cette carte permet à la personne aphasique de montrer rapidement son handicap invisible aux inconnus. Un moyen simple d'obtenir de l'aide et de la bienveillance dans les interactions sociales.",
      mode: "Personnalisez la carte puis montrez-la en plein écran, ou imprimez-la au format carte bancaire."
    },
    {
      id: "o6", slug: "arbre", titre: "Arbre généalogique", sous: "Se repérer dans son entourage",
      desc: "Remplissez cet arbre généalogique avec des prénoms pour faciliter les discussions sur la famille et les proches. Un support visuel pour aider à se souvenir et à échanger.",
      mode: "Ajoutez les proches niveau par niveau. Vos données restent uniquement sur cet appareil : rien n'est envoyé sur Internet."
    },
    {
      id: "o7", slug: "phrases", titre: "Mes phrases", sous: "Les phrases du quotidien, à faire parler",
      desc: "Créez la liste des phrases que votre proche utilise le plus souvent : « J'ai soif », « Je suis fatigué »… D'une simple pression, le téléphone prononce la phrase à voix haute. Un outil qui s'adapte à votre quotidien à vous.",
      mode: "Ajoutez ou retirez des phrases avec le bouton Modifier. Votre proche touche une phrase : elle est prononcée à voix haute. Les phrases restent enregistrées sur cet appareil."
    },
    {
      id: "o8", slug: "parle", titre: "Parle pour moi", sous: "Écrire une phrase, la faire prononcer",
      desc: "Écrivez n'importe quelle phrase et le téléphone la prononce à voix haute. Pratique chez le médecin, au guichet ou au téléphone, quand les mots ne sortent pas. Les dernières phrases restent disponibles pour les redire en un geste.",
      mode: "Tapez votre phrase dans le grand champ, puis appuyez sur « Prononcer ». Touchez une phrase récente pour la faire redire."
    }
  ],

  carteTexte: {
    titre: "JE SUIS APHASIQUE",
    lignes: [
      "J'ai des difficultés de langage.",
      "L'aphasie peut affecter ma capacité à : parler, comprendre, lire, écrire.",
      "Cela n'affecte ni mon intelligence, ni mon audition.",
      "Parlez lentement et utilisez des phrases courtes.",
      "Merci de votre patience."
    ]
  },

  tla: [
    { mot: "Quoi, qu'est-ce que ?", emoji: "❓", dire: "Quoi, qu'est-ce que ?" },
    { mot: "ne… pas / plus",         emoji: "🚫", dire: "Ne pas, ne plus" },
    { mot: "Est-ce que c'est prêt ?", emoji: "⏰", dire: "Est-ce que c'est prêt ?" },
    { mot: "vouloir",                  emoji: "🤲", dire: "Vouloir" },
    { mot: "Je, moi, le mien",         emoji: "👤", dire: "Je, moi, le mien" },
    { mot: "manger",                   emoji: "🍽️", dire: "Manger" }
  ],

  echelle: [
    { id: 1, label: "Très mal",  dire: "Je me sens très mal",  couleur: "#C0392B" },
    { id: 2, label: "Mal",       dire: "Je me sens mal",       couleur: "#E0662A" },
    { id: 3, label: "Moyen",     dire: "Je me sens moyen",     couleur: "#D9A322" },
    { id: 4, label: "Bien",      dire: "Je me sens bien",      couleur: "#6FA34B" },
    { id: 5, label: "Très bien", dire: "Je me sens très bien", couleur: "#2E8540" }
  ],

  corpsZones: [
    { id: "tete",     shape: "circle",  attrs: { cx: 100, cy: 34, r: 24 },                       face: "la tête",         dos: "la tête" },
    { id: "gorge",    shape: "rect",    attrs: { x: 90, y: 58, width: 20, height: 14, rx: 6 },   face: "la gorge",        dos: "la nuque" },
    { id: "epauleG",  shape: "circle",  attrs: { cx: 62, cy: 86, r: 13 },                        face: "l'épaule droite", dos: "l'épaule gauche" },
    { id: "epauleD",  shape: "circle",  attrs: { cx: 138, cy: 86, r: 13 },                       face: "l'épaule gauche", dos: "l'épaule droite" },
    { id: "poitrine", shape: "rect",    attrs: { x: 72, y: 76, width: 56, height: 46, rx: 12 },  face: "la poitrine",     dos: "le haut du dos" },
    { id: "brasG",    shape: "rect",    attrs: { x: 42, y: 96, width: 16, height: 66, rx: 8 },   face: "le bras droit",   dos: "le bras gauche" },
    { id: "brasD",    shape: "rect",    attrs: { x: 142, y: 96, width: 16, height: 66, rx: 8 },  face: "le bras gauche",  dos: "le bras droit" },
    { id: "ventre",   shape: "rect",    attrs: { x: 74, y: 124, width: 52, height: 40, rx: 12 }, face: "le ventre",       dos: "le bas du dos" },
    { id: "mainG",    shape: "circle",  attrs: { cx: 50, cy: 176, r: 11 },                       face: "la main droite",  dos: "la main gauche" },
    { id: "mainD",    shape: "circle",  attrs: { cx: 150, cy: 176, r: 11 },                      face: "la main gauche",  dos: "la main droite" },
    { id: "hanche",   shape: "rect",    attrs: { x: 76, y: 166, width: 48, height: 24, rx: 10 }, face: "la hanche",       dos: "les fesses" },
    { id: "jambeG",   shape: "rect",    attrs: { x: 78, y: 192, width: 19, height: 84, rx: 9 },  face: "la jambe droite", dos: "la jambe gauche" },
    { id: "jambeD",   shape: "rect",    attrs: { x: 103, y: 192, width: 19, height: 84, rx: 9 }, face: "la jambe gauche", dos: "la jambe droite" },
    { id: "genouG",   shape: "circle",  attrs: { cx: 87, cy: 242, r: 9 },                        face: "le genou droit",  dos: "le genou gauche" },
    { id: "genouD",   shape: "circle",  attrs: { cx: 113, cy: 242, r: 9 },                       face: "le genou gauche", dos: "le genou droit" },
    { id: "piedG",    shape: "ellipse", attrs: { cx: 84, cy: 290, rx: 14, ry: 9 },               face: "le pied droit",   dos: "le pied gauche" },
    { id: "piedD",    shape: "ellipse", attrs: { cx: 116, cy: 290, rx: 14, ry: 9 },              face: "le pied gauche",  dos: "le pied droit" }
  ],

  // ── MIEUX COMPRENDRE (bleu foncé) ────────────────────────────────────────
  comprendre: [
    {
      id: "m1", slug: "definitions", titre: "Définitions",
      accroche: "Les mots de l'aphasie, expliqués simplement, de A à Z.",
      special: "definitions", aValider: false, blocs: []
    },
    {
      id: "m2", slug: "comprendre-aphasie", titre: "Comprendre l'aphasie",
      accroche: "Ce que l'aphasie change — et ce qu'elle ne change pas.",
      aValider: true,
      blocs: [
        { t: "p", x: "L'aphasie est causée par une lésion cérébrale, souvent située dans l'hémisphère gauche du cerveau, qui affecte les zones du langage. Elle peut impacter la compréhension et/ou l'expression, orale et/ou écrite. Elle ne touche ni l'intelligence ni l'audition." },
        { t: "h2", x: "La compréhension" },
        { t: "p", x: "Lorsque les régions impliquées dans la compréhension (comme l'aire de Wernicke) sont touchées, la personne peut :" },
        { t: "list", items: [
          "Avoir du mal à comprendre les phrases longues ou complexes.",
          "Ne pas saisir le sens de certains mots ou expressions.",
          "Rencontrer des difficultés à suivre une conversation, surtout en cas de bruit ou de rapidité."
        ]},
        { t: "h2", x: "L'expression", aValider: true },
        { t: "p", x: "Lorsque les régions de l'expression (comme l'aire de Broca) sont touchées :" },
        { t: "list", items: [
          "Manque du mot.",
          "Phrases courtes ou agrammatiques.",
          "Mots déformés ou remplacés (paraphasies).",
          "Parfois, répétition involontaire d'un même mot."
        ]},
        { t: "h2", x: "Les troubles associés", aValider: true },
        { t: "list", items: [
          "Difficultés de lecture et d'écriture.",
          "Fatigue importante.",
          "Troubles de l'attention.",
          "Hémiplégie droite fréquente.",
          "Labilité émotionnelle (émotions à fleur de peau)."
        ]},
        { t: "enc", x: "Il existe autant d'aphasies que de personnes aphasiques : chaque profil est unique." }
      ]
    },
    {
      id: "m3", slug: "reeducation", titre: "Rééducation et évolution",
      accroche: "Pourquoi une rééducation, et comment l'aphasie évolue.",
      aValider: true,
      blocs: [
        { t: "h2", x: "Pourquoi une rééducation ?" },
        { t: "p", x: "Après un AVC ou une lésion cérébrale, le cerveau peut récupérer en partie grâce à la neuroplasticité, c'est-à-dire sa capacité à réorganiser ses connexions. Cependant, cette récupération ne se fait pas seule : elle nécessite des stimulations adaptées." },
        { t: "p", x: "Plusieurs professionnels interviennent selon les troubles associés : orthophoniste, kinésithérapeute, ergothérapeute, neuropsychologue, etc." },
        { t: "h2", x: "Facteurs évolutifs" },
        { t: "p", x: "L'évolution est très variable selon plusieurs facteurs :" },
        { t: "list", items: [
          "La taille et la localisation de la lésion : une atteinte plus étendue entraîne souvent une récupération plus longue.",
          "La précocité et l'intensité de la rééducation.",
          "L'âge et l'état de santé général.",
          "L'entourage et la stimulation au quotidien.",
          "La motivation."
        ]},
        { t: "h2", x: "Les grandes étapes", aValider: true },
        { t: "list", items: [
          "Phase aiguë (premières semaines) : une récupération spontanée est possible.",
          "Phase subaiguë : les progrès les plus visibles, rééducation intensive.",
          "Phase chronique : des progrès restent toujours possibles, plus lents."
        ]},
        { t: "enc", x: "Il n'y a pas de date limite à la récupération." }
      ]
    },
    {
      id: "m4", slug: "acteurs", titre: "Les acteurs du parcours de soin",
      accroche: "Qui fait quoi autour de votre proche.",
      aValider: true,
      blocs: [
        { t: "h2", x: "Orthophoniste", aValider: true },
        { t: "p", x: "Pilier de la rééducation du langage et de la communication. L'orthophoniste évalue les troubles, rééduque la parole, la compréhension, la lecture et l'écriture, et accompagne la famille dans la mise en place d'outils de communication." },
        { t: "h2", x: "APA (Activité Physique Adaptée)" },
        { t: "p", x: "Propose des exercices physiques personnalisés pour améliorer la condition physique et prévenir les complications." },
        { t: "h2", x: "Assistante sociale" },
        { t: "p", x: "Oriente le patient et sa famille vers les ressources sociales et les aides financières disponibles." },
        { t: "h2", x: "Ergothérapeute" },
        { t: "p", x: "Accompagne la personne pour améliorer son autonomie dans les gestes de la vie quotidienne (habillage, alimentation, hygiène) et met en place des systèmes adaptés." },
        { t: "h2", x: "Infirmier(e)s / aides-soignant(e)s" },
        { t: "p", x: "Assurent les soins quotidiens et la surveillance de la santé." },
        { t: "h2", x: "Médecin traitant", aValider: true },
        { t: "p", x: "Coordonne le parcours de soin, renouvelle les prescriptions et oriente vers les spécialistes." },
        { t: "h2", x: "Neurologue", aValider: true },
        { t: "p", x: "Médecin spécialiste du cerveau et du système nerveux : il suit l'évolution après l'AVC." },
        { t: "h2", x: "Médecin MPR", aValider: true },
        { t: "p", x: "Médecin de Médecine Physique et de Réadaptation : il coordonne la rééducation, souvent en centre spécialisé." },
        { t: "h2", x: "Kinésithérapeute", aValider: true },
        { t: "p", x: "Rééduque les capacités motrices : marche, équilibre, mobilité du côté atteint." },
        { t: "h2", x: "Neuropsychologue", aValider: true },
        { t: "p", x: "Évalue et rééduque la mémoire, l'attention et les fonctions cognitives." },
        { t: "h2", x: "Psychologue", aValider: true },
        { t: "p", x: "Soutient le patient… et l'aidant. Consulter pour soi n'est pas un luxe : c'est une ressource." }
      ]
    },
    {
      id: "m5", slug: "stereotypes", titre: "Les stéréotypes",
      accroche: "Vrai ou faux ? Démêlons les idées reçues sur l'aphasie.",
      special: "stereotypes", aValider: true, blocs: []
    }
  ],

  definitions: [
    { terme: "Agnosie",           def: "Difficulté à reconnaître des objets, des sons ou des visages, alors que la vue et l'audition sont intactes.",                                                        aValider: false },
    { terme: "Aidant",            def: "Personne (proche, famille, ami) qui accompagne au quotidien une personne en situation de handicap ou de maladie.",                                                   aValider: false },
    { terme: "Anomie",            def: "Difficulté à retrouver ses mots : le « mot sur le bout de la langue » permanent. Très fréquente dans l'aphasie.",                                                   aValider: true },
    { terme: "Aphasie",           def: "Trouble du langage causé par une lésion cérébrale (souvent après un AVC), qui peut affecter la parole, la compréhension, la lecture et l'écriture.",               aValider: false },
    { terme: "Apraxie",           def: "Trouble neurologique qui empêche de réaliser certains gestes volontaires, même si les muscles fonctionnent bien.",                                                  aValider: false },
    { terme: "AVC",               def: "Accident Vasculaire Cérébral : interruption brutale de la circulation du sang dans le cerveau, qui prive certaines zones d'oxygène.",                              aValider: true },
    { terme: "AVC hémorragique",  def: "AVC causé par la rupture d'un vaisseau sanguin, qui provoque un saignement dans le cerveau.",                                                                        aValider: true },
    { terme: "AVC ischémique",    def: "AVC causé par un caillot qui bouche une artère du cerveau. C'est la forme la plus fréquente.",                                                                       aValider: true },
    { terme: "Dysarthrie",        def: "Difficulté à articuler, liée à un trouble du contrôle des muscles de la parole.",                                                                                    aValider: true },
    { terme: "Hémianopsie",       def: "Perte de la moitié du champ visuel de chaque œil, fréquente après un AVC.",                                                                                         aValider: true },
    { terme: "Hémiplégie",        def: "Paralysie d'un côté du corps. En cas d'aphasie, elle touche souvent le côté droit.",                                                                                aValider: true },
    { terme: "Jargon",            def: "Discours fluide mais difficile à comprendre, fait de mots déformés ou inventés.",                                                                                    aValider: true },
    { terme: "Néologisme",        def: "Mot inventé, produit involontairement par la personne aphasique.",                                                                                                   aValider: true },
    { terme: "Neuropsychologue",  def: "Psychologue spécialisé dans les liens entre le cerveau et le comportement : mémoire, attention, raisonnement.",                                                     aValider: true },
    { terme: "Orthophoniste",     def: "Professionnel(le) de santé spécialiste de la rééducation du langage et de la communication.",                                                                        aValider: true },
    { terme: "Paraphasie",        def: "Production d'un mot à la place d'un autre (« fourchette » pour « couteau ») ou d'un mot déformé.",                                                                  aValider: true },
    { terme: "Persévération",     def: "Répétition involontaire d'un même mot ou d'une même réponse.",                                                                                                       aValider: true },
    { terme: "Plasticité cérébrale", def: "Capacité du cerveau à réorganiser ses connexions pour récupérer après une lésion.",                                                                              aValider: true },
    { terme: "Stéréotypie",       def: "Production automatique et répétée d'un même mot ou d'une même expression.",                                                                                          aValider: true },
    { terme: "TLA",               def: "Tableau de Langage Assisté : support visuel à pointer pour communiquer (voir la section Outils).",                                                                   aValider: true }
  ],

  stereotypes: [
    { idee: "Une personne aphasique est sourde.",                  expl: "L'aphasie touche le langage, pas l'audition. Elle entend parfaitement bien.",                                                     aValider: false },
    { idee: "Il faut parler à sa place et finir ses phrases.",    expl: "Il est essentiel de lui laisser le temps de s'exprimer et de ne pas la priver de sa voix.",                                        aValider: false },
    { idee: "L'aphasie rend moins intelligent.",                   expl: "L'aphasie n'affecte pas l'intelligence : la personne pense, raisonne et ressent comme avant.",                                    aValider: true },
    { idee: "Après un an, plus aucun progrès n'est possible.",    expl: "Des progrès restent possibles pendant des années. Il n'y a pas de date limite à la récupération.",                                aValider: true },
    { idee: "Une personne aphasique ne comprend rien.",            expl: "La compréhension est souvent meilleure que l'expression. Parlez-lui normalement, avec des phrases simples.",                       aValider: true },
    { idee: "Crier permet de mieux se faire comprendre.",          expl: "Inutile de parler fort : elle n'est pas sourde. Parlez plus lentement, pas plus fort.",                                            aValider: true }
  ],

  // ── AIDES ET CONTACTS (bleu pétrole) ─────────────────────────────────────
  aides: [
    {
      id: "a0", slug: "demarches", titre: "Mes démarches, étape par étape",
      accroche: "La liste à cocher des démarches : ALD, MDPH, APA… Suivez votre progression.",
      aValider: true,
      blocs: []
    },
    {
      id: "a1", slug: "informations-sociales", titre: "Informations sociales et accompagnement",
      accroche: "Droits, aides financières et dispositifs de soutien.",
      aValider: true,
      blocs: [
        { t: "h2", x: "Droits et aides financières" },
        { t: "p", x: "Indemnités journalières — pour les salariés et les demandeurs d'emploi, pendant l'arrêt de travail. S'adresser à la CPAM." },
        { t: "p", x: "Pension d'invalidité — pour les personnes dont la capacité de travail est réduite d'au moins deux tiers. S'adresser à la CPAM." },
        { t: "p", x: "AAH (Allocation Adulte Handicapé) — revenu minimum pour les personnes en situation de handicap. S'adresser à la MDPH, versée par la CAF." },
        { t: "p", aValider: true, x: "APA (Allocation Personnalisée d'Autonomie) — pour les personnes de 60 ans et plus en perte d'autonomie. S'adresser au conseil départemental." },
        { t: "p", aValider: true, x: "PCH (Prestation de Compensation du Handicap) — finance les aides humaines et techniques. S'adresser à la MDPH." },
        { t: "p", aValider: true, x: "Congé de proche aidant et AJPA — permet de réduire ou cesser son activité pour accompagner un proche, avec une allocation journalière. S'adresser à la CAF." },
        { t: "p", aValider: true, x: "Carte mobilité inclusion — facilite les déplacements et le stationnement. S'adresser à la MDPH." },
        { t: "h2", x: "Dispositifs de soutien", aValider: true },
        { t: "list", items: [
          "MDPH : la porte d'entrée de la plupart des démarches liées au handicap.",
          "Accueils de jour : pour souffler quelques heures ou une journée.",
          "Droit au répit : des solutions de relais existent pour l'aidant.",
          "France services : un accompagnement de proximité pour les démarches administratives."
        ]}
      ]
    },
    {
      id: "a2", slug: "associations", titre: "Associations et réseaux de soutien",
      accroche: "Vous n'êtes pas seul(e) : associations et numéros utiles.",
      aValider: true,
      blocs: [
        { t: "urgence", x: "114 — numéro d'urgence par SMS et visio, pour les personnes ne pouvant pas parler ou entendre. Votre proche peut alerter les secours seul, sans parler.", num: "114" },
        { t: "h2", x: "Associations" },
        { t: "web", label: "France AVC", url: "https://www.franceavc.com/", x: "Information et soutien aux victimes d'AVC et à leurs familles." },
        { t: "web", label: "Fédération Nationale des Aphasiques de France (FNAF)", url: "https://aphasie.fr/", x: "L'association nationale des personnes aphasiques." },
        { t: "web", label: "Trouver l'association la plus proche de chez vous", url: "https://aphasie.fr/les-associations/sites-des-associations/", x: "L'annuaire des associations locales de la FNAF." },
        { t: "h2", x: "Numéros utiles" },
        { t: "tel", num: "114", label: "114 — Urgences par SMS / visio", x: "Pour les personnes ne pouvant pas parler ou entendre." },
        { t: "tel", num: "15", label: "15 — SAMU", x: "Urgences médicales." },
        { t: "tel", num: "112", label: "112 — Urgences européennes", x: "Depuis un mobile, partout en Europe." },
        { t: "tel", num: "0800360360", label: "0 800 360 360 — Communauté 360", x: "Appui pour les personnes en situation de handicap et leurs aidants.", aValider: true }
      ]
    },
    {
      id: "a3", slug: "supports", titre: "Supports d'informations",
      accroche: "Sites et documents fiables pour aller plus loin.",
      aValider: true,
      blocs: [
        { t: "h2", x: "Sites internet" },
        { t: "web", label: "France AVC", url: "https://www.franceavc.com/", x: "Information sur l'AVC et ses suites." },
        { t: "web", label: "FNAF — aphasie.fr", url: "https://aphasie.fr/", x: "Ressources sur l'aphasie, par et pour les personnes concernées." },
        { t: "web", label: "Association Internationale Aphasie", url: "https://www.aphasia-international.com/", x: "Ressources internationales sur l'aphasie." },
        { t: "web", label: "FNO — fno.fr", url: "https://fno.fr/", x: "Modules à destination des aidants : « Module de sensibilisation », « Mieux communiquer », « Mieux vivre »." },
        { t: "web", label: "Assurance Maladie — PRADO", url: "https://www.ameli.fr/", x: "Le service de retour à domicile après hospitalisation." },
        { t: "h2", x: "Documents", aValider: true },
        { t: "list", items: [
          "Brochure FNAF : « Qu'est-ce que l'aphasie ? » (lien à vérifier à l'intégration).",
          "Brochure FNAF : « L'aphasie, vous connaissez ? » (lien à vérifier à l'intégration)."
        ]}
      ]
    }
  ],

  rdvTypes: ["Orthophoniste", "Médecin", "Kinésithérapeute", "Ergothérapeute", "Neuropsychologue", "Autre"],

  liensParente: ["Conjoint(e)", "Père", "Mère", "Frère", "Sœur", "Fils", "Fille", "Petit-fils", "Petite-fille", "Grand-père", "Grand-mère", "Ami(e)", "Autre"]
};

export default CONTENT;
