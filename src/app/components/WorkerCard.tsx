import { MessageCircle, Star } from 'lucide-react';

interface WorkerCardProps {
  id: string;
  name: string;
  role: string;
  photo?: string;
  rating: number;
  completedJobs: number;
  phone: string;
  specialty?: string;
  location?: string;
  onMessageClick: (workerId: string, workerName: string) => void;
}

export function WorkerCard({
  id,
  name,
  role,
  photo,
  rating,
  completedJobs,
  phone,
  specialty,
  location,
  onMessageClick
}: WorkerCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-200">
      {/* Card Body */}
      <div className="p-6">
        {/* Profile Photo */}
        <div className="flex flex-col items-center mb-4">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 mb-3">
            {photo ? (
              <img
                src={photo}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">
                {name.charAt(0)}
              </div>
            )}
          </div>

          {/* Worker Name */}
          <h3 className="text-lg font-bold text-gray-900 mb-1">{name}</h3>

          {/* Role */}
          <p className="text-sm text-gray-600 mb-2">{role}</p>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium text-gray-900">{rating.toFixed(1)}</span>
            <span className="text-sm text-gray-500">• {completedJobs} jobs</span>
          </div>
        </div>

        {/* Specialty */}
        {specialty && (
          <p className="text-xs text-gray-500 text-center mb-4">{specialty}</p>
        )}

        {/* Action Button */}
        <button
          onClick={() => onMessageClick(id, name)}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium mt-4"
        >
          <MessageCircle className="w-4 h-4" />
          Message
        </button>
      </div>
    </div>
  );
}
