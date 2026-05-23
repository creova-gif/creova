import sys

file_path = "src/pages/ContactPage.tsx"
with open(file_path, 'r') as f:
    content = f.read()

replacements = [
    ("'Security verification expired. Please verify again.'", "t('contact.toast.captcha.expired')"),
    ("'Please complete the CAPTCHA verification'", "t('contact.toast.captcha.missing')"),
    ("'Security Verification Issue'", "t('contact.toast.captcha.issue')"),
    ("'Unable to verify. Please refresh and try again.'", "t('contact.toast.captcha.desc')"),
    ("Get In Touch", "{t('contact.badge.getintouch')}"),
    ("Book Services", "{t('contact.tag.book')}"),
    ("Collaborate", "{t('contact.tag.collaborate')}"),
    ("General Inquiries", "{t('contact.tag.inquiries')}"),
    ("Ready to book a session?", "{t('contact.book.title')}"),
    ("Skip the inquiry form and book directly — we'll confirm your session within 4 business hours.", "{t('contact.book.desc')}"),
    ("Book Session Now", "{t('contact.book.btn.now')}"),
    ("Chat with Sankofa First", "{t('contact.book.btn.chat')}"),
    ("or send a general inquiry", "{t('contact.form.or')}"),
    ("Send Us a Message", "{t('contact.form.title')}"),
    ("Name *", "{t('contact.form.label.name')}"),
    ('placeholder="Your full name"', 'placeholder={t(\'contact.form.placeholder.name\')}'),
    ("Email *", "{t('contact.form.label.email')}"),
    ('placeholder="your@email.com"', 'placeholder={t(\'contact.form.placeholder.email\')}'),
    ("Phone Number", "{t('contact.form.label.phone')}"),
    ('placeholder="(123) 456-7890"', 'placeholder={t(\'contact.form.placeholder.phone\')}'),
    ("Service Interested In *", "{t('contact.form.label.service')}"),
    ("Select a service", "{t('contact.form.select.service')}"),
    ("Family Photography", "{t('contact.form.opt.family')}"),
    ("Brand Photography", "{t('contact.form.opt.brand')}"),
    ("Product Photography", "{t('contact.form.opt.product')}"),
    ("Event Coverage (Photo/Video)", "{t('contact.form.opt.event')}"),
    ("Drone & Aerial Photography", "{t('contact.form.opt.drone')}"),
    ("Social Media Management", "{t('contact.form.opt.social')}"),
    ("Brand Management", "{t('contact.form.opt.brandmgt')}"),
    ("Collaboration Opportunity", "{t('contact.form.opt.collab')}"),
    ("Other/Not Sure", "{t('contact.form.opt.other')}"),
    ("Budget Range", "{t('contact.form.label.budget')}"),
    ('placeholder="e.g., $500-$1000"', 'placeholder={t(\'contact.form.placeholder.budget\')}'),
    ("Timeline/Event Date", "{t('contact.form.label.timeline')}"),
    ('placeholder="e.g., June 2026"', 'placeholder={t(\'contact.form.placeholder.timeline\')}'),
    ("Message *", "{t('contact.form.label.message')}"),
    ('placeholder="Tell us about your project, event, or what you\'re looking for..."', 'placeholder={t(\'contact.form.placeholder.message\')}'),
    (">Security Verification<", ">{t('contact.form.security')}<"),
    ("{isSubmitting ? 'Sending...' : 'Send Message'}", "{isSubmitting ? t('contact.form.btn.sending') : t('contact.form.btn.send')}"),
    ("By submitting this form, you agree to be contacted by CREOVA regarding your inquiry", "{t('contact.form.disclaimer')}"),
    ("Quick Answers", "{t('contact.faq.badge')}"),
    ("Frequently Asked Questions", "{t('contact.faq.title')}"),
]

for old, new in replacements:
    content = content.replace(old, new)

# Fix the FAQ array mapping manually
faq_code = """[
              { q: t('contact.faq.q1'), a: t('contact.faq.a1') },
              { q: t('contact.faq.q2'), a: t('contact.faq.a2') },
              { q: t('contact.faq.q3'), a: t('contact.faq.a3') },
              { q: t('contact.faq.q4'), a: t('contact.faq.a4') },
              { q: t('contact.faq.q5'), a: t('contact.faq.a5') },
              { q: t('contact.faq.q6'), a: t('contact.faq.a6') }
            ]"""

# We'll use a regex to replace the array of questions
import re
content = re.sub(r'\[\s*\{\s*q:\s*\'How far in advance should I book\?\'.*?\]', faq_code, content, flags=re.DOTALL)

with open(file_path, 'w') as f:
    f.write(content)

print("ContactPage.tsx updated successfully.")
