/**
 * Seed Script
 * Clears all existing data and inserts realistic dummy data.
 * Run: node src/scripts/seed.js
 */

require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const Service = require('../models/Service');
const Review = require('../models/review');

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  'Plumbing', 'Electrical', 'AC Repair', 'Appliance Repair',
  'Carpentry', 'Cleaning', 'Painting',
];

const rawUsers = [
  // Customers
  { name: 'James Carter',    email: 'james.carter@gmail.com',    password: 'password123', role: 'customer' },
  { name: 'Sophia Mitchell', email: 'sophia.m@outlook.com',      password: 'password123', role: 'customer' },
  { name: 'Ethan Brown',     email: 'ethan.brown@gmail.com',     password: 'password123', role: 'customer' },
  { name: 'Olivia Davis',    email: 'olivia.davis@yahoo.com',    password: 'password123', role: 'customer' },
  { name: 'Noah Williams',   email: 'noah.williams@gmail.com',   password: 'password123', role: 'customer' },

  // Providers
  { name: 'David Harris',    email: 'david.harris@gmail.com',    password: 'password123', role: 'provider',
    profile: { location: 'New York, NY', businessName: 'Harris Home Services', experience: 8, description: 'Expert plumber with 8+ years of experience in residential and commercial plumbing.' }
  },
  { name: 'John Thompson',   email: 'john.thompson@gmail.com',   password: 'password123', role: 'provider',
    profile: { location: 'Los Angeles, CA', businessName: 'Thompson Electrical Co.', experience: 12, description: 'Licensed electrician specializing in rewiring and panel upgrades.' }
  },
  { name: 'Michael Johnson', email: 'michael.johnson@gmail.com', password: 'password123', role: 'provider',
    profile: { location: 'Chicago, IL', businessName: 'Johnson HVAC Solutions', experience: 6, description: 'Certified AC technician offering fast and affordable AC repair and maintenance.' }
  },
  { name: 'Sarah Wilson',    email: 'sarah.wilson@gmail.com',    password: 'password123', role: 'provider',
    profile: { location: 'Houston, TX', businessName: 'Wilson Appliance Repair', experience: 5, description: 'Professional appliance repair for all major brands including Samsung, LG, and Whirlpool.' }
  },
  { name: 'Robert Martinez', email: 'robert.martinez@gmail.com', password: 'password123', role: 'provider',
    profile: { location: 'Phoenix, AZ', businessName: 'Martinez Carpentry & Woodwork', experience: 10, description: 'Master carpenter offering custom furniture, cabinets, and home woodworking.' }
  },
  { name: 'Emily Clark',     email: 'emily.clark@gmail.com',     password: 'password123', role: 'provider',
    profile: { location: 'Philadelphia, PA', businessName: 'Sparkle Clean Services', experience: 4, description: 'Professional cleaning for homes and offices. Eco-friendly products used.' }
  },
  { name: 'Daniel Lewis',    email: 'daniel.lewis@gmail.com',    password: 'password123', role: 'provider',
    profile: { location: 'San Antonio, TX', businessName: 'Lewis Painting & Decor', experience: 7, description: 'Interior and exterior painting with attention to detail and clean finishes.' }
  },

  // Admin
  { name: 'Admin User',      email: 'admin@localservice.com',    password: 'admin123',    role: 'admin' },
];

const serviceData = (providers) => [
  {
    providerId: providers['david.harris@gmail.com']._id,
    title: 'Emergency Plumbing Repair',
    category: 'Plumbing',
    description: 'Available 24/7 for burst pipes, leaks, drain blockages, and emergency plumbing repairs. We serve all boroughs of New York with same-day service.',
    location: 'New York, NY',
    priceRange: '$80-$200',
    status: 'approved', isActive: true, ratingAverage: 4.5, totalReviews: 2,
  },
  {
    providerId: providers['david.harris@gmail.com']._id,
    title: 'Bathroom Plumbing Installation',
    category: 'Plumbing',
    description: 'Full bathroom plumbing setup including shower, toilet, and sink installation. Serving residential properties across New York.',
    location: 'New York, NY',
    priceRange: '$300-$800',
    status: 'approved', isActive: true, ratingAverage: 4.0, totalReviews: 1,
  },
  {
    providerId: providers['john.thompson@gmail.com']._id,
    title: 'Home Electrical Wiring & Rewiring',
    category: 'Electrical',
    description: 'Licensed electrician for full home rewiring, panel upgrades, circuit installation, and EV charger setup. Licensed and insured in California.',
    location: 'Los Angeles, CA',
    priceRange: '$150-$500',
    status: 'approved', isActive: true, ratingAverage: 4.8, totalReviews: 2,
  },
  {
    providerId: providers['john.thompson@gmail.com']._id,
    title: 'Outdoor Security Lighting Setup',
    category: 'Electrical',
    description: 'Installation of security lights, floodlights, and motion sensors around your property for enhanced safety.',
    location: 'Los Angeles, CA',
    priceRange: '$100-$350',
    status: 'approved', isActive: true, ratingAverage: 0, totalReviews: 0,
  },
  {
    providerId: providers['michael.johnson@gmail.com']._id,
    title: 'AC Unit Repair & Gas Refill',
    category: 'AC Repair',
    description: 'Fast diagnosis and repair of all AC brands. Gas refilling, coil cleaning, thermostat repair, and full system servicing available.',
    location: 'Chicago, IL',
    priceRange: '$60-$180',
    status: 'approved', isActive: true, ratingAverage: 4.2, totalReviews: 1,
  },
  {
    providerId: providers['michael.johnson@gmail.com']._id,
    title: 'Annual AC Maintenance Plan',
    category: 'AC Repair',
    description: 'Comprehensive annual maintenance for your AC system to ensure peak performance year-round. Includes filter replacement and full inspection.',
    location: 'Chicago, IL',
    priceRange: '$120/year',
    status: 'pending', isActive: true, ratingAverage: 0, totalReviews: 0,
  },
  {
    providerId: providers['sarah.wilson@gmail.com']._id,
    title: 'Washing Machine Repair',
    category: 'Appliance Repair',
    description: 'Expert repair for all washing machine brands including Samsung, LG, Bosch, and Whirlpool. Same-day service available in the Houston area.',
    location: 'Houston, TX',
    priceRange: '$50-$150',
    status: 'approved', isActive: true, ratingAverage: 4.6, totalReviews: 2,
  },
  {
    providerId: providers['robert.martinez@gmail.com']._id,
    title: 'Custom Kitchen Cabinet Installation',
    category: 'Carpentry',
    description: 'Bespoke kitchen cabinets designed and installed to fit your space perfectly. Wide range of finishes and materials available.',
    location: 'Phoenix, AZ',
    priceRange: '$500-$2000',
    status: 'approved', isActive: true, ratingAverage: 5.0, totalReviews: 1,
  },
  {
    providerId: providers['emily.clark@gmail.com']._id,
    title: 'Deep Home Cleaning',
    category: 'Cleaning',
    description: 'Thorough top-to-bottom deep clean of your entire home using eco-friendly products. Great for move-in/move-out or spring cleaning.',
    location: 'Philadelphia, PA',
    priceRange: '$150-$400',
    status: 'approved', isActive: true, ratingAverage: 4.9, totalReviews: 2,
  },
  {
    providerId: providers['emily.clark@gmail.com']._id,
    title: 'Office Cleaning Service',
    category: 'Cleaning',
    description: 'Regular and one-time cleaning services for offices and commercial spaces. Flexible scheduling including evenings and weekends.',
    location: 'Philadelphia, PA',
    priceRange: '$100-$300',
    status: 'approved', isActive: true, ratingAverage: 0, totalReviews: 0,
  },
  {
    providerId: providers['daniel.lewis@gmail.com']._id,
    title: 'Interior House Painting',
    category: 'Painting',
    description: 'Professional interior painting for any room or full house. Color consultation included. Premium low-VOC paints available.',
    location: 'San Antonio, TX',
    priceRange: '$200-$800',
    status: 'approved', isActive: true, ratingAverage: 4.3, totalReviews: 1,
  },
  {
    providerId: providers['daniel.lewis@gmail.com']._id,
    title: 'Exterior House Painting',
    category: 'Painting',
    description: 'Full exterior house painting with weather-resistant paint. Includes surface prep, priming, and two coats of premium paint.',
    location: 'San Antonio, TX',
    priceRange: '$500-$1500',
    status: 'rejected', isActive: false, ratingAverage: 0, totalReviews: 0,
  },
];

const reviewData = (customers, services) => [
  {
    userId: customers['james.carter@gmail.com']._id,
    serviceId: services['Emergency Plumbing Repair']._id,
    rating: 5,
    comment: 'David showed up within 30 minutes and fixed our burst pipe quickly. Very professional and fair pricing. Highly recommend!',
  },
  {
    userId: customers['sophia.m@outlook.com']._id,
    serviceId: services['Emergency Plumbing Repair']._id,
    rating: 4,
    comment: 'Good service overall, got the job done. Slightly pricey but worth it for the quick response.',
  },
  {
    userId: customers['ethan.brown@gmail.com']._id,
    serviceId: services['Bathroom Plumbing Installation']._id,
    rating: 4,
    comment: 'Installed our new bathroom fixtures cleanly and on time. Will use again.',
  },
  {
    userId: customers['olivia.davis@yahoo.com']._id,
    serviceId: services['Home Electrical Wiring & Rewiring']._id,
    rating: 5,
    comment: 'John rewired our 1950s home flawlessly. Everything is up to code and he was incredibly professional throughout.',
  },
  {
    userId: customers['noah.williams@gmail.com']._id,
    serviceId: services['Home Electrical Wiring & Rewiring']._id,
    rating: 5,
    comment: 'Installed our EV charger perfectly. Arrived on time, clean work, no mess left behind.',
  },
  {
    userId: customers['james.carter@gmail.com']._id,
    serviceId: services['AC Unit Repair & Gas Refill']._id,
    rating: 4,
    comment: 'AC was not cooling well, Michael diagnosed the issue fast and refilled the gas. Works perfectly now.',
  },
  {
    userId: customers['sophia.m@outlook.com']._id,
    serviceId: services['Washing Machine Repair']._id,
    rating: 5,
    comment: 'My LG machine was making horrible noises. Sarah identified and fixed a drum bearing issue same day. Excellent!',
  },
  {
    userId: customers['ethan.brown@gmail.com']._id,
    serviceId: services['Washing Machine Repair']._id,
    rating: 4,
    comment: 'Great service, fixed the drainage problem in under an hour.',
  },
  {
    userId: customers['olivia.davis@yahoo.com']._id,
    serviceId: services['Custom Kitchen Cabinet Installation']._id,
    rating: 5,
    comment: 'Absolutely stunning work. Robert built us custom cabinets that fit our kitchen perfectly. Every detail was considered.',
  },
  {
    userId: customers['noah.williams@gmail.com']._id,
    serviceId: services['Deep Home Cleaning']._id,
    rating: 5,
    comment: "The team was thorough, friendly, and our house has never looked cleaner. I'm signing up for monthly service!",
  },
  {
    userId: customers['james.carter@gmail.com']._id,
    serviceId: services['Deep Home Cleaning']._id,
    rating: 5,
    comment: 'Used Emily\'s team for a move-out clean. Got my full deposit back. Worth every penny.',
  },
  {
    userId: customers['sophia.m@outlook.com']._id,
    serviceId: services['Interior House Painting']._id,
    rating: 4,
    comment: 'Daniel did a fantastic job on our living room and hallway. Clean lines, no drips, and great color advice.',
  },
];

// ─── Seed Runner ─────────────────────────────────────────────────────────────

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/local-service-finder');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Service.deleteMany({}),
      Review.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // Hash passwords and create users
    const usersWithHashedPasswords = await Promise.all(
      rawUsers.map(async (u) => {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(u.password, salt);
        return { ...u, password: hashed };
      })
    );

    const createdUsers = await User.insertMany(usersWithHashedPasswords);
    console.log(`👤 Created ${createdUsers.length} users`);

    // Build lookup maps
    const providerMap = {};
    const customerMap = {};
    createdUsers.forEach((u) => {
      if (u.role === 'provider') providerMap[u.email] = u;
      if (u.role === 'customer') customerMap[u.email] = u;
    });

    // Create services
    const services = await Service.insertMany(serviceData(providerMap));
    console.log(`🛠️  Created ${services.length} services`);

    // Build service lookup map by title
    const serviceMap = {};
    services.forEach((s) => { serviceMap[s.title] = s; });

    // Create reviews
    const reviews = await Review.insertMany(reviewData(customerMap, serviceMap));
    console.log(`⭐ Created ${reviews.length} reviews`);

    console.log('\n✅ Database seeded successfully!\n');
    console.log('─────────────────────────────────────────');
    console.log('Test Accounts:');
    console.log('  Customer : james.carter@gmail.com / password123');
    console.log('  Provider : david.harris@gmail.com / password123');
    console.log('  Admin    : admin@localservice.com / admin123');
    console.log('─────────────────────────────────────────\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
