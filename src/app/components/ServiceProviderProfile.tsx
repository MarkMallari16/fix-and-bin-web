import { useState } from 'react';
import {
  Star,
  MapPin,
  Briefcase,
  Award,
  CheckCircle,
  Calendar,
  DollarSign,
  MessageSquare,
  Phone,
  Shield,
  TrendingUp,
  BadgeCheck
} from 'lucide-react';
import { ServiceProvider } from '../types/serviceProvider';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ServiceProviderProfileProps {
  provider: ServiceProvider;
  onBook: () => void;
  onMessage: () => void;
}

export function ServiceProviderProfile({ provider, onBook, onMessage }: ServiceProviderProfileProps) {
  const [activeTab, setActiveTab] = useState<'about' | 'services' | 'portfolio' | 'reviews'>('about');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Photo */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                  {provider.profilePhoto ? (
                    <ImageWithFallback
                      src={provider.profilePhoto}
                      alt={provider.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400">
                      {provider.fullName.charAt(0)}
                    </div>
                  )}
                </div>
                {provider.isVerified && (
                  <div className="absolute -bottom-2 -right-2 bg-blue-600 rounded-full p-2">
                    <BadgeCheck className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
            </div>

            {/* Provider Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">{provider.fullName}</h1>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {provider.primarySpecialization}
                    </span>
                    {provider.isTopRated && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Top Rated
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-1 text-yellow-500 mb-1">
                    <Star className="w-5 h-5 fill-yellow-500" />
                    <span className="font-bold text-gray-900">{provider.rating.toFixed(1)}</span>
                  </div>
                  <p className="text-xs text-gray-500">{provider.totalReviews} reviews</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-bold text-gray-900">{provider.completedJobs}</span>
                  </div>
                  <p className="text-xs text-gray-500">Jobs completed</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <Briefcase className="w-5 h-5 text-blue-500" />
                    <span className="font-bold text-gray-900">{provider.yearsOfExperience} yrs</span>
                  </div>
                  <p className="text-xs text-gray-500">Experience</p>
                </div>
              </div>

              {/* Location & Price */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{provider.location.city}, {provider.location.region}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  <span>Starting at ₱{provider.startingRate.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onBook}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  Book Service
                </button>
                <button
                  onClick={onMessage}
                  className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  Message
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <div className="flex">
              {[
                { id: 'about', label: 'About' },
                { id: 'services', label: 'Services' },
                { id: 'portfolio', label: 'Portfolio' },
                { id: 'reviews', label: 'Reviews' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-4 font-medium transition-colors relative ${
                    activeTab === tab.id
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* About Tab */}
            {activeTab === 'about' && (
              <div className="space-y-6">
                {/* Bio */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">About</h3>
                  <p className="text-gray-700">{provider.bio}</p>
                </div>

                {/* Secondary Skills */}
                {provider.secondarySkills && provider.secondarySkills.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Additional Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {provider.secondarySkills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certifications */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-600" />
                    Certifications
                  </h3>
                  <div className="space-y-3">
                    {provider.certifications.map((cert) => (
                      <div key={cert.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Award className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{cert.name}</h4>
                          <p className="text-sm text-gray-600">{cert.issuedBy}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Issued: {new Date(cert.dateIssued).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Licenses */}
                {provider.licenses.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      Licenses
                    </h3>
                    <div className="space-y-3">
                      {provider.licenses.map((license) => (
                        <div key={license.id} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Shield className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-gray-900">{license.type}</h4>
                              {license.verified && (
                                <span className="px-2 py-0.5 bg-green-600 text-white text-xs rounded-full flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  Verified
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">License #{license.number}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Valid until: {license.expiryDate ? new Date(license.expiryDate).toLocaleDateString() : 'No expiry'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Training Background */}
                {provider.trainingBackground.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Training Background</h3>
                    <ul className="space-y-2">
                      {provider.trainingBackground.map((training, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {training}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Service Areas */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Service Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {provider.serviceAreas.map((area) => (
                      <span
                        key={area}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm flex items-center gap-1"
                      >
                        <MapPin className="w-3 h-3" />
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 mb-4">Services Offered</h3>
                {provider.servicesOffered.map((service) => (
                  <div key={service.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{service.name}</h4>
                      <span className="text-blue-600 font-semibold">₱{service.basePrice.toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                    <p className="text-xs text-gray-500">Estimated duration: {service.estimatedDuration}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Portfolio Tab */}
            {activeTab === 'portfolio' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 mb-4">Previous Work</h3>
                {provider.portfolio.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {provider.portfolio.map((item) => (
                      <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <div className="aspect-video bg-gray-200">
                          <ImageWithFallback
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                          <p className="text-xs text-gray-500">
                            Completed: {new Date(item.completedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No portfolio items yet</p>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-gray-900">Customer Reviews</h3>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                    <span className="font-bold text-gray-900">{provider.rating.toFixed(1)}</span>
                    <span className="text-gray-500 text-sm">({provider.totalReviews} reviews)</span>
                  </div>
                </div>

                {provider.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {provider.reviews.map((review) => (
                      <div key={review.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">{review.customerName}</h4>
                            <p className="text-sm text-gray-500">{review.jobType}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? 'fill-yellow-500 text-yellow-500'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 mb-2">{review.comment}</p>
                        <p className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No reviews yet</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
