// api-gateway/server.js
require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const financeRoutes = require('./routes/finance');
const studentRoutes = require('./routes/student');
const courseRoutes  = require('./routes/course');
const resultsRoutes = require('./routes/results');
const chatRoutes = require('./routes/chat');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB error', err));

// Mount auth routes
app.use('/api/auth', authRoutes);

// Mount finance stubs
app.use('/api/finance', financeRoutes);

// Mount student routes
app.use('/api/student',  studentRoutes);

app.use('/api/results',  resultsRoutes);

app.use('/api/course',    courseRoutes);

app.use('/api/chat', chatRoutes);

// Simple health check
app.get('/', (req, res) => res.send('API Gateway up and running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
