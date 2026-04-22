import { Award, Clock, Users, Shield } from 'lucide-react';

const features = [
  {
    icon: Award,
    title: 'Licensed & Certified',
    description: 'All our handymen are fully licensed, insured, and certified professionals.'
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Emergency services available round the clock for urgent repairs.'
  },
  {
    icon: Users,
    title: '10+ Years Experience',
    description: 'Trusted by thousands of homeowners and businesses since 2014.'
  },
  {
    icon: Shield,
    title: 'Quality Guarantee',
    description: 'We stand behind our work with a comprehensive satisfaction guarantee.'
  }
];

export function About() {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose FIX&BIN?</h2>
          <p className="text-xl text-gray-600">Your trusted partner for all home repair and maintenance needs</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-blue-600 rounded-lg p-8 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-xl mb-6">Contact us today for a free consultation and quote</p>
          <a 
            href="#contact" 
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Request a Quote
          </a>
        </div>
      </div>
    </section>
  );
}