/**
 * One-off gallery correction script.
 *
 * Fixes issues found by auditing the live site's galleries against the real
 * creova.pixieset.com collections:
 *   1. Nine mislabelled/broken Pixieset links (wrong slug → 404 / wrong gallery)
 *   2. Real cover photos for the 18 page-1 galleries (they were sharing ~13
 *      reused local placeholder images); Black Print uses the client-supplied
 *      photo at /card-blackprint-event.jpg
 *   3. Removes 7 galleries: the 2 "SouledOut Worship" church collections, and
 *      5 stale entries whose Pixieset galleries no longer exist.
 *
 * SAFETY:
 *   - Dry-run by default: prints the exact plan matched against live data and
 *     writes nothing. Set VITE_API_BASE_URL, then run `node scripts/fix-galleries.mjs`.
 *   - To apply:  ADMIN_PASSWORD='your-password' node scripts/fix-galleries.mjs --apply
 *     The password is read from the env var YOU set — it is never stored here
 *     and never printed.
 *
 * Idempotent: re-running only applies what still differs. Round 1 fixed the
 * page-1 galleries; the page-2 covers were added in a later pass and are
 * applied on the next run.
 */
const BASE = (process.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '');
if (!BASE) {
  console.error('Set VITE_API_BASE_URL to the Worker base URL (…/make-server-feacf0d8).');
  process.exit(1);
}

const P = 'https://creova.pixieset.com';
const IMG = 'https://images.pixieset.com';

// Each correction is matched against a gallery's CURRENT url (lowercased) by
// substring, so it survives slug differences. url/image are the new values.
const CORRECTIONS = [
  // --- link fixes (+ real page-1 cover where available) ---
  { match: 'bipoclens',                          url: `${P}/careersandprofessionsinlawbipoclawsociety/`, image: `${IMG}/026657111/fcbd41e6763499677439326780e7adc8-large.jpeg` },
  { match: 'eidbazaar2026',                       url: `${P}/eidvendormarket/`,                          image: `${IMG}/582116111/d6b65d539719e9c01d3c6eacf40c5a0c-large.jpeg` },
  { match: 'blackundergraduatecoalitionconference', url: `${P}/blackundergraduatecoalitionconvention/`,   image: `${IMG}/841545011/cc939fb131e74cdee7f2698d06be9cef-large.jpeg` },
  { match: 'documentingandarchivingblacklife',    url: `${P}/documentingandarchivingblacklifeworkandscholarshipadialogueonethicsandpractice/`, image: `${IMG}/079770011/89fee18671e7fa07309a486661645b67-large.jpeg` },
  { match: 'healthrelationshipsblackhistorymonth', url: `${P}/healthrelationshipsblackhistorymonthedition/`, image: `${IMG}/612334901/f9f8a142ec856a4176d79bcda79f198b-large.png` },
  { match: 'hairmattersblackhistorymonthedition', url: `${P}/hairmatters/`,                               image: `${IMG}/449234901/b892167a679630b4c7a1e0b350bf97c9-large.png` },
  { match: 'pinkcourtroom',                       url: `${P}/pinkcourtroom/`, image: `${IMG}/092688101/e0db69d6d071618208bc55db0e068b5c-large.jpeg` },
  { match: 'allvideos',                           url: `${P}/allvideoscreova/`,                          image: `${IMG}/981017311/027b136fb0f155a0bd0fd6ec7c040b1c-large.png` },
  { match: 'graphicandpromotionalmaterials',      url: `${P}/graphicandpromotinalmaterials/`,            image: `${IMG}/541217311/e5aaa0502b7c455b28357cb4cedc664d-large.png` },

  // --- cover-photo fixes only (link already correct) ---
  { match: 'creova.pixieset.com/msk',             image: `${IMG}/302773711/15f4e8853457def003b54d596faa8a77-large.jpeg` },
  { match: 'scholher',                            image: `${IMG}/859988611/83b2ed7e155e56e167a40b29aadabdde-large.jpeg` },
  { match: 'givebackinitiativ',                   image: `${IMG}/622417311/3e0b404ca021549a087bd4d6bfd6d7d1-large.jpg` },
  { match: 'racisminsports',                      image: `${IMG}/199089011/1d4c7f0db44e7cb0af6b7d2e0402bdd3-large.jpg` },
  { match: 'afrocaribbeannightpart2',             image: `${IMG}/600762011/84639e0b48beb5e2035520994b8148b8-large.jpg` },
  { match: 'afrocaribbeannightpart1',             image: `${IMG}/319451011/387fbca9541050951b1f026cc87b1056-large.jpeg` },
  { match: 'maslab',                              image: `${IMG}/120940011/1524caffdb5a991f73e0772204247f74-large.jpeg` },
  { match: 'communitybash',                       image: `${IMG}/944970901/d4c567d59366203cb5ae2c9612e5fd1a-large.png` },
  { match: 'lulumixingbowls',                     image: `${IMG}/768784801/9402bc808f1919835987b5992f55e408-large.jpeg` },
  // Black Print — the session photo (board game / BSSC lounge) reads far better
  // as the cover than the old group shot; /card-blackprint-event.jpg now serves
  // that image (the original group photo was replaced at the client's request).
  { match: 'wellnessandwork',                     image: `/card-blackprint-event.jpg` },

  // --- page-2 cover fixes (captured in a later pass; links already correct) ---
  { match: 'kingpinbowling',                      image: `${IMG}/187909701/b7776476db5740c0c82da7f80694c738-large.jpeg` },
  { match: 'hoopforstars',                        image: `${IMG}/879847401/d70e81268067346d2b2c0610998011ea-large.jpeg` },
  { match: 'levelupsymposium',                    image: `${IMG}/496623401/c2aeaf89b0c22c0f77a35eba67d65e67-large.jpeg` },
  { match: 'debatenight',                         image: `${IMG}/932502401/2c1c04f8b021203c48314f82f3713ec6-large.jpeg` },
  { match: 'paintnight',                          image: `${IMG}/252561401/f56020ad4e656a23df5c771218ab9b28-large.jpeg` },
  { match: 'essencelab',                          image: `${IMG}/343325301/27bbfc59b16c2b259008137a38124525-large.JPG` },
  { match: 'futureblackfemale',                   image: `${IMG}/777864201/3d2cefd9055e72cde08632b6710024af-large.jpg` },
  { match: 'eastafricavswestafrica',              image: `${IMG}/284050201/e12620051338209a611b10f04f14fcbb-large.jpeg` },
  { match: 'blsaphotoshoot',                      image: `${IMG}/920059001/d98751200422cae4372915b3f898945a-large.jpg` },
  { match: 'bsscstock',                           image: `${IMG}/361473001/4ba07816942e8456a045e2939aadfcb8-large.jpg` },
  { match: 'welcomebashbrock',                    image: `${IMG}/52035099/a4e1c24cdd086d66882f02f3c6ac4a5c-large.jpeg` },
];

// Removed entirely. Substrings chosen to be unambiguous.
const DELETES = [
  { match: 'souledout',                   why: 'church collection (requested removal)' },
  { match: 'unclesandaunties',            why: 'stale — Pixieset gallery no longer exists' },
  { match: 'systemsofmarginalization',    why: 'stale — Pixieset gallery no longer exists' },
  { match: 'passprepareforacademic',      why: 'stale — Pixieset gallery no longer exists' },
  { match: 'blsaorientationpartb',        why: 'stale — Pixieset gallery no longer exists' },
  { match: 'welcomereceptiontaylors',     why: 'stale — Pixieset gallery no longer exists' },
];

const APPLY = process.argv.includes('--apply');

async function main() {
  const res = await fetch(`${BASE}/galleries`);
  const { galleries } = await res.json();
  console.log(`Fetched ${galleries.length} live galleries.\n`);

  const plan = { updates: [], deletes: [], untouched: [] };
  for (const g of galleries) {
    const url = (g.url || '').toLowerCase();
    const del = DELETES.find((d) => url.includes(d.match));
    if (del) { plan.deletes.push({ g, why: del.why }); continue; }
    const fix = CORRECTIONS.find((c) => url.includes(c.match));
    if (fix) {
      const updates = {};
      if (fix.url && fix.url !== g.url) updates.url = fix.url;
      if (fix.image && fix.image !== g.image) updates.image = fix.image;
      if (Object.keys(updates).length) { plan.updates.push({ g, updates }); continue; }
    }
    plan.untouched.push(g);
  }

  console.log(`=== ${plan.deletes.length} DELETES ===`);
  for (const { g, why } of plan.deletes) console.log(`  ✗ ${g.title}  — ${why}`);
  console.log(`\n=== ${plan.updates.length} UPDATES ===`);
  for (const { g, updates } of plan.updates) {
    console.log(`  • ${g.title}`);
    if (updates.url) console.log(`      url:   ${g.url}\n         →   ${updates.url}`);
    if (updates.image) console.log(`      image: ${g.image}  →  ${updates.image}`);
  }
  console.log(`\n${plan.untouched.length} galleries left untouched (link + image already correct, or page-2 cover pending).`);

  if (!APPLY) {
    console.log('\n[dry-run] Nothing written. Re-run with --apply (and ADMIN_PASSWORD set) to apply.');
    return;
  }

  const password = process.env.ADMIN_PASSWORD;
  if (!password) { console.error('\nADMIN_PASSWORD env var is required with --apply.'); process.exit(1); }

  const login = await fetch(`${BASE}/admin-login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  if (!login.ok) { console.error(`\nLogin failed (${login.status}). Check ADMIN_PASSWORD.`); process.exit(1); }
  const { token } = await login.json();
  const authHeaders = { 'Content-Type': 'application/json', 'x-admin-session': token };

  console.log('\nApplying...');
  for (const { g, updates } of plan.updates) {
    const r = await fetch(`${BASE}/admin/galleries/update`, { method: 'POST', headers: authHeaders, body: JSON.stringify({ id: g.id, ...updates }) });
    console.log(`  ${r.ok ? '✓' : '✗ ' + r.status} update ${g.title}`);
  }
  for (const { g } of plan.deletes) {
    const r = await fetch(`${BASE}/admin/galleries/delete`, { method: 'POST', headers: authHeaders, body: JSON.stringify({ id: g.id }) });
    console.log(`  ${r.ok ? '✓' : '✗ ' + r.status} delete ${g.title}`);
  }
  console.log('\nDone.');
}

main().catch((e) => { console.error(e); process.exit(1); });
