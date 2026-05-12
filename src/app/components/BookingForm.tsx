import { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Wrench,
  ChevronRight,
  AlertCircle,
  CreditCard,
  Wallet,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';

interface BookingFormProps {
  onBookingComplete: () => void;
  preselectedService?: string;
}

interface Worker {
  id: string;
  name: string;
  role: string;
  rating: number;
  photo?: string;
  priceRange: string;
}

const services = [
  { id: 'plumbing', name: 'Plumbing', icon: '🔧', basePrice: 2500 },
  { id: 'electrical', name: 'Electrical Work', icon: '⚡', basePrice: 3000 },
  { id: 'carpentry', name: 'Carpentry', icon: '🪚', basePrice: 3500 },
  { id: 'painting', name: 'Painting', icon: '🎨', basePrice: 2000 },
  { id: 'hvac', name: 'HVAC Repair', icon: '❄️', basePrice: 4000 },
  { id: 'cleaning', name: 'Deep Cleaning', icon: '🧹', basePrice: 1500 }
];

const availableWorkers: Worker[] = [
  {
    id: 'worker-1',
    name: 'Mike Johnson',
    role: 'Plumber',
    rating: 4.9,
    priceRange: '₱2,500 - ₱5,000'
  },
  {
    id: 'worker-2',
    name: 'Sarah Chen',
    role: 'Electrician',
    rating: 4.8,
    priceRange: '₱3,000 - ₱6,000'
  },
  {
    id: 'worker-3',
    name: 'David Martinez',
    role: 'Carpenter',
    rating: 4.9,
    priceRange: '₱3,500 - ₱7,000'
  }
];

const paymentMethods = [
  { id: 'cash', name: 'Cash on Delivery', icon: DollarSign, description: 'Pay when service is completed' },
  { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, Mastercard, etc.' },
  { id: 'gcash', name: 'GCash', icon: Wallet, description: 'Pay via GCash' },
  { id: 'paymaya', name: 'PayMaya', icon: Wallet, description: 'Pay via PayMaya' }
];

export function BookingForm({ onBookingComplete, preselectedService }: BookingFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: preselectedService || '',
    worker: '',
    date: '',
    time: '',
    address: '',
    description: '',
    paymentMethod: 'cash'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.service) newErrors.service = 'Please select a service';
      if (!formData.worker) newErrors.worker = 'Please select a worker';
    }

    if (currentStep === 2) {
      if (!formData.date) newErrors.date = 'Please select a date';
      if (!formData.time) newErrors.time = 'Please select a time';
      if (!formData.address) newErrors.address = 'Please enter your address';

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

    if (currentStep === 3) {
      if (!formData.paymentMethod) newErrors.paymentMethod = 'Please select a payment method';
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
    }
  };

  const handleSubmit = () => {
    if (validateStep(3)) {
      // Simulate booking submission
      toast.success('Booking confirmed! Redirecting to tracking...');
      setTimeout(() => {
        onBookingComplete();
      }, 1500);
    }
  };

  const selectedService = services.find(s => s.id === formData.service);
  const selectedWorker = availableWorkers.find(w => w.id === formData.worker);
  const selectedPayment = paymentMethods.find(p => p.id === formData.paymentMethod);

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  s <= step ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                } font-bold transition-colors`}>
                  {s}
                </div>
                {s < 3 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    s < step ? 'bg-blue-600' : 'bg-gray-300'
                  } transition-colors`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className={`text-xs ${step === 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
              Service & Worker
            </span>
            <span className={`text-xs ${step === 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
              Schedule & Location
            </span>
            <span className={`text-xs ${step === 3 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
              Payment & Confirm
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          {/* Step 1: Service & Worker Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Select Service & Worker</h2>

              {/* Service Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Choose Service <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, service: service.id })}
                      className={`p-4 border-2 rounded-lg transition-all text-left ${
                        formData.service === service.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-2">{service.icon}</div>
                      <div className="font-medium text-gray-900 text-sm">{service.name}</div>
                      <div className="text-xs text-gray-500 mt-1">From ₱{service.basePrice.toLocaleString()}</div>
                    </button>
                  ))}
                </div>
                {errors.service && (
                  <div className="flex items-center gap-1 text-red-600 text-sm mt-2">
                    <AlertCircle className="w-4 h-4" />
                    {errors.service}
                  </div>
                )}
              </div>

              {/* Worker Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Choose Worker <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  {availableWorkers.map((worker) => (
                    <button
                      key={worker.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, worker: worker.id })}
                      className={`w-full p-4 border-2 rounded-lg transition-all text-left ${
                        formData.worker === worker.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-600">
                            {worker.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{worker.name}</div>
                            <div className="text-sm text-gray-600">{worker.role}</div>
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                              <span>⭐ {worker.rating}</span>
                              <span>•</span>
                              <span>{worker.priceRange}</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </button>
                  ))}
                </div>
                {errors.worker && (
                  <div className="flex items-center gap-1 text-red-600 text-sm mt-2">
                    <AlertCircle className="w-4 h-4" />
                    {errors.worker}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Schedule & Location */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Schedule & Location</h2>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    min={getMinDate()}
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.date ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.date && (
                    <div className="flex items-center gap-1 text-red-600 text-sm mt-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.date}
                    </div>
                  )}
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Time <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.time ? 'border-red-500' : 'border-gray-300'
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
                    <div className="flex items-center gap-1 text-red-600 text-sm mt-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.time}
                    </div>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Service Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter complete address (Street, Barangay, City)"
                  rows={3}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.address && (
                  <div className="flex items-center gap-1 text-red-600 text-sm mt-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.address}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Wrench className="w-4 h-4 inline mr-1" />
                  Issue Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the issue in detail..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Step 3: Payment & Confirmation */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment & Confirmation</h2>

              {/* Booking Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-medium text-gray-900">{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Worker:</span>
                    <span className="font-medium text-gray-900">{selectedWorker?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date & Time:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(formData.date).toLocaleDateString()} at {formData.time}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Address:</span>
                    <span className="font-medium text-gray-900 text-right max-w-[200px]">
                      {formData.address}
                    </span>
                  </div>
                  <div className="border-t border-blue-300 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Cost:</span>
                      <span className="font-bold text-blue-600">
                        ₱{selectedService?.basePrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Payment Method <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                        className={`w-full p-4 border-2 rounded-lg transition-all text-left ${
                          formData.paymentMethod === method.id
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Icon className="w-6 h-6 text-gray-600" />
                            <div>
                              <div className="font-medium text-gray-900">{method.name}</div>
                              <div className="text-sm text-gray-500">{method.description}</div>
                            </div>
                          </div>
                          {formData.paymentMethod === method.id && (
                            <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {errors.paymentMethod && (
                  <div className="flex items-center gap-1 text-red-600 text-sm mt-2">
                    <AlertCircle className="w-4 h-4" />
                    {errors.paymentMethod}
                  </div>
                )}
              </div>

              {/* Terms Notice */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-gray-600">
                  By confirming this booking, you agree to our Terms of Service and Privacy Policy.
                  Cancellations made less than 24 hours before the scheduled time may incur charges.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1}
              className="px-6 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {step === 3 ? 'Confirm Booking' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
