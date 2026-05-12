import { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Star,
  MapPin,
  Briefcase,
  DollarSign,
  BadgeCheck,
  TrendingUp,
  Filter
} from 'lucide-react';
import { ServiceProvider, Specialization } from '../types/serviceProvider';
import { getServiceProviders } from '../services/database';
import { mockProviders } from '../data/mockProviders';

interface ServiceProvidersProps {
  onSelectProvider: (providerId: string) => void;
  onMessage: (providerId: string) => void;
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

export function ServiceProviders({ onSelectProvider, onMessage }: ServiceProvidersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'price'>('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch providers from database
  useEffect(() => {
    async function loadProviders() {
      setIsLoading(true);
      try {
        const dbProviders = await getServiceProviders({ status: 'approved' });

        // If database has providers, use them + mock providers
        // If database is empty (not set up yet), use only mock providers
        if (dbProviders && dbProviders.length > 0) {
          setProviders([...dbProviders, ...mockProviders.filter(p => p.status === 'approved')]);
        } else {
          console.log('Using mock providers (database not set up yet)');
          setProviders(mockProviders.filter(p => p.status === 'approved'));
        }
      } catch (error) {
        console.error('Error loading providers, using mock data:', error);
        // Fallback to mock providers
        setProviders(mockProviders.filter(p => p.status === 'approved'));
      } finally {
        setIsLoading(false);
      }
    }
    loadProviders();
  }, []);

  const approvedProviders = providers;

  // Filter and sort providers
  const filteredProviders = useMemo(() => {
    let providers = approvedProviders;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      providers = providers.filter(
        (p) =>
          p.fullName.toLowerCase().includes(query) ||
          p.primarySpecialization.toLowerCase().includes(query) ||
          p.bio.toLowerCase().includes(query) ||
          p.serviceAreas.some((area) => area.toLowerCase().includes(query))
      );
    }

    // Filter by specialization
    if (selectedSpecialization !== 'all') {
      providers = providers.filter(
        (p) =>
          p.primarySpecialization === selectedSpecialization ||
          p.secondarySkills?.includes(selectedSpecialization as Specialization)
      );
    }

    // Filter by location
    if (selectedLocation !== 'all') {
      providers = providers.filter((p) =>
        p.serviceAreas.includes(selectedLocation)
      );
    }

    // Sort providers
    providers.sort((a, b) => {
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      } else if (sortBy === 'experience') {
        return b.yearsOfExperience - a.yearsOfExperience;
      } else {
        return a.startingRate - b.startingRate;
      }
    });

    return providers;
  }, [approvedProviders, searchQuery, selectedSpecialization, selectedLocation, sortBy]);

  // Get unique service areas
  const serviceAreas = useMemo(() => {
    const areas = new Set<string>();
    approvedProviders.forEach((p) => p.serviceAreas.forEach((area) => areas.add(area)));
    return Array.from(areas).sort();
  }, [approvedProviders]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Service Providers
          </h1>
          <p className="text-gray-600">
            Browse verified professionals for your home service needs
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, specialty, or location..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Filter Toggle (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Filters */}
          <div className={`mt-4 grid md:grid-cols-3 gap-4 ${showFilters ? 'block' : 'hidden md:grid'}`}>
            {/* Specialization Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialization
              </label>
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">All Specializations</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Area
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">All Locations</option>
                {serviceAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="rating">Highest Rated</option>
                <option value="experience">Most Experienced</option>
                <option value="price">Lowest Price</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600 text-sm">
            {filteredProviders.length} provider{filteredProviders.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Provider Cards */}
        {filteredProviders.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((provider) => (
              <div
                key={provider.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-gray-200 cursor-pointer"
                onClick={() => onSelectProvider(provider.id)}
              >
                {/* Card Header */}
                <div className="p-6">
                  {/* Profile Photo */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                        {provider.profilePhoto ? (
                          <img
                            src={provider.profilePhoto}
                            alt={provider.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">
                            {provider.fullName.charAt(0)}
                          </div>
                        )}
                      </div>
                      {provider.isVerified && (
                        <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1">
                          <BadgeCheck className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Badges */}
                    <div className="flex flex-col gap-1 items-end">
                      {provider.isTopRated && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          Top Rated
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Provider Info */}
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {provider.fullName}
                  </h3>
                  <p className="text-sm text-blue-600 font-medium mb-3">
                    {provider.primarySpecialization}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      <span className="font-medium text-gray-900">{provider.rating.toFixed(1)}</span>
                      <span className="text-gray-500">({provider.totalReviews})</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Briefcase className="w-4 h-4" />
                      <span>{provider.yearsOfExperience} yrs</span>
                    </div>
                  </div>

                  {/* Bio Preview */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {provider.bio}
                  </p>

                  {/* Location & Price */}
                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex items-center gap-1 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{provider.location.city}</span>
                    </div>
                    <div className="flex items-center gap-1 text-blue-600 font-semibold">
                      <DollarSign className="w-4 h-4" />
                      <span>₱{provider.startingRate.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Completed Jobs */}
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                    <span className="font-medium text-gray-900">{provider.completedJobs}</span>
                    <span>jobs completed</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProvider(provider.id);
                      }}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMessage(provider.id);
                      }}
                      className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      Message
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-3">
              <Search className="w-16 h-16 mx-auto mb-4" />
            </div>
            <p className="text-gray-600 text-lg font-medium mb-1">No providers found</p>
            <p className="text-gray-500 text-sm">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
