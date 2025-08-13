import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Trophy } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  category: 'tournament' | 'fixture' | 'news';
  location?: string;
}

const NewsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const newsItems: NewsItem[] = [
    {
      id: '1',
      title: 'Regional Youth Championship 2025',
      description: 'Palm Island FC qualifies for the regional championships. Join us as we compete against the best teams in the region.',
      image: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
      date: '2025-02-15',
      category: 'tournament',
      location: 'Central Sports Complex'
    },
    {
      id: '2',
      title: 'Derby Match: Palm Island vs Coastal United',
      description: 'The biggest fixture of the season! Our senior team takes on rivals Coastal United in this crucial derby match.',
      image: 'https://images.pexels.com/photos/209841/pexels-photo-209841.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
      date: '2025-02-08',
      category: 'fixture',
      location: 'Home Stadium'
    },
    {
      id: '3',
      title: 'New Training Facilities Opening',
      description: 'We are excited to announce the opening of our new state-of-the-art training facilities with FIFA-standard pitches.',
      image: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
      date: '2025-02-01',
      category: 'news',
      location: 'Palm Island Academy'
    },
    {
      id: '4',
      title: 'Summer Camp Registration Open',
      description: 'Sign up now for our intensive summer football camp. Limited spots available for young aspiring footballers.',
      image: 'https://images.pexels.com/photos/1171084/pexels-photo-1171084.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
      date: '2025-01-25',
      category: 'news',
      location: 'Academy Grounds'
    },
    {
      id: '5',
      title: 'League Cup Semi-Final',
      description: 'Our U-18 team secures a spot in the league cup semi-finals after a thrilling victory in extra time.',
      image: 'https://images.pexels.com/photos/159698/football-player-the-ball-sports-boy-159698.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
      date: '2025-01-20',
      category: 'tournament',
      location: 'Away Ground'
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + newsItems.length) % newsItems.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'tournament':
        return <Trophy className="h-4 w-4" />;
      case 'fixture':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'tournament':
        return 'bg-yellow-500';
      case 'fixture':
        return 'bg-blue-500';
      default:
        return 'bg-green-500';
    }
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="relative h-96 overflow-hidden">
        {newsItems.map((item, index) => (
          <div
            key={item.id}
            className={`absolute top-0 left-0 w-full h-full transition-transform duration-500 ease-in-out ${
              index === currentIndex ? 'translate-x-0' : 'translate-x-full'
            }`}
            style={{
              transform: `translateX(${(index - currentIndex) * 100}%)`,
            }}
          >
            <div className="relative w-full h-full">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white ${getCategoryColor(item.category)}`}>
                    {getCategoryIcon(item.category)}
                    {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-gray-300">
                    <Calendar className="h-4 w-4" />
                    {new Date(item.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  {item.location && (
                    <span className="flex items-center gap-1 text-sm text-gray-300">
                      <MapPin className="h-4 w-4" />
                      {item.location}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-200 text-sm lg:text-base max-w-2xl">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {newsItems.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentIndex 
                ? 'bg-white scale-110' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default NewsCarousel;