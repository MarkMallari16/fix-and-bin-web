import { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Upload,
  FileText,
  CheckCircle,
  Calendar,
  Award,
  Tool
} from 'lucide-react';
import { toast } from 'sonner';

export function WorkerApplication() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    birthday: '',

    // Professional Information
    specialty: '',
    experience: '',
    certifications: '',
    availability: [] as string[],

    // Additional Information
    previousWork: '',
    references: '',
    whyJoin: '',

    // Documents
    idDocument: null as File | null,
    certificationDocs: null as File | null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const specialties = [
    'Plumber',
    'Electrician',
    'Carpenter',
    'HVAC Technician',
    'Painter',
    'Mason',
    'Welder',
    'General Handyman',
    'Other'
  ];

  const experienceLevels = [
    'Less than 1 year',
    '1-3 years',
    '3-5 years',
    '5-10 years',
    'More than 10 years'
  ];

  const availabilityOptions = [
    'Monday - Friday',
    'Weekends',
    'Evenings',
    'Emergency Calls',
    'Flexible Schedule'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, [fieldName]: file }));
    }
  };

  const handleAvailabilityChange = (option: string) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.includes(option)
        ? prev.availability.filter(item => item !== option)
        : [...prev.availability, option]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast.success('Application submitted successfully!', {
        description: 'We will review your application and contact you within 3-5 business days.'
      });
    }, 2000);
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const isStep1Valid = () => {
    return formData.fullName && formData.email && formData.phone && formData.address && formData.city && formData.birthday;
  };

  const isStep2Valid = () => {
    return formData.specialty && formData.experience && formData.availability.length > 0;
  };

  if (submitted) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
            <p className="text-lg text-gray-600 mb-6">
              Thank you for applying to become a FIX&BIN worker. We have received your application and will review it carefully.
            </p>
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-2">What's Next?</h3>
              <ul className="text-left text-gray-700 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Our team will review your application within 3-5 business days</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>You will receive an email confirmation at {formData.email}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>We may contact you for an interview or additional information</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Back to Home
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Apply to Become a Worker</h1>
          <p className="text-lg text-gray-600">Join the FIX&BIN team and start earning today!</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    s === step
                      ? 'bg-blue-600 text-white'
                      : s < step
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {s < step ? <CheckCircle className="w-6 h-6" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-16 sm:w-24 h-1 ${
                      s < step ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span className="text-center w-32">Personal Info</span>
            <span className="text-center w-32">Professional</span>
            <span className="text-center w-32">Review</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-6">
                  <User className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Juan Dela Cruz"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="juan@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+63 912 345 6789"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Complete Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123 Main Street, Barangay Example"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Manila"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      name="birthday"
                      value={formData.birthday}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Professional Information */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-6">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Professional Information</h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Specialty *
                  </label>
                  <select
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a specialty</option>
                    {specialties.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience *
                  </label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select experience level</option>
                    {experienceLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certifications (Optional)
                  </label>
                  <textarea
                    name="certifications"
                    value={formData.certifications}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="List any relevant certifications, licenses, or training"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Availability *
                  </label>
                  <div className="space-y-2">
                    {availabilityOptions.map(option => (
                      <label key={option} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.availability.includes(option)}
                          onChange={() => handleAvailabilityChange(option)}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Previous Work Experience
                  </label>
                  <textarea
                    name="previousWork"
                    value={formData.previousWork}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Describe your previous work experience and notable projects"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload ID Document *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      id="idDocument"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange(e, 'idDocument')}
                      className="hidden"
                    />
                    <label htmlFor="idDocument" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {formData.idDocument ? formData.idDocument.name : 'Click to upload valid ID'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, or PDF (max 5MB)</p>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Review and Submit */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-6">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Review & Additional Information</h2>
                </div>

                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Application Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Full Name</p>
                      <p className="font-medium text-gray-900">{formData.fullName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{formData.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Phone</p>
                      <p className="font-medium text-gray-900">{formData.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Specialty</p>
                      <p className="font-medium text-gray-900">{formData.specialty}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Experience</p>
                      <p className="font-medium text-gray-900">{formData.experience}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">ID Document</p>
                      <p className="font-medium text-gray-900">{formData.idDocument ? '✓ Uploaded' : '✗ Not uploaded'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professional References (Optional)
                  </label>
                  <textarea
                    name="references"
                    value={formData.references}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Names and contact information of professional references"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Why do you want to join FIX&BIN? *
                  </label>
                  <textarea
                    name="whyJoin"
                    value={formData.whyJoin}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Tell us why you want to become a FIX&BIN worker"
                    required
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Important:</strong> By submitting this application, you confirm that all information provided is accurate and complete. False information may result in rejection or termination.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Previous
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={step === 1 ? !isStep1Valid() : !isStep2Valid()}
                  className="ml-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.whyJoin}
                  className="ml-auto px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Submit Application
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
