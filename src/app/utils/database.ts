import { projectId, publicAnonKey } from '/utils/supabase/info.tsx';
import { supabase } from './supabaseClient';

// For direct Supabase auth/storage operations, import the singleton client:
// import { supabase } from './supabaseClient';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-42111711`;

// Helper to get current access token
async function getAccessToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

// Database utility for FIX&BIN website
export const db = {
  // Auth operations
  auth: {
    async signup(userData: {
      email: string;
      password: string;
      name: string;
      role: 'customer' | 'worker';
      specialty?: string;
      phone?: string;
      bio?: string;
    }) {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(userData)
      });
      return response.json();
    },

    async syncUser() {
      const token = await getAccessToken();
      if (!token) {
        return { success: false, error: 'Not authenticated' };
      }

      const response = await fetch(`${API_URL}/auth/sync-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.json();
    }
  },

  // User operations
  users: {
    async create(userData: {
      email: string;
      name: string;
      role: 'customer' | 'worker';
      password: string;
      specialty?: string;
      phone?: string;
      bio?: string;
      avatar?: string;
    }) {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(userData)
      });
      return response.json();
    },

    async getById(userId: string) {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      return response.json();
    },

    async update(userId: string, updates: Partial<{
      name: string;
      phone: string;
      bio: string;
      avatar: string;
      specialty: string;
    }>) {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(updates)
      });
      return response.json();
    },

    async getWorkers(specialty?: string) {
      const url = specialty 
        ? `${API_URL}/users/workers?specialty=${specialty}`
        : `${API_URL}/users/workers`;
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      return response.json();
    }
  },

  // Service bookings
  bookings: {
    async create(bookingData: {
      customerId: string;
      workerId: string;
      serviceType: 'plumbing' | 'electrical' | 'carpentry';
      description: string;
      scheduledDate: string;
      address: string;
      phone: string;
    }) {
      const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(bookingData)
      });
      return response.json();
    },

    async getById(bookingId: string) {
      const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      return response.json();
    },

    async getByCustomer(customerId: string) {
      const response = await fetch(`${API_URL}/bookings/customer/${customerId}`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      return response.json();
    },

    async getByWorker(workerId: string) {
      const response = await fetch(`${API_URL}/bookings/worker/${workerId}`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      return response.json();
    },

    async updateStatus(bookingId: string, status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled') {
      const response = await fetch(`${API_URL}/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ status })
      });
      return response.json();
    }
  },

  // Reviews and ratings
  reviews: {
    async create(reviewData: {
      bookingId: string;
      customerId: string;
      workerId: string;
      rating: number;
      comment: string;
    }) {
      const response = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(reviewData)
      });
      return response.json();
    },

    async getByWorker(workerId: string) {
      const response = await fetch(`${API_URL}/reviews/worker/${workerId}`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      return response.json();
    },

    async getByCustomer(customerId: string) {
      const response = await fetch(`${API_URL}/reviews/customer/${customerId}`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      return response.json();
    }
  },

  // Messages
  messages: {
    async send(messageData: {
      senderId: string;
      receiverId: string;
      content: string;
      bookingId?: string;
    }) {
      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(messageData)
      });
      return response.json();
    },

    async getConversation(userId1: string, userId2: string) {
      const response = await fetch(`${API_URL}/messages/conversation/${userId1}/${userId2}`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      return response.json();
    },

    async getByUser(userId: string) {
      const response = await fetch(`${API_URL}/messages/user/${userId}`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      return response.json();
    }
  },

  // Job tracking
  tracking: {
    async updateLocation(trackingData: {
      workerId: string;
      bookingId: string;
      latitude: number;
      longitude: number;
      status: string;
    }) {
      const response = await fetch(`${API_URL}/tracking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(trackingData)
      });
      return response.json();
    },

    async getByBooking(bookingId: string) {
      const response = await fetch(`${API_URL}/tracking/${bookingId}`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      return response.json();
    }
  }
};