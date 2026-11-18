import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const CATALOGUE = 'https://leslita06.github.io/sacri-catalogue/';

/* ---------- Fiches des pièces d'usure ---------- */
const PARTS = {
  chaine: {
    name: 'Chaîne', devis: 'une chaîne de tronçonneuse',
    role: "Ce sont ses gouges qui coupent le bois. Entraînée par le pignon, elle tourne autour du guide-chaîne.",
    when: [
      "À affûter dès que la machine fait de la sciure fine au lieu de copeaux, ou qu'il faut forcer pour couper.",
      "À remplacer quand les gouges arrivent au repère d'usure, ou après un choc contre une pierre, un clou ou le sol.",
      "Une chaîne neuve se monte avec un pignon en bon état."
    ]
  },
  guide: {
    name: 'Guide-chaîne', devis: 'un guide-chaîne',
    role: "La lame qui soutient et guide la chaîne pendant la coupe, et qui lui amène l'huile de graissage.",
    when: [
      "À retourner à chaque changement de chaîne, pour qu'il s'use des deux côtés.",
      "À remplacer quand la rainure n'est plus assez profonde, que les rails sont ouverts ou ébréchés, ou que le guide est tordu."
    ]
  },
  pignon: {
    name: 'Pignon', devis: 'un pignon de chaîne',
    role: "La roue dentée, cachée sous le carter, qui transmet la force du moteur à la chaîne.",
    when: [
      "Repère courant : un pignon pour deux chaînes.",
      "À changer dès que les dents sont creusées par la chaîne : un pignon usé abîme vite une chaîne neuve."
    ]
  },
  filtre: {
    name: 'Filtre à air', devis: 'un filtre à air de tronçonneuse',
    role: "Placé sous le capot, il empêche la poussière et la sciure d'entrer dans le moteur.",
    when: [
      "À nettoyer souvent, chaque jour sur un chantier poussiéreux.",
      "À remplacer s'il est déchiré, déformé, ou trop encrassé pour être nettoyé.",
      "Signe à surveiller : le moteur perd de la puissance ou fume."
    ]
  },
  bougie: {
    name: 'Bougie', devis: "une bougie d'allumage",
    role: "Elle produit l'étincelle qui allume le mélange dans le moteur.",
    when: [
      "À contrôler si la machine démarre mal ou tourne de façon irrégulière.",
      "À remplacer si les électrodes sont usées ou encrassées. Repère courant : environ toutes les 100 heures de travail."
    ]
  },
  lanceur: {
    name: 'Lanceur', devis: 'un lanceur ou une corde de lanceur',
    role: "Le mécanisme à corde et poignée qui fait tourner le moteur pour le démarrer.",
    when: [
      "Changer la corde dès qu'elle s'effiloche, avant qu'elle ne casse.",
      "Faire réviser le lanceur si la corde ne se rembobine plus ou si le démarrage accroche."
    ]
  }
};
const ORDER = ['chaine', 'guide', 'pignon', 'filtre', 'bougie', 'lanceur'];

/* ---------- Interface ---------- */
const $ = (s) => document.querySelector(s);
const chips = $('#chips'), sheet = $('#sheet');
ORDER.forEach((k, i) => {
  const b = document.createElement('button');
  b.className = 'chip'; b.dataset.part = k;
  b.innerHTML = `<i>${i + 1}</i>${PARTS[k].name}`;
  b.addEventListener('click', () => select(k, true));
  chips.appendChild(b);
});
let current = null;
function fillSheet(k) {
  const p = PARTS[k];
  $('#f-name').textContent = p.name;
  $('#f-role').textContent = p.role;
  $('#f-when').innerHTML = p.when.map((w) => `<li>${w}</li>`).join('');
  $('#f-cat').href = CATALOGUE;
  sheet.hidden = false; sheet.scrollTop = 0;
}
$('#close').addEventListener('click', () => select(null));
$('#f-devis').addEventListener('click', () => {
  const p = PARTS[current];
  $('#m-msg').textContent = `Bonjour SACRI,\nJe souhaite un devis pour ${p ? p.devis : 'une pièce de tronçonneuse'}.\nModèle de ma machine : …\nMerci de me recontacter.`;
  $('#modal').hidden = false;
});
$('#m-close').addEventListener('click', () => ($('#modal').hidden = true));
$('#modal').addEventListener('click', (e) => { if (e.target.id === 'modal') $('#modal').hidden = true; });

/* ---------- Scène ---------- */
const host = $('#scene');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
} catch (e) {
  $('#noweb').hidden = false; $('#hint').hidden = true;
  throw e;
}
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
host.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
const key = new THREE.DirectionalLight(0xffffff, 1.4); key.position.set(4, 6, 5); scene.add(key);
scene.add(new THREE.HemisphereLight(0xffffff, 0xd8d2ca, 0.5));

const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; controls.dampingFactor = 0.08;
controls.enablePan = false; controls.minDistance = 3.5; controls.maxDistance = 26;
controls.autoRotate = true; controls.autoRotateSpeed = 0.7;
controls.target.set(0, 0.25, 0);

/* Matériaux */
const M = {
  orange: () => new THREE.MeshStandardMaterial({ color: 0xE95B0F, roughness: 0.45, metalness: 0.05 }),
  dark: () => new THREE.MeshStandardMaterial({ color: 0x34322F, roughness: 0.7, metalness: 0.1 }),
  black: () => new THREE.MeshStandardMaterial({ color: 0x1E1D1C, roughness: 0.6, metalness: 0.1 }),
  steel: () => new THREE.MeshStandardMaterial({ color: 0xC3C7CC, roughness: 0.28, metalness: 0.85 }),
  chain: () => new THREE.MeshStandardMaterial({ color: 0x5A5D62, roughness: 0.35, metalness: 0.9 }),
  white: () => new THREE.MeshStandardMaterial({ color: 0xF2EFE9, roughness: 0.4, metalness: 0 }),
  filter: () => new THREE.MeshStandardMaterial({ color: 0xE9E2D2, roughness: 0.85, metalness: 0 }),
  grey: () => new THREE.MeshStandardMaterial({ color: 0x878480, roughness: 0.5, metalness: 0.2 })
};

const saw = new THREE.Group(); saw.position.set(-0.75, 0, 0); scene.add(saw);
const groups = {};           // pièce -> groupe animé
function part(name, owner, offset) {
  const g = new THREE.Group(); g.userData = { owner, base: new THREE.Vector3(), offset };
  saw.add(g); groups[name] = g; return g;
}
function add(g, geo, mat, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) {
  const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.rotation.set(rx, ry, rz);
  m.userData.owner = g.userData.owner; g.add(m); return m;
}
const tube = (pts, r) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p))), 64, r, 14, false);

/* Corps (fixe) */
const body = part('corps', null, new THREE.Vector3());
add(body, new RoundedBoxGeometry(1.55, 0.78, 0.86, 5, 0.14), M.dark(), -0.42, 0.02, 0);
add(body, new RoundedBoxGeometry(1.1, 0.22, 0.9, 4, 0.08), M.orange(), -0.55, -0.42, 0);           // réservoir
add(body, new THREE.CylinderGeometry(0.11, 0.11, 0.07, 24), M.orange(), -1.0, -0.42, -0.47, Math.PI / 2); // bouchon
add(body, new THREE.CylinderGeometry(0.09, 0.09, 0.07, 24), M.black(), -0.3, -0.42, -0.47, Math.PI / 2);  // bouchon huile
// poignée arrière + gâchette
add(body, tube([[-1.15, 0.32, 0], [-1.6, 0.36, 0], [-2.0, 0.22, 0], [-2.05, -0.12, 0], [-1.8, -0.3, 0], [-1.15, -0.3, 0]], 0.085), M.black());
add(body, new RoundedBoxGeometry(0.22, 0.14, 0.09, 3, 0.03), M.orange(), -1.55, 0.24, 0, 0, 0, -0.2);
// poignée avant enveloppante
add(body, tube([[0.02, -0.38, -0.52], [0.05, 0.4, -0.56], [0.0, 0.98, -0.3], [-0.05, 1.06, 0.05], [-0.15, 0.95, 0.32], [-0.3, 0.72, 0.4]], 0.075), M.black());
// protège-main (frein de chaîne)
add(body, new RoundedBoxGeometry(0.05, 0.5, 0.78, 3, 0.02), M.black(), 0.32, 0.86, 0, 0, 0, -0.35);
// silencieux + ailettes
add(body, new RoundedBoxGeometry(0.2, 0.42, 0.55, 3, 0.05), M.grey(), 0.38, 0.0, -0.05);
for (let i = 0; i < 5; i++) add(body, new THREE.BoxGeometry(0.02, 0.3, 0.42), M.grey(), 0.5 + i * 0.0, -0.02 + 0, -0.06 + (i - 2) * 0.0);
// patte d'accroche (griffe)
add(body, new THREE.BoxGeometry(0.06, 0.32, 0.12), M.steel(), 0.55, -0.12, 0.42);

/* Capot supérieur (cliquable -> filtre) */
const capot = part('capot', 'filtre', new THREE.Vector3(-0.1, 1.55, 0));
add(capot, new RoundedBoxGeometry(1.25, 0.42, 0.82, 5, 0.16), M.orange(), -0.5, 0.58, 0);
add(capot, new RoundedBoxGeometry(0.5, 0.06, 0.5, 2, 0.03), M.dark(), -0.75, 0.8, 0);  // verrou du capot

/* Carter de pignon, côté droit (cliquable -> pignon) */
const carter = part('carter', 'pignon', new THREE.Vector3(0.1, 0.3, 1.35));
add(carter, new RoundedBoxGeometry(0.85, 0.62, 0.14, 4, 0.06), M.orange(), 0.2, -0.02, 0.5);
add(carter, new THREE.CylinderGeometry(0.06, 0.06, 0.06, 6), M.steel(), 0.42, 0.0, 0.59, Math.PI / 2);
add(carter, new THREE.CylinderGeometry(0.06, 0.06, 0.06, 6), M.steel(), 0.1, 0.0, 0.59, Math.PI / 2);

/* Guide-chaîne */
const BAR_Z = 0.62, X0 = 0.32, X1 = 3.25, H0 = 0.2, R1 = 0.14;
const guide = part('guide', 'guide', new THREE.Vector3(0.45, -0.05, 0.75));
{
  const s = new THREE.Shape();
  s.moveTo(X0, H0); s.lineTo(X1, R1); s.absarc(X1, 0, R1, Math.PI / 2, -Math.PI / 2, true);
  s.lineTo(X0, -H0); s.absarc(X0, 0, H0, -Math.PI / 2, -3 * Math.PI / 2, true);
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.045, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 2, curveSegments: 32 });
  g.translate(0, -0.08, BAR_Z - 0.022);
  add(guide, g, M.steel(), 0, 0, 0);
  const band = new THREE.PlaneGeometry(1.6, 0.07);
  const t1 = add(guide, band, M.orange(), 1.9, -0.08, BAR_Z + 0.032);
  const t2 = add(guide, band, M.orange(), 1.9, -0.08, BAR_Z - 0.032, 0, Math.PI, 0);
}

/* Chaîne : maillons le long du contour du guide */
const chaine = part('chaine', 'chaine', new THREE.Vector3(0.45, 0.42, 1.45));
{
  const o = 0.035, pts = [];
  const top0 = new THREE.Vector2(X0, H0 + o), top1 = new THREE.Vector2(X1, R1 + o);
  const seg = (a, b, n) => { for (let i = 0; i < n; i++) pts.push(a.clone().lerp(b, i / n)); };
  const arc = (cx, r, a0, a1, n) => { for (let i = 0; i < n; i++) { const a = a0 + (a1 - a0) * i / n; pts.push(new THREE.Vector2(cx + Math.cos(a) * r, Math.sin(a) * r)); } };
  seg(top0, top1, 400); arc(X1, R1 + o, Math.PI / 2, -Math.PI / 2, 60);
  seg(new THREE.Vector2(X1, -R1 - o), new THREE.Vector2(X0, -H0 - o), 400); arc(X0, H0 + o, -Math.PI / 2, -3 * Math.PI / 2, 80);
  // longueur cumulée -> maillons espacés régulièrement
  const L = [0]; for (let i = 1; i <= pts.length; i++) L.push(L[i - 1] + pts[i % pts.length].distanceTo(pts[i - 1]));
  const total = L[L.length - 1], N = 96, step = total / N;
  const linkGeo = new THREE.BoxGeometry(0.058, 0.032, 0.05);
  const toothGeo = new THREE.BoxGeometry(0.04, 0.03, 0.03);
  const links = new THREE.InstancedMesh(linkGeo, M.chain(), N);
  const teeth = new THREE.InstancedMesh(toothGeo, M.chain(), N / 2);
  links.userData.owner = teeth.userData.owner = 'chaine';
  const dummy = new THREE.Object3D(); let j = 0, ti = 0;
  for (let k = 0; k < N; k++) {
    const d = k * step; while (L[j + 1] < d) j++;
    const a = pts[j], b = pts[(j + 1) % pts.length];
    const ang = Math.atan2(b.y - a.y, b.x - a.x);
    dummy.position.set(a.x, a.y - 0.08, BAR_Z); dummy.rotation.set(0, 0, ang); dummy.updateMatrix();
    links.setMatrixAt(k, dummy.matrix);
    if (k % 2 === 0) {
      const nx = Math.cos(ang + Math.PI / 2) * 0.025, ny = Math.sin(ang + Math.PI / 2) * 0.025;
      dummy.position.set(a.x + nx, a.y - 0.08 + ny, BAR_Z + (k % 4 === 0 ? 0.012 : -0.012)); dummy.updateMatrix();
      teeth.setMatrixAt(ti++, dummy.matrix);
    }
  }
  chaine.add(links); chaine.add(teeth);
}

/* Pignon */
const pignon = part('pignon', 'pignon', new THREE.Vector3(0.0, -0.2, 0.75));
{
  const s = new THREE.Shape(), T = 7, r0 = 0.12, r1 = 0.17;
  for (let i = 0; i <= T * 2; i++) {
    const a = (i / (T * 2)) * Math.PI * 2, r = i % 2 ? r0 : r1;
    const p = [Math.cos(a) * r, Math.sin(a) * r]; i ? s.lineTo(...p) : s.moveTo(...p);
  }
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.06, bevelEnabled: false });
  g.translate(0, 0, -0.03);
  add(pignon, g, M.steel(), X0, -0.08, BAR_Z - 0.0);
  add(pignon, new THREE.CylinderGeometry(0.08, 0.08, 0.16, 24), M.grey(), X0, -0.08, BAR_Z - 0.09, Math.PI / 2);
}

/* Filtre à air (sous le capot) */
const filtre = part('filtre', 'filtre', new THREE.Vector3(-0.1, 0.95, 0));
add(filtre, new RoundedBoxGeometry(0.66, 0.16, 0.6, 3, 0.04), M.dark(), -0.62, 0.52, 0);
for (let i = 0; i < 9; i++) add(filtre, new THREE.BoxGeometry(0.035, 0.1, 0.52), M.filter(), -0.9 + i * 0.07, 0.62, 0);

/* Bougie */
const bougie = part('bougie', 'bougie', new THREE.Vector3(0.62, 0.95, 0.15));
{
  const x = -0.05, y = 0.76, z = 0.14;
  add(bougie, new THREE.CylinderGeometry(0.035, 0.035, 0.12, 16), M.steel(), x, y - 0.06, z);
  add(bougie, new THREE.CylinderGeometry(0.06, 0.06, 0.07, 6), M.steel(), x, y + 0.03, z);
  add(bougie, new THREE.CylinderGeometry(0.035, 0.045, 0.18, 20), M.white(), x, y + 0.155, z);
  add(bougie, new THREE.CylinderGeometry(0.018, 0.018, 0.06, 12), M.steel(), x, y + 0.27, z);
  add(bougie, new THREE.TorusGeometry(0.06, 0.012, 8, 20), M.white(), x, y + 0.14, z, Math.PI / 2);
}

/* Lanceur, côté gauche */
const lanceur = part('lanceur', 'lanceur', new THREE.Vector3(-0.1, 0.1, -1.25));
add(lanceur, new RoundedBoxGeometry(0.85, 0.66, 0.14, 4, 0.06), M.dark(), -0.62, 0.02, -0.49);
add(lanceur, new THREE.CylinderGeometry(0.25, 0.25, 0.05, 40), M.black(), -0.62, 0.0, -0.57, Math.PI / 2);
for (let i = 0; i < 10; i++) add(lanceur, new THREE.BoxGeometry(0.4, 0.02, 0.03), M.grey(), -0.62, -0.18 + i * 0.04, -0.6);
add(lanceur, new THREE.CylinderGeometry(0.008, 0.008, 0.12, 8), M.white(), -0.35, 0.36, -0.58);
add(lanceur, new THREE.CapsuleGeometry(0.04, 0.2, 6, 12), M.orange(), -0.35, 0.44, -0.58, 0, 0, Math.PI / 2);

/* Ombre douce au sol */
{
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const x = c.getContext('2d'), gr = x.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, 'rgba(40,30,20,0.32)'); gr.addColorStop(1, 'rgba(40,30,20,0)');
  x.fillStyle = gr; x.fillRect(0, 0, 256, 256);
  const sh = new THREE.Mesh(new THREE.PlaneGeometry(6.5, 2.6), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }));
  sh.rotation.x = -Math.PI / 2; sh.position.set(0.1, -0.62, 0); scene.add(sh);
}

/* ---------- Vue éclatée ---------- */
let explodeTarget = 0, explodeT = 0;
const btnExplode = $('#explode');
function setExplode(on) {
  explodeTarget = on ? 1 : 0;
  btnExplode.setAttribute('aria-pressed', on);
  btnExplode.querySelector('span').textContent = on ? 'Vue assemblée' : 'Vue éclatée';
}
btnExplode.addEventListener('click', () => { stopAuto(); setExplode(!explodeTarget); });

/* ---------- Sélection ---------- */
const HL = new THREE.Color(0xE95B0F);
function paint(owner, amount) {
  saw.traverse((m) => {
    if (!m.isMesh) return;
    const on = owner && m.userData.owner === owner;
    m.material.emissive = on ? HL : new THREE.Color(0);
    m.material.emissiveIntensity = on ? amount : 0;
  });
}
function select(k, fromChip) {
  current = k;
  chips.querySelectorAll('.chip').forEach((c) => c.classList.toggle('on', c.dataset.part === k));
  if (!k) { sheet.hidden = true; paint(null); return layout(); }
  stopAuto();
  if ((k === 'filtre' || k === 'pignon') && !explodeTarget) setExplode(true);
  paint(k, 0.55); fillSheet(k); layout();
}
$('#close').addEventListener('click', () => select(null));

const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
let down = null, hover = null;
function pick(e) {
  const r = renderer.domElement.getBoundingClientRect();
  ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(ptr, camera);
  const hit = ray.intersectObjects(saw.children, true).find((h) => h.object.userData.owner);
  return hit ? hit.object.userData.owner : null;
}
renderer.domElement.addEventListener('pointerdown', (e) => { down = [e.clientX, e.clientY]; stopAuto(); });
renderer.domElement.addEventListener('pointerup', (e) => {
  if (!down) return; const moved = Math.hypot(e.clientX - down[0], e.clientY - down[1]); down = null;
  if (moved > 7) return;
  const k = pick(e); if (k) select(k); else if (current) select(null);
});
renderer.domElement.addEventListener('pointermove', (e) => {
  if (e.pointerType !== 'mouse' || down) return;
  const k = pick(e);
  if (k !== hover) { hover = k; renderer.domElement.style.cursor = k ? 'pointer' : 'grab'; if (!current) paint(k, 0.25); }
});

function stopAuto() { controls.autoRotate = false; $('#hint').classList.add('off'); }
controls.addEventListener('start', stopAuto);

/* ---------- Cadrage ---------- */
const HOME = new THREE.Vector3(3.2, 2.3, 6.0);
let shift = { x: 0, y: 0 }, shiftTarget = { x: 0, y: 0 };
function home() {
  const w = host.clientWidth, h = host.clientHeight;
  const hfov = 2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * (w / h));
  const dist = Math.max(7.4, 3.0 / Math.tan(hfov / 2));
  camera.position.copy(HOME).setLength(dist).add(controls.target);
  controls.update();
}
$('#reset').addEventListener('click', () => { controls.target.set(0, 0.25, 0); home(); });
function layout() {
  const w = host.clientWidth, h = host.clientHeight, mobile = w <= 820;
  shiftTarget = sheet.hidden ? { x: 0, y: 0 } : mobile ? { x: 0, y: Math.min(sheet.offsetHeight, h * 0.64) * 0.5 } : { x: (sheet.offsetWidth + 24) * 0.5, y: 0 };
}
function resize() {
  const w = host.clientWidth, h = host.clientHeight;
  renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); layout();
}
let lastW = 0;
window.addEventListener('resize', () => { resize(); if (Math.abs(host.clientWidth - lastW) > 80) { lastW = host.clientWidth; home(); } });
resize(); home(); lastW = host.clientWidth;

/* ---------- Boucle ---------- */
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
let last = performance.now();
renderer.setAnimationLoop((now) => {
  const dt = Math.min(0.1, (now - last) / 1000); last = now;
  explodeT += Math.sign(explodeTarget - explodeT) * Math.min(Math.abs(explodeTarget - explodeT), dt * 1.4);
  const e = ease(explodeT);
  Object.values(groups).forEach((g) => g.position.copy(g.userData.offset).multiplyScalar(e));
  shift.x += (shiftTarget.x - shift.x) * 0.12; shift.y += (shiftTarget.y - shift.y) * 0.12;
  const w = host.clientWidth, h = host.clientHeight;
  const zt = (1 - 0.3 * e) * (sheet.hidden || w <= 820 ? 1 : 0.86);
  if (Math.abs(camera.zoom - zt) > 0.001) { camera.zoom += (zt - camera.zoom) * 0.12; camera.updateProjectionMatrix(); }
  if (Math.abs(shift.x) + Math.abs(shift.y) > 0.5) camera.setViewOffset(w, h, shift.x, shift.y, w, h); else camera.clearViewOffset();
  controls.update();
  renderer.render(scene, camera);
});

/* Paramètres de démonstration (captures) : ?eclate=1&piece=chaine */
const q = new URLSearchParams(location.search);
if (q.get('eclate') === '1') { stopAuto(); setExplode(true); explodeT = 1; }
if (q.get('piece') && PARTS[q.get('piece')]) select(q.get('piece'));
window.__sacri3d = { ready: true };
