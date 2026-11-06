(() => {
  'use strict';
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const $ = (id) => document.getElementById(id);
  const ui = {
    shell: document.querySelector('.game-shell'), runLabel: $('run-label'), hud: $('hud'), wave: $('wave-value'), score: $('score-value'), time: $('time-value'), hull: $('hull-value'), health: $('health-fill'), healthTrack: document.querySelector('.health-track'), xp: $('xp-fill'), level: $('level-value'), toast: $('toast'), dashTouch: $('dash-touch'),
    welcome: $('welcome-screen'), pause: $('pause-screen'), upgrade: $('upgrade-screen'), end: $('end-screen'), upgradeGrid: $('upgrade-grid'), bestTitle: $('best-title'), bestEnd: $('best-end'),
  };
  const TAU = Math.PI * 2;
  let W = 0, H = 0, dpr = 1, last = 0, accumulator = 0, elapsed = 0, score = 0, kills = 0, sector = 1, spawnClock = 0, fireClock = 0, toastClock = 0, hudClock = 0, shake = 0, state = 'title', compactLayout = false;
  let player, enemies = [], shots = [], enemyShots = [], shards = [], particles = [], stars = [], keys = new Set(), mouse = { x: 0, y: 0, down: false }, touchFire = false, autoAimFire = false;
  let audioCtx = null, soundOn = false;
  let best = 0; try { best = Number(localStorage.getItem('voidwake-best')) || 0; } catch (_) {}
  const fmt = (n) => Math.floor(n).toString().padStart(6, '0');
  const timeFmt = (n) => `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(Math.floor(n % 60)).padStart(2, '0')}`;
  const rand = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const dist2 = (a, b) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
  const resize = () => {
    const r = canvas.getBoundingClientRect(); W = r.width; H = r.height; dpr = Math.min(2, window.devicePixelRatio || 1); compactLayout = W <= 760 || (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (player) { player.x = clamp(player.x, 30, W - 30); player.y = clamp(player.y, 30, H - 30); }
    stars = Array.from({ length: Math.floor(W * H / 5800) }, () => ({ x: Math.random() * W, y: Math.random() * H, r: rand(.4, 1.5), a: rand(.15, .7), p: rand(0, TAU) }));
  };
  window.addEventListener('resize', resize); resize();
  function beep(freq = 440, duration = .06, type = 'sine', volume = .035) {
    if (!soundOn) return;
    try { audioCtx ||= new (window.AudioContext || window.webkitAudioContext)(); const o = audioCtx.createOscillator(), g = audioCtx.createGain(); o.type = type; o.frequency.value = freq; g.gain.setValueAtTime(volume, audioCtx.currentTime); g.gain.exponentialRampToValueAtTime(.001, audioCtx.currentTime + duration); o.connect(g); g.connect(audioCtx.destination); o.start(); o.stop(audioCtx.currentTime + duration); } catch (_) {}
  }
  function showScreen(screen) { [ui.welcome, ui.pause, ui.upgrade, ui.end].forEach(s => s.classList.remove('active')); if (screen) screen.classList.add('active'); }
  function startGame() {
    player = { x: W * .52, y: H * .52, vx: 0, vy: 0, r: 13, hp: 100, maxHp: 100, speed: 245, damage: 1, fireRate: .22, shotSpeed: 560, dash: 0, dashCooldown: 0, dashCooldownMax: 2.5, invuln: 0, xp: 0, nextXp: 7, level: 1, magnet: 105, pierce: 0 };
    enemies = []; shots = []; enemyShots = []; shards = []; particles = []; elapsed = 0; score = 0; kills = 0; sector = 1; spawnClock = .8; fireClock = 0; hudClock = 0; shake = 0; keys.clear(); mouse.down = false; touchFire = false; autoAimFire = false;
    state = 'playing'; accumulator = 0; ui.shell.classList.add('playing'); ui.runLabel.textContent = 'LIVE SIGNAL'; showScreen(null); updateHud();
    spawnEnemy('drone'); spawnEnemy('drone'); spawnEnemy('drone'); toast('COLLECT NOVA SHARDS TO EVOLVE');
  }
  function pauseGame() { if (state !== 'playing') return; state = 'paused'; ui.runLabel.textContent = 'PAUSED'; showScreen(ui.pause); }
  function resumeGame() { if (state !== 'paused') return; state = 'playing'; ui.runLabel.textContent = 'LIVE SIGNAL'; showScreen(null); last = performance.now(); }
  function endGame() {
    if (state !== 'playing') return;
    state = 'ended'; ui.shell.classList.remove('playing'); ui.runLabel.textContent = 'SIGNAL LOST';
    const isBest = score > best; if (isBest) { best = score; try { localStorage.setItem('voidwake-best', best); } catch (_) {} }
    $('end-kicker').textContent = isBest ? 'NEW PERSONAL BEST' : 'SIGNAL LOST'; $('end-title').innerHTML = isBest ? 'YOU ARE THE<br><span>LAST LIGHT.</span>' : 'THE VOID<br><span>WINS.</span>';
    $('end-copy').textContent = isBest ? 'A new legend in the dark. The signal lives on.' : 'Every light fades. Yours burned bright.';
    $('final-score').textContent = fmt(score); $('final-time').textContent = timeFmt(elapsed); $('final-kills').textContent = String(kills).padStart(2, '0'); ui.bestEnd.textContent = fmt(best); showScreen(ui.end); beep(120, .45, 'sawtooth', .06);
  }
  function updateHud() {
    ui.wave.textContent = String(sector).padStart(2, '0'); ui.score.textContent = fmt(score); ui.time.textContent = timeFmt(elapsed);
    const hp = clamp(player.hp / player.maxHp * 100, 0, 100); ui.hull.textContent = `${Math.ceil(hp)}%`; ui.health.style.width = `${hp}%`; ui.healthTrack.classList.toggle('low', hp < 35);
    ui.xp.style.width = `${Math.min(100, player.xp / player.nextXp * 100)}%`; ui.level.textContent = `LV ${String(player.level).padStart(2, '0')}`;
    if (ui.dashTouch) ui.dashTouch.style.opacity = player.dashCooldown > 0 ? '.42' : '1';
  }
  function toast(text) { ui.toast.textContent = text; ui.toast.classList.add('show'); toastClock = 1.1; }
  function spawnEnemy(kind) {
    const side = Math.floor(Math.random() * 4); const margin = 30;
    let x = side === 0 ? -margin : side === 1 ? W + margin : rand(0, W), y = side === 2 ? -margin : side === 3 ? H + margin : rand(50, H - 50);
    const scale = 1 + Math.max(0, sector - 1) * .1;
    let config = kind === 'brute' ? { r: 25, hp: 6, speed: 47, color: '#ffb454', score: 120 } : kind === 'spitter' ? { r: 15, hp: 2, speed: 55, color: '#b884ff', score: 90 } : { r: 13, hp: 2, speed: 83, color: '#ff5e8a', score: 60 };
    enemies.push({ x, y, vx: 0, vy: 0, kind, r: config.r, hp: config.hp + Math.floor((sector - 1) / 2), maxHp: config.hp + Math.floor((sector - 1) / 2), speed: config.speed * scale, color: config.color, score: config.score, phase: rand(0, TAU), shoot: rand(1.2, 2.4), hit: 0 });
  }
  function burst(x, y, color, count = 10, force = 130) {
    for (let i = 0; i < count; i++) { const a = rand(0, TAU), s = rand(force * .25, force); particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: rand(.25, .65), max: .65, r: rand(1, 3), color }); }
  }
  function fire() {
    let target = null, nearest = Infinity;
    for (const e of enemies) { const d = dist2(player, e); if (d < nearest) { nearest = d; target = e; } }
    let angle = Math.atan2(mouse.y - player.y, mouse.x - player.x);
    if (autoAimFire && target) angle = Math.atan2(target.y - player.y, target.x - player.x);
    const spread = player.level > 4 ? .035 : 0;
    for (let i = 0; i < (player.level >= 6 ? 2 : 1); i++) {
      const a = angle + rand(-spread, spread) + (i ? .07 : 0);
      shots.push({ x: player.x + Math.cos(a) * 15, y: player.y + Math.sin(a) * 15, vx: Math.cos(a) * player.shotSpeed, vy: Math.sin(a) * player.shotSpeed, life: 1.2, damage: player.damage, pierce: player.pierce, hit: new Set() });
    }
    burst(player.x + Math.cos(angle) * 16, player.y + Math.sin(angle) * 16, '#6cf7e2', 2, 38); fireClock = player.fireRate; beep(540 + Math.random() * 100, .035, 'triangle', .016);
  }
  function inputVector() {
    return { x: (keys.has('ArrowRight') || keys.has('KeyD') ? 1 : 0) - (keys.has('ArrowLeft') || keys.has('KeyA') ? 1 : 0), y: (keys.has('ArrowDown') || keys.has('KeyS') ? 1 : 0) - (keys.has('ArrowUp') || keys.has('KeyW') ? 1 : 0) };
  }
  function doDash(dx, dy) {
    if (state !== 'playing' || player.dashCooldown > 0) return;
    if (!dx && !dy) { let nearest = null, nd = Infinity; for (const e of enemies) { const d = dist2(player, e); if (d < nd) { nd = d; nearest = e; } } if (nearest) { dx = player.x - nearest.x; dy = player.y - nearest.y; } else { dx = Math.cos(Math.atan2(mouse.y - player.y, mouse.x - player.x)); dy = Math.sin(Math.atan2(mouse.y - player.y, mouse.x - player.x)); } }
    const mag = Math.hypot(dx, dy) || 1; player.vx = dx / mag * 760; player.vy = dy / mag * 760; player.dash = .18; player.dashCooldown = player.dashCooldownMax; player.invuln = .34;
    burst(player.x, player.y, '#6cf7e2', 16, 170); shake = .12; beep(190, .12, 'sawtooth', .04);
  }
  function takeDamage(amount) {
    if (player.invuln > 0) return;
    player.hp -= amount; player.invuln = .72; shake = .22; burst(player.x, player.y, '#ff5e8a', 14, 150); beep(100, .2, 'square', .045);
    if (player.hp <= 0) { player.hp = 0; endGame(); }
  }
  const upgrades = [
    { icon: '⌁', name: 'OVERDRIVE', desc: 'Fire 22% faster.', apply: p => p.fireRate *= .78 },
    { icon: '◇', name: 'REINFORCED HULL', desc: 'Restore 35 hull and raise max by 10.', apply: p => { p.maxHp += 10; p.hp = Math.min(p.maxHp, p.hp + 35); } },
    { icon: '⟡', name: 'HOTTER CORES', desc: 'Shots deal +1 damage.', apply: p => p.damage++ },
    { icon: '✣', name: 'PHASE COIL', desc: 'Dash cooldown reduced by 30%.', apply: p => { p.dashCooldownMax *= .7; p.dashCooldown = Math.min(p.dashCooldown, p.dashCooldownMax); } },
    { icon: '◎', name: 'GRAVITY WELL', desc: 'Pull in nova shards from farther away.', apply: p => p.magnet += 80 },
    { icon: '↯', name: 'PIERCING ROUNDS', desc: 'Shots pass through one more hostile.', apply: p => p.pierce++ },
    { icon: '✦', name: 'NOVA HEART', desc: 'Restore 30% hull and gain +5 max hull.', apply: p => { p.maxHp += 5; p.hp = Math.min(p.maxHp, p.hp + p.maxHp * .3); } },
    { icon: '➤', name: 'THRUST VECTOR', desc: 'Move 12% faster.', apply: p => p.speed *= 1.12 },
  ];
  function levelUp() {
    if (state !== 'playing') return;
    player.xp -= player.nextXp; player.level++; player.nextXp = Math.ceil(player.nextXp * 1.32 + 2); state = 'upgrade'; ui.runLabel.textContent = 'EVOLUTION';
    const picks = [...upgrades].sort(() => Math.random() - .5).slice(0, 3); ui.upgradeGrid.innerHTML = '';
    picks.forEach((u, i) => { const b = document.createElement('button'); b.className = 'upgrade-card'; b.innerHTML = `<span class="keycap">0${i + 1}</span><div class="upgrade-icon">${u.icon}</div><strong>${u.name}</strong><small>${u.desc}</small>`; b.addEventListener('click', () => { u.apply(player); state = 'playing'; ui.runLabel.textContent = 'LIVE SIGNAL'; showScreen(null); toast(`${u.name} ONLINE`); updateHud(); last = performance.now(); }); ui.upgradeGrid.appendChild(b); });
    showScreen(ui.upgrade); beep(740, .2, 'sine', .035);
  }
  function update(dt) {
    if (state !== 'playing') return;
    elapsed += dt; const newSector = 1 + Math.floor(elapsed / 22);
    if (newSector !== sector) { sector = newSector; toast(`SECTOR ${String(sector).padStart(2, '0')} · HOSTILES INBOUND`); burst(W * .5, H * .5, '#a689ff', 24, 230); }
    player.invuln = Math.max(0, player.invuln - dt); player.dashCooldown = Math.max(0, player.dashCooldown - dt); player.dash = Math.max(0, player.dash - dt);
    const { x: dx, y: dy } = inputVector();
    const norm = Math.hypot(dx, dy) || 1, acceleration = player.dash > 0 ? 1 : 1 - Math.exp(-13 * dt);
    const targetVX = dx / norm * player.speed, targetVY = dy / norm * player.speed;
    if (player.dash <= 0) { player.vx += (targetVX - player.vx) * acceleration; player.vy += (targetVY - player.vy) * acceleration; }
    const topBound = compactLayout ? (H < 500 ? 96 : 118) : 45, bottomBound = compactLayout ? H - (H < 500 ? 128 : 138) : H - 28;
    player.x = clamp(player.x + player.vx * dt, 26, W - 26); player.y = clamp(player.y + player.vy * dt, topBound, bottomBound);
    fireClock -= dt; if ((mouse.down || touchFire) && fireClock <= 0) fire();
    spawnClock -= dt; const interval = Math.max(.28, .92 - elapsed * .0045); if (spawnClock <= 0) { if (enemies.length < 62) { spawnEnemy(sector > 1 && Math.random() < .2 ? 'spitter' : 'drone'); if (sector >= 3 && Math.random() < .16) spawnEnemy('brute'); if (elapsed > 45 && Math.random() < .22) spawnEnemy('drone'); } spawnClock = interval * rand(.75, 1.2); }
    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i], a = Math.atan2(player.y - e.y, player.x - e.x), d = Math.sqrt(dist2(player, e)); e.phase += dt * 3; e.hit = Math.max(0, e.hit - dt);
      if (e.kind === 'spitter' && d < 300) {
        const want = d > 210 ? 1 : d < 155 ? -1 : 0; e.vx += (Math.cos(a) * e.speed * want - e.vx) * dt * 1.8; e.vy += (Math.sin(a) * e.speed * want - e.vy) * dt * 1.8; e.shoot -= dt;
        if (e.shoot <= 0) { const sa = Math.atan2(player.y - e.y, player.x - e.x); enemyShots.push({ x: e.x, y: e.y, vx: Math.cos(sa) * 165, vy: Math.sin(sa) * 165, r: 4, life: 3 }); e.shoot = rand(1.7, 2.5); }
      } else { e.vx += (Math.cos(a) * e.speed - e.vx) * dt * 1.8; e.vy += (Math.sin(a) * e.speed - e.vy) * dt * 1.8; }
      e.x += e.vx * dt; e.y += e.vy * dt;
      if (d < e.r + player.r && player.dash <= 0 && e.hit <= 0) {
        takeDamage(e.kind === 'brute' ? 22 : 14); e.hp -= 1; e.hit = .65;
        e.x += Math.cos(a) * 16; e.y += Math.sin(a) * 16; e.vx += Math.cos(a) * 90; e.vy += Math.sin(a) * 90;
        if (e.hp <= 0) killEnemy(i);
      }
    }
    for (let i = shots.length - 1; i >= 0; i--) {
      const s = shots[i]; s.x += s.vx * dt; s.y += s.vy * dt; s.life -= dt; let remove = s.life <= 0 || s.x < -20 || s.x > W + 20 || s.y < -20 || s.y > H + 20;
      if (!remove) for (let j = enemies.length - 1; j >= 0; j--) { const e = enemies[j]; if (s.hit.has(e) || dist2(s, e) > (e.r + 4) ** 2) continue; e.hp -= s.damage; e.hit = .1; s.hit.add(e); burst(s.x, s.y, e.color, 3, 60); if (e.hp <= 0) killEnemy(j); if (s.pierce > 0) s.pierce--; else { remove = true; break; } }
      if (remove) shots.splice(i, 1);
    }
    for (let i = enemyShots.length - 1; i >= 0; i--) { const s = enemyShots[i]; s.x += s.vx * dt; s.y += s.vy * dt; s.life -= dt; if (dist2(s, player) < (s.r + player.r) ** 2) { takeDamage(12); enemyShots.splice(i, 1); } else if (s.life <= 0 || s.x < -20 || s.x > W + 20 || s.y < -20 || s.y > H + 20) enemyShots.splice(i, 1); }
    for (let i = shards.length - 1; i >= 0; i--) { const s = shards[i]; const d = Math.sqrt(dist2(s, player)); if (d < Math.max(620, player.magnet + 400)) { const pull = d < player.magnet ? (1 - d / player.magnet) * 560 : 165; s.vx += (player.x - s.x) / (d || 1) * pull * dt; s.vy += (player.y - s.y) / (d || 1) * pull * dt; } s.vx *= Math.pow(.96, dt * 60); s.vy *= Math.pow(.96, dt * 60); s.x += s.vx * dt; s.y += s.vy * dt; s.life -= dt;
      if (d < player.r + 11) { shards.splice(i, 1); player.xp++; score += 12; beep(800 + Math.random() * 200, .045, 'sine', .02); if (player.xp >= player.nextXp) { levelUp(); break; } } else if (s.life <= 0) shards.splice(i, 1);
    }
    for (let i = particles.length - 1; i >= 0; i--) { const p = particles[i]; p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= Math.pow(.94, dt * 60); p.vy *= Math.pow(.94, dt * 60); p.life -= dt; if (p.life <= 0) particles.splice(i, 1); }
    if (toastClock > 0 && (toastClock -= dt) <= 0) ui.toast.classList.remove('show'); shake = Math.max(0, shake - dt);
    hudClock -= dt; if (hudClock <= 0) { updateHud(); hudClock = .08; }
  }
  function killEnemy(index) {
    const e = enemies[index]; if (!e) return; enemies.splice(index, 1); kills++; score += e.score; burst(e.x, e.y, e.color, e.kind === 'brute' ? 22 : 12, 180);
    const count = e.kind === 'brute' ? 3 : 1; for (let i = 0; i < count && shards.length < 90; i++) shards.push({ x: e.x + rand(-7, 7), y: e.y + rand(-7, 7), vx: rand(-70, 70), vy: rand(-70, 70), life: 18, phase: rand(0, TAU) });
    beep(e.kind === 'brute' ? 280 : 360, .07, 'triangle', .025);
  }
  function drawBackground(t) {
    ctx.fillStyle = '#080c17'; ctx.fillRect(0, 0, W, H);
    const glow = ctx.createRadialGradient(W * .58, H * .48, 0, W * .58, H * .48, Math.max(W, H) * .68); glow.addColorStop(0, '#111d2d'); glow.addColorStop(.55, '#0b111e'); glow.addColorStop(1, '#070a13'); ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.strokeStyle = 'rgba(122,159,189,.045)'; ctx.lineWidth = 1; const grid = 54, ox = (t * 5) % grid, oy = (t * 3) % grid;
    for (let x = ox; x < W; x += grid) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); } for (let y = oy; y < H; y += grid) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    ctx.restore();
    for (const s of stars) { const a = s.a * (.65 + Math.sin(t * .9 + s.p) * .35); ctx.fillStyle = `rgba(176,218,237,${a})`; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, TAU); ctx.fill(); }
    ctx.strokeStyle = 'rgba(108,247,226,.06)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(W * .52, H * .52, Math.min(W, H) * .34 + Math.sin(t * .5) * 4, 0, TAU); ctx.stroke();
  }
  function drawShip() {
    let aim = Math.atan2(mouse.y - player.y, mouse.x - player.x), nearest = null, nearD = Infinity;
    if (autoAimFire) for (const e of enemies) { const d = dist2(player, e); if (d < nearD) { nearD = d; nearest = e; } }
    if (nearest) aim = Math.atan2(nearest.y - player.y, nearest.x - player.x);
    const moving = Math.hypot(player.vx, player.vy) > 40;
    const aura = ctx.createRadialGradient(player.x, player.y, 2, player.x, player.y, 36);
    aura.addColorStop(0, 'rgba(108,247,226,.16)'); aura.addColorStop(1, 'rgba(108,247,226,0)');
    ctx.fillStyle = aura; ctx.beginPath(); ctx.arc(player.x, player.y, 36, 0, TAU); ctx.fill();
    ctx.save(); ctx.translate(player.x, player.y); ctx.rotate(aim); ctx.scale(1.25, 1.25);
    if (moving) { ctx.fillStyle = `rgba(108,247,226,${.3 + Math.random() * .3})`; ctx.beginPath(); ctx.moveTo(-11, -4); ctx.lineTo(-23 - Math.random() * 9, 0); ctx.lineTo(-11, 4); ctx.fill(); }
    ctx.shadowColor = '#6cf7e2'; ctx.shadowBlur = 18; ctx.fillStyle = player.invuln > 0 && Math.floor(performance.now() / 65) % 2 ? '#ffffff' : '#c8fff5';
    ctx.beginPath(); ctx.moveTo(15, 0); ctx.lineTo(-9, -9); ctx.lineTo(-5, 0); ctx.lineTo(-9, 9); ctx.closePath(); ctx.fill(); ctx.shadowBlur = 0;
    ctx.strokeStyle = '#6cf7e2'; ctx.lineWidth = 1.1; ctx.stroke(); ctx.fillStyle = '#122d32'; ctx.beginPath(); ctx.arc(1, 0, 3, 0, TAU); ctx.fill(); ctx.restore();
    if (player.dashCooldown > 0) { const ratio = 1 - player.dashCooldown / player.dashCooldownMax; ctx.strokeStyle = 'rgba(166,137,255,.62)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(player.x, player.y, 23, -Math.PI / 2, -Math.PI / 2 + TAU * ratio); ctx.stroke(); }
  }
  function drawEnemy(e, t) {
    ctx.save(); ctx.translate(e.x, e.y); ctx.rotate(Math.atan2(e.vy, e.vx) + Math.PI / 2 + Math.sin(e.phase) * .08); ctx.shadowColor = e.color; ctx.shadowBlur = e.hit ? 22 : 12;
    if (e.kind === 'brute') { ctx.fillStyle = e.hit ? '#fff' : '#31251f'; ctx.strokeStyle = e.color; ctx.lineWidth = 2; ctx.beginPath(); for (let i = 0; i < 8; i++) { const a = i * TAU / 8, r = e.r * (i % 2 ? .82 : 1); const x = Math.cos(a) * r, y = Math.sin(a) * r; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.closePath(); ctx.fill(); ctx.stroke(); }
    else { ctx.fillStyle = e.hit ? '#fff' : e.kind === 'spitter' ? '#261e39' : '#301a27'; ctx.strokeStyle = e.color; ctx.lineWidth = 1.7; ctx.beginPath(); ctx.moveTo(0, -e.r); ctx.lineTo(e.r * .85, 0); ctx.lineTo(0, e.r); ctx.lineTo(-e.r * .85, 0); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = e.color; ctx.beginPath(); ctx.arc(0, 0, e.kind === 'spitter' ? 3.5 : 2.5, 0, TAU); ctx.fill(); }
    ctx.shadowBlur = 0; ctx.restore();
    if (e.hp < e.maxHp) { const bw = e.r * 2; ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(e.x - bw / 2, e.y - e.r - 8, bw, 2); ctx.fillStyle = e.color; ctx.fillRect(e.x - bw / 2, e.y - e.r - 8, bw * e.hp / e.maxHp, 2); }
  }
  function draw(t) {
    ctx.save(); if (shake > 0) ctx.translate(rand(-shake * 14, shake * 14), rand(-shake * 14, shake * 14)); drawBackground(t);
    // Soft signal markers make the arena feel alive even before the first run.
    if (state === 'title') {
      const x = W * .69, y = H * .5, pulse = 1 + Math.sin(t * 2) * .06;
      ctx.strokeStyle = 'rgba(108,247,226,.11)'; ctx.lineWidth = 1; [34, 54, 95].forEach((r, i) => { ctx.beginPath(); ctx.arc(x, y, r * pulse, t * (i % 2 ? -.08 : .08), t * (i % 2 ? -.08 : .08) + TAU * .8); ctx.stroke(); });
      const shipGlow = ctx.createRadialGradient(x, y, 2, x, y, 48); shipGlow.addColorStop(0, 'rgba(108,247,226,.22)'); shipGlow.addColorStop(1, 'rgba(108,247,226,0)'); ctx.fillStyle = shipGlow; ctx.beginPath(); ctx.arc(x, y, 48, 0, TAU); ctx.fill();
      ctx.save(); ctx.translate(x, y); ctx.rotate(t * .08); ctx.scale(1.3, 1.3); ctx.shadowColor = '#6cf7e2'; ctx.shadowBlur = 20; ctx.fillStyle = '#bafff4'; ctx.beginPath(); ctx.moveTo(17, 0); ctx.lineTo(-11, -10); ctx.lineTo(-6, 0); ctx.lineTo(-11, 10); ctx.closePath(); ctx.fill(); ctx.restore();
      if (W > 760) for (let i = 0; i < 5; i++) { const a = t * .16 + i * TAU / 5, r = 190 + Math.sin(t + i) * 28; const ex = x + Math.cos(a) * r, ey = y + Math.sin(a) * r * .66; ctx.fillStyle = 'rgba(255,94,138,.12)'; ctx.strokeStyle = 'rgba(255,94,138,.5)'; ctx.beginPath(); ctx.moveTo(ex, ey - 7); ctx.lineTo(ex + 6, ey); ctx.lineTo(ex, ey + 7); ctx.lineTo(ex - 6, ey); ctx.closePath(); ctx.fill(); ctx.stroke(); }
      ctx.restore(); return;
    }
    for (const s of shards) { const pulse = .8 + Math.sin(t * 5 + s.phase) * .2; ctx.save(); ctx.translate(s.x, s.y); ctx.rotate(t * 1.6 + s.phase); ctx.shadowColor = '#a689ff'; ctx.shadowBlur = 12; ctx.fillStyle = '#d5c9ff'; ctx.beginPath(); ctx.moveTo(0, -6 * pulse); ctx.lineTo(5 * pulse, 0); ctx.lineTo(0, 6 * pulse); ctx.lineTo(-5 * pulse, 0); ctx.closePath(); ctx.fill(); ctx.restore(); }
    for (const p of particles) { ctx.globalAlpha = clamp(p.life / p.max, 0, 1); ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (.4 + p.life / p.max), 0, TAU); ctx.fill(); } ctx.globalAlpha = 1;
    for (const s of shots) { ctx.strokeStyle = 'rgba(108,247,226,.45)'; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(s.x - s.vx * .022, s.y - s.vy * .022); ctx.lineTo(s.x, s.y); ctx.stroke(); ctx.lineCap = 'butt'; ctx.fillStyle = '#d6fff8'; ctx.shadowColor = '#6cf7e2'; ctx.shadowBlur = 12; ctx.beginPath(); ctx.arc(s.x, s.y, 2.8, 0, TAU); ctx.fill(); ctx.shadowBlur = 0; }
    for (const s of enemyShots) { ctx.fillStyle = '#d7bdff'; ctx.shadowColor = '#b884ff'; ctx.shadowBlur = 10; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, TAU); ctx.fill(); ctx.shadowBlur = 0; }
    for (const e of enemies) drawEnemy(e, t);
    if (player) drawShip(); ctx.restore();
  }
  function frame(now) {
    const delta = Math.min(.2, (now - last) / 1000 || 0); last = now;
    if (state === 'playing') { accumulator = Math.min(.12, accumulator + delta); while (accumulator >= 1 / 60) { update(1 / 60); accumulator -= 1 / 60; } } else accumulator = 0;
    draw(now / 1000); requestAnimationFrame(frame);
  }
  last = performance.now(); requestAnimationFrame(frame);
  function pointerPosition(event) { const r = canvas.getBoundingClientRect(); mouse.x = event.clientX - r.left; mouse.y = event.clientY - r.top; }
  canvas.addEventListener('pointermove', pointerPosition);
  canvas.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse' && e.button !== 0) return; pointerPosition(e); if (e.pointerType === 'touch' || e.pointerType === 'pen') return; if (state === 'playing') { mouse.down = true; canvas.setPointerCapture?.(e.pointerId); } });
  window.addEventListener('pointerup', e => { if (e.pointerType === 'mouse') mouse.down = false; });
  window.addEventListener('keydown', e => {
    const code = e.code; if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(code)) e.preventDefault();
    if (code === 'Escape' || code === 'KeyP') { if (state === 'playing') pauseGame(); else if (state === 'paused') resumeGame(); return; }
    if (state === 'title' && (code === 'Enter' || code === 'Space')) { startGame(); return; }
    if (state === 'upgrade' && ['Digit1','Digit2','Digit3'].includes(code)) { ui.upgradeGrid.children[Number(code.slice(-1)) - 1]?.click(); return; }
    if (state !== 'playing') return;
    if (code === 'Space') { if (!e.repeat) { const d = inputVector(); doDash(d.x, d.y); } return; }
    keys.add(code);
  });
  window.addEventListener('keyup', e => keys.delete(e.code));
  window.addEventListener('blur', () => { keys.clear(); mouse.down = false; touchFire = false; if (state === 'playing') pauseGame(); });
  $('start-button').addEventListener('click', startGame); $('resume-button').addEventListener('click', resumeGame); $('restart-button').addEventListener('click', startGame); $('pause-button').addEventListener('click', pauseGame); $('pause-restart').addEventListener('click', startGame);
  const soundButton = $('sound-button'); soundButton.addEventListener('click', () => { soundOn = !soundOn; soundButton.classList.toggle('muted', !soundOn); soundButton.setAttribute('aria-label', soundOn ? 'Mute sound' : 'Enable sound'); if (soundOn) { beep(660, .1); } });
  document.querySelectorAll('.pad').forEach(button => {
    const code = button.dataset.key, down = e => { e.preventDefault(); keys.add(code); button.classList.add('pressed'); button.setPointerCapture?.(e.pointerId); }, up = e => { e.preventDefault(); keys.delete(code); button.classList.remove('pressed'); };
    button.addEventListener('pointerdown', down); button.addEventListener('pointerup', up); button.addEventListener('pointercancel', up); button.addEventListener('lostpointercapture', up);
  });
  const fireButton = $('fire-touch'); fireButton.addEventListener('pointerdown', e => { e.preventDefault(); touchFire = true; autoAimFire = true; fireButton.setPointerCapture?.(e.pointerId); }); ['pointerup','pointercancel','lostpointercapture'].forEach(ev => fireButton.addEventListener(ev, () => { touchFire = false; autoAimFire = false; }));
  const dashButton = $('dash-touch'); dashButton.addEventListener('pointerdown', e => { e.preventDefault(); const d = inputVector(); doDash(d.x, d.y); });
  ui.bestTitle.textContent = fmt(best); ui.bestEnd.textContent = fmt(best);
})();
