import { useState } from 'react';
import { Star, ThumbsUp, CheckCircle, Filter, Image as ImageIcon, ChevronDown, MessageSquare } from 'lucide-react';

interface Review {
  id: string;
  customer: string;
  service: string;
  date: string;
  ratings: {
    overall: number;
    quality: number;
    punctuality: number;
    professionalism: number;
    value: number;
  };
  comment: string;
  images?: string[];
  verified: boolean;
  helpful: number;
  workerResponse?: {
    name: string;
    date: string;
    message: string;
  };
}

const mockReviews: Review[] = [
  {
    id: 'REV-001',
    customer: 'Sarah Johnson',
    service: 'Kitchen Faucet Repair',
    date: '2026-03-03',
    ratings: {
      overall: 5,
      quality: 5,
      punctuality: 5,
      professionalism: 5,
      value: 5
    },
    comment: 'Absolutely fantastic service! The technician arrived right on time and fixed my leaking faucet in less than 30 minutes. Very professional and cleaned up everything afterward. The pricing was fair and transparent. Highly recommend FIX&BIN for any plumbing needs!',
    images: [
      'https://images.unsplash.com/photo-1635221798248-8a3452ad07cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbHVtYmVyJTIwZml4aW5nJTIwc2luayUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzI3MDUzOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    verified: true,
    helpful: 24,
    workerResponse: {
      name: 'FIX&BIN Team',
      date: '2026-03-04',
      message: 'Thank you so much for your kind words, Sarah! We\'re thrilled to hear you were satisfied with our service. Customer satisfaction is our top priority!'
    }
  },
  {
    id: 'REV-002',
    customer: 'Michael Chen',
    service: 'Ceiling Fan Installation',
    date: '2026-02-28',
    ratings: {
      overall: 5,
      quality: 5,
      punctuality: 5,
      professionalism: 5,
      value: 4
    },
    comment: 'Great job installing my ceiling fan! The worker was very knowledgeable and explained everything he was doing. He also gave me tips on maintaining the fan. The installation was clean and looks perfect. Will definitely use FIX&BIN again.',
    images: [
      'https://images.unsplash.com/photo-1649707088786-792340244a33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpY2lhbiUyMGluc3RhbGxpbmclMjBjZWlsaW5nJTIwZmFufGVufDF8fHx8MTc3MjcwNjk0M3ww&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    verified: true,
    helpful: 18,
    workerResponse: {
      name: 'FIX&BIN Team',
      date: '2026-02-29',
      message: 'We appreciate your feedback, Michael! Our team takes pride in providing quality workmanship and customer education. Looking forward to serving you again!'
    }
  },
  {
    id: 'REV-003',
    customer: 'Emily Davis',
    service: 'Cabinet Door Repair',
    date: '2026-02-25',
    ratings: {
      overall: 4,
      quality: 5,
      punctuality: 4,
      professionalism: 5,
      value: 4
    },
    comment: 'Very satisfied with the cabinet repair. The hinges are now working perfectly and the doors close smoothly. The technician was friendly and efficient. Only minor issue was arriving 15 minutes late, but he called ahead to let me know. Overall, excellent service!',
    images: [
      'https://images.unsplash.com/photo-1755870190789-113202c5096c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJwZW50ZXIlMjBpbnN0YWxsaW5nJTIwY2FiaW5ldHxlbnwxfHx8fDE3NzI3MDY5NDN8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    verified: true,
    helpful: 12
  },
  {
    id: 'REV-004',
    customer: 'David Martinez',
    service: 'Door Hinge Replacement',
    date: '2026-02-20',
    ratings: {
      overall: 5,
      quality: 5,
      punctuality: 5,
      professionalism: 5,
      value: 5
    },
    comment: 'Perfect service from start to finish! My squeaky bedroom door has been driving me crazy for months. The technician replaced the hinges quickly and now the door operates silently. He was professional, courteous, and even cleaned up all the work area. Five stars!',
    images: [
      'https://images.unsplash.com/photo-1634253539596-c09e082719c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5keW1hbiUyMGRvb3IlMjByZXBhaXIlMjB3b3JrfGVufDF8fHx8MTc3MjcwNjk0M3ww&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    verified: true,
    helpful: 15,
    workerResponse: {
      name: 'FIX&BIN Team',
      date: '2026-02-21',
      message: 'Thank you, David! We\'re happy we could resolve your squeaky door issue. Enjoy the peace and quiet!'
    }
  },
  {
    id: 'REV-005',
    customer: 'Lisa Anderson',
    service: 'Electrical Outlet Installation',
    date: '2026-02-15',
    ratings: {
      overall: 5,
      quality: 5,
      punctuality: 5,
      professionalism: 4,
      value: 5
    },
    comment: 'Needed an additional outlet in my home office and FIX&BIN delivered excellent service. The electrician was skilled and followed all safety protocols. The outlet works perfectly and was installed exactly where I wanted it. Pricing was very reasonable.',
    verified: true,
    helpful: 9
  },
  {
    id: 'REV-006',
    customer: 'James Wilson',
    service: 'Drywall Patching',
    date: '2026-02-10',
    ratings: {
      overall: 4,
      quality: 4,
      punctuality: 5,
      professionalism: 5,
      value: 4
    },
    comment: 'Good work patching up holes in my wall. The repair blends in well with the existing wall. The worker was on time and respectful of my home. Would have given 5 stars but the paint color match wasn\'t 100% perfect, though it\'s barely noticeable.',
    verified: true,
    helpful: 7
  }
];

export function Ratings() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | '5' | '4' | '3' | '2' | '1' | 'photos'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [helpfulClicks, setHelpfulClicks] = useState<Record<string, boolean>>({});

  // Calculate average ratings
  const averageRatings = {
    overall: mockReviews.reduce((sum, r) => sum + r.ratings.overall, 0) / mockReviews.length,
    quality: mockReviews.reduce((sum, r) => sum + r.ratings.quality, 0) / mockReviews.length,
    punctuality: mockReviews.reduce((sum, r) => sum + r.ratings.punctuality, 0) / mockReviews.length,
    professionalism: mockReviews.reduce((sum, r) => sum + r.ratings.professionalism, 0) / mockReviews.length,
    value: mockReviews.reduce((sum, r) => sum + r.ratings.value, 0) / mockReviews.length,
  };

  const ratingDistribution = {
    5: mockReviews.filter(r => r.ratings.overall === 5).length,
    4: mockReviews.filter(r => r.ratings.overall === 4).length,
    3: mockReviews.filter(r => r.ratings.overall === 3).length,
    2: mockReviews.filter(r => r.ratings.overall === 2).length,
    1: mockReviews.filter(r => r.ratings.overall === 1).length,
  };

  const filteredReviews = mockReviews.filter(review => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'photos') return review.images && review.images.length > 0;
    return review.ratings.overall === parseInt(selectedFilter);
  });

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };
    
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const handleHelpfulClick = (reviewId: string) => {
    setHelpfulClicks(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Customer Reviews</h1>
          <p className="text-xl text-gray-600">See what our customers say about FIX&BIN services</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Ratings Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-6xl font-bold text-gray-900 mb-2">
                  {averageRatings.overall.toFixed(1)}
                </div>
                {renderStars(Math.round(averageRatings.overall), 'lg')}
                <p className="text-gray-600 mt-2">Based on {mockReviews.length} reviews</p>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2 mb-6">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = ratingDistribution[rating as keyof typeof ratingDistribution];
                  const percentage = (count / mockReviews.length) * 100;
                  
                  return (
                    <button
                      key={rating}
                      onClick={() => setSelectedFilter(rating.toString() as any)}
                      className={`w-full flex items-center gap-2 hover:bg-gray-50 p-2 rounded transition-colors ${
                        selectedFilter === rating.toString() ? 'bg-blue-50' : ''
                      }`}
                    >
                      <span className="text-sm font-medium w-8">{rating} ★</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-8">{count}</span>
                    </button>
                  );
                })}
              </div>

              {/* Detailed Ratings */}
              <div className="border-t border-gray-200 pt-6 space-y-3">
                <h3 className="font-bold text-gray-900 mb-3">Detailed Ratings</h3>
                {Object.entries(averageRatings).slice(1).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 capitalize">{key}</span>
                      <span className="font-medium">{value.toFixed(1)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(value / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Filters */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full flex items-center justify-between text-left font-bold text-gray-900 mb-3"
                >
                  <span className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filters
                  </span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
                {showFilters && (
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedFilter('all')}
                      className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors ${
                        selectedFilter === 'all' ? 'bg-blue-50 text-blue-600 font-medium' : ''
                      }`}
                    >
                      All Reviews
                    </button>
                    <button
                      onClick={() => setSelectedFilter('photos')}
                      className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors flex items-center gap-2 ${
                        selectedFilter === 'photos' ? 'bg-blue-50 text-blue-600 font-medium' : ''
                      }`}
                    >
                      <ImageIcon className="w-4 h-4" />
                      With Photos
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-6">
            {filteredReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-lg p-6">
                {/* Review Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                      {review.customer.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900">{review.customer}</h3>
                        {review.verified && (
                          <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium">
                            <CheckCircle className="w-3 h-3" />
                            Verified
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{review.service}</p>
                      <p className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      {renderStars(review.ratings.overall, 'md')}
                      <span className="font-bold text-gray-900">{review.ratings.overall}.0</span>
                    </div>
                  </div>
                </div>

                {/* Detailed Ratings */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {Object.entries(review.ratings).slice(1).map(([key, value]) => (
                    <div key={key} className="text-center p-2 bg-gray-50 rounded">
                      <div className="text-sm text-gray-600 capitalize mb-1">{key}</div>
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-gray-900">{value}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Review Comment */}
                <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>

                {/* Review Images */}
                {review.images && review.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {review.images.map((image, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`Review photo ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-110 transition-transform cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Helpful Button */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleHelpfulClick(review.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      helpfulClicks[review.id]
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${helpfulClicks[review.id] ? 'fill-current' : ''}`} />
                    <span className="text-sm font-medium">
                      Helpful ({review.helpful + (helpfulClicks[review.id] ? 1 : 0)})
                    </span>
                  </button>
                </div>

                {/* Worker Response */}
                {review.workerResponse && (
                  <div className="mt-4 ml-8 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-gray-900">{review.workerResponse.name}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(review.workerResponse.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm">{review.workerResponse.message}</p>
                  </div>
                )}
              </div>
            ))}

            {filteredReviews.length === 0 && (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Reviews Found</h3>
                <p className="text-gray-600">No reviews match the selected filter.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
