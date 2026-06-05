import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Heart, MapPin, ChevronRight, Activity } from 'lucide-react';
import BookingHistory from '../bookings/BookingHistory';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

function CustomerDashboard() {
  const cards = [
    {
      title: 'My bookings',
      description: 'View and manage requests',
      icon: <Calendar className="w-6 h-6 text-primary" />,
      link: '/bookings',
      color: 'bg-blue-50'
    },
    {
      title: 'Saved services',
      description: 'Your favorite listings',
      icon: <Heart className="w-6 h-6 text-rose-500" />,
      link: '/favorites',
      color: 'bg-rose-50'
    },
    {
      title: 'Addresses',
      description: 'Saved locations for booking',
      icon: <MapPin className="w-6 h-6 text-green-500" />,
      link: '/profile?tab=addresses',
      color: 'bg-green-50'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      <motion.div initial="hidden" animate="show" variants={containerVariants}>

        {/* Header */}
        <motion.div variants={itemVariants} className="mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Welcome back</h1>
          <p className="text-gray-500 text-lg">Manage your bookings, saved services, and profile effortlessly.</p>
        </motion.div>

        {/* Quick Links / Stats Cards */}
        <motion.div variants={itemVariants} className="grid sm:grid-cols-3 gap-6 mb-12">
          {cards.map((card, idx) => (
            <Link key={idx} to={card.link}>
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer h-full group"
              >
                <div className={`w-12 h-12 rounded-full ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {card.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-primary transition-colors">{card.title}</h3>
                <p className="text-sm text-gray-500">{card.description}</p>
                <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Manage</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-bold text-gray-900">Recent bookings</h2>
            </div>
            <Link to="/bookings" className="text-sm font-semibold text-primary hover:text-secondary flex items-center transition-colors">
              View all <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="p-6">
            <BookingHistory limit={5} />
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}

export default CustomerDashboard;
