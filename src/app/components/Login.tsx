import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Mail, AlertCircle, X, Eye, EyeOff } from 'lucide-react';

interface LoginProps {
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export function Login({ onClose, onSwitchToRegister }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [googleError, setGoogleError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
      setError('Account not found. Please create an account first or use the demo login buttons below.');
    }
  };

  const handleDemoLogin = async (role: 'customer' | 'worker') => {
    setIsLoading(true);
    setError('');
    setGoogleError(false);

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
        errorMsg += 'Google authentication is not configured. Please use email/password or demo login.';
      } else if (err?.message?.includes('redirect')) {
        errorMsg += 'Redirect configuration issue. Please contact support or use email/password login.';
      } else {
        errorMsg += 'Please try email/password login or demo buttons below.';
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
              backgroundImage: `url('https://images.unsplash.com/photo-1503507739298-dce173d09653?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5keW1hbiUyMHRvb2xzJTIwd29ya2JlbmNoJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3MjcwNTkwM3ww&ixlib=rb-4.1.0&q=80&w=1080')`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-blue-900/90"></div>
            <div className="relative h-full flex flex-col p-8 md:p-12 text-white">
              {/* Logo at top left */}
              <div className="mb-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-2">FIX&BIN</h2>
                <p className="text-lg md:text-xl opacity-90">Professional Handyman Services</p>
              </div>

              {/* Features list in the middle */}
              <div className="space-y-4 mb-auto">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                  <span className="text-base">Expert Plumbing Services</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                  <span className="text-base">Professional Electrical Work</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                  <span className="text-base">Quality Carpentry Solutions</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                  <span className="text-base">Aircon & HVAC Services</span>
                </div>
              </div>

              {/* Footer text */}
              <div className="text-sm opacity-75">
                Trusted by thousands of homeowners across Metro Manila
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="w-full lg:w-1/2 p-6 md:p-10 lg:p-12 overflow-y-auto">
            {/* Mobile Logo */}
            <div className="lg:hidden mb-6 text-center">
              <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">FIX&BIN</h2>
            </div>

          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h2>
            <p className="text-gray-600 dark:text-gray-400">Log in to your FIX&BIN account</p>
          </div>

          {/* New User Info */}
          {!error && (
            <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>New here?</strong> Click <button onClick={onSwitchToRegister} className="underline font-semibold hover:text-blue-900 dark:hover:text-blue-200">Sign up</button> below to create an account, or try the demo buttons for instant access!
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:bg-gray-700"
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setError('Password reset feature coming soon!')}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-3.5 md:py-4 rounded-lg transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed font-medium text-base shadow-sm"
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          {/* Demo Login Buttons */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Try FIX&BIN Without Signing Up:</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">Click a demo button to explore the app instantly</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleDemoLogin('customer')}
                disabled={isLoading}
                className="px-4 py-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-700 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Demo Customer
              </button>
              <button
                onClick={() => handleDemoLogin('worker')}
                disabled={isLoading}
                className="px-4 py-3 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-700 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Demo Worker
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
              ✓ No email required • Instant access
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-base">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToRegister}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition-colors"
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