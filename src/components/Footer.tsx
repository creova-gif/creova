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
        <div className="grid lg:grid-cols-[1.25fr_.75fr] gap-14 lg:gap-24 pb-16 border-b" style={{ borderColor: 'rgba(255,255,255,.1)' }}>
          <div>
            <p className="text-xs tracking-[.35em] uppercase mb-5" style={{ color: '#C6A45A' }}>{fr ? 'Un récit utile commence ici' : 'A useful story starts here'}</p>
            <h2 className="max-w-4xl font-light tracking-tight leading-[1.02]" style={{ color: '#FFFFFF', fontSize: 'clamp(2.8rem, 6vw, 6rem)' }}>{fr ? 'Transformons votre prochain moment en élan durable.' : 'Turn your next meaningful moment into lasting momentum.'}</h2>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link to="/start-a-project" className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 font-semibold" style={{ backgroundColor: '#7D6D51', color: '#FFFFFF' }}>{fr ? 'Démarrer un projet' : 'Start a project'} <ArrowUpRight className="w-4 h-4" /></Link>
              <a href="mailto:support@creova.one" className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 border" style={{ borderColor: 'rgba(255,255,255,.3)', color: '#FFFFFF' }}><Mail className="w-4 h-4" />support@creova.one</a>
            </div>
          </div>
          <div className="flex flex-col justify-end gap-4 text-sm" style={{ color: '#B7BBC3' }}>
            <p className="flex items-center gap-3"><MapPin className="w-4 h-4" style={{ color: '#C6A45A' }} />{fr ? 'Ontario · Niagara, Hamilton et projets sélectionnés dans le GTA' : 'Ontario · Niagara, Hamilton, and select GTA projects'}</p>
            <p>{fr ? 'Collaboration en anglais et en français.' : 'English and French collaboration.'}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 py-14">
          <FooterColumn title={fr ? 'Services' : 'Services'} links={offers} />
          <FooterColumn title={fr ? 'Entreprise' : 'Company'} links={company} />
          <div>
            <p className="text-xs tracking-[.3em] uppercase mb-5" style={{ color: '#C6A45A' }}>{fr ? 'Nos marques' : 'Our Brands'}</p>
            <ul className="space-y-3 text-sm" style={{ color: '#9B9B9B' }}>
              <li>{VENTURE_URLS.seen ? <a href={VENTURE_URLS.seen} target="_blank" rel="noopener noreferrer" className="hover:text-white">SEEN <ArrowUpRight className="inline w-3 h-3" /></a> : <Link to="/ventures#seen" className="hover:text-white">SEEN · {fr ? 'en développement' : 'in development'}</Link>}</li>
              <li>{VENTURE_URLS.verse ? <a href={VENTURE_URLS.verse} target="_blank" rel="noopener noreferrer" className="hover:text-white">VERSE <ArrowUpRight className="inline w-3 h-3" /></a> : <Link to="/ventures#verse" className="hover:text-white">VERSE · {fr ? 'en incubation' : 'incubating'}</Link>}</li>
            </ul>
          </div>
          <div>
            <p className="text-xs tracking-[.3em] uppercase mb-5" style={{ color: '#C6A45A' }}>{fr ? 'Coordonnées' : 'Connect'}</p>
            <ul className="space-y-3 text-sm" style={{ color: '#9B9B9B' }}>
              <li><a href="https://instagram.com/creativeinnovation__" target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram</a></li>
              <li><a href="https://www.linkedin.com/company/creovaspace/" target="_blank" rel="noopener noreferrer" className="hover:text-white">LinkedIn</a></li>
              <li><a href="mailto:support@creova.one" className="hover:text-white">support@creova.one</a></li>
            </ul>
          </div>
        </div>

        <div className="py-8 border-y" style={{ borderColor: 'rgba(255,255,255,.08)' }}>
          <p className="text-[10px] tracking-[.3em] uppercase mb-4" style={{ color: '#777' }}>{fr ? 'Zones de service' : 'Service areas'}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {SERVICE_AREAS.map(area => <Link key={area.slug} to={`/${area.slug}`} className="text-xs hover:text-[#C6A45A]" style={{ color: '#777' }}>{(fr ? area.fr : area.en).kicker}</Link>)}
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <Link to="/" aria-label="CREOVA"><Logo variant="white" className="h-8 w-auto" interactive={false} /></Link>
          <p className="text-xs" style={{ color: '#777' }}>© {new Date().getFullYear()} CREOVA. {fr ? 'Tous droits réservés.' : 'All rights reserved.'}</p>
          <div className="flex gap-5 text-xs" style={{ color: '#777' }}><Link to="/terms-of-service" className="hover:text-white">{fr ? 'Conditions' : 'Terms'}</Link><Link to="/privacy-policy" className="hover:text-white">{fr ? 'Confidentialité' : 'Privacy'}</Link><Link to="/start-a-project" className="hover:text-white">{fr ? 'Contact' : 'Contact'}</Link></div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[][] }) {
  return <div><p className="text-xs tracking-[.3em] uppercase mb-5" style={{ color: '#C6A45A' }}>{title}</p><ul className="space-y-3">{links.map(([label, href]) => <li key={href}><Link to={href} className="text-sm hover:text-white" style={{ color: '#9B9B9B' }}>{label}</Link></li>)}</ul></div>;
}
