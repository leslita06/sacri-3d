const CATALOGUE = 'https://leslita06.github.io/sacri-catalogue/';
const V = 20261119;
const isPhone = () => window.matchMedia('(max-width:820px)').matches;
const $ = (s) => document.querySelector(s);

/* ---------- Fiches des pièces d'usure de la tronçonneuse ---------- */
const PARTS = {
  chaine: {
    view: '300deg 78deg',
    name: 'Chaîne', devis: 'une chaîne de tronçonneuse',
    pos: '-0.1061m 0.1566m 0.3627m', normal: '-0.97m 0.12m 0.22m',
    role: "Ce sont ses gouges qui coupent le bois. Entraînée par le pignon, elle tourne autour du guide-chaîne.",
    when: [
      "À affûter dès que la machine fait de la sciure fine au lieu de copeaux, ou qu'il faut forcer pour couper.",
      "À remplacer quand les gouges arrivent au repère d'usure, ou après un choc contre une pierre, un clou ou le sol.",
      "Une chaîne neuve se monte avec un pignon en bon état."
    ]
  },
  guide: {
    view: '300deg 78deg',
    name: 'Guide-chaîne', devis: 'un guide-chaîne',
    pos: '-0.1064m 0.1239m 0.1944m', normal: '-1m 0m 0m',
    role: "La lame qui soutient et guide la chaîne pendant la coupe, et qui lui amène l'huile de graissage.",
    when: [
      "À retourner à chaque changement de chaîne, pour qu'il s'use des deux côtés.",
      "À remplacer quand la rainure n'est plus assez profonde, que les rails sont ouverts ou ébréchés, ou que le guide est tordu."
    ]
  },
  pignon: {
    view: '290deg 80deg',
    name: 'Pignon', devis: 'un pignon de chaîne',
    pos: '-0.1234m 0.1119m -0.0640m', normal: '-1m 0m 0m',
    role: "La roue dentée, cachée sous le carter, qui transmet la force du moteur à la chaîne.",
    when: [
      "Repère courant : un pignon pour deux chaînes.",
      "À changer dès que les dents sont creusées par la chaîne : un pignon usé abîme vite une chaîne neuve."
    ]
  },
  filtre: {
    view: '270deg 35deg',
    name: 'Filtre à air', devis: 'un filtre à air de tronçonneuse',
    pos: '-0.0719m 0.2257m -0.3112m', normal: '0m 0.96m -0.28m',
    role: "Placé sous le capot, il empêche la poussière et la sciure d'entrer dans le moteur.",
    when: [
      "À nettoyer souvent, chaque jour sur un chantier poussiéreux.",
      "À remplacer s'il est déchiré, déformé, ou trop encrassé pour être nettoyé.",
      "Signe à surveiller : le moteur perd de la puissance ou fume."
    ]
  },
  bougie: {
    view: '60deg 40deg',
    name: 'Bougie', devis: "une bougie d'allumage",
    pos: '0.0506m 0.1646m -0.1689m', normal: '0.52m 0.85m 0.11m',
    role: "Elle produit l'étincelle qui allume le mélange dans le moteur.",
    when: [
      "À contrôler si la machine démarre mal ou tourne de façon irrégulière.",
      "À remplacer si les électrodes sont usées ou encrassées. Repère courant : environ toutes les 100 heures de travail."
    ]
  },
  lanceur: {
    view: '70deg 75deg',
    name: 'Lanceur', devis: 'un lanceur ou une corde de lanceur',
    pos: '0.0693m 0.0856m -0.2295m', normal: '1m 0m 0m',
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
    label: 'Tronçonneuse', icon: 'saw', alt: 'Tronçonneuse thermique orange et grise en 3D',
    title: 'La tronçonneuse, <em>pièce par pièce</em>',
    sub: "Touchez une pièce d'usure pour savoir à quoi elle sert et quand la changer.",
    orbit: '300deg 66deg', fit: { d: 0.72, p: 0.74 }, parts: true,
    credit: '« Chainsaw » par Rescue3D Assets, licence CC BY 4.0 (Sketchfab), modifié : inscription de l\'auteur retirée de la texture, mise à l\'échelle.',
    creditUrl: 'https://sketchfab.com/3d-models/chainsaw-8d1c55a879b046ba940414f5ee57f401'
  },
  pulverisateur: {
    label: 'Pulvérisateur', icon: 'drop', alt: 'Pulvérisateur à pression vert en 3D',
    title: 'Le pulvérisateur, <em>en main</em>',
    sub: "Faites-le tourner, puis posez-le chez vous à taille réelle.",
    orbit: '30deg 75deg', fit: { d: 1, p: 1 }, parts: false,
    sheet: {
      eyebrow: 'Espaces verts et agriculture', name: 'Pulvérisateur à pression', devis: 'un pulvérisateur à pression',
      role: "Il projette en fines gouttes un traitement liquide sur les cultures, les haies et les espaces verts.",
      whenT: "Bien l'entretenir",
      when: [
        "Rincer la cuve, la lance et la buse à l'eau claire après chaque usage.",
        "Changer la buse si le jet devient irrégulier, et les joints si la pompe perd sa pression.",
        "Porter des gants et des lunettes pendant le traitement."
      ]
    },
    credit: '« Pump Sprayer » par kowbassen, licence CC BY 4.0 (Sketchfab), mis à l\'échelle.',
    creditUrl: 'https://sketchfab.com/3d-models/pump-sprayer-954abe44058f4257a062722e23c0cf56'
  },
  roulement: {
    label: 'Roulement', icon: 'ring', alt: 'Roulement à billes en acier en 3D',
    title: 'Le roulement à billes, <em>en détail</em>',
    sub: 'Approchez-vous : flasques, bagues, finition acier.',
    orbit: '35deg 70deg', fit: { d: 0.77, p: 0.45 }, parts: false,
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
    label: 'Moteur', icon: 'bolt', alt: 'Moteur électrique industriel neuf en 3D',
    title: 'Le moteur électrique, <em>sous tous les angles</em>',
    sub: 'Carcasse à ailettes, boîte à bornes, pattes de fixation.',
    orbit: '35deg 70deg', fit: { d: 0.8, p: 0.75 }, parts: false,
    sheet: {
      eyebrow: 'Industrie', name: 'Moteur électrique', devis: 'un moteur électrique',
      role: "Il entraîne pompes, compresseurs, convoyeurs et machines d'atelier.",
      whenT: 'Pour un devis juste',
      when: [
        "Relevez la plaque signalétique : puissance, tension, vitesse, forme de fixation.",
        "Signes à surveiller : échauffement, vibrations, bruit des roulements."
      ]
    },
    credit: '« Electric motor » par takeboncog, licence CC BY 4.0 (Sketchfab), mis à l\'échelle.',
    creditUrl: 'https://sketchfab.com/3d-models/electric-motor-19d028eb4e504314bf909a381b6796eb'
  }
};
const OBJ_ORDER = ['tronconneuse', 'moteur', 'pulverisateur', 'roulement'];
const ICONS = {
  saw: '<path d="M3 15h11l6-4-6-4H3zM6 7V5h4v2M7 11h4"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  drop: '<path d="M12 3s-6 7-6 11a6 6 0 0 0 12 0c0-4-6-11-6-11z"/>',
  ring: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/>'
};
const svg = (k) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[k]}</svg>`;

/* ---------- Interface ---------- */
const mv = $('#mv'), chips = $('#chips'), sheet = $('#sheet'), picker = $('#picker');
let currentObj = 'moteur', devisLabel = null, pendingPart = null;

OBJ_ORDER.forEach((k) => {
  const b = document.createElement('button');
  b.className = 'pick'; b.dataset.obj = k; b.innerHTML = `${svg(OBJECTS[k].icon)}<span>${OBJECTS[k].label}</span>`;
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
    const d = distanceFor(p.view, isPhone() ? 0.8 : 0.6) * 0.6;
    mv.cameraOrbit = `${p.view} ${d.toFixed(3)}m`;
  }
}

/* Cadrage : l'objet occupe environ 60 % de la largeur sur ordinateur, 80 % sur téléphone.
   La distance de la caméra se calcule depuis la taille réelle de l'objet et la largeur de l'écran. */
const deg = (v) => parseFloat(v) * Math.PI / 180;
function distanceFor(orbit, frac) {
  const [t, p] = orbit.split(' ').map(deg);
  const d = mv.getDimensions();
  const w = Math.abs(d.x * Math.cos(t)) + Math.abs(d.z * Math.sin(t));
  const depth = Math.abs(d.x * Math.sin(t)) + Math.abs(d.z * Math.cos(t));
  const r = mv.getBoundingClientRect();
  const aspect = r.width / Math.max(r.height, 1);
  const hv = Math.tan(deg(mv.getFieldOfView()) / 2) * aspect;
  // fit : correction mesurée par objet (la silhouette ne remplit pas toute la boîte englobante)
  const f = OBJECTS[currentObj].fit || { d: 1, p: 1 };
  const fit = isPhone() ? f.p : f.d;
  const tv = Math.tan(deg(mv.getFieldOfView()) / 2);
  const byW = w / (2 * frac * hv);
  const byH = d.y / (2 * 0.72 * tv);
  return Math.max(fit * byW, byH) + depth / 2;
}
function frame(orbit) {
  const o = OBJECTS[currentObj];
  const or = orbit || o.orbit;
  mv.cameraTarget = 'auto auto auto';
  if (!mv.loaded) { mv.cameraOrbit = `${or} auto`; return; }
  mv.cameraOrbit = `${or} ${distanceFor(or, isPhone() ? 0.8 : 0.6).toFixed(3)}m`;
}

function loadObject(k) {
  currentObj = k;
  const o = OBJECTS[k];
  document.querySelectorAll('.pick').forEach((b) => b.classList.toggle('on', b.dataset.obj === k));
  $('#h-title').innerHTML = o.title; $('#h-sub').textContent = o.sub;
  mv.alt = o.alt;
  mv.src = `assets/models/${k}.glb?v=${V}`;
  mv.iosSrc = `assets/models/${k}.usdz?v=${V}`;
  frame();
  chips.hidden = !o.parts; $('#bottom').hidden = !o.parts;
  makeHotspots();
  if (o.parts) { select(null); devisLabel = null; }
  else {
    devisLabel = o.sheet.devis;
    if (isPhone()) { sheet.hidden = true; } else { showSheet(o.sheet); }
  }
  document.body.classList.toggle('side-sheet', !o.parts && !isPhone());
  $('#fiche-btn').hidden = o.parts;
  $('#credits').innerHTML = `Modèle 3D : <a href="${o.creditUrl}" target="_blank" rel="noopener">${o.credit}</a> Affichage : model-viewer (licence Apache 2.0).`;
  const u = new URL(location); u.searchParams.set('objet', k); u.searchParams.delete('piece'); history.replaceState(null, '', u);
}

$('#close').addEventListener('click', () => {
  if (OBJECTS[currentObj].parts) { select(null); return; }
  sheet.hidden = true;
  if (document.body.classList.contains('side-sheet')) { document.body.classList.remove('side-sheet'); setTimeout(() => frame(), 60); }
});
$('#fiche-btn').addEventListener('click', () => {
  const o = OBJECTS[currentObj]; if (o.parts) return;
  showSheet(o.sheet);
  if (!isPhone()) { document.body.classList.add('side-sheet'); setTimeout(() => frame(), 60); }
});
$('#reset').addEventListener('click', () => frame());
let lastPhone = isPhone();
window.addEventListener('resize', () => { clearTimeout(window.__rz); window.__rz = setTimeout(() => { const o = OBJECTS[currentObj]; document.body.classList.toggle('side-sheet', !o.parts && !isPhone() && !sheet.hidden); frame(); }, 250); });
$('#f-devis').addEventListener('click', () => {
  $('#m-msg').textContent = `Bonjour SACRI,\nJe souhaite un devis pour ${devisLabel || 'une pièce de tronçonneuse'}.\nModèle de ma machine : (à préciser)\nMerci de me recontacter.`;
  $('#m-copy span').textContent = 'Copier le message';
  $('#modal').hidden = false;
});
$('#m-close').addEventListener('click', () => ($('#modal').hidden = true));
$('#modal').addEventListener('click', (e) => { if (e.target.id === 'modal') $('#modal').hidden = true; });
$('#ar-go').addEventListener('click', () => { if (mv.canActivateAR) mv.activateAR(); else $('#armodal').hidden = false; });
$('#m-copy').addEventListener('click', async () => { try { await navigator.clipboard.writeText($('#m-msg').textContent); $('#m-copy span').textContent = 'Message copié'; } catch (e) { $('#m-copy span').textContent = 'Sélectionnez le texte pour le copier'; } });
$('#a-close').addEventListener('click', () => ($('#armodal').hidden = true));
$('#armodal').addEventListener('click', (e) => { if (e.target.id === 'armodal') $('#armodal').hidden = true; });

mv.addEventListener('progress', (e) => { $('#bar').style.width = `${Math.round(e.detail.totalProgress * 100)}%`; });
mv.addEventListener('load', () => {
  frame(); mv.jumpCameraToGoal();
  setTimeout(() => { document.body.dataset.loaded = currentObj; }, 300);
  if (pendingPart) { select(pendingPart, false); pendingPart = null; }
});
mv.addEventListener('ar-status', (e) => { if (e.detail.status === 'failed') $('#armodal').hidden = false; });
mv.addEventListener('camera-change', (e) => { if (e.detail.source === 'user-interaction') $('#hint').classList.add('off'); });
// Sans réalité augmentée possible (ordinateur), le bouton « Voir chez moi » ouvre une aide.


const q = new URLSearchParams(location.search);
loadObject(OBJECTS[q.get('objet')] ? q.get('objet') : 'tronconneuse');
if (q.get('piece') && PARTS[q.get('piece')] && currentObj === 'tronconneuse') pendingPart = q.get('piece');
