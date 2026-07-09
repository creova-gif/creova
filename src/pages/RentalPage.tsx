import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Checkbox } from '../components/ui/checkbox';
import { Captcha } from '../components/Captcha';
import { motion } from 'motion/react';
import { Camera, Video, Lightbulb, Mic, Package, Calendar as CalendarIcon, Clock, CheckCircle2, ArrowLeft, Star, AlertCircle, ShieldCheck, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { format, differenceInDays } from 'date-fns';
import { logger } from '../utils/logger';

export function RentalPage() {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    equipment: [] as string[],
    name: '',
    email: '',
    phone: '',
    pickupLocation: '',
    purpose: '',
    specialRequests: '',
    hasInsurance: false,
    agreedToTerms: false
  });

  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token);
    logger.log('CAPTCHA verified successfully');
  };

  const handleCaptchaExpire = () => {
    setCaptchaToken(null);
    logger.log('CAPTCHA expired, please verify again');
    toast.error('Security verification expired. Please verify again.');
  };

  const handleCaptchaError = (error: string) => {
    setCaptchaToken(null);
    if (window.location.hostname === 'creova.ca') {
      toast.error('Security Verification Issue', {
        description: error || 'Unable to verify. Please refresh and try again.'
      });
    }
  };

  const equipmentOptions = [
    { 
      id: 'osmo-kit', 
      name: 'DJI Osmo Creator Kit',
      icon: Video,
      price: 175,
      deposit: 400,
      includes: [
        'DJI Osmo Pocket 3 or Action 5 Pro',
        'Wireless Mic System (2x transmitters)',
        'Extension Rod & Tripod',
        'Extra Batteries & Storage'
      ]
    },
    { 
      id: 'photography-kit', 
      name: 'Photography Kit',
      icon: Camera,
      price: 150,
      deposit: 350,
      includes: [
        'Professional DSLR/Mirrorless Camera',
        'Multiple Lens Kit (Wide, Standard, Portrait)',
        'Camera Bag & Accessories',
        'Extra Batteries & Memory Cards'
      ]
    },
    { 
      id: 'videography-kit', 
      name: 'Videography Kit',
      icon: Video,
      price: 250,
      deposit: 500,
      includes: [
        'Professional Cinema Camera',
        'Gimbal Stabilizer',
        'ND Filters & Accessories',
        'Extra Batteries & Storage'
      ]
    },
    { 
      id: 'lighting-package', 
      name: 'Lighting Package',
      icon: Lightbulb,
      price: 100,
      deposit: 200,
      includes: [
        '3x LED Panel Lights',
        'Softboxes & Light Stands',
        'Color Gels & Diffusers',
        'Carrying Case'
      ]
    },
    { 
      id: 'audio-package', 
      name: 'Audio Package',
      icon: Mic,
      price: 75,
      deposit: 150,
      includes: [
        'Professional Lavalier Microphones',
        'Shotgun Microphone',
        'Audio Recorder',
        'XLR Cables & Accessories'
      ]
    }
  ];

  const toggleEquipment = (equipmentId: string) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.includes(equipmentId)
        ? prev.equipment.filter(id => id !== equipmentId)
        : [...prev.equipment, equipmentId]
    }));
  };

  const calculateTotal = () => {
    if (!startDate || !endDate || formData.equipment.length === 0) return { daily: 0, total: 0, days: 0, deposit: 0, discount: 0 };
    
    const days = Math.max(1, differenceInDays(endDate, startDate) + 1);
    const dailyRate = formData.equipment.reduce((sum, equipmentId) => {
      const equipment = equipmentOptions.find(e => e.id === equipmentId);
      return sum + (equipment?.price || 0);
    }, 0);
    
    const totalDeposit = formData.equipment.reduce((sum, equipmentId) => {
      const equipment = equipmentOptions.find(e => e.id === equipmentId);
      return sum + (equipment?.deposit || 0);
    }, 0);
    
    // Multi-day discount: 10% off for 3+ days, 15% off for 7+ days
    let discount = 1;
    if (days >= 7) discount = 0.85;
    else if (days >= 3) discount = 0.90;
    
    return {
      daily: dailyRate,
      total: Math.round(dailyRate * days * discount),
      days,
      deposit: totalDeposit,
      discount: discount < 1 ? Math.round((1 - discount) * 100) : 0
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (formData.equipment.length === 0) {
      toast.error('Please select at least one equipment item');
      return;
    }

    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!startDate || !endDate) {
      toast.error('Please select rental start and end dates');
      return;
    }

    if (endDate < startDate) {
      toast.error('End date must be after start date');
      return;
    }

    if (!formData.agreedToTerms) {
      toast.error('Please agree to the rental terms and conditions');
      return;
    }

    if (!captchaToken) {
      toast.error('Please complete the security verification');
      return;
    }

    setIsSubmitting(true);

    try {
      const pricing = calculateTotal();
      const selectedEquipment = formData.equipment.map(id => 
        equipmentOptions.find(e => e.id === id)?.name || id
      );

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-feacf0d8/submit-rental`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            equipment: selectedEquipment,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            startDate: format(startDate, 'PPP'),
            endDate: format(endDate, 'PPP'),
            rentalDays: pricing.days,
            dailyRate: pricing.daily,
            totalCost: pricing.total,
            depositAmount: pricing.deposit,
            pickupLocation: formData.pickupLocation,
            purpose: formData.purpose,
            specialRequests: formData.specialRequests,
            hasInsurance: formData.hasInsurance,
            submittedAt: new Date().toISOString()
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success('Rental request submitted!', {
          description: 'We\'ll contact you within 24 hours to confirm availability and arrange pickup.'
        });
        
        // Reset form
        setFormData({
          equipment: [],
          name: '',
          email: '',
          phone: '',
          pickupLocation: '',
          purpose: '',
          specialRequests: '',
          hasInsurance: false,
          agreedToTerms: false
        });
        setStartDate(undefined);
        setEndDate(undefined);

        // Redirect to home
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        throw new Error(data.error || 'Failed to submit rental request');
      }
    } catch {
      toast.error('Failed to submit rental request', {
        description: 'Please try again or contact us directly.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const pricing = calculateTotal();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F1EB' }}>
      {/* Hero — editorial asymmetric split */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#0A0A0A', minHeight: '420px' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `radial-gradient(ellipse 50% 80% at 0% 50%, rgba(166,143,89,0.07) 0%, transparent 60%),
                       radial-gradient(ellipse 35% 55% at 100% 30%, rgba(177,100,59,0.05) 0%, transparent 60%)`
        }} />
        <div className="absolute top-0 left-0 right-0" style={{ height: '3px', background: 'linear-gradient(135deg, #A68F59 0%, #B1643B 100%)' }} />
        <div className="absolute bottom-0 left-0 right-0" style={{ height: '1px', backgroundColor: 'rgba(166,143,89,0.2)' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-[1fr_auto] gap-0 items-center py-14 sm:py-20">

            {/* LEFT */}
            <div>
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="mb-8 text-xs px-0 tracking-widest uppercase"
                style={{ color: 'rgba(166,143,89,0.6)' }}
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-2" />
                Back
              </Button>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-3 mb-6"
              >
                <div style={{ height: '1px', width: '32px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
                <span className="text-[10px] tracking-[0.5em] uppercase" style={{ color: '#A68F59' }}>Equipment Rental</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="font-light leading-none tracking-tighter"
                style={{ fontSize: 'clamp(64px, 12vw, 160px)', color: '#F5F1EB' }}
              >
                Rent.
              </motion.h1>

              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.22 }}
                className="italic leading-none tracking-tight mb-8"
                style={{
                  fontSize: 'clamp(18px, 3vw, 40px)',
                  backgroundImage: 'linear-gradient(135deg, #A68F59 0%, #B1643B 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                / Pro-Grade Gear.
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm font-light max-w-sm"
                style={{ color: 'rgba(245,241,235,0.4)' }}
              >
                Cameras · Lighting · Audio — for your next creative project.
              </motion.p>
            </div>

            {/* RIGHT — gear stat tiles */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="hidden md:flex flex-col gap-3 w-56 ml-16"
            >
              {[
                { icon: Camera, label: 'Photography Kit', desc: '$150/day · $350 deposit', color: '#A68F59' },
                { icon: Video, label: 'Creator Kit', desc: '$175/day · $400 deposit', color: '#B1643B' },
                { icon: Lightbulb, label: 'Lighting Kit', desc: '$85/day · $200 deposit', color: '#A68F59' },
                { icon: Zap, label: 'Multi-day savings', desc: 'Up to 15% off 7+ days', color: '#B1643B' },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl"
                  style={{
                    backgroundColor: 'rgba(245,241,235,0.04)',
                    border: '1px solid rgba(166,143,89,0.12)',
                  }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgba(166,143,89,0.1)' }}>
                    <item.icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                  </div>
                  <div>
                    <div className="text-xs font-medium" style={{ color: '#F5F1EB' }}>{item.label}</div>
                    <p className="text-[10px] mt-0.5" style={{ color: 'rgba(245,241,235,0.3)' }}>{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Rental Form */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
          >
            <div className="space-y-8">
              {/* Equipment Selection */}
              <div>
                <h2 className="text-2xl mb-2" style={{ color: '#121212' }}>
                  Select Equipment
                </h2>
                <p className="text-sm mb-6" style={{ color: '#7A6F66' }}>
                  Choose one or more equipment packages for your rental
                </p>
                <div className="space-y-4">
                  {equipmentOptions.map((equipment) => {
                    const Icon = equipment.icon;
                    const isSelected = formData.equipment.includes(equipment.id);
                    return (
                      <div
                        key={equipment.id}
                        className="p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer"
                        style={{
                          borderColor: isSelected ? '#A68F59' : '#E3DCD3',
                          backgroundColor: isSelected ? 'rgba(166, 143, 89, 0.05)' : '#FFFFFF'
                        }}
                        onClick={() => toggleEquipment(equipment.id)}
                      >
                        <div className="flex items-start gap-4">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleEquipment(equipment.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Icon className="w-6 h-6" style={{ color: isSelected ? '#A68F59' : '#121212' }} />
                              <div>
                                <h3 className="font-medium" style={{ color: '#121212' }}>
                                  {equipment.name}
                                </h3>
                                <div className="flex items-center gap-4 mt-1">
                                  <span className="text-lg" style={{ color: '#A68F59' }}>
                                    ${equipment.price}/day
                                  </span>
                                  <span className="text-sm" style={{ color: '#7A6F66' }}>
                                    Deposit: ${equipment.deposit}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <ul className="space-y-1 ml-2">
                              {equipment.includes.map((item, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-sm" style={{ color: '#7A6F66' }}>
                                  <CheckCircle2 className="w-3 h-3" style={{ color: '#A68F59' }} />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Rental Period */}
              <div className="border-t pt-8" style={{ borderColor: '#E3DCD3' }}>
                <h2 className="text-2xl mb-6" style={{ color: '#121212' }}>
                  Rental Period
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Start Date */}
                  <div>
                    <Label className="mb-2 block" style={{ color: '#121212' }}>
                      Start Date *
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full h-12 justify-start text-left font-normal"
                          style={{ color: startDate ? '#121212' : '#7A6F66' }}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, 'PPP') : 'Pick start date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* End Date */}
                  <div>
                    <Label className="mb-2 block" style={{ color: '#121212' }}>
                      End Date *
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full h-12 justify-start text-left font-normal"
                          style={{ color: endDate ? '#121212' : '#7A6F66' }}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, 'PPP') : 'Pick end date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          disabled={(date) => !startDate || date < startDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Pricing Summary */}
                {formData.equipment.length > 0 && startDate && endDate && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-6 p-4 rounded-xl"
                    style={{ backgroundColor: 'rgba(166, 143, 89, 0.1)', border: '1px solid #A68F59' }}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span style={{ color: '#121212' }}>Daily Rate:</span>
                        <span style={{ color: '#121212' }}>${pricing.daily}/day</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span style={{ color: '#121212' }}>Rental Duration:</span>
                        <span style={{ color: '#121212' }}>{pricing.days} day{pricing.days > 1 ? 's' : ''}</span>
                      </div>
                      {pricing.discount > 0 && (
                        <div className="flex justify-between items-center">
                          <span style={{ color: '#B1643B' }}>Multi-day Discount:</span>
                          <span style={{ color: '#B1643B' }}>-{pricing.discount}%</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: '#A68F59' }}>
                        <span className="font-medium" style={{ color: '#121212' }}>Total Rental Cost:</span>
                        <span className="text-xl font-medium" style={{ color: '#A68F59' }}>${pricing.total} CAD</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: '#A68F59' }}>
                        <span className="font-medium" style={{ color: '#B1643B' }}>Security Deposit:</span>
                        <span className="text-lg font-medium" style={{ color: '#B1643B' }}>${pricing.deposit} CAD</span>
                      </div>
                      <p className="text-xs pt-2" style={{ color: '#7A6F66' }}>
                        Deposit is fully refundable upon equipment return in good condition
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Contact Information */}
              <div className="border-t pt-8" style={{ borderColor: '#E3DCD3' }}>
                <h2 className="text-2xl mb-6" style={{ color: '#121212' }}>
                  Your Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <Label htmlFor="name" className="mb-2 block" style={{ color: '#121212' }}>
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="h-12"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email" className="mb-2 block" style={{ color: '#121212' }}>
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="h-12"
                      placeholder="john@example.com"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <Label htmlFor="phone" className="mb-2 block" style={{ color: '#121212' }}>
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="h-12"
                      placeholder="(416) 123-4567"
                    />
                  </div>

                  {/* Pickup Location */}
                  <div>
                    <Label htmlFor="pickupLocation" className="mb-2 block" style={{ color: '#121212' }}>
                      Preferred Pickup Location
                    </Label>
                    <Input
                      id="pickupLocation"
                      value={formData.pickupLocation}
                      onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                      className="h-12"
                      placeholder="CREOVA Studio, Ontario"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="border-t pt-8" style={{ borderColor: '#E3DCD3' }}>
                <h2 className="text-2xl mb-6" style={{ color: '#121212' }}>
                  Additional Details
                </h2>

                <div className="space-y-6">
                  {/* Purpose */}
                  <div>
                    <Label htmlFor="purpose" className="mb-2 block" style={{ color: '#121212' }}>
                      Purpose of Rental
                    </Label>
                    <Input
                      id="purpose"
                      value={formData.purpose}
                      onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                      className="h-12"
                      placeholder="e.g., Wedding videography, Product shoot, Short film"
                    />
                  </div>

                  {/* Special Requests */}
                  <div>
                    <Label htmlFor="specialRequests" className="mb-2 block" style={{ color: '#121212' }}>
                      Special Requests or Questions
                    </Label>
                    <Textarea
                      id="specialRequests"
                      value={formData.specialRequests}
                      onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                      rows={4}
                      placeholder="Any additional equipment needs, delivery preferences, or questions..."
                    />
                  </div>

                  {/* Insurance Checkbox */}
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="hasInsurance"
                      checked={formData.hasInsurance}
                      onCheckedChange={(checked) => setFormData({ ...formData, hasInsurance: checked as boolean })}
                    />
                    <div>
                      <Label htmlFor="hasInsurance" className="cursor-pointer" style={{ color: '#121212' }}>
                        I have equipment insurance coverage
                      </Label>
                      <p className="text-xs mt-1" style={{ color: '#7A6F66' }}>
                        Optional but recommended for high-value rentals
                      </p>
                    </div>
                  </div>

                  {/* Terms Checkbox */}
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="agreedToTerms"
                      checked={formData.agreedToTerms}
                      onCheckedChange={(checked) => setFormData({ ...formData, agreedToTerms: checked as boolean })}
                      required
                    />
                    <div>
                      <Label htmlFor="agreedToTerms" className="cursor-pointer" style={{ color: '#121212' }}>
                        I agree to the rental terms and conditions *
                      </Label>
                      <p className="text-xs mt-1" style={{ color: '#7A6F66' }}>
                        Including damage policy, return requirements, and security deposit terms
                      </p>
                    </div>
                  </div>

                  {/* Captcha */}
                  <div className="flex items-center gap-4">
                    <Captcha
                      onVerify={handleCaptchaVerify}
                      onExpire={handleCaptchaExpire}
                      onError={handleCaptchaError}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-14 text-base group"
                  style={{ backgroundColor: '#121212' }}
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="w-5 h-5 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                      Submit Rental Request
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="h-14 px-8"
                >
                  Cancel
                </Button>
              </div>

              <p className="text-xs text-center" style={{ color: '#7A6F66' }}>
                By submitting this form, you agree to be contacted by CREOVA regarding your equipment rental request. 
                We typically respond within 24 hours to confirm availability.
              </p>
            </div>
          </motion.form>
        </div>
      </section>

      {/* Rental Terms */}
      <section className="py-16" style={{ backgroundColor: '#121212' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl text-center mb-12" style={{ color: '#F5F1EB' }}>
            Rental Terms & Policies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: 'Security Deposit',
                description: 'Refundable deposit required upon pickup. Returned within 5 business days after equipment is returned in good condition.'
              },
              {
                icon: Clock,
                title: 'Rental Period',
                description: '24-hour day (e.g., pickup 9am Monday, return by 9am Tuesday). Multi-day discounts automatically applied.'
              },
              {
                icon: Package,
                title: 'Pickup & Return',
                description: 'Equipment must be picked up and returned at our Ontario location. Delivery available for additional fee.'
              },
              {
                icon: AlertCircle,
                title: 'Damage Policy',
                description: 'Renter is responsible for equipment damage or loss. Insurance options and damage waivers available.'
              },
              {
                icon: CheckCircle2,
                title: 'Reservation',
                description: 'Book at least 48 hours in advance. Valid ID and signed rental agreement required at pickup.'
              },
              {
                icon: Star,
                title: 'Equipment Quality',
                description: 'All equipment is professionally maintained, tested before each rental, and includes backup batteries and accessories.'
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex gap-4"
              >
                <div className="flex-shrink-0">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full" style={{ backgroundColor: 'rgba(166, 143, 89, 0.1)' }}>
                    <feature.icon className="w-6 h-6" style={{ color: '#A68F59' }} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg mb-2" style={{ color: '#F5F1EB' }}>
                    {feature.title}
                  </h3>
                  <p style={{ color: '#E3DCD3' }}>
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}