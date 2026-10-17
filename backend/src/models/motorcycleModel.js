const db = require("../config/db");

// A motorcycle is "rented" right now when it has a confirmed booking that
// covers today's date. This is derived from the bookings table so it is
// always in sync with real data (the motorcycles.status column only stores
// available / maintenance / inactive).
const RENTED_NOW_SQL = `EXISTS (
  SELECT 1 FROM bookings bk
  WHERE bk.motorcycle_id = m.id
    AND bk.status = 'confirmed'
    AND CURDATE() BETWEEN bk.start_date AND bk.end_date
)`;

const normalizeImages = (motorcycle) => {
  if (!motorcycle) return motorcycle;

  let images = [];

  if (Array.isArray(motorcycle.images)) {
    images = motorcycle.images;
  } else if (typeof motorcycle.images === "string" && motorcycle.images) {
    try {
      images = JSON.parse(motorcycle.images);
    } catch (error) {
      images = [];
    }
  }

  // LEFT JOIN returns a single {id: null} object for bikes with no photos.
  images = images.filter((image) => image && image.id !== null);

  const isRented = Boolean(Number(motorcycle.is_rented));

  return {
    ...motorcycle,
    images,
    is_rented: isRented,
    // What the admin/customer actually sees: rented overrides available.
    display_status:
      motorcycle.status === "available" && isRented ? "rented" : motorcycle.status,
  };
};

const SELECT_WITH_IMAGES = `SELECT m.*, ${RENTED_NOW_SQL} AS is_rented,
  COALESCE(JSON_ARRAYAGG(JSON_OBJECT('id', mi.id, 'image_url', mi.image_url, 'is_primary', mi.is_primary)), JSON_ARRAY()) AS images
  FROM motorcycles m
  LEFT JOIN motorcycle_images mi ON mi.motorcycle_id = m.id`;

const getAllMotorcycles = async (status = "available") => {
  const query =
    status === "all"
      ? `${SELECT_WITH_IMAGES}
       GROUP BY m.id
       ORDER BY m.created_at DESC`
      : `${SELECT_WITH_IMAGES}
       WHERE m.status = ?
       GROUP BY m.id
       ORDER BY m.created_at DESC`;

  const [motorcycles] = await db.query(query, status === "all" ? [] : [status]);

  return motorcycles.map(normalizeImages);
};

module.exports = {
  getAllMotorcycles,
  normalizeImages,
  RENTED_NOW_SQL,
  SELECT_WITH_IMAGES,
};
