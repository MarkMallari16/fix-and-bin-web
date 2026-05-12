import { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Wrench,
  ChevronRight,
  AlertCircle,
  DollarSign,
  User,
  Star
} from 'lucide-react';
import { toast } from 'sonner';
import { ServiceProvider } from '../types/serviceProvider';
import { createBooking } from '../services/database';
import { useAuth } from '../contexts/AuthContext';

interface BookingFormLockedProps {
  provider: ServiceProvider;
  onBookingComplete: () => void;
  onCancel: () => void;
}

// Metro Manila areas only
const metroManilaAreas = [
  'Manila',
  'Quezon City',
  'Caloocan',
  'Las Piñas',
  'Makati',
  'Malabon',
  'Mandaluyong',
  'Marikina',
  'Muntinlupa',
  'Navotas',
  'Parañaque',
  'Pasay',
  'Pasig',
  'Pateros',
  'San Juan',
  'Taguig',
  'Valenzuela'
];

export function BookingFormLocked({ provider, onBookingComplete, onCancel }: BookingFormLockedProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    serviceId: '',
    date: '',
    time: '',
    area: '',
    address: '',
    description: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.serviceId) newErrors.serviceId = 'Please select a service';
    }

    if (currentStep === 2) {
      if (!formData.date) newErrors.date = 'Please select a date';
      if (!formData.time) newErrors.time = 'Please select a time';
      if (!formData.area) newErrors.area = 'Please select your area';
      if (!formData.address) newErrors.address = 'Please enter your complete address';

      // Validate date is not in the past
      if (formData.date) {
        const selectedDate = new Date(formData.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          newErrors.date = 'Date cannot be in the past';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < 3) {
        setStep(step + 1);
      } else {
        handleSubmit();
      }
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
    } else {
      onCancel();
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(3) || !user) return;

    setIsSubmitting(true);
    try {
      const selectedService = provider.servicesOffered.find(s => s.id === formData.serviceId);

      const booking = await createBooking({
        customerId: user.id,
        customerName: user.name,
        customerPhone: user.email,
        customerAddress: `${formData.address}, ${formData.area}, Metro Manila`,
        providerId: provider.id,
        providerName: provider.fullName,
        serviceType: selectedService?.name || '',
        serviceDescription: formData.description,
        scheduledDate: formData.date,
        scheduledTime: formData.time,
        status: 'pending',
        price: selectedService?.basePrice || 0,
        paymentMethod: 'cash',
        paymentStatus: 'pending'
      });

      if (booking) {
        toast.success('Booking confirmed! Redirecting...');
        setTimeout(() => {
          onBookingComplete();
        }, 1500);
      } else {
        toast.error('Failed to create booking. Please try again.');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedService = provider.servicesOffered.find(s => s.id === formData.serviceId);

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Locked Provider Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              {provider.profilePhoto ? (
                <img src={provider.profilePhoto} alt={provider.fullName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-600 dark:text-gray-300">
                  {provider.fullName.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 dark:text-white">{provider?.fullName || 'Provider'}</h3>
              <p className="text-sm text-blue-600 dark:text-blue-400">{provider?.primarySpecialization || 'Service Provider'}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-yellow-500 mb-1">
                <Star className="w-4 h-4 fill-yellow-500" />
                <span className="font-semibold text-gray-900 dark:text-white">{provider.rating.toFixed(1)}</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">{provider.location.city}</p>
            </div>
          </div>
          <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
            🔒 Provider locked for this booking
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  s <= step ? 'bg-blue-600 text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                } font-bold transition-colors`}>
                  {s}
                </div>
                {s < 3 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    s < step ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
                  } transition-colors`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className={`text-xs ${step === 1 ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
              Select Service
            </span>
            <span className={`text-xs ${step === 2 ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
              Schedule & Location
            </span>
            <span className={`text-xs ${step === 3 ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
              Confirm
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          {/* Step 1: Service Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Choose Service</h2>

              <div className="space-y-3">
                {provider.servicesOffered.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, serviceId: service.id })}
                    className={`w-full p-4 border-2 rounded-lg transition-all text-left ${
                      formData.serviceId === service.id
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">{service.name}</h4>
                      <span className="text-blue-600 dark:text-blue-400 font-semibold">₱{service.basePrice.toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{service.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">Duration: {service.estimatedDuration}</p>
                  </button>
                ))}
              </div>
              {errors.serviceId && (
                <div className="flex items-center gap-1 text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.serviceId}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Schedule & Location */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Schedule & Location</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    min={getMinDate()}
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      errors.date ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errors.date && (
                    <div className="flex items-center gap-1 text-red-600 dark:text-red-400 text-sm mt-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.date}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Time <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      errors.time ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <option value="">Select time</option>
                    <option value="08:00">8:00 AM</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                    <option value="17:00">5:00 PM</option>
                  </select>
                  {errors.time && (
                    <div className="flex items-center gap-1 text-red-600 dark:text-red-400 text-sm mt-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.time}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  City/Area (Metro Manila) <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.area ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <option value="">Select your city/area</option>
                  {metroManilaAreas.map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
                {errors.area && (
                  <div className="flex items-center gap-1 text-red-600 dark:text-red-400 text-sm mt-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.area}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Complete Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street, Barangay, Building/House Number"
                  rows={3}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 ${
                    errors.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.address && (
                  <div className="flex items-center gap-1 text-red-600 dark:text-red-400 text-sm mt-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.address}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Wrench className="w-4 h-4 inline mr-1" />
                  Additional Details (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the issue or any special instructions..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                />
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Confirm Booking</h2>

              {/* Booking Summary */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Provider:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{provider?.fullName || 'Provider'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Specialization:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{provider?.primarySpecialization || 'Service Provider'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Service:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Date & Time:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {new Date(formData.date).toLocaleDateString()} at {formData.time}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Location:</span>
                    <span className="font-medium text-gray-900 dark:text-white text-right max-w-[200px]">
                      {formData.area}, Metro Manila
                    </span>
                  </div>
                  <div className="border-t border-blue-300 dark:border-blue-700 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Service Fee:</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        ₱{selectedService?.basePrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method - Cash Only */}
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Payment Method</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Cash on Service</p>
                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                      Pay the provider in cash after service completion
                    </p>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  By confirming this booking, you agree to our Terms of Service. Cancellations made less than 24 hours before the scheduled time may incur charges.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-2.5 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {step === 3 ? (isSubmitting ? 'Processing...' : 'Confirm Booking') : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
