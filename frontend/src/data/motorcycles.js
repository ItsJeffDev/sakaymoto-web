// Mirrors the "Motorcycles" table from the project documentation
// (brand, model, price_per_day, status, etc). In production this
// would come from GET /api/motorcycles instead of a static file.

export const motorcycles = [
  {
    id: 1,
    brand: 'Honda',
    model: 'Click 160',
    category: 'scooter',
    categoryLabel: 'Scooter · Automatic',
    engine: '160cc',
    specs: ['160cc', '2 helmets incl.', 'Top box'],
    pricePerDay: 450,
    status: 'available',
    accent: 'blue'
  },
  {
    id: 2,
    brand: 'Yamaha',
    model: 'Sniper 155',
    category: 'underbone',
    categoryLabel: 'Underbone · Manual',
    engine: '155cc',
    specs: ['155cc', '2 helmets incl.', 'Fuel efficient'],
    pricePerDay: 500,
    status: 'available',
    accent: 'orange'
  },
  {
    id: 3,
    brand: 'Kawasaki',
    model: 'Rouser NS200',
    category: 'sport',
    categoryLabel: 'Sport · Manual',
    engine: '200cc',
    specs: ['200cc', '1 helmet incl.', 'Digital dash'],
    pricePerDay: 750,
    status: 'available',
    accent: 'navy'
  },
  {
    id: 4,
    brand: 'Yamaha',
    model: 'Mio Gear 125',
    category: 'scooter',
    categoryLabel: 'Scooter · Automatic',
    engine: '125cc',
    specs: ['125cc', '2 helmets incl.', 'Underseat storage'],
    pricePerDay: 400,
    status: 'available',
    accent: 'blue'
  },
  {
    id: 5,
    brand: 'Honda',
    model: 'XRM 125',
    category: 'underbone',
    categoryLabel: 'Underbone · Manual',
    engine: '125cc',
    specs: ['125cc', '2 helmets incl.', 'Great on gas'],
    pricePerDay: 380,
    status: 'available',
    accent: 'orange'
  },
  {
    id: 6,
    brand: 'Honda',
    model: 'CBR150R',
    category: 'sport',
    categoryLabel: 'Sport · Manual',
    engine: '150cc',
    specs: ['150cc', '1 helmet incl.', 'Full fairing'],
    pricePerDay: 700,
    status: 'available',
    accent: 'navy'
  }
]

export const catalogFilters = [
  { value: 'all', label: 'All' },
  { value: 'scooter', label: 'Scooter' },
  { value: 'underbone', label: 'Underbone' },
  { value: 'sport', label: 'Sport' }
]
