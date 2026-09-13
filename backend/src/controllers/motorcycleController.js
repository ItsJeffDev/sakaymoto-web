const db = require('../config/db');
const { getAllMotorcycles } = require('../models/motorcycleModel');

const getMotorcycles = async (req, res) => {
  try {
    const motorcycles = await getAllMotorcycles(req.query.status || 'available');
    return res.json(motorcycles);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to retrieve motorcycles' });
  }
};

const getMotorcycle = async (req, res) => {
  const [rows] = await db.execute(`
    SELECT m.*, COALESCE(JSON_ARRAYAGG(JSON_OBJECT('id', mi.id, 'image_url', mi.image_url, 'is_primary', mi.is_primary)), JSON_ARRAY()) AS images
    FROM motorcycles m LEFT JOIN motorcycle_images mi ON mi.motorcycle_id = m.id
    WHERE m.id = ? GROUP BY m.id`, [req.params.id]);
  if (!rows.length) return res.status(404).json({ message: 'Motorcycle not found' });
  return res.json(rows[0]);
};

const createMotorcycle = async (req, res) => {
  const { brand, model, year, plate_number, color, price_per_day, status = 'available', description } = req.body;
  if (!brand || !model || !year || !plate_number || !color || !price_per_day) return res.status(400).json({ message: 'Brand, model, year, plate number, color, and price are required' });
  if (!['available', 'maintenance', 'inactive'].includes(status) || Number(price_per_day) <= 0) return res.status(400).json({ message: 'Invalid motorcycle details' });
  try {
    const [result] = await db.execute('INSERT INTO motorcycles (brand, model, year, plate_number, color, price_per_day, status, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [brand.trim(), model.trim(), year, plate_number.trim(), color.trim(), price_per_day, status, description || null]);
    return res.status(201).json({ id: result.insertId, message: 'Motorcycle created' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Plate number already exists' });
    throw error;
  }
};

const updateMotorcycle = async (req, res) => {
  const allowed = ['brand', 'model', 'year', 'plate_number', 'color', 'price_per_day', 'status', 'description'];
  const updates = Object.entries(req.body).filter(([key, value]) => allowed.includes(key) && value !== undefined);
  if (!updates.length) return res.status(400).json({ message: 'No changes supplied' });
  if (req.body.status && !['available', 'maintenance', 'inactive'].includes(req.body.status)) return res.status(400).json({ message: 'Invalid status' });
  const values = updates.map(([, value]) => value);
  values.push(req.params.id);
  const [result] = await db.execute(`UPDATE motorcycles SET ${updates.map(([key]) => `\`${key}\` = ?`).join(', ')} WHERE id = ?`, values);
  if (!result.affectedRows) return res.status(404).json({ message: 'Motorcycle not found' });
  return res.json({ message: 'Motorcycle updated' });
};

const deleteMotorcycle = async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM motorcycles WHERE id = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ message: 'Motorcycle not found' });
    return res.json({ message: 'Motorcycle deleted' });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') return res.status(409).json({ message: 'Motorcycle has existing records and cannot be deleted' });
    throw error;
  }
};

const addMotorcycleImage = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Image is required' });
  const [result] = await db.execute('INSERT INTO motorcycle_images (motorcycle_id, image_url, is_primary) VALUES (?, ?, ?)', [req.params.id, `/uploads/motorcycles/${req.file.filename}`, req.body.is_primary === 'true' ? 1 : 0]);
  return res.status(201).json({ id: result.insertId, image_url: `/uploads/motorcycles/${req.file.filename}` });
};

module.exports = { getMotorcycles, getMotorcycle, createMotorcycle, updateMotorcycle, deleteMotorcycle, addMotorcycleImage };
