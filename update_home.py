import sys
import re

file_path = "src/pages/HomePage.tsx"
with open(file_path, 'r') as f:
    content = f.read()

features_old = """  const features = [
    { icon: Camera, title: 'Photography', description: 'Brand, family, and professional portraiture', link: '/services', image: photoServicePhotography, objectPosition: 'center 25%', accent: '#A68F59' },
    { icon: Video, title: 'Videography', description: 'Cinematic storytelling and event coverage', link: '/services', image: photoServiceVideography, objectPosition: 'center top', accent: '#B1643B' },
    { icon: Palette, title: 'Brand Identity', description: 'Visual systems and strategic design', link: '/services', image: photoCommunity2, objectPosition: 'center 20%', accent: '#A68F59' },
    { icon: TrendingUp, title: 'Social Media', description: 'Content strategy and digital growth', link: '/services', image: photoSocialLaptop, objectPosition: 'center top', accent: '#B1643B' },
    { icon: ShoppingBag, title: 'Shop SEEN', description: 'CREOVA apparel and accessories', link: '/shop', image: photoEvent1, objectPosition: 'center top', accent: '#A68F59' },
    { icon: Calendar, title: 'Events', description: 'Workshops and creative gatherings', link: '/experience', image: photoServiceEvents, objectPosition: 'center 40%', accent: '#B1643B' },
  ];"""

features_new = """  const features = [
    { icon: Camera, title: t('home.feature.1.title'), description: t('home.feature.1.desc'), link: '/services', image: photoServicePhotography, objectPosition: 'center 25%', accent: '#A68F59' },
    { icon: Video, title: t('home.feature.2.title'), description: t('home.feature.2.desc'), link: '/services', image: photoServiceVideography, objectPosition: 'center top', accent: '#B1643B' },
    { icon: Palette, title: t('home.feature.3.title'), description: t('home.feature.3.desc'), link: '/services', image: photoCommunity2, objectPosition: 'center 20%', accent: '#A68F59' },
    { icon: TrendingUp, title: t('home.feature.4.title'), description: t('home.feature.4.desc'), link: '/services', image: photoSocialLaptop, objectPosition: 'center top', accent: '#B1643B' },
    { icon: ShoppingBag, title: t('home.feature.5.title'), description: t('home.feature.5.desc'), link: '/shop', image: photoEvent1, objectPosition: 'center top', accent: '#A68F59' },
    { icon: Calendar, title: t('home.feature.6.title'), description: t('home.feature.6.desc'), link: '/experience', image: photoServiceEvents, objectPosition: 'center 40%', accent: '#B1643B' },
  ];"""

marquee_old = """  const marqueeItems = [
    'Photography', 'Videography', 'Brand Identity', 'Social Media',
    'Events', 'Community', 'BIPOC Creative', 'Ontario',
    'SEEN Platform', 'Drone Aerial', 'Content Creation', 'Cultural Storytelling',
  ];"""

marquee_new = """  const marqueeItems = [
    t('home.marquee.1'), t('home.marquee.2'), t('home.marquee.3'), t('home.marquee.4'),
    t('home.marquee.5'), t('home.marquee.6'), t('home.marquee.7'), t('home.marquee.8'),
    t('home.marquee.9'), t('home.marquee.10'), t('home.marquee.11'), t('home.marquee.12'),
  ];"""

content = content.replace(features_old, features_new)
content = content.replace(marquee_old, marquee_new)

with open(file_path, 'w') as f:
    f.write(content)

print("HomePage.tsx updated successfully.")
