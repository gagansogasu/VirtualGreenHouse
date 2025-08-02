# Virtual Greenhouse 🌱

A full-stack web application for managing and exploring virtual greenhouses, plants, and shops. Built with React frontend and Node.js backend with MongoDB database.

## 🚀 Features

- **Plant Management**: Browse, search, and manage plant collections
- **Shop Integration**: Connect with plant shops and nurseries
- **User Authentication**: Secure user registration and login system
- **Shopping Cart**: Add plants to cart and manage orders
- **Order Management**: Track and manage plant orders
- **Responsive Design**: Modern UI that works on all devices
- **Real-time Updates**: Dynamic content updates and notifications

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Icons** - Icon library
- **React Hot Toast** - Toast notifications
- **FontAwesome** - Additional icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Nodemailer** - Email functionality
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
virtual_house-1/
├── backend/                 # Node.js backend
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── scripts/            # Database seeding scripts
│   ├── uploads/            # File uploads
│   └── server.js           # Main server file
├── frontend/               # React frontend
│   ├── public/             # Static files
│   ├── src/                # React source code
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gagansogasu/virtual-greenhouse.git
   cd virtual-greenhouse
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**

   Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   ```

5. **Start the development servers**

   **Backend:**
   ```bash
   cd backend
   npm run dev
   ```

   **Frontend:**
   ```bash
   cd frontend
   npm start
   ```

   The application will be available at:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📚 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile

### Plants
- `GET /api/plants` - Get all plants
- `GET /api/plants/:id` - Get plant by ID
- `POST /api/plants` - Create new plant
- `PUT /api/plants/:id` - Update plant
- `DELETE /api/plants/:id` - Delete plant

### Shops
- `GET /api/shops` - Get all shops
- `GET /api/shops/:id` - Get shop by ID
- `POST /api/shops` - Create new shop

### Cart & Orders
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `DELETE /api/cart/:id` - Remove item from cart
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order

## 🎨 Features in Detail

### Plant Management
- Browse plants with search and filter functionality
- View detailed plant information including care instructions
- Add plants to favorites and shopping cart
- Plant categorization and tagging

### Shop Integration
- Connect with local and online plant shops
- Shop ratings and reviews
- Direct ordering from shops
- Shop location and contact information

### User Experience
- Responsive design for mobile and desktop
- Real-time notifications
- Smooth animations and transitions
- Intuitive navigation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Gagan K S** - [@gagansogasu](https://github.com/gagansogasu)

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB team for the database
- All open-source contributors whose libraries made this possible

---

⭐ If you find this project helpful, please give it a star! 
