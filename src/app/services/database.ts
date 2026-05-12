import { supabase } from '../utils/supabaseClient';
import { ServiceProvider, Booking, Certification, License, PortfolioItem, ServiceOffered } from '../types/serviceProvider';
import * as localStore from './localStorage';

// Check if database is available
let isDatabaseAvailable = true;

async function checkDatabase() {
  try {
    const { error } = await supabase.from('service_providers').select('id').limit(1);
    isDatabaseAvailable = !error || error.code !== 'PGRST205';
  } catch {
    isDatabaseAvailable = false;
  }
  return isDatabaseAvailable;
}

// ==================== SERVICE PROVIDERS ====================

export async function createServiceProvider(provider: Omit<ServiceProvider, 'id' | 'joinedDate' | 'lastActive'>) {
  // Check database availability
  const dbAvailable = await checkDatabase();

  if (!dbAvailable) {
    console.log('Using localStorage for provider profile');
    const localProvider: ServiceProvider = {
      ...provider,
      id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      joinedDate: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };
    return localStore.saveProviderToLocal(localProvider);
  }

  try {
    const { data, error } = await supabase
      .from('service_providers')
      .insert([{
        user_id: provider.userId,
        full_name: provider.fullName,
        profile_photo: provider.profilePhoto,
        email: provider.email,
        phone: provider.phone,
        primary_specialization: provider.primarySpecialization,
        secondary_skills: provider.secondarySkills || [],
        years_of_experience: provider.yearsOfExperience,
        bio: provider.bio,
        certifications: provider.certifications,
        licenses: provider.licenses,
        training_background: provider.trainingBackground,
        services_offered: provider.servicesOffered,
        portfolio: provider.portfolio,
        service_areas: provider.serviceAreas,
        location: provider.location,
        price_range: provider.priceRange,
        starting_rate: provider.startingRate,
        rating: provider.rating || 0,
        total_reviews: provider.totalReviews || 0,
        completed_jobs: provider.completedJobs || 0,
        total_earnings: provider.totalEarnings || 0,
        reviews: provider.reviews || [],
        status: provider.status || 'approved',
        is_verified: provider.isVerified || false,
        is_top_rated: provider.isTopRated || false
      }])
      .select()
      .single();

    if (error) {
      // Check if it's a duplicate key error
      if (error.code === '23505') {
        console.log('Provider profile already exists for this user');
        return null;
      }
      console.error('Database error creating provider:', error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error creating provider:', error);
    return null; // Return null instead of throwing on network errors
  }
}

export async function getServiceProviders(filters?: {
  specialization?: string;
  serviceArea?: string;
  status?: string;
}) {
  // Check database availability
  const dbAvailable = await checkDatabase();

  if (!dbAvailable) {
    console.log('Using localStorage for providers list');
    let providers = localStore.getProvidersFromLocal();

    // Apply filters
    if (filters?.status) {
      providers = providers.filter(p => p.status === filters.status);
    }
    if (filters?.specialization && filters.specialization !== 'all') {
      providers = providers.filter(p =>
        p.primarySpecialization === filters.specialization ||
        p.secondarySkills?.includes(filters.specialization as any)
      );
    }
    if (filters?.serviceArea && filters.serviceArea !== 'all') {
      providers = providers.filter(p => p.serviceAreas.includes(filters.serviceArea!));
    }

    return providers.sort((a, b) => b.rating - a.rating);
  }

  try {
    let query = supabase
      .from('service_providers')
      .select('*');

    if (filters?.specialization && filters.specialization !== 'all') {
      query = query.eq('primary_specialization', filters.specialization);
    }

    if (filters?.serviceArea && filters.serviceArea !== 'all') {
      query = query.contains('service_areas', [filters.serviceArea]);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    } else {
      // Default to approved only
      query = query.eq('status', 'approved');
    }

    const { data, error } = await query.order('rating', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return []; // Return empty array instead of throwing
    }

    // Transform database format to ServiceProvider type
    return (data || []).map(transformDbToProvider);
  } catch (error) {
    console.error('Error fetching providers:', error);
    return []; // Return empty array on network errors
  }
}

export async function getServiceProviderById(id: string) {
  const { data, error } = await supabase
    .from('service_providers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return transformDbToProvider(data);
}

export async function getServiceProviderByUserId(userId: string) {
  // Check database availability
  const dbAvailable = await checkDatabase();

  if (!dbAvailable) {
    console.log('Using localStorage for provider profile');
    return localStore.getProviderByUserIdFromLocal(userId);
  }

  try {
    const { data, error } = await supabase
      .from('service_providers')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows found
      console.error('Database error fetching provider:', error);
      return null;
    }
    return data ? transformDbToProvider(data) : null;
  } catch (error) {
    console.error('Error fetching provider by user ID:', error);
    return null;
  }
}

export async function updateServiceProvider(id: string, updates: Partial<ServiceProvider>) {
  // Check database availability
  const dbAvailable = await checkDatabase();

  if (!dbAvailable) {
    console.log('Using localStorage for provider update');
    return localStore.updateProviderInLocal(id, updates);
  }

  const dbUpdates: any = {};

  if (updates.fullName) dbUpdates.full_name = updates.fullName;
  if (updates.profilePhoto !== undefined) dbUpdates.profile_photo = updates.profilePhoto;
  if (updates.email) dbUpdates.email = updates.email;
  if (updates.phone) dbUpdates.phone = updates.phone;
  if (updates.primarySpecialization) dbUpdates.primary_specialization = updates.primarySpecialization;
  if (updates.secondarySkills !== undefined) dbUpdates.secondary_skills = updates.secondarySkills;
  if (updates.yearsOfExperience !== undefined) dbUpdates.years_of_experience = updates.yearsOfExperience;
  if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
  if (updates.certifications !== undefined) dbUpdates.certifications = updates.certifications;
  if (updates.licenses !== undefined) dbUpdates.licenses = updates.licenses;
  if (updates.trainingBackground !== undefined) dbUpdates.training_background = updates.trainingBackground;
  if (updates.servicesOffered !== undefined) dbUpdates.services_offered = updates.servicesOffered;
  if (updates.portfolio !== undefined) dbUpdates.portfolio = updates.portfolio;
  if (updates.serviceAreas !== undefined) dbUpdates.service_areas = updates.serviceAreas;
  if (updates.location !== undefined) dbUpdates.location = updates.location;
  if (updates.priceRange !== undefined) dbUpdates.price_range = updates.priceRange;
  if (updates.startingRate !== undefined) dbUpdates.starting_rate = updates.startingRate;
  if (updates.status !== undefined) dbUpdates.status = updates.status;

  dbUpdates.last_active = new Date().toISOString();

  const { data, error } = await supabase
    .from('service_providers')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return transformDbToProvider(data);
}

// ==================== BOOKINGS ====================

export async function createBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) {
  // Check if provider ID is from mock data (not a real UUID)
  const isMockProvider = booking.providerId.startsWith('provider-') ||
                         booking.providerId.startsWith('local-') ||
                         !isValidUUID(booking.providerId);

  // Check database availability
  const dbAvailable = await checkDatabase();

  // Use localStorage if database is not available OR provider is mock
  if (!dbAvailable || isMockProvider) {
    console.log('Using localStorage for booking (mock provider or database not available)');
    const localBooking: Booking = {
      ...booking,
      id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return localStore.saveBookingToLocal(localBooking);
  }

  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        customer_id: booking.customerId,
        customer_name: booking.customerName,
        customer_phone: booking.customerPhone,
        customer_address: booking.customerAddress,
        provider_id: booking.providerId,
        provider_name: booking.providerName,
        service_type: booking.serviceType,
        service_description: booking.serviceDescription,
        scheduled_date: booking.scheduledDate,
        scheduled_time: booking.scheduledTime,
        status: booking.status,
        price: booking.price,
        payment_method: booking.paymentMethod,
        payment_status: booking.paymentStatus
      }])
      .select()
      .single();

    if (error) {
      console.error('Database error creating booking:', error);
      // Fallback to localStorage on database error
      console.log('Falling back to localStorage');
      const localBooking: Booking = {
        ...booking,
        id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return localStore.saveBookingToLocal(localBooking);
    }
    return transformDbToBooking(data);
  } catch (error) {
    console.error('Error creating booking:', error);
    // Fallback to localStorage on any error
    console.log('Falling back to localStorage');
    const localBooking: Booking = {
      ...booking,
      id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return localStore.saveBookingToLocal(localBooking);
  }
}

// Helper function to validate UUID
function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

export async function getBookingsByCustomerId(customerId: string) {
  // Check database availability
  const dbAvailable = await checkDatabase();

  if (!dbAvailable) {
    console.log('Using localStorage for customer bookings');
    return localStore.getBookingsByCustomerIdFromLocal(customerId);
  }

  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error fetching customer bookings:', error);
      // Fallback to localStorage
      return localStore.getBookingsByCustomerIdFromLocal(customerId);
    }
    return (data || []).map(transformDbToBooking);
  } catch (error) {
    console.error('Error fetching customer bookings:', error);
    // Fallback to localStorage
    return localStore.getBookingsByCustomerIdFromLocal(customerId);
  }
}

export async function getBookingsByProviderId(providerId: string) {
  // Check database availability
  const dbAvailable = await checkDatabase();

  if (!dbAvailable) {
    console.log('Using localStorage for bookings');
    return localStore.getBookingsByProviderIdFromLocal(providerId);
  }

  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('provider_id', providerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error fetching bookings:', error);
      return [];
    }
    return (data || []).map(transformDbToBooking);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
}

export async function updateBookingStatus(id: string, status: Booking['status']) {
  // Check if booking ID is local (not a real UUID)
  const isLocalBooking = id.startsWith('local-') || !isValidUUID(id);

  // Check database availability
  const dbAvailable = await checkDatabase();

  // Use localStorage if database is not available OR booking is local
  if (!dbAvailable || isLocalBooking) {
    console.log('Using localStorage for booking update');
    return localStore.updateBookingInLocal(id, { status, updatedAt: new Date().toISOString() });
  }

  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Database error updating booking:', error);
      // Fallback to localStorage
      return localStore.updateBookingInLocal(id, { status, updatedAt: new Date().toISOString() });
    }
    return transformDbToBooking(data);
  } catch (error) {
    console.error('Error updating booking:', error);
    // Fallback to localStorage
    return localStore.updateBookingInLocal(id, { status, updatedAt: new Date().toISOString() });
  }
}

export async function updateBooking(id: string, updates: Partial<Booking>) {
  const dbUpdates: any = { updated_at: new Date().toISOString() };

  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.paymentStatus !== undefined) dbUpdates.payment_status = updates.paymentStatus;
  if (updates.scheduledDate !== undefined) dbUpdates.scheduled_date = updates.scheduledDate;
  if (updates.scheduledTime !== undefined) dbUpdates.scheduled_time = updates.scheduledTime;

  const { data, error } = await supabase
    .from('bookings')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return transformDbToBooking(data);
}

// ==================== HELPER FUNCTIONS ====================

function transformDbToProvider(data: any): ServiceProvider {
  return {
    id: data.id,
    userId: data.user_id,
    fullName: data.full_name,
    profilePhoto: data.profile_photo,
    email: data.email,
    phone: data.phone,
    primarySpecialization: data.primary_specialization,
    secondarySkills: data.secondary_skills || [],
    yearsOfExperience: data.years_of_experience,
    bio: data.bio,
    certifications: data.certifications || [],
    licenses: data.licenses || [],
    trainingBackground: data.training_background || [],
    servicesOffered: data.services_offered || [],
    portfolio: data.portfolio || [],
    serviceAreas: data.service_areas || [],
    location: data.location,
    priceRange: data.price_range,
    startingRate: data.starting_rate,
    rating: data.rating || 0,
    totalReviews: data.total_reviews || 0,
    completedJobs: data.completed_jobs || 0,
    totalEarnings: data.total_earnings || 0,
    reviews: data.reviews || [],
    status: data.status,
    isVerified: data.is_verified,
    isTopRated: data.is_top_rated,
    joinedDate: data.created_at,
    lastActive: data.last_active || data.updated_at || data.created_at
  };
}

function transformDbToBooking(data: any): Booking {
  return {
    id: data.id,
    customerId: data.customer_id,
    customerName: data.customer_name,
    customerPhone: data.customer_phone,
    customerAddress: data.customer_address,
    providerId: data.provider_id,
    providerName: data.provider_name,
    serviceType: data.service_type,
    serviceDescription: data.service_description,
    scheduledDate: data.scheduled_date,
    scheduledTime: data.scheduled_time,
    status: data.status,
    price: data.price,
    paymentMethod: data.payment_method,
    paymentStatus: data.payment_status,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}
