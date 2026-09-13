const db = require("../config/db");

const normalizeImages = (motorcycle) => {
  if (!motorcycle) return motorcycle;

  let images = [];

  if (Array.isArray(motorcycle.images)) {
    images = motorcycle.images;
  } else if (typeof motorcycle.images === 'string' && motorcycle.images) {
    try {
      images = JSON.parse(motorcycle.images);
    } catch (error) {
      images = [];
    }
  }

  return {
    ...motorcycle,
    images,
  };
};

const getAllMotorcycles = async (status = 'available') => {
  const query = status === 'all'
    ? `SELECT m.*, COALESCE(JSON_ARRAYAGG(JSON_OBJECT('id', mi.id, 'image_url', mi.image_url, 'is_primary', mi.is_primary)), JSON_ARRAY()) AS images
       FROM motorcycles m
       LEFT JOIN motorcycle_images mi ON mi.motorcycle_id = m.id
       GROUP BY m.id
       ORDER BY m.created_at DESC`
    : `SELECT m.*, COALESCE(JSON_ARRAYAGG(JSON_OBJECT('id', mi.id, 'image_url', mi.image_url, 'is_primary', mi.is_primary)), JSON_ARRAY()) AS images
       FROM motorcycles m
       LEFT JOIN motorcycle_images mi ON mi.motorcycle_id = m.id
       WHERE m.status = ?
       GROUP BY m.id
       ORDER BY m.created_at DESC`;

  const [motorcycles] = await db.query(query, status === 'all' ? [] : [status]);

  return motorcycles.map(normalizeImages);
};

module.exports = {
  getAllMotorcycles,
};
