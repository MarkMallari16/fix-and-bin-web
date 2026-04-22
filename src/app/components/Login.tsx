import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Mail, X, AlertCircle } from 'lucide-react';

interface LoginProps {
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export function Login({ onClose, onSwitchToRegister }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, loginWithGoogle, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const success = await login(email, password);
    
    setIsLoading(false);
    
    if (success) {
      onClose();
    } else {
      setError('Invalid email or password. Please check your credentials or create an account.');
    }
  };

  const handleDemoLogin = async (role: 'customer' | 'worker') => {
    setIsLoading(true);
    setError('');

    const demoEmail = role === 'customer' ? 'demo@customer.com' : 'demo@worker.com';
    const demoPassword = 'demo123456';
    const demoName = role === 'customer' ? 'Demo Customer' : 'Demo Worker';

    setEmail(demoEmail);
    setPassword(demoPassword);

    // Try to login first (silent mode to avoid duplicate error alerts)
    const success = await login(demoEmail, demoPassword, true);

    if (success) {
      setIsLoading(false);
      onClose();
      return;
    }

    // If login fails, try to register the demo account
    const registerSuccess = await register(demoEmail, demoPassword, demoName, role);

    if (registerSuccess) {
      // Registration successful, account is ready
      setIsLoading(false);
      onClose();
    } else {
      setIsLoading(false);
      setError('Unable to create or access demo account. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full overflow-hidden relative flex">
        {/* Background Image Section */}
        <div 
          className="hidden md:block md:w-1/2 bg-cover bg-center relative"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1503507739298-dce173d09653?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5keW1hbiUyMHRvb2xzJTIwd29ya2JlbmNoJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3MjcwNTkwM3ww&ixlib=rb-4.1.0&q=80&w=1080')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-blue-900/90"></div>
          <div className="relative h-full flex flex-col justify-center items-center text-white p-8">
            <h2 className="text-4xl font-bold mb-4">FIX&BIN</h2>
            <p className="text-xl text-center mb-6">Professional Handyman Services</p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                <span>Expert Plumbing Services</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                <span>Professional Electrical Work</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                <span>Quality Carpentry Solutions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Log in to your FIX&BIN account</p>
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
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? 'Logging in...' : 'Log In'}
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

          {/* Google Login Button */}
          <button
            onClick={loginWithGoogle}
            disabled={isLoading}
            className="mt-6 w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* Demo Login Buttons */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-3">Quick Demo Access:</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleDemoLogin('customer')}
                disabled={isLoading}
                className="px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Demo Customer
              </button>
              <button
                onClick={() => handleDemoLogin('worker')}
                disabled={isLoading}
                className="px-4 py-2 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Demo Worker
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">
              Demo accounts will be created automatically on first use.
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToRegister}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}