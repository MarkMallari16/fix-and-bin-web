import { useState } from 'react';
import { 
  Camera, 
  MapPin, 
  Home, 
  Calendar, 
  Users,
  Edit2,
  Save,
  X,
  Mail,
  Phone,
  Star,
  Award,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  homeAddress: string;
  hometown: string;
  birthday: string;
  gender: string;
}

export function EditProfile() {
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState<string>('');
  const [isEditingField, setIsEditingField] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: user?.name || 'John Doe',
    email: user?.email || 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    homeAddress: '123 Main Street, New York, NY 10001',
    hometown: 'Brooklyn, NY',
    birthday: 'January 15, 1990',
    gender: 'Male'
  });

  const [tempValue, setTempValue] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startEditing = (field: string, currentValue: string) => {
    setIsEditingField(field);
    setTempValue(currentValue);
  };

  const saveEdit = (field: keyof ProfileData) => {
    setProfileData(prev => ({
      ...prev,
      [field]: tempValue
    }));
    setIsEditingField(null);
    setTempValue('');
  };

  const cancelEdit = () => {
    setIsEditingField(null);
    setTempValue('');
  };

  const ProfileField = ({ 
    field, 
    label, 
    value, 
    icon: Icon, 
    type = 'text' 
  }: { 
    field: keyof ProfileData; 
    label: string; 
    value: string; 
    icon: any;
    type?: string;
  }) => {
    const isEditing = isEditingField === field;

    return (
      <div className="flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors rounded-lg border border-gray-200">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500">{label}</p>
            {isEditing ? (
              <div className="flex items-center gap-2 mt-1">
                <input
                  type={type}
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="flex-1 px-3 py-2 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <button
                  onClick={() => saveEdit(field)}
                  className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={cancelEdit}
                  className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <p className="font-medium text-gray-900 mt-1">{value || 'Not set'}</p>
            )}
          </div>
        </div>
        {!isEditing && (
          <button
            onClick={() => startEditing(field, value)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit2 className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Profile</h1>
          <p className="text-lg text-gray-600">Update your personal information</p>
        </div>

        {/* Profile Picture Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-600 text-4xl font-bold overflow-hidden border-4 border-white shadow-lg">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span>{profileData.name.charAt(0)}</span>
                )}
              </div>
              <label 
                htmlFor="profile-upload" 
                className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-all shadow-lg hover:scale-110 transform"
              >
                <Camera className="w-5 h-5 text-white" />
              </label>
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{profileData.name}</h2>
            <p className="text-gray-600 mb-4">{profileData.email}</p>
            <label 
              htmlFor="profile-upload" 
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer font-medium flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              Add Photo
            </label>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Contact Information</h3>
          </div>
          <div className="space-y-3">
            <ProfileField
              field="email"
              label="Email Address"
              value={profileData.email}
              icon={Mail}
              type="email"
            />
            <ProfileField
              field="phone"
              label="Phone Number"
              value={profileData.phone}
              icon={Phone}
              type="tel"
            />
          </div>
        </div>

        {/* Personal Details */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Personal Details</h3>
          </div>
          <div className="space-y-3">
            <ProfileField
              field="homeAddress"
              label="Home Address"
              value={profileData.homeAddress}
              icon={MapPin}
            />
            <ProfileField
              field="hometown"
              label="Hometown"
              value={profileData.hometown}
              icon={Home}
            />
            <ProfileField
              field="birthday"
              label="Birthday"
              value={profileData.birthday}
              icon={Calendar}
            />
            <ProfileField
              field="gender"
              label="Gender"
              value={profileData.gender}
              icon={Users}
            />
          </div>
        </div>

        {/* Save All Button */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex gap-4">
            <button
              onClick={() => {
                // Save all profile data (in a real app, this would save to backend)
                alert('Profile changes saved successfully!');
              }}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Save className="w-5 h-5" />
              Save All Changes
            </button>
            <button
              onClick={() => {
                // Reset to original values
                window.location.reload();
              }}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Account Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">12</p>
            <p className="text-sm text-gray-600">Services Booked</p>
          </div>
          
          {user?.role === 'worker' ? (
            <>
              <div className="bg-white rounded-xl shadow p-4 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                </div>
                <p className="text-2xl font-bold text-yellow-600">4.8</p>
                <p className="text-sm text-gray-600">Worker Rating</p>
              </div>
              <div className="bg-white rounded-xl shadow p-4 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Award className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-600">247</p>
                <p className="text-sm text-gray-600">Jobs Completed</p>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white rounded-xl shadow p-4 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="w-5 h-5 text-purple-500 fill-purple-500" />
                </div>
                <p className="text-2xl font-bold text-purple-600">8</p>
                <p className="text-sm text-gray-600">Reviews Given</p>
              </div>
              <div className="bg-white rounded-xl shadow p-4 text-center">
                <p className="text-2xl font-bold text-purple-600">3</p>
                <p className="text-sm text-gray-600">Years Member</p>
              </div>
            </>
          )}
        </div>

        {/* Worker-specific section */}
        {user?.role === 'worker' && (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg p-6 mt-6 border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Worker Profile</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Specialty</p>
                <p className="font-bold text-gray-900">Plumbing Expert</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="font-bold text-green-600">Available</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}