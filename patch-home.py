import re

file_path = "src/context/LanguageContext.tsx"
with open(file_path, "r") as f:
    content = f.read()

new_en_keys = """
    // Home Arrays
    'home.feature.1.title': 'Photography',
    'home.feature.1.desc': 'Brand, family, and professional portraiture',
    'home.feature.2.title': 'Videography',
    'home.feature.2.desc': 'Cinematic storytelling and event coverage',
    'home.feature.3.title': 'Brand Identity',
    'home.feature.3.desc': 'Visual systems and strategic design',
    'home.feature.4.title': 'Social Media',
    'home.feature.4.desc': 'Content strategy and digital growth',
    'home.feature.5.title': 'Shop SEEN',
    'home.feature.5.desc': 'CREOVA apparel and accessories',
    'home.feature.6.title': 'Events',
    'home.feature.6.desc': 'Workshops and creative gatherings',
    'home.marquee.1': 'Photography',
    'home.marquee.2': 'Videography',
    'home.marquee.3': 'Brand Identity',
    'home.marquee.4': 'Social Media',
    'home.marquee.5': 'Events',
    'home.marquee.6': 'Community',
    'home.marquee.7': 'BIPOC Creative',
    'home.marquee.8': 'Ontario',
    'home.marquee.9': 'SEEN Platform',
    'home.marquee.10': 'Drone Aerial',
    'home.marquee.11': 'Content Creation',
    'home.marquee.12': 'Cultural Storytelling',
"""

new_fr_keys = """
    // Home Arrays
    'home.feature.1.title': 'Photographie',
    'home.feature.1.desc': 'Portraits de marque, de famille et professionnels',
    'home.feature.2.title': 'Vidéographie',
    'home.feature.2.desc': 'Narration cinématographique et couverture d\\'événements',
    'home.feature.3.title': 'Identité de Marque',
    'home.feature.3.desc': 'Systèmes visuels et conception stratégique',
    'home.feature.4.title': 'Médias Sociaux',
    'home.feature.4.desc': 'Stratégie de contenu et croissance numérique',
    'home.feature.5.title': 'Boutique SEEN',
    'home.feature.5.desc': 'Vêtements et accessoires CREOVA',
    'home.feature.6.title': 'Événements',
    'home.feature.6.desc': 'Ateliers et rencontres créatives',
    'home.marquee.1': 'Photographie',
    'home.marquee.2': 'Vidéographie',
    'home.marquee.3': 'Identité de Marque',
    'home.marquee.4': 'Médias Sociaux',
    'home.marquee.5': 'Événements',
    'home.marquee.6': 'Communauté',
    'home.marquee.7': 'Créatif PABCN',
    'home.marquee.8': 'Ontario',
    'home.marquee.9': 'Plateforme SEEN',
    'home.marquee.10': 'Drone Aérien',
    'home.marquee.11': 'Création de Contenu',
    'home.marquee.12': 'Narration Culturelle',
"""

en_match = re.search(r'en:\s*\{', content)
if en_match:
    pos = en_match.end()
    content = content[:pos] + "\\n" + new_en_keys + content[pos:]

fr_match = re.search(r'fr:\s*\{', content)
if fr_match:
    pos = fr_match.end()
    content = content[:pos] + "\\n" + new_fr_keys + content[pos:]

with open(file_path, "w") as f:
    f.write(content)

print("LanguageContext.tsx patched with home keys.")
