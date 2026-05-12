import { useState, useEffect } from 'react';
import { MapPin, Clock, DollarSign, Phone, MessageSquare, User, CheckCircle, Navigation, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getBookingsByCustomerId } from '../services/database';
import { getServiceProviders } from '../services/database';
import { Booking } from '../types/serviceProvider';
import * as localStore from '../services/localStorage';

interface TrackMyServiceProps {
  onMessage: (workerId: string) => void;
}

export function TrackMyService({ onMessage }: TrackMyServiceProps) {
  const { user } = useAuth();
  const [activeBooking, setActiveBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchActiveBooking() {
      try {
        setLoading(true);

        // First check for simple booking from Contact form
        const simpleBooking = localStorage.getItem('currentBooking');
        if (simpleBooking) {
          try {
            const booking = JSON.parse(simpleBooking);
            setActiveBooking({
              bookingId: booking.bookingId,
              serviceType: booking.serviceType,
              scheduledDate: booking.scheduledDate,
              scheduledTime: booking.scheduledTime,
              customerAddress: booking.serviceAddress,
              serviceDescription: booking.issueDescription,
              status: booking.status || 'received',
              price: 0,
              paymentMethod: 'To be determined',
              paymentStatus: 'pending',
              worker: {
                id: 'tech-1',
                name: booking.technicianName || 'Juan Dela Cruz',
                photo: '',
                phone: '09615097697',
                specialization: 'Handyman',
                rating: 4.9
              }
            });
            setLoading(false);
            return;
          } catch (err) {
            console.error('Error parsing simple booking:', err);
          }
        }

        // Fall back to database approach if user is logged in
        if (!user) {
          setError('No active service bookings found.');
          setLoading(false);
          return;
        }

        // Try to get bookings from database
        let bookings: Booking[] = [];
        try {
          bookings = await getBookingsByCustomerId(user.id);
        } catch (err) {
          console.log('Database not available, checking localStorage');
        }

        // If no database bookings, check localStorage
        if (bookings.length === 0) {
          bookings = localStore.getBookingsByCustomerIdFromLocal(user.id);
        }

        // Filter for active bookings (pending, confirmed, in-progress)
        const activeBookings = bookings.filter(b =>
          b.status === 'pending' || b.status === 'confirmed' || b.status === 'in-progress'
        ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        if (activeBookings.length > 0) {
          const booking = activeBookings[0]; // Get most recent active booking

          // Get provider details
          const providers = await getServiceProviders();
          const provider = providers.find(p => p.id === booking.providerId);

          setActiveBooking({
            ...booking,
            worker: provider ? {
              id: provider.id,
              name: provider.fullName,
              photo: provider.profilePhoto,
              phone: provider.phone,
              specialization: provider.primarySpecialization,
              rating: provider.rating
            } : {
              id: booking.providerId,
              name: booking.providerName,
              photo: '',
              phone: '',
              specialization: 'Service Provider',
              rating: 0
            }
          });
        } else {
          setError('No active service bookings found.');
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load service tracking information.');
      } finally {
        setLoading(false);
      }
    }

    fetchActiveBooking();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading tracking information...</p>
        </div>
      </div>
    );
  }

  if (error || !activeBooking) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Track My Service</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Real-time service tracking</p>
        </div>
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-yellow-600 dark:text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {error || 'No Active Services'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You don't have any active service bookings at the moment.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Book a service to start tracking your handyman's arrival and progress.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate estimated arrival time (using scheduled time as reference)
  const scheduledTime = activeBooking.scheduledTime || '9:30 AM';
  const bookingDate = new Date(activeBooking.scheduledDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Track My Service</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">Real-time service tracking</p>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Status Banner */}
        <div className={`text-white rounded-xl p-6 shadow-lg ${
          activeBooking.status === 'confirmed' || activeBooking.status === 'assigned' ? 'bg-green-600' :
          activeBooking.status === 'in-progress' || activeBooking.status === 'enroute' ? 'bg-blue-600' :
          activeBooking.status === 'received' ? 'bg-blue-500' :
          'bg-yellow-600'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                {activeBooking.status === 'enroute' ? (
                  <Navigation className="w-6 h-6" />
                ) : (
                  <CheckCircle className="w-6 h-6" />
                )}
              </div>
              <div>
                <p className="text-sm opacity-90">
                  {activeBooking.status === 'received' ? 'Request Received' :
                   activeBooking.status === 'assigned' ? 'Technician Assigned' :
                   activeBooking.status === 'enroute' ? 'Worker Approaching' :
                   activeBooking.status === 'in-progress' ? 'Service In Progress' :
                   'Service Status'}
                </p>
                <p className="text-xl font-bold capitalize">
                  {activeBooking.status === 'received' ? 'Processing Your Request' :
                   activeBooking.status === 'assigned' ? 'Technician on the way' :
                   activeBooking.status === 'enroute' ? 'Arriving Soon' :
                   activeBooking.status.replace('-', ' ')}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">Scheduled</p>
              <p className="text-lg font-bold">{bookingDate}</p>
              <p className="text-sm font-medium">{scheduledTime}</p>
            </div>
          </div>

          {activeBooking.status === 'enroute' && (
            <div className="flex items-center gap-2 bg-white/10 rounded-lg p-3">
              <Navigation className="w-5 h-5 animate-pulse" />
              <span className="font-medium">Worker approaching...</span>
            </div>
          )}
          {activeBooking.status === 'in-progress' && (
            <div className="flex items-center gap-2 bg-white/10 rounded-lg p-3">
              <Clock className="w-5 h-5 animate-pulse" />
              <span className="font-medium">Service in progress...</span>
            </div>
          )}
        </div>

        {/* Service Details Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Service Details</h2>

          {/* Service Type */}
          <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">Service Type</p>
              <p className="font-semibold text-gray-900 dark:text-white">{activeBooking.serviceType}</p>
              {activeBooking.serviceDescription && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{activeBooking.serviceDescription}</p>
              )}
            </div>
          </div>

          {/* Service Address */}
          <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">Service Address</p>
              <p className="font-semibold text-gray-900 dark:text-white">{activeBooking.customerAddress}</p>
            </div>
          </div>

          {/* Service Fee */}
          {activeBooking.price > 0 && (
            <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">Service Fee</p>
                <p className="font-semibold text-blue-600 dark:text-blue-400 text-xl">₱{activeBooking.price?.toLocaleString()}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Payment: {activeBooking.paymentMethod} ({activeBooking.paymentStatus})</p>
              </div>
            </div>
          )}

          {/* Issue Description */}
          {activeBooking.serviceDescription && (
            <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">Issue Description</p>
                <p className="text-gray-900 dark:text-white">{activeBooking.serviceDescription}</p>
              </div>
            </div>
          )}

          {/* Schedule */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">Scheduled Date & Time</p>
              <p className="font-semibold text-gray-900 dark:text-white">{bookingDate} at {scheduledTime}</p>
            </div>
          </div>
        </div>

        {/* Worker Information Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Service Provider</h2>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              {activeBooking.worker.photo ? (
                <img
                  src={activeBooking.worker.photo}
                  alt={activeBooking.worker.name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 dark:text-white">{activeBooking.worker.name}</h3>
              <p className="text-sm text-blue-600 dark:text-blue-400">{activeBooking.worker.specialization}</p>
              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                <span className="text-yellow-500">★</span>
                <span>{activeBooking.worker.rating}</span>
              </div>
            </div>
          </div>

          {/* Contact Actions */}
          <div>
            <button
              onClick={() => onMessage(activeBooking.worker.id)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <MessageSquare className="w-5 h-5" />
              Message Worker
            </button>
          </div>
        </div>

        {/* Progress Timeline */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Service Progress</h2>

          <div className="space-y-4">
            {/* Booking Confirmed */}
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                activeBooking.status === 'pending' || activeBooking.status === 'confirmed' || activeBooking.status === 'in-progress' || activeBooking.status === 'completed'
                  ? 'bg-green-600'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}>
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className={`font-medium ${
                  activeBooking.status === 'pending' || activeBooking.status === 'confirmed' || activeBooking.status === 'in-progress' || activeBooking.status === 'completed'
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-400 dark:text-gray-500'
                }`}>Booking Confirmed</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {activeBooking.status === 'pending' ? 'Waiting for provider confirmation' : 'Your service request has been accepted'}
                </p>
              </div>
            </div>

            {/* Worker En Route */}
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                activeBooking.status === 'confirmed'
                  ? 'bg-blue-600 animate-pulse'
                  : activeBooking.status === 'in-progress' || activeBooking.status === 'completed'
                  ? 'bg-green-600'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}>
                <Navigation className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className={`font-medium ${
                  activeBooking.status === 'confirmed' || activeBooking.status === 'in-progress' || activeBooking.status === 'completed'
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-400 dark:text-gray-500'
                }`}>Worker En Route</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {activeBooking.status === 'confirmed' ? 'Provider is on the way to your location' : activeBooking.status === 'in-progress' || activeBooking.status === 'completed' ? 'Provider has arrived' : 'Pending'}
                </p>
              </div>
            </div>

            {/* Service in Progress */}
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                activeBooking.status === 'in-progress'
                  ? 'bg-blue-600 animate-pulse'
                  : activeBooking.status === 'completed'
                  ? 'bg-green-600'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}>
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className={`font-medium ${
                  activeBooking.status === 'in-progress' || activeBooking.status === 'completed'
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-400 dark:text-gray-500'
                }`}>Service In Progress</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {activeBooking.status === 'in-progress' ? 'Work is currently being performed' : activeBooking.status === 'completed' ? 'Work was completed successfully' : 'Pending'}
                </p>
              </div>
            </div>

            {/* Service Complete */}
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                activeBooking.status === 'completed'
                  ? 'bg-green-600'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}>
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className={`font-medium ${
                  activeBooking.status === 'completed'
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-400 dark:text-gray-500'
                }`}>Service Complete</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {activeBooking.status === 'completed' ? 'Service has been completed' : 'Pending'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
