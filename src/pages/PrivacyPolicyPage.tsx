import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { motion } from 'motion/react';
import { ArrowLeft, Shield, CheckCircle2 } from 'lucide-react';
import { PageSEO } from '../components/PageSEO';

export function PrivacyPolicyPage() {
  const navigate = useNavigate();

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
            Back
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: 'rgba(166, 143, 89, 0.1)', border: '1px solid #A68F59' }}>
              <Shield className="w-4 h-4" style={{ color: '#A68F59' }} />
              <span className="text-sm tracking-wide" style={{ color: '#A68F59' }}>Your Privacy Matters</span>
            </div>

            <h1 className="text-4xl md:text-5xl mb-4" style={{ color: '#F5F1EB' }}>
              Privacy Policy
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
            {/* Introduction */}
            <div>
              <h2 className="text-2xl mb-4" style={{ color: '#121212' }}>Introduction</h2>
              <p style={{ color: '#7A6F66' }}>
                CREOVA ("we", "us", "our") is committed to protecting your privacy and ensuring the security of your 
                personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your 
                information when you use our website, services, and make purchases.
              </p>
            </div>

            {/* 1. Information We Collect */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#A68F59' }} />
                <h2 className="text-2xl" style={{ color: '#121212' }}>1. Information We Collect</h2>
              </div>
              <div className="space-y-3" style={{ color: '#7A6F66' }}>
                <p><strong style={{ color: '#121212' }}>Personal Information:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Name, email address, and phone number</li>
                  <li>Billing and shipping addresses</li>
                  <li>Payment information (processed securely through Stripe; we do not store payment card details)</li>
                  <li>Account credentials (for member accounts)</li>
                  <li>Communication preferences</li>
                </ul>
                
                <p className="pt-3"><strong style={{ color: '#121212' }}>Service-Related Information:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Booking details and service preferences</li>
                  <li>Equipment rental history and security deposit information</li>
                  <li>Photos and videos taken during sessions (with your consent)</li>
                  <li>Feedback and testimonials</li>
                </ul>
                
                <p className="pt-3"><strong style={{ color: '#121212' }}>Technical Information:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>IP address and device information</li>
                  <li>Browser type and version</li>
                  <li>Pages visited and time spent on our website</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </div>

            {/* 2. How We Use Your Information */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#A68F59' }} />
                <h2 className="text-2xl" style={{ color: '#121212' }}>2. How We Use Your Information</h2>
              </div>
              <div className="space-y-3" style={{ color: '#7A6F66' }}>
                <p>We use your information to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Process bookings, orders, and payments</li>
                  <li>Provide and deliver our services</li>
                  <li>Manage equipment rentals and security deposits</li>
                  <li>Maintain and manage membership accounts</li>
                  <li>Send booking confirmations and service updates</li>
                  <li>Communicate about your orders and services</li>
                  <li>Provide customer support</li>
                  <li>Send marketing communications (with your consent)</li>
                  <li>Improve our website and services</li>
                  <li>Prevent fraud and enhance security</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </div>

            {/* 3. How We Share Your Information */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#A68F59' }} />
                <h2 className="text-2xl" style={{ color: '#121212' }}>3. How We Share Your Information</h2>
              </div>
              <div className="space-y-3" style={{ color: '#7A6F66' }}>
                <p>We may share your information with:</p>
                
                <p className="pt-3"><strong style={{ color: '#121212' }}>Service Providers:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Stripe:</strong> Payment processing (subject to Stripe's privacy policy)</li>
                  <li><strong>Supabase:</strong> Database and backend services</li>
                  <li><strong>Email service providers:</strong> For sending communications</li>
                  <li><strong>Shipping carriers:</strong> For product delivery</li>
                </ul>
                
                <p className="pt-3"><strong style={{ color: '#121212' }}>Legal Requirements:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>When required by law or legal process</li>
                  <li>To protect our rights, property, or safety</li>
                  <li>To enforce our Terms of Service</li>
                </ul>
                
                <p className="pt-3"><strong style={{ color: '#121212' }}>Business Transfers:</strong></p>
                <p>In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new owner.</p>
                
                <p className="pt-3" style={{ color: '#121212' }}><strong>We do not sell your personal information to third parties.</strong></p>
              </div>
            </div>

            {/* 4. Cookies and Tracking */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#A68F59' }} />
                <h2 className="text-2xl" style={{ color: '#121212' }}>4. Cookies and Tracking Technologies</h2>
              </div>
              <div className="space-y-3" style={{ color: '#7A6F66' }}>
                <p>We use cookies and similar technologies to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Remember your preferences and settings</li>
                  <li>Maintain your shopping cart</li>
                  <li>Analyze website traffic and user behavior</li>
                  <li>Provide personalized content</li>
                  <li>Improve website functionality</li>
                </ul>
                <p className="pt-3">You can control cookies through your browser settings. However, disabling cookies may 
                affect your ability to use certain features of our website.</p>
              </div>
            </div>

            {/* 5. Data Security */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#A68F59' }} />
                <h2 className="text-2xl" style={{ color: '#121212' }}>5. Data Security</h2>
              </div>
              <div className="space-y-3" style={{ color: '#7A6F66' }}>
                <p>We implement appropriate security measures to protect your information:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>SSL/TLS encryption for data transmission</li>
                  <li>Secure payment processing through Stripe (PCI-DSS compliant)</li>
                  <li>Regular security audits and updates</li>
                  <li>Limited access to personal information (need-to-know basis)</li>
                  <li>Secure data storage with Supabase</li>
                </ul>
                <p className="pt-3">However, no method of transmission over the internet is 100% secure. While we strive 
                to protect your information, we cannot guarantee absolute security.</p>
              </div>
            </div>

            {/* 6. Data Retention */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#A68F59' }} />
                <h2 className="text-2xl" style={{ color: '#121212' }}>6. Data Retention</h2>
              </div>
              <div className="space-y-3" style={{ color: '#7A6F66' }}>
                <p>We retain your information for as long as necessary to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide our services</li>
                  <li>Maintain your account</li>
                  <li>Comply with legal obligations</li>
                  <li>Resolve disputes</li>
                  <li>Enforce our agreements</li>
                </ul>
                <p className="pt-3">After termination of services or account deletion, we may retain certain information 
                for legal and business purposes, typically for 7 years in accordance with Canadian business record retention requirements.</p>
              </div>
            </div>

            {/* 7. Your Rights and Choices */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#A68F59' }} />
                <h2 className="text-2xl" style={{ color: '#121212' }}>7. Your Rights and Choices</h2>
              </div>
              <div className="space-y-3" style={{ color: '#7A6F66' }}>
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong style={{ color: '#121212' }}>Access:</strong> Request a copy of your personal information</li>
                  <li><strong style={{ color: '#121212' }}>Correction:</strong> Request correction of inaccurate information</li>
                  <li><strong style={{ color: '#121212' }}>Deletion:</strong> Request deletion of your personal information (subject to legal retention requirements)</li>
                  <li><strong style={{ color: '#121212' }}>Opt-out:</strong> Unsubscribe from marketing communications (click "unsubscribe" in emails)</li>
                  <li><strong style={{ color: '#121212' }}>Data Portability:</strong> Request your data in a portable format</li>
                  <li><strong style={{ color: '#121212' }}>Object:</strong> Object to processing of your information</li>
                </ul>
                <p className="pt-3">To exercise these rights, contact us at support@creova.ca. We will respond within 30 days.</p>
              </div>
            </div>

            {/* 8. Marketing Communications */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#A68F59' }} />
                <h2 className="text-2xl" style={{ color: '#121212' }}>8. Marketing Communications</h2>
              </div>
              <div className="space-y-3" style={{ color: '#7A6F66' }}>
                <p>With your consent, we may send you:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Promotional emails about new services and products</li>
                  <li>Special offers and discounts</li>
                  <li>Event and workshop announcements</li>
                  <li>Member newsletters and updates</li>
                </ul>
                <p className="pt-3">You can opt-out at any time by clicking "unsubscribe" in our emails or contacting us directly.</p>
              </div>
            </div>

            {/* 9. Third-Party Links */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#A68F59' }} />
                <h2 className="text-2xl" style={{ color: '#121212' }}>9. Third-Party Links and Services</h2>
              </div>
              <div className="space-y-3" style={{ color: '#7A6F66' }}>
                <p>Our website may contain links to third-party websites and services (e.g., social media platforms). 
                We are not responsible for the privacy practices of these third parties. We encourage you to review their 
                privacy policies before providing any personal information.</p>
              </div>
            </div>

            {/* 10. Children's Privacy */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#A68F59' }} />
                <h2 className="text-2xl" style={{ color: '#121212' }}>10. Children's Privacy</h2>
              </div>
              <div className="space-y-3" style={{ color: '#7A6F66' }}>
                <p>Our services are not directed to children under 13 years of age. We do not knowingly collect personal 
                information from children. If you are a parent or guardian and believe your child has provided us with 
                personal information, please contact us to have it removed.</p>
              </div>
            </div>

            {/* 11. International Data Transfers */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#A68F59' }} />
                <h2 className="text-2xl" style={{ color: '#121212' }}>11. International Data Transfers</h2>
              </div>
              <div className="space-y-3" style={{ color: '#7A6F66' }}>
                <p>CREOVA is based in Ontario, Canada. If you access our services from outside Canada, your information 
                may be transferred to and processed in Canada or other countries where our service providers operate. 
                By using our services, you consent to such transfers.</p>
              </div>
            </div>

            {/* 12. Changes to Privacy Policy */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#A68F59' }} />
                <h2 className="text-2xl" style={{ color: '#121212' }}>12. Changes to This Privacy Policy</h2>
              </div>
              <div className="space-y-3" style={{ color: '#7A6F66' }}>
                <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Posting the updated policy on our website</li>
                  <li>Updating the "Last Updated" date</li>
                  <li>Sending an email notification for material changes (if we have your email)</li>
                </ul>
                <p className="pt-3">Your continued use of our services after changes are posted constitutes acceptance of the updated Privacy Policy.</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t pt-8" style={{ borderColor: '#E3DCD3' }}>
              <h2 className="text-2xl mb-4" style={{ color: '#121212' }}>Contact Us About Privacy</h2>
              <p style={{ color: '#7A6F66' }}>
                If you have questions or concerns about this Privacy Policy or our data practices:
              </p>
              <ul className="mt-3 space-y-2" style={{ color: '#7A6F66' }}>
                <li><strong style={{ color: '#121212' }}>Email:</strong> support@creova.ca</li>
                <li><strong style={{ color: '#121212' }}>Subject Line:</strong> "Privacy Inquiry"</li>
                <li><strong style={{ color: '#121212' }}>Location:</strong> Ontario, Canada</li>
              </ul>
            </div>

            {/* Canadian Privacy Compliance */}
            <div className="border-t pt-8" style={{ borderColor: '#E3DCD3' }}>
              <h2 className="text-2xl mb-4" style={{ color: '#121212' }}>Canadian Privacy Compliance</h2>
              <p style={{ color: '#7A6F66' }}>
                CREOVA complies with the Personal Information Protection and Electronic Documents Act (PIPEDA) and 
                applicable provincial privacy legislation in Canada. We are committed to protecting your privacy rights 
                under Canadian law.
              </p>
            </div>

            {/* Agreement Statement */}
            <div className="border-t pt-8" style={{ borderColor: '#E3DCD3' }}>
              <div className="p-6 rounded-xl" style={{ backgroundColor: 'rgba(166, 143, 89, 0.1)' }}>
                <p className="text-sm" style={{ color: '#121212' }}>
                  By using CREOVA's services, you acknowledge that you have read and understood this Privacy Policy 
                  and agree to the collection, use, and disclosure of your information as described herein.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}