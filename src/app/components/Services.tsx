import { ImageWithFallback } from './figma/ImageWithFallback';
import { Wrench, Zap, Hammer, CheckCircle } from 'lucide-react';

const services = [
  {
    title: 'Plumbing Services',
    icon: Wrench,
    image: 'https://images.unsplash.com/photo-1590706673178-5fd074c14f30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbHVtYmVyJTIwZml4aW5nJTIwc2lua3xlbnwxfHx8fDE3NzIwNzcyNjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Expert plumbing solutions for all your residential and commercial needs.',
    features: [
      'Leak detection and repair',
      'Pipe installation and replacement',
      'Drain cleaning and unclogging',
      'Water heater services',
      'Emergency plumbing repairs'
    ]
  },
  {
    title: 'Electrical/Technician Services',
    icon: Zap,
    image: 'https://images.unsplash.com/photo-1636218685495-8f6545aadb71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpY2lhbiUyMHRlY2huaWNpYW4lMjB3b3JraW5nfGVufDF8fHx8MTc3MjE2NzMyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Safe and reliable electrical services by certified technicians.',
    features: [
      'Electrical wiring and rewiring',
      'Light fixture installation',
      'Circuit breaker repairs',
      'Outlet and switch replacement',
      'Electrical safety inspections'
    ]
  },
  {
    title: 'Carpentry Services',
    icon: Hammer,
    image: 'https://images.unsplash.com/photo-1590880795696-20c7dfadacde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJwZW50ZXIlMjB3b29kd29ya2luZyUyMHRvb2xzfGVufDF8fHx8MTc3MjA4ODE3NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Professional carpentry work for custom projects and repairs.',
    features: [
      'Custom furniture building',
      'Door and window installation',
      'Deck and fence construction',
      'Cabinet installation and repair',
      'Trim and molding work'
    ]
  }
];

export function Services() {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600">Comprehensive handyman solutions for your home and business</p>
        </div>
        
        <div className="space-y-16">
          {services.map((service, index) => (
            <div 
              key={service.title}
              className={`grid md:grid-cols-2 gap-8 items-center ${
                index % 2 === 1 ? 'md:grid-flow-dense' : ''
              }`}
            >
              <div className={index % 2 === 1 ? 'md:col-start-2' : ''}>
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <service.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">{service.title}</h3>
                </div>
                <p className="text-lg text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-3">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className={index % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''}>
                <ImageWithFallback
                  src={service.image}
                  alt={service.title}
                  className="rounded-lg shadow-lg w-full h-96 object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
