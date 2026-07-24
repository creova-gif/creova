import { useNavigate } from '../i18n/LocaleLink';
import { Button } from '../components/ui/button';
import { motion } from 'motion/react';
import { ArrowLeft, Shield, CheckCircle2 } from 'lucide-react';
import { PageSEO } from '../components/PageSEO';
import { useLanguage } from '../context/LanguageContext';

export function PrivacyPolicyPage() {
  const navigate = useNavigate();
  // Legal page → vous register.
  const fr = useLanguage().language === 'fr';

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F1EB' }}>
      <PageSEO
        title="Privacy Policy"
        description="CREOVA's privacy policy — how we collect, use, and protect your personal information across our website and services."
        path="/privacy-policy"
      />
      {/* Hero */}
      <section className="relative py-16 overflow-hidden" style={{ backgroundColor: '#121212' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 text-sm"
            style={{ color: '#E3DCD3' }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {fr ? 'Retour' : 'Back'}
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: 'rgba(166, 143, 89, 0.1)', border: '1px solid #A68F59' }}>
              <Shield className="w-4 h-4" style={{ color: '#A68F59' }} />
              <span className="text-sm tracking-wide" style={{ color: '#A68F59' }}>{fr ? 'Votre vie privée compte' : 'Your Privacy Matters'}</span>
            </div>

            <h1 className="text-4xl md:text-5xl mb-4" style={{ color: '#F5F1EB' }}>
              {fr ? 'Politique de confidentialité' : 'Privacy Policy'}
            </h1>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: '#E3DCD3' }}>
              {fr ? 'Dernière mise à jour : 18 novembre 2024' : 'Last Updated: November 18, 2024'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12 space-y-8"
          >
            {/* Introduction */}
            <div>
              <h2 className="text-2xl mb-4" style={{ color: '#121212' }}>{fr ? 'Introduction' : 'Introduction'}</h2>
              <p style={{ color: '#7A6F66' }}>
                {fr ? "CREOVA (« nous », « notre ») s'engage à protéger votre vie privée et à assurer la sécurité de vos renseignements personnels. La présente politique de confidentialité explique comment nous recueillons, utilisons, divulguons et protégeons vos renseignements lorsque vous utilisez notre site web, nos services et effectuez des achats." : 'CREOVA ("we", "us", "our") is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, services, and make purchases.'}
              </p>
            </div>

            {/* 1. Information We Collect */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#A68F59' }} />
                <h2 className="text-2xl" style={{ color: '#121212' }}>{fr ? '1. Renseignements que nous recueillons' : '1. Information We Collect'}</h2>
              </div>
              <div className="space-y-3" style={{ color: '#7A6F66' }}>
                <p><strong style={{ color: '#121212' }}>{fr ? 'Renseignements personnels :' : 'Personal Information:'}</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  {(fr ? [
                    'Nom, adresse courriel et numéro de téléphone',
                    'Adresses de facturation et de livraison',
                    'Informations de paiement (traitées de façon sécurisée par Stripe; nous ne stockons pas les détails des cartes de paiement)',
                    'Identifiants de compte (pour les comptes membres)',
                    'Préférences de communication',
                  ] : [
                    'Name, email address, and phone number',
                    'Billing and shipping addresses',
                    'Payment information (processed securely through Stripe; we do not store payment card details)',
                    'Account credentials (for member accounts)',
                    'Communication preferences',
                  ]).map((li, i) => <li key={i}>{li}</li>)}
                </ul>

                <p className="pt-3"><strong style={{ color: '#121212' }}>{fr ? 'Renseignements liés aux services :' : 'Service-Related Information:'}</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  {(fr ? [
                    'Détails de réservation et préférences de service',
                    "Historique de location d'équipement et informations sur les dépôts de garantie",
                    'Photos et vidéos prises durant les séances (avec votre consentement)',
                    'Commentaires et témoignages',
                  ] : [
                    'Booking details and service preferences',
                    'Equipment rental history and security deposit information',
                    'Photos and videos taken during sessions (with your consent)',
                    'Feedback and testimonials',
                  ]).map((li, i) => <li key={i}>{li}</li>)}
                </ul>

                <p className="pt-3"><strong style={{ color: '#121212' }}>{fr ? 'Renseignements techniques :' : 'Technical Information:'}</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  {(fr ? [
                    "Adresse IP et informations sur l'appareil",
                    'Type et version du navigateur',
                    'Pages visitées et temps passé sur notre site web',
                    'Témoins (cookies) et technologies de suivi similaires',
                  ] : [
                    'IP address and device information',
                    'Browser type and version',
                    'Pages visited and time spent on our website',
                    'Cookies and similar tracking technologies',
                  ]).map((li, i) => <li key={i}>{li}</li>)}
                </ul>
              </div>
            </div>

            {/* 2. How We Use Your Information */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#A68F59' }} />
                <h2 className="text-2xl" style={{ color: '#121212' }}>{fr ? '2. Comment nous utilisons vos renseignements' : '2. How We Use Your Information'}</h2>
              </div>
              <div className="space-y-3" style={{ color: '#7A6F66' }}>
                <p>{fr ? 'Nous utilisons vos renseignements pour :' : 'We use your information to:'}</p>
                <ul className="list-disc pl-6 space-y-2">
                  {(fr ? [
                    'Traiter les réservations, commandes et paiements',
                    'Fournir et livrer nos services',
                    "Gérer les locations d'équipement et les dépôts de garantie",
                    'Tenir à jour et gérer les comptes membres',
                    'Envoyer les confirmations de réservation et les mises à jour de service',
                    'Communiquer au sujet de vos commandes et services',
                    'Offrir un soutien à la clientèle',
                    'Envoyer des communications marketing (avec votre consentement)',
                    'Améliorer notre site web et nos services',
                    'Prévenir la fraude et renforcer la sécurité',
                    'Respecter les obligations légales',
                  ] : [
                    'Process bookings, orders, and payments',
                    'Provide and deliver our services',
                    'Manage equipment rentals and security deposits',
                    'Maintain and manage membership accounts',
                    'Send booking confirmations and service updates',
                    'Communicate about your orders and services',
                    'Provide customer support',
                    'Send marketing communications (with your consent)',
                    'Improve our website and services',
                    'Prevent fraud and enhance security',
                    'Comply with legal obligations',
                  ]).map((li, i) => <li key={i}>{li}</li>)}
                </ul>
              </div>
            </div>

            {/* 3. How We Share Your Information */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#A68F59' }} />
                <h2 className="text-2xl" style={{ color: '#121212' }}>{fr ? '3. Comment nous partageons vos renseignements' : '3. How We Share Your Information'}</h2>
              </div>
              <div className="space-y-3" style={{ color: '#7A6F66' }}>
                <p>{fr ? 'Nous pouvons partager vos renseignements avec :' : 'We may share your information with:'}</p>

                <p className="pt-3"><strong style={{ color: '#121212' }}>{fr ? 'Fournisseurs de services :' : 'Service Providers:'}</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  {(fr ? [
                    <><strong>Stripe :</strong> Traitement des paiements (assujetti à la politique de confidentialité de Stripe)</>,
                    <><strong>Supabase :</strong> Services de base de données et d'infrastructure</>,
                    <><strong>Fournisseurs de services de courriel :</strong> Pour l'envoi de communications</>,
                    <><strong>Transporteurs :</strong> Pour la livraison des produits</>,
                  ] : [
                    <><strong>Stripe:</strong> Payment processing (subject to Stripe's privacy policy)</>,
                    <><strong>Supabase:</strong> Database and backend services</>,
                    <><strong>Email service providers:</strong> For sending communications</>,
                    <><strong>Shipping carriers:</strong> For product delivery</>,
                  ]).map((li, i) => <li key={i}>{li}</li>)}
                </ul>

                <p className="pt-3"><strong style={{ color: '#121212' }}>{fr ? 'Exigences légales :' : 'Legal Requirements:'}</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  {(fr ? [
                    'Lorsque la loi ou une procédure judiciaire l\'exige',
                    'Pour protéger nos droits, nos biens ou notre sécurité',
                    "Pour faire respecter nos conditions d'utilisation",
                  ] : [
                    'When required by law or legal process',
                    'To protect our rights, property, or safety',
                    'To enforce our Terms of Service',
                  ]).map((li, i) => <li key={i}>{li}</li>)}
                </ul>

                <p className="pt-3"><strong style={{ color: '#121212' }}>{fr ? "Transferts d'entreprise :" : 'Business Transfers:'}</strong></p>
                <p>{fr ? "En cas de fusion, d'acquisition ou de vente d'actifs, vos renseignements peuvent être transférés au nouveau propriétaire." : 'In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new owner.'}</p>

                <p className="pt-3" style={{ color: '#121212' }}><strong>{fr ? 'Nous ne vendons pas vos renseignements personnels à des tiers.' : 'We do not sell your personal information to third parties.'}</strong></p>
              </div>
            </div>

            {/* 4. Cookies and Tracking */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#A68F59' }} />
                <h2 className="text-2xl" style={{ color: '#121212' }}>{fr ? '4. Témoins et technologies de suivi' : '4. Cookies and Tracking Technologies'}</h2>
              </div>
              <div className="space-y-3" style={{ color: '#7A6F66' }}>
                <p>{fr ? 'Nous utilisons des témoins et des technologies similaires pour :' : 'We use cookies and similar technologies to:'}</p>
                <ul className="list-disc pl-6 space-y-2">
                  {(fr ? [
                    'Mémoriser vos préférences et paramètres',
                    'Maintenir votre panier',
                    "Analyser le trafic du site web et le comportement des utilisateurs",
                    'Fournir du contenu personnalisé',
                    'Améliorer les fonctionnalités du site web',
                  ] : [
                    'Remember your preferences and settings',
                    'Maintain your shopping cart',
                    'Analyze website traffic and user behavior',
                    'Provide personalized content',
                    'Improve website functionality',
                  ]).map((li, i) => <li key={i}>{li}</li>)}
                </ul>
                <p className="pt-3">{fr ? "Vous pouvez contrôler les témoins dans les paramètres de votre navigateur. Toutefois, leur désactivation peut nuire à votre capacité d'utiliser certaines fonctionnalités de notre site web." : 'You can control cookies through your browser settings. However, disabling cookies may affect your ability to use certain features of our website.'}</p>
              </div>
            </div>

            {/* 5. Data Security */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#A68F59' }} />
                <h2 className="text-2xl" style={{ color: '#121212' }}>{fr ? '5. Sécurité des données' : '5. Data Security'}</h2>
              </div>
              <div className="space-y-3" style={{ color: '#7A6F66' }}>
                <p>{fr ? 'Nous mettons en place des mesures de sécurité appropriées pour protéger vos renseignements :' : 'We implement appropriate security measures to protect your information:'}</p>
                <ul className="list-disc pl-6 space-y-2">
                  {(fr ? [
                    'Chiffrement SSL/TLS pour la transmission des données',
                    'Traitement sécurisé des paiements par Stripe (conforme à la norme PCI-DSS)',
                    'Audits et mises à jour de sécurité réguliers',
                    'Accès limité aux renseignements personnels (selon le besoin de connaître)',
                    'Stockage sécurisé des données avec Supabase',
                  ] : [
                    'SSL/TLS encryption for data transmission',
                    'Secure payment processing through Stripe (PCI-DSS compliant)',
                    'Regular security audits and updates',
                    'Limited access to personal information (need-to-know basis)',
                    'Secure data storage with Supabase',
                  ]).map((li, i) => <li key={i}>{li}</li>)}
                </ul>
                <p className="pt-3">{fr ? "Toutefois, aucune méthode de transmission sur Internet n'est sûre à 100 %. Bien que nous nous efforcions de protéger vos renseignements, nous ne pouvons garantir une sécurité absolue." : 'However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.'}</p>
              </div>
            </div>

            {/* 6. Data Retention */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#A68F59' }} />
                <h2 className="text-2xl" style={{ color: '#121212' }}>{fr ? '6. Conservation des données' : '6. Data Retention'}</h2>
              </div>
              <div className="space-y-3" style={{ color: '#7A6F66' }}>
                <p>{fr ? 'Nous conservons vos renseignements aussi longtemps que nécessaire pour :' : 'We retain your information for as long as necessary to:'}</p>
                <ul className="list-disc pl-6 space-y-2">
                  {(fr ? [
                    'Fournir nos services',
                    'Tenir à jour votre compte',
                    'Respecter les obligations légales',
                    'Résoudre les litiges',
                    'Faire respecter nos ententes',
                  ] : [
                    'Provide our services',
                    'Maintain your account',
                    'Comply with legal obligations',
                    'Resolve disputes',
                    'Enforce our agreements',
                  ]).map((li, i) => <li key={i}>{li}</li>)}
                </ul>
                <p className="pt-3">{fr ? "Après la fin des services ou la suppression du compte, nous pouvons conserver certains renseignements à des fins légales et commerciales, généralement pendant 7 ans, conformément aux exigences canadiennes de conservation des documents d'entreprise." : 'After termination of services or account deletion, we may retain certain information for legal and business purposes, typically for 7 years in accordance with Canadian business record retention requirements.'}</p>
              </div>
            </div>

            {/* 7. Your Rights and Choices */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#A68F59' }} />
                <h2 className="text-2xl" style={{ color: '#121212' }}>{fr ? '7. Vos droits et choix' : '7. Your Rights and Choices'}</h2>
              </div>
              <div className="space-y-3" style={{ color: '#7A6F66' }}>
                <p>{fr ? 'Vous avez le droit de :' : 'You have the right to:'}</p>
                <ul className="list-disc pl-6 space-y-2">
                  {(fr ? [
                    <><strong style={{ color: '#121212' }}>Accès :</strong> Demander une copie de vos renseignements personnels</>,
                    <><strong style={{ color: '#121212' }}>Correction :</strong> Demander la correction de renseignements inexacts</>,
                    <><strong style={{ color: '#121212' }}>Suppression :</strong> Demander la suppression de vos renseignements personnels (sous réserve des exigences légales de conservation)</>,
                    <><strong style={{ color: '#121212' }}>Retrait :</strong> Vous désabonner des communications marketing (cliquez sur « se désabonner » dans les courriels)</>,
                    <><strong style={{ color: '#121212' }}>Portabilité des données :</strong> Demander vos données dans un format portable</>,
                    <><strong style={{ color: '#121212' }}>Opposition :</strong> Vous opposer au traitement de vos renseignements</>,
                  ] : [
                    <><strong style={{ color: '#121212' }}>Access:</strong> Request a copy of your personal information</>,
                    <><strong style={{ color: '#121212' }}>Correction:</strong> Request correction of inaccurate information</>,
                    <><strong style={{ color: '#121212' }}>Deletion:</strong> Request deletion of your personal information (subject to legal retention requirements)</>,
                    <><strong style={{ color: '#121212' }}>Opt-out:</strong> Unsubscribe from marketing communications (click "unsubscribe" in emails)</>,
                    <><strong style={{ color: '#121212' }}>Data Portability:</strong> Request your data in a portable format</>,
                    <><strong style={{ color: '#121212' }}>Object:</strong> Object to processing of your information</>,
                  ]).map((li, i) => <li key={i}>{li}</li>)}
                </ul>
                <p className="pt-3">{fr ? 'Pour exercer ces droits, joignez-nous à support@creova.ca. Nous répondrons dans un délai de 30 jours.' : 'To exercise these rights, contact us at support@creova.ca. We will respond within 30 days.'}</p>
              </div>
            </div>

            {/* 8. Marketing Communications */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#A68F59' }} />
                <h2 className="text-2xl" style={{ color: '#121212' }}>{fr ? '8. Communications marketing' : '8. Marketing Communications'}</h2>
              </div>
              <div className="space-y-3" style={{ color: '#7A6F66' }}>
                <p>{fr ? 'Avec votre consentement, nous pouvons vous envoyer :' : 'With your consent, we may send you:'}</p>
                <ul className="list-disc pl-6 space-y-2">
                  {(fr ? [
                    'Des courriels promotionnels sur les nouveaux services et produits',
                    'Des offres spéciales et des rabais',
                    "Des annonces d'événements et d'ateliers",
                    'Des infolettres et des mises à jour pour les membres',
                  ] : [
                    'Promotional emails about new services and products',
                    'Special offers and discounts',
                    'Event and workshop announcements',
                    'Member newsletters and updates',
                  ]).map((li, i) => <li key={i}>{li}</li>)}
                </ul>
                <p className="pt-3">{fr ? "Vous pouvez vous désabonner à tout moment en cliquant sur « se désabonner » dans nos courriels ou en nous joignant directement." : 'You can opt-out at any time by clicking "unsubscribe" in our emails or contacting us directly.'}</p>
              </div>
            </div>

            {/* 9. Third-Party Links */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#A68F59' }} />
                <h2 className="text-2xl" style={{ color: '#121212' }}>{fr ? '9. Liens et services de tiers' : '9. Third-Party Links and Services'}</h2>
              </div>
              <div className="space-y-3" style={{ color: '#7A6F66' }}>
                <p>{fr ? "Notre site web peut contenir des liens vers des sites web et services de tiers (p. ex. des plateformes de médias sociaux). Nous ne sommes pas responsables des pratiques de confidentialité de ces tiers. Nous vous encourageons à consulter leurs politiques de confidentialité avant de fournir tout renseignement personnel." : 'Our website may contain links to third-party websites and services (e.g., social media platforms). We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing any personal information.'}</p>
              </div>
            </div>

            {/* 10. Children's Privacy */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#A68F59' }} />
                <h2 className="text-2xl" style={{ color: '#121212' }}>{fr ? '10. Vie privée des enfants' : "10. Children's Privacy"}</h2>
              </div>
              <div className="space-y-3" style={{ color: '#7A6F66' }}>
                <p>{fr ? "Nos services ne s'adressent pas aux enfants de moins de 13 ans. Nous ne recueillons pas sciemment de renseignements personnels auprès d'enfants. Si vous êtes un parent ou un tuteur et croyez que votre enfant nous a fourni des renseignements personnels, veuillez nous joindre pour les faire retirer." : 'Our services are not directed to children under 13 years of age. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us to have it removed.'}</p>
              </div>
            </div>

            {/* 11. International Data Transfers */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#A68F59' }} />
                <h2 className="text-2xl" style={{ color: '#121212' }}>{fr ? '11. Transferts internationaux de données' : '11. International Data Transfers'}</h2>
              </div>
              <div className="space-y-3" style={{ color: '#7A6F66' }}>
                <p>{fr ? "CREOVA est basée en Ontario, au Canada. Si vous accédez à nos services depuis l'extérieur du Canada, vos renseignements peuvent être transférés et traités au Canada ou dans d'autres pays où nos fournisseurs de services exercent leurs activités. En utilisant nos services, vous consentez à de tels transferts." : 'CREOVA is based in Ontario, Canada. If you access our services from outside Canada, your information may be transferred to and processed in Canada or other countries where our service providers operate. By using our services, you consent to such transfers.'}</p>
              </div>
            </div>

            {/* 12. Changes to Privacy Policy */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#A68F59' }} />
                <h2 className="text-2xl" style={{ color: '#121212' }}>{fr ? '12. Modifications de la présente politique' : '12. Changes to This Privacy Policy'}</h2>
              </div>
              <div className="space-y-3" style={{ color: '#7A6F66' }}>
                <p>{fr ? 'Nous pouvons mettre à jour la présente politique de confidentialité de temps à autre. Nous vous informerons des changements importants en :' : 'We may update this Privacy Policy from time to time. We will notify you of significant changes by:'}</p>
                <ul className="list-disc pl-6 space-y-2">
                  {(fr ? [
                    'Publiant la politique mise à jour sur notre site web',
                    'Mettant à jour la date de « dernière mise à jour »',
                    "Envoyant une notification par courriel pour les changements importants (si nous avons votre courriel)",
                  ] : [
                    'Posting the updated policy on our website',
                    'Updating the "Last Updated" date',
                    'Sending an email notification for material changes (if we have your email)',
                  ]).map((li, i) => <li key={i}>{li}</li>)}
                </ul>
                <p className="pt-3">{fr ? 'Votre utilisation continue de nos services après la publication des changements constitue une acceptation de la politique de confidentialité mise à jour.' : 'Your continued use of our services after changes are posted constitutes acceptance of the updated Privacy Policy.'}</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t pt-8" style={{ borderColor: '#E3DCD3' }}>
              <h2 className="text-2xl mb-4" style={{ color: '#121212' }}>{fr ? 'Nous joindre au sujet de la confidentialité' : 'Contact Us About Privacy'}</h2>
              <p style={{ color: '#7A6F66' }}>
                {fr ? 'Si vous avez des questions ou des préoccupations concernant la présente politique de confidentialité ou nos pratiques en matière de données :' : 'If you have questions or concerns about this Privacy Policy or our data practices:'}
              </p>
              <ul className="mt-3 space-y-2" style={{ color: '#7A6F66' }}>
                <li><strong style={{ color: '#121212' }}>{fr ? 'Courriel :' : 'Email:'}</strong> support@creova.ca</li>
                <li><strong style={{ color: '#121212' }}>{fr ? 'Objet :' : 'Subject Line:'}</strong> {fr ? '« Demande de confidentialité »' : '"Privacy Inquiry"'}</li>
                <li><strong style={{ color: '#121212' }}>{fr ? 'Lieu :' : 'Location:'}</strong> Ontario, Canada</li>
              </ul>
            </div>

            {/* Canadian Privacy Compliance */}
            <div className="border-t pt-8" style={{ borderColor: '#E3DCD3' }}>
              <h2 className="text-2xl mb-4" style={{ color: '#121212' }}>{fr ? 'Conformité à la législation canadienne sur la vie privée' : 'Canadian Privacy Compliance'}</h2>
              <p style={{ color: '#7A6F66' }}>
                {fr ? "CREOVA se conforme à la Loi sur la protection des renseignements personnels et les documents électroniques (LPRPDE) ainsi qu'aux lois provinciales applicables en matière de vie privée au Canada. Nous nous engageons à protéger vos droits à la vie privée en vertu du droit canadien." : 'CREOVA complies with the Personal Information Protection and Electronic Documents Act (PIPEDA) and applicable provincial privacy legislation in Canada. We are committed to protecting your privacy rights under Canadian law.'}
              </p>
            </div>

            {/* Agreement Statement */}
            <div className="border-t pt-8" style={{ borderColor: '#E3DCD3' }}>
              <div className="p-6 rounded-xl" style={{ backgroundColor: 'rgba(166, 143, 89, 0.1)' }}>
                <p className="text-sm" style={{ color: '#121212' }}>
                  {fr ? "En utilisant les services de CREOVA, vous reconnaissez avoir lu et compris la présente politique de confidentialité et acceptez la collecte, l'utilisation et la divulgation de vos renseignements telles que décrites dans les présentes." : 'By using CREOVA\'s services, you acknowledge that you have read and understood this Privacy Policy and agree to the collection, use, and disclosure of your information as described herein.'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}