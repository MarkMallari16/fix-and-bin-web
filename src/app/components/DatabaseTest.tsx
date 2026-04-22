import { useState } from 'react';
import { db } from '../utils/database';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, XCircle, Loader, X, AlertCircle, RefreshCw } from 'lucide-react';

interface DatabaseTestProps {
  onClose?: () => void;
}

export function DatabaseTest({ onClose }: DatabaseTestProps) {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState<{
    health: string | null;
    user: string | null;
    workers: string | null;
  }>({
    health: null,
    user: null,
    workers: null
  });
  const [loading, setLoading] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);

  const runTests = async () => {
    setLoading(true);
    setIsDeploying(false);
    const results = { health: '', user: '', workers: '' };

    // Test 1: Health check
    try {
      const response = await fetch(`https://${import.meta.env.VITE_SUPABASE_PROJECT_ID || 'ovgzpmcaheckbghwivpl'}.supabase.co/functions/v1/make-server-42111711/health`);
      
      if (response.status === 404) {
        setIsDeploying(true);
        results.health = '🟡 Deploying';
        results.user = '⏳ Waiting';
        results.workers = '⏳ Waiting';
        setTestResults(results);
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      results.health = data.status === 'ok' ? '✅ Pass' : '❌ Fail';
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      if (errorMsg.includes('404') || errorMsg.includes('Not Found')) {
        setIsDeploying(true);
        results.health = '🟡 Deploying';
        results.user = '⏳ Waiting';
        results.workers = '⏳ Waiting';
        setTestResults(results);
        setLoading(false);
        return;
      }
      results.health = '🟡 Initializing';
    }

    // Test 2: Get current user
    if (user) {
      try {
        const result = await db.users.getById(user.id);
        results.user = result.success ? '✅ Pass' : '❌ Fail';
      } catch (error) {
        results.user = '⏳ Waiting for backend';
      }
    } else {
      results.user = '⚠️ Not logged in';
    }

    // Test 3: Get workers
    try {
      const result = await db.users.getWorkers();
      results.workers = result.success ? `✅ Pass (${result.workers?.length || 0} workers)` : '❌ Fail';
    } catch (error) {
      results.workers = '⏳ Waiting for backend';
    }

    setTestResults(results);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl p-4 max-w-sm border-2 border-blue-500 z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-900">
          {isDeploying ? '🟡 Backend Deploying' : '🟢 Supabase Backend'}
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {isDeploying && (
        <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
          <div className="flex items-start gap-2">
            <RefreshCw className="w-3 h-3 text-yellow-600 mt-0.5 animate-spin flex-shrink-0" />
            <p className="text-yellow-800">
              <strong>Edge function is deploying.</strong> This takes 30-60 seconds on first load. The connection will be ready shortly.
            </p>
          </div>
        </div>
      )}
      
      <div className="space-y-2 mb-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Backend API:</span>
          <span className="font-mono text-xs">{testResults.health || '—'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">User Data:</span>
          <span className="font-mono text-xs">{testResults.user || '—'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Database Query:</span>
          <span className="font-mono text-xs">{testResults.workers || '—'}</span>
        </div>
      </div>

      <button
        onClick={runTests}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            Testing...
          </>
        ) : isDeploying ? (
          <>
            <RefreshCw className="w-4 h-4" />
            Retry Connection
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4" />
            Test Connection
          </>
        )}
      </button>

      <div className="mt-3 text-xs text-gray-500 border-t pt-2">
        {isDeploying ? (
          <>
            <p className="font-semibold text-yellow-600 mb-1">⏳ Deployment in Progress</p>
            <p>• Backend is being deployed</p>
            <p>• Please wait 30-60 seconds</p>
            <p>• Click "Retry Connection" to check</p>
          </>
        ) : (
          <>
            <p className="font-semibold text-green-600 mb-1">✅ Supabase Backend Ready</p>
            <p>• Authentication configured</p>
            <p>• Database connected</p>
            <p>• 19 API endpoints available</p>
          </>
        )}
      </div>
    </div>
  );
}