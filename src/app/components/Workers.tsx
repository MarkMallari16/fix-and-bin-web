import { useState } from 'react';
import { WorkerCard } from './WorkerCard';
import { X, Send } from 'lucide-react';

interface Worker {
  id: string;
  name: string;
  role: string;
  photo?: string;
  rating: number;
  completedJobs: number;
  phone: string;
  specialty?: string;
  location?: string;
}

const workersData: Worker[] = [
  {
    id: '1',
    name: 'Mike Johnson',
    role: 'Plumber',
    rating: 4.9,
    completedJobs: 245,
    phone: '+1-555-0101',
    specialty: 'Emergency Repairs & Installation',
    location: 'Downtown Area'
  },
  {
    id: '2',
    name: 'Sarah Chen',
    role: 'Electrician',
    rating: 4.8,
    completedJobs: 312,
    phone: '+1-555-0102',
    specialty: 'Wiring & Lighting Specialist',
    location: 'North District'
  },
  {
    id: '3',
    name: 'David Martinez',
    role: 'Carpenter',
    rating: 4.9,
    completedJobs: 198,
    phone: '+1-555-0103',
    specialty: 'Custom Furniture & Repair',
    location: 'East Side'
  },
  {
    id: '4',
    name: 'James Wilson',
    role: 'Technician',
    rating: 4.7,
    completedJobs: 276,
    phone: '+1-555-0104',
    specialty: 'Appliance & HVAC Expert',
    location: 'West End'
  },
  {
    id: '5',
    name: 'Emily Brown',
    role: 'Plumber',
    rating: 4.8,
    completedJobs: 189,
    phone: '+1-555-0105',
    specialty: 'Bathroom & Kitchen Specialist',
    location: 'South Quarter'
  },
  {
    id: '6',
    name: 'Robert Lee',
    role: 'Electrician',
    rating: 4.9,
    completedJobs: 334,
    phone: '+1-555-0106',
    specialty: 'Smart Home & Automation',
    location: 'Central Area'
  }
];

interface WorkersProps {
  onNavigateToMessages?: () => void;
}

export function Workers({ onNavigateToMessages }: WorkersProps = {}) {
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<{ id: string; name: string } | null>(null);
  const [message, setMessage] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');

  const quickMessages = [
    "Hi! I need help with a plumbing issue.",
    "When are you available for a service call?",
    "What's your rate for this type of work?",
    "Can you provide an estimate?",
    "I have an emergency repair needed."
  ];

  const handleMessageClick = (workerId: string, workerName: string) => {
    // If onNavigateToMessages is provided, navigate to the full messaging system
    if (onNavigateToMessages) {
      onNavigateToMessages();
    } else {
      // Otherwise show the simple modal
      setSelectedWorker({ id: workerId, name: workerName });
      setShowMessageModal(true);
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // Here you would implement the actual messaging functionality
      console.log(`Sending message to ${selectedWorker?.name}:`, message);
      setMessage('');
      setShowMessageModal(false);
      // Show success notification
      alert(`Message sent to ${selectedWorker?.name}!`);
    }
  };

  const handleQuickMessage = (quickMsg: string) => {
    setMessage(quickMsg);
  };

  const filteredWorkers = filterRole === 'all' 
    ? workersData 
    : workersData.filter(worker => worker.role.toLowerCase() === filterRole.toLowerCase());

  return (
    <section id="workers" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Professional Workers
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Experienced and verified professionals ready to help you
          </p>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setFilterRole('all')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                filterRole === 'all'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              All Workers
            </button>
            <button
              onClick={() => setFilterRole('plumber')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                filterRole === 'plumber'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              🔧 Plumbers
            </button>
            <button
              onClick={() => setFilterRole('electrician')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                filterRole === 'electrician'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              ⚡ Electricians
            </button>
            <button
              onClick={() => setFilterRole('carpenter')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                filterRole === 'carpenter'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              🪚 Carpenters
            </button>
            <button
              onClick={() => setFilterRole('technician')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                filterRole === 'technician'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              🛠️ Technicians
            </button>
          </div>
        </div>

        {/* Workers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredWorkers.map((worker) => (
            <WorkerCard
              key={worker.id}
              {...worker}
              onMessageClick={handleMessageClick}
            />
          ))}
        </div>

        {filteredWorkers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No workers found in this category.</p>
          </div>
        )}
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                Message {selectedWorker?.name}
              </h3>
              <button
                onClick={() => {
                  setShowMessageModal(false);
                  setMessage('');
                }}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={5}
              />

              {/* Quick Messages */}
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Quick Messages:</p>
                <div className="flex flex-wrap gap-2">
                  {quickMessages.map((msg, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickMessage(msg)}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {msg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
                <button
                  onClick={() => {
                    setShowMessageModal(false);
                    setMessage('');
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}