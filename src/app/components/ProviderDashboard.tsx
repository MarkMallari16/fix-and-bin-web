import { useState } from 'react';
import {
  DollarSign,
  Briefcase,
  Star,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  X,
  User,
  Award,
  Image as ImageIcon,
  Plus
} from 'lucide-react';
import { ServiceProvider, Booking } from '../types/serviceProvider';
import { toast } from 'sonner';

interface ProviderDashboardProps {
  provider: ServiceProvider;
  onNavigateToMessages: () => void;
}

// Mock bookings data
const mockBookings: Booking[] = [
  {
    id: 'booking-1',
    customerId: 'cust-1',
    customerName: 'Maria Santos',
    customerPhone: '+63 917 111 2222',
    customerAddress: '123 Main St, Manila',
    providerId: 'provider-1',
    providerName: 'Carlos Mendoza',
    serviceType: 'Electrical Wiring',
    serviceDescription: 'Install new electrical outlets in kitchen',
    scheduledDate: '2024-12-05',
    scheduledTime: '09:00',
    status: 'pending',
    price: 3500,
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    createdAt: '2024-12-01',
    updatedAt: '2024-12-01'
  },
  {
    id: 'booking-2',
    customerId: 'cust-2',
    customerName: 'John Reyes',
    customerPhone: '+63 918 333 4444',
    customerAddress: '456 Oak Ave, Quezon City',
    providerId: 'provider-1',
    providerName: 'Carlos Mendoza',
    serviceType: 'Circuit Breaker Repair',
    serviceDescription: 'Fix tripping circuit breaker in bedroom',
    scheduledDate: '2024-12-03',
    scheduledTime: '14:00',
    status: 'accepted',
    price: 1500,
    paymentMethod: 'gcash',
    paymentStatus: 'pending',
    createdAt: '2024-11-28',
    updatedAt: '2024-11-29'
  }
];

export function ProviderDashboard({ provider, onNavigateToMessages }: ProviderDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'earnings' | 'profile'>('overview');
  const [bookings] = useState<Booking[]>(mockBookings);

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const acceptedBookings = bookings.filter(b => b.status === 'accepted' || b.status === 'in-progress');
  const completedBookings = bookings.filter(b => b.status === 'completed');

  const thisMonthEarnings = 45000;
  const pendingPayouts = 8500;

  const handleAcceptBooking = (bookingId: string) => {
    toast.success('Booking accepted successfully!');
  };

  const handleRejectBooking = (bookingId: string) => {
    toast.error('Booking rejected');
  };

  const handleCompleteBooking = (bookingId: string) => {
    toast.success('Job marked as completed!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {provider.fullName.split(' ')[0]}!
          </h1>
          <p className="text-gray-600">Manage your bookings and track your earnings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">This Month</h3>
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">₱{thisMonthEarnings.toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +12% from last month
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Completed Jobs</h3>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{provider.completedJobs}</p>
            <p className="text-xs text-gray-500 mt-1">Total jobs completed</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-600">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Rating</h3>
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{provider.rating.toFixed(1)}</p>
            <p className="text-xs text-gray-500 mt-1">{provider.totalReviews} reviews</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-600">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Pending Bookings</h3>
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{pendingBookings.length}</p>
            <p className="text-xs text-gray-500 mt-1">Awaiting your response</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <div className="flex">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'bookings', label: 'Bookings' },
                { id: 'earnings', label: 'Earnings' },
                { id: 'profile', label: 'Profile' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-4 font-medium transition-colors relative ${
                    activeTab === tab.id ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
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
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>

                {/* Pending Bookings */}
                {pendingBookings.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Pending Bookings ({pendingBookings.length})
                    </h4>
                    <div className="space-y-3">
                      {pendingBookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h5 className="font-medium text-gray-900">{booking.serviceType}</h5>
                              <p className="text-sm text-gray-600">{booking.customerName}</p>
                            </div>
                            <span className="text-blue-600 font-semibold">
                              ₱{booking.price.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{booking.serviceDescription}</p>
                          <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                            <span>📅 {new Date(booking.scheduledDate).toLocaleDateString()}</span>
                            <span>⏰ {booking.scheduledTime}</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAcceptBooking(booking.id)}
                              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleRejectBooking(booking.id)}
                              className="flex-1 bg-white text-red-600 border border-red-300 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upcoming Jobs */}
                {acceptedBookings.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Upcoming Jobs ({acceptedBookings.length})
                    </h4>
                    <div className="space-y-3">
                      {acceptedBookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="p-4 bg-blue-50 border border-blue-200 rounded-lg"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h5 className="font-medium text-gray-900">{booking.serviceType}</h5>
                              <p className="text-sm text-gray-600">{booking.customerName}</p>
                              <p className="text-xs text-gray-500 mt-1">{booking.customerAddress}</p>
                            </div>
                            <span className="text-blue-600 font-semibold">
                              ₱{booking.price.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                            <span>📅 {new Date(booking.scheduledDate).toLocaleDateString()}</span>
                            <span>⏰ {booking.scheduledTime}</span>
                          </div>
                          <button
                            onClick={() => handleCompleteBooking(booking.id)}
                            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                          >
                            Mark as Completed
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <h3 className="font-semibold text-gray-900">All Bookings</h3>
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{booking.serviceType}</h4>
                          <p className="text-sm text-gray-600">{booking.customerName}</p>
                          <p className="text-xs text-gray-500 mt-1">{booking.customerAddress}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-blue-600 font-semibold">₱{booking.price.toLocaleString()}</p>
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                              booking.status === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : booking.status === 'accepted' || booking.status === 'in-progress'
                                ? 'bg-blue-100 text-blue-700'
                                : booking.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span>📅 {new Date(booking.scheduledDate).toLocaleDateString()}</span>
                        <span>⏰ {booking.scheduledTime}</span>
                        <span>💳 {booking.paymentMethod.toUpperCase()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Earnings Tab */}
            {activeTab === 'earnings' && (
              <div className="space-y-6">
                <h3 className="font-semibold text-gray-900">Earnings Overview</h3>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
                    <p className="text-2xl font-bold text-green-600">
                      ₱{provider.totalEarnings.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">This Month</p>
                    <p className="text-2xl font-bold text-blue-600">₱{thisMonthEarnings.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Pending Payouts</p>
                    <p className="text-2xl font-bold text-yellow-600">₱{pendingPayouts.toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Transactions</h4>
                  <div className="space-y-2">
                    {completedBookings.slice(0, 5).map((booking) => (
                      <div
                        key={booking.id}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">{booking.serviceType}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(booking.scheduledDate).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="text-green-600 font-semibold">
                          +₱{booking.price.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900">Profile Management</h3>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    Edit Profile
                  </button>
                </div>

                {/* Basic Info */}
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{provider.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{provider.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{provider.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Specialization:</span>
                      <span className="font-medium">{provider.primarySpecialization}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-2 gap-4">
                  <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors text-left">
                    <Award className="w-6 h-6 text-blue-600 mb-2" />
                    <h5 className="font-medium text-gray-900 mb-1">Add Certification</h5>
                    <p className="text-xs text-gray-600">Upload new certificates</p>
                  </button>
                  <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors text-left">
                    <ImageIcon className="w-6 h-6 text-blue-600 mb-2" />
                    <h5 className="font-medium text-gray-900 mb-1">Add Portfolio Item</h5>
                    <p className="text-xs text-gray-600">Showcase your work</p>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
