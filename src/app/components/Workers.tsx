import { useState, useMemo } from 'react';
import { WorkerCard } from './WorkerCard';
import { Search } from 'lucide-react';

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
  const [filterRole, setFilterRole] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleMessageClick = (workerId: string, workerName: string) => {
    // Navigate to the messaging system
    if (onNavigateToMessages) {
      onNavigateToMessages();
    }
  };

  // Filtering logic with search
  const filteredWorkers = useMemo(() => {
    let workers = workersData;

    // Filter by role
    if (filterRole !== 'all') {
      workers = workers.filter(worker => worker.role.toLowerCase() === filterRole.toLowerCase());
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      workers = workers.filter(worker =>
        worker.name.toLowerCase().includes(query) ||
        worker.role.toLowerCase().includes(query) ||
        worker.specialty?.toLowerCase().includes(query) ||
        worker.location?.toLowerCase().includes(query)
      );
    }

    return workers;
  }, [filterRole, searchQuery]);

  return (
    <section id="workers" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Our Professional Workers
          </h2>
          <p className="text-base text-gray-600">
            Experienced and verified professionals ready to help you
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search workers, skills, or services..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button
            onClick={() => setFilterRole('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filterRole === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterRole('plumber')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filterRole === 'plumber'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            Plumbers
          </button>
          <button
            onClick={() => setFilterRole('electrician')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filterRole === 'electrician'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            Electricians
          </button>
          <button
            onClick={() => setFilterRole('carpenter')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filterRole === 'carpenter'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            Carpenters
          </button>
          <button
            onClick={() => setFilterRole('technician')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filterRole === 'technician'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            Technicians
          </button>
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
          <div className="text-center py-16">
            <div className="text-gray-400 mb-3">
              <Search className="w-16 h-16 mx-auto mb-4" />
            </div>
            <p className="text-gray-600 text-lg font-medium mb-1">No workers found</p>
            <p className="text-gray-500 text-sm">
              {searchQuery ? 'Try adjusting your search or filters' : 'No workers available in this category'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}