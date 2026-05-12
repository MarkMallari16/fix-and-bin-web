// LocalStorage fallback for when database is not set up
import { ServiceProvider, Booking } from '../types/serviceProvider';

const PROVIDERS_KEY = 'fixbin_providers';
const BOOKINGS_KEY = 'fixbin_bookings';

// ==================== SERVICE PROVIDERS ====================

export function saveProviderToLocal(provider: ServiceProvider) {
  try {
    const providers = getProvidersFromLocal();
    const index = providers.findIndex(p => p.id === provider.id);

    if (index >= 0) {
      providers[index] = provider;
    } else {
      providers.push(provider);
    }

    localStorage.setItem(PROVIDERS_KEY, JSON.stringify(providers));
    return provider;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return null;
  }
}

export function getProvidersFromLocal(): ServiceProvider[] {
  try {
    const data = localStorage.getItem(PROVIDERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
}

export function getProviderByUserIdFromLocal(userId: string): ServiceProvider | null {
  try {
    const providers = getProvidersFromLocal();
    return providers.find(p => p.userId === userId) || null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
}

export function getProviderByIdFromLocal(id: string): ServiceProvider | null {
  try {
    const providers = getProvidersFromLocal();
    return providers.find(p => p.id === id) || null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
}

export function updateProviderInLocal(id: string, updates: Partial<ServiceProvider>): ServiceProvider | null {
  try {
    const providers = getProvidersFromLocal();
    const index = providers.findIndex(p => p.id === id);

    if (index >= 0) {
      providers[index] = { ...providers[index], ...updates };
      localStorage.setItem(PROVIDERS_KEY, JSON.stringify(providers));
      return providers[index];
    }

    return null;
  } catch (error) {
    console.error('Error updating in localStorage:', error);
    return null;
  }
}

// ==================== BOOKINGS ====================

export function saveBookingToLocal(booking: Booking) {
  try {
    const bookings = getBookingsFromLocal();
    bookings.push(booking);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    return booking;
  } catch (error) {
    console.error('Error saving booking to localStorage:', error);
    return null;
  }
}

export function getBookingsFromLocal(): Booking[] {
  try {
    const data = localStorage.getItem(BOOKINGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading bookings from localStorage:', error);
    return [];
  }
}

export function getBookingsByProviderIdFromLocal(providerId: string): Booking[] {
  try {
    const bookings = getBookingsFromLocal();
    return bookings.filter(b => b.providerId === providerId);
  } catch (error) {
    console.error('Error reading bookings from localStorage:', error);
    return [];
  }
}

export function getBookingsByCustomerIdFromLocal(customerId: string): Booking[] {
  try {
    const bookings = getBookingsFromLocal();
    return bookings.filter(b => b.customerId === customerId);
  } catch (error) {
    console.error('Error reading bookings from localStorage:', error);
    return [];
  }
}

export function updateBookingInLocal(id: string, updates: Partial<Booking>): Booking | null {
  try {
    const bookings = getBookingsFromLocal();
    const index = bookings.findIndex(b => b.id === id);

    if (index >= 0) {
      bookings[index] = { ...bookings[index], ...updates };
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
      return bookings[index];
    }

    return null;
  } catch (error) {
    console.error('Error updating booking in localStorage:', error);
    return null;
  }
}
