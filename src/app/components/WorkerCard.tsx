import { Phone, MessageCircle, Star, Award, MapPin } from 'lucide-react';

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
  const getRoleIcon = () => {
    switch (role.toLowerCase()) {
      case 'plumber':
        return '🔧';
      case 'electrician':
      case 'technician':
        return '⚡';
      case 'carpenter':
        return '🪚';
      default:
        return '🛠️';
    }
  };

  const getRoleColor = () => {
    switch (role.toLowerCase()) {
      case 'plumber':
        return 'bg-blue-100 text-blue-700';
      case 'electrician':
      case 'technician':
        return 'bg-yellow-100 text-yellow-700';
      case 'carpenter':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:scale-105">
      {/* Card Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor()} bg-white`}>
            <span className="mr-1">{getRoleIcon()}</span>
            {role}
          </div>
          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
            <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            <span className="text-white font-bold text-sm">{rating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6">
        {/* Profile Photo */}
        <div className="flex flex-col items-center mb-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-100 shadow-lg bg-gradient-to-br from-blue-100 to-blue-200">
              {photo ? (
                <img 
                  src={photo} 
                  alt={name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-blue-600">
                  {name.charAt(0)}
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          
          {/* Worker Name */}
          <h3 className="text-xl font-bold text-gray-900 mt-4 mb-1">{name}</h3>
          
          {specialty && (
            <p className="text-sm text-gray-600 mb-2">{specialty}</p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Award className="w-4 h-4 text-blue-600" />
              <p className="text-xs text-gray-600">Completed</p>
            </div>
            <p className="text-lg font-bold text-blue-600">{completedJobs}</p>
            <p className="text-xs text-gray-500">Jobs</p>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="w-4 h-4 text-yellow-600" />
              <p className="text-xs text-gray-600">Rating</p>
            </div>
            <p className="text-lg font-bold text-yellow-600">{rating.toFixed(1)}</p>
            <p className="text-xs text-gray-500">Stars</p>
          </div>
        </div>

        {location && (
          <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-4">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <a
            href={`tel:${phone}`}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <Phone className="w-4 h-4" />
            <span className="text-sm">Call</span>
          </a>
          
          <button
            onClick={() => onMessageClick(id, name)}
            className="flex items-center justify-center gap-2 bg-white text-blue-600 px-4 py-3 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium hover:shadow-md transform hover:scale-105"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">Message</span>
          </button>
        </div>
      </div>
    </div>
  );
}
