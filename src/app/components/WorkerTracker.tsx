import { useState } from 'react';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  MapPin, 
  User, 
  Phone, 
  Calendar,
  Wrench,
  ChevronRight,
  MessageSquare,
  Star
} from 'lucide-react';

interface Job {
  id: string;
  service: string;
  customer: string;
  address: string;
  phone: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  scheduledTime: string;
  description: string;
  amount: string;
  statusHistory: Array<{
    status: string;
    timestamp: string;
    note?: string;
  }>;
}

const mockJobs: Job[] = [
  {
    id: 'JOB-2026-001',
    service: 'Kitchen Faucet Repair',
    customer: 'Sarah Johnson',
    address: '123 Main St, Apt 4B, New York, NY 10001',
    phone: '(555) 123-4567',
    status: 'in-progress',
    scheduledDate: '2026-03-05',
    scheduledTime: '10:00 AM',
    description: 'Leaking kitchen faucet needs repair. Water dripping constantly.',
    amount: '₱4,250',
    statusHistory: [
      { status: 'Job Requested', timestamp: '2026-03-04 09:30 AM', note: 'Customer submitted service request' },
      { status: 'Confirmed', timestamp: '2026-03-04 10:15 AM', note: 'Worker assigned and confirmed' },
      { status: 'On The Way', timestamp: '2026-03-05 09:45 AM', note: 'Worker is traveling to location' },
      { status: 'Work Started', timestamp: '2026-03-05 10:05 AM', note: 'Currently working on site' }
    ]
  },
  {
    id: 'JOB-2026-002',
    service: 'Ceiling Fan Installation',
    customer: 'Michael Chen',
    address: '456 Oak Avenue, Brooklyn, NY 11201',
    phone: '(555) 234-5678',
    status: 'confirmed',
    scheduledDate: '2026-03-06',
    scheduledTime: '2:00 PM',
    description: 'Install new ceiling fan in living room. Customer has the fan ready.',
    amount: '₱6,000',
    statusHistory: [
      { status: 'Job Requested', timestamp: '2026-03-04 02:00 PM', note: 'Customer submitted service request' },
      { status: 'Confirmed', timestamp: '2026-03-04 03:30 PM', note: 'Scheduled for tomorrow' }
    ]
  },
  {
    id: 'JOB-2026-003',
    service: 'Cabinet Door Repair',
    customer: 'Emily Davis',
    address: '789 Elm Street, Queens, NY 11375',
    phone: '(555) 345-6789',
    status: 'completed',
    scheduledDate: '2026-03-03',
    scheduledTime: '11:00 AM',
    description: 'Fix loose cabinet door hinges in kitchen.',
    amount: '₱3,250',
    statusHistory: [
      { status: 'Job Requested', timestamp: '2026-03-02 04:15 PM' },
      { status: 'Confirmed', timestamp: '2026-03-02 05:00 PM' },
      { status: 'On The Way', timestamp: '2026-03-03 10:40 AM' },
      { status: 'Work Started', timestamp: '2026-03-03 11:10 AM' },
      { status: 'Completed', timestamp: '2026-03-03 12:30 PM', note: 'Job completed successfully. Customer satisfied.' }
    ]
  },
  {
    id: 'JOB-2026-004',
    service: 'Door Hinge Replacement',
    customer: 'Robert Wilson',
    address: '321 Pine Road, Manhattan, NY 10002',
    phone: '(555) 456-7890',
    status: 'pending',
    scheduledDate: '2026-03-07',
    scheduledTime: '9:00 AM',
    description: 'Replace squeaky door hinges on bedroom door.',
    amount: '₱2,750',
    statusHistory: [
      { status: 'Job Requested', timestamp: '2026-03-05 11:00 AM', note: 'Waiting for worker confirmation' }
    ]
  }
];

export function WorkerTracker() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5" />;
      case 'confirmed': return <CheckCircle className="w-5 h-5" />;
      case 'in-progress': return <Wrench className="w-5 h-5" />;
      case 'completed': return <CheckCircle className="w-5 h-5" />;
      case 'cancelled': return <XCircle className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  const filteredJobs = activeTab === 'all' 
    ? mockJobs 
    : mockJobs.filter(job => job.status === activeTab);

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'pending': return 25;
      case 'confirmed': return 50;
      case 'in-progress': return 75;
      case 'completed': return 100;
      default: return 0;
    }
  };

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Job Tracker</h1>
          <p className="text-xl text-gray-600">Manage and track your service jobs</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {(['all', 'pending', 'in-progress', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors capitalize ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab === 'all' ? 'All Jobs' : tab.replace('-', ' ')}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab ? 'bg-white/20' : 'bg-gray-200'
              }`}>
                {tab === 'all' ? mockJobs.length : mockJobs.filter(j => j.status === tab).length}
              </span>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Jobs List */}
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={`bg-white rounded-lg shadow hover:shadow-lg transition-all cursor-pointer p-6 border-2 ${
                  selectedJob?.id === job.id ? 'border-blue-500' : 'border-transparent'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-mono text-gray-500">{job.id}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(job.status)}`}>
                        {getStatusIcon(job.status)}
                        {job.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{job.service}</h3>
                  </div>
                  <ChevronRight className={`w-6 h-6 text-gray-400 transition-transform ${
                    selectedJob?.id === job.id ? 'rotate-90' : ''
                  }`} />
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{getProgressPercentage(job.status)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        job.status === 'completed' ? 'bg-green-500' : 
                        job.status === 'cancelled' ? 'bg-red-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${getProgressPercentage(job.status)}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-700">
                    <User className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="font-medium">{job.customer}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{new Date(job.scheduledDate).toLocaleDateString()} at {job.scheduledTime}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="truncate">{job.address}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">{job.amount}</span>
                  {job.status === 'completed' && (
                    <div className="flex items-center text-yellow-500">
                      <Star className="w-5 h-5 fill-current" />
                      <span className="ml-1 text-sm text-gray-600">Rate Service</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {filteredJobs.length === 0 && (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Jobs Found</h3>
                <p className="text-gray-600">No jobs match the selected filter.</p>
              </div>
            )}
          </div>

          {/* Job Details */}
          <div className="lg:sticky lg:top-24 h-fit">
            {selectedJob ? (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-mono text-gray-500">{selectedJob.id}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedJob.service}</h2>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border items-center gap-1 ${getStatusColor(selectedJob.status)}`}>
                    {getStatusIcon(selectedJob.status)}
                    {selectedJob.status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                      <User className="w-5 h-5 mr-2 text-blue-600" />
                      Customer Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-700"><span className="font-medium">Name:</span> {selectedJob.customer}</p>
                      <p className="text-gray-700 flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {selectedJob.phone}
                      </p>
                      <p className="text-gray-700 flex items-start">
                        <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                        <span>{selectedJob.address}</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                      Scheduled Time
                    </h3>
                    <p className="text-gray-700">{new Date(selectedJob.scheduledDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })} at {selectedJob.scheduledTime}</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                      Job Description
                    </h3>
                    <p className="text-gray-700">{selectedJob.description}</p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Service Amount</span>
                      <span className="text-3xl font-bold text-blue-600">{selectedJob.amount}</span>
                    </div>
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-blue-600" />
                    Status Timeline
                  </h3>
                  <div className="space-y-4">
                    {selectedJob.statusHistory.map((history, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full ${
                            index === selectedJob.statusHistory.length - 1 
                              ? 'bg-blue-600' 
                              : 'bg-green-500'
                          }`} />
                          {index < selectedJob.statusHistory.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-300 my-1" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex justify-between items-start mb-1">
                            <p className="font-medium text-gray-900">{history.status}</p>
                            <span className="text-xs text-gray-500">{history.timestamp}</span>
                          </div>
                          {history.note && (
                            <p className="text-sm text-gray-600">{history.note}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                  {selectedJob.status === 'pending' && (
                    <>
                      <button className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                        Confirm Job
                      </button>
                      <button className="w-full bg-white text-red-600 border-2 border-red-600 px-6 py-3 rounded-lg hover:bg-red-50 transition-colors font-medium">
                        Decline Job
                      </button>
                    </>
                  )}
                  {selectedJob.status === 'confirmed' && (
                    <button className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      Start Job
                    </button>
                  )}
                  {selectedJob.status === 'in-progress' && (
                    <button className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
                      Mark as Completed
                    </button>
                  )}
                  <button className="w-full bg-white text-blue-600 border-2 border-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium flex items-center justify-center gap-2">
                    <Phone className="w-5 h-5" />
                    Message
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Select a Job</h3>
                <p className="text-gray-600">Click on a job from the list to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
