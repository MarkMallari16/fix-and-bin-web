import { useState } from 'react';
import { Search, Wrench, Zap, Hammer, ArrowRight, AlertCircle } from 'lucide-react';

interface SearchResultsProps {
  searchQuery: string;
}

const allServices = [
  {
    title: 'Plumbing Services',
    icon: Wrench,
    color: 'blue',
    items: [
      'Leaky Faucet Repair',
      'Drain Cleaning & Unclogging',
      'Toilet Repair & Installation',
      'Water Heater Services',
      'Pipe Leak Detection',
      'Garbage Disposal Repair',
      'Low Water Pressure Fix',
      'Shower Head Replacement'
    ]
  },
  {
    title: 'Electrical Services',
    icon: Zap,
    color: 'yellow',
    items: [
      'Light Switch Replacement',
      'Outlet Installation',
      'Ceiling Fan Installation',
      'Circuit Breaker Repair',
      'Light Fixture Installation',
      'Electrical Safety Inspections',
      'Smoke Detector Installation',
      'Wiring Repairs'
    ]
  },
  {
    title: 'Carpentry Services',
    icon: Hammer,
    color: 'orange',
    items: [
      'Door Repair & Installation',
      'Cabinet Repair',
      'Drywall Patching',
      'Trim & Molding Installation',
      'Floating Shelf Installation',
      'Furniture Assembly',
      'Deck Repair',
      'Custom Woodwork'
    ]
  }
];

const allTutorials = [
  { title: 'How to Fix a Leaky Faucet', category: 'Plumbing', difficulty: 'Easy' },
  { title: 'Unclogging a Drain', category: 'Plumbing', difficulty: 'Easy' },
  { title: 'Running Toilet Repair', category: 'Plumbing', difficulty: 'Medium' },
  { title: 'Fixing Low Water Pressure', category: 'Plumbing', difficulty: 'Easy' },
  { title: 'Replacing a Shower Head', category: 'Plumbing', difficulty: 'Easy' },
  { title: 'Replacing a Light Switch', category: 'Electrical', difficulty: 'Medium' },
  { title: 'Reset a Tripped Circuit Breaker', category: 'Electrical', difficulty: 'Easy' },
  { title: 'Changing a Light Bulb Safely', category: 'Electrical', difficulty: 'Easy' },
  { title: 'Installing a Ceiling Fan', category: 'Electrical', difficulty: 'Hard' },
  { title: 'Replacing an Outlet', category: 'Electrical', difficulty: 'Medium' },
  { title: 'Fixing a Squeaky Door', category: 'Carpentry', difficulty: 'Easy' },
  { title: 'Patching a Hole in Drywall', category: 'Carpentry', difficulty: 'Medium' },
  { title: 'Tightening Loose Cabinet Handles', category: 'Carpentry', difficulty: 'Easy' },
  { title: 'Fixing a Sticking Door', category: 'Carpentry', difficulty: 'Medium' },
  { title: 'Installing Floating Shelves', category: 'Carpentry', difficulty: 'Medium' }
];

export function SearchResults({ searchQuery }: SearchResultsProps) {
  const query = searchQuery.toLowerCase().trim();

  if (!query) {
    return (
      <section className="py-20 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Search FIX&BIN</h2>
            <p className="text-xl text-gray-600">Enter a keyword to search services and tutorials</p>
          </div>
        </div>
      </section>
    );
  }

  // Search through services
  const serviceResults = allServices.flatMap(service => 
    service.items
      .filter(item => item.toLowerCase().includes(query))
      .map(item => ({
        type: 'service' as const,
        title: item,
        category: service.title,
        icon: service.icon,
        color: service.color
      }))
  );

  // Also check service category names
  const categoryResults = allServices
    .filter(service => 
      service.title.toLowerCase().includes(query) ||
      service.title.toLowerCase().replace(' services', '').includes(query)
    )
    .flatMap(service => 
      service.items.map(item => ({
        type: 'service' as const,
        title: item,
        category: service.title,
        icon: service.icon,
        color: service.color
      }))
    );

  // Search through tutorials
  const tutorialResults = allTutorials
    .filter(tutorial => 
      tutorial.title.toLowerCase().includes(query) ||
      tutorial.category.toLowerCase().includes(query)
    )
    .map(tutorial => ({
      type: 'tutorial' as const,
      ...tutorial
    }));

  // Combine and deduplicate results
  const allResults = [...new Set([...serviceResults, ...categoryResults])].slice(0, 20);
  const combinedTutorials = tutorialResults;

  const totalResults = allResults.length + combinedTutorials.length;

  const getCategoryColor = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-100 text-blue-600';
      case 'yellow': return 'bg-yellow-100 text-yellow-600';
      case 'orange': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Search Results</h2>
          <p className="text-xl text-gray-600">
            Found {totalResults} result{totalResults !== 1 ? 's' : ''} for "{searchQuery}"
          </p>
        </div>

        {totalResults === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Results Found</h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any services or tutorials matching "{searchQuery}"
            </p>
            <p className="text-gray-600">
              Try searching for: plumbing, electrical, carpentry, faucet, outlet, door, etc.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Service Results */}
            {allResults.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Services ({allResults.length})
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allResults.map((result, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`${getCategoryColor(result.color)} p-2 rounded-lg flex-shrink-0`}>
                          <result.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 mb-1">{result.title}</h4>
                          <p className="text-sm text-gray-600">{result.category}</p>
                        </div>
                      </div>
                      <a
                        href="#contact"
                        className="mt-4 flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Book Service <ArrowRight className="w-4 h-4 ml-1" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tutorial Results */}
            {combinedTutorials.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  DIY Tutorials ({combinedTutorials.length})
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {combinedTutorials.map((result, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-gray-900">{result.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(result.difficulty)}`}>
                          {result.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{result.category}</p>
                      <button
                        onClick={() => {
                          // Scroll to tutorials section
                          const tutorialsSection = document.getElementById('tutorials');
                          if (tutorialsSection) {
                            tutorialsSection.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View Tutorial <ArrowRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Helpful Suggestions */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Can't find what you're looking for?</h3>
          <p className="text-gray-700 mb-4">
            Our team at FIX&BIN handles all types of handyman work. Contact us directly to discuss your specific needs.
          </p>
          <a
            href="#contact"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Contact FIX&BIN
          </a>
        </div>
      </div>
    </section>
  );
}
