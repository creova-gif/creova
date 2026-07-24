import { useNavigate } from '../i18n/LocaleLink';
import { Button } from '../components/ui/button';
import { motion } from 'motion/react';
import { ArrowLeft, FileText, CheckCircle2 } from 'lucide-react';
import { PageSEO } from '../components/PageSEO';
import { useLanguage } from '../context/LanguageContext';

export function TermsOfServicePage() {
  const navigate = useNavigate();
  // Legal page → vous register.
  const fr = useLanguage().language === 'fr';

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F1EB' }}>
      <PageSEO
        title="Terms of Service"
        description="Terms of service for CREOVA's creative agency services, including photography, videography, brand design, and digital products."
        path="/terms-of-service"
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
              <FileText className="w-4 h-4" style={{ color: '#A68F59' }} />
              <span className="text-sm tracking-wide" style={{ color: '#A68F59' }}>{fr ? 'Informations légales' : 'Legal Information'}</span>
            </div>

            <h1 className="text-4xl md:text-5xl mb-4" style={{ color: '#F5F1EB' }}>
              {fr ? "Conditions d'utilisation" : 'Terms of Service'}
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
            {/* Welcome */}
            <div>
              <h2 className="text-2xl mb-4" style={{ color: '#121212' }}>{fr ? 'Bienvenue chez CREOVA' : 'Welcome to CREOVA'}</h2>
              <p style={{ color: '#7A6F66' }}>
                {fr ? "Merci d'avoir choisi CREOVA. Les présentes conditions d'utilisation (« Conditions ») régissent votre utilisation de notre site web, de nos services, de nos produits et de nos locations d'équipement. En accédant aux services de CREOVA ou en les utilisant, vous acceptez d'être lié par ces Conditions." : 'Thank you for choosing CREOVA. These Terms of Service ("Terms") govern your use of our website, services, products, and equipment rentals. By accessing or using CREOVA\'s services, you agree to be bound by these Terms.'}
              </p>
            </div>

            {/* 1. Services Offered */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#A68F59' }} />
                <h2 className="text-2xl" style={{ color: '#121212' }}>{fr ? '1. Services offerts' : '1. Services Offered'}</h2>
              </div>
              <div className="space-y-3" style={{ color: '#7A6F66' }}>
                <p>{fr ? 'CREOVA offre les services suivants :' : 'CREOVA provides the following services:'}</p>
                <ul className="list-disc pl-6 space-y-2">
                  {(fr ? [
                    'Services de photographie professionnelle (portraits de famille, photographie de marque, photographie de produits)',
                    'Services de vidéographie et de création de contenu',
                    'Services de gestion de marque et de design graphique',
                    'Services de gestion des médias sociaux',
                    "Services de couverture d'événements",
                    "Services de location d'équipement",
                    'Ventes en ligne (collection mode SEEN et marchandise)',
                    'Ventes de produits numériques (préréglages, gabarits, guides)',
                    "Billetterie d'événements et inscription aux ateliers",
                  ] : [
                    'Professional photography services (family portraits, brand photography, product photography)',
                    'Videography and content creation services',
                    'Brand management and graphic design services',
                    'Social media management services',
                    'Event coverage services',
                    'Equipment rental services',
                    'E-commerce sales (SEEN fashion collection and merchandise)',
                    'Digital product sales (presets, templates, guides)',
                    'Event ticketing and workshop registration',
                  ]).map((li, i) => <li key={i}>{li}</li>)}
                </ul>
              </div>
            </div>

            {/* 2. Booking and Payment */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#A68F59' }} />
                <h2 className="text-2xl" style={{ color: '#121212' }}>{fr ? '2. Réservation et paiement' : '2. Booking and Payment'}</h2>
              </div>
              <div className="space-y-3" style={{ color: '#7A6F66' }}>
                <p><strong style={{ color: '#121212' }}>{fr ? 'Réservations de services :' : 'Service Bookings:'}</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  {(fr ? [
                    'Un acompte non remboursable de 50 % est requis pour réserver votre date',
                    'Le solde restant est dû avant ou au moment de la prestation du service',
                    "Les réservations ne sont confirmées qu'après réception de l'acompte",
                    'Tous les prix sont en dollars canadiens (CAD), sauf indication contraire',
                  ] : [
                    'A 50% non-refundable deposit is required to secure your booking date',
                    'The remaining balance is due before or at the time of service delivery',
                    'Bookings are confirmed only after deposit payment is received',
                    'All prices are in Canadian Dollars (CAD) unless otherwise specified',
                  ]).map((li, i) => <li key={i}>{li}</li>)}
                </ul>

                <p className="pt-3"><strong style={{ color: '#121212' }}>{fr ? 'Modes de paiement :' : 'Payment Methods:'}</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  {(fr ? [
                    'Nous acceptons les principales cartes de crédit, cartes de débit, Apple Pay et Google Pay via Stripe',
                    'Tous les paiements sont traités de façon sécurisée par la plateforme de paiement Stripe',
                    'Les informations de paiement ne sont jamais stockées sur les serveurs de CREOVA',
                  ] : [
                    'We accept major credit cards, debit cards, Apple Pay, and Google Pay via Stripe',
                    'All payments are processed securely through Stripe\'s payment platform',
                    'Payment information is never stored on CREOVA servers',
                  ]).map((li, i) => <li key={i}>{li}</li>)}
                </ul>
              </div>
            </div>

            {/* 3. Equipment Rental Terms */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#A68F59' }} />
                <h2 className="text-2xl" style={{ color: '#121212' }}>{fr ? "3. Conditions de location d'équipement" : '3. Equipment Rental Terms'}</h2>
              </div>
              <div className="space-y-3" style={{ color: '#7A6F66' }}>
                <p><strong style={{ color: '#121212' }}>{fr ? 'Période de location :' : 'Rental Period:'}</strong> {fr ? "Les locations d'équipement sont fondées sur des périodes de 24 heures (p. ex. ramassage lundi 9 h, retour mardi avant 9 h)." : 'Equipment rentals are based on 24-hour periods (e.g., pickup at 9am Monday, return by 9am Tuesday).'}</p>

                <p><strong style={{ color: '#121212' }}>{fr ? 'Dépôt de garantie :' : 'Security Deposit:'}</strong> {fr ? "Un dépôt de garantie remboursable est requis pour toutes les locations d'équipement. Les dépôts sont remis dans les 5 jours ouvrables après le retour de l'équipement en bon état." : 'A refundable security deposit is required for all equipment rentals. Deposits are returned within 5 business days after equipment is returned in good condition.'}</p>

                <p><strong style={{ color: '#121212' }}>{fr ? 'Dommages et perte :' : 'Damage and Loss:'}</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  {(fr ? [
                    "Le locataire est responsable de tout dommage ou perte de l'équipement",
                    "L'équipement doit être retourné dans le même état qu'à la réception",
                    "L'usure normale est prévue et acceptable",
                    "Des options d'assurance sont offertes au moment de la location",
                  ] : [
                    'Renter is responsible for any damage to or loss of equipment',
                    'Equipment must be returned in the same condition as received',
                    'Normal wear and tear is expected and acceptable',
                    'Insurance options are available at the time of rental',
                  ]).map((li, i) => <li key={i}>{li}</li>)}
                </ul>

                <p><strong style={{ color: '#121212' }}>{fr ? 'Retours tardifs :' : 'Late Returns:'}</strong> {fr ? "Les retours tardifs peuvent entraîner des frais de location quotidiens supplémentaires et affecter le remboursement du dépôt de garantie." : 'Late returns may result in additional daily rental fees and may impact security deposit refund.'}</p>
              </div>
            </div>

            {/* 4. Cancellation and Refund Policy */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#A68F59' }} />
                <h2 className="text-2xl" style={{ color: '#121212' }}>{fr ? "4. Politique d'annulation et de remboursement" : '4. Cancellation and Refund Policy'}</h2>
              </div>
              <div className="space-y-3" style={{ color: '#7A6F66' }}>
                <p><strong style={{ color: '#121212' }}>{fr ? 'Annulations de services :' : 'Service Cancellations:'}</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  {(fr ? [
                    "Annulations plus de 14 jours avant le service prévu : remboursement complet moins des frais de traitement de 50 $",
                    'Annulations de 7 à 14 jours avant : remboursement de 50 %',
                    "Annulations moins de 7 jours avant : aucun remboursement (acompte perdu)",
                    "CREOVA se réserve le droit de reporter en cas d'urgence ou de circonstances imprévues",
                  ] : [
                    'Cancellations more than 14 days before the scheduled service: Full refund minus $50 processing fee',
                    'Cancellations 7-14 days before: 50% refund',
                    'Cancellations less than 7 days before: No refund (deposit forfeited)',
                    'CREOVA reserves the right to reschedule due to emergencies or unforeseen circumstances',
                  ]).map((li, i) => <li key={i}>{li}</li>)}
                </ul>

                <p className="pt-3"><strong style={{ color: '#121212' }}>{fr ? 'Retours de produits :' : 'Product Returns:'}</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  {(fr ? [
                    "Produits physiques (collection SEEN) : politique de retour de 30 jours pour les articles non portés, inutilisés et avec les étiquettes d'origine",
                    'Produits numériques : aucun remboursement en raison de la nature du contenu numérique',
                    "Billets d'événement : non remboursables, sauf si l'événement est annulé par CREOVA",
                  ] : [
                    'Physical products (SEEN collection): 30-day return policy for unworn, unused items with original tags',
                    'Digital products: No refunds due to the nature of digital content',
                    'Event tickets: Non-refundable unless event is cancelled by CREOVA',
                  ]).map((li, i) => <li key={i}>{li}</li>)}
                </ul>
              </div>
            </div>

            {/* 5. Intellectual Property */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#A68F59' }} />
                <h2 className="text-2xl" style={{ color: '#121212' }}>{fr ? '5. Droits de propriété intellectuelle' : '5. Intellectual Property Rights'}</h2>
              </div>
              <div className="space-y-3" style={{ color: '#7A6F66' }}>
                <p><strong style={{ color: '#121212' }}>{fr ? 'Photographie et vidéographie :' : 'Photography and Videography:'}</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  {(fr ? [
                    "CREOVA conserve les droits d'auteur sur toutes les photos et vidéos produites",
                    "Les clients reçoivent une licence personnelle ou commerciale (telle que précisée dans le forfait) pour utiliser le contenu",
                    "CREOVA peut utiliser les photos et vidéos à des fins de portfolio, de marketing et de promotion, sauf convention écrite contraire",
                    "Les clients doivent créditer CREOVA lorsqu'ils partagent du contenu sur les médias sociaux ou des plateformes publiques",
                  ] : [
                    'CREOVA retains copyright to all photos and videos produced',
                    'Clients receive a personal or commercial license (as specified in package) to use the content',
                    'CREOVA may use photos/videos for portfolio, marketing, and promotional purposes unless otherwise agreed in writing',
                    'Clients must credit CREOVA when sharing content on social media or public platforms',
                  ]).map((li, i) => <li key={i}>{li}</li>)}
                </ul>

                <p className="pt-3"><strong style={{ color: '#121212' }}>{fr ? 'Matériel de marque :' : 'Brand Materials:'}</strong> {fr ? "Tous les logos, designs et matériels de marque créés par CREOVA appartiennent à CREOVA jusqu'à réception du paiement complet, moment auquel les droits sont transférés au client tel que précisé dans l'entente de service." : 'All logos, designs, and brand materials created by CREOVA are owned by CREOVA until full payment is received, at which point rights transfer to the client as specified in the service agreement.'}</p>
              </div>
            </div>

            {/* 6. User Conduct */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#A68F59' }} />
                <h2 className="text-2xl" style={{ color: '#121212' }}>{fr ? "6. Conduite de l'utilisateur" : '6. User Conduct'}</h2>
              </div>
              <div className="space-y-3" style={{ color: '#7A6F66' }}>
                <p>{fr ? 'En utilisant les services de CREOVA, vous acceptez de :' : 'By using CREOVA services, you agree to:'}</p>
                <ul className="list-disc pl-6 space-y-2">
                  {(fr ? [
                    'Fournir des informations exactes et véridiques',
                    "Traiter le personnel, l'équipement et les biens de CREOVA avec respect",
                    'Arriver à temps aux séances et aux ramassages prévus',
                    "Ne pas utiliser l'équipement à des fins illégales ou nuisibles",
                    "Ne pas revendre ni sous-louer l'équipement loué",
                    'Respecter la vision créative et le jugement professionnel de CREOVA',
                  ] : [
                    'Provide accurate and truthful information',
                    'Treat CREOVA staff, equipment, and property with respect',
                    'Arrive on time for scheduled sessions and pickups',
                    'Not use equipment for illegal or harmful purposes',
                    'Not resell or sublease rented equipment',
                    'Respect CREOVA\'s creative vision and professional judgment',
                  ]).map((li, i) => <li key={i}>{li}</li>)}
                </ul>
              </div>
            </div>

            {/* 7. Limitation of Liability */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#A68F59' }} />
                <h2 className="text-2xl" style={{ color: '#121212' }}>{fr ? '7. Limitation de responsabilité' : '7. Limitation of Liability'}</h2>
              </div>
              <div className="space-y-3" style={{ color: '#7A6F66' }}>
                <p>{fr ? "CREOVA n'est pas responsable de :" : 'CREOVA is not liable for:'}</p>
                <ul className="list-disc pl-6 space-y-2">
                  {(fr ? [
                    "Défaillance ou panne d'équipement pendant la période de location (un remplacement ou un remboursement sera fourni)",
                    "Retards ou annulations liés à la météo pour les tournages extérieurs (report possible)",
                    "Perte de données ou de fichiers due à des problèmes techniques (nous conservons des copies de sauvegarde, mais ne pouvons garantir la récupération)",
                    "Problèmes de plateformes tierces (médias sociaux, processeurs de paiement, etc.)",
                  ] : [
                    'Equipment malfunction or failure during rental period (replacement or refund will be provided)',
                    'Weather-related delays or cancellations for outdoor shoots (rescheduling available)',
                    'Loss of data or files due to technical issues (we maintain backups but cannot guarantee recovery)',
                    'Third-party platform issues (social media, payment processors, etc.)',
                  ]).map((li, i) => <li key={i}>{li}</li>)}
                </ul>
                <p className="pt-3">{fr ? "Notre responsabilité totale se limite au montant payé pour le service ou le produit en question." : 'Our total liability is limited to the amount paid for the specific service or product in question.'}</p>
              </div>
            </div>

            {/* 8. Privacy and Data Protection */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#A68F59' }} />
                <h2 className="text-2xl" style={{ color: '#121212' }}>{fr ? '8. Confidentialité et protection des données' : '8. Privacy and Data Protection'}</h2>
              </div>
              <div className="space-y-3" style={{ color: '#7A6F66' }}>
                <p>{fr ? 'Votre vie privée nous tient à cœur. Veuillez consulter notre ' : 'Your privacy is important to us. Please review our '}<button
                  onClick={() => navigate('/privacy-policy')}
                  className="underline"
                  style={{ color: '#A68F59' }}
                >{fr ? 'politique de confidentialité' : 'Privacy Policy'}</button>{fr ? ' pour des informations détaillées sur la façon dont nous recueillons, utilisons et protégeons vos renseignements personnels.' : ' for detailed information about how we collect, use, and protect your personal information.'}</p>
              </div>
            </div>

            {/* 9. Modifications to Terms */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#A68F59' }} />
                <h2 className="text-2xl" style={{ color: '#121212' }}>{fr ? '9. Modifications des conditions' : '9. Modifications to Terms'}</h2>
              </div>
              <div className="space-y-3" style={{ color: '#7A6F66' }}>
                <p>{fr ? "CREOVA se réserve le droit de modifier ces Conditions à tout moment. Les modifications prennent effet dès leur publication sur notre site web. Votre utilisation continue de nos services après la publication des modifications constitue une acceptation des Conditions modifiées." : 'CREOVA reserves the right to modify these Terms at any time. Changes will be effective immediately upon posting to our website. Your continued use of our services after changes are posted constitutes acceptance of the modified Terms.'}</p>
              </div>
            </div>

            {/* 10. Governing Law */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#A68F59' }} />
                <h2 className="text-2xl" style={{ color: '#121212' }}>{fr ? '10. Droit applicable' : '10. Governing Law'}</h2>
              </div>
              <div className="space-y-3" style={{ color: '#7A6F66' }}>
                <p>{fr ? "Les présentes Conditions sont régies par les lois de la province de l'Ontario et les lois fédérales du Canada. Tout litige sera résolu devant les tribunaux de l'Ontario." : 'These Terms are governed by the laws of the Province of Ontario and the federal laws of Canada. Any disputes will be resolved in the courts of Ontario.'}</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t pt-8" style={{ borderColor: '#E3DCD3' }}>
              <h2 className="text-2xl mb-4" style={{ color: '#121212' }}>{fr ? 'Nous joindre' : 'Contact Us'}</h2>
              <p style={{ color: '#7A6F66' }}>
                {fr ? "Si vous avez des questions au sujet de ces conditions d'utilisation, veuillez nous joindre :" : 'If you have questions about these Terms of Service, please contact us:'}
              </p>
              <ul className="mt-3 space-y-2" style={{ color: '#7A6F66' }}>
                <li><strong style={{ color: '#121212' }}>{fr ? 'Courriel :' : 'Email:'}</strong> support@creova.ca</li>
                <li><strong style={{ color: '#121212' }}>{fr ? 'Lieu :' : 'Location:'}</strong> {fr ? 'Ontario, Canada' : 'Ontario, Canada'}</li>
                <li><strong style={{ color: '#121212' }}>{fr ? 'Site web :' : 'Website:'}</strong> www.creova.com</li>
              </ul>
            </div>

            {/* Agreement Statement */}
            <div className="border-t pt-8" style={{ borderColor: '#E3DCD3' }}>
              <div className="p-6 rounded-xl" style={{ backgroundColor: 'rgba(166, 143, 89, 0.1)' }}>
                <p className="text-sm" style={{ color: '#121212' }}>
                  {fr ? "En utilisant les services de CREOVA, en effectuant un achat ou en vous inscrivant à un abonnement, vous reconnaissez avoir lu, compris et accepté d'être lié par ces conditions d'utilisation." : 'By using CREOVA\'s services, making a purchase, or signing up for a membership, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}