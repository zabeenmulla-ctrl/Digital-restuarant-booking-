// Initial Seed and Mock Data for Qaswa Hills Restaurant in Bijapur (Vijayapura)

export const INITIAL_RESTAURANT = {
  id: 'rest-qaswa-bijapur',
  name: 'Qaswa Hills Restaurant & Dining Lounge',
  slug: 'qaswa-hills-bijapur',
  tagline: 'Royal Arabic & Mughlai Fine Dining | Overlooking the Historic Gol Gumbaz',
  description: 'Famed across Vijayapura (Bijapur) for its majestic setting directly opposite the historic Gol Gumbaz, Qaswa Hills brings together authentic Arabian BBQ Mandi, royal Adil Shahi dum biryanis, and succulent charcoal-grilled platters. Featuring Islamic archway motifs, traditional floor-cushioned Arabic Majlis cabins, and a panoramic rooftop terrace with direct views of the whispering Gol Gumbaz dome.',
  address: 'Opposite Historic Gol Gumbaz, Station Road, Vijayapura (Bijapur), Karnataka 586101',
  city: 'Vijayapura (Bijapur), Karnataka',
  landmark: 'Directly Opposite Gol Gumbaz Monument',
  phone: '+91 98450 78600 / +91 8352 250000',
  email: 'reservations@qaswahills.com',
  cover_image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1400&q=80',
  gallery_images: [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80'
  ],
  rating: 4.9,
  total_reviews: 248,
  price_range: '₹₹₹',
  opening_time: '11:30 AM',
  closing_time: '11:30 PM',
  default_deposit_fee: 500,
  tax_rate: 5.0, // 5% GST
  cuisines: ['Authentic Arabic Mandi', 'Royal Mughlai', 'Adil Shahi Specialties', 'Charcoal Tandoori Platters', 'Arabian Desserts'],
  features: [
    'Unmatched Direct View of Historic Gol Gumbaz',
    'Traditional Floor-Cushioned Arabic Majlis Cabins',
    'Private Family AC Dining Halls',
    'Authentic Wood-Fired BBQ Mandi Pit',
    'Live Classical Sitar & Ambient Music',
    'Dedicated Valet Parking Opposite Monument',
    '100% Halal Certified Gourmet Kitchen'
  ]
};

export const INITIAL_ZONES = [
  {
    id: 'zone-terrace',
    name: 'Gol Gumbaz View Terrace',
    tag: 'Monument View',
    description: 'Open-air rooftop dining deck offering unobstructed views of the illuminated Gol Gumbaz dome against the night sky.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    is_outdoor: true
  },
  {
    id: 'zone-majlis',
    name: 'Royal Arabic Majlis Cabins',
    tag: 'Arabic Tradition',
    description: 'Private low-cushioned carpet pavilions designed in authentic Yemeni style, ideal for large families sharing BBQ Mandi platters.',
    image: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=800&q=80',
    is_outdoor: false
  },
  {
    id: 'zone-adilshahi',
    name: 'Adil Shahi Grand Family Hall',
    tag: 'Royal Heritage',
    description: 'Palatial air-conditioned hall with hand-carved Islamic archways, crystal chandeliers, and spacious dining tables.',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    is_outdoor: false
  },
  {
    id: 'zone-sultan',
    name: 'Sultan Executive Dining Lounge',
    tag: 'VIP Luxury',
    description: 'Plush velvet seating with ambient brass hanging lanterns, dedicated butler service, and maximum dining privacy.',
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
    is_outdoor: false
  }
];

export const INITIAL_TABLES = [
  // Gol Gumbaz View Terrace
  {
    id: 'tbl-t1',
    table_number: 'GG-01 (Dome View Edge)',
    zone_id: 'zone-terrace',
    zone_name: 'Gol Gumbaz View Terrace',
    capacity: 2,
    min_guests: 1,
    category: 'Two-person Table',
    floor_area: 'Rooftop East Deck',
    is_premium: true,
    extra_fee: 200,
    is_active: true,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    highlights: ['Direct Gol Gumbaz Dome View', 'Candlelight Setup', 'Best for Couples']
  },
  {
    id: 'tbl-t2',
    table_number: 'GG-02 (Illuminated View)',
    zone_id: 'zone-terrace',
    zone_name: 'Gol Gumbaz View Terrace',
    capacity: 4,
    min_guests: 2,
    category: 'Four-person Table',
    floor_area: 'Rooftop Center',
    is_premium: true,
    extra_fee: 150,
    is_active: true,
    image: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=600&q=80',
    highlights: ['Night Sky Monument View', 'Open Air Breeze']
  },
  {
    id: 'tbl-t3',
    table_number: 'GG-03 (Heritage Quad)',
    zone_id: 'zone-terrace',
    zone_name: 'Gol Gumbaz View Terrace',
    capacity: 4,
    min_guests: 2,
    category: 'Four-person Table',
    floor_area: 'Rooftop West Deck',
    is_premium: false,
    extra_fee: 0,
    is_active: true,
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=600&q=80',
    highlights: ['Terrace Ambiance', 'Great for Friends & Family']
  },
  {
    id: 'tbl-t4',
    table_number: 'GG-04 (Monument Gazebo)',
    zone_id: 'zone-terrace',
    zone_name: 'Gol Gumbaz View Terrace',
    capacity: 6,
    min_guests: 4,
    category: 'Six-person Table',
    floor_area: 'Rooftop Corner Gazebo',
    is_premium: true,
    extra_fee: 250,
    is_active: true,
    image: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=600&q=80',
    highlights: ['Sheltered Arch Canopy', 'Perfect Gol Gumbaz Photo Frame']
  },

  // Royal Arabic Majlis Cabins (Traditional Floor Seating)
  {
    id: 'tbl-m1',
    table_number: 'MAJ-01 (Yemeni Sultan Majlis)',
    zone_id: 'zone-majlis',
    zone_name: 'Royal Arabic Majlis Cabins',
    capacity: 6,
    min_guests: 4,
    category: 'Royal VIP Cabana',
    floor_area: 'Majlis Pavilion Wing',
    is_premium: true,
    extra_fee: 350,
    is_active: true,
    image: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=600&q=80',
    highlights: ['Traditional Arabic Carpet & Cushions', 'Round Mandi Feast Platter', 'Curtained Family Privacy']
  },
  {
    id: 'tbl-m2',
    table_number: 'MAJ-02 (Hadhramout Diwan)',
    zone_id: 'zone-majlis',
    zone_name: 'Royal Arabic Majlis Cabins',
    capacity: 8,
    min_guests: 5,
    category: 'Royal VIP Cabana',
    floor_area: 'Majlis Central Court',
    is_premium: true,
    extra_fee: 400,
    is_active: true,
    image: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=600&q=80',
    highlights: ['Spacious 8-Guest Arabic Divan', 'Arabian Dallah Tea Service Included']
  },
  {
    id: 'tbl-m3',
    table_number: 'MAJ-03 (Al-Qaswa Royal Suite)',
    zone_id: 'zone-majlis',
    zone_name: 'Royal Arabic Majlis Cabins',
    capacity: 12,
    min_guests: 6,
    category: 'Family Dining Table',
    floor_area: 'Majlis Grand Suite',
    is_premium: true,
    extra_fee: 600,
    is_active: true,
    image: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=600&q=80',
    highlights: ['Grand 12-Person Arabic Majlis', 'Private AC & Sound Control', 'Dedicated Butler']
  },

  // Adil Shahi Grand Family Hall (Palatial AC Banquet)
  {
    id: 'tbl-ash1',
    table_number: 'ASH-01 (Chandelier Pair)',
    zone_id: 'zone-adilshahi',
    zone_name: 'Adil Shahi Grand Family Hall',
    capacity: 2,
    min_guests: 1,
    category: 'Two-person Table',
    floor_area: 'Hall North Wing',
    is_premium: false,
    extra_fee: 0,
    is_active: true,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    highlights: ['Climate Controlled AC', 'Islamic Archway Backdrop']
  },
  {
    id: 'tbl-ash2',
    table_number: 'ASH-02 (Royal Family Four)',
    zone_id: 'zone-adilshahi',
    zone_name: 'Adil Shahi Grand Family Hall',
    capacity: 4,
    min_guests: 2,
    category: 'Four-person Table',
    floor_area: 'Hall Center',
    is_premium: false,
    extra_fee: 0,
    is_active: true,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    highlights: ['Carved Teakwood Chairs', 'Family Favorite']
  },
  {
    id: 'tbl-ash3',
    table_number: 'ASH-03 (Bijapuri Feast Table)',
    zone_id: 'zone-adilshahi',
    zone_name: 'Adil Shahi Grand Family Hall',
    capacity: 6,
    min_guests: 3,
    category: 'Six-person Table',
    floor_area: 'Hall Center',
    is_premium: false,
    extra_fee: 0,
    is_active: true,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    highlights: ['Round Table with Lazy Susan', 'Comfortable Plush Seating']
  },
  {
    id: 'tbl-ash4',
    table_number: 'ASH-04 (Imperial Banquet Round)',
    zone_id: 'zone-adilshahi',
    zone_name: 'Adil Shahi Grand Family Hall',
    capacity: 10,
    min_guests: 5,
    category: 'Family Dining Table',
    floor_area: 'Hall Grand Center',
    is_premium: true,
    extra_fee: 300,
    is_active: true,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    highlights: ['Large Family Gathering', 'Celebration & Birthday Dining']
  },

  // Sultan Executive Lounge
  {
    id: 'tbl-s1',
    table_number: 'SLT-01 (Emerald Booth)',
    zone_id: 'zone-sultan',
    zone_name: 'Sultan Executive Dining Lounge',
    capacity: 4,
    min_guests: 2,
    category: 'Four-person Table',
    floor_area: 'Executive Bay',
    is_premium: true,
    extra_fee: 250,
    is_active: true,
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=600&q=80',
    highlights: ['Emerald Velvet Booth', 'Brass Lantern Lighting', 'Intimate Ambiance']
  },
  {
    id: 'tbl-s2',
    table_number: 'SLT-02 (Executive Private Chamber)',
    zone_id: 'zone-sultan',
    zone_name: 'Sultan Executive Dining Lounge',
    capacity: 8,
    min_guests: 4,
    category: 'Executive Private Room',
    floor_area: 'Private Enclosed Salon',
    is_premium: true,
    extra_fee: 600,
    is_active: true,
    image: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=600&q=80',
    highlights: ['Acoustic Private Dining', 'Dedicated Host & Butler', 'VIP Corporate or Family']
  }
];

export const INITIAL_MENU_CATEGORIES = [
  'All Items',
  'Arabic BBQ Mandi Specials',
  'Mughlai & Adil Shahi Dum Biryani',
  'Charcoal Tandoori Platters',
  'Royal Curries & Bread Basket',
  'Arabian Desserts & Mint Teas'
];

export const INITIAL_MENU_ITEMS = [
  {
    id: 'menu-01',
    category: 'Arabic BBQ Mandi Specials',
    name: 'Qaswa Royal Mutton BBQ Mandi (Grand Platter)',
    description: 'Our crowned signature! Fragrant Yemeni spiced basmati rice slow-cooked in a subterranean mandi pit, served with tender wood-smoked mutton shanks, roasted almonds, golden raisins, spicy Dakous salsa, and cooling garlic toum.',
    price: 850,
    is_veg: false,
    is_spicy: true,
    is_chef_special: true,
    is_available: true,
    calories: '750 kcal',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'menu-02',
    category: 'Arabic BBQ Mandi Specials',
    name: 'Chicken Faham Mandi Platter',
    description: 'Charcoal-grilled Arabian spiced half chicken with smoky crispy skin, laid over long-grain fragrant mandi rice, served with clear bone broth soup and fresh Arabic salad.',
    price: 590,
    is_veg: false,
    is_spicy: false,
    is_chef_special: true,
    is_available: true,
    calories: '620 kcal',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'menu-03',
    category: 'Arabic BBQ Mandi Specials',
    name: 'Mixed Seafood Zurbian Mandi',
    description: 'Arabian coastal style mandi rice infused with saffron, caramelized onions, and whole black limes, crowned with tandoor-charred tiger prawns and kingfish steaks.',
    price: 790,
    is_veg: false,
    is_spicy: true,
    is_chef_special: false,
    is_available: true,
    calories: '540 kcal',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'menu-04',
    category: 'Mughlai & Adil Shahi Dum Biryani',
    name: 'Adil Shahi Mutton Dum Biryani',
    description: 'Bijapur royal court recipe! Aged basmati rice layered with succulent goat meat, saffron milk, fried shallots, and slow-dum cooked over charcoal white embers.',
    price: 620,
    is_veg: false,
    is_spicy: true,
    is_chef_special: true,
    is_available: true,
    calories: '680 kcal',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'menu-05',
    category: 'Mughlai & Adil Shahi Dum Biryani',
    name: 'Bijapuri Mutton Sukka with Hot Phulkas',
    description: 'Tender mutton cubes slow-roasted in fresh dry coconut, shallots, curry leaves, and stone-ground black pepper. Served with 3 butter phulkas.',
    price: 520,
    is_veg: false,
    is_spicy: true,
    is_chef_special: true,
    is_available: true,
    calories: '590 kcal',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'menu-06',
    category: 'Charcoal Tandoori Platters',
    name: 'Qaswa Grand Arabic Kebab Platter',
    description: 'A feast of Shish Tawook skewers, Mutton Seekh Kebabs, Murgh Malai Tikka, and Bhatti Paneer, served on a sizzling iron skillet with garlic naan.',
    price: 780,
    is_veg: false,
    is_spicy: false,
    is_chef_special: true,
    is_available: true,
    calories: '690 kcal',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'menu-07',
    category: 'Charcoal Tandoori Platters',
    name: 'Paneer Zafrani Tikka',
    description: 'Farm-fresh cottage cheese cubes steeped in Iranian saffron, cashew cream, mace, and crushed green cardamom, flame-roasted in the clay tandoor.',
    price: 420,
    is_veg: true,
    is_spicy: false,
    is_chef_special: false,
    is_available: true,
    calories: '380 kcal',
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'menu-08',
    category: 'Royal Curries & Bread Basket',
    name: 'Qaswa Handi Ghost (Clay Pot Stew)',
    description: 'Slow-simmered lamb shanks in rich earthen clay handi with rich bone marrow and aromatic saffron gravy, sealed with dough.',
    price: 680,
    is_veg: false,
    is_spicy: true,
    is_chef_special: true,
    is_available: true,
    calories: '610 kcal',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'menu-09',
    category: 'Royal Curries & Bread Basket',
    name: 'Hummus Bil Lahm with Fresh Khubz',
    description: 'Silky smooth chickpea tahini purée drizzled with extra-virgin olive oil, topped with spiced minced lamb, roasted pine nuts, and sumac.',
    price: 380,
    is_veg: false,
    is_spicy: false,
    is_chef_special: false,
    is_available: true,
    calories: '320 kcal',
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'menu-10',
    category: 'Royal Curries & Bread Basket',
    name: 'Dal Bukhara Qaswa',
    description: 'Legendary black lentils slow-simmered for 18 hours over charcoal embers, finished with white country butter and thick cream.',
    price: 380,
    is_veg: true,
    is_spicy: false,
    is_chef_special: false,
    is_available: true,
    calories: '370 kcal',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'menu-11',
    category: 'Arabian Desserts & Mint Teas',
    name: 'Turkish Pistachio Kunafa with Warm Ashta',
    description: 'Crisp golden spun shredded phyllo pastry filled with warm melted sweet cheese and cream, drizzled with orange blossom sugar syrup and roasted pistachios.',
    price: 360,
    is_veg: true,
    is_spicy: false,
    is_chef_special: true,
    is_available: true,
    calories: '440 kcal',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'menu-12',
    category: 'Arabian Desserts & Mint Teas',
    name: 'Arabian Mint Tea in Traditional Dallah',
    description: 'Authentic Maghrebi green tea brewed with fresh mountain mint leaves, honey, and cardamom pods, served in ornate Moroccan glassware.',
    price: 180,
    is_veg: true,
    is_spicy: false,
    is_chef_special: false,
    is_available: true,
    calories: '60 kcal',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=500&q=80'
  }
];

export const INITIAL_PROMOTIONS = [
  {
    code: 'GOLGUMBAZ',
    title: 'Gol Gumbaz View Deck Privilege',
    description: 'Get 20% instant off on all Terrace reservations with direct monument view',
    discount_type: 'percentage',
    discount_value: 20,
    min_spend: 500,
    max_discount: 400,
    valid_until: '2026-12-31'
  },
  {
    code: 'MANDIFEAST',
    title: 'Royal Mandi Family Special',
    description: 'Flat ₹250 discount on any Royal Arabic Majlis cabin reservation',
    discount_type: 'flat',
    discount_value: 250,
    min_spend: 800,
    max_discount: 250,
    valid_until: '2026-12-31'
  },
  {
    code: 'BIJAPURROYAL',
    title: 'Welcome to Qaswa Hills',
    description: '10% instant discount on advance table reservation fees',
    discount_type: 'percentage',
    discount_value: 10,
    min_spend: 400,
    max_discount: 200,
    valid_until: '2026-12-31'
  }
];

export const INITIAL_REVIEWS = [
  {
    id: 'rev-01',
    customer_name: 'Dr. Mohammed Arif Inamdar',
    rating: 5,
    date: '2026-10-24',
    comment: 'The location opposite the historic Gol Gumbaz is absolutely breathtaking! Dining on the terrace with the illuminated dome right in front while enjoying their Mutton BBQ Mandi was a royal experience. Instant QR check-in made it super smooth.',
    table_type: 'Gol Gumbaz View Terrace',
    is_verified: true
  },
  {
    id: 'rev-02',
    customer_name: 'Pooja Kulkarni (Vijayapura)',
    rating: 5,
    date: '2026-10-20',
    comment: 'Booked the Royal Arabic Majlis for a 10-person family reunion. The floor-seating carpets, authentic Yemeni Mandi platter, and Kunafa were top notch. Best fine dining restaurant in Bijapur!',
    table_type: 'Royal Arabic Majlis Cabins',
    is_verified: true
  },
  {
    id: 'rev-03',
    customer_name: 'Syed Tanveer Hashmi',
    rating: 5,
    date: '2026-10-15',
    comment: 'Impeccable Adil Shahi dum biryani and tender kebabs. The digital invoice with GST breakdown was received on my phone immediately after Razorpay payment. Highly recommended!',
    table_type: 'Adil Shahi Grand Family Hall',
    is_verified: true
  }
];

export const TIME_SLOTS = [
  // Lunch Slots
  { id: '12:00', label: '12:00 PM', period: 'Lunch' },
  { id: '12:30', label: '12:30 PM', period: 'Lunch' },
  { id: '13:00', label: '01:00 PM', period: 'Lunch' },
  { id: '13:30', label: '01:30 PM', period: 'Lunch' },
  { id: '14:00', label: '02:00 PM', period: 'Lunch' },
  { id: '14:30', label: '02:30 PM', period: 'Lunch' },
  // Dinner Slots (Gol Gumbaz Evening Illumination)
  { id: '18:30', label: '06:30 PM (Sunset / Dome View)', period: 'Dinner' },
  { id: '19:00', label: '07:00 PM (Illuminated View)', period: 'Dinner' },
  { id: '19:30', label: '07:30 PM', period: 'Dinner' },
  { id: '20:00', label: '08:00 PM (Peak Dinner)', period: 'Dinner' },
  { id: '20:30', label: '08:30 PM (Peak Dinner)', period: 'Dinner' },
  { id: '21:00', label: '09:00 PM', period: 'Dinner' },
  { id: '21:30', label: '09:30 PM', period: 'Dinner' },
  { id: '22:00', label: '10:00 PM (Late Night Feast)', period: 'Dinner' }
];

export const INITIAL_BOOKINGS = [
  {
    id: 'bkg-101',
    booking_reference: 'QSW-2026-8941',
    customer_name: 'Rahul Sharma',
    customer_email: 'rahul.sharma@example.com',
    customer_phone: '+91 98765 12345',
    user_id: 'user-demo-customer',
    table_id: 'tbl-t1',
    table_number: 'GG-01 (Dome View Edge)',
    zone_name: 'Gol Gumbaz View Terrace',
    guest_count: 2,
    booking_date: '2026-10-28',
    time_slot: '18:30',
    time_label: '06:30 PM (Sunset / Dome View)',
    status: 'confirmed',
    occasion: 'Anniversary Celebration',
    special_requests: 'Direct Gol Gumbaz illuminated dome view with rose candle arrangement.',
    deposit_amount: 500,
    extra_table_fee: 200,
    discount_amount: 140, // from coupon GOLGUMBAZ
    tax_amount: 28,
    total_amount: 588,
    payment_status: 'successful',
    payment_method: 'Razorpay UPI (Google Pay)',
    transaction_id: 'pay_rzp_demo_89412',
    invoice_number: 'INV-QSW-2026-101',
    qr_code_token: 'VERIFY:QSW-2026-8941:VALID:QASWAHILLS',
    created_at: '2026-10-26T14:30:00.000Z'
  },
  {
    id: 'bkg-102',
    booking_reference: 'QSW-2026-7832',
    customer_name: 'Mohammed Mansoor',
    customer_email: 'mansoor.bijapur@example.com',
    customer_phone: '+91 98450 67890',
    user_id: 'user-mansoor-44',
    table_id: 'tbl-m1',
    table_number: 'MAJ-01 (Yemeni Sultan Majlis)',
    zone_name: 'Royal Arabic Majlis Cabins',
    guest_count: 6,
    booking_date: '2026-10-29',
    time_slot: '20:00',
    time_label: '08:00 PM (Peak Dinner)',
    status: 'confirmed',
    occasion: 'Family Mandi Feast',
    special_requests: 'Grand Mutton BBQ Mandi platter pre-arranged on carpet.',
    deposit_amount: 500,
    extra_table_fee: 350,
    discount_amount: 250,
    tax_amount: 30,
    total_amount: 630,
    payment_status: 'successful',
    payment_method: 'HDFC Credit Card',
    transaction_id: 'pay_rzp_demo_78329',
    invoice_number: 'INV-QSW-2026-102',
    qr_code_token: 'VERIFY:QSW-2026-7832:VALID:QASWAHILLS',
    created_at: '2026-10-26T18:00:00.000Z'
  }
];

export const getStoredData = (key, fallback) => {
  try {
    const item = localStorage.getItem(`qaswa_bijapur_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return fallback;
  }
};

export const setStoredData = (key, value) => {
  try {
    localStorage.setItem(`qaswa_bijapur_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
};
