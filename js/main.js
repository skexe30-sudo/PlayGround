const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const ui = {
  hud: document.getElementById('hud'),
  hpFill: document.getElementById('hpFill'),
  mpFill: document.getElementById('mpFill'),
  spFill: document.getElementById('spFill'),
  xpFill: document.getElementById('xpFill'),
  hpText: document.getElementById('hpText'),
  mpText: document.getElementById('mpText'),
  spText: document.getElementById('spText'),
  hudLevel: document.getElementById('hudLevel'),
  hudClassName: document.getElementById('hudClassName'),
  hudTitle: document.getElementById('hudTitle'),
  hudGold: document.getElementById('hudGold'),
  hudClock: document.getElementById('hudClock'),
  hudHazard: document.getElementById('hudHazard'),
  shield: document.getElementById('hudSatiety'),
  tracker: document.getElementById('tracker'),
  trackerTitle: document.getElementById('trackerTitle'),
  trackerDesc: document.getElementById('trackerDesc'),
  trackerFill: document.getElementById('trackerFill'),
  trackerCount: document.getElementById('trackerCount'),
  combatLog: document.getElementById('combatLog'),
  minimap: document.getElementById('minimap'),
  minimapLabel: document.getElementById('minimapLabel'),
  sheet: document.getElementById('sheet'),
  sheetTitle: document.getElementById('sheetTitle'),
  sheetKicker: document.getElementById('sheetKicker'),
  sheetBody: document.getElementById('sheetBody'),
  sheetTabs: document.getElementById('sheetTabs'),
  sheetFoot: document.getElementById('sheetFoot'),
  overlay: document.getElementById('overlay'),
  detailSheet: document.getElementById('detailSheet'),
  toastStack: document.getElementById('toastStack'),
  titleScreen: document.getElementById('titleScreen'),
  pauseScreen: document.getElementById('pauseScreen'),
  btnResume: document.getElementById('btnResume'),
  rotateGate: document.getElementById('rotateGate'),
  btnNewGame: document.getElementById('btnNewGame'),
  btnContinue: document.getElementById('btnContinue'),
  btnAudio: document.getElementById('btnAudio'),
  btnCharacter: document.getElementById('btnCharacter'),
  btnBag: document.getElementById('btnBag'),
  btnCraft: document.getElementById('btnCraft'),
  btnMap: document.getElementById('btnMap'),
  btnMenu: document.getElementById('btnMenu'),
  btnPauseTop: document.getElementById('btnPauseTop'),
  btnRotateSkip: document.getElementById('btnRotateSkip'),
  btnCamp: document.getElementById('btnCamp'),
  btnAttack: document.getElementById('btnAttack'),
  btnDodge: document.getElementById('btnDodge'),
  btnInteract: document.getElementById('btnInteract'),
  interactLabel: document.getElementById('interactLabel'),
  dodgeCd: document.getElementById('dodgeCd'),
  skillButtons: [...document.querySelectorAll('.skill-btn')],
  joystick: document.getElementById('joystick'),
  stickKnob: document.getElementById('stickKnob'),
  bossBar: document.getElementById('bossBar'),
  bossName: document.getElementById('bossName'),
  bossFill: document.getElementById('bossFill'),
  bossSub: document.getElementById('bossSub'),
  touchHint: document.getElementById('touchHint'),
  campActions: document.getElementById('campActions'),
  screenFx: document.getElementById('screenFx'),
  sheetClose: document.getElementById('sheetClose')
};

const MAPS = [
  { id: '1.1', tier: 1, tierName: 'Tier 1: La Frontera Primitiva (Nv. 1-15)', name: 'Playas del Náufrago', hazard: 'Mareas y emboscadas costeras', enemies: ['Cangrejo acorazado', 'Bandido novato', 'Slime común'], resources: ['madera', 'cobre', 'pez'], colors: ['#c8b482', '#a9d0c2', '#f0d59d'] },
  { id: '1.2', tier: 1, tierName: 'Tier 1: La Frontera Primitiva (Nv. 1-15)', name: 'Praderas Susurrantes', hazard: 'Vientos dinámicos y manadas rápidas', enemies: ['Lobo gris', 'Goblin recolector', 'Jabalí salvaje'], resources: ['hierba', 'lino', 'hierro'], colors: ['#95c58f', '#d2c7b1', '#a5b2c2'] },
  { id: '1.3', tier: 1, tierName: 'Tier 1: La Frontera Primitiva (Nv. 1-15)', name: 'Bosques Bajos de la Niebla', hazard: 'Niebla matutina que reduce visibilidad', enemies: ['Araña cazadora', 'Bandido explorador', 'Treant joven'], resources: ['roble', 'seta', 'piel'], colors: ['#8fc15a', '#d4d683', '#d7b8a8'] },
  { id: '2.1', tier: 2, tierName: 'Tier 2: Tierras Interiores Hostiles (Nv. 16-30)', name: 'Pantanos Ácidos de Miasma', hazard: 'Gas tóxico y lodo ralentizador', enemies: ['Slime de ácido', 'Sanguijuela gigante', 'Hombre lagarto'], resources: ['raíz', 'cuero ácido', 'estaño'], colors: ['#83d06f', '#6dbd90', '#8ab7a9'] },
  { id: '2.2', tier: 2, tierName: 'Tier 2: Tierras Interiores Hostiles (Nv. 16-30)', name: 'Cañones de Piedra Quebrada', hazard: 'Desprendimientos y puentes estrechos', enemies: ['Bandido ballestero', 'Ave de presa rocosa', 'Escorpión de roca'], resources: ['hierro', 'carbón', 'pluma'], colors: ['#d0b587', '#6e7a7d', '#f0c97b'] },
  { id: '2.3', tier: 2, tierName: 'Tier 2: Tierras Interiores Hostiles (Nv. 16-30)', name: 'Ruinas Subterráneas Superiores', hazard: 'Trampas antiguas y oscuridad', enemies: ['Esqueleto guardián', 'Espectro menor', 'Gólem de piedra'], resources: ['polvo arcano', 'plata', 'reliquia'], colors: ['#d9d0ef', '#98a1d6', '#f4d0b6'] },
  { id: '3.1', tier: 3, tierName: 'Tier 3: Extremos Elementales (Nv. 31-45)', name: 'Tundra Eterna de Hielo', hazard: 'Ventiscas letales (exige ropa térmica)', enemies: ['Slime de hielo', 'Yeti de las nieves', 'Parásito criogénico', 'Polilla de escarcha'], resources: ['acero glacial', 'piel de yeti', 'flor de escarcha'], colors: ['#adcde2', '#d5e3f1', '#9ccad8'] },
  { id: '3.2', tier: 3, tierName: 'Tier 3: Extremos Elementales (Nv. 31-45)', name: 'Desierto de Ceniza Volcánica', hazard: 'Calor extremo y suelos ardientes', enemies: ['Slime de magma', 'Escorpión de fuego', 'Verme de arena', 'Cultista ígneo'], resources: ['obsidiana', 'azufre', 'escamas'], colors: ['#f0bf72', '#c46d3c', '#f1d88d'] },
  { id: '3.3', tier: 3, tierName: 'Tier 3: Extremos Elementales (Nv. 31-45)', name: 'Jungla Umbría Profunda', hazard: 'Esporas venenosas y flora carnívora', enemies: ['Hongo titánico', 'Bestia de la sombra', 'Depredador mimético'], resources: ['madera férrea', 'veneno concentrado', 'seda umbría'], colors: ['#69b36a', '#4f9658', '#9cb577'] },
  { id: '4.1', tier: 4, tierName: 'Tier 4: El Abismo Corrompido (Nv. 46-55)', name: 'Bosque de Cristales Abisales', hazard: 'Radiación arcana y reflejos cegadores', enemies: ['Gólem arcano', 'Merodeador de energía', 'Cristálido'], resources: ['cristal abisal', 'mithril corrupto', 'esencia pura'], colors: ['#9f83fc', '#77d4e8', '#d3aef4'] },
  { id: '4.2', tier: 4, tierName: 'Tier 4: El Abismo Corrompido (Nv. 46-55)', name: 'Ciénagas de Sangre Estancada', hazard: 'Corrupción hemática continua', enemies: ['Mutación biológica', 'Horror tentacular', 'Inquisidor oscuro'], resources: ['icor abisal', 'cuero mutado', 'hierba carmesí'], colors: ['#d95768', '#8d3d55', '#e29c8b'] },
  { id: '4.3', tier: 4, tierName: 'Tier 4: El Abismo Corrompido (Nv. 46-55)', name: 'Meseta de los Titanes Caídos', hazard: 'Tormentas eléctricas estáticas', enemies: ['Coloso roto', 'Elemental de tormenta', 'Vigilante celestial'], resources: ['metal estelar', 'núcleo de rayo', 'piedra rúnica'], colors: ['#c2d7f7', '#7ec0f5', '#f7d98c'] },
  { id: '5.1', tier: 5, tierName: 'Tier 5: Núcleo de los Arquitectos (Nv. 56-60)', name: 'Pasillos del Vacío Mecánico', hazard: 'Trampas láser y drenaje de maná', enemies: ['Slime del vacío', 'Centinela arquitecto', 'Androide corrupto'], resources: ['aleación arquitecta', 'condensador arcano'], colors: ['#9ec3b4', '#b7d9d4', '#8d8ea6'] },
  { id: '5.2', tier: 5, tierName: 'Tier 5: Núcleo de los Arquitectos (Nv. 56-60)', name: 'El Abismo Espejado', hazard: 'Gravedad alterada e ilusiones', enemies: ['Constructo cuántico', 'Entidad incorpórea', 'Reflejo oscuro'], resources: ['fragmento dimensional', 'tela etérea'], colors: ['#d8b3ff', '#8be7f0', '#d4d4d7'] },
  { id: '5.3', tier: 5, tierName: 'Tier 5: Núcleo de los Arquitectos (Nv. 56-60)', name: 'La Cámara del Eclipse', hazard: 'Densidad máxima de Niebla Cenicienta', enemies: ['Horror primordial', 'Avatar de la Niebla'], resources: ['núcleo primordial', 'plano legendario'], colors: ['#6748d9', '#8f73ff', '#d6c7ff'] }
];

const HYBRID_CLASSES = [
  { primary: 'Arquero', sub: 'Inquebrantable', active: ['Disparo de Anclaje', 'Baluarte de Ballestero'], passive: ['Postura Firme', 'Armadura de Campaña'], role: 'Tirador pesado de posición fija y alta resistencia física.' },
  { primary: 'Arquero', sub: 'Elementista', active: ['Flecha Elemental Adaptativa', 'Muro de Viento'], passive: ['Corriente Residual', 'Balística Dinámica'], role: 'Control elemental a distancia y manipulación de proyectiles.' },
  { primary: 'Arquero', sub: 'Clérigo', active: ['Saeta de Juicio Divino', 'Aura de Purificación Menor'], passive: ['Bendición del Tirador', 'Fervor de la Fe'], role: 'Daño radiante contra corrupción y soporte de grupo/supervivencia.' },
  { primary: 'Arquero', sub: 'Potenciador', active: ['Trampa de Abrojos Cinéticos', 'Tintura de Precisión'], passive: ['Ojo de Halcón Concentrado', 'Catálisis de Trampas'], role: 'Especialista táctico en trampas, venenos y explosivos alquímicos.' },
  { primary: 'Mago', sub: 'Inquebrantable', active: ['Pulso de Hierro Arcano', 'Escudo de Placas Mágicas'], passive: ['Absorción de Impacto', 'Resistencia Pesada Innata'], role: 'Mago de batalla blindado capaz de resistir embates cuerpo a cuerpo.' },
  { primary: 'Mago', sub: 'Elementista', active: ['Tormenta Convergente', 'Escudo de Prisma'], passive: ['Catálisis Instintiva', 'Sintonía de Leyes Físicas'], role: 'Destrucción elemental masiva en área con reacciones combinadas.' },
  { primary: 'Mago', sub: 'Clérigo', active: ['Nova Sagrada', 'Santuario de Maná'], passive: ['Gracia Divina', 'Sinergia de Fe'], role: 'Canalizador arcano-sagrado con regeneración y zonas de protección.' },
  { primary: 'Mago', sub: 'Potenciador', active: ['Sobrecarga Catalítica', 'Campo de Infusión'], passive: ['Maestría de Reactivos', 'Resonancia de Polvo Arcano'], role: 'Amplificador de consumibles, runas y daño explosivo de catalizadores.' },
  { primary: 'Guerrero', sub: 'Inquebrantable', active: ['Baluarte Titánico', 'Estocada de Acero Vengativa'], passive: ['Voluntad de Hierro', 'Absolución de Daño'], role: 'Duelista implacable que convierte el daño mitigado en contraataques.' },
  { primary: 'Guerrero', sub: 'Elementista', active: ['Corte de Hoja Rúnica', 'Imbuir Armadura Elemental'], passive: ['Furia Elemental', 'Conducción de Calor'], role: 'Espadachín elemental que infunde sus armas con fuego, hielo o rayo.' },
  { primary: 'Guerrero', sub: 'Clérigo', active: ['Golpe de Venganza Sagrada', 'Aura de Devoción'], passive: ['Martirio Justiciero', 'Resiliencia Bendita'], role: 'Paladín ofensivo de primera línea con robo de vida sagrado.' },
  { primary: 'Guerrero', sub: 'Potenciador', active: ['Inyección de Furia', 'Golpe Sísmico Rompe-Armaduras'], passive: ['Adrenalina Pura', 'Filo Afilado'], role: 'Berserker alquímico de daño físico bruto y ruptura de defensas.' },
  { primary: 'Tanque', sub: 'Inquebrantable', active: ['Carga de Embestida Sísmica', 'Provocación de Hierro Forjado'], passive: ['Muro de Escudos Inquebrantable', 'Resiliencia de Armadura'], role: 'Fortaleza viviente con control de masas y mitigación máxima.' },
  { primary: 'Tanque', sub: 'Elementista', active: ['Pisar de Magma Caliente', 'Baluarte de Escarcha'], passive: ['Aura Térmica Defensiva', 'Coraza Refractaria'], role: 'Guardián elemental que refleja daño térmico y ralentiza enemigos.' },
  { primary: 'Tanque', sub: 'Clérigo', active: ['Aura de Tierra Santa', 'Intervención Divina'], passive: ['Fervor Sagrado', 'Sacrificio Protector'], role: 'Protector consagrado inmune a estados alterados de la Niebla.' },
  { primary: 'Tanque', sub: 'Potenciador', active: ['Estandarte de Resistencia', 'Carga de Catalizador Explosivo'], passive: ['Maestría de Posicionamiento', 'Logística de Supervivencia'], role: 'Comandante táctico que optimiza bufs de comida, pociones y área.' }
];

const GATHERING_PROFESSIONS = ['Tala', 'Minería', 'Desuello', 'Pesca', 'Herboristería', 'Tejeduría'];
const CRAFTING_PROFESSIONS = ['Herrería', 'Peletería', 'Alquimia', 'Encantamiento', 'Cocina'];
const SAVE_KEY = 'wild-frontier-save-v1';

const state = {
  mode: 'title',
  time: 6 * 60,
  selectedClassId: 0,
  currentMapIndex: 0,
  player: null,
  map: null,
  resources: [],
  enemies: [],
  projectiles: [],
  particles: [],
  loot: [],
  corpse: null,
  mapSize: 2600,
  activePointerId: null,
  rotateDismissedOrientation: null,
  camera: { x: 0, y: 0 },
  input: { x: 0, y: 0, active: false },
  pointer: { x: 0, y: 0 },
  logging: [],
  bossActive: false,
  timeScale: 1,
  lastTime: 0,
  longitudinalColor: '#6ba78a',
  pause: false,
  inCamp: false,
  selectedSheetTab: 'inventario',
  audioEnabled: true
};

const RESOURCE_TYPES = {
  madera: { name: 'Madera', color: '#b5783b', value: 1 },
  cobre: { name: 'Cobre', color: '#ad8a58', value: 2 },
  pez: { name: 'Pescado', color: '#8ac8d8', value: 2 },
  hierba: { name: 'Hierba', color: '#79b565', value: 1 },
  lino: { name: 'Lino', color: '#d7d5a4', value: 2 },
  hierro: { name: 'Hierro', color: '#8f9aac', value: 3 },
  roble: { name: 'Roble', color: '#c7915a', value: 2 },
  seta: { name: 'Seta', color: '#c57ce0', value: 2 },
  piel: { name: 'Piel', color: '#c29573', value: 2 },
  raíz: { name: 'Raíz', color: '#5ea65d', value: 3 },
  'cuero ácido': { name: 'Cuero ácido', color: '#7bdb84', value: 3 },
  estaño: { name: 'Estaño', color: '#8ab7a9', value: 3 },
  hierba: { name: 'Hierba', color: '#82d363', value: 2 },
  pluma: { name: 'Pluma', color: '#ebd3a8', value: 2 },
  polvo: { name: 'Polvo arcano', color: '#b2a6ff', value: 3 },
  plata: { name: 'Plata', color: '#b9d1ea', value: 3 },
  reliquia: { name: 'Reliquia', color: '#e9cf9a', value: 4 },
  'acero glacial': { name: 'Acero glacial', color: '#a8d9e8', value: 4 },
  'piel de yeti': { name: 'Piel de yeti', color: '#dfe8f2', value: 4 },
  'flor de escarcha': { name: 'Flor de escarcha', color: '#bbebd8', value: 4 },
  obsidiana: { name: 'Obsidiana', color: '#6d4d8d', value: 4 },
  azufre: { name: 'Azufre', color: '#d8af52', value: 4 },
  escamas: { name: 'Escamas', color: '#d0c4d9', value: 4 },
  'madera férrea': { name: 'Madera férrea', color: '#7a8468', value: 4 },
  'veneno concentrado': { name: 'Veneno concentrado', color: '#8ed169', value: 4 },
  'seda umbría': { name: 'Seda umbría', color: '#7c8dc5', value: 4 },
  'cristal abisal': { name: 'Cristal abisal', color: '#8bc4ff', value: 5 },
  'mithril corrupto': { name: 'Mithril corrupto', color: '#ac8ef0', value: 5 },
  'esencia pura': { name: 'Esencia pura', color: '#dcb7ff', value: 5 },
  'icor abisal': { name: 'Icor abisal', color: '#cc5a60', value: 5 },
  'cuero mutado': { name: 'Cuero mutado', color: '#7d8e62', value: 5 },
  'hierba carmesí': { name: 'Hierba carmesí', color: '#d15e5d', value: 5 },
  'metal estelar': { name: 'Metal estelar', color: '#b5d0ed', value: 5 },
  'núcleo de rayo': { name: 'Núcleo de rayo', color: '#f7dc70', value: 5 },
  'piedra rúnica': { name: 'Piedra rúnica', color: '#f3bb7f', value: 5 },
  'aleación arquitecta': { name: 'Aleación arquitecta', color: '#b9ccd0', value: 6 },
  'condensador arcano': { name: 'Condensador arcano', color: '#7ce3d5', value: 6 },
  'fragmento dimensional': { name: 'Fragmento dimensional', color: '#d5afeb', value: 6 },
  'tela etérea': { name: 'Tela etérea', color: '#dff2ff', value: 6 },
  'núcleo primordial': { name: 'Núcleo primordial', color: '#cdc0ff', value: 7 },
  'plano legendario': { name: 'Plano legendario', color: '#f4d494', value: 7 },
  'carbón': { name: 'Carbón', color: '#6d5d5d', value: 2 },
  'arena': { name: 'Arena', color: '#d5b86e', value: 1 },
  'roca': { name: 'Roca', color: '#9ca3a3', value: 2 },
  'piedra': { name: 'Piedra', color: '#979ea6', value: 2 },
  'hierro bajo': { name: 'Hierro bajo', color: '#a0b0b5', value: 2 },
  'oros': { name: 'Oro', color: '#d7b156', value: 3 },
  'caza': { name: 'Carne', color: '#db6d5d', value: 2 }
};

const ENEMY_LIBRARY = buildEnemyLibrary();

function buildEnemyLibrary() {
  const root = [];
  const prefixes = ['Sombra', 'Tóxico', 'Cicatrizado', 'Lobo', 'Corrupto', 'Rápido', 'Ribereño', 'Gélido', 'Ferviente', 'Huesudo', 'Afilado', 'Mecánico', 'Eclipse', 'Mordedor', 'Ancestral', 'Orillero', 'Rúnico', 'Piloto', 'Umbral', 'Bárbaro'];
  const suffixes = ['Atacador', 'Merodeador', 'Mutilador', 'Cazador', 'Guardián', 'Rastreador', 'Desollador', 'Devorador', 'Espadachín', 'Mutilador', 'Aullador', 'Bastardo', 'Nómada', '146', 'Tyrant'];
  for (let i = 0; i < 90; i += 1) {
    const base = i % 14;
    const variant = ['Cangrejo', 'Lobo', 'Esqueleto', 'Slime', 'Araña', 'Bandido', 'Jabalí', 'Goblin', 'Reptil', 'Treant', 'Mutante', 'Gólem', 'Yeti', 'Cultista'][base % 14];
    const name = `${prefixes[i % prefixes.length]} ${variant} ${suffixes[(i * 3) % suffixes.length]}`;
    root.push({ id: i + 1, name, hp: 18 + (i % 10) * 9, damage: 4 + (i % 8), speed: 36 + (i % 7) * 6, xp: 8 + (i % 7) * 5, color: `hsl(${(i * 11) % 360}deg 65% 56%)` });
  }
  return root;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function nearby(a, b, radius) {
  return dist(a, b) < radius;
}

function hashMapKey(x, y) {
  return `${Math.floor(x / 80)}:${Math.floor(y / 80)}`;
}

function formatClock(minutes) {
  const hour = Math.floor(minutes / 60) % 24;
  const minute = Math.floor(minutes % 60);
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function logMessage(text, kind = '') {
  const item = document.createElement('div');
  item.className = `log-entry ${kind}`.trim();
  item.textContent = text;
  ui.combatLog.prepend(item);
  while (ui.combatLog.children.length > 5) {
    ui.combatLog.removeChild(ui.combatLog.lastChild);
  }
}

function safeLocalStorageGet(key) {
  try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; }
}

function safeLocalStorageSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (error) { console.warn('LocalStorage unavailable:', error); }
}

function getClassDef(id) {
  const safeId = Number.isInteger(id) ? ((id % HYBRID_CLASSES.length) + HYBRID_CLASSES.length) % HYBRID_CLASSES.length : 0;
  return HYBRID_CLASSES[safeId];
}

function classIndex(primaryId, subclassId = 0) {
  return primaryId * 4 + subclassId;
}

function applyClassChoice(primaryId, subclassId = null) {
  const p = state.player;
  if (!p || p.level < 15 || !Number.isInteger(primaryId) || primaryId < 0 || primaryId > 3) return false;
  if (p.primaryClassId !== null && p.primaryClassId !== primaryId) return false;
  if (subclassId !== null && (p.level < 30 || !Number.isInteger(subclassId) || subclassId < 0 || subclassId > 3)) return false;

  const firstClassSelection = p.primaryClassId === null;
  p.primaryClassId = primaryId;
  if (subclassId !== null) p.subclassId = subclassId;
  state.selectedClassId = classIndex(primaryId, p.subclassId ?? 0);
  const klass = getClassDef(state.selectedClassId);
  if (firstClassSelection) {
    if (klass.primary === 'Arquero') { p.speed += 10; p.attackDamage += 4; }
    if (klass.primary === 'Mago') { p.maxMana += 20; p.mana += 20; p.attackDamage += 5; }
    if (klass.primary === 'Guerrero') { p.maxHp += 20; p.hp += 20; p.attackDamage += 4; }
    if (klass.primary === 'Tanque') { p.maxHp += 35; p.hp += 35; p.attackDamage += 2; }
  }
  p.className = p.subclassId === null ? klass.primary : `${klass.primary} • ${klass.sub}`;
  p.skills = p.subclassId === null ? [klass.active[0]] : [...klass.active];
  p.skillCooldowns ||= [];
  p.skillCooldowns.length = p.skills.length;
  p.skillCooldownMax ||= [];
  p.classId = state.selectedClassId;
  p.classDisplay = klass;
  updateSkillButtons();
  syncHud();
  saveGame();
  return true;
}

function createPlayer(classId = 0) {
  const klass = getClassDef(classId);
  const p = {
    x: 400,
    y: 320,
    radius: 16,
    speed: 150,
    level: 1,
    xp: 0,
    nextLevelExp: 45,
    hp: 100,
    maxHp: 100,
    mana: 40,
    maxMana: 40,
    stamina: 100,
    maxStamina: 100,
    gold: 24,
    satiety: 100,
    classId,
    primaryClassId: null,
    subclassId: null,
    className: 'Aldeano',
    title: 'Superviviente',
    skills: [],
    skillCooldowns: [],
    skillCooldownMax: [],
    shelterLevel: 0,
    attackCooldown: 0,
    dodgeCooldown: 0,
    invulnerable: 0,
    facing: { x: 1, y: 0 },
    warpX: 0,
    warpY: 0,
    inventory: {
      madera: 4,
      piedra: 2,
      hierba: 3,
      pez: 2,
      piel: 1,
      cobre: 1,
      comida: 2,
      oro: 0,
      'hierro bajo': 0,
      'roble': 0,
      seta: 0,
      'raíz': 0,
      'veneno concentrado': 0,
      reliquia: 0,
      'madera férrea': 0,
      'flor de escarcha': 0,
      'metal estelar': 0,
      'esencia pura': 0
    },
    bank: {
      madera: 0,
      piedra: 0,
      hierba: 0,
      pez: 0,
      piel: 0,
      cobre: 0,
      comida: 0,
      oro: 0,
      'hierro bajo': 0,
      'roble': 0,
      seta: 0,
      'raíz': 0,
      'veneno concentrado': 0,
      reliquia: 0,
      'madera férrea': 0,
      'flor de escarcha': 0,
      'metal estelar': 0,
      'esencia pura': 0
    },
    gear: {
      weapon: 'Palo de viaje',
      armor: 'Pellejo de explorador',
      utility: 'Botas de viaje'
    },
    durability: 100,
    currentMap: 0,
    classDisplay: klass
  };

  const statBias = {
    initial: 1 + (classId % 4) * 0.06,
    attack: 1.0 + (classId % 4) * 0.08,
    armor: 1.0 + (classId % 4) * 0.10,
    magic: 1.0 + (classId % 3) * 0.09
  };

  if (klass.primary === 'Arquero') {
    p.speed = 170;
    p.maxHp = 92;
    p.hp = 92;
    p.maxMana = 44;
    p.mana = 44;
    p.attackDamage = 18 * statBias.attack;
  } else if (klass.primary === 'Mago') {
    p.speed = 155;
    p.maxHp = 80;
    p.hp = 80;
    p.maxMana = 62;
    p.mana = 62;
    p.attackDamage = 23 * statBias.magic;
  } else if (klass.primary === 'Guerrero') {
    p.speed = 160;
    p.maxHp = 110;
    p.hp = 110;
    p.maxMana = 36;
    p.mana = 36;
    p.attackDamage = 22 * statBias.attack;
  } else {
    p.speed = 140;
    p.maxHp = 120;
    p.hp = 120;
    p.maxMana = 32;
    p.mana = 32;
    p.attackDamage = 17 * statBias.attack;
  }

  p.maxStamina = 100;
  p.stamina = 100;
  return p;
}

function createMap(index) {
  if (!Number.isInteger(index) || index < 0 || index >= MAPS.length || !canEnterMap(index)) return false;
  const mapDef = MAPS[index];
  const map = {
    ...mapDef,
    size: state.mapSize,
    camp: { x: 210, y: 210 },
    safezone: 90
  };

  state.map = map;
  state.currentMapIndex = index;
  if (state.corpse && state.corpse.mapIndex !== index) state.corpse.visible = false;
  if (state.corpse && state.corpse.mapIndex === index) state.corpse.visible = true;

  const resourcePool = ['madera', 'piedra', 'hierba', 'pez', 'piel', 'cobre', 'roble', 'seta', 'raíz', 'pluma', 'carbón', 'hierro'];
  const nodes = [];
  for (let i = 0; i < 24; i += 1) {
    const kind = resourcePool[(i + index) % resourcePool.length];
    const x = 100 + Math.random() * (state.mapSize - 200);
    const y = 100 + Math.random() * (state.mapSize - 200);
    if (dist({ x, y }, { x: map.camp.x, y: map.camp.y }, 140) < 140) continue;
    nodes.push({
      id: `node-${i}`,
      kind,
      x,
      y,
      amount: 1 + Math.floor(Math.random() * 3),
      radius: 18,
      color: RESOURCE_TYPES[kind]?.color || '#d1d5cc'
    });
  }
  state.resources = nodes;

  const enemyNames = ENEMY_LIBRARY.filter((e) => e.id % (index + 2) !== 0).slice(0, 12 + index % 5);
  const enemies = [];
  for (let i = 0; i < enemyNames.length; i += 1) {
    const e = enemyNames[i];
    const node = nodes[i % nodes.length];
    enemies.push({
      id: `${index}-${i}`,
      name: `${e.name} · ${map.name}`,
      x: node ? node.x + rand(-80, 80) : rand(300, state.mapSize - 300),
      y: node ? node.y + rand(-80, 80) : rand(300, state.mapSize - 300),
      radius: 16,
      hp: (e.hp + index * 6) * (1 + index * 0.15),
      maxHp: (e.hp + index * 6) * (1 + index * 0.15),
      damage: e.damage + index,
      speed: e.speed * (1 + index * 0.08),
      xp: e.xp + index * 5,
      color: e.color,
      attackCooldown: 0,
      isBoss: false,
      lootDrop: ['madera', 'piedra', 'hierba', 'piel', 'carbón'][i % 5]
    });
  }
  if (index === MAPS.length - 1) {
    enemies.push({
      id: 'boss-final',
      name: 'Avatar de la Niebla',
      x: state.mapSize - 420,
      y: state.mapSize - 420,
      radius: 28,
      hp: 300 + index * 22,
      maxHp: 300 + index * 22,
      damage: 32,
      speed: 70,
      xp: 150,
      color: '#d8b3ff',
      attackCooldown: 0,
      isBoss: true,
      lootDrop: 'núcleo primordial'
    });
  }
  state.enemies = enemies;
  state.bossActive = index === MAPS.length - 1;

  if (state.player) {
    state.player.x = map.camp.x + 35;
    state.player.y = map.camp.y + 25;
  }
}

function syncHud() {
  const p = state.player;
  if (!p) return;

  const hpRatio = clamp(p.hp / p.maxHp, 0, 1);
  const mpRatio = clamp(p.mana / p.maxMana, 0, 1);
  const spRatio = clamp(p.stamina / p.maxStamina, 0, 1);
  const xpRatio = clamp(p.xp / p.nextLevelExp, 0, 1);

  ui.hpFill.style.width = `${hpRatio * 100}%`;
  ui.mpFill.style.width = `${mpRatio * 100}%`;
  ui.spFill.style.width = `${spRatio * 100}%`;
  ui.xpFill.style.width = `${xpRatio * 100}%`;
  ui.hpText.textContent = `${Math.ceil(p.hp)}/${p.maxHp}`;
  ui.mpText.textContent = `${Math.ceil(p.mana)}/${p.maxMana}`;
  ui.spText.textContent = `${Math.ceil(p.stamina)}/${p.maxStamina}`;
  ui.hudLevel.textContent = String(p.level);
  ui.hudClassName.textContent = p.className;
  ui.hudTitle.textContent = p.title;
  ui.hudGold.textContent = `◈ ${p.gold}`;
  ui.hudClock.textContent = formatClock(state.time);
  ui.hudHazard.textContent = state.map?.hazard || 'Sin peligro';
  ui.shield.textContent = `🍖 ${Math.round(p.satiety)}%`;
  ui.minimapLabel.textContent = state.map?.name || 'Mapa';

  const activeClass = getClassDef(state.selectedClassId);
  if (activeClass) {
    ui.hudClassName.textContent = `${activeClass.primary} • ${activeClass.sub}`;
  }
}

function updateSkillButtons() {
  const skills = state.player?.skills || [];
  ui.skillButtons.forEach((button, index) => {
    const skill = skills[index] || '';
    const slot = button.querySelector('small');
    const glyph = button.querySelector('.glyph');
    const cooldown = state.player?.skillCooldowns?.[index] || 0;
    const cooldownMax = state.player?.skillCooldownMax?.[index] || 1;
    const cooldownFill = button.querySelector('.cd-fill');
    const available = Boolean(skill);
    slot.textContent = skill ? (skill.length > 7 ? skill.slice(0, 7) : skill) : '';
    glyph.textContent = index % 2 === 0 ? '✦' : '✧';
    button.disabled = !available || state.mode !== 'game' || state.pause;
    button.title = skill ? `${skill} · ${index === 0 ? '12' : '18'} maná` : 'Habilidad no disponible';
    button.setAttribute('aria-label', skill ? `Usar ${skill}, cuesta ${index === 0 ? 12 : 18} de maná` : 'Habilidad no disponible');
    if (cooldownFill) cooldownFill.style.height = `${Math.min(100, (cooldown / cooldownMax) * 100)}%`;
    button.classList.toggle('on-cooldown', cooldown > 0);
  });
}

function createRewardLootFromNode(node) {
  return { kind: node.kind, x: node.x, y: node.y, amount: node.amount, radius: 9, life: 8, color: node.color };
}

function applyInventory(kind, amount = 1) {
  if (!state.player.inventory[kind] && !RESOURCE_TYPES[kind]) return false;
  if (!state.player.inventory[kind]) state.player.inventory[kind] = 0;
  state.player.inventory[kind] += amount;
  return true;
}

function spendInventory(recipe) {
  for (const [key, value] of Object.entries(recipe.cost)) {
    if ((state.player.inventory[key] || 0) < value) return false;
  }
  for (const [key, value] of Object.entries(recipe.cost)) {
    state.player.inventory[key] -= value;
  }
  return true;
}

function levelUpIfNeeded() {
  const p = state.player;
  while (p.xp >= p.nextLevelExp) {
    p.xp -= p.nextLevelExp;
    p.level += 1;
    p.nextLevelExp = Math.round(p.nextLevelExp * 1.42);
    p.maxHp += 12;
    p.maxMana += 6;
    p.maxStamina += 8;
    p.hp = p.maxHp;
    p.mana = p.maxMana;
    p.stamina = p.maxStamina;
    logMessage(`Nivel ${p.level} alcanzado. Resistencia reforzada.`, 'warn');
  }
}

function generateSaveData() {
  return {
    selectedClassId: state.selectedClassId,
    currentMapIndex: state.currentMapIndex,
    player: state.player,
    time: state.time,
    map: state.map,
    corpse: state.corpse
  };
}

function saveGame() {
  safeLocalStorageSet(SAVE_KEY, generateSaveData());
}

function loadGame() {
  const data = safeLocalStorageGet(SAVE_KEY);
  if (!data || !data.player) return false;
  state.player = data.player;
  state.player.primaryClassId ??= null;
  state.player.subclassId ??= null;
  state.player.inventory ||= {};
  state.player.bank ||= {};
  state.selectedClassId = Number.isInteger(data.selectedClassId) ? data.selectedClassId : 0;
  const savedMapIndex = Number.isInteger(data.currentMapIndex) ? data.currentMapIndex : 0;
  state.currentMapIndex = canEnterMap(savedMapIndex, state.player.level) ? savedMapIndex : 0;
  state.time = data.time ?? 360;
  state.corpse = data.corpse || null;
  if (state.corpse && !Number.isInteger(state.corpse.mapIndex)) {
    state.corpse.mapIndex = state.currentMapIndex;
  }
  createMap(state.currentMapIndex);
  state.player.x = state.map.camp.x + 30;
  state.player.y = state.map.camp.y + 30;
  ui.titleScreen.classList.add('hidden');
  ui.hud.classList.remove('hidden');
  ui.joystick.classList.remove('hidden');
  state.pause = false;
  ui.pauseScreen.classList.add('hidden');
  ui.btnPauseTop.textContent = 'Ⅱ';
  ui.btnPauseTop.setAttribute('aria-label', 'Pausar');
  state.mode = 'game';
  updateSkillButtons();
  syncHud();
  return true;
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  ui.toastStack.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 1800);
}

function showSheet(title, kicker, bodyHtml, tabs = []) {
  ui.overlay.classList.remove('hidden');
  ui.sheetTitle.textContent = title;
  ui.sheetKicker.textContent = kicker;
  ui.sheetBody.innerHTML = bodyHtml;
  ui.sheetTabs.innerHTML = '';
  tabs.forEach((tab, index) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `sheet-tab ${index === 0 ? 'active' : ''}`;
    btn.textContent = tab;
    btn.addEventListener('click', () => {
      ui.sheetTabs.querySelectorAll('.sheet-tab').forEach((el) => el.classList.toggle('active', el === btn));
      state.selectedSheetTab = tab.toLowerCase();
      if (tab.toLowerCase() === 'inventario') renderInventorySheet();
      if (tab.toLowerCase() === 'crafteo') renderCraftingSheet();
      if (tab.toLowerCase() === 'clases') renderClassSheet();
      if (tab.toLowerCase() === 'mapa') renderMapSheet();
    });
    ui.sheetTabs.appendChild(btn);
  });
  ui.sheetFoot.innerHTML = '<button class="btn btn-ghost" type="button" id="closeSheetButton">Cerrar</button>';
  document.getElementById('closeSheetButton').addEventListener('click', closeSheet);
}

function closeSheet() {
  ui.overlay.classList.add('hidden');
  ui.detailSheet.classList.add('hidden');
}

function formatInventoryList() {
  const entries = Object.entries(state.player.inventory)
    .filter(([_, value]) => value > 0)
    .map(([key, value]) => `<li><span>${RESOURCE_TYPES[key]?.name || key}</span><strong>x${value}</strong></li>`);
  return entries.length ? `<ul class="resource-list">${entries.join('')}</ul>` : '<p>No llevas materiales.</p>';
}

function renderInventorySheet() {
  const bagStats = `
    <div class="stat-card-grid">
      <div class="stat-card"><label>Oro</label><strong>${state.player.gold}</strong></div>
      <div class="stat-card"><label>Durabilidad</label><strong>${Math.round(state.player.durability)}%</strong></div>
      <div class="stat-card"><label>Refugio</label><strong>${state.player.bank ? 'Banco activo' : 'Sin acceso'}</strong></div>
      <div class="stat-card"><label>Satiety</label><strong>${Math.round(state.player.satiety)}%</strong></div>
    </div>
  `;
  showSheet('Inventario', 'MOCHILA', `${bagStats}${formatInventoryList()}`);
}

function renderCraftingSheet() {
  const recipes = [
    { name: 'Poción de vigor', cost: { hierba: 2, pez: 1 } },
    { name: 'Tienda de refugio', cost: { madera: 3, piel: 2 } },
    { name: 'Punta de acero', cost: { hierro: 2, piedra: 1 } },
    { name: 'Pechera de cuero', cost: { piel: 3, roble: 1 } },
    { name: 'Alimento de campaña', cost: { pez: 1, hierba: 2 } },
    { name: 'Runa menor', cost: { piedra: 2, seta: 1 } }
  ];

  const html = `
    <div class="recipe-list">
      ${recipes.map((recipe) => `
        <button class="recipe-item" data-recipe="${recipe.name}">
          <strong>${recipe.name}</strong>
          <span>${Object.entries(recipe.cost).map(([k, v]) => `${RESOURCE_TYPES[k]?.name || k} x${v}`).join(' · ')}</span>
        </button>
      `).join('')}
    </div>
  `;
  showSheet('Crafteo', 'FABRICA', html, ['Inventario', 'Crafteo', 'Clases', 'Mapa']);
  document.querySelectorAll('.recipe-item').forEach((item) => {
    item.addEventListener('click', () => {
      const recipe = recipes.find(({ name }) => name === item.dataset.recipe);
      if (!recipe || !spendInventory(recipe.cost)) {
        showToast('Faltan materiales.');
        return;
      }
      const p = state.player;
      switch (recipe.name) {
        case 'Poción de vigor':
          p.mana = p.maxMana;
          p.stamina = p.maxStamina;
          showToast('Poción preparada: maná y aguante restaurados.');
          break;
        case 'Tienda de refugio':
          p.shelterLevel = (p.shelterLevel || 0) + 1;
          p.bank ||= {};
          showToast('Tienda armada: refugio mejorado y banco habilitado.');
          break;
        case 'Punta de acero':
          p.attackDamage = (p.attackDamage || 20) + 5;
          p.gear.weapon = 'Punta de acero';
          showToast('Punta reforzada: daño de ataque +5.');
          break;
        case 'Pechera de cuero':
          p.gear.armor = 'Pechera de cuero';
          p.armorRating = (p.armorRating || 0) + 4;
          showToast('Pechera equipada: recibes menos daño.');
          break;
        case 'Alimento de campaña':
          p.satiety = Math.min(100, p.satiety + 45);
          p.hp = Math.min(p.maxHp, p.hp + Math.round(p.maxHp * 0.2));
          showToast('Ración consumida: saciedad y salud recuperadas.');
          break;
        case 'Runa menor':
          p.maxMana += 10;
          p.mana = Math.min(p.maxMana, p.mana + 10);
          p.gear.utility = 'Runa menor';
          showToast('Runa inscrita: maná máximo +10.');
          break;
      }
      syncHud();
      saveGame();
      renderCraftingSheet();
    });
  });
}

function renderClassSheet() {
  const p = state.player;
  let choices = [];
  let heading = '';
  if (p.level < 15) {
    heading = `<p>Alcanza el nivel 15 para elegir tu clase primaria. Nivel actual: ${p.level}.</p>`;
  } else if (p.primaryClassId === null) {
    heading = '<p>Elige una clase primaria. Esta decisión es permanente.</p>';
    choices = [...new Set(HYBRID_CLASSES.map((klass) => klass.primary))].map((primary, primaryId) => ({
      primaryId,
      label: primary,
      klass: HYBRID_CLASSES[classIndex(primaryId, 0)]
    }));
  } else if (p.level < 30) {
    const klass = getClassDef(classIndex(p.primaryClassId, 0));
    heading = `<p>Clase primaria: <strong>${klass.primary}</strong>. Alcanza el nivel 30 para elegir una subclase.</p>`;
  } else if (p.subclassId === null) {
    heading = `<p>Elige una subclase para ${getClassDef(classIndex(p.primaryClassId, 0)).primary}.</p>`;
    choices = Array.from({ length: 4 }, (_, subclassId) => ({
      primaryId: p.primaryClassId,
      subclassId,
      label: HYBRID_CLASSES[classIndex(p.primaryClassId, subclassId)].sub,
      klass: HYBRID_CLASSES[classIndex(p.primaryClassId, subclassId)]
    }));
  } else {
    const klass = getClassDef(state.selectedClassId);
    heading = `<p>Clase actual: <strong>${klass.primary} / ${klass.sub}</strong>. Tus elecciones están completas.</p>`;
  }
  const rows = choices.map(({ primaryId, subclassId, label, klass }) => `
    <button class="class-row" data-primary-id="${primaryId}" ${subclassId === undefined ? '' : `data-subclass-id="${subclassId}"`}>
      <span><strong>${label}</strong>${subclassId === undefined ? '' : ` / ${klass.sub}`}</span>
      <small>${klass.role} · ${klass.active.join(' • ')}</small>
    </button>
  `).join('');
  showSheet('Clases híbridas', 'MATRIZ', `${heading}<div class="class-list">${rows}</div>`, ['Inventario', 'Crafteo', 'Clases', 'Mapa']);
  document.querySelectorAll('.class-row').forEach((row) => {
    row.addEventListener('click', () => {
      const primaryId = Number(row.dataset.primaryId);
      const subclassId = row.dataset.subclassId === undefined ? null : Number(row.dataset.subclassId);
      if (!applyClassChoice(primaryId, subclassId)) {
        showToast('Esta elección aún no está disponible.');
        return;
      }
      logMessage(`Clase elegida: ${state.player.className}.`, 'warn');
      renderClassSheet();
    });
  });
}

function mapRequiredLevel(index) {
  const tier = MAPS[index]?.tier;
  return tier ? [0, 1, 16, 31, 46, 56][tier] : Infinity;
}

function canEnterMap(index, level = state.player?.level || 1) {
  return Number.isInteger(index) && index >= 0 && index < MAPS.length && level >= mapRequiredLevel(index);
}

function renderMapSheet() {
  const html = MAPS.map((map, idx) => {
    const unlocked = canEnterMap(idx);
    return `
      <button class="map-row ${idx === state.currentMapIndex ? 'active' : ''}" data-map-index="${idx}" ${unlocked ? '' : 'disabled aria-disabled="true"'}>
        <strong>${map.name}</strong>
        <small>${map.tierName}${unlocked ? '' : ` · Requiere nivel ${mapRequiredLevel(idx)}`}</small>
      </button>
    `;
  }).join('');
  showSheet('Mapa', 'FRONTERA', `<div class="map-list">${html}</div>`, ['Inventario', 'Crafteo', 'Clases', 'Mapa']);
  document.querySelectorAll('.map-row').forEach((row) => {
    row.addEventListener('click', () => {
      const idx = Number(row.dataset.mapIndex);
      if (!canEnterMap(idx)) {
        showToast(`Necesitas nivel ${mapRequiredLevel(idx)} para entrar.`);
        return;
      }
      if (!createMap(idx)) {
        showToast('No se pudo acceder a ese mapa.');
        return;
      }
      state.player.x = state.map.camp.x + 30;
      state.player.y = state.map.camp.y + 30;
      syncHud();
      saveGame();
      closeSheet();
    });
  });
}

function getNearestResource() {
  let best = null;
  for (const node of state.resources) {
    if (dist(node, state.player) < 64 && (!best || dist(node, state.player) < dist(best, state.player))) {
      best = node;
    }
  }
  return best;
}

function gatherResource() {
  const near = getNearestResource();
  if (!near) {
    showToast('No hay recursos cerca.');
    return;
  }
  const value = near.amount ?? 1;
  applyInventory(near.kind, value);
  showToast(`${RESOURCE_TYPES[near.kind]?.name || near.kind} recogido.`);
  state.resources = state.resources.filter((node) => node !== near);
  state.loot.push(createRewardLootFromNode(near));
  state.player.xp += 5;
  levelUpIfNeeded();
  syncHud();
}

function showCampAction() {
  const camp = state.map?.camp;
  const inCamp = camp && dist(camp, state.player) < 120;
  state.inCamp = inCamp;
  ui.campActions.classList.toggle('hidden', !inCamp);
}

function campRecover() {
  if (!state.inCamp) {
    showToast('Acércate al refugio.');
    return;
  }
  state.player.hp = state.player.maxHp;
  state.player.mana = state.player.maxMana;
  state.player.stamina = state.player.maxStamina;
  state.player.satiety = 100;
  logMessage('Refugio: descanso completo, alimento y heridas reconstituidas.', 'warn');
  saveGame();
  syncHud();
}

function skillConfigFor(skill, slot) {
  const name = skill.toLowerCase();
  const configs = [
    { cost: 12, cooldown: 5, damage: 2.2, radius: 140, heal: 0.1, shield: 0 },
    { cost: 18, cooldown: 9, damage: 1.5, radius: 190, heal: 0, shield: 0.18 }
  ];
  const config = { ...configs[Math.min(slot, 1)] };
  if (/escudo|baluarte|muro|coraza|santuario|aura|estandarte|intervención|intervencion/i.test(name)) {
    config.damage = /aura|santuario|muro/i.test(name) ? 0.7 : 0.5;
    config.heal = Math.max(config.heal, /sagrado|divina|purificación|purificacion|santuario/i.test(name) ? 0.2 : 0);
    config.shield = Math.max(config.shield, /escudo|baluarte|muro|coraza|estandarte/i.test(name) ? 0.3 : 0.08);
  }
  if (/cura|sanación|sanacion|purificación|purificacion|sagrado|sagrada|clérigo|clerigo|divina/i.test(name)) {
    config.heal = Math.max(config.heal, 0.24);
  }
  if (/trampa|veneno|explosivo|sísmico|sismico|nova|tormenta|convergente|sobrecarga/i.test(name)) {
    config.damage *= 1.25;
    config.radius += 35;
  }
  if (/carga|embestida|estocada|disparo|flecha|saeta|golpe|corte|pulso/i.test(name)) {
    config.damage *= 1.15;
  }
  return config;
}

function activateSkill(slot) {
  const p = state.player;
  const skill = p?.skills?.[slot];
  if (!p || state.mode !== 'game' || state.pause || !skill) return false;
  p.skillCooldowns ||= [];
  p.skillCooldownMax ||= [];
  const config = skillConfigFor(skill, slot);
  if ((p.skillCooldowns[slot] || 0) > 0) return false;
  if (p.mana < config.cost) {
    showToast(`Maná insuficiente para ${skill}.`);
    return false;
  }

  p.mana -= config.cost;
  p.skillCooldowns[slot] = config.cooldown;
  p.skillCooldownMax[slot] = config.cooldown;
  const enemies = state.enemies
    .map((enemy) => ({ enemy, distance: dist(enemy, p) }))
    .filter(({ distance }) => distance <= config.radius)
    .sort((a, b) => a.distance - b.distance);
  const target = enemies[0]?.enemy;
  const healAmount = config.heal ? Math.max(1, Math.round(p.maxHp * config.heal)) : 0;
  if (healAmount) p.hp = Math.min(p.maxHp, p.hp + healAmount);
  if (config.shield) p.invulnerable = Math.max(p.invulnerable, 0.8 + config.shield * 2);

  if (target && config.damage > 0) {
    const damage = Math.round((p.attackDamage || 18) * config.damage);
    if (config.radius > 150) {
      for (const { enemy, distance } of enemies) {
        if (distance <= config.radius) {
          enemy.hp -= Math.max(1, Math.round(damage * (enemy === target ? 1 : 0.65)));
          createBurst(enemy.x, enemy.y, '#c6a9ff');
        }
      }
    } else {
      target.hp -= damage;
      createBurst(target.x, target.y, '#c6a9ff');
    }
  } else if (target && config.heal) {
    target.hp -= Math.max(1, Math.round((p.attackDamage || 18) * config.damage));
    createBurst(target.x, target.y, '#c6a9ff');
  }

  const effects = [];
  if (config.damage > 0 && target) effects.push(`impacta ${target.name}`);
  if (healAmount) effects.push(`recuperas ${healAmount} de salud`);
  if (config.shield) effects.push('ganas una breve protección');
  logMessage(`${skill}: ${effects.length ? effects.join(' y ') : 'energía canalizada'}.`, 'warn');
  showToast(`${skill} · −${config.cost} maná`);
  syncHud();
  updateSkillButtons();
  return true;
}

function performAttack() {
  const p = state.player;
  if (!p || p.attackCooldown > 0) return;
  p.attackCooldown = 0.35;
  const target = findNearestEnemy(150);
  const dir = target ? { x: target.x - p.x, y: target.y - p.y } : p.facing;
  const len = Math.hypot(dir.x, dir.y) || 1;
  const vx = (dir.x / len) * 320;
  const vy = (dir.y / len) * 320;
  state.projectiles.push({
    x: p.x,
    y: p.y,
    vx,
    vy,
    radius: 8,
    damage: p.attackDamage || 18,
    color: '#f9d894',
    life: 0.7,
    from: 'player'
  });
  if (target) {
    target.hp -= (p.attackDamage || 18) * 0.9;
    logMessage(`${p.className} golpea: ${target.name}`, 'warn');
  }
  p.stamina = Math.max(0, p.stamina - 5);
  syncHud();
}

function dodge() {
  const p = state.player;
  if (!p || p.dodgeCooldown > 0) return;
  p.dodgeCooldown = 1.6;
  p.invulnerable = 0.65;
  const dirX = p.facing.x || 1;
  const dirY = p.facing.y || 0;
  p.x += dirX * 45;
  p.y += dirY * 45;
  p.stamina = Math.max(0, p.stamina - 18);
  logMessage('Golpe de evasión ejecutado.', 'warn');
  syncHud();
}

function findNearestEnemy(range = 200) {
  let nearest = null;
  let nearestDistance = Infinity;
  for (const enemy of state.enemies) {
    const d = dist(enemy, state.player);
    if (d < range && d < nearestDistance) {
      nearest = enemy;
      nearestDistance = d;
    }
  }
  return nearest;
}

function updatePlayer(dt) {
  const p = state.player;
  if (!p) return;

  p.attackCooldown = Math.max(0, p.attackCooldown - dt);
  p.dodgeCooldown = Math.max(0, p.dodgeCooldown - dt);
  p.invulnerable = Math.max(0, p.invulnerable - dt);
  p.mana = Math.min(p.maxMana, p.mana + dt * 1.2);
  p.skillCooldowns = (p.skillCooldowns || []).map((cooldown) => Math.max(0, cooldown - dt));
  p.satiety = Math.max(0, p.satiety - dt * 0.9);

  if (p.satiety <= 0) {
    p.hp -= dt * 7;
    if (p.hp <= 0) die();
  }

  const moveX = state.input.x;
  const moveY = state.input.y;
  const len = Math.hypot(moveX, moveY) || 1;
  const nx = moveX / len;
  const ny = moveY / len;

  if (Math.abs(moveX) > 0.05 || Math.abs(moveY) > 0.05) {
    p.facing.x = nx;
    p.facing.y = ny;
    const moveSpeed = p.speed * (0.7 + p.stamina / 140);
    p.x += nx * moveSpeed * dt;
    p.y += ny * moveSpeed * dt;
    p.stamina = Math.max(0, p.stamina - dt * 8);
  } else {
    p.stamina = Math.min(p.maxStamina, p.stamina + dt * 12);
  }

  p.x = clamp(p.x, 35, state.mapSize - 35);
  p.y = clamp(p.y, 35, state.mapSize - 35);
  state.camera.x = p.x;
  state.camera.y = p.y;
  ui.touchHint.classList.toggle('hidden', state.input.active);
  showCampAction();
  syncHud();
  updateSkillButtons();
}

function updateProjectiles(dt) {
  for (const projectile of state.projectiles) {
    projectile.x += projectile.vx * dt;
    projectile.y += projectile.vy * dt;
    projectile.life -= dt;

    for (const enemy of state.enemies) {
      if (!enemy || projectile.from !== 'player') continue;
      if (dist(enemy, projectile) < enemy.radius + projectile.radius) {
        enemy.hp -= projectile.damage;
        projectile.life = 0;
        createBurst(projectile.x, projectile.y, '#fdd67b');
        break;
      }
    }
  }

  state.projectiles = state.projectiles.filter((proj) => proj.life > 0 && proj.x > 0 && proj.x < state.mapSize && proj.y > 0 && proj.y < state.mapSize);
}

function updateEnemies(dt) {
  for (const enemy of state.enemies) {
    if (!enemy) continue;
    const dx = state.player.x - enemy.x;
    const dy = state.player.y - enemy.y;
    const distToPlayer = Math.hypot(dx, dy) || 1;
    if (distToPlayer < 480) {
      enemy.x += (dx / distToPlayer) * enemy.speed * dt;
      enemy.y += (dy / distToPlayer) * enemy.speed * dt;
    }

    enemy.attackCooldown = Math.max(0, enemy.attackCooldown - dt);
    if (distToPlayer < enemy.radius + state.player.radius + 12 && enemy.attackCooldown <= 0) {
      const damage = Math.max(4, enemy.damage - (state.player.classId % 4));
      state.player.hp -= damage;
      state.player.invulnerable = 0.2;
      createBurst(state.player.x, state.player.y, '#ff7a7a');
      logMessage(`${enemy.name} te golpea por ${damage}.`, 'bad');
      enemy.attackCooldown = 0.8;
      if (state.player.hp <= 0) {
        die();
        return;
      }
    }

    if (enemy.hp <= 0) {
      state.player.xp += enemy.xp;
      state.player.gold += 4 + Math.floor(Math.random() * 6);
      createBurst(enemy.x, enemy.y, '#c9e57d');
      state.enemies = state.enemies.filter((item) => item !== enemy);
      if (Math.random() < 0.65) {
        state.loot.push({
          x: enemy.x,
          y: enemy.y,
          kind: enemy.lootDrop || 'madera',
          amount: 1,
          radius: 8,
          life: 14,
          color: RESOURCE_TYPES[enemy.lootDrop]?.color || '#a1d9ad'
        });
      }
      levelUpIfNeeded();
      logMessage(`${enemy.name} abatido.`, 'warn');
      break;
    }
  }
}

function createBurst(x, y, color) {
  for (let i = 0; i < 6; i += 1) {
    state.particles.push({
      x,
      y,
      dx: rand(-50, 50),
      dy: rand(-50, 50),
      radius: rand(2, 5),
      life: rand(0.3, 0.7),
      color,
      alpha: 1,
      fromPool: false
    });
  }
}

function updateParticles(dt) {
  for (const particle of state.particles) {
    particle.x += particle.dx * dt;
    particle.y += particle.dy * dt;
    particle.life -= dt;
    particle.alpha = Math.max(0, particle.life * 1.3);
  }
  state.particles = state.particles.filter((p) => p.life > 0);
}

function updateLoot(dt) {
  for (const item of state.loot) {
    item.life -= dt;
    if (dist(item, state.player) < 28) {
      applyInventory(item.kind, item.amount);
      state.player.gold += 1;
      showToast(`${RESOURCE_TYPES[item.kind]?.name || item.kind} recogido.`);
      state.loot = state.loot.filter((entry) => entry !== item);
      break;
    }
  }
  state.loot = state.loot.filter((item) => item.life > 0);
}

function die() {
  const p = state.player;
  const xpLoss = Math.max(0, Math.floor(p.xp * 0.4));
  const durabilityLoss = 14 + Math.random() * 16;
  p.xp = Math.max(0, p.xp - xpLoss);
  p.durability = Math.max(0, p.durability - durabilityLoss);
  const inventoryEntries = Object.entries(p.inventory)
    .map(([key, amount]) => [key, Math.max(0, Math.floor(amount || 0))])
    .filter(([, amount]) => amount > 0);
  const totalItems = inventoryEntries.reduce((sum, [, amount]) => sum + amount, 0);
  const corpseTarget = Math.round(totalItems * 0.8);
  const corpseInventory = {};
  let corpseAssigned = 0;
  const shares = inventoryEntries.map(([key, amount], order) => {
    const exactShare = amount * 0.8;
    const wholeShare = Math.floor(exactShare);
    corpseAssigned += wholeShare;
    return { key, amount, order, lost: wholeShare, remainder: exactShare - wholeShare };
  });
  shares.sort((a, b) => b.remainder - a.remainder || a.order - b.order);
  for (let i = 0; corpseAssigned < corpseTarget && i < shares.length; i += 1) {
    if (shares[i].lost < shares[i].amount) {
      shares[i].lost += 1;
      corpseAssigned += 1;
    }
  }
  for (const { key, amount, lost } of shares) {
    if (lost > 0) corpseInventory[key] = lost;
    p.inventory[key] = amount - lost;
  }
  state.corpse = {
    x: p.x,
    y: p.y,
    mapIndex: state.currentMapIndex,
    title: 'Cadáver del Explorador',
    loot: corpseInventory,
    active: true,
    visible: true,
    radius: 26
  };
  p.hp = p.maxHp * 0.45;
  p.mana = p.maxMana * 0.35;
  p.stamina = p.maxStamina * 0.55;
  p.x = state.map.camp.x + 30;
  p.y = state.map.camp.y + 30;
  p.gold = Math.max(0, p.gold - 12);
  logMessage('Has caído. El cadáver guarda el 80% del botín no bancario.', 'bad');
  showToast('Cadáver caído: recupera tu botín en la tumba.');
  saveGame();
  syncHud();
}

function updateCorpses() {
  const corpse = state.corpse;
  if (!corpse || corpse.mapIndex !== state.currentMapIndex) return;
  if (dist(corpse, state.player) < 40) {
    const bodyLoot = Object.entries(corpse.loot || {});
    if (bodyLoot.length) {
      bodyLoot.forEach(([key, amount]) => applyInventory(key, amount));
      logMessage('Cadáver recuperado: tu botín vuelve a ti.', 'warn');
      showToast('Botín del cadáver recuperado.');
    }
    state.corpse = null;
    saveGame();
    syncHud();
  }
}

function render() {
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const px = state.camera.x - w / 2;
  const py = state.camera.y - h / 2;

  ctx.fillStyle = '#19251d';
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.translate(-px, -py);

  const mapColor = state.map?.tier === 1 ? '#5e7d57' : state.map?.tier === 2 ? '#67775b' : state.map?.tier === 3 ? '#7a8da2' : state.map?.tier === 4 ? '#5d4f7e' : '#3d3d4a';
  ctx.fillStyle = mapColor;
  ctx.fillRect(0, 0, state.mapSize, state.mapSize);

  for (let x = 0; x <= state.mapSize; x += 120) {
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, state.mapSize); ctx.stroke();
  }
  for (let y = 0; y <= state.mapSize; y += 120) {
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(state.mapSize, y); ctx.stroke();
  }

  const camp = state.map?.camp || { x: 220, y: 220 };
  ctx.fillStyle = '#d18d55';
  ctx.beginPath(); ctx.arc(camp.x, camp.y, 44, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#f6d3a2';
  ctx.fillRect(camp.x - 12, camp.y - 10, 24, 20);

  for (const node of state.resources) {
    ctx.fillStyle = node.color;
    ctx.beginPath(); ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2); ctx.fill();
  }

  for (const enemy of state.enemies) {
    ctx.fillStyle = enemy.color;
    ctx.beginPath(); ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(enemy.x - 18, enemy.y - 26, 36, 4);
    ctx.fillStyle = '#ef7d7d';
    ctx.fillRect(enemy.x - 18, enemy.y - 26, 36 * (enemy.hp / enemy.maxHp), 4);
  }

  for (const item of state.loot) {
    ctx.fillStyle = item.color || '#d7c68f';
    ctx.beginPath(); ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2); ctx.fill();
  }

  if (state.corpse && state.corpse.visible && state.corpse.mapIndex === state.currentMapIndex) {
    ctx.fillStyle = '#8a8379';
    ctx.beginPath(); ctx.arc(state.corpse.x, state.corpse.y, 16, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#d0cab1';
    ctx.fillRect(state.corpse.x - 12, state.corpse.y + 10, 24, 10);
  }

  for (const p of state.particles) {
    ctx.fillStyle = p.color.replace(')', `, ${Math.max(0, p.alpha)})`).replace('hsl', 'hsla');
    ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill();
  }

  const player = state.player;
  if (player) {
    ctx.fillStyle = '#d9e6f1';
    ctx.beginPath(); ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f9da7a';
    const aimX = player.x + player.facing.x * 18;
    const aimY = player.y + player.facing.y * 18;
    ctx.beginPath(); ctx.moveTo(player.x, player.y); ctx.lineTo(aimX, aimY); ctx.strokeStyle = '#f9da7a'; ctx.lineWidth = 3; ctx.stroke();
  }

  for (const projectile of state.projectiles) {
    ctx.fillStyle = projectile.color;
    ctx.beginPath(); ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2); ctx.fill();
  }

  ctx.restore();

  drawMinimap();
}

function drawMinimap() {
  const mini = ui.minimap.getContext('2d');
  const size = 140;
  mini.clearRect(0, 0, size, size);
  mini.fillStyle = '#0a100f';
  mini.fillRect(0, 0, size, size);

  const scale = size / state.mapSize;
  for (const node of state.resources) {
    mini.fillStyle = node.color;
    mini.fillRect(node.x * scale, node.y * scale, 4, 4);
  }
  for (const enemy of state.enemies) {
    mini.fillStyle = '#f26d6d';
    mini.fillRect(enemy.x * scale, enemy.y * scale, 3, 3);
  }
  mini.fillStyle = '#f5cf84';
  mini.fillRect(state.player.x * scale - 3, state.player.y * scale - 3, 6, 6);
  mini.strokeStyle = '#d0dfe7';
  mini.strokeRect(0, 0, size, size);
}

function updateTracker() {
  if (!state.map) return;
  const progress = clamp((state.currentMapIndex + 1) / MAPS.length, 0, 1);
  ui.trackerFill.style.width = `${progress * 100}%`;
  ui.trackerCount.textContent = `${state.currentMapIndex + 1}/${MAPS.length}`;
  ui.trackerTitle.textContent = state.map.name;
  ui.trackerDesc.textContent = `${state.map.hazard} · ${state.map.resources}`;
}

function updateBossBar() {
  const boss = state.enemies.find((item) => item.isBoss);
  if (!boss) {
    ui.bossBar.classList.add('hidden');
    return;
  }
  ui.bossBar.classList.remove('hidden');
  ui.bossName.textContent = boss.name;
  ui.bossFill.style.width = `${(boss.hp / boss.maxHp) * 100}%`;
  ui.bossSub.textContent = `FASE ${boss.hp < boss.maxHp * 0.5 ? 'II' : 'I'}`;
}

function updateHudClock() {
  ui.hudClock.textContent = formatClock(state.time);
}

function animate(timestamp) {
  if (!state.lastTime) state.lastTime = timestamp;
  const dt = Math.min(0.032, (timestamp - state.lastTime) / 1000);
  state.lastTime = timestamp;
  if (state.mode === 'game' && !state.pause) {
    state.time += dt * 11 * state.timeScale;
    updatePlayer(dt);
    updateProjectiles(dt);
    updateEnemies(dt);
    updateParticles(dt);
    updateLoot(dt);
    updateCorpses();
    updateBossBar();
    updateTracker();
    updateHudClock();
  }
  render();
  requestAnimationFrame(animate);
}

function startNewGame(classId = 0) {
  state.selectedClassId = classId;
  state.player = createPlayer(classId);
  state.player.gold = 28;
  state.player.durability = 100;
  state.currentMapIndex = 0;
  createMap(0);
  state.mode = 'game';
  ui.titleScreen.classList.add('hidden');
  ui.hud.classList.remove('hidden');
  ui.joystick.classList.remove('hidden');
  state.pause = false;
  ui.pauseScreen.classList.add('hidden');
  ui.btnPauseTop.textContent = 'Ⅱ';
  ui.btnPauseTop.setAttribute('aria-label', 'Pausar');
  updateSkillButtons();
  syncHud();
  saveGame();
}

function setPaused(paused) {
  if (state.mode !== 'game') return;
  state.pause = paused;
  state.input.x = 0;
  state.input.y = 0;
  state.input.active = false;
  ui.stickKnob.style.transform = 'translate(0px, 0px)';
  ui.pauseScreen.classList.toggle('hidden', !paused);
  ui.btnPauseTop.textContent = paused ? '▶' : 'Ⅱ';
  ui.btnPauseTop.setAttribute('aria-label', paused ? 'Reanudar' : 'Pausar');
  updateSkillButtons();
}

function bindControls() {
  const handleMove = (dx, dy) => {
    const length = Math.hypot(dx, dy) || 1;
    state.input.x = dx / length;
    state.input.y = dy / length;
    state.input.active = Math.abs(dx) > 0.02 || Math.abs(dy) > 0.02;
  };

  let joystickPointerId = null;
  const updateStick = (event) => {
    const rect = ui.joystick.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = event.clientX - cx;
    const dy = event.clientY - cy;
    const maxDist = 38;
    const len = Math.hypot(dx, dy);
    const scale = len > maxDist ? maxDist / len : 1;
    const x = dx * scale;
    const y = dy * scale;
    ui.stickKnob.style.transform = `translate(${x}px, ${y}px)`;
    handleMove(x / maxDist, y / maxDist);
  };

  const resetStick = () => {
    joystickPointerId = null;
    ui.stickKnob.style.transform = 'translate(0px, 0px)';
    state.input.x = 0;
    state.input.y = 0;
    state.input.active = false;
  };

  ui.joystick.addEventListener('pointerdown', (event) => {
    if (joystickPointerId !== null) return;
    event.preventDefault();
    joystickPointerId = event.pointerId;
    ui.joystick.setPointerCapture(event.pointerId);
    updateStick(event);
  });
  ui.joystick.addEventListener('pointermove', (event) => {
    if (event.pointerId === joystickPointerId) updateStick(event);
  });
  ui.joystick.addEventListener('pointerup', (event) => {
    if (event.pointerId === joystickPointerId) resetStick();
  });
  ui.joystick.addEventListener('pointercancel', (event) => {
    if (event.pointerId === joystickPointerId) resetStick();
  });
  ui.joystick.addEventListener('lostpointercapture', resetStick);

  ui.btnAttack.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    if (state.mode === 'game' && !state.pause) performAttack();
  });
  ui.skillButtons.forEach((button) => {
    button.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      activateSkill(Number(button.dataset.slot));
    });
  });
  ui.btnDodge.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    if (state.mode === 'game' && !state.pause) dodge();
  });
  ui.btnInteract.addEventListener('pointerdown', gatherResource);
  ui.btnCamp.addEventListener('click', campRecover);
  ui.btnPauseTop.addEventListener('click', () => {
    resetStick();
    setPaused(!state.pause);
  });
  ui.btnResume.addEventListener('click', () => setPaused(false));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && state.mode === 'game' && !state.pause) {
      resetStick();
      setPaused(true);
    }
  });
  ui.btnRotateSkip.addEventListener('click', () => {
    state.rotateDismissedOrientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
    ui.rotateGate.classList.add('hidden');
  });

  document.addEventListener('keydown', (event) => {
    if (state.mode !== 'game' || state.pause) return;
    const key = event.key.toLowerCase();
    if (key === 'w' || key === 'arrowup') state.input.y = -1;
    if (key === 's' || key === 'arrowdown') state.input.y = 1;
    if (key === 'a' || key === 'arrowleft') state.input.x = -1;
    if (key === 'd' || key === 'arrowright') state.input.x = 1;
    if (key === ' ') performAttack();
    if (key === 'shift') dodge();
    if (key === 'e') gatherResource();
  });

  document.addEventListener('keyup', (event) => {
    const key = event.key.toLowerCase();
    if (['w', 's', 'arrowup', 'arrowdown'].includes(key)) state.input.y = 0;
    if (['a', 'd', 'arrowleft', 'arrowright'].includes(key)) state.input.x = 0;
  });

  ui.btnNewGame.addEventListener('click', () => startNewGame(state.selectedClassId));
  ui.btnContinue.addEventListener('click', () => {
    if (!loadGame()) showToast('No hay partida guardada.');
  });
  ui.btnCharacter.addEventListener('click', () => renderClassSheet());
  ui.btnBag.addEventListener('click', () => renderInventorySheet());
  ui.btnCraft.addEventListener('click', () => renderCraftingSheet());
  ui.btnMap.addEventListener('click', () => renderMapSheet());
  ui.btnMenu.addEventListener('click', () => showSheet('Expedición', 'ESTADO', '<p>Explora los biomas, gana materiales y asegura tu refugio.</p>'));
  ui.sheetClose.addEventListener('click', closeSheet);
  ui.btnAudio.addEventListener('click', () => {
    state.audioEnabled = !state.audioEnabled;
    ui.btnAudio.textContent = state.audioEnabled ? '🔊' : '🔇';
  });
}

function setupUi() {
  const resizeCanvas = () => {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const updateOrientationGate = () => {
    const isPortrait = window.innerHeight > window.innerWidth;
    const shouldPrompt = window.innerWidth < 540 && isPortrait;
    const wasDismissed = state.rotateDismissedOrientation === (isPortrait ? 'portrait' : 'landscape');
    ui.rotateGate.classList.toggle('hidden', !shouldPrompt || wasDismissed);
  };

  resizeCanvas();
  ui.minimap.width = 140;
  ui.minimap.height = 140;
  updateOrientationGate();

  window.addEventListener('resize', () => {
    resizeCanvas();
    updateOrientationGate();
  });
  window.addEventListener('orientationchange', updateOrientationGate);
}

function init() {
  setupUi();
  bindControls();
  state.player = createPlayer(0);
  state.map = MAPS[0];
  createMap(0);
  updateSkillButtons();
  syncHud();
  updateTracker();
  ui.hud.classList.add('hidden');
  ui.btnContinue.classList.toggle('hidden', !safeLocalStorageGet(SAVE_KEY));
  requestAnimationFrame(animate);
}

init();
