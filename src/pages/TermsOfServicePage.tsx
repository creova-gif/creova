import { useNavigate } from '../i18n/LocaleLink';
import { Button } from '../components/ui/button';
import { motion } from 'motion/react';
import { ArrowLeft, FileText, CheckCircle2 } from 'lucide-react';
import { PageSEO } from '../components/PageSEO';

export function TermsOfServicePage() {
  const navigate = useNavigate();

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
            Back
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: 'rgba(166, 143, 89, 0.1)', border: '1px solid #A68F59' }}>
              <FileText className="w-4 h-4" style={{ color: '#A68F59' }} />
              <span className="text-sm tracking-wide" style={{ color: '#A68F59' }}>Legal Information</span>
            </div>

            <h1 className="text-4xl md:text-5xl mb-4" style={{ color: '#F5F1EB' }}>
              Terms of Service
            </h1>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: '#E3DCD3' }}>
              Last Updated: November 18, 2024
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
              <h2 className="text-2xl mb-4" style={{ color: '#121212' }}>Welcome to CREOVA</h2>
              <p style={{ color: '#7A6F66' }}>
                Thank you for choosing CREOVA. These Terms of Service ("Terms") govern your use of our website, 
                services, products, and equipment rentals. By accessing or using CREOVA's services, you agree to be 
                bound by these Terms.
              </p>
            </div>

            {/* 1. Services Offered */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#A68F59' }} />
                <h2 className="text-2xl" style={{ color: '#121212' }}>1. Services Offered</h2>
              </div>
              <div className="space-y-3" style={{ color: '#7A6F66' }}>
                <p>CREOVA provides the following services:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Professional photography services (family portraits, brand photography, product photography)</li>
                  <li>Videography and content creation services</li>
                  <li>Brand management and graphic design services</li>
                  <li>Social media management services</li>
                  <li>Event coverage services</li>
                  <li>Equipment rental services</li>
                  <li>E-commerce sales (SEEN fashion collection and merchandise)</li>
                  <li>Digital product sales (presets, templates, guides)</li>
                  <li>Event ticketing and workshop registration</li>
                </ul>
              </div>
            </div>

            {/* 2. Booking and Payment */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#A68F59' }} />
                <h2 className="text-2xl" style={{ color: '#121212' }}>2. Booking and Payment</h2>
              </div>
              <div className="space-y-3" style={{ color: '#7A6F66' }}>
                <p><strong style={{ color: '#121212' }}>Service Bookings:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>A 50% non-refundable deposit is required to secure your booking date</li>
                  <li>The remaining balance is due before or at the time of service delivery</li>
                  <li>Bookings are confirmed only after deposit payment is received</li>
                  <li>All prices are in Canadian Dollars (CAD) unless otherwise specified</li>
                </ul>
                
                <p className="pt-3"><strong style={{ color: '#121212' }}>Payment Methods:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>We accept major credit cards, debit cards, Apple Pay, and Google Pay via Stripe</li>
                  <li>All payments are processed securely through Stripe's payment platform</li>
                  <li>Payment information is never stored on CREOVA servers</li>
                </ul>
              </div>
            </div>

            {/* 3. Equipment Rental Terms */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#A68F59' }} />
                <h2 className="text-2xl" style={{ color: '#121212' }}>3. Equipment Rental Terms</h2>
              </div>
              <div className="space-y-3" style={{ color: '#7A6F66' }}>
                <p><strong style={{ color: '#121212' }}>Rental Period:</strong> Equipment rentals are based on 24-hour periods 
                (e.g., pickup at 9am Monday, return by 9am Tuesday).</p>
                
                <p><strong style={{ color: '#121212' }}>Security Deposit:</strong> A refundable security deposit is required 
                for all equipment rentals. Deposits are returned within 5 business days after equipment is returned in good condition.</p>
                
                <p><strong style={{ color: '#121212' }}>Damage and Loss:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Renter is responsible for any damage to or loss of equipment</li>
                  <li>Equipment must be returned in the same condition as received</li>
                  <li>Normal wear and tear is expected and acceptable</li>
                  <li>Insurance options are available at the time of rental</li>
                </ul>
                
                <p><strong style={{ color: '#121212' }}>Late Returns:</strong> Late returns may result in additional daily 
                rental fees and may impact security deposit refund.</p>
              </div>
            </div>

            {/* 4. Cancellation and Refund Policy */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#A68F59' }} />
                <h2 className="text-2xl" style={{ color: '#121212' }}>4. Cancellation and Refund Policy</h2>
              </div>
              <div className="space-y-3" style={{ color: '#7A6F66' }}>
                <p><strong style={{ color: '#121212' }}>Service Cancellations:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Cancellations more than 14 days before the scheduled service: Full refund minus $50 processing fee</li>
                  <li>Cancellations 7-14 days before: 50% refund</li>
                  <li>Cancellations less than 7 days before: No refund (deposit forfeited)</li>
                  <li>CREOVA reserves the right to reschedule due to emergencies or unforeseen circumstances</li>
                </ul>
                
                <p className="pt-3"><strong style={{ color: '#121212' }}>Product Returns:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Physical products (SEEN collection): 30-day return policy for unworn, unused items with original tags</li>
                  <li>Digital products: No refunds due to the nature of digital content</li>
                  <li>Event tickets: Non-refundable unless event is cancelled by CREOVA</li>
                </ul>
              </div>
            </div>

            {/* 5. Intellectual Property */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#A68F59' }} />
                <h2 className="text-2xl" style={{ color: '#121212' }}>5. Intellectual Property Rights</h2>
              </div>
              <div className="space-y-3" style={{ color: '#7A6F66' }}>
                <p><strong style={{ color: '#121212' }}>Photography and Videography:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>CREOVA retains copyright to all photos and videos produced</li>
                  <li>Clients receive a personal or commercial license (as specified in package) to use the content</li>
                  <li>CREOVA may use photos/videos for portfolio, marketing, and promotional purposes unless otherwise agreed in writing</li>
                  <li>Clients must credit CREOVA when sharing content on social media or public platforms</li>
                </ul>
                
                <p className="pt-3"><strong style={{ color: '#121212' }}>Brand Materials:</strong> All logos, designs, and 
                brand materials created by CREOVA are owned by CREOVA until full payment is received, at which point rights 
                transfer to the client as specified in the service agreement.</p>
              </div>
            </div>

            {/* 6. User Conduct */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#A68F59' }} />
                <h2 className="text-2xl" style={{ color: '#121212' }}>6. User Conduct</h2>
              </div>
              <div className="space-y-3" style={{ color: '#7A6F66' }}>
                <p>By using CREOVA services, you agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate and truthful information</li>
                  <li>Treat CREOVA staff, equipment, and property with respect</li>
                  <li>Arrive on time for scheduled sessions and pickups</li>
                  <li>Not use equipment for illegal or harmful purposes</li>
                  <li>Not resell or sublease rented equipment</li>
                  <li>Respect CREOVA's creative vision and professional judgment</li>
                </ul>
              </div>
            </div>

            {/* 7. Limitation of Liability */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#A68F59' }} />
                <h2 className="text-2xl" style={{ color: '#121212' }}>7. Limitation of Liability</h2>
              </div>
              <div className="space-y-3" style={{ color: '#7A6F66' }}>
                <p>CREOVA is not liable for:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Equipment malfunction or failure during rental period (replacement or refund will be provided)</li>
                  <li>Weather-related delays or cancellations for outdoor shoots (rescheduling available)</li>
                  <li>Loss of data or files due to technical issues (we maintain backups but cannot guarantee recovery)</li>
                  <li>Third-party platform issues (social media, payment processors, etc.)</li>
                </ul>
                <p className="pt-3">Our total liability is limited to the amount paid for the specific service or product in question.</p>
              </div>
            </div>

            {/* 8. Privacy and Data Protection */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#A68F59' }} />
                <h2 className="text-2xl" style={{ color: '#121212' }}>8. Privacy and Data Protection</h2>
              </div>
              <div className="space-y-3" style={{ color: '#7A6F66' }}>
                <p>Your privacy is important to us. Please review our <button 
                  onClick={() => navigate('/privacy-policy')}
                  className="underline"
                  style={{ color: '#A68F59' }}
                >Privacy Policy</button> for detailed information about how we collect, use, and protect your personal information.</p>
              </div>
            </div>

            {/* 9. Modifications to Terms */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#A68F59' }} />
                <h2 className="text-2xl" style={{ color: '#121212' }}>9. Modifications to Terms</h2>
              </div>
              <div className="space-y-3" style={{ color: '#7A6F66' }}>
                <p>CREOVA reserves the right to modify these Terms at any time. Changes will be effective immediately upon 
                posting to our website. Your continued use of our services after changes are posted constitutes acceptance 
                of the modified Terms.</p>
              </div>
            </div>

            {/* 10. Governing Law */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#A68F59' }} />
                <h2 className="text-2xl" style={{ color: '#121212' }}>10. Governing Law</h2>
              </div>
              <div className="space-y-3" style={{ color: '#7A6F66' }}>
                <p>These Terms are governed by the laws of the Province of Ontario and the federal laws of Canada. 
                Any disputes will be resolved in the courts of Ontario.</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t pt-8" style={{ borderColor: '#E3DCD3' }}>
              <h2 className="text-2xl mb-4" style={{ color: '#121212' }}>Contact Us</h2>
              <p style={{ color: '#7A6F66' }}>
                If you have questions about these Terms of Service, please contact us:
              </p>
              <ul className="mt-3 space-y-2" style={{ color: '#7A6F66' }}>
                <li><strong style={{ color: '#121212' }}>Email:</strong> support@creova.ca</li>
                <li><strong style={{ color: '#121212' }}>Location:</strong> Ontario, Canada</li>
                <li><strong style={{ color: '#121212' }}>Website:</strong> www.creova.com</li>
              </ul>
            </div>

            {/* Agreement Statement */}
            <div className="border-t pt-8" style={{ borderColor: '#E3DCD3' }}>
              <div className="p-6 rounded-xl" style={{ backgroundColor: 'rgba(166, 143, 89, 0.1)' }}>
                <p className="text-sm" style={{ color: '#121212' }}>
                  By using CREOVA's services, making a purchase, or signing up for a membership, you acknowledge 
                  that you have read, understood, and agree to be bound by these Terms of Service.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}