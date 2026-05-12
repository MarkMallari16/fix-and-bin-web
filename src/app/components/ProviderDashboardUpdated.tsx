import { useState, useEffect } from 'react';
import {
  DollarSign,
  CheckCircle,
  Star,
  Clock,
  Calendar,
  User,
  Phone,
  MapPin,
  TrendingUp,
  Award,
  Edit,
  X,
  Check,
  Briefcase,
  Package
} from 'lucide-react';
import { toast } from 'sonner';
import { ServiceProvider, Booking } from '../types/serviceProvider';
import { getBookingsByProviderId, updateBookingStatus, getServiceProviderByUserId } from '../services/database';
import { useAuth } from '../contexts/AuthContext';
import { ProviderProfileEditor } from './ProviderProfileEditor';
import { ProviderProfileSetup } from './ProviderProfileSetup';

interface ProviderDashboardUpdatedProps {
  onNavigateToMessages?: () => void;
}

export function ProviderDashboardUpdated({ onNavigateToMessages }: ProviderDashboardUpdatedProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'earnings' | 'profile'>('overview');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [provider, setProvider] = useState<ServiceProvider | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);

  useEffect(() => {
    if (user) {
      loadProviderData();
    }
  }, [user]);

  const loadProviderData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Get provider profile
      const providerData = await getServiceProviderByUserId(user.id);
      if (providerData) {
        // Check if profile is incomplete (no services, no phone, etc.)
        const isIncomplete = !providerData.servicesOffered?.length ||
                            !providerData.phone ||
                            !providerData.bio;

        if (isIncomplete) {
          setNeedsProfileSetup(true);
          setProvider(providerData);
        } else {
          setProvider(providerData);
          // Get bookings - check both database and localStorage
          const bookingsData = await getBookingsByProviderId(providerData.id);

          // Also get localStorage bookings in case of mock provider
          const localBookings = await import('../services/localStorage').then(m =>
            m.getBookingsByProviderIdFromLocal(providerData.id)
          );

          // Combine and deduplicate bookings
          const allBookings = [...bookingsData, ...localBookings];
          const uniqueBookings = allBookings.filter((booking, index, self) =>
            index === self.findIndex((b) => b.id === booking.id)
          );

          setBookings(uniqueBookings);
        }
      } else {
        // No provider profile exists - show setup
        setNeedsProfileSetup(true);
      }
    } catch (error) {
      console.error('Error loading provider data:', error);
      setNeedsProfileSetup(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptBooking = async (bookingId: string) => {
    try {
      await updateBookingStatus(bookingId, 'accepted');
      toast.success('Booking accepted!');
      loadProviderData(); // Reload to get updated data
    } catch (error) {
      console.error('Error accepting booking:', error);
      toast.error('Failed to accept booking');
    }
  };

  const handleRejectBooking = async (bookingId: string) => {
    try {
      await updateBookingStatus(bookingId, 'rejected');
      toast.success('Booking rejected');
      loadProviderData();
    } catch (error) {
      console.error('Error rejecting booking:', error);
      toast.error('Failed to reject booking');
    }
  };

  const handleCompleteBooking = async (bookingId: string) => {
    try {
      await updateBookingStatus(bookingId, 'completed');
      toast.success('Booking marked as completed!');
      loadProviderData();
    } catch (error) {
      console.error('Error completing booking:', error);
      toast.error('Failed to complete booking');
    }
  };

  const handleProfileUpdate = (updated: ServiceProvider) => {
    setProvider(updated);
    setIsEditingProfile(false);
    setNeedsProfileSetup(false);
    toast.success('Profile updated successfully!');
    loadProviderData(); // Reload to get bookings
  };

  const handleProfileSetupComplete = (newProvider: ServiceProvider) => {
    setProvider(newProvider);
    setNeedsProfileSetup(false);
    loadProviderData(); // Reload to get bookings
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show profile setup if needed
  if (needsProfileSetup) {
    return (
      <ProviderProfileSetup
        onComplete={handleProfileSetupComplete}
        existingProvider={provider}
      />
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">Setting up your provider profile...</p>
          <button
            onClick={() => setNeedsProfileSetup(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Complete Profile Setup
          </button>
        </div>
      </div>
    );
  }

  if (isEditingProfile) {
    return (
      <ProviderProfileEditor
        provider={provider}
        onUpdate={handleProfileUpdate}
        onCancel={() => setIsEditingProfile(false)}
      />
    );
  }

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const acceptedBookings = bookings.filter(b => b.status === 'accepted' || b.status === 'in-progress');
  const completedBookings = bookings.filter(b => b.status === 'completed');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{provider.fullName}</h1>
                <p className="text-gray-600 dark:text-gray-400">{provider.primarySpecialization}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-yellow-500" />
                    <span className="font-semibold text-gray-900 dark:text-white">{provider.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {provider.completedJobs} jobs completed
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsEditingProfile(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">₱{provider.totalEarnings.toLocaleString()}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Earnings</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{provider.completedJobs}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Completed Jobs</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{provider.rating.toFixed(1)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Average Rating</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingBookings.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Pending Requests</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="flex border-b border-gray-200 dark:border-gray-700 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === 'bookings'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Bookings {pendingBookings.length > 0 && (
                <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                  {pendingBookings.length}
                </span>
              )}
            </button>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Welcome Message for New Providers */}
                {completedBookings.length === 0 && pendingBookings.length === 0 && (
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Star className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          Welcome to FIX&BIN! 🎉
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Your profile is now live! Customers can now find and book your services. Here's what happens next:
                        </p>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Customers browse and find your profile
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Booking requests appear in your dashboard
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Accept jobs and start earning
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Active Jobs</h3>
                  {acceptedBookings.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 dark:text-gray-400 mb-2">No active jobs at the moment</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        Pending requests will appear in the Bookings tab
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {acceptedBookings.slice(0, 3).map((booking) => (
                        <div key={booking.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">{booking.serviceType}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{booking.customerName}</p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(booking.scheduledDate).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {booking.scheduledTime}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleCompleteBooking(booking.id)}
                              className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                            >
                              Mark Complete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                {/* Pending Requests */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Pending Requests ({pendingBookings.length})
                  </h3>
                  {pendingBookings.length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-400 text-center py-8">No pending requests</p>
                  ) : (
                    <div className="space-y-3">
                      {pendingBookings.map((booking) => (
                        <div key={booking.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 dark:text-white">{booking.serviceType}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{booking.serviceDescription}</p>
                            </div>
                            <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                              ₱{booking.price.toLocaleString()}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <User className="w-4 h-4" />
                              {booking.customerName}
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <Phone className="w-4 h-4" />
                              {booking.customerPhone}
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <Calendar className="w-4 h-4" />
                              {new Date(booking.scheduledDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <Clock className="w-4 h-4" />
                              {booking.scheduledTime}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mb-3 text-sm text-gray-600 dark:text-gray-400">
                            <MapPin className="w-4 h-4" />
                            {booking.customerAddress}
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleAcceptBooking(booking.id)}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              <Check className="w-4 h-4" />
                              Accept
                            </button>
                            <button
                              onClick={() => handleRejectBooking(booking.id)}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                              <X className="w-4 h-4" />
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Accepted/Active Jobs */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Active Jobs ({acceptedBookings.length})
                  </h3>
                  {acceptedBookings.length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-400 text-center py-8">No active jobs</p>
                  ) : (
                    <div className="space-y-3">
                      {acceptedBookings.map((booking) => (
                        <div key={booking.id} className="border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">{booking.serviceType}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{booking.customerName}</p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(booking.scheduledDate).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {booking.scheduledTime}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {booking.customerAddress}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleCompleteBooking(booking.id)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                            >
                              Mark Complete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Completed Jobs */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Completed Jobs ({completedBookings.length})
                  </h3>
                  {completedBookings.length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-400 text-center py-8">No completed jobs yet</p>
                  ) : (
                    <div className="space-y-3">
                      {completedBookings.slice(0, 5).map((booking) => (
                        <div key={booking.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 opacity-75">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">{booking.serviceType}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{booking.customerName}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {new Date(booking.scheduledDate).toLocaleDateString()}
                              </p>
                            </div>
                            <span className="text-green-600 dark:text-green-400 font-semibold">
                              ₱{booking.price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
