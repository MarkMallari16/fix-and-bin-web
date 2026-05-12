import { useState, useEffect } from 'react';
import {
  MapPin,
  MessageSquare,
  Clock,
  CheckCircle,
  Truck,
  Star,
  Navigation
} from 'lucide-react';

interface ServiceTicket {
  id: string;
  service: string;
  status: 'pending' | 'confirmed' | 'on-the-way' | 'arrived' | 'in-progress' | 'completed';
  scheduledDate: string;
  scheduledTime: string;
  estimatedArrival?: string;
  worker?: {
    name: string;
    photo: string;
    phone: string;
    rating: number;
    completedJobs: number;
  };
  address: string;
  description: string;
  amount: string;
  timeline: Array<{
    status: string;
    time: string;
    completed: boolean;
  }>;
  currentLocation?: {
    distance: string;
    eta: string;
  };
}

const mockTicket: ServiceTicket = {
  id: 'TICKET-2026-001',
  service: 'Kitchen Faucet Repair',
  status: 'on-the-way',
  scheduledDate: '2026-03-05',
  scheduledTime: '10:00 AM',
  estimatedArrival: '10:15 AM',
  worker: {
    name: 'John Martinez',
    photo: 'https://images.unsplash.com/photo-1759521296144-fe6f2d2dc769?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3JrZXIlMjBwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMHVuaWZvcm18ZW58MXx8fHwxNzcyNzA3MzEwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    phone: '(555) 987-6543',
    rating: 4.9,
    completedJobs: 247
  },
  address: '123 Main St, Apt 4B, New York, NY 10001',
  description: 'Leaking kitchen faucet needs repair. Water dripping constantly.',
  amount: '₱4,250',
  timeline: [
    { status: 'Service Requested', time: '9:30 AM', completed: true },
    { status: 'Worker Assigned', time: '9:45 AM', completed: true },
    { status: 'Confirmed', time: '9:50 AM', completed: true },
    { status: 'On The Way', time: '9:55 AM', completed: true },
    { status: 'Worker Arrives', time: 'Est. 10:15 AM', completed: false },
    { status: 'Work In Progress', time: 'Pending', completed: false },
    { status: 'Job Completed', time: 'Pending', completed: false }
  ],
  currentLocation: {
    distance: '1.2 km',
    eta: '10-15 mins'
  }
};

interface CustomerTrackerProps {
  onNavigateToMessages?: () => void;
}

export function CustomerTracker({ onNavigateToMessages }: CustomerTrackerProps = {}) {
  const [ticket] = useState<ServiceTicket>(mockTicket);
  const [liveUpdates, setLiveUpdates] = useState(true);
  const [simulatedDistance, setSimulatedDistance] = useState(1.2);

  // Simulate live tracking updates
  useEffect(() => {
    if (liveUpdates && ticket.status === 'on-the-way') {
      const interval = setInterval(() => {
        setSimulatedDistance(prev => {
          const newDistance = Math.max(0.1, prev - 0.1);
          return parseFloat(newDistance.toFixed(1));
        });
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [liveUpdates, ticket.status]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-700';
      default: return 'text-blue-600';
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending': return 'Waiting for worker assignment';
      case 'confirmed': return 'Your service has been confirmed';
      case 'on-the-way': return 'Worker is on the way to your location';
      case 'arrived': return 'Worker has arrived';
      case 'in-progress': return 'Work in progress';
      case 'completed': return 'Service completed';
      default: return 'Processing your request';
    }
  };

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'pending': return 14;
      case 'confirmed': return 42;
      case 'on-the-way': return 57;
      case 'arrived': return 71;
      case 'in-progress': return 85;
      case 'completed': return 100;
      default: return 0;
    }
  };

  return (
    <section className="py-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Track Service</h1>
          <p className="text-sm text-gray-600">#{ticket.id}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Status Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              {/* Status */}
              <div className="flex items-center gap-3 mb-4">
                {ticket.status === 'on-the-way' && <Truck className={`w-6 h-6 ${getStatusColor(ticket.status)}`} />}
                {ticket.status === 'completed' && <CheckCircle className={`w-6 h-6 ${getStatusColor(ticket.status)}`} />}
                {ticket.status === 'in-progress' && <Clock className={`w-6 h-6 ${getStatusColor(ticket.status)}`} />}
                {ticket.status === 'confirmed' && <CheckCircle className={`w-6 h-6 ${getStatusColor(ticket.status)}`} />}
                {ticket.status === 'pending' && <Clock className={`w-6 h-6 ${getStatusColor(ticket.status)}`} />}
                {ticket.status === 'arrived' && <MapPin className={`w-6 h-6 ${getStatusColor(ticket.status)}`} />}
                <div className="flex-1">
                  <p className={`text-lg font-bold ${getStatusColor(ticket.status)}`}>
                    {ticket.status.replace('-', ' ').toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-600">{getStatusMessage(ticket.status)}</p>
                </div>
                {liveUpdates && ticket.status === 'on-the-way' && (
                  <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Live
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>Progress</span>
                  <span className="font-medium">{getProgressPercentage(ticket.status)}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${getProgressPercentage(ticket.status)}%` }}
                  />
                </div>
              </div>

              {/* Live Location Tracking */}
              {ticket.status === 'on-the-way' && ticket.currentLocation && (
                <div className="mb-6">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Distance</p>
                      <p className="text-2xl font-bold text-gray-900">{simulatedDistance} km</p>
                    </div>
                    <div className="w-px h-12 bg-gray-200"></div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Estimated Arrival</p>
                      <p className="text-2xl font-bold text-gray-900">{ticket.estimatedArrival}</p>
                    </div>
                  </div>

                  {/* Simulated Map */}
                  <div className="relative h-40 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1579120632007-f493373daed0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpdmVyeSUyMHRydWNrJTIwbWFwJTIwbG9jYXRpb258ZW58MXx8fHwxNzcyNzA3MzEwfDA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Map"
                      className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2">
                        <Truck className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-900">Worker approaching</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Service Details */}
              <div className="space-y-3">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Service</span>
                  <span className="text-sm font-medium text-gray-900">{ticket.service}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Scheduled</span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(ticket.scheduledDate).toLocaleDateString()} • {ticket.scheduledTime}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Service Fee</span>
                  <span className="text-lg font-bold text-blue-600">{ticket.amount}</span>
                </div>
                <div className="flex items-start gap-3 py-3 border-b border-gray-100">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Service Address</p>
                    <p className="text-sm text-gray-900">{ticket.address}</p>
                  </div>
                </div>
                <div className="py-3">
                  <p className="text-xs text-gray-500 mb-2">Issue Description</p>
                  <p className="text-sm text-gray-700">{ticket.description}</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Service Timeline</h3>
              <div className="space-y-3">
                {ticket.timeline.map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        item.completed
                          ? 'bg-green-500'
                          : index === ticket.timeline.findIndex(t => !t.completed)
                          ? 'bg-blue-600'
                          : 'bg-gray-200'
                      }`}>
                        {item.completed ? (
                          <CheckCircle className="w-4 h-4 text-white" />
                        ) : (
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        )}
                      </div>
                      {index < ticket.timeline.length - 1 && (
                        <div className={`w-px h-8 ${
                          item.completed ? 'bg-green-500' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                    <div className="flex-1 pb-2">
                      <p className={`text-sm font-medium ${item.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                        {item.status}
                      </p>
                      <p className="text-xs text-gray-500">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Worker Info */}
            {ticket.worker && (
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Your Technician</h3>
                <div className="text-center mb-4">
                  <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden">
                    <img
                      src={ticket.worker.photo}
                      alt={ticket.worker.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-bold text-base text-gray-900 mb-1">{ticket.worker.name}</h4>
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-900">{ticket.worker.rating}</span>
                    <span className="text-xs text-gray-500">• {ticket.worker.completedJobs} jobs</span>
                  </div>
                </div>

                <button
                  onClick={onNavigateToMessages}
                  className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Message
                </button>

                {/* Worker Stats */}
                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900">{ticket.worker.completedJobs}</p>
                    <p className="text-xs text-gray-500">Jobs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-green-600">98%</p>
                    <p className="text-xs text-gray-500">Success</p>
                  </div>
                </div>
              </div>
            )}

            {/* Help & Support */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-xs text-gray-600 mb-4">
                Customer support available 24/7
              </p>
              <button className="w-full bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
