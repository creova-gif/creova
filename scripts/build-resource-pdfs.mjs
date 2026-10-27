import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '..');
const workDir = resolve(root, '.context/resource-pdf-build');
const outputDir = resolve(root, 'public/resources');
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

if (!existsSync(chrome)) {
  throw new Error(`Google Chrome was not found at ${chrome}`);
}

mkdirSync(workDir, { recursive: true });
mkdirSync(outputDir, { recursive: true });

/** Render a labelled write-in field, with optional helper text. */
const line = (label, hint = '') => `<div class="field"><span>${label}</span>${hint ? `<small>${hint}</small>` : ''}</div>`;

/** Render a compact set of printable checkbox options. */
const check = (items) => `<div class="checks">${items.map((item) => `<span>□ ${item}</span>`).join('')}</div>`;

/** Place resource fragments in one of the document grid layouts. */
const rows = (items, columns) => `<div class="table ${columns}">${items.map((item) => `<div>${item}</div>`).join('')}</div>`;

const documents = [
  {
    file: 'creova-event-story-run-of-show.pdf',
    code: 'CRV-R03',
    en: {
      kicker: 'Event planning tool',
      title: 'Event Story Run of Show',
      intro: 'Pair the event schedule with the story plan. Assign an owner, access condition, and handoff for every moment that matters.',
      body: `${rows([line('Event, venue, and date'), line('Story lead and production lead')], 'two')}${rows([line('Audience promise'), line('Primary call to action')], 'two')}<h2>Story timeline</h2>${rows(['Time <b>Moment / action</b> <b>Owner</b> <b>Access / location</b>','____  ____________________  ________  ______________','____  ____________________  ________  ______________','____  ____________________  ________  ______________','____  ____________________  ________  ______________','____  ____________________  ________  ______________'], 'timeline')}${rows([line('Priority interviews', 'Name, role, contact, availability'),line('Must-capture details', 'People, rituals, signage, sound, atmosphere'),line('Live handoff', 'Who receives what, where, and by when'),line('Contingency', 'If timing, weather, access, or consent changes')], 'two')}`,
      note: 'Brief every contributor on consent, cultural context, safe access, priority moments, and the escalation contact before doors open.',
      footer: 'A schedule records time. A run of show protects meaning.',
    },
    fr: {
      kicker: 'Outil de planification',
      title: 'Déroulé narratif d’événement',
      intro: 'Reliez l’horaire de l’événement au plan narratif. Attribuez un responsable, une condition d’accès et un transfert à chaque moment important.',
      body: `${rows([line('Événement, lieu et date'), line('Responsable du récit et de la production')], 'two')}${rows([line('Promesse au public'), line('Appel à l’action principal')], 'two')}<h2>Échéancier narratif</h2>${rows(['Heure <b>Moment / action</b> <b>Responsable</b> <b>Accès / lieu</b>','____  ____________________  ________  ______________','____  ____________________  ________  ______________','____  ____________________  ________  ______________','____  ____________________  ________  ______________','____  ____________________  ________  ______________'], 'timeline')}${rows([line('Entrevues prioritaires', 'Nom, rôle, contact, disponibilité'),line('Détails essentiels', 'Personnes, rituels, signalétique, son, ambiance'),line('Transfert en direct', 'Qui reçoit quoi, où et pour quand'),line('Plan de rechange', 'Si l’horaire, la météo, l’accès ou le consentement change')], 'two')}`,
      note: 'Informez chaque collaborateur du consentement, du contexte culturel, de l’accès sécuritaire, des moments prioritaires et de la personne à joindre avant l’ouverture des portes.',
      footer: 'Un horaire consigne le temps. Un déroulé protège le sens.',
    },
  },
  {
    file: 'creova-consent-content-rights-planner.pdf',
    code: 'CRV-R04',
    en: {
      kicker: 'Preparation tool',
      title: 'Consent & Content Rights Planner',
      intro: 'Map permissions before capture. This worksheet supports planning and conversation; it is not a release form or legal advice.',
      body: `${rows([line('Project, date, and owner'), line('Approver and escalation contact')], 'two')}<h2>People and participation</h2>${rows(['Participant / group <b>Role</b> <b>Consent path</b> <b>Restriction / note</b>','________________  ________  ____________  ______________','________________  ________  ____________  ______________','________________  ________  ____________  ______________'], 'rights')}<h2>Rights and care map</h2>${rows([`<div class="field compact"><span>What appears in the work?</span>${check(['Identifiable adults','Minors','Music','Artwork','Archive material','Private location'])}</div>`,line('Cultural care', 'Protocols, names, language, attribution, sensitivities'),line('Intended use', 'Channels, territory, duration, paid media, partners'),line('Accessibility', 'Mobility, sensory, language, captions, interpretation'),line('Storage and access', 'Where records and originals live; who may access them'),line('Withdrawal or correction path', 'Contact, deadline, approver, version-control process')], 'two')}`,
      note: 'Use the appropriate written release or licence for the project. Escalate uncertainty about minors, traditional knowledge, archives, music, locations, or commercial usage to qualified counsel.',
      footer: 'Consent is a continuing relationship, not a checkbox.',
    },
    fr: {
      kicker: 'Outil de préparation',
      title: 'Planificateur de consentement et de droits',
      intro: 'Planifiez les permissions avant la captation. Cette fiche soutient la préparation et la discussion; elle ne constitue ni une décharge ni un avis juridique.',
      body: `${rows([line('Projet, date et responsable'), line('Approbateur et contact d’escalade')], 'two')}<h2>Personnes et participation</h2>${rows(['Participant / groupe <b>Rôle</b> <b>Voie de consentement</b> <b>Restriction / note</b>','________________  ________  ____________  ______________','________________  ________  ____________  ______________','________________  ________  ____________  ______________'], 'rights')}<h2>Carte des droits et du respect</h2>${rows([`<div class="field compact"><span>Que contient l’œuvre?</span>${check(['Adultes identifiables','Mineurs','Musique','Œuvres','Archives','Lieu privé'])}</div>`,line('Respect culturel', 'Protocoles, noms, langue, attribution, sensibilités'),line('Usage prévu', 'Canaux, territoire, durée, publicité, partenaires'),line('Accessibilité', 'Mobilité, sensorialité, langue, sous-titres, interprétation'),line('Stockage et accès', 'Lieu des dossiers et originaux; personnes autorisées'),line('Retrait ou correction', 'Contact, échéance, approbateur, contrôle des versions')], 'two')}`,
      note: 'Utilisez la décharge ou la licence écrite appropriée. Transmettez toute incertitude concernant les mineurs, les savoirs traditionnels, les archives, la musique, les lieux ou l’usage commercial à un conseiller juridique qualifié.',
      footer: 'Le consentement est une relation continue, pas une case à cocher.',
    },
  },
  {
    file: 'creova-community-story-interview-guide.pdf',
    code: 'CRV-R05',
    en: {
      kicker: 'Conversation guide',
      title: 'Community Story Interview Guide',
      intro: 'Use these prompts as a path, not a script. Listen for language, detail, emotion, and meaning, then follow what the speaker offers.',
      body: `${rows([line('Speaker, role, and pronouns'), line('Interviewer, project, and date')], 'two')}<h2>Before recording</h2>${rows([`<div class="field compact"><span>Confirm together</span>${check(['Purpose explained','Consent recorded','Name pronunciation','Topics to avoid','Access needs','Review process'])}</div>`,line('Context to hold', 'Relationship, community, history, power, cultural protocol')], 'two')}<h2>Conversation path</h2>${rows([line('01 · Begin with belonging', 'What would you like people to understand about you or this community?'),line('02 · Invite a specific memory', 'Take me to a moment that captures what this means to you.'),line('03 · Explore change', 'What has shifted, and what do you hope changes next?'),line('04 · Name the unseen work', 'Who or what made this possible but may not be recognized?'),line('05 · Reflect on meaning', 'What should people feel, remember, or do after hearing this?'),line('06 · Close with agency', 'What have I not asked? Is there anything you want removed or clarified?')], 'two')}`,
      note: 'Do not force disclosure. Pause when emotion or uncertainty appears. Reconfirm consent if the conversation moves into a new or sensitive area, and explain how corrections can be requested.',
      footer: 'Good interviews make room for agency, specificity, and care.',
    },
    fr: {
      kicker: 'Guide de conversation',
      title: 'Guide d’entrevue pour les récits communautaires',
      intro: 'Utilisez ces pistes comme un chemin, pas comme un scénario. Écoutez les mots, les détails, les émotions et le sens, puis suivez ce que la personne choisit de partager.',
      body: `${rows([line('Personne, rôle et pronoms'), line('Intervieweur, projet et date')], 'two')}<h2>Avant l’enregistrement</h2>${rows([`<div class="field compact"><span>Confirmer ensemble</span>${check(['But expliqué','Consentement noté','Prononciation du nom','Sujets à éviter','Besoins d’accès','Processus de révision'])}</div>`,line('Contexte à respecter', 'Relation, communauté, histoire, pouvoir, protocole culturel')], 'two')}<h2>Parcours de conversation</h2>${rows([line('01 · Commencer par l’appartenance', 'Que souhaitez-vous que les gens comprennent de vous ou de cette communauté?'),line('02 · Inviter un souvenir précis', 'Racontez-moi un moment qui exprime ce que cela signifie pour vous.'),line('03 · Explorer le changement', 'Qu’est-ce qui a évolué et que souhaitez-vous voir changer ensuite?'),line('04 · Nommer le travail invisible', 'Qui ou quoi a rendu cela possible sans toujours être reconnu?'),line('05 · Réfléchir au sens', 'Que devraient ressentir, retenir ou faire les gens après ce récit?'),line('06 · Terminer avec autonomie', 'Qu’ai-je oublié? Souhaitez-vous retirer ou préciser quelque chose?')], 'two')}`,
      note: 'Ne forcez jamais une révélation. Faites une pause devant l’émotion ou l’incertitude. Reconfirmez le consentement si la conversation aborde un sujet nouveau ou sensible, et expliquez comment demander une correction.',
      footer: 'Une bonne entrevue laisse place à l’autonomie, au détail et au respect.',
    },
  },
];

const css = `
  @page { size: Letter; margin: 0; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; font-family: "Avenir Next", Avenir, Arial, sans-serif; color: #2D1011; }
  .page { width: 8.5in; height: 11in; position: relative; overflow: hidden; padding: .58in .68in .5in; background: #FBF8F3; break-after: page; }
  .page:last-child { break-after: auto; }
  .page::before { content: ""; position: absolute; width: 4.4in; height: 4.4in; left: -2.5in; bottom: -2.45in; border: .72in solid rgba(198,164,90,.08); border-radius: 50%; }
  .page::after { content: ""; position: absolute; width: 3.2in; height: 8in; right: -2.15in; top: -1.2in; background: rgba(45,16,17,.025); transform: rotate(-34deg); }
  header, main, .note, footer { position: relative; z-index: 1; }
  header { display: flex; justify-content: space-between; align-items: flex-start; border-top: 8px solid #2D1011; padding-top: 18px; }
  .wordmark { font-weight: 800; letter-spacing: .22em; font-size: 12px; }
  .meta { text-align: right; color: #887759; font-size: 8px; line-height: 1.6; text-transform: uppercase; letter-spacing: .17em; }
  .kicker { margin-top: 26px; color: #9A7B38; text-transform: uppercase; letter-spacing: .23em; font-weight: 700; font-size: 8px; }
  h1 { margin: 8px 0 9px; max-width: 6.6in; font-size: 31px; line-height: 1.02; letter-spacing: -.035em; }
  .intro { margin: 0 0 18px; max-width: 6.85in; color: #5F5550; font-size: 10.5px; line-height: 1.52; }
  h2 { margin: 15px 0 7px; color: #887759; font-size: 8px; text-transform: uppercase; letter-spacing: .2em; }
  .table { display: grid; gap: 8px; margin-bottom: 9px; }
  .table.two { grid-template-columns: 1fr 1fr; }
  .field { min-height: 54px; border: 1px solid #D9CFC4; border-radius: 8px; padding: 9px 10px; background: rgba(255,255,255,.74); }
  .field > span { display: block; color: #604F46; font-weight: 700; font-size: 7px; text-transform: uppercase; letter-spacing: .13em; }
  .field small { display: block; margin-top: 5px; color: #8B807A; font-size: 7px; }
  .field.compact { min-height: 74px; }
  .checks { display: grid; grid-template-columns: 1fr 1fr; gap: 5px 10px; margin-top: 8px; color: #5F5550; font-size: 7.2px; }
  .equipment { grid-template-columns: 1fr; gap: 0; border: 1px solid #D9CFC4; border-radius: 8px; overflow: hidden; background: rgba(255,255,255,.74); }
  .equipment > div { min-height: 28px; padding: 7px 10px; border-bottom: 1px solid #E8E0D8; color: #5F5550; font-size: 8px; white-space: pre; }
  .equipment > div:first-child { display: grid; grid-template-columns: 1fr 34px 34px 80px; background: #EEE5DA; color: #2D1011; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; }
  .equipment > div:last-child { border-bottom: 0; }
  .timeline, .rights { grid-template-columns: 1fr; gap: 0; border: 1px solid #D9CFC4; border-radius: 8px; overflow: hidden; background: rgba(255,255,255,.74); }
  .timeline > div, .rights > div { min-height: 28px; padding: 7px 10px; border-bottom: 1px solid #E8E0D8; color: #766B66; font-size: 7.5px; white-space: pre; word-spacing: 10px; }
  .timeline > div:first-child, .rights > div:first-child { background: #EEE5DA; color: #2D1011; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; }
  .timeline > div:last-child, .rights > div:last-child { border-bottom: 0; }
  .note { position: absolute; left: .68in; right: .68in; bottom: .82in; padding: 10px 12px; border-left: 3px solid #C6A45A; background: #F0E7DA; color: #5F5550; font-size: 7.5px; line-height: 1.45; }
  footer { position: absolute; left: .68in; right: .68in; bottom: .34in; display: flex; justify-content: space-between; color: #887759; font-size: 6.8px; text-transform: uppercase; letter-spacing: .13em; }
`;

/** Render one localized, letter-sized resource page. */
function page(document, language, pageNumber) {
  const copy = document[language];
  const label = language === 'en' ? 'Community resource · EN' : 'Ressource communautaire · FR';
  return `<section class="page"><header><div class="wordmark">CREOVA</div><div class="meta">${label}<br>${document.code} · REV 2026.10</div></header><main><div class="kicker">${copy.kicker}</div><h1>${copy.title}</h1><p class="intro">${copy.intro}</p>${copy.body}</main><aside class="note">${copy.note}</aside><footer><span>CREOVA.ONE/RESOURCES</span><span>${copy.footer}</span><span>0${pageNumber}</span></footer></section>`;
}

for (const document of documents) {
  const htmlPath = resolve(workDir, document.file.replace('.pdf', '.html'));
  const outputPath = resolve(outputDir, document.file);
  writeFileSync(htmlPath, `<!doctype html><html><head><meta charset="utf-8"><title>${document.en.title}</title><style>${css}</style></head><body>${page(document, 'en', 1)}${page(document, 'fr', 2)}</body></html>`);
  const result = spawnSync(chrome, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', `--print-to-pdf=${outputPath}`, pathToFileURL(htmlPath).href], { encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error(`Failed to build ${document.file}: ${result.stderr || result.stdout}`);
  }
  console.log(`Built ${document.file}`);
}
