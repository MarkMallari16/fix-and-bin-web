import { Facebook, Twitter, Instagram } from 'lucide-react';

interface FooterProps {
  onViewChange: (view: string) => void;
}

export function Footer({ onViewChange }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <button
              onClick={() => {
                onViewChange('home');
                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 100);
              }}
              className="text-2xl font-bold text-blue-400 mb-4 hover:text-blue-300 transition-colors cursor-pointer"
            >
              FIX&BIN
            </button>
            <p className="text-gray-400">
              Your trusted partner for professional handyman services. Quality work, reliable service.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button
                  onClick={() => {
                    onViewChange('home');
                    setTimeout(() => {
                      const element = document.getElementById('services');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }, 100);
                  }}
                  className="hover:text-blue-400 transition-colors"
                >
                  Plumbing
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onViewChange('home');
                    setTimeout(() => {
                      const element = document.getElementById('services');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }, 100);
                  }}
                  className="hover:text-blue-400 transition-colors"
                >
                  Electrical
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onViewChange('home');
                    setTimeout(() => {
                      const element = document.getElementById('services');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }, 100);
                  }}
                  className="hover:text-blue-400 transition-colors"
                >
                  Carpentry
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onViewChange('home');
                    setTimeout(() => {
                      const element = document.getElementById('services');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }, 100);
                  }}
                  className="hover:text-blue-400 transition-colors"
                >
                  Emergency Repairs
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button
                  onClick={() => {
                    onViewChange('home');
                    setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-blue-400 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onViewChange('home');
                    setTimeout(() => {
                      const element = document.getElementById('tutorials');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }, 100);
                  }}
                  className="hover:text-blue-400 transition-colors"
                >
                  Tutorials
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onViewChange('home');
                    setTimeout(() => {
                      const element = document.getElementById('about');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }, 100);
                  }}
                  className="hover:text-blue-400 transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onViewChange('worker-application')}
                  className="hover:text-blue-400 transition-colors font-semibold text-blue-400"
                >
                  Become a Worker
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onViewChange('home');
                    setTimeout(() => {
                      const element = document.getElementById('contact');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }, 100);
                  }}
                  className="hover:text-blue-400 transition-colors"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onViewChange('ratings');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-blue-400 transition-colors"
                >
                  Reviews & Ratings
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/profile.php?id=61573483932818" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-2 rounded-lg hover:bg-blue-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://x.com/fixandbin?fbclid=IwY2xjawRIKLdleHRuA2FlbQIxMABicmlkETFpTVhQdVJZRDRsUUZSM0pnc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHoSq3SzwGgw1Degy8T7bYeCYa6to-iwFglBd5ljvqNw47YEFsL6VrILvycsJ_aem_4En-8BQePRWWJ6tUOxQ5Ng" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-2 rounded-lg hover:bg-blue-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/fixandbin/?igsh=azcxanNiNHRsbDl5&utm_source=qr&fbclid=IwY2xjawRIKNdleHRuA2FlbQIxMABicmlkETFpTVhQdVJZRDRsUUZSM0pnc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHjNGAetAJGarNjDcp-07dyrkM-97TkQwBqxIH_Tg74VNEWjsV6CLGUmHGc9Q_aem_kZKr--PVLBcFC6wget1oVw" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-2 rounded-lg hover:bg-blue-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2026 FIX&BIN. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}