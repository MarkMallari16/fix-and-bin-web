import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Mail, User, Briefcase, Zap, AlertCircle, X, Eye, EyeOff } from 'lucide-react';

interface RegisterProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export function Register({ onClose, onSwitchToLogin }: RegisterProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'customer' | 'worker'>('customer');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [googleError, setGoogleError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, loginWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic password validation
    if (password.length < 6) {
      setIsLoading(false);
      setError('Password must be at least 6 characters long.');
      return;
    }

    // Password match validation
    if (password !== confirmPassword) {
      setIsLoading(false);
      setError('Passwords do not match. Please try again.');
      return;
    }

    const success = await register(email, password, name, role);

    setIsLoading(false);

    if (success) {
      onClose();
    } else {
      setError('Registration failed. This email may already be registered. Try logging in instead.');
    }
  };

  const handleQuickDemo = async (demoRole: 'customer' | 'worker') => {
    setIsLoading(true);
    setError('');
    setGoogleError(false);

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

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError('');
      setGoogleError(false);
      await loginWithGoogle();
      // Don't set loading to false here - the page will redirect for OAuth
      // If we reach here without redirect, something went wrong
    } catch (err: any) {
      setIsLoading(false);
      setGoogleError(true);

      // More specific error messages
      let errorMsg = 'Google sign-in encountered an error. ';
      if (err?.message?.includes('not enabled')) {
        errorMsg += 'Google authentication is not configured. Please use email/password or demo registration.';
      } else if (err?.message?.includes('redirect')) {
        errorMsg += 'Redirect configuration issue. Please contact support or use email/password registration.';
      } else {
        errorMsg += 'Please try email/password registration or demo buttons below.';
      }

      setError(errorMsg);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden my-8 relative max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white dark:bg-gray-700 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors shadow-lg"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
          {/* Background Image Section */}
          <div
            className="hidden lg:flex lg:w-1/2 bg-cover bg-center relative"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1760553120312-2821bf54e767?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb25zdHJ1Y3Rpb24lMjBibHVlcHJpbnQlMjB0b29sc3xlbnwxfHx8fDE3NzI3MDU5MDR8MA&ixlib=rb-4.1.0&q=80&w=1080')`
            }}
          >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-blue-900/90"></div>
          <div className="relative h-full flex flex-col p-8 md:p-12 text-white">
            {/* Logo at top left */}
            <div className="mb-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Join FIX&BIN</h2>
              <p className="text-lg md:text-xl opacity-90">Your trusted handyman partner</p>
            </div>

            {/* Features in the middle */}
            <div className="space-y-4 mb-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h3 className="font-bold mb-2 text-base">For Customers</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Book professional services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Track your service requests</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Leave reviews & ratings</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h3 className="font-bold mb-2 text-base">For Workers</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Manage your job schedule</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Track job progress</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Build your reputation</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer text */}
            <div className="text-sm opacity-75">
              Join thousands of satisfied users across Metro Manila
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full lg:w-1/2 p-6 md:p-10 lg:p-12 overflow-y-auto max-h-screen">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-6 text-center">
            <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">FIX&BIN</h2>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h2>
            <p className="text-gray-600 dark:text-gray-400">Join FIX&BIN today</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 md:py-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-base transition-colors"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 md:py-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-base transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  className="w-full pl-11 pr-12 py-3.5 md:py-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-base transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Must be at least 6 characters</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={6}
                  className="w-full pl-11 pr-12 py-3.5 md:py-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-base transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    role === 'customer'
                      ? 'border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <User className="w-8 h-8 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                  <div className="font-medium text-gray-900 dark:text-white">Customer</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Book services</div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('worker')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    role === 'worker'
                      ? 'border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <Briefcase className="w-8 h-8 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                  <div className="font-medium text-gray-900 dark:text-white">Worker</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Provide services</div>
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
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
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