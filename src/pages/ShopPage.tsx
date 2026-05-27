import { useState } from 'react';
import { Button } from '../components/ui/button';
import { useCart } from '../context/CartContext';
import { PageSEO } from '../components/PageSEO';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'sonner@2.0.3';
import { Heart, Eye, Calendar, Package } from 'lucide-react';
import { motion } from 'motion/react';
import { FloatingOrbs } from '../components/FloatingOrbs';
import { SplitText } from '../components/SplitText';
import { ProductQuickView } from '../components/ProductQuickView';
import { SizeGuide } from '../components/SizeGuide';
import { AddToCartDialog } from '../components/AddToCartDialog';

const warmGradient = 'linear-gradient(135deg, #A68F59 0%, #B1643B 100%)';

export function ShopPage() {
  const { addItem } = useCart();
  const { t } = useLanguage();
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [selectedColors, setSelectedColors] = useState<Record<string, { name: string; hex: string }>>({});
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [addToCartDialogOpen, setAddToCartDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const colorPalette = {
    'Jet Black': '#000000',
    'Stone White': '#F5F5F5',
    'Charcoal Gray': '#3C3C3C',
    'Olive Green': '#6B8E23',
    'Sahara Beige': '#D8CAB8',
    'Burnt Sienna': '#E97451',
    'Dusty Rose': '#C48C8C',
    'Ocean Blue': '#1E5F74',
    'Mustard Gold': '#D4A02F',
    'Mocha Brown': '#7B5E57',
    'Earth Clay': '#B1643B',
    'Olive Gold': '#A68F59'
  };

  const products = [
    { id: 'graphic-tee-soft-power', name: 'SOFT POWER GRAPHIC TEE', price: 55, image: 'https://images.unsplash.com/photo-1610502778270-c5c6f4c7d575?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHRzaGlydCUyMHByb2R1Y3R8ZW58MXx8fHwxNzYzMTkyNDU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', hoverImage: 'https://images.unsplash.com/photo-1722926628555-252c1c0258bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmF5JTIwdHNoaXJ0JTIwbWluaW1hbHxlbnwxfHx8fDE3NjMyNTIyNzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'], colors: ['Jet Black', 'Stone White', 'Charcoal Gray', 'Burnt Sienna', 'Olive Green'], category: 'tees', badge: 'NEW SEASON', description: 'Premium cotton graphic tee from the SEEN collection' },
    { id: 'graphic-tee-visibility', name: 'VISIBILITY GRAPHIC TEE', price: 55, image: 'https://images.unsplash.com/photo-1722310752951-4d459d28c678?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFpbiUyMHdoaXRlJTIwdHNoaXJ0JTIwcHJvZHVjdHxlbnwxfHx8fDE3NjMyMzI3NTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', hoverImage: 'https://images.unsplash.com/photo-1716541425103-fcfd4bf88c27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFpbiUyMGJsYWNrJTIwdHNoaXJ0JTIwZmxhdHxlbnwxfHx8fDE3NjMyNTA0NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'], colors: ['Stone White', 'Jet Black', 'Sahara Beige', 'Dusty Rose'], category: 'tees', badge: 'NEW SEASON', description: 'Bold visibility statement on premium cotton' },
    { id: 'graphic-tee-resistance', name: 'RESISTANCE GRAPHIC TEE', price: 55, image: 'https://images.unsplash.com/photo-1693443688057-85f57b872a3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFpbiUyMGdyYXklMjBzaGlydCUyMG1pbmltYWx8ZW58MXx8fHwxNzYzMjUwNDYzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', hoverImage: 'https://images.unsplash.com/photo-1716541425103-fcfd4bf88c27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFpbiUyMGJsYWNrJTIwdHNoaXJ0JTIwZmxhdHxlbnwxfHx8fDE3NjMyNTA0NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'], colors: ['Jet Black', 'Burnt Sienna', 'Olive Green', 'Charcoal Gray'], category: 'tees', description: 'Soft resistance messaging with bold graphic' },
    { id: 'graphic-tee-diaspora', name: 'DIASPORA ROOTS GRAPHIC TEE', price: 55, image: 'https://images.unsplash.com/photo-1731267776886-90f90af75eb1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFpbiUyMGJlaWdlJTIwdHNoaXJ0fGVufDF8fHx8MTc2MzI1MDQ2M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', hoverImage: 'https://images.unsplash.com/photo-1716541425103-fcfd4bf88c27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFpbiUyMGJsYWNrJTIwdHNoaXJ0JTIwZmxhdHxlbnwxfHx8fDE3NjMyNTA0NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'], colors: ['Earth Clay', 'Jet Black', 'Mocha Brown', 'Burnt Sienna'], category: 'tees', badge: 'LIMITED', description: 'Celebrating African diaspora heritage' },
    { id: 'graphic-tee-archive', name: 'WEARABLE ARCHIVE GRAPHIC TEE', price: 58, image: 'https://images.unsplash.com/photo-1722310752951-4d459d28c678?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFpbiUyMHdoaXRlJTIwdHNoaXJ0JTIwcHJvZHVjdHxlbnwxfHx8fDE3NjMyMzI3NTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', hoverImage: 'https://images.unsplash.com/photo-1731267776886-90f90af75eb1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFpbiUyMGJlaWdlJTIwdHNoaXJ0fGVufDF8fHx8MTc2MzI1MDQ2M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'], colors: ['Stone White', 'Sahara Beige', 'Charcoal Gray', 'Dusty Rose'], category: 'tees', badge: 'PREMIUM', description: 'Museum-quality print on heavyweight cotton' },
    { id: 'graphic-tee-community', name: 'COMMUNITY POWER GRAPHIC TEE', price: 55, image: 'https://images.unsplash.com/photo-1693443688057-85f57b872a3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFpbiUyMGdyYXklMjBzaGlydCUyMG1pbmltYWx8ZW58MXx8fHwxNzYzMjUwNDYzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', hoverImage: 'https://images.unsplash.com/photo-1722310752951-4d459d28c678?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFpbiUyMHdoaXRlJTIwdHNoaXJ0JTIwcHJvZHVjdHxlbnwxfHx8fDE3NjMyMzI3NTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'], colors: ['Jet Black', 'Olive Green', 'Ocean Blue', 'Mustard Gold'], category: 'tees', description: 'Collective strength and unity graphic' },
    { id: 'longsleeve-archive', name: 'ARCHIVE LONG-SLEEVE', price: 60, image: 'https://images.unsplash.com/photo-1666358085449-a10a39f33942?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb25nc2xlZXZlJTIwc2hpcnQlMjBmbGF0fGVufDF8fHx8MTc2MzI1MDQ2OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', hoverImage: 'https://images.unsplash.com/photo-1731267776886-90f90af75eb1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFpbiUyMGJlaWdlJTIwdHNoaXJ0fGVufDF8fHx8MTc2MzI1MDQ2M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'], colors: ['Stone White', 'Sahara Beige', 'Charcoal Gray', 'Mocha Brown'], category: 'tees', description: 'Wearable archive with embroidered storytelling' },
    { id: 'longsleeve-heritage', name: 'HERITAGE LONG-SLEEVE', price: 60, image: 'https://images.unsplash.com/photo-1666358085449-a10a39f33942?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb25nc2xlZXZlJTIwc2hpcnQlMjBmbGF0fGVufDF8fHx8MTc2MzI1MDQ2OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', hoverImage: 'https://images.unsplash.com/photo-1693443688057-85f57b872a3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFpbiUyMGdyYXklMjBzaGlydCUyMG1pbmltYWx8ZW58MXx8fHwxNzYzMjUwNDYzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'], colors: ['Jet Black', 'Earth Clay', 'Olive Green', 'Burnt Sienna'], category: 'tees', badge: 'LIMITED', description: 'Long-sleeve celebrating cultural heritage' },
    { id: 'oversized-hoodie-earth', name: 'AFRO-MINIMAL HOODIE', price: 85, image: 'https://images.unsplash.com/photo-1647768617268-06697e8a91d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGhvb2RpZSUyMGZsYXQlMjBsYXl8ZW58MXx8fHwxNzYzMjUwNDYzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', hoverImage: 'https://images.unsplash.com/photo-1761891873744-eb181eb1334a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFpbiUyMHN3ZWF0c2hpcnQlMjBwcm9kdWN0fGVufDF8fHx8MTc2MzI1MDQ2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', sizes: ['S', 'M', 'L', 'XL', '2XL'], colors: ['Earth Clay', 'Jet Black', 'Ocean Blue', 'Olive Green', 'Mocha Brown'], category: 'hoodies', badge: 'LIMITED', description: 'Heavyweight oversized hoodie with poetic utility' },
    { id: 'crewneck-visibility', name: 'VISIBILITY CREWNECK', price: 78, image: 'https://images.unsplash.com/photo-1724296532350-4b8d63cd6559?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmV3bmVjayUyMHN3ZWF0c2hpcnQlMjBwcm9kdWN0fGVufDF8fHx8MTc2MzI1MDQ2NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', hoverImage: 'https://images.unsplash.com/photo-1761891873744-eb181eb1334a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFpbiUyMHN3ZWF0c2hpcnQlMjBwcm9kdWN0fGVufDF8fHx8MTc2MzI1MDQ2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', sizes: ['S', 'M', 'L', 'XL', '2XL'], colors: ['Jet Black', 'Charcoal Gray', 'Dusty Rose', 'Sahara Beige'], category: 'hoodies', description: 'Contemporary crewneck with story patch detail' },
    { id: 'hoodie-soft-power', name: 'SOFT POWER HOODIE', price: 85, image: 'https://images.unsplash.com/photo-1647768617268-06697e8a91d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGhvb2RpZSUyMGZsYXQlMjBsYXl8ZW58MXx8fHwxNzYzMjUwNDYzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', hoverImage: 'https://images.unsplash.com/photo-1761891873744-eb181eb1334a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFpbiUyMHN3ZWF0c2hpcnQlMjBwcm9kdWN0fGVufDF8fHx8MTc2MzI1MDQ2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', sizes: ['S', 'M', 'L', 'XL', '2XL'], colors: ['Jet Black', 'Olive Gold', 'Ocean Blue', 'Charcoal Gray'], category: 'hoodies', badge: 'NEW SEASON', description: 'Signature hoodie from SEEN collection' },
    { id: 'crewneck-archive', name: 'ARCHIVE CREWNECK', price: 78, image: 'https://images.unsplash.com/photo-1724296532350-4b8d63cd6559?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmV3bmVjayUyMHN3ZWF0c2hpcnQlMjBwcm9kdWN0fGVufDF8fHx8MTc2MzI1MDQ2NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', hoverImage: 'https://images.unsplash.com/photo-1647768617268-06697e8a91d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGhvb2RpZSUyMGZsYXQlMjBsYXl8ZW58MXx8fHwxNzYzMjUwNDYzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', sizes: ['S', 'M', 'L', 'XL', '2XL'], colors: ['Stone White', 'Sahara Beige', 'Mocha Brown', 'Charcoal Gray'], category: 'hoodies', description: 'Clean crewneck with minimalist branding' },
    { id: 'varsity-jacket-premium', name: 'HERITAGE VARSITY JACKET', price: 175, image: 'https://images.unsplash.com/photo-1592878849122-facb97520f9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2YXJzaXR5JTIwamFja2V0JTIwbWluaW1hbHxlbnwxfHx8fDE3NjMyNTA0NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', hoverImage: 'https://images.unsplash.com/photo-1565117868311-e539525508ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwamFja2V0JTIwcHJvZHVjdHxlbnwxfHx8fDE3NjMyNTA0NjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', sizes: ['S', 'M', 'L', 'XL'], colors: ['Olive Gold', 'Jet Black', 'Charcoal Gray', 'Ocean Blue'], category: 'jackets', badge: 'PREMIUM', description: 'Numbered small-batch varsity jacket with embroidered patches' },
    { id: 'windbreaker-light', name: 'SOFT POWER WINDBREAKER', price: 120, image: 'https://images.unsplash.com/photo-1624548139462-89b5a73ffdd6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW5kYnJlYWtlciUyMGphY2tldCUyMHByb2R1Y3R8ZW58MXx8fHwxNzYzMjUwNDY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', hoverImage: 'https://images.unsplash.com/photo-1565117868311-e539525508ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwamFja2V0JTIwcHJvZHVjdHxlbnwxfHx8fDE3NjMyNTA0NjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', sizes: ['S', 'M', 'L', 'XL', '2XL'], colors: ['Sahara Beige', 'Olive Green', 'Ocean Blue', 'Burnt Sienna'], category: 'jackets', badge: 'NEW SEASON', description: 'Eco-conscious windbreaker with QR-linked experience' },
    { id: 'bomber-jacket', name: 'VISIBILITY BOMBER JACKET', price: 165, image: 'https://images.unsplash.com/photo-1583401915223-1a3ee3b57299?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib21iZXIlMjBqYWNrZXQlMjBtaW5pbWFsfGVufDF8fHx8MTc2MzI1MDQ3MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', hoverImage: 'https://images.unsplash.com/photo-1565117868311-e539525508ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwamFja2V0JTIwcHJvZHVjdHxlbnwxfHx8fDE3NjMyNTA0NjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', sizes: ['S', 'M', 'L', 'XL'], colors: ['Jet Black', 'Olive Gold', 'Earth Clay', 'Ocean Blue'], category: 'jackets', badge: 'LIMITED', description: 'Classic bomber with heritage details' },
    { id: 'cargo-pants-utility', name: 'UTILITY CARGO PANTS', price: 95, image: 'https://images.unsplash.com/photo-1719473448126-eb1159ec5242?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJnbyUyMHBhbnRzJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjMyNTA0NzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', hoverImage: 'https://images.unsplash.com/photo-1758520705584-3554caf304eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFpbiUyMGpvZ2dlcnMlMjBwcm9kdWN0fGVufDF8fHx8MTc2MzIzMjc1OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', sizes: ['28', '30', '32', '34', '36', '38'], colors: ['Olive Green', 'Jet Black', 'Charcoal Gray', 'Mocha Brown', 'Sahara Beige'], category: 'pants', description: 'Design-forward cargo pants with functional pockets' },
    { id: 'jogger-pants-comfort', name: 'ESSENTIAL JOGGERS', price: 85, image: 'https://images.unsplash.com/photo-1758520705584-3554caf304eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFpbiUyMGpvZ2dlcnMlMjBwcm9kdWN0fGVufDF8fHx8MTc2MzIzMjc1OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', hoverImage: 'https://images.unsplash.com/photo-1719473448126-eb1159ec5242?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJnbyUyMHBhbnRzJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjMyNTA0NzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', sizes: ['S', 'M', 'L', 'XL', '2XL'], colors: ['Jet Black', 'Charcoal Gray', 'Ocean Blue', 'Mocha Brown'], category: 'pants', description: 'Comfort-first joggers for everyday wear' },
    { id: 'tracksuit-set-archive', name: 'ARCHIVE TRACKSUIT SET', price: 135, image: 'https://images.unsplash.com/photo-1648962492951-f53233989f81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFja3N1aXQlMjBwcm9kdWN0JTIwcGhvdG98ZW58MXx8fHwxNzYzMjMyMzUzfDA&ixlib=rb-4.1.0&q=80&w=1080', hoverImage: 'https://images.unsplash.com/photo-1749413067075-d3d4efa2959a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXR3ZWFyJTIwY2xvdGhpbmclMjBmbGF0bGF5fGVufDF8fHx8MTc2MzIzMjM0OHww&ixlib=rb-4.1.0&q=80&w=1080', sizes: ['S', 'M', 'L', 'XL', '2XL'], colors: ['Earth Clay', 'Jet Black', 'Olive Green', 'Charcoal Gray', 'Dusty Rose'], category: 'sets', badge: 'LIMITED', description: 'Complete tracksuit set with coordinated storytelling' },
    { id: 'tracksuit-set-heritage', name: 'HERITAGE TRACKSUIT SET', price: 145, image: 'https://images.unsplash.com/photo-1749413067075-d3d4efa2959a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXR3ZWFyJTIwY2xvdGhpbmclMjBmbGF0bGF5fGVufDF8fHx8MTc2MzIzMjM0OHww&ixlib=rb-4.1.0&q=80&w=1080', hoverImage: 'https://images.unsplash.com/photo-1648962492951-f53233989f81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFja3N1aXQlMjBwcm9kdWN0JTIwcGhvdG98ZW58MXx8fHwxNzYzMjMyMzUzfDA&ixlib=rb-4.1.0&q=80&w=1080', sizes: ['S', 'M', 'L', 'XL', '2XL'], colors: ['Ocean Blue', 'Mocha Brown', 'Olive Gold', 'Burnt Sienna'], category: 'sets', badge: 'PREMIUM', description: 'Premium tracksuit with embroidered heritage details' },
    { id: 'bucket-hat-seen', name: 'SEEN BUCKET HAT', price: 38, image: 'https://images.unsplash.com/photo-1581688307440-8bb9ad534fd0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWNrZXQlMjBoYXQlMjBwcm9kdWN0JTIwZmxhdHxlbnwxfHx8fDE3NjMyNTI2Njh8MA&ixlib=rb-4.1.0&q=80&w=1080', hoverImage: 'https://images.unsplash.com/photo-1581688307440-8bb9ad534fd0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWNrZXQlMjBoYXQlMjBwcm9kdWN0JTIwZmxhdHxlbnwxfHx8fDE3NjMyNTI2Njh8MA&ixlib=rb-4.1.0&q=80&w=1080', sizes: ['One Size'], colors: ['Jet Black', 'Sahara Beige', 'Olive Green', 'Burnt Sienna', 'Earth Clay'], category: 'accessories', badge: 'NEW SEASON', description: 'Bucket hat from the SEEN collection' },
    { id: 'dad-hat-logo', name: 'CREOVA LOGO DAD HAT', price: 32, image: 'https://images.unsplash.com/photo-1587493681629-6b4c02555fee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNlYmFsbCUyMGNhcCUyMHByb2R1Y3QlMjBtaW5pbWFsaXN0fGVufDF8fHx8MTc2MzI1MjY2OHww&ixlib=rb-4.1.0&q=80&w=1080', hoverImage: 'https://images.unsplash.com/photo-1587493681629-6b4c02555fee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNlYmFsbCUyMGNhcCUyMHByb2R1Y3QlMjBtaW5pbWFsaXN0fGVufDF8fHx8MTc2MzI1MjY2OHww&ixlib=rb-4.1.0&q=80&w=1080', sizes: ['One Size'], colors: ['Olive Gold', 'Jet Black', 'Charcoal Gray', 'Burnt Sienna', 'Mocha Brown'], category: 'accessories', description: 'Adjustable dad hat with embroidered logo' },
    { id: 'beanie-winter', name: 'ARCHIVE BEANIE', price: 28, image: 'https://images.unsplash.com/photo-1664289321749-07316ab5e374?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFuaWUlMjBrbml0JTIwaGF0JTIwcHJvZHVjdHxlbnwxfHx8fDE3NjMyNTI2Njh8MA&ixlib=rb-4.1.0&q=80&w=1080', hoverImage: 'https://images.unsplash.com/photo-1664289321749-07316ab5e374?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFuaWUlMjBrbml0JTIwaGF0JTIwcHJvZHVjdHxlbnwxfHx8fDE3NjMyNTI2Njh8MA&ixlib=rb-4.1.0&q=80&w=1080', sizes: ['One Size'], colors: ['Jet Black', 'Charcoal Gray', 'Earth Clay', 'Olive Green', 'Mocha Brown', 'Burnt Sienna'], category: 'accessories', description: 'Classic cuffed beanie with woven label' },
    { id: 'canvas-tote-archive', name: 'ARCHIVE CANVAS TOTE', price: 45, image: 'https://images.unsplash.com/photo-1618249807726-2f381c277de1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3RlJTIwYmFnJTIwbWluaW1hbCUyMHByb2R1Y3R8ZW58MXx8fHwxNzYzMjMyMzUzfDA&ixlib=rb-4.1.0&q=80&w=1080', hoverImage: 'https://images.unsplash.com/photo-1618249807726-2f381c277de1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3RlJTIwYmFnJTIwbWluaW1hbCUyMHByb2R1Y3R8ZW58MXx8fHwxNzYzMjMyMzUzfDA&ixlib=rb-4.1.0&q=80&w=1080', sizes: ['One Size'], colors: ['Stone White', 'Sahara Beige', 'Jet Black', 'Earth Clay'], category: 'accessories', description: 'Heavy-duty canvas tote with recycled packaging' },
    { id: 'fanny-pack-utility', name: 'UTILITY FANNY PACK', price: 48, image: 'https://images.unsplash.com/photo-1577302464152-e020135e0230?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW5ueSUyMHBhY2slMjB3YWlzdCUyMGJhZ3xlbnwxfHx8fDE3NjMyNDk4MjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', hoverImage: 'https://images.unsplash.com/photo-1577302464152-e020135e0230?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW5ueSUyMHBhY2slMjB3YWlzdCUyMGJhZ3xlbnwxfHx8fDE3NjMyNDk4MjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', sizes: ['One Size'], colors: ['Jet Black', 'Olive Green', 'Earth Clay', 'Charcoal Gray', 'Sahara Beige'], category: 'accessories', badge: 'NEW SEASON', description: 'Minimalist fanny pack with adjustable strap' },
    { id: 'crew-socks-archive', name: 'ARCHIVE CREW SOCKS', price: 18, image: 'https://images.unsplash.com/photo-1694690127800-68314991ee83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3R0b24lMjBzb2Nrc3xlbnwxfHx8fDE3NjMyNDk4MjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', hoverImage: 'https://images.unsplash.com/photo-1694690127800-68314991ee83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3R0b24lMjBzb2Nrc3xlbnwxfHx8fDE3NjMyNDk4MjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', sizes: ['One Size'], colors: ['Jet Black', 'Stone White', 'Charcoal Gray', 'Earth Clay', 'Olive Green'], category: 'accessories', description: 'Premium cotton crew socks with CREOVA branding' },
    { id: 'ankle-socks-essential', name: 'ESSENTIAL ANKLE SOCKS', price: 15, image: 'https://images.unsplash.com/photo-1694690127800-68314991ee83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3R0b24lMjBzb2Nrc3xlbnwxfHx8fDE3NjMyNDk4MjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', hoverImage: 'https://images.unsplash.com/photo-1694690127800-68314991ee83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3R0b24lMjBzb2Nrc3xlbnwxfHx8fDE3NjMyNDk4MjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', sizes: ['One Size'], colors: ['Jet Black', 'Stone White', 'Charcoal Gray'], category: 'accessories', description: 'Low-profile ankle socks for everyday wear' },
    { id: 'phone-case-leather', name: 'LEATHER PHONE CASE', price: 35, image: 'https://images.unsplash.com/photo-1709123895403-9034c5676d39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHBob25lJTIwY2FzZSUyMHByb2R1Y3R8ZW58MXx8fHwxNzYzMjQ5ODIzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', hoverImage: 'https://images.unsplash.com/photo-1709123895403-9034c5676d39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHBob25lJTIwY2FzZSUyMHByb2R1Y3R8ZW58MXx8fHwxNzYzMjQ5ODIzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', sizes: ['One Size'], colors: ['Jet Black', 'Mocha Brown', 'Earth Clay', 'Sahara Beige'], category: 'accessories', badge: 'PREMIUM', description: 'Premium leather phone case with CREOVA embossing' },
    { id: 'ipad-case-sleeve', name: 'IPAD SLEEVE CASE', price: 52, image: 'https://images.unsplash.com/photo-1611461527944-1a718332613b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBzbGVldmUlMjBjYXNlJTIwbWluaW1hbHxlbnwxfHx8fDE3NjMyNDk4MjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', hoverImage: 'https://images.unsplash.com/photo-1611461527944-1a718332613b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBzbGVldmUlMjBjYXNlJTIwbWluaW1hbHxlbnwxfHx8fDE3NjMyNDk4MjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', sizes: ['One Size'], colors: ['Jet Black', 'Charcoal Gray', 'Sahara Beige', 'Mocha Brown'], category: 'accessories', description: 'Protective iPad sleeve with soft interior lining' },
    { id: 'laptop-sleeve-13', name: 'LAPTOP SLEEVE 13"', price: 65, image: 'https://images.unsplash.com/photo-1611461527944-1a718332613b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBzbGVldmUlMjBjYXNlJTIwbWluaW1hbHxlbnwxfHx8fDE3NjMyNDk4MjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', hoverImage: 'https://images.unsplash.com/photo-1611461527944-1a718332613b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBzbGVldmUlMjBjYXNlJTIwbWluaW1hbHxlbnwxfHx8fDE3NjMyNDk4MjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', sizes: ['One Size'], colors: ['Jet Black', 'Charcoal Gray', 'Sahara Beige', 'Mocha Brown', 'Olive Green'], category: 'accessories', badge: 'PREMIUM', description: 'Padded laptop sleeve for 13" devices' },
    { id: 'laptop-sleeve-15', name: 'LAPTOP SLEEVE 15"', price: 72, image: 'https://images.unsplash.com/photo-1611461527944-1a718332613b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBzbGVldmUlMjBjYXNlJTIwbWluaW1hbHxlbnwxfHx8fDE3NjMyNDk4MjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', hoverImage: 'https://images.unsplash.com/photo-1611461527944-1a718332613b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBzbGVldmUlMjBjYXNlJTIwbWluaW1hbHxlbnwxfHx8fDE3NjMyNDk4MjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', sizes: ['One Size'], colors: ['Jet Black', 'Charcoal Gray', 'Sahara Beige', 'Mocha Brown', 'Olive Green'], category: 'accessories', badge: 'PREMIUM', description: 'Padded laptop sleeve for 15" devices' },
    { id: 'keychain-metal', name: 'ARCHIVE KEYCHAIN', price: 22, image: 'https://images.unsplash.com/photo-1633176640669-44bd6adaa662?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrZXljaGFpbiUyMGVuYW1lbCUyMHBpbiUyMHByb2R1Y3R8ZW58MXx8fHwxNzYzMjQ5ODI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', hoverImage: 'https://images.unsplash.com/photo-1633176640669-44bd6adaa662?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrZXljaGFpbiUyMGVuYW1lbCUyMHBpbiUyMHByb2R1Y3R8ZW58MXx8fHwxNzYzMjQ5ODI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', sizes: ['One Size'], colors: ['Jet Black', 'Olive Gold', 'Earth Clay'], category: 'accessories', badge: 'LIMITED', description: 'Metal keychain with engraved CREOVA logo' },
    { id: 'keychain-leather', name: 'LEATHER KEY HOLDER', price: 28, image: 'https://images.unsplash.com/photo-1633176640669-44bd6adaa662?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrZXljaGFpbiUyMGVuYW1lbCUyMHBpbiUyMHByb2R1Y3R8ZW58MXx8fHwxNzYzMjQ5ODI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', hoverImage: 'https://images.unsplash.com/photo-1633176640669-44bd6adaa662?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrZXljaGFpbiUyMGVuYW1lbCUyMHBpbiUyMHByb2R1Y3R8ZW58MXx8fHwxNzYzMjQ5ODI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', sizes: ['One Size'], colors: ['Jet Black', 'Mocha Brown', 'Earth Clay', 'Sahara Beige'], category: 'accessories', description: 'Premium leather key holder with snap closure' }
  ];

  const filteredProducts = filter === 'all' ? products : products.filter(p => p.category === filter);

  const handleAddToCart = (product: typeof products[0]) => {
    const hasMultipleSizes = product.sizes.length > 1 || (product.sizes.length === 1 && product.sizes[0] !== 'One Size');
    const size = selectedSizes[product.id];
    if (hasMultipleSizes && !size) {
      toast.error('Please select a size before adding to bag');
      return;
    }
    const finalSize = size || product.sizes[0];
    const color = selectedColors[product.id] || { name: product.colors[0], hex: colorPalette[product.colors[0] as keyof typeof colorPalette] };
    addItem({ id: `${product.id}-${finalSize}-${color.name}`, name: `${product.name} - ${finalSize} - ${color.name}`, price: product.price, type: 'clothing', image: product.image });
    toast.success('Added to bag', { description: `${product.name} (${finalSize}, ${color.name})` });
  };

  const filterTabs = [
    { label: t('shop.filter.all').toUpperCase(), value: 'all' },
    { label: t('shop.filter.tees').toUpperCase(), value: 'tees' },
    { label: t('shop.filter.hoodies').toUpperCase(), value: 'hoodies' },
    { label: t('shop.filter.jackets').toUpperCase(), value: 'jackets' },
    { label: t('shop.filter.pants').toUpperCase(), value: 'pants' },
    { label: t('shop.filter.sets').toUpperCase(), value: 'sets' },
    { label: t('shop.filter.accessories').toUpperCase(), value: 'accessories' }
  ];

  return (
    <div style={{ backgroundColor: '#F5F1EB' }}>
      <PageSEO
        title="Shop — SEEN Collection"
        description="Culturally rich streetwear and accessories from the SEEN Collection by CREOVA. Graphic tees, hoodies, jackets, and accessories. Pre-order Summer 2026."
      />

      {/* Announcement banner — warm gradient */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="py-3 text-center text-xs tracking-[0.4em] uppercase"
        style={{ background: warmGradient, color: '#FFFFFF' }}
      >
        <span className="flex items-center justify-center gap-3">
          <Package className="w-3.5 h-3.5" />
          Pre-Order Now — SEEN Collection Launching Summer 2026
          <Calendar className="w-3.5 h-3.5" />
        </span>
      </motion.div>

      {/* Hero — editorial dark with SEEN headline */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#0A0A0A' }}>
        <FloatingOrbs />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `radial-gradient(ellipse 60% 80% at 15% 50%, rgba(166,143,89,0.08) 0%, transparent 55%),
                       radial-gradient(ellipse 40% 60% at 88% 70%, rgba(177,100,59,0.07) 0%, transparent 55%)`
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, rgba(166,143,89,0.04) 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }} />
        <div className="absolute bottom-0 left-0 right-0" style={{ height: '1px', backgroundColor: 'rgba(166,143,89,0.25)' }} />
        {/* Warm gradient left accent stripe */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ background: warmGradient }} />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
            <div className="flex items-center gap-5 mb-8">
              <div style={{ height: '1px', width: '50px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
              <p className="text-xs tracking-[0.55em] uppercase" style={{ color: '#A68F59' }}>SEEN by CREOVA</p>
            </div>

            <SplitText
              text="SEEN"
              tag="h1"
              mode="chars"
              stagger={0.06}
              className="font-light tracking-tight block mb-3"
              style={{ fontSize: 'clamp(96px, 18vw, 200px)', color: '#F5F1EB', lineHeight: 0.88, letterSpacing: '-0.04em' }}
            />
            <p
              className="text-lg md:text-xl tracking-wide font-light mb-6"
              style={{
                backgroundImage: warmGradient,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent'
              }}
            >
              A SEASON OF SOFT POWER
            </p>
            <p className="text-sm mb-8 max-w-md" style={{ color: '#4A3E36' }}>
              Artist collaborations · Creative partnerships · Curated by CREOVA
            </p>

            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs tracking-wide"
              style={{ backgroundColor: 'rgba(166,143,89,0.12)', border: '1px solid rgba(166,143,89,0.3)', color: '#A68F59' }}
            >
              <Calendar className="w-3.5 h-3.5" />
              Pre-Order · Ships Summer 2026
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dark filter bar */}
      <section className="sticky z-40 py-0" style={{ top: '64px', backgroundColor: '#0E0E0E', borderBottom: '1px solid rgba(166,143,89,0.15)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex overflow-x-auto">
              {filterTabs.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setFilter(item.value)}
                  className="px-5 py-4 text-xs tracking-[0.35em] whitespace-nowrap transition-all duration-200 relative"
                  style={{ color: filter === item.value ? '#F5F1EB' : '#4A3E36' }}
                >
                  {item.label}
                  {filter === item.value && (
                    <div className="absolute bottom-0 left-5 right-5" style={{ height: '2px', background: warmGradient }} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-10" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProducts.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-lg mb-2" style={{ color: '#121212' }}>No items in this category yet</p>
              <p className="text-sm" style={{ color: '#7A6F66' }}>Check back soon — new drops coming.</p>
            </div>
          )}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.04 }}
                className="group cursor-pointer"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                {/* Image area */}
                <div className="relative aspect-[3/4] mb-3 overflow-hidden" style={{ backgroundColor: '#F5F1EB' }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                    style={{ opacity: hoveredProduct === product.id ? 0 : 1, filter: 'blur(8px)' }}
                  />
                  <img
                    src={product.hoverImage}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                    style={{ opacity: hoveredProduct === product.id ? 1 : 0, filter: 'blur(8px)' }}
                  />

                  {/* Coming Soon overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ backgroundColor: 'rgba(10,10,10,0.78)' }}>
                    <div className="px-5 py-2 text-[9px] tracking-[0.4em] text-center mb-2" style={{ background: warmGradient, color: '#FFFFFF' }}>
                      COMING SUMMER 2026
                    </div>
                    <p className="text-[9px] tracking-wider" style={{ color: 'rgba(245,241,235,0.55)' }}>Pre-Order Available Soon</p>
                  </div>

                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 text-[8px] tracking-widest z-10"
                      style={{
                        backgroundColor: product.badge === 'PREMIUM' ? 'rgba(166,143,89,0.9)' : product.badge === 'LIMITED' ? 'rgba(177,100,59,0.9)' : 'rgba(18,18,18,0.85)',
                        color: '#FFFFFF'
                      }}>
                      {product.badge}
                    </div>
                  )}
                </div>

                {/* Product info */}
                <div className="space-y-1">
                  <h3 className="text-[10px] tracking-wider leading-snug" style={{ color: '#121212' }}>{product.name}</h3>
                  <p className="text-sm" style={{ color: '#121212' }}>${product.price} CAD</p>

                  {/* Size hover */}
                  {hoveredProduct === product.id && product.sizes.length > 1 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-1.5">
                      <p className="text-[9px] tracking-widest mb-1" style={{ color: '#7A6F66' }}>SELECT SIZE</p>
                      <div className="flex gap-1 flex-wrap">
                        {product.sizes.map(size => (
                          <button key={size} onClick={() => setSelectedSizes(prev => ({ ...prev, [product.id]: size }))}
                            className="px-1.5 py-0.5 text-[9px] tracking-wide border transition-colors"
                            style={{
                              borderColor: selectedSizes[product.id] === size ? '#121212' : '#E3DCD3',
                              backgroundColor: selectedSizes[product.id] === size ? '#121212' : '#FFFFFF',
                              color: selectedSizes[product.id] === size ? '#FFFFFF' : '#121212'
                            }}>
                            {size}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Color hover */}
                  {hoveredProduct === product.id && product.colors.length > 1 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-1.5">
                      <p className="text-[9px] tracking-widest mb-1" style={{ color: '#7A6F66' }}>COLORS</p>
                      <div className="flex gap-1 flex-wrap">
                        {product.colors.map(color => (
                          <button key={color}
                            onClick={() => setSelectedColors(prev => ({ ...prev, [product.id]: { name: color, hex: colorPalette[color as keyof typeof colorPalette] } }))}
                            className="w-4 h-4 rounded-full border-2 transition-all"
                            style={{
                              backgroundColor: colorPalette[color as keyof typeof colorPalette],
                              borderColor: selectedColors[product.id]?.name === color ? '#121212' : '#E3DCD3',
                              transform: selectedColors[product.id]?.name === color ? 'scale(1.15)' : 'scale(1)'
                            }}
                            title={color}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Statement — dark editorial */}
      <section className="py-20 relative overflow-hidden" style={{ backgroundColor: '#0A0A0A' }}>
        <div className="absolute top-0 left-0 right-0" style={{ height: '1px', backgroundColor: 'rgba(166,143,89,0.3)' }} />
        <div className="absolute bottom-0 left-0 right-0" style={{ height: '1px', backgroundColor: 'rgba(166,143,89,0.3)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 50% 70% at 50% 50%, rgba(166,143,89,0.05) 0%, transparent 65%)'
        }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center justify-center gap-5 mb-8">
              <div style={{ height: '1px', width: '50px', backgroundColor: 'rgba(166,143,89,0.4)' }} />
              <p className="text-xs tracking-[0.5em] uppercase" style={{ color: '#A68F59' }}>The SEEN Manifesto</p>
              <div style={{ height: '1px', width: '50px', backgroundColor: 'rgba(166,143,89,0.4)' }} />
            </div>
            <p className="text-lg md:text-2xl font-light leading-relaxed mb-6 italic" style={{ color: '#E3DCD3' }}>
              "We design for visibility, softness, and resistance.<br />
              This is not just fashion — it's archive."
            </p>
            <p className="text-xs tracking-[0.45em] uppercase" style={{ color: '#4A3E36' }}>
              CREOVA / NIAGARA, CANADA
            </p>
          </motion.div>
        </div>
      </section>

      {/* Info bar — cream editorial */}
      <section className="py-16" style={{ backgroundColor: '#F5F1EB', borderTop: '1px solid rgba(18,18,18,0.08)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-10 text-center mb-10">
            {[
              { title: 'ECO-CONSCIOUS', desc: 'Recycled packaging & sustainable fabrics' },
              { title: 'NUMBERED EDITIONS', desc: 'Limited small-batch drops (50–100 pieces)' },
              { title: 'BIPOC-LED', desc: 'Black-led studio serving global community' }
            ].map((item, i) => (
              <div key={i}>
                <div style={{ height: '2px', width: '24px', background: warmGradient, margin: '0 auto 12px' }} />
                <h3 className="text-[10px] tracking-[0.4em] mb-2 uppercase" style={{ color: '#121212' }}>{item.title}</h3>
                <p className="text-xs" style={{ color: '#7A6F66' }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center pt-4" style={{ borderTop: '1px solid rgba(18,18,18,0.08)' }}>
            <p className="text-xs tracking-wide mb-1" style={{ color: '#4A3E36' }}>
              All pieces available in multiple colorways from our signature age-inclusive palette (5–90 years)
            </p>
            <p className="text-[9px] tracking-[0.4em] uppercase" style={{ color: '#7A6F66' }}>
              Timeless · Unisex · Versatile — Designed to work across all skin tones
            </p>
          </div>
        </div>
      </section>

      {/* Modals */}
      <ProductQuickView product={quickViewProduct} isOpen={!!quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      <SizeGuide isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
      {selectedProduct && (
        <AddToCartDialog
          open={addToCartDialogOpen}
          onOpenChange={setAddToCartDialogOpen}
          product={selectedProduct}
          colorPalette={colorPalette}
          onAddToCart={(productId, size, color) => {
            addItem({ id: `${productId}-${size}-${color.name}`, name: `${selectedProduct.name} - ${size} - ${color.name}`, price: selectedProduct.price, type: 'clothing', image: selectedProduct.image });
            toast.success('Added to bag', { description: `${selectedProduct.name} (${size}, ${color.name})` });
          }}
        />
      )}
    </div>
  );
}
