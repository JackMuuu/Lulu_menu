// routes/dishes.js
const express = require('express');
const router = express.Router();
const Dish = require('../models/Dish');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const crypto = require('crypto');

// NOTE: dotenv should be loaded from server.js (require('dotenv').config() as early as possible).
// If you run this file standalone during testing, uncomment the next line:
// require('dotenv').config();


// configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// multer in-memory with fileFilter to only allow images
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
  }
});

// helper: upload buffer to cloudinary, returns {secure_url, public_id}
function uploadBufferToCloudinary(buffer, filename, folder = '') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve({ secure_url: result.secure_url, public_id: result.public_id });
      }
    );
    stream.end(buffer);
  });
}

// helper: validate category against allowed set
const ALLOWED_CATEGORIES = ['热菜','凉菜','汤品','主食','甜品','饮品', '特别'];

function isValidCategory(cat) {
  if (typeof cat !== 'string') return false;
  return ALLOWED_CATEGORIES.includes(cat);
}

// GET all (with optional category and search)
router.get('/', async (req, res) => {
  try {
    const { category, q } = req.query;
    const baseFilter = {};
    if (category) baseFilter.category = category;

    // If there's no q, simple find
    if (!q || !q.trim()) {
      const list = await Dish.find(baseFilter).sort({ createdAt: -1 }).lean();
      return res.json(list);
    }

    const searchText = q.trim();

    // First try a text search (if text index exists) to get relevance-ordered results
    // If it fails or returns empty, fallback to substring (regex) search.
    let list = [];
    try {
      // use projection with textScore if available
      list = await Dish.find(
        { ...baseFilter, $text: { $search: searchText } },
        { score: { $meta: "textScore" } }
      )
        .sort({ score: { $meta: "textScore" } })
        .lean();
    } catch (textErr) {
      // If text search throws (e.g., no text index), ignore and fallback
      console.warn('Text search not available or failed, falling back to regex', textErr && textErr.message);
      list = [];
    }

    // If text search gave results, return them
    if (Array.isArray(list) && list.length > 0) {
      return res.json(list);
    }

    // Fallback: partial substring (case-insensitive) on name and description
    // Escape regex special chars in user input:
    const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(escapeRegex(searchText), 'i');

    const regexFilter = {
      ...baseFilter,
      $or: [
        { name: { $regex: re } },
        { description: { $regex: re } }
      ]
    };

    const regexList = await Dish.find(regexFilter).sort({ createdAt: -1 }).lean();
    return res.json(regexList);
  } catch (err) {
    console.error('GET /api/dishes error', err);
    res.status(500).json({ error: 'Server error' });
  }
});




// GET daily specials: deterministic one-per-category based on today's date
router.get('/daily', async (req, res) => {
  try {
    const categories = ALLOWED_CATEGORIES; // ['热菜','凉菜','汤品','主食','甜品','饮品']
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const specials = [];

    for (const category of categories) {
      const items = await Dish.find({ category }).lean();
      if (!items || items.length === 0) {
        // skip if none in that category
        continue;
      }
      // deterministic "random" index from hash of (date + category)
      const hash = crypto.createHash('sha256').update(today + '|' + category).digest('hex');
      const idx = parseInt(hash.slice(0, 8), 16) % items.length;
      specials.push(items[idx]);
    }

    res.json(specials);
  } catch (err) {
    console.error('GET /api/dishes/daily error', err);
    res.status(500).json({ error: 'Server error' });
  }
});





// GET single
router.get('/:id', async (req, res) => {
  try {
    const d = await Dish.findById(req.params.id).lean();
    if (!d) return res.status(404).json({ error: 'Not found' });
    res.json(d);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// CREATE dish (multipart/form-data with image optional)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, description = '', category } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });

    if (!isValidCategory(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    let image = '';
    let imagePublicId = '';

    if (req.file && req.file.buffer) {
      try {
        const { secure_url, public_id } = await uploadBufferToCloudinary(req.file.buffer, req.file.originalname);
        image = secure_url;
        imagePublicId = public_id;
      } catch (uploadErr) {
        console.error('Cloudinary upload error', uploadErr);
        return res.status(502).json({ error: 'Image upload failed', detail: uploadErr.message });
      }
    } else if (req.body.image) {
      // allow clients to set image via URL (if using direct-to-cloudinary)
      image = req.body.image;
    }

    const created = await Dish.create({
      name: String(name).trim(),
      description,
      category,
      image,
      imagePublicId
    });

    res.status(201).json(created);
  } catch (err) {
    console.error('POST /api/dishes error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// UPDATE (multipart/form-data allowed; if image file present => replace)
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const updates = {};
    ['name','description','category'].forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    if (updates.category && !isValidCategory(updates.category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    // if new image uploaded
    if (req.file && req.file.buffer) {
      const dish = await Dish.findById(req.params.id);
      if (!dish) return res.status(404).json({ error: 'Not found' });

      // upload new image
      let secure_url, public_id;
      try {
        ({ secure_url, public_id } = await uploadBufferToCloudinary(req.file.buffer, req.file.originalname));
      } catch (uploadErr) {
        console.error('Cloudinary upload error', uploadErr);
        return res.status(502).json({ error: 'Image upload failed', detail: uploadErr.message });
      }

      // delete old image from cloudinary if exists
      if (dish.imagePublicId) {
        try { await cloudinary.uploader.destroy(dish.imagePublicId); } catch (e) { console.warn('Cloudinary delete failed', e); }
      }

      updates.image = secure_url;
      updates.imagePublicId = public_id;
    } else if (req.body.image !== undefined) {
      // allow client to update image via URL (or empty string to clear)
      updates.image = req.body.image;
      if (req.body.image === '') {
        const old = await Dish.findById(req.params.id);
        if (old && old.imagePublicId) {
          try { await cloudinary.uploader.destroy(old.imagePublicId); } catch (e) { console.warn(e); }
        }
        updates.imagePublicId = '';
      }
    }

    const updated = await Dish.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    console.error('PUT /api/dishes/:id error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE dish (and delete cloud image if any)
router.delete('/:id', async (req, res) => {
  try {
    const doc = await Dish.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });

    if (doc.imagePublicId) {
      try { await cloudinary.uploader.destroy(doc.imagePublicId); } catch (e) { console.warn('Cloudinary delete failed', e); }
    }

    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/dishes/:id error', err);
    res.status(500).json({ error: 'Server error' });
  }
});






module.exports = router;