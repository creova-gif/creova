import re

file_path = "src/context/LanguageContext.tsx"
with open(file_path, "r") as f:
    content = f.read()

new_en_keys = """
    // SEO Keys
    'seo.title': 'CREOVA | Black-Owned Creative Agency Ontario | Photography, Videography, Brand Design',
    'seo.description': 'CREOVA is a Black-owned creative agency in Ontario, Canada specializing in professional photography, videography, brand management, and digital content creation. Serving BIPOC communities across Niagara, Toronto & GTA with authentic storytelling and premium creative services.',
    'seo.keywords': 'Black-owned creative agency Ontario, BIPOC photographer Niagara, videography services Toronto, brand photography Ontario, creative studio Canada, Black photographer Toronto, Niagara videographer, brand design Ontario, social media management, Ontario creative agency, African Canadian photographer',
    'seo.og.title': 'CREOVA | Black-Owned Creative Agency Ontario',
    'seo.og.description': 'Professional photography, videography, brand management & digital content creation for BIPOC communities across Ontario. Book your creative session today.',
    'seo.schema.desc': 'Black-owned creative agency specializing in photography, videography, and brand design',
    'seo.schema.catalog': 'Creative Services',
    'seo.schema.photo.name': 'Photography Services',
    'seo.schema.photo.desc': 'Professional family, brand, and product photography',
    'seo.schema.video.name': 'Videography Services',
    'seo.schema.video.desc': 'Cinematic videography and event coverage',
    'seo.schema.brand.name': 'Brand Design Services',
    'seo.schema.brand.desc': 'Brand identity, logo design, and visual systems',
"""

new_fr_keys = """
    // SEO Keys
    'seo.title': 'CREOVA | Agence Créative Appartenant à des Noirs en Ontario | Photographie, Vidéographie, Design de Marque',
    'seo.description': 'CREOVA est une agence créative appartenant à des Noirs en Ontario, Canada, spécialisée dans la photographie professionnelle, la vidéographie, la gestion de marque et la création de contenu numérique. Servir les communautés PABCN à travers Niagara, Toronto et le RGT avec une narration authentique et des services créatifs de premier ordre.',
    'seo.keywords': 'Agence créative appartenant à des Noirs Ontario, photographe PABCN Niagara, services de vidéographie Toronto, photographie de marque Ontario, studio créatif Canada, photographe Noir Toronto, vidéaste Niagara, design de marque Ontario, gestion des médias sociaux, agence créative Ontario, photographe afro-canadien',
    'seo.og.title': 'CREOVA | Agence Créative Appartenant à des Noirs en Ontario',
    'seo.og.description': 'Photographie professionnelle, vidéographie, gestion de marque et création de contenu numérique pour les communautés PABCN à travers l\\'Ontario. Réservez votre session créative aujourd\\'hui.',
    'seo.schema.desc': 'Agence créative appartenant à des Noirs spécialisée dans la photographie, la vidéographie et le design de marque',
    'seo.schema.catalog': 'Services Créatifs',
    'seo.schema.photo.name': 'Services de Photographie',
    'seo.schema.photo.desc': 'Photographie professionnelle de famille, de marque et de produits',
    'seo.schema.video.name': 'Services de Vidéographie',
    'seo.schema.video.desc': 'Vidéographie cinématographique et couverture d\\'événements',
    'seo.schema.brand.name': 'Services de Design de Marque',
    'seo.schema.brand.desc': 'Identité de marque, création de logo et systèmes visuels',
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

print("LanguageContext.tsx patched with SEO keys.")
