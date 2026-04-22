import { useState, useEffect } from 'react';
import { Database, CheckCircle, AlertCircle, RefreshCw, ExternalLink, Info, Copy, Check } from 'lucide-react';
import { projectId } from '/utils/supabase/info.tsx';

export function SupabaseStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'ready-to-deploy'>('checking');
  const [showDetails, setShowDetails] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const healthUrl = `https://${projectId}.supabase.co/functions/v1/make-server-42111711/health`;

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setStatus('checking');
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(
        healthUrl,
        { 
          signal: controller.signal,
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        setStatus(data.status === 'ok' ? 'connected' : 'ready-to-deploy');
      } else {
        setStatus('ready-to-deploy');
      }
    } catch (error) {
      setStatus('ready-to-deploy');
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return 'bg-green-50 text-green-700 hover:bg-green-100 border-green-200';
      case 'ready-to-deploy': return 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200';
      default: return 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'checking': return 'Checking...';
      case 'connected': return 'Backend Active';
      case 'ready-to-deploy': return 'Setup Optional';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'checking': return <RefreshCw className="w-3 h-3 animate-spin" />;
      case 'connected': return <CheckCircle className="w-3 h-3" />;
      case 'ready-to-deploy': return <Info className="w-3 h-3" />;
    }
  };

  const copyHealthUrl = async () => {
    try {
      await navigator.clipboard.writeText(healthUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${getStatusColor()}`}
        title="Backend setup information"
      >
        {getStatusIcon()}
        <Database className="w-3 h-3" />
        <span>{getStatusText()}</span>
      </button>

      {showDetails && (
        <div className="absolute top-full right-0 mt-2 w-[420px] bg-white rounded-lg shadow-2xl border-2 border-gray-200 p-5 z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-lg">Backend Setup</h3>
            <button
              onClick={() => setShowDetails(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>

          {status === 'connected' ? (
            <div className="mb-4 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-green-900 mb-1">✅ Backend Operational!</p>
                  <p className="text-xs text-green-800">
                    Your Supabase backend is fully deployed and working. All authentication and database features are available.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-blue-900 mb-2">Backend Setup Available</p>
                  <p className="text-xs text-blue-800 mb-3">
                    Your app currently works without a backend. To enable user accounts, authentication, and data persistence, you can optionally deploy the backend manually.
                  </p>
                  
                  <div className="bg-white/50 rounded p-3 mb-3">
                    <p className="text-xs font-semibold text-blue-900 mb-2">What you get with backend:</p>
                    <ul className="text-xs text-blue-800 space-y-1 ml-3">
                      <li>• User registration & login</li>
                      <li>• Worker profiles & ratings</li>
                      <li>• Booking system</li>
                      <li>• Messaging & tracking</li>
                      <li>• Data persistence</li>
                    </ul>
                  </div>

                  <a
                    href="https://github.com/supabase/supabase"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium w-full justify-center"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Learn About Supabase Backend
                  </a>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 font-medium">Current Mode:</span>
              <span className={`font-bold text-xs px-2 py-1 rounded ${
                status === 'connected' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {status === 'connected' ? '🟢 Full Backend' : '🔵 Frontend Only'}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 font-medium">Project ID:</span>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">{projectId}</code>
            </div>
          </div>

          <div className="border-t pt-3 mb-4">
            <p className="text-xs font-semibold text-gray-700 mb-2">Current Features:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span className="text-gray-700">Browse Services</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span className="text-gray-700">View Tutorials</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span className="text-gray-700">Contact Form</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span className="text-gray-700">Worker Cards</span>
              </div>
              <div className="flex items-center gap-1.5">
                {status === 'connected' ? (
                  <CheckCircle className="w-3 h-3 text-green-600" />
                ) : (
                  <AlertCircle className="w-3 h-3 text-gray-400" />
                )}
                <span className={status === 'connected' ? 'text-gray-700' : 'text-gray-400'}>User Accounts</span>
              </div>
              <div className="flex items-center gap-1.5">
                {status === 'connected' ? (
                  <CheckCircle className="w-3 h-3 text-green-600" />
                ) : (
                  <AlertCircle className="w-3 h-3 text-gray-400" />
                )}
                <span className={status === 'connected' ? 'text-gray-700' : 'text-gray-400'}>Data Storage</span>
              </div>
            </div>
          </div>

          <button
            onClick={checkConnection}
            disabled={status === 'checking'}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2 shadow-md hover:shadow-lg mb-3"
          >
            <RefreshCw className={`w-4 h-4 ${status === 'checking' ? 'animate-spin' : ''}`} />
            {status === 'checking' ? 'Checking...' : 'Check Backend Status'}
          </button>

          <div className="text-center pt-3 border-t">
            <p className="text-xs text-gray-600 mb-2">
              {status === 'connected' 
                ? 'Manage your backend in Supabase Dashboard'
                : 'App works great without backend. Deploy when ready!'}
            </p>
            <a
              href={`https://supabase.com/dashboard/project/${projectId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1"
            >
              {status === 'connected' ? 'Open Dashboard' : 'View Supabase Project'}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="text-center pt-3 border-t">
            <p className="text-xs text-gray-600 mb-2">Health URL:</p>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">{healthUrl}</code>
              <button
                onClick={copyHealthUrl}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                {copiedUrl ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}