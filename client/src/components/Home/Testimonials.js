import React from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiQuote } from 'react-icons/fi';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Fatima Rahman',
      role: 'Skincare Enthusiast',
      avatar: '👩‍🦰',
      rating: 5,
      comment: 'Lech-Fita has transformed my skincare routine! The products are high-quality and the customer service is exceptional. I love how they focus on natural ingredients.',
      location: 'Dhaka, Bangladesh'
    },
    {
      id: 2,
      name: 'Aisha Khan',
      role: 'Makeup Artist',
      avatar: '💄',
      rating: 5,
      comment: 'As a professional makeup artist, I need reliable products. Lech-Fita never disappoints. Their makeup range is pigmented, long-lasting, and perfect for all skin types.',
      location: 'Chittagong, Bangladesh'
    },
    {
      id: 3,
      name: 'Zara Ahmed',
      role: 'Beauty Blogger',
      avatar: '📱',
      rating: 5,
      comment: 'I\'ve been reviewing beauty products for years, and Lech-Fita stands out for their commitment to quality and affordability. Their fragrances are absolutely divine!',
      location: 'Sylhet, Bangladesh'
    },
    {
      id: 4,
      name: 'Nadia Islam',
      role: 'Dermatologist',
      avatar: '👩‍⚕️',
      rating: 5,
      comment: 'I recommend Lech-Fita products to my patients. They use safe, effective ingredients that are suitable for sensitive skin. The results speak for themselves.',
      location: 'Rajshahi, Bangladesh'
    },
    {
      id: 5,
      name: 'Sana Malik',
      role: 'Fashion Designer',
      avatar: '👗',
      rating: 5,
      comment: 'Lech-Fita products complement my fashion designs perfectly. The quality and packaging are world-class. My clients always ask about the beauty products I use.',
      location: 'Barisal, Bangladesh'
    },
    {
      id: 6,
      name: 'Layla Hassan',
      role: 'Wellness Coach',
      avatar: '🧘‍♀️',
      rating: 5,
      comment: 'I love how Lech-Fita promotes natural beauty and wellness. Their products help my clients feel confident and beautiful from the inside out.',
      location: 'Khulna, Bangladesh'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {testimonials.map((testimonial, index) => (
        <motion.div
          key={testimonial.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 relative"
        >
          {/* Quote Icon */}
          <div className="absolute top-4 right-4 text-primary/20">
            <FiQuote size={24} />
          </div>

          {/* Rating */}
          <div className="flex items-center mb-4">
            {[...Array(testimonial.rating)].map((_, i) => (
              <FiStar
                key={i}
                className="w-5 h-5 text-yellow-400 fill-current"
              />
            ))}
          </div>

          {/* Comment */}
          <p className="text-gray-700 mb-6 leading-relaxed">
            "{testimonial.comment}"
          </p>

          {/* Customer Info */}
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{testimonial.avatar}</div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900">{testimonial.name}</div>
              <div className="text-sm text-gray-500">{testimonial.role}</div>
              <div className="text-xs text-gray-400">{testimonial.location}</div>
            </div>
          </div>

          {/* Decorative Element */}
          <div className="absolute bottom-2 left-2 w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full -z-10"></div>
        </motion.div>
      ))}
    </div>
  );
};

export default Testimonials;