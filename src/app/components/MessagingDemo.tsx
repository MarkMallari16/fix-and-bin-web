import { MessageCircle, Phone, MapPin, Bell, CheckCheck } from 'lucide-react';

export function MessagingDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-block p-4 bg-blue-100 rounded-full mb-6">
            <MessageCircle className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Real-Time Messaging System
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Chat with workers, track their location, and get instant notifications
          </p>
          <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-medium">
            <Bell className="w-5 h-5" />
            Click "Messages" in the header to start chatting
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Live Chat</h3>
            <p className="text-gray-600 mb-4">
              Real-time messaging between customers and workers with instant delivery notifications and read receipts.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCheck className="w-4 h-4 text-green-500" />
                Message status tracking
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCheck className="w-4 h-4 text-green-500" />
                Sent, delivered, and read indicators
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCheck className="w-4 h-4 text-green-500" />
                Modern chat bubbles with timestamps
              </li>
            </ul>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Online Status</h3>
            <p className="text-gray-600 mb-4">
              See when workers are online, offline, or on their way to your location in real-time.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                Online indicator
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-2 h-2 bg-gray-400 rounded-full" />
                Offline with last seen time
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                "On the way" status
              </li>
            </ul>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Quick Call</h3>
            <p className="text-gray-600 mb-4">
              Call workers directly from the chat with one click using the phone button in the header.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCheck className="w-4 h-4 text-green-500" />
                One-click calling
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCheck className="w-4 h-4 text-green-500" />
                Direct phone integration
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCheck className="w-4 h-4 text-green-500" />
                Worker phone numbers ready
              </li>
            </ul>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Live Location</h3>
            <p className="text-gray-600 mb-4">
              Track worker location in real-time when they're on the way with ETA and distance updates.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCheck className="w-4 h-4 text-green-500" />
                Real-time location tracking
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCheck className="w-4 h-4 text-green-500" />
                ETA and distance display
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCheck className="w-4 h-4 text-green-500" />
                Interactive map view
              </li>
            </ul>
          </div>
        </div>

        {/* How to Use */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-6">How to Use the Messaging System</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-semibold mb-1">Login to Your Account</h4>
                <p className="text-blue-100">Click the Login button and sign in to access the messaging system.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-semibold mb-1">Navigate to Messages</h4>
                <p className="text-blue-100">Click "Messages" in the header navigation to open the chat interface.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-semibold mb-1">Select a Worker</h4>
                <p className="text-blue-100">Choose a worker from the contacts list to start chatting.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h4 className="font-semibold mb-1">Start Messaging</h4>
                <p className="text-blue-100">Type your message and click send. View location if worker is on the way!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Features */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Additional Features</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Bell className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Notifications</h4>
              <p className="text-sm text-gray-600">Get instant alerts for new messages</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCheck className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Read Receipts</h4>
              <p className="text-sm text-gray-600">Know when messages are read</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">GPS Tracking</h4>
              <p className="text-sm text-gray-600">Real-time worker location</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Phone className="w-8 h-8 text-yellow-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Direct Calling</h4>
              <p className="text-sm text-gray-600">One-click phone calls</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
