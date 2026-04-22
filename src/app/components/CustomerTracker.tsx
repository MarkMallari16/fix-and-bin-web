import { useState, useEffect } from 'react';
import { 
  MapPin, 
  Phone, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  Truck,
  User,
  Star,
  Navigation,
  Package,
  AlertCircle
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

export function CustomerTracker() {
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
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'on-the-way': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'arrived': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'in-progress': return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending': return 'Waiting for worker assignment';
      case 'confirmed': return 'Your service has been confirmed';
      case 'on-the-way': return 'Worker is on the way to your location';
      case 'arrived': return 'Worker has arrived at your location';
      case 'in-progress': return 'Work is currently in progress';
      case 'completed': return 'Service completed successfully';
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
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold text-gray-900">Track Your Service</h1>
            {liveUpdates && ticket.status === 'on-the-way' && (
              <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-sm">Live Tracking</span>
              </div>
            )}
          </div>
          <p className="text-xl text-gray-600">Ticket #{ticket.id}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className={`flex items-center gap-3 p-4 rounded-lg border-2 mb-4 ${getStatusColor(ticket.status)}`}>
                {ticket.status === 'on-the-way' && <Truck className="w-6 h-6" />}
                {ticket.status === 'completed' && <CheckCircle className="w-6 h-6" />}
                {ticket.status === 'in-progress' && <Package className="w-6 h-6 animate-pulse" />}
                {ticket.status === 'confirmed' && <CheckCircle className="w-6 h-6" />}
                {ticket.status === 'pending' && <Clock className="w-6 h-6" />}
                {ticket.status === 'arrived' && <MapPin className="w-6 h-6" />}
                <div className="flex-1">
                  <p className="font-bold text-lg uppercase">{ticket.status.replace('-', ' ')}</p>
                  <p className="text-sm opacity-90">{getStatusMessage(ticket.status)}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Service Progress</span>
                  <span className="font-bold">{getProgressPercentage(ticket.status)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 relative overflow-hidden"
                    style={{ width: `${getProgressPercentage(ticket.status)}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Live Location Tracking */}
              {ticket.status === 'on-the-way' && ticket.currentLocation && (
                <div className="mb-6 p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Navigation className="w-5 h-5 text-purple-600" />
                    <h3 className="font-bold text-gray-900">Live Location</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-white rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Distance Away</p>
                      <p className="text-2xl font-bold text-purple-600">{simulatedDistance} km</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Estimated Arrival</p>
                      <p className="text-2xl font-bold text-purple-600">{ticket.estimatedArrival}</p>
                    </div>
                  </div>
                  
                  {/* Simulated Map */}
                  <div className="relative h-48 bg-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1579120632007-f493373daed0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpdmVyeSUyMHRydWNrJTIwbWFwJTIwbG9jYXRpb258ZW58MXx8fHwxNzcyNzA3MzEwfDA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Map"
                      className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
                        <Truck className="w-5 h-5 text-purple-600 animate-bounce" />
                        <span className="font-bold text-gray-900">Worker is approaching...</span>
                      </div>
                    </div>
                    {/* Destination Pin */}
                    <div className="absolute bottom-4 right-4 bg-red-500 p-2 rounded-full shadow-lg">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              )}

              {/* Service Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Service Details</h3>
                  <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service:</span>
                      <span className="font-medium text-gray-900">{ticket.service}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Scheduled:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(ticket.scheduledDate).toLocaleDateString()} at {ticket.scheduledTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service Fee:</span>
                      <span className="text-2xl font-bold text-blue-600">{ticket.amount}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Service Address</h3>
                  <div className="p-4 bg-gray-50 rounded-lg flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <span className="text-gray-700">{ticket.address}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Description</h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">{ticket.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-6 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                Service Timeline
              </h3>
              <div className="space-y-4">
                {ticket.timeline.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        item.completed 
                          ? 'bg-green-500' 
                          : index === ticket.timeline.findIndex(t => !t.completed)
                          ? 'bg-blue-500 animate-pulse'
                          : 'bg-gray-300'
                      }`}>
                        {item.completed ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      {index < ticket.timeline.length - 1 && (
                        <div className={`w-0.5 h-12 ${
                          item.completed ? 'bg-green-500' : 'bg-gray-300'
                        }`} />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className={`font-medium ${item.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                        {item.status}
                      </p>
                      <p className="text-sm text-gray-600">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Worker Info */}
            {ticket.worker && (
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                <h3 className="font-bold text-gray-900 mb-4">Your Technician</h3>
                <div className="text-center mb-4">
                  <div className="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden border-4 border-blue-100">
                    <img 
                      src={ticket.worker.photo} 
                      alt={ticket.worker.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-bold text-lg text-gray-900">{ticket.worker.name}</h4>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-gray-900">{ticket.worker.rating}</span>
                    <span className="text-gray-600 text-sm">({ticket.worker.completedJobs} jobs)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2">
                    <Phone className="w-5 h-5" />
                    Call Worker
                  </button>
                  <button className="w-full bg-white text-blue-600 border-2 border-blue-600 px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium flex items-center justify-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Send Message
                  </button>
                </div>

                {/* Worker Stats */}
                <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{ticket.worker.completedJobs}</p>
                    <p className="text-xs text-gray-600">Jobs Done</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">98%</p>
                    <p className="text-xs text-gray-600">Success Rate</p>
                  </div>
                </div>
              </div>
            )}

            {/* Help & Support */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-blue-600" />
                Need Help?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Our customer support team is available 24/7 to assist you.
              </p>
              <button className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" />
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
