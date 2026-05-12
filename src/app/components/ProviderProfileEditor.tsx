import { useState, useEffect } from 'react';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Award,
  FileText,
  Image as ImageIcon,
  Plus,
  X,
  Save,
  Trash2,
  Upload
} from 'lucide-react';
import { toast } from 'sonner';
import { ServiceProvider, Certification, License, PortfolioItem, ServiceOffered, Specialization } from '../types/serviceProvider';
import { updateServiceProvider } from '../services/database';

interface ProviderProfileEditorProps {
  provider: ServiceProvider;
  onUpdate: (updated: ServiceProvider) => void;
  onCancel: () => void;
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

export function ProviderProfileEditor({ provider, onUpdate, onCancel }: ProviderProfileEditorProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'services' | 'credentials' | 'portfolio'>('basic');
  const [isSaving, setIsSaving] = useState(false);

  // Basic Info
  const [fullName, setFullName] = useState(provider.fullName);
  const [email, setEmail] = useState(provider.email);
  const [phone, setPhone] = useState(provider.phone);
  const [bio, setBio] = useState(provider.bio);
  const [primarySpecialization, setPrimarySpecialization] = useState(provider.primarySpecialization);
  const [secondarySkills, setSecondarySkills] = useState<Specialization[]>(provider.secondarySkills || []);
  const [yearsOfExperience, setYearsOfExperience] = useState(provider.yearsOfExperience);
  const [serviceAreas, setServiceAreas] = useState<string[]>(provider.serviceAreas);
  const [city, setCity] = useState(provider.location.city);

  // Services
  const [servicesOffered, setServicesOffered] = useState<ServiceOffered[]>(provider.servicesOffered);

  // Credentials
  const [certifications, setCertifications] = useState<Certification[]>(provider.certifications);
  const [licenses, setLicenses] = useState<License[]>(provider.licenses);
  const [trainingBackground, setTrainingBackground] = useState<string[]>(provider.trainingBackground);

  // Portfolio
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(provider.portfolio);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updates: Partial<ServiceProvider> = {
        fullName,
        email,
        phone,
        bio,
        primarySpecialization,
        secondarySkills,
        yearsOfExperience,
        serviceAreas,
        location: { city, region: 'NCR' },
        servicesOffered,
        certifications,
        licenses,
        trainingBackground,
        portfolio,
        priceRange: {
          min: Math.min(...servicesOffered.map(s => s.basePrice)),
          max: Math.max(...servicesOffered.map(s => s.basePrice))
        },
        startingRate: Math.min(...servicesOffered.map(s => s.basePrice))
      };

      const updated = await updateServiceProvider(provider.id, updates);
      toast.success('Profile updated successfully!');
      onUpdate(updated);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  // Service management
  const addService = () => {
    setServicesOffered([...servicesOffered, {
      id: `service-${Date.now()}`,
      name: '',
      description: '',
      basePrice: 0,
      estimatedDuration: ''
    }]);
  };

  const updateService = (index: number, field: keyof ServiceOffered, value: any) => {
    const updated = [...servicesOffered];
    updated[index] = { ...updated[index], [field]: value };
    setServicesOffered(updated);
  };

  const removeService = (index: number) => {
    setServicesOffered(servicesOffered.filter((_, i) => i !== index));
  };

  // Certification management
  const addCertification = () => {
    setCertifications([...certifications, {
      id: `cert-${Date.now()}`,
      name: '',
      issuedBy: '',
      dateIssued: ''
    }]);
  };

  const updateCertification = (index: number, field: keyof Certification, value: any) => {
    const updated = [...certifications];
    updated[index] = { ...updated[index], [field]: value };
    setCertifications(updated);
  };

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  // License management
  const addLicense = () => {
    setLicenses([...licenses, {
      id: `lic-${Date.now()}`,
      type: '',
      number: '',
      issuedBy: '',
      dateIssued: '',
      verified: false
    }]);
  };

  const updateLicense = (index: number, field: keyof License, value: any) => {
    const updated = [...licenses];
    updated[index] = { ...updated[index], [field]: value };
    setLicenses(updated);
  };

  const removeLicense = (index: number) => {
    setLicenses(licenses.filter((_, i) => i !== index));
  };

  // Portfolio management
  const addPortfolioItem = () => {
    setPortfolio([...portfolio, {
      id: `port-${Date.now()}`,
      title: '',
      description: '',
      imageUrl: '',
      completedDate: ''
    }]);
  };

  const updatePortfolioItem = (index: number, field: keyof PortfolioItem, value: any) => {
    const updated = [...portfolio];
    updated[index] = { ...updated[index], [field]: value };
    setPortfolio(updated);
  };

  const removePortfolioItem = (index: number) => {
    setPortfolio(portfolio.filter((_, i) => i !== index));
  };

  // Training background management
  const addTraining = () => {
    setTrainingBackground([...trainingBackground, '']);
  };

  const updateTraining = (index: number, value: string) => {
    const updated = [...trainingBackground];
    updated[index] = value;
    setTrainingBackground(updated);
  };

  const removeTraining = (index: number) => {
    setTrainingBackground(trainingBackground.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Profile</h1>
              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 px-6">
            <button
              onClick={() => setActiveTab('basic')}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === 'basic'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Basic Info
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === 'services'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Services
            </button>
            <button
              onClick={() => setActiveTab('credentials')}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === 'credentials'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Credentials
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === 'portfolio'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Portfolio
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Briefcase className="w-4 h-4 inline mr-1" />
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      value={yearsOfExperience}
                      onChange={(e) => setYearsOfExperience(parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Primary Specialization
                    </label>
                    <select
                      value={primarySpecialization}
                      onChange={(e) => setPrimarySpecialization(e.target.value as Specialization)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      {specializations.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      City
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      {metroManilaAreas.map(area => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Tell customers about your experience and expertise..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Service Areas (Select all areas you serve)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-3">
                    {metroManilaAreas.map(area => (
                      <label key={area} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={serviceAreas.includes(area)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setServiceAreas([...serviceAreas, area]);
                            } else {
                              setServiceAreas(serviceAreas.filter(a => a !== area));
                            }
                          }}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-700 dark:text-gray-300">{area}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Services Offered</h3>
                  <button
                    onClick={addService}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Service
                  </button>
                </div>

                {servicesOffered.map((service, index) => (
                  <div key={service.id} className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">Service {index + 1}</h4>
                      <button
                        onClick={() => removeService(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Service Name
                        </label>
                        <input
                          type="text"
                          value={service.name}
                          onChange={(e) => updateService(index, 'name', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Base Price (₱)
                        </label>
                        <input
                          type="number"
                          value={service.basePrice}
                          onChange={(e) => updateService(index, 'basePrice', parseFloat(e.target.value))}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Estimated Duration
                        </label>
                        <input
                          type="text"
                          value={service.estimatedDuration}
                          onChange={(e) => updateService(index, 'estimatedDuration', e.target.value)}
                          placeholder="e.g., 2-3 hours"
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
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {servicesOffered.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No services added yet. Click "Add Service" to get started.
                  </div>
                )}
              </div>
            )}

            {/* Credentials Tab */}
            {activeTab === 'credentials' && (
              <div className="space-y-6">
                {/* Certifications */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Certifications
                    </h3>
                    <button
                      onClick={addCertification}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>

                  {certifications.map((cert, index) => (
                    <div key={cert.id} className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="font-medium text-gray-900 dark:text-white">Certification {index + 1}</h4>
                        <button
                          onClick={() => removeCertification(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Certification Name
                          </label>
                          <input
                            type="text"
                            value={cert.name}
                            onChange={(e) => updateCertification(index, 'name', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Issued By
                          </label>
                          <input
                            type="text"
                            value={cert.issuedBy}
                            onChange={(e) => updateCertification(index, 'issuedBy', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Date Issued
                          </label>
                          <input
                            type="date"
                            value={cert.dateIssued}
                            onChange={(e) => updateCertification(index, 'dateIssued', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Licenses */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Licenses
                    </h3>
                    <button
                      onClick={addLicense}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>

                  {licenses.map((license, index) => (
                    <div key={license.id} className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="font-medium text-gray-900 dark:text-white">License {index + 1}</h4>
                        <button
                          onClick={() => removeLicense(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            License Type
                          </label>
                          <input
                            type="text"
                            value={license.type}
                            onChange={(e) => updateLicense(index, 'type', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            License Number
                          </label>
                          <input
                            type="text"
                            value={license.number}
                            onChange={(e) => updateLicense(index, 'number', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Issued By
                          </label>
                          <input
                            type="text"
                            value={license.issuedBy}
                            onChange={(e) => updateLicense(index, 'issuedBy', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Date Issued
                          </label>
                          <input
                            type="date"
                            value={license.dateIssued}
                            onChange={(e) => updateLicense(index, 'dateIssued', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Training Background */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Training Background</h3>
                    <button
                      onClick={addTraining}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>

                  {trainingBackground.map((training, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="text"
                        value={training}
                        onChange={(e) => updateTraining(index, e.target.value)}
                        placeholder="Training or course name"
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                      <button
                        onClick={() => removeTraining(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Portfolio Tab */}
            {activeTab === 'portfolio' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Portfolio
                  </h3>
                  <button
                    onClick={addPortfolioItem}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Project
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {portfolio.map((item, index) => (
                    <div key={item.id} className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="font-medium text-gray-900 dark:text-white">Project {index + 1}</h4>
                        <button
                          onClick={() => removePortfolioItem(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Project Title
                          </label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => updatePortfolioItem(index, 'title', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Image URL
                          </label>
                          <input
                            type="text"
                            value={item.imageUrl}
                            onChange={(e) => updatePortfolioItem(index, 'imageUrl', e.target.value)}
                            placeholder="https://..."
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description
                          </label>
                          <textarea
                            value={item.description}
                            onChange={(e) => updatePortfolioItem(index, 'description', e.target.value)}
                            rows={2}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Completion Date
                          </label>
                          <input
                            type="date"
                            value={item.completedDate}
                            onChange={(e) => updatePortfolioItem(index, 'completedDate', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-40 object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                            }}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {portfolio.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No portfolio items yet. Click "Add Project" to showcase your work.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
