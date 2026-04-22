import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Mail, User, X, Briefcase, Zap, AlertCircle } from 'lucide-react';

interface RegisterProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export function Register({ onClose, onSwitchToLogin }: RegisterProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'customer' | 'worker'>('customer');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, loginWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const success = await register(email, password, name, role);
    
    setIsLoading(false);
    
    if (success) {
      onClose();
    } else {
      setError('Registration failed. Please try again or use a different email.');
    }
  };

  const handleQuickDemo = async (demoRole: 'customer' | 'worker') => {
    setIsLoading(true);
    setError('');

    const demoEmail = demoRole === 'customer' ? 'demo@customer.com' : 'demo@worker.com';
    const demoName = demoRole === 'customer' ? 'Demo Customer' : 'Demo Worker';
    const demoPassword = 'demo123456';

    const success = await register(demoEmail, demoPassword, demoName, demoRole);

    setIsLoading(false);

    if (success) {
      onClose();
    } else {
      setError('Demo account already exists. Please use the Login page to access it.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full overflow-hidden relative flex max-h-[90vh]">
        {/* Background Image Section */}
        <div 
          className="hidden md:block md:w-1/2 bg-cover bg-center relative"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1760553120312-2821bf54e767?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb25zdHJ1Y3Rpb24lMjBibHVlcHJpbnQlMjB0b29sc3xlbnwxfHx8fDE3NzI3MDU5MDR8MA&ixlib=rb-4.1.0&q=80&w=1080')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-blue-900/90"></div>
          <div className="relative h-full flex flex-col justify-center items-center text-white p-8">
            <h2 className="text-4xl font-bold mb-4">Join FIX&BIN</h2>
            <p className="text-xl text-center mb-6">Your trusted handyman partner</p>
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h3 className="font-bold mb-2">For Customers</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mr-2 mt-1.5"></div>
                    <span>Book professional services</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mr-2 mt-1.5"></div>
                    <span>Track your service requests</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mr-2 mt-1.5"></div>
                    <span>Leave reviews & ratings</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h3 className="font-bold mb-2">For Workers</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mr-2 mt-1.5"></div>
                    <span>Manage your job schedule</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mr-2 mt-1.5"></div>
                    <span>Track job progress</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mr-2 mt-1.5"></div>
                    <span>Build your reputation</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8 relative overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Join FIX&BIN</h2>
            <p className="text-gray-600">Create your account to get started</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    role === 'customer'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <User className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <div className="font-medium text-gray-900">Customer</div>
                  <div className="text-xs text-gray-500">Book services</div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('worker')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    role === 'worker'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Briefcase className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <div className="font-medium text-gray-900">Worker</div>
                  <div className="text-xs text-gray-500">Provide services</div>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Google Signup Button */}
          <button
            onClick={loginWithGoogle}
            className="mt-6 w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="font-medium">Continue with Google</span>
          </button>

          {/* Quick Demo Buttons */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Try a quick demo:
              <button
                onClick={() => handleQuickDemo('customer')}
                className="text-blue-600 hover:text-blue-700 font-medium mx-2"
              >
                <Zap className="w-4 h-4 inline-block mr-1" />
                Customer
              </button>
              <button
                onClick={() => handleQuickDemo('worker')}
                className="text-blue-600 hover:text-blue-700 font-medium mx-2"
              >
                <Zap className="w-4 h-4 inline-block mr-1" />
                Worker
              </button>
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Log in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}