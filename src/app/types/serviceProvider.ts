export type Specialization =
  | 'Electrician'
  | 'Plumber'
  | 'Carpenter'
  | 'Aircon Technician'
  | 'Painter'
  | 'Mason'
  | 'Welder'
  | 'Appliance Repair'
  | 'HVAC Specialist';

export interface Certification {
  id: string;
  name: string;
  issuedBy: string;
  dateIssued: string;
  expiryDate?: string;
  documentUrl?: string;
}

export interface License {
  id: string;
  type: string;
  number: string;
  issuedBy: string;
  dateIssued: string;
  expiryDate?: string;
  verified: boolean;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  completedDate: string;
}

export interface ServiceOffered {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  estimatedDuration: string;
}

export interface Review {
  id: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  jobType: string;
}

export interface ServiceProvider {
  id: string;
  userId: string;

  // Basic Info
  fullName: string;
  profilePhoto?: string;
  email: string;
  phone: string;

  // Professional Info
  primarySpecialization: Specialization;
  secondarySkills?: Specialization[];
  yearsOfExperience: number;
  bio: string;

  // Credentials
  certifications: Certification[];
  licenses: License[];
  trainingBackground: string[];

  // Services & Portfolio
  servicesOffered: ServiceOffered[];
  portfolio: PortfolioItem[];

  // Location & Availability
  serviceAreas: string[];
  location: {
    city: string;
    region: string;
  };

  // Pricing
  priceRange: {
    min: number;
    max: number;
  };
  startingRate: number;

  // Stats
  rating: number;
  totalReviews: number;
  completedJobs: number;
  totalEarnings: number;

  // Reviews
  reviews: Review[];

  // Status
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  isVerified: boolean;
  isTopRated: boolean;

  // Dates
  joinedDate: string;
  lastActive: string;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;

  providerId: string;
  providerName: string;

  serviceType: string;
  serviceDescription: string;

  scheduledDate: string;
  scheduledTime: string;

  status: 'pending' | 'accepted' | 'rejected' | 'in-progress' | 'completed' | 'cancelled';

  price: number;
  paymentMethod: 'cash' | 'card' | 'gcash' | 'paymaya';
  paymentStatus: 'pending' | 'paid' | 'refunded';

  createdAt: string;
  updatedAt: string;
}

export interface ProviderEarnings {
  providerId: string;
  totalEarnings: number;
  thisMonthEarnings: number;
  lastMonthEarnings: number;
  pendingPayouts: number;
  completedJobs: number;
  earnings: Array<{
    bookingId: string;
    amount: number;
    date: string;
    status: 'completed' | 'pending';
  }>;
}
