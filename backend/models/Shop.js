const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const shopSchema = new mongoose.Schema({
    shopName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    image: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

// Hash password before saving
shopSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
shopSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Shop', shopSchema);

/*
// --- SEED SCRIPT (run in MongoDB shell or as a Node.js script) ---
// 1. Insert two shops
const shop1 = await db.shops.insertOne({
  shopName: 'Nandanam Nursery',
  email: 'nandanam@example.com',
  password: 'hashedpassword1', // Use bcrypt to hash in real script
  phone: '+91 44 2434 4455',
  address: 'No. 12, Venkatesa Agraharam, Mylapore, Chennai, Tamil Nadu 600004',
  description: 'One of the oldest and most trusted nurseries in Chennai.'
});
const shop2 = await db.shops.insertOne({
  shopName: 'The Nurserymen Co-operative Society Ltd',
  email: 'nurserymen@example.com',
  password: 'hashedpassword2',
  phone: '+91 44 2819 0417',
  address: 'No. 1, 3rd Main Road, CIT Colony, Mylapore, Chennai, Tamil Nadu 600004',
  description: 'A cooperative society of nurserymen providing quality plants.'
});

// 2. Insert 5 plants for each shop (replace shop: with the ObjectId of the shop)
db.plants.insertMany([
  // Plants for shop1
  { name: 'Monstera Deliciosa', category: 'Indoor', description: 'Tropical plant with large, glossy leaves.', price: 1299, inStock: true, image: 'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb', shop: shop1.insertedId, stockQuantity: 10 },
  { name: 'Snake Plant', category: 'Indoor', description: 'Low-maintenance plant.', price: 799, inStock: true, image: 'https://images.unsplash.com/photo-1584735203820-146e55388992', shop: shop1.insertedId, stockQuantity: 15 },
  { name: 'Fiddle Leaf Fig', category: 'Indoor', description: 'Popular houseplant.', price: 1899, inStock: true, image: 'https://images.unsplash.com/photo-1533050487297-8874e25fe1c9', shop: shop1.insertedId, stockQuantity: 8 },
  { name: 'Peace Lily', category: 'Indoor', description: 'Flowering plant that purifies air.', price: 699, inStock: true, image: 'https://images.unsplash.com/photo-1593482892290-ab6102470bac', shop: shop1.insertedId, stockQuantity: 12 },
  { name: 'Rubber Plant', category: 'Indoor', description: 'Hardy plant with large leaves.', price: 1499, inStock: true, image: 'https://images.unsplash.com/photo-1593481414518-4b9dbb318b18', shop: shop1.insertedId, stockQuantity: 7 },
  // Plants for shop2
  { name: 'ZZ Plant', category: 'Indoor', description: 'Drought-tolerant plant.', price: 899, inStock: true, image: 'https://images.unsplash.com/photo-1593697909683-bccb1b9e68a1', shop: shop2.insertedId, stockQuantity: 10 },
  { name: 'Pothos', category: 'Indoor', description: 'Easy-to-grow vine.', price: 599, inStock: true, image: 'https://images.unsplash.com/photo-1593481414518-4b9dbb318b18', shop: shop2.insertedId, stockQuantity: 20 },
  { name: 'Philodendron', category: 'Indoor', description: 'Classic houseplant.', price: 799, inStock: true, image: 'https://images.unsplash.com/photo-1593481414518-4b9dbb318b18', shop: shop2.insertedId, stockQuantity: 9 },
  { name: 'Aloe Vera', category: 'Succulent', description: 'Medicinal succulent.', price: 499, inStock: true, image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb', shop: shop2.insertedId, stockQuantity: 18 },
  { name: 'Jade Plant', category: 'Succulent', description: 'Symbol of good luck.', price: 699, inStock: true, image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308', shop: shop2.insertedId, stockQuantity: 14 }
]);
*/ 