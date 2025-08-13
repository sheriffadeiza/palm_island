import React from 'react';
import { Shield, Trophy, Users, Star, ArrowRight, Phone, Mail, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Palm Island Football Academy</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#about" className="text-gray-700 hover:text-green-600 transition-colors">About</a>
              <a href="#programs" className="text-gray-700 hover:text-green-600 transition-colors">Programs</a>
              <a href="#contact" className="text-gray-700 hover:text-green-600 transition-colors">Contact</a>
            </nav>
            <button
              onClick={handleLoginClick}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Palm Island Football Academy
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Developing tomorrow's football stars through professional training, discipline, and passion for the beautiful game.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleLoginClick}
                className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Palm Island?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our academy combines world-class facilities with experienced coaching to develop players at every level.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <Trophy className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Professional Training</h3>
              <p className="text-gray-600">
                Learn from certified coaches with professional playing experience and UEFA qualifications.
              </p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <Users className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Team Development</h3>
              <p className="text-gray-600">
                Focus on both individual skills and team play to develop well-rounded players.
              </p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <Star className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Excellence Standards</h3>
              <p className="text-gray-600">
                Maintain the highest standards in training, discipline, and sportsmanship.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Programs</h2>
            <p className="text-xl text-gray-600">Training programs designed for every age group and skill level</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Youth Academy (8-12)</h3>
              <p className="text-gray-600 mb-6">Foundation skills, fun-based learning, and basic football techniques.</p>
              <ul className="text-gray-600 space-y-2 mb-6">
                <li>• Ball control and dribbling</li>
                <li>• Basic passing and shooting</li>
                <li>• Team play introduction</li>
              </ul>
              <div className="text-2xl font-bold text-green-600">₦80/month</div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-green-600">
              <div className="text-center mb-4">
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">Most Popular</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Junior League (13-16)</h3>
              <p className="text-gray-600 mb-6">Advanced training with competitive match play and skill development.</p>
              <ul className="text-gray-600 space-y-2 mb-6">
                <li>• Advanced techniques</li>
                <li>• Tactical understanding</li>
                <li>• Competition preparation</li>
              </ul>
              <div className="text-2xl font-bold text-green-600">₦120/month</div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Elite Training (17+)</h3>
              <p className="text-gray-600 mb-6">Professional-level training for serious players aiming for higher levels.</p>
              <ul className="text-gray-600 space-y-2 mb-6">
                <li>• Professional coaching</li>
                <li>• Fitness and conditioning</li>
                <li>• Mental preparation</li>
              </ul>
              <div className="text-2xl font-bold text-green-600">₦160/month</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-xl text-gray-600">Get in touch to start your football journey</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <Phone className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Phone</h3>
              <p className="text-gray-600">+234-9033533203</p>
            </div>
            
            <div className="p-6">
              <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">Palmislandlagos@gmail.com</p>
            </div>
            
            <div className="p-6">
              <MapPin className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Location</h3>
              <p className="text-gray-600">Nicon Town Estate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-8">
            <Shield className="h-8 w-8 text-green-400" />
            <span className="ml-2 text-xl font-bold">Palm Island Football Academy</span>
          </div>
          <p className="text-center text-gray-400">
            © 2025 Palm Island Football Academy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;