import { ServiceProvider } from '../types/serviceProvider';

export const mockProviders: ServiceProvider[] = [
  {
    id: 'provider-1',
    userId: 'user-provider-1',
    fullName: 'Carlos Mendoza',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    email: 'carlos.mendoza@fixbin.ph',
    phone: '09171234567',

    primarySpecialization: 'Electrician',
    secondarySkills: ['Aircon Technician'],
    yearsOfExperience: 8,
    bio: 'Licensed electrician with 8 years of experience in residential and commercial electrical work. Specialized in electrical troubleshooting, panel upgrades, and smart home installations.',

    certifications: [
      {
        id: 'cert-1',
        name: 'Licensed Electrician',
        issuedBy: 'Technical Education and Skills Development Authority (TESDA)',
        dateIssued: '2016-03-15'
      },
      {
        id: 'cert-2',
        name: 'Electrical Installation and Maintenance NC II',
        issuedBy: 'TESDA',
        dateIssued: '2015-11-20'
      }
    ],

    licenses: [
      {
        id: 'lic-1',
        type: 'Professional Electrician License',
        number: 'PEL-2016-001234',
        issuedBy: 'Professional Regulation Commission (PRC)',
        dateIssued: '2016-06-01',
        expiryDate: '2026-06-01',
        verified: true
      }
    ],

    trainingBackground: [
      'TESDA Electrical Installation Course',
      'Smart Home Technology Training',
      'Solar Panel Installation Workshop'
    ],

    servicesOffered: [
      {
        id: 'service-1',
        name: 'Electrical Wiring Installation',
        description: 'Complete electrical wiring for new construction or renovation',
        basePrice: 3500,
        estimatedDuration: '4-6 hours'
      },
      {
        id: 'service-2',
        name: 'Circuit Breaker Repair',
        description: 'Troubleshoot and repair faulty circuit breakers',
        basePrice: 1500,
        estimatedDuration: '1-2 hours'
      },
      {
        id: 'service-3',
        name: 'Aircon Installation',
        description: 'Professional aircon installation with warranty',
        basePrice: 2500,
        estimatedDuration: '2-3 hours'
      }
    ],

    portfolio: [
      {
        id: 'port-1',
        title: 'Complete House Rewiring',
        description: '3-bedroom house complete electrical rewiring project',
        imageUrl: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800',
        completedDate: '2024-10-15'
      },
      {
        id: 'port-2',
        title: 'Commercial Panel Upgrade',
        description: 'Office building electrical panel modernization',
        imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800',
        completedDate: '2024-09-20'
      }
    ],

    serviceAreas: ['Manila', 'Quezon City', 'Makati', 'Pasig'],
    location: {
      city: 'Manila',
      region: 'NCR'
    },

    priceRange: {
      min: 1500,
      max: 8000
    },
    startingRate: 1500,

    rating: 4.9,
    totalReviews: 127,
    completedJobs: 215,
    totalEarnings: 487500,

    reviews: [
      {
        id: 'rev-1',
        customerId: 'cust-1',
        customerName: 'Maria Santos',
        rating: 5,
        comment: 'Excellent work! Very professional and clean. Fixed our electrical issues quickly.',
        date: '2024-11-15',
        jobType: 'Circuit Breaker Repair'
      },
      {
        id: 'rev-2',
        customerId: 'cust-2',
        customerName: 'John Reyes',
        rating: 5,
        comment: 'Highly recommended! Carlos is very knowledgeable and explains everything clearly.',
        date: '2024-11-10',
        jobType: 'Electrical Wiring Installation'
      }
    ],

    status: 'approved',
    isVerified: true,
    isTopRated: true,

    joinedDate: '2023-01-10',
    lastActive: '2024-12-01'
  },

  {
    id: 'provider-2',
    userId: 'user-provider-2',
    fullName: 'Roberto "Bobby" Cruz',
    profilePhoto: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400',
    email: 'bobby.cruz@fixbin.ph',
    phone: '09182345678',

    primarySpecialization: 'Plumber',
    secondarySkills: [],
    yearsOfExperience: 12,
    bio: 'Master plumber with over 12 years of experience. Specializing in leak detection, pipe installation, and water system maintenance for residential and commercial properties.',

    certifications: [
      {
        id: 'cert-3',
        name: 'Plumbing NC II',
        issuedBy: 'TESDA',
        dateIssued: '2012-08-20'
      },
      {
        id: 'cert-4',
        name: 'Master Plumber Certification',
        issuedBy: 'Philippine Association of Plumbing and Mechanical Officials',
        dateIssued: '2018-05-10'
      }
    ],

    licenses: [
      {
        id: 'lic-2',
        type: 'Master Plumber License',
        number: 'MPL-2018-005678',
        issuedBy: 'PRC',
        dateIssued: '2018-07-01',
        expiryDate: '2027-07-01',
        verified: true
      }
    ],

    trainingBackground: [
      'TESDA Plumbing Technology Course',
      'Advanced Pipe Fitting Training',
      'Water Treatment Systems Seminar'
    ],

    servicesOffered: [
      {
        id: 'service-4',
        name: 'Leak Detection & Repair',
        description: 'Professional leak detection and permanent repair solutions',
        basePrice: 2000,
        estimatedDuration: '2-3 hours'
      },
      {
        id: 'service-5',
        name: 'Pipe Installation',
        description: 'Complete pipe installation for water supply and drainage',
        basePrice: 4000,
        estimatedDuration: '4-6 hours'
      },
      {
        id: 'service-6',
        name: 'Water Heater Installation',
        description: 'Professional water heater installation with testing',
        basePrice: 2500,
        estimatedDuration: '2-3 hours'
      }
    ],

    portfolio: [
      {
        id: 'port-3',
        title: 'Complete Bathroom Renovation',
        description: 'Full bathroom plumbing system installation',
        imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800',
        completedDate: '2024-11-01'
      }
    ],

    serviceAreas: ['Manila', 'Caloocan', 'Malabon', 'Valenzuela'],
    location: {
      city: 'Caloocan',
      region: 'NCR'
    },

    priceRange: {
      min: 2000,
      max: 10000
    },
    startingRate: 2000,

    rating: 4.8,
    totalReviews: 98,
    completedJobs: 182,
    totalEarnings: 395000,

    reviews: [
      {
        id: 'rev-3',
        customerId: 'cust-3',
        customerName: 'Anna Garcia',
        rating: 5,
        comment: 'Bobby fixed our persistent leak problem. Very thorough and professional!',
        date: '2024-11-20',
        jobType: 'Leak Detection & Repair'
      }
    ],

    status: 'approved',
    isVerified: true,
    isTopRated: true,

    joinedDate: '2023-02-15',
    lastActive: '2024-12-01'
  },

  {
    id: 'provider-3',
    userId: 'user-provider-3',
    fullName: 'Miguel "Mike" Santos',
    profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    email: 'mike.santos@fixbin.ph',
    phone: '09193456789',

    primarySpecialization: 'Carpenter',
    secondarySkills: ['Painter'],
    yearsOfExperience: 10,
    bio: 'Experienced carpenter specializing in custom furniture, cabinetry, and home renovations. Committed to quality craftsmanship and attention to detail.',

    certifications: [
      {
        id: 'cert-5',
        name: 'Carpentry NC II',
        issuedBy: 'TESDA',
        dateIssued: '2014-04-12'
      }
    ],

    licenses: [],

    trainingBackground: [
      'TESDA Carpentry Course',
      'Advanced Woodworking Training',
      'Interior Design Basics'
    ],

    servicesOffered: [
      {
        id: 'service-7',
        name: 'Custom Cabinet Making',
        description: 'Design and build custom cabinets for kitchen or storage',
        basePrice: 5000,
        estimatedDuration: '1-2 days'
      },
      {
        id: 'service-8',
        name: 'Furniture Repair',
        description: 'Repair and restoration of wooden furniture',
        basePrice: 1500,
        estimatedDuration: '2-4 hours'
      },
      {
        id: 'service-9',
        name: 'Door & Window Installation',
        description: 'Professional installation of doors and windows',
        basePrice: 3000,
        estimatedDuration: '3-5 hours'
      }
    ],

    portfolio: [
      {
        id: 'port-4',
        title: 'Custom Kitchen Cabinets',
        description: 'Modern kitchen cabinet installation with soft-close hinges',
        imageUrl: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800',
        completedDate: '2024-10-25'
      },
      {
        id: 'port-5',
        title: 'Wooden Deck Construction',
        description: 'Outdoor wooden deck with railings',
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        completedDate: '2024-09-15'
      }
    ],

    serviceAreas: ['Quezon City', 'Marikina', 'Pasig', 'San Juan'],
    location: {
      city: 'Quezon City',
      region: 'NCR'
    },

    priceRange: {
      min: 1500,
      max: 12000
    },
    startingRate: 1500,

    rating: 4.7,
    totalReviews: 76,
    completedJobs: 145,
    totalEarnings: 312000,

    reviews: [
      {
        id: 'rev-4',
        customerId: 'cust-4',
        customerName: 'Linda Tan',
        rating: 5,
        comment: 'Beautiful work on our kitchen cabinets! Mike is very skilled and creative.',
        date: '2024-10-30',
        jobType: 'Custom Cabinet Making'
      }
    ],

    status: 'approved',
    isVerified: true,
    isTopRated: false,

    joinedDate: '2023-03-20',
    lastActive: '2024-11-30'
  }
];
