import { useState, useEffect } from 'react';
import {
  MapPin,
  Navigation,
  CheckCircle,
  Clock,
  DollarSign,
  Star,
  MessageSquare,
  Phone,
  AlertCircle,
  TrendingUp,
  Package,
  Calendar
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Job {
  id: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  service: string;
  status: 'pending' | 'accepted' | 'on-the-way' | 'in-progress' | 'completed';
  scheduledTime: string;
  estimatedDuration: string;
  payment: string;
  distance?: string;
}

const mockJobs: Job[] = [
  {
    id: 'JOB-001',
    customer: {
      name: 'Sarah Johnson',
      phone: '+1-555-1234',
      address: '123 Main St, Apt 4B, New York, NY 10001'
    },
    service: 'Kitchen Faucet Repair',
    status: 'accepted',
    scheduledTime: '10:00 AM',
    estimatedDuration: '1-2 hours',
    payment: '₱4,250',
    distance: '2.3 km'
  },
  {
    id: 'JOB-002',
    customer: {
      name: 'Michael Chen',
      phone: '+1-555-5678',
      address: '456 Oak Ave, Brooklyn, NY 11201'
    },
    service: 'Toilet Repair',
    status: 'pending',
    scheduledTime: '2:00 PM',
    estimatedDuration: '30-45 mins',
    payment: '₱3,000',
    distance: '5.1 km'
  },
  {
    id: 'JOB-003',
    customer: {
      name: 'Emma Davis',
      phone: '+1-555-9012',
      address: '789 Pine Rd, Queens, NY 11354'
    },
    service: 'Pipe Leak Emergency',
    status: 'on-the-way',
    scheduledTime: 'Now',
    estimatedDuration: '2-3 hours',
    payment: '₱6,000',
    distance: '0.8 km'
  }
];

export function WorkerDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Simulate GPS tracking
  useEffect(() => {
    if (isTracking && selectedJob) {
      const interval = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCurrentLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
            console.log('Location updated:', position.coords);
          },
          (error) => {
            console.error('Error getting location:', error);
          }
        );
      }, 5000); // Update every 5 seconds

      return () => clearInterval(interval);
    }
  }, [isTracking, selectedJob]);

  const handleAcceptJob = (jobId: string) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, status: 'accepted' } : job
    ));
  };

  const handleStartTracking = (job: Job) => {
    setSelectedJob(job);
    setIsTracking(true);
    setJobs(jobs.map(j => 
      j.id === job.id ? { ...j, status: 'on-the-way' } : j
    ));
  };

  const handleArrived = (jobId: string) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, status: 'in-progress' } : job
    ));
    setIsTracking(false);
  };

  const handleCompleteJob = (jobId: string) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, status: 'completed' } : job
    ));
    setSelectedJob(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'accepted': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'on-the-way': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'in-progress': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'on-the-way': return <Navigation className="w-4 h-4" />;
      case 'in-progress': return <Package className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const todayJobs = jobs.filter(j => j.status !== 'completed');
  const completedJobs = jobs.filter(j => j.status === 'completed');

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Worker Dashboard</h1>
          <p className="text-lg text-gray-600">Welcome back, {user?.name || 'Worker'}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-blue-600">{todayJobs.length}</span>
            </div>
            <p className="text-gray-600 font-medium">Today's Jobs</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-green-600">247</span>
            </div>
            <p className="text-gray-600 font-medium">Total Completed</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-2xl font-bold text-yellow-600">4.8</span>
            </div>
            <p className="text-gray-600 font-medium">Average Rating</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-purple-600">₱117,000</span>
            </div>
            <p className="text-gray-600 font-medium">This Month</p>
          </div>
        </div>

        {/* Tracking Status */}
        {isTracking && selectedJob && (
          <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl shadow-xl p-6 mb-8 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                  <Navigation className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Live Tracking Active</h3>
                  <p className="text-white/80">Your location is being shared with the customer</p>
                </div>
              </div>
              <button
                onClick={() => handleArrived(selectedJob.id)}
                className="bg-white text-purple-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-bold"
              >
                I've Arrived
              </button>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Distance: {selectedJob.distance}</span>
              </div>
              {currentLocation && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>GPS: {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Active Jobs */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Jobs</h2>
          
          <div className="space-y-4">
            {todayJobs.map((job) => (
              <div key={job.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                {/* Job Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{job.service}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-1 ${getStatusColor(job.status)}`}>
                        {getStatusIcon(job.status)}
                        {job.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-600">Job ID: {job.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">{job.payment}</p>
                    <p className="text-sm text-gray-500">{job.estimatedDuration}</p>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Customer</p>
                      <p className="font-bold text-gray-900">{job.customer.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Scheduled Time</p>
                      <p className="font-bold text-gray-900">{job.scheduledTime}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500 mb-1">Address</p>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                        <p className="font-medium text-gray-900">{job.customer.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {job.status === 'pending' && (
                    <button
                      onClick={() => handleAcceptJob(job.id)}
                      className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Accept Job
                    </button>
                  )}
                  
                  {job.status === 'accepted' && (
                    <button
                      onClick={() => handleStartTracking(job)}
                      className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <Navigation className="w-5 h-5" />
                      Start Navigation & Track
                    </button>
                  )}

                  {job.status === 'in-progress' && (
                    <button
                      onClick={() => handleCompleteJob(job.id)}
                      className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Complete Job
                    </button>
                  )}

                  <a
                    href={`tel:${job.customer.phone}`}
                    className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    Call
                  </a>

                  <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Message
                  </button>
                </div>
              </div>
            ))}

            {todayJobs.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No active jobs at the moment</p>
              </div>
            )}
          </div>
        </div>

        {/* Completed Today */}
        {completedJobs.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Completed Today
            </h2>
            
            <div className="space-y-3">
              {completedJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{job.service}</p>
                      <p className="text-sm text-gray-600">{job.customer.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{job.payment}</p>
                    <p className="text-xs text-gray-500">Completed</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
