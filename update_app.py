import sys

file_path = "src/App.tsx"
with open(file_path, 'r') as f:
    content = f.read()

replacements = [
    ("<title>CREOVA | Black-Owned Creative Agency Ontario | Photography, Videography, Brand Design</title>", "<title>{t('seo.title')}</title>"),
    ('<meta name="description" content="CREOVA is a Black-owned creative agency in Ontario, Canada specializing in professional photography, videography, brand management, and digital content creation. Serving BIPOC communities across Niagara, Toronto & GTA with authentic storytelling and premium creative services." />', '<meta name="description" content={t(\'seo.description\')} />'),
    ('<meta name="keywords" content="Black-owned creative agency Ontario, BIPOC photographer Niagara, videography services Toronto, brand photography Ontario, creative studio Canada, Black photographer Toronto, Niagara videographer, brand design Ontario, social media management, Ontario creative agency, African Canadian photographer" />', '<meta name="keywords" content={t(\'seo.keywords\')} />'),
    ('<meta property="og:title" content="CREOVA | Black-Owned Creative Agency Ontario" />', '<meta property="og:title" content={t(\'seo.og.title\')} />'),
    ('<meta property="og:description" content="Professional photography, videography, brand management & digital content creation for BIPOC communities across Ontario. Book your creative session today." />', '<meta property="og:description" content={t(\'seo.og.description\')} />'),
    ('<meta name="twitter:title" content="CREOVA | Black-Owned Creative Agency Ontario" />', '<meta name="twitter:title" content={t(\'seo.og.title\')} />'),
    ('<meta name="twitter:description" content="Professional Photography, Videography & Brand Design for BIPOC Communities in Ontario, Canada" />', '<meta name="twitter:description" content={t(\'seo.og.description\')} />'),
    ('"description": "Black-owned creative agency specializing in photography, videography, and brand design"', '"description": t(\'seo.schema.desc\')'),
    ('"name": "Creative Services"', '"name": t(\'seo.schema.catalog\')'),
    ('"name": "Photography Services"', '"name": t(\'seo.schema.photo.name\')'),
    ('"description": "Professional family, brand, and product photography"', '"description": t(\'seo.schema.photo.desc\')'),
    ('"name": "Videography Services"', '"name": t(\'seo.schema.video.name\')'),
    ('"description": "Cinematic videography and event coverage"', '"description": t(\'seo.schema.video.desc\')'),
    ('"name": "Brand Design Services"', '"name": t(\'seo.schema.brand.name\')'),
    ('"description": "Brand identity, logo design, and visual systems"', '"description": t(\'seo.schema.brand.desc\')')
]

for old, new in replacements:
    content = content.replace(old, new)

# One specific fix: The Schema JSON is using JSON.stringify, so passing t() variables into JSON.stringify won't work perfectly if we replace string literals inside the JSON object, wait, JSON.stringify takes an object, not a string representation of an object!
# Oh, the schema in App.tsx is:
# __html: JSON.stringify({ ... "@context": "https://schema.org", ... "description": "Black-owned...", ... })
# So I need to NOT output quotes around t('...'). My replacement did: '"description": t(\'seo.schema.desc\')'
# This is correct JS syntax inside the object literal!

with open(file_path, 'w') as f:
    f.write(content)

print("App.tsx updated successfully.")
