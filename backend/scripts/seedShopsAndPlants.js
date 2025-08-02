const mongoose = require('mongoose');
const Shop = require('../models/Shop');
const Plant = require('../models/Plant');

const passwordHash = '$2b$10$DYYBWxSISnJC0MuUJNrFSOh80mK0v1jO86LNrBTr9A7Yv1Gv.jjg6';

const shopsData = [
    {
        shopName: 'Nandanam Nursery',
        email: 'nandanam@example.com',
        password: passwordHash,
        phone: '+91 44 2434 4455',
        address: 'No. 12, Venkatesa Agraharam, Mylapore, Chennai, Tamil Nadu 600004',
        description: 'One of the oldest and most trusted nurseries in Chennai.',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
    },
    {
        shopName: 'The Nurserymen Co-operative Society Ltd',
        email: 'nurserymen@example.com',
        password: passwordHash,
        phone: '+91 44 2819 0417',
        address: 'No. 1, 3rd Main Road, CIT Colony, Mylapore, Chennai, Tamil Nadu 600004',
        description: 'A cooperative society of nurserymen providing quality plants.',
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1753&q=80'
    }
];

const plantsData = (shop1Id, shop2Id) => [
    // Plants for shop1
    { name: 'Monstera Deliciosa', category: 'Indoor', description: 'Tropical plant with large, glossy leaves.', price: 1299, inStock: true, image: 'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb', shop: shop1Id, stockQuantity: 10 },
    { name: 'Snake Plant', category: 'Indoor', description: 'Low-maintenance plant.', price: 799, inStock: true, image: 'https://images.unsplash.com/photo-1584735203820-146e55388992', shop: shop1Id, stockQuantity: 15 },
    { name: 'Fiddle Leaf Fig', category: 'Indoor', description: 'Popular houseplant.', price: 1899, inStock: true, image: 'https://images.unsplash.com/photo-1533050487297-8874e25fe1c9', shop: shop1Id, stockQuantity: 8 },
    { name: 'Peace Lily', category: 'Indoor', description: 'Flowering plant that purifies air.', price: 699, inStock: true, image: 'https://images.unsplash.com/photo-1593482892290-ab6102470bac', shop: shop1Id, stockQuantity: 12 },
    { name: 'Rubber Plant', category: 'Indoor', description: 'Hardy plant with large leaves.', price: 1499, inStock: true, image: 'https://images.unsplash.com/photo-1593481414518-4b9dbb318b18', shop: shop1Id, stockQuantity: 7 },
    // Plants for shop2
    { name: 'ZZ Plant', category: 'Indoor', description: 'Drought-tolerant plant.', price: 899, inStock: true, image: 'https://images.unsplash.com/photo-1593697909683-bccb1b9e68a1', shop: shop2Id, stockQuantity: 10 },
    { name: 'Pothos', category: 'Indoor', description: 'Easy-to-grow vine.', price: 599, inStock: true, image: 'https://images.unsplash.com/photo-1593481414518-4b9dbb318b18', shop: shop2Id, stockQuantity: 20 },
    { name: 'Philodendron', category: 'Indoor', description: 'Classic houseplant.', price: 799, inStock: true, image: 'https://images.unsplash.com/photo-1593481414518-4b9dbb318b18', shop: shop2Id, stockQuantity: 9 },
    { name: 'Aloe Vera', category: 'Succulent', description: 'Medicinal succulent.', price: 499, inStock: true, image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb', shop: shop2Id, stockQuantity: 18 },
    { name: 'Jade Plant', category: 'Succulent', description: 'Symbol of good luck.', price: 699, inStock: true, image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308', shop: shop2Id, stockQuantity: 14 }
];

async function seed() {
    await mongoose.connect('mongodb://localhost:27017/virtual-greenhouse', { useNewUrlParser: true, useUnifiedTopology: true });
    await Shop.deleteMany({});
    await Plant.deleteMany({});
    const [shop1, shop2] = await Shop.insertMany(shopsData);
    await Plant.insertMany(plantsData(shop1._id, shop2._id));
    console.log('Seeded shops and plants!');
    await mongoose.disconnect();
}

seed().catch(console.error); 