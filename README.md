# Parent Portal - Lords Skill Academy

A production-ready, fully responsive Parent Portal application built with React, Node.js, Express, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js v14+
- MongoDB running locally or Atlas URI
- npm or yarn

### Installation

1. **Clone & Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   ```

3. **Start MongoDB**
   ```bash
   # If local installation:
   mongod
   ```

4. **Start Backend Server**
   ```bash
   npm start
   # Server runs on http://localhost:5000
   ```

5. **Open Frontend**
   - Open `index.html` in your browser or serve via HTTP
   - Or use: `python -m http.server 8000` and visit `http://localhost:8000`

## 📱 Demo Credentials

**Parent 1:**
- Email: `parent1@lords.com`
- Password: `password123`
- Students: Arjun Kumar, Priya Sharma

**Parent 2:**
- Email: `parent2@lords.com`
- Password: `password123`
- Students: Vikram Singh

## 📋 Features

✅ **Responsive Design**
- Mobile-first (iOS/Android)
- Tablet optimized
- Desktop/Laptop layouts

✅ **Dashboard**
- Attendance progress meter
- Course completion tracker
- Academy announcements
- Real-time metrics

✅ **Attendance Calendar**
- Interactive calendar grid
- Color-coded status (Present/Absent/Late)
- Instructor remarks on hover
- Monthly statistics

✅ **Syllabus Tracker**
- Expandable module accordion
- Progress indicators
- Skill breakdown
- Completion tracking

✅ **Security**
- JWT-based authentication
- Password hashing with bcryptjs
- Parent-child data isolation
- Secure API endpoints

✅ **Database**
- MongoDB with Mongoose
- Embedded arrays for performance
- Realistic seed data
- Scalable schema design

## 🔧 Architecture

### Frontend (index.html)
- Single-file React application using vanilla JavaScript
- Tailwind CSS for responsive styling
- Client-side state management
- Local storage for token persistence

### Backend (server.js)
- Express REST API
- JWT middleware authentication
- MongoDB integration
- CORS enabled

### Database (MongoDB)
- Parent collection with secure password hashing
- Student collection with embedded attendance logs and syllabus
- Automatic data seeding on first run

## 📊 API Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|----------|
| POST | `/api/auth/login` | ❌ | Parent login, returns JWT |
| GET | `/api/parent/students` | ✅ | List parent's students (isolated) |
| GET | `/api/student/:id` | ✅ | Student details with attendance & syllabus |
| POST | `/api/student/:id/leave-request` | ✅ | Submit leave request |
| GET | `/api/health` | ❌ | Server health check |

## 🎨 UI/UX Highlights

- **Deep Blue Color Scheme**: Professional enterprise styling
- **Dual-Pane Login**: Branding on left, form on right (desktop)
- **Bottom Navigation**: Mobile-optimized tab bar
- **Left Sidebar**: Desktop navigation panel
- **Smooth Animations**: Fade-in, slide-up transitions
- **Touch-Friendly**: 44px+ tap targets on mobile
- **Accessible**: Keyboard navigation, ARIA labels ready

## 🔐 Security Features

✓ JWT tokens for stateless auth
✓ Bcryptjs password hashing
✓ Parent-child data isolation (critical)
✓ Token verification on protected routes
✓ CORS configured
✓ Input validation ready

## 📦 Deployment

### Heroku
```bash
git init && git add . && git commit -m "Initial commit"
heroku create your-app-name
git push heroku main
```

### Docker
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📈 Performance

- Lightweight single-file frontend (~20KB minified)
- Embedded MongoDB arrays for fast queries
- JWT tokens cached in localStorage
- No unnecessary re-renders
- Optimized Tailwind CSS purging

## 🐛 Troubleshooting

**CORS Error?**
```bash
# Ensure backend is running on port 5000
# Check API const in index.html points to correct URL
```

**MongoDB Connection Failed?**
```bash
# Check MongoDB is running
# Verify MONGO_URI in .env
mongosh  # Test connection
```

**JWT Token Expired?**
```bash
# Tokens valid for 7 days
# Clear localStorage and re-login after expiry
```

## 🤝 Support

For issues, create a GitHub issue or contact the development team.

---

**Built with ❤️ for Lords Skill Academy**
