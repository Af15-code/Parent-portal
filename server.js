const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ===== MONGODB CONNECTION =====
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/parent_portal', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('✓ MongoDB connected')).catch(err => console.error('MongoDB error:', err));

// ===== SCHEMAS =====
const parentSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    phone: String,
    passwordHash: String
}, { timestamps: true });

const studentSchema = new mongoose.Schema({
    name: String,
    roll_number: String,
    course_title: String,
    duration_days: Number,
    days_completed: Number,
    parent_id: mongoose.Schema.Types.ObjectId,
    attendance_logs: [{
        date: Date,
        status: String,
        remarks: String
    }],
    syllabus_modules: [{
        module_name: String,
        progress_pct: Number,
        status: String
    }]
}, { timestamps: true });

const Parent = mongoose.model('Parent', parentSchema);
const Student = mongoose.model('Student', studentSchema);

// ===== SEED DATA =====
const seedDatabase = async () => {
    const count = await Parent.countDocuments();
    if (count === 0) {
        const hashedPassword = await bcrypt.hash('password123', 10);
        const parent1 = await Parent.create({
            name: 'Mr. Rajesh Kumar',
            email: 'parent1@lords.com',
            phone: '9876543210',
            passwordHash: hashedPassword
        });

        const parent2 = await Parent.create({
            name: 'Mrs. Priya Singh',
            email: 'parent2@lords.com',
            phone: '9876543211',
            passwordHash: hashedPassword
        });

        await Student.create([
            {
                name: 'Arjun Kumar',
                roll_number: 'LSA001',
                course_title: 'Full Stack Web Development',
                duration_days: 90,
                days_completed: 45,
                parent_id: parent1._id,
                attendance_logs: Array.from({ length: 45 }, (_, i) => ({
                    date: new Date(Date.now() - (44 - i) * 86400000),
                    status: Math.random() > 0.1 ? 'Present' : (Math.random() > 0.5 ? 'Absent' : 'Late'),
                    remarks: 'Regular progress'
                })),
                syllabus_modules: [
                    { module_name: 'HTML & CSS Fundamentals', progress_pct: 100, status: 'Completed' },
                    { module_name: 'JavaScript Essentials', progress_pct: 100, status: 'Completed' },
                    { module_name: 'React.js Framework', progress_pct: 65, status: 'In Progress' },
                    { module_name: 'Node.js & Express', progress_pct: 0, status: 'Locked' },
                    { module_name: 'Database Design', progress_pct: 0, status: 'Locked' }
                ]
            },
            {
                name: 'Priya Sharma',
                roll_number: 'LSA002',
                course_title: 'Mobile App Development',
                duration_days: 60,
                days_completed: 30,
                parent_id: parent1._id,
                attendance_logs: Array.from({ length: 30 }, (_, i) => ({
                    date: new Date(Date.now() - (29 - i) * 86400000),
                    status: 'Present',
                    remarks: 'Excellent attendance'
                })),
                syllabus_modules: [
                    { module_name: 'React Native Basics', progress_pct: 100, status: 'Completed' },
                    { module_name: 'UI/UX Design', progress_pct: 80, status: 'In Progress' },
                    { module_name: 'API Integration', progress_pct: 30, status: 'In Progress' },
                    { module_name: 'App Deployment', progress_pct: 0, status: 'Locked' }
                ]
            },
            {
                name: 'Vikram Singh',
                roll_number: 'LSA003',
                course_title: 'Data Science & Analytics',
                duration_days: 120,
                days_completed: 60,
                parent_id: parent2._id,
                attendance_logs: Array.from({ length: 60 }, (_, i) => ({
                    date: new Date(Date.now() - (59 - i) * 86400000),
                    status: Math.random() > 0.15 ? 'Present' : 'Absent',
                    remarks: 'Good progress'
                })),
                syllabus_modules: [
                    { module_name: 'Python Programming', progress_pct: 100, status: 'Completed' },
                    { module_name: 'Data Manipulation with Pandas', progress_pct: 100, status: 'Completed' },
                    { module_name: 'Statistical Analysis', progress_pct: 50, status: 'In Progress' },
                    { module_name: 'Machine Learning', progress_pct: 20, status: 'In Progress' },
                    { module_name: 'Advanced Algorithms', progress_pct: 0, status: 'Locked' }
                ]
            }
        ]);
        console.log('✓ Database seeded with sample data');
    }
};

// ===== MIDDLEWARE =====
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here', (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

// ===== ROUTES =====
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const parent = await Parent.findOne({ email });
        if (!parent) return res.status(401).json({ message: 'Invalid credentials' });
        const isValid = await bcrypt.compare(password, parent.passwordHash);
        if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });
        const token = jwt.sign({ parent_id: parent._id }, process.env.JWT_SECRET || 'your_jwt_secret_key_here', { expiresIn: '7d' });
        res.json({ token, parent: { _id: parent._id, name: parent.name, email: parent.email } });
    } catch (err) {
        res.status(500).json({ message: 'Login error' });
    }
});

app.get('/api/parent/students', authenticateJWT, async (req, res) => {
    try {
        const students = await Student.find({ parent_id: req.user.parent_id });
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching students' });
    }
});

app.get('/api/student/:studentId', authenticateJWT, async (req, res) => {
    try {
        const student = await Student.findById(req.params.studentId);
        if (!student || student.parent_id.toString() !== req.user.parent_id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        res.json(student);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching student' });
    }
});

app.post('/api/student/:studentId/leave-request', authenticateJWT, async (req, res) => {
    try {
        const { reason } = req.body;
        const student = await Student.findById(req.params.studentId);
        if (!student || student.parent_id.toString() !== req.user.parent_id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        res.json({ message: 'Leave request submitted', studentId: req.params.studentId, reason });
    } catch (err) {
        res.status(500).json({ message: 'Error submitting request' });
    }
});

app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    await seedDatabase();
    console.log(`✓ Server running on http://localhost:${PORT}`);
});
