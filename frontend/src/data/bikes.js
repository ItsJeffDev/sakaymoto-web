// Bike icon paths are shared across cards (see BikeCard.vue).
// This is placeholder catalog data — swap for an API call once the
// backend/database from Chapter 3 of the docs is ready.

export const bikes = [
  {
    id: 'click-125i',
    name: 'Honda Click 125i',
    category: 'Scooter',
    meta: 'Scooter · 2023 · Automatic',
    price: 399,
    rating: 4.9,
    status: 'Available'
  },
  {
    id: 'mio-gear',
    name: 'Yamaha Mio Gear',
    category: 'Scooter',
    meta: 'Scooter · 2022 · Automatic',
    price: 349,
    rating: 4.8,
    status: 'Available'
  },
  {
    id: 'tmx-125-alpha',
    name: 'Honda TMX 125 Alpha',
    category: 'Underbone',
    meta: 'Underbone · 2023 · Manual',
    price: 299,
    rating: 5.0,
    status: 'Available'
  }
]

export const filterOptions = ['All', 'Scooter', 'Underbone', 'Sport']
