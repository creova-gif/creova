import { ArrowUpRight, Mail, MapPin } from 'lucide-react';
import { Link } from '../i18n/LocaleLink';
import { useLanguage } from '../context/LanguageContext';
import { Logo } from './Logo';
import { SERVICE_AREAS } from '../data/serviceAreas';
import { VENTURE_URLS } from '../config';

export function Footer() {
  const { language } = useLanguage();
  const fr = language === 'fr';
  const offers = fr
    ? [['Récit d’événement', '/services#event-story'], ['Campagnes communautaires', '/services#campaign-story'], ['Partenariats continus', '/services#ongoing-partnership']]
    : [['Event storytelling', '/services#event-story'], ['Community campaigns', '/services#campaign-story'], ['Ongoing partnerships', '/services#ongoing-partnership']];
  const company = fr
    ? [['Travail', '/work'], ['Ressources', '/resources'], ['Communauté', '/community'], ['Nos marques', '/ventures'], ['À propos', '/about'], ['Journal', '/journal']]
    : [['Work', '/work'], ['Resources', '/resources'], ['Community', '/community'], ['Our Brands', '/ventures'], ['About', '/about'], ['Journal', '/journal']];

  return (
    <footer style={{ backgroundColor: '#2D1011', color: '#E0E0E0' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-[1.18fr_.82fr] gap-14 lg:gap-20 pb-16 border-b" style={{ borderColor: 'rgba(255,255,255,.1)' }}>
          <div>
            <p className="text-xs tracking-[.35em] uppercase mb-5" style={{ color: '#C6A45A' }}>{fr ? 'Un récit utile commence ici' : 'A useful story starts here'}</p>
            <h2 className="creova-footer-title max-w-4xl font-light tracking-tight leading-[1.02]" style={{ color: '#FFFFFF' }}>{fr ? 'Transformons votre prochain moment en élan durable.' : 'Turn your next meaningful moment into lasting momentum.'}</h2>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link to="/start-a-project" className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 font-semibold" style={{ backgroundColor: '#7D6D51', color: '#FFFFFF' }}>{fr ? 'Démarrer un projet' : 'Start a project'} <ArrowUpRight className="w-4 h-4" /></Link>
              <a href="mailto:support@creova.one" className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 border" style={{ borderColor: 'rgba(255,255,255,.3)', color: '#FFFFFF' }}><Mail className="w-4 h-4" />support@creova.one</a>
            </div>
          </div>
          <div className="relative flex flex-col justify-end gap-7 lg:pt-12">
            <div
              className="pointer-events-none absolute -right-16 top-0 h-52 w-52 rounded-full border opacity-40"
              style={{ borderColor: 'rgba(198,164,90,.34)' }}
              aria-hidden="true"
            >
              <div className="absolute inset-7 rounded-full border" style={{ borderColor: 'rgba(198,164,90,.25)' }} />
              <div className="absolute inset-16 rounded-full" style={{ backgroundColor: 'rgba(198,164,90,.14)' }} />
            </div>

            <div className="relative overflow-hidden rounded-[1.75rem] border p-6 sm:p-8" style={{ borderColor: 'rgba(198,164,90,.24)', backgroundColor: 'rgba(255,255,255,.035)' }}>
              <div className="absolute right-5 top-3 select-none font-light leading-none" style={{ color: 'rgba(198,164,90,.1)', fontSize: '6.5rem' }} aria-hidden="true">03</div>
              <p className="relative text-[10px] uppercase tracking-[.32em]" style={{ color: '#C6A45A' }}>{fr ? 'Du moment à l’élan' : 'From moment to momentum'}</p>
              <ol className="relative mt-7">
                {(
                  fr
                    ? [
                        ['01', 'Contexte', 'Comprendre les personnes, le lieu et l’intention.'],
                        ['02', 'Création', 'Façonner des images et un récit qui sonnent juste.'],
                        ['03', 'Continuité', 'Créer des ressources qui continuent de servir.'],
                      ]
                    : [
                        ['01', 'Context', 'Understand the people, place, and purpose.'],
                        ['02', 'Create', 'Shape images and a story that feel true.'],
                        ['03', 'Continue', 'Build assets designed to keep working.'],
                      ]
                ).map(([number, title, description]) => (
                  <li key={number} className="grid grid-cols-[2.25rem_1fr] gap-3 border-t py-4 last:pb-0" style={{ borderColor: 'rgba(255,255,255,.12)' }}>
                    <span className="pt-1 text-[10px] tracking-[.2em]" style={{ color: '#C6A45A' }}>{number}</span>
                    <span>
                      <strong className="block font-medium" style={{ color: '#FFFFFF' }}>{title}</strong>
                      <span className="mt-1 block text-sm leading-relaxed" style={{ color: '#B7BBC3' }}>{description}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="relative flex flex-col gap-4 text-sm" style={{ color: '#B7BBC3' }}>
              <p className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0" style={{ color: '#C6A45A' }} />{fr ? 'Ontario · Niagara, Hamilton et projets sélectionnés dans le GTA' : 'Ontario · Niagara, Hamilton, and select GTA projects'}</p>
              <p>{fr ? 'Collaboration en anglais et en français.' : 'English and French collaboration.'}</p>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 py-14">
          <FooterColumn title={fr ? 'Services' : 'Services'} links={offers} />
          <FooterColumn title={fr ? 'Entreprise' : 'Company'} links={company} />
          <div>
            <p className="text-xs tracking-[.3em] uppercase mb-5" style={{ color: '#C6A45A' }}>{fr ? 'Nos marques' : 'Our Brands'}</p>
            <ul className="space-y-3 text-sm" style={{ color: '#9B9B9B' }}>
              <li>{VENTURE_URLS.seen ? <a href={VENTURE_URLS.seen} target="_blank" rel="noopener noreferrer" className="creova-touch-target inline-flex items-center hover:text-white">SEEN <ArrowUpRight className="inline w-3 h-3" /></a> : <Link to="/ventures#seen" className="creova-touch-target inline-flex items-center hover:text-white">SEEN · {fr ? 'en développement' : 'in development'}</Link>}</li>
              <li>{VENTURE_URLS.verse ? <a href={VENTURE_URLS.verse} target="_blank" rel="noopener noreferrer" className="creova-touch-target inline-flex items-center hover:text-white">VERSE · {fr ? 'en développement' : 'in development'} <ArrowUpRight className="inline w-3 h-3" /></a> : <Link to="/ventures#verse" className="creova-touch-target inline-flex items-center hover:text-white">VERSE · {fr ? 'en développement' : 'in development'}</Link>}</li>
            </ul>
          </div>
          <div>
            <p className="text-xs tracking-[.3em] uppercase mb-5" style={{ color: '#C6A45A' }}>{fr ? 'Coordonnées' : 'Connect'}</p>
            <ul className="space-y-3 text-sm" style={{ color: '#9B9B9B' }}>
              <li><a href="https://instagram.com/creativeinnovation__" target="_blank" rel="noopener noreferrer" className="creova-touch-target inline-flex items-center hover:text-white">Instagram</a></li>
              <li><a href="https://www.linkedin.com/company/creovaspace/" target="_blank" rel="noopener noreferrer" className="creova-touch-target inline-flex items-center hover:text-white">LinkedIn</a></li>
              <li><a href="mailto:support@creova.one" className="creova-touch-target inline-flex items-center hover:text-white">support@creova.one</a></li>
            </ul>
          </div>
        </div>

        <div className="py-8 border-y" style={{ borderColor: 'rgba(255,255,255,.08)' }}>
          <p className="text-[10px] tracking-[.3em] uppercase mb-4" style={{ color: '#B8ACA6' }}>{fr ? 'Zones de service' : 'Service areas'}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {SERVICE_AREAS.map(area => <Link key={area.slug} to={`/${area.slug}`} className="creova-touch-target inline-flex items-center text-xs hover:text-[#E5C978]" style={{ color: '#B8ACA6' }}>{(fr ? area.fr : area.en).kicker}</Link>)}
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <Link to="/" aria-label="CREOVA" className="creova-touch-target inline-flex items-center"><Logo variant="white" className="h-8 w-auto" interactive={false} /></Link>
          <p className="text-xs" style={{ color: '#B8ACA6' }}>© {new Date().getFullYear()} CREOVA. {fr ? 'Tous droits réservés.' : 'All rights reserved.'}</p>
          <div className="flex gap-5 text-xs" style={{ color: '#B8ACA6' }}><Link to="/terms-of-service" className="creova-touch-target inline-flex items-center hover:text-white">{fr ? 'Conditions' : 'Terms'}</Link><Link to="/privacy-policy" className="creova-touch-target inline-flex items-center hover:text-white">{fr ? 'Confidentialité' : 'Privacy'}</Link><Link to="/start-a-project" className="creova-touch-target inline-flex items-center hover:text-white">{fr ? 'Contact' : 'Contact'}</Link></div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[][] }) {
  return <div><p className="text-xs tracking-[.3em] uppercase mb-5" style={{ color: '#C6A45A' }}>{title}</p><ul>{links.map(([label, href]) => <li key={href}><Link to={href} className="creova-touch-target inline-flex items-center text-sm hover:text-white" style={{ color: '#B8ACA6' }}>{label}</Link></li>)}</ul></div>;
}
