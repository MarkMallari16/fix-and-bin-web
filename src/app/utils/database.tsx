// Database utilities for FIX&BIN application
// Using Supabase backend API

import { projectId, publicAnonKey } from '/utils/supabase/info.tsx';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-42111711`;

// Database operations wrapper
export const db = {
  // Test database connection
  async testConnection() {
    try {
      const response = await fetch(`${API_URL}/health`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  // Get user by ID
  async getUser(userId: string) {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  // Update user
  async updateUser(userId: string, updates: any) {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(updates)
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  // Get all workers
  async getWorkers(specialty?: string) {
    try {
      const url = specialty 
        ? `${API_URL}/users/workers?specialty=${specialty}`
        : `${API_URL}/users/workers`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  // Create booking
  async createBooking(bookingData: any) {
    try {
      const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(bookingData)
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  // Get bookings by customer
  async getCustomerBookings(customerId: string) {
    try {
      const response = await fetch(`${API_URL}/bookings/customer/${customerId}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  // Get bookings by worker
  async getWorkerBookings(workerId: string) {
    try {
      const response = await fetch(`${API_URL}/bookings/worker/${workerId}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  // Update booking status
  async updateBookingStatus(bookingId: string, status: string) {
    try {
      const response = await fetch(`${API_URL}/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ status })
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  // Create review
  async createReview(reviewData: any) {
    try {
      const response = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(reviewData)
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  // Get reviews by worker
  async getWorkerReviews(workerId: string) {
    try {
      const response = await fetch(`${API_URL}/reviews/worker/${workerId}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  // Send message
  async sendMessage(messageData: any) {
    try {
      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(messageData)
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  // Get conversation between two users
  async getConversation(userId1: string, userId2: string) {
    try {
      const response = await fetch(`${API_URL}/messages/conversation/${userId1}/${userId2}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  // Update tracking
  async updateTracking(trackingData: any) {
    try {
      const response = await fetch(`${API_URL}/tracking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(trackingData)
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  // Get tracking by booking
  async getTracking(bookingId: string) {
    try {
      const response = await fetch(`${API_URL}/tracking/${bookingId}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }
};
