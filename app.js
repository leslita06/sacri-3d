const CATALOGUE = 'https://leslita06.github.io/sacri-catalogue/';
const $ = (s) => document.querySelector(s);

/* ---------- Fiches des pièces d'usure de la tronçonneuse ---------- */
const PARTS = {
  chaine: {
    name: 'Chaîne', devis: 'une chaîne de tronçonneuse',
    pos: '-0.2616m 0.0972m 0.3631m', normal: '-0.87m -0.03m -0.49m',
    role: "Ce sont ses gouges qui coupent le bois. Entraînée par le pignon, elle tourne autour du guide-chaîne.",
    when: [
      "À affûter dès que la machine fait de la sciure fine au lieu de copeaux, ou qu'il faut forcer pour couper.",
      "À remplacer quand les gouges arrivent au repère d'usure, ou après un choc contre une pierre, un clou ou le sol.",
      "Une chaîne neuve se monte avec un pignon en bon état."
    ]
  },
  guide: {
    name: 'Guide-chaîne', devis: 'un guide-chaîne',
    pos: '-0.2004m 0.0825m 0.2544m', normal: '-0.87m 0.05m -0.49m',
    role: "La lame qui soutient et guide la chaîne pendant la coupe, et qui lui amène l'huile de graissage.",
    when: [
      "À retourner à chaque changement de chaîne, pour qu'il s'use des deux côtés.",
      "À remplacer quand la rainure n'est plus assez profonde, que les rails sont ouverts ou ébréchés, ou que le guide est tordu."
    ]
  },
  pignon: {
    name: 'Pignon', devis: 'un pignon de chaîne',
    pos: '-0.0543m 0.0840m -0.0430m', normal: '-0.95m -0.03m -0.30m',
    role: "La roue dentée, cachée sous le carter, qui transmet la force du moteur à la chaîne.",
    when: [
      "Repère courant : un pignon pour deux chaînes.",
      "À changer dès que les dents sont creusées par la chaîne : un pignon usé abîme vite une chaîne neuve."
    ]
  },
  filtre: {
    name: 'Filtre à air', devis: 'un filtre à air de tronçonneuse',
    pos: '0.1410m 0.2705m -0.0538m', normal: '0.04m 1m 0.02m',
    role: "Placé sous le capot, il empêche la poussière et la sciure d'entrer dans le moteur.",
    when: [
      "À nettoyer souvent, chaque jour sur un chantier poussiéreux.",
      "À remplacer s'il est déchiré, déformé, ou trop encrassé pour être nettoyé.",
      "Signe à surveiller : le moteur perd de la puissance ou fume."
    ]
  },
  bougie: {
    name: 'Bougie', devis: "une bougie d'allumage",
    pos: '0.1828m 0.2889m -0.1512m', normal: '0.21m 0.94m -0.27m',
    role: "Elle produit l'étincelle qui allume le mélange dans le moteur.",
    when: [
      "À contrôler si la machine démarre mal ou tourne de façon irrégulière.",
      "À remplacer si les électrodes sont usées ou encrassées. Repère courant : environ toutes les 100 heures de travail."
    ]
  },
  lanceur: {
    name: 'Lanceur', devis: 'un lanceur ou une corde de lanceur',
    pos: '0.2120m 0.2015m 0.0262m', normal: '0.84m 0.16m 0.51m',
    role: "Le mécanisme à corde et poignée qui fait tourner le moteur pour le démarrer.",
    when: [
      "Changer la corde dès qu'elle s'effiloche, avant qu'elle ne casse.",
      "Faire réviser le lanceur si la corde ne se rembobine plus ou si le démarrage accroche."
    ]
  }
};
const ORDER = ['chaine', 'guide', 'pignon', 'filtre', 'bougie', 'lanceur'];

/* ---------- Les machines ---------- */
const OBJECTS = {
  tronconneuse: {
    label: 'Tronçonneuse', alt: 'Tronçonneuse thermique orange et grise en 3D',
    title: 'La tronçonneuse, <em>pièce par pièce</em>',
    sub: "Touchez une pièce d'usure pour savoir à quoi elle sert et quand la changer.",
    orbit: '300deg 75deg auto', parts: true,
    credit: '« Motorsäge Stihl » par fhernand, licence CC BY 4.0 (Sketchfab), modèle nettoyé (support retiré).',
    creditUrl: 'https://sketchfab.com/3d-models/motorsage-stihl-61f9e45afac84e4da5f41f792f920efc'
  },
  souffleur: {
    label: 'Souffleur', alt: 'Souffleur thermique blanc et orange en 3D',
    title: 'Le souffleur, <em>en main</em>',
    sub: "Faites-le tourner, puis posez-le chez vous à taille réelle.",
    orbit: '120deg 72deg auto', parts: false,
    sheet: {
      eyebrow: 'Espaces verts', name: 'Souffleur thermique', devis: 'un souffleur thermique',
      role: "Il chasse les feuilles, l'herbe coupée et la poussière des allées, des cours et des parkings.",
      whenT: "Bien l'entretenir",
      when: [
        "Nettoyer le filtre à air et la grille d'aspiration régulièrement.",
        "Contrôler la bougie si le démarrage devient difficile.",
        "Faire réviser la machine par l'atelier SACRI en début de saison."
      ]
    },
    credit: "modèle produit à partir de la photo « Moscow, Stihl BG 86 leaf blower » de Retired electrician, domaine public CC0 (Wikimedia Commons).",
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Moscow,_Stihl_BG_86_leaf_blower,_Oct_2026_02.jpg'
  },
  roulement: {
    label: 'Roulement', alt: 'Roulement à billes en acier en 3D',
    title: 'Le roulement à billes, <em>en détail</em>',
    sub: 'Approchez-vous : flasques, bagues, finition acier.',
    orbit: '35deg 70deg auto', parts: false,
    sheet: {
      eyebrow: 'Transmission', name: 'Roulement à billes', devis: 'un roulement à billes',
      role: "Il permet à un arbre de tourner en limitant les frottements. On le trouve dans les moteurs, les pompes, les machines agricoles et les véhicules.",
      whenT: 'Quand le changer',
      when: [
        "Bruit de grondement ou de grincement, jeu anormal, échauffement.",
        "Pour le remplacer, il faut sa référence (gravée sur la bague) ou ses dimensions : alésage, diamètre extérieur, largeur."
      ]
    },
    credit: '« Bearing 608z, 608zz » par YouniqueĪdeaStudio, licence CC BY 4.0 (Sketchfab).',
    creditUrl: 'https://sketchfab.com/3d-models/bearing-608z-608zz-4ecd4d5cfffa4cba9d842cb7d7b5d3cf'
  },
  moteur: {
    label: 'Moteur électrique', alt: 'Moteur électrique industriel en 3D',
    title: 'Le moteur électrique, <em>sous tous les angles</em>',
    sub: 'Carcasse à ailettes, boîte à bornes, pattes de fixation.',
    orbit: '35deg 70deg auto', parts: false,
    sheet: {
      eyebrow: 'Industrie', name: 'Moteur électrique', devis: 'un moteur électrique',
      role: "Il entraîne pompes, compresseurs, convoyeurs et machines d'atelier.",
      whenT: 'Pour un devis juste',
      when: [
        "Relevez la plaque signalétique : puissance, tension, vitesse, forme de fixation.",
        "Signes à surveiller : échauffement, vibrations, bruit des roulements."
      ]
    },
    credit: '« Electric Motor » par Scarecrow_original, licence CC BY 4.0 (Sketchfab).',
    creditUrl: 'https://sketchfab.com/3d-models/electric-motor-66b2ea9eb6e5468d91d814395036a537'
  }
};
const OBJ_ORDER = ['tronconneuse', 'souffleur', 'roulement', 'moteur'];

/* ---------- Interface ---------- */
const mv = $('#mv'), chips = $('#chips'), sheet = $('#sheet'), picker = $('#picker');
let currentObj = 'tronconneuse', devisLabel = null;

OBJ_ORDER.forEach((k) => {
  const b = document.createElement('button');
  b.className = 'pick'; b.dataset.obj = k; b.textContent = OBJECTS[k].label;
  b.addEventListener('click', () => loadObject(k));
  picker.appendChild(b);
});
ORDER.forEach((k, i) => {
  const b = document.createElement('button');
  b.className = 'chip'; b.dataset.part = k;
  b.innerHTML = `<i>${i + 1}</i>${PARTS[k].name}`;
  b.addEventListener('click', () => select(k, true));
  chips.appendChild(b);
});

function makeHotspots() {
  mv.querySelectorAll('.hotspot').forEach((h) => h.remove());
  if (!OBJECTS[currentObj].parts) return;
  ORDER.forEach((k, i) => {
    const h = document.createElement('button');
    h.className = 'hotspot'; h.slot = `hotspot-${k}`;
    h.dataset.position = PARTS[k].pos; h.dataset.normal = PARTS[k].normal;
    h.dataset.visibilityAttribute = 'visible';
    h.innerHTML = `<i>${i + 1}</i><span>${PARTS[k].name}</span>`;
    h.setAttribute('aria-label', PARTS[k].name);
    h.addEventListener('click', () => select(k, true));
    mv.appendChild(h);
  });
}

function showSheet({ eyebrow, name, role, whenT, when }) {
  $('#f-eyebrow').textContent = eyebrow;
  $('#f-name').textContent = name;
  $('#f-role').textContent = role;
  $('#f-when-t').textContent = whenT;
  $('#f-when').innerHTML = when.map((w) => `<li>${w}</li>`).join('');
  $('#f-cat').href = CATALOGUE;
  sheet.hidden = false; sheet.scrollTop = 0;
}

function select(k, focus) {
  document.querySelectorAll('.chip').forEach((c) => c.classList.toggle('on', c.dataset.part === k));
  mv.querySelectorAll('.hotspot').forEach((h) => h.classList.toggle('on', h.slot === `hotspot-${k}`));
  if (!k) { sheet.hidden = true; return; }
  const p = PARTS[k];
  devisLabel = p.devis;
  showSheet({ eyebrow: "Pièce d'usure", name: p.name, role: p.role, whenT: 'Quand la changer', when: p.when });
  if (focus) {
    mv.cameraTarget = p.pos;
    const o = mv.getCameraOrbit();
    mv.cameraOrbit = `${o.theta}rad ${o.phi}rad 70%`;
  }
}

function loadObject(k) {
  currentObj = k;
  const o = OBJECTS[k];
  document.querySelectorAll('.pick').forEach((b) => b.classList.toggle('on', b.dataset.obj === k));
  $('#h-title').innerHTML = o.title; $('#h-sub').textContent = o.sub;
  mv.alt = o.alt;
  mv.src = `assets/models/${k}.glb?v=2`;
  mv.iosSrc = `assets/models/${k}.usdz?v=2`;
  mv.cameraOrbit = o.orbit; mv.cameraTarget = 'auto auto auto';
  chips.hidden = !o.parts;
  makeHotspots();
  if (o.parts) { select(null); devisLabel = null; }
  else { devisLabel = o.sheet.devis; showSheet(o.sheet); }
  $('#credits').innerHTML = `Modèle 3D : <a href="${o.creditUrl}" target="_blank" rel="noopener">${o.credit}</a> Affichage : model-viewer (licence Apache 2.0).`;
  const u = new URL(location); u.searchParams.set('objet', k); u.searchParams.delete('piece'); history.replaceState(null, '', u);
}

$('#close').addEventListener('click', () => (OBJECTS[currentObj].parts ? select(null) : (sheet.hidden = true)));
$('#reset').addEventListener('click', () => {
  mv.cameraTarget = 'auto auto auto'; mv.cameraOrbit = OBJECTS[currentObj].orbit;
});
$('#f-devis').addEventListener('click', () => {
  $('#m-msg').textContent = `Bonjour SACRI,\nJe souhaite un devis pour ${devisLabel || 'une pièce de tronçonneuse'}.\nModèle de ma machine : …\nMerci de me recontacter.`;
  $('#modal').hidden = false;
});
$('#m-close').addEventListener('click', () => ($('#modal').hidden = true));
$('#modal').addEventListener('click', (e) => { if (e.target.id === 'modal') $('#modal').hidden = true; });
$('#ar-help').addEventListener('click', () => ($('#armodal').hidden = false));
$('#a-close').addEventListener('click', () => ($('#armodal').hidden = true));
$('#armodal').addEventListener('click', (e) => { if (e.target.id === 'armodal') $('#armodal').hidden = true; });

mv.addEventListener('progress', (e) => { $('#bar').style.width = `${Math.round(e.detail.totalProgress * 100)}%`; });
mv.addEventListener('load', () => { document.body.dataset.loaded = currentObj; });
mv.addEventListener('ar-status', (e) => { if (e.detail.status === 'failed') $('#armodal').hidden = false; });
mv.addEventListener('camera-change', (e) => { if (e.detail.source === 'user-interaction') $('#hint').classList.add('off'); });
// Sans réalité augmentée possible (ordinateur), le bouton « Voir chez moi » ouvre une aide.
customElements.whenDefined('model-viewer').then(() => {
  setTimeout(() => { if (!mv.canActivateAR) document.body.classList.add('no-ar'); }, 1500);
});

const q = new URLSearchParams(location.search);
loadObject(OBJECTS[q.get('objet')] ? q.get('objet') : 'tronconneuse');
if (q.get('piece') && PARTS[q.get('piece')] && currentObj === 'tronconneuse') select(q.get('piece'), false);
