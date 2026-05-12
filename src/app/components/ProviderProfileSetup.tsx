import { useState } from 'react';
import {
  User,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Award,
  Phone,
  Mail,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Wrench
} from 'lucide-react';
import { toast } from 'sonner';
import { ServiceProvider, Specialization, ServiceOffered } from '../types/serviceProvider';
import { createServiceProvider, updateServiceProvider } from '../services/database';
import { useAuth } from '../contexts/AuthContext';

interface ProviderProfileSetupProps {
  onComplete: (provider: ServiceProvider) => void;
  existingProvider?: ServiceProvider | null;
}

const specializations: Specialization[] = [
  'Electrician',
  'Plumber',
  'Carpenter',
  'Aircon Technician',
  'Painter',
  'Mason',
  'Welder',
  'Appliance Repair',
  'HVAC Specialist'
];

const metroManilaAreas = [
  'Manila', 'Quezon City', 'Caloocan', 'Las Piñas', 'Makati',
  'Malabon', 'Mandaluyong', 'Marikina', 'Muntinlupa', 'Navotas',
  'Parañaque', 'Pasay', 'Pasig', 'Pateros', 'San Juan', 'Taguig', 'Valenzuela'
];

export function ProviderProfileSetup({ onComplete, existingProvider }: ProviderProfileSetupProps) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Basic Information
  const [fullName, setFullName] = useState(existingProvider?.fullName || user?.name || '');
  const [email, setEmail] = useState(existingProvider?.email || user?.email || '');
  const [phone, setPhone] = useState(existingProvider?.phone || '');
  const [city, setCity] = useState(existingProvider?.location.city || 'Manila');
  const [bio, setBio] = useState(existingProvider?.bio || '');

  // Step 2: Professional Details
  const [primarySpecialization, setPrimarySpecialization] = useState<Specialization>(
    existingProvider?.primarySpecialization || 'Electrician'
  );
  const [yearsOfExperience, setYearsOfExperience] = useState(existingProvider?.yearsOfExperience || 1);
  const [serviceAreas, setServiceAreas] = useState<string[]>(existingProvider?.serviceAreas || ['Manila']);

  // Step 3: Services & Rates
  const [services, setServices] = useState<ServiceOffered[]>(
    existingProvider?.servicesOffered.length ? existingProvider.servicesOffered : [
      {
        id: 'service-1',
        name: '',
        description: '',
        basePrice: 0,
        estimatedDuration: '1-2 hours'
      }
    ]
  );

  const addService = () => {
    setServices([
      ...services,
      {
        id: `service-${Date.now()}`,
        name: '',
        description: '',
        basePrice: 0,
        estimatedDuration: '1-2 hours'
      }
    ]);
  };

  const updateService = (index: number, field: keyof ServiceOffered, value: any) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
  };

  const removeService = (index: number) => {
    if (services.length > 1) {
      setServices(services.filter((_, i) => i !== index));
    }
  };

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      if (!fullName.trim()) {
        toast.error('Please enter your full name');
        return false;
      }
      if (!email.trim()) {
        toast.error('Please enter your email');
        return false;
      }
      if (!phone.trim()) {
        toast.error('Please enter your phone number');
        return false;
      }
      if (!bio.trim()) {
        toast.error('Please write a short bio about your services');
        return false;
      }
    }

    if (step === 2) {
      if (serviceAreas.length === 0) {
        toast.error('Please select at least one service area');
        return false;
      }
    }

    if (step === 3) {
      const validServices = services.filter(s => s.name.trim() && s.basePrice > 0);
      if (validServices.length === 0) {
        toast.error('Please add at least one service with a price');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      // Filter out empty services
      const validServices = services.filter(s => s.name.trim() && s.basePrice > 0);

      const prices = validServices.map(s => s.basePrice);
      const providerData = {
        userId: user.id,
        fullName,
        email,
        phone,
        primarySpecialization,
        secondarySkills: [],
        yearsOfExperience,
        bio,
        certifications: [],
        licenses: [],
        trainingBackground: [],
        servicesOffered: validServices,
        portfolio: [],
        serviceAreas,
        location: { city, region: 'NCR' },
        priceRange: {
          min: Math.min(...prices),
          max: Math.max(...prices)
        },
        startingRate: Math.min(...prices),
        rating: 0,
        totalReviews: 0,
        completedJobs: 0,
        totalEarnings: 0,
        reviews: [],
        status: 'approved' as const, // Auto-approve for demo
        isVerified: false,
        isTopRated: false
      };

      let provider;
      if (existingProvider) {
        provider = await updateServiceProvider(existingProvider.id, providerData);
      } else {
        provider = await createServiceProvider(providerData);
      }

      if (provider) {
        toast.success('Profile setup complete!');
        onComplete(provider);
      } else {
        toast.error('Failed to save profile. Please try again.');
      }
    } catch (error) {
      console.error('Error saving provider profile:', error);
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleServiceArea = (area: string) => {
    if (serviceAreas.includes(area)) {
      setServiceAreas(serviceAreas.filter(a => a !== area));
    } else {
      setServiceAreas([...serviceAreas, area]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with FIX&BIN Branding */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">FIX&BIN</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Service Provider Setup</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    step < currentStep
                      ? 'bg-green-500 text-white'
                      : step === currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}>
                    {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${
                    step === currentStep ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {step === 1 && 'Basic Info'}
                    {step === 2 && 'Professional'}
                    {step === 3 && 'Services'}
                  </span>
                </div>
                {step < 3 && (
                  <div className={`h-1 flex-1 mx-2 rounded transition-colors ${
                    step < currentStep ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Basic Information</h2>
                <p className="text-gray-600 dark:text-gray-400">Let's start with your contact details</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Juan Dela Cruz"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="juan@example.com"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+63 912 345 6789"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Base City <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    {metroManilaAreas.map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  About Your Services <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  placeholder="Describe your experience, expertise, and what makes you stand out..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  This will be shown to customers when they view your profile
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Professional Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Professional Details</h2>
                <p className="text-gray-600 dark:text-gray-400">Tell us about your expertise</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Briefcase className="w-4 h-4 inline mr-1" />
                    Primary Specialization <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={primarySpecialization}
                    onChange={(e) => setPrimarySpecialization(e.target.value as Specialization)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    {specializations.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Years of Experience <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={yearsOfExperience}
                    onChange={(e) => setYearsOfExperience(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Service Areas (Metro Manila) <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-80 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                  {metroManilaAreas.map(area => (
                    <label
                      key={area}
                      className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                        serviceAreas.includes(area)
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={serviceAreas.includes(area)}
                        onChange={() => toggleServiceArea(area)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{area}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Selected: {serviceAreas.length} area{serviceAreas.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Services & Rates */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Services & Rates</h2>
                <p className="text-gray-600 dark:text-gray-400">Add the services you offer with pricing</p>
              </div>

              <div className="space-y-4">
                {services.map((service, index) => (
                  <div key={service.id} className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 dark:text-white">Service {index + 1}</h3>
                      {services.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeService(index)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Service Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={service.name}
                          onChange={(e) => updateService(index, 'name', e.target.value)}
                          placeholder="e.g., Electrical Wiring Installation"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          <DollarSign className="w-4 h-4 inline mr-1" />
                          Base Price (₱) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={service.basePrice}
                          onChange={(e) => updateService(index, 'basePrice', parseFloat(e.target.value) || 0)}
                          placeholder="1500"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          <Clock className="w-4 h-4 inline mr-1" />
                          Estimated Duration
                        </label>
                        <input
                          type="text"
                          value={service.estimatedDuration}
                          onChange={(e) => updateService(index, 'estimatedDuration', e.target.value)}
                          placeholder="2-3 hours"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Description
                        </label>
                        <textarea
                          value={service.description}
                          onChange={(e) => updateService(index, 'description', e.target.value)}
                          rows={2}
                          placeholder="Brief description of what this service includes..."
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addService}
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-600 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-colors font-medium"
                >
                  + Add Another Service
                </button>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-1">Pro Tip</h4>
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      Be specific with your services and competitive with pricing. You can always add more services or edit prices later in your dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 1
                  ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  : 'text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === 3 ? (
                isSubmitting ? (
                  'Setting up...'
                ) : (
                  <>
                    Complete Setup
                    <CheckCircle className="w-4 h-4" />
                  </>
                )
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
