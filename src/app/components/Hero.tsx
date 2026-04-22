import { ImageWithFallback } from './figma/ImageWithFallback';
import { Wrench } from 'lucide-react';

export function Hero() {
  return (
    <section id="home" className="relative bg-gradient-to-br from-blue-50 to-blue-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 uppercase">
              Professional Handyman Services at Your Doorstep
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Expert plumbing, electrical, and carpentry services. Available 24/7 for all your home repair needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#contact" 
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center"
              >
                Get a Free Quote
              </a>
              <a 
                href="#services" 
                className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors text-center"
              >
                View Services
              </a>
            </div>
          </div>
          
          <div className="relative">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1585406666850-82f7532fdae3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5keW1hbiUyMHNlcnZpY2VzJTIwdG9vbHM8ZW58MXx8fHwxNzcyMTY3MzMwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Handyman tools"
              className="rounded-lg shadow-xl w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}