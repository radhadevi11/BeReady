const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const app = express();
const JWT_SECRET = 'your-secret-key'; // In production, use environment variable
const port = 3001; // Using 3001 since React typically uses 3000

// Middleware
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://agovardhananpresidio:NDm0H6GTSqydzF8b@cluster0.jx10b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Input validation middleware
const validateRegistration = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .matches(/^[A-Za-z]+$/).withMessage('Name must contain only alphabetical characters'),
  
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  
  body('role')
    .trim()
    .notEmpty().withMessage('Role is required')
    .isIn(['User', 'Admin']).withMessage('Role must be either User or Admin')
];

// Book validation middleware
const validateBook = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters long'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 20 }).withMessage('Description must be at least 20 characters long'),
  
  body('author')
    .trim()
    .notEmpty().withMessage('Author is required')
    .matches(/^[A-Za-z\s]+$/).withMessage('Author name must contain only alphabetical characters and spaces'),
  
  body('imageUrl')
    .optional()
    .trim()
    .isURL().withMessage('Image URL must be a valid URL')
];

// Login validation middleware
// Book validation middleware
const validateBook = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters long'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 20 }).withMessage('Description must be at least 20 characters long'),
  
  body('author')
    .trim()
    .notEmpty().withMessage('Author is required')
    .matches(/^[A-Za-z\s]+$/).withMessage('Author name must contain only alphabetical characters and spaces'),
  
  body('imageUrl')
    .optional()
    .trim()
    .isURL().withMessage('Image URL must be a valid URL')
];

const validateLogin = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required'),
  
  body('password')
    .notEmpty().withMessage('Password is required')
];

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication token is required'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    req.user = user;
    next();
  });
};

// Admin middleware
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

// Login endpoint
app.post('/login', validateLogin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }

    const { name, password } = req.body;

    const db = client.db("BeReadyUsers");
    const user = await db.collection("users").findOne({ name });
    const booka = await db.collection("books").findOne({ name });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid name or password'
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid name or password'
      });
    }

    const token = jwt.sign(
      { userId: user._id, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      success: true,
      token,
      role: user.role
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login'
    });
  }
});

// Registration endpoint
app.post('/register', validateRegistration, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }

    const { name, password, role } = req.body;

    const db = client.db("BeReadyUsers");
    const existingUser = await db.collection("users").findOne({ name });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        errors: [{
          field: 'name',
          message: 'This name is already taken'
        }]
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.collection("users").insertOne({
      name,
      password: hashedPassword,
      role,
      createdAt: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful'
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during registration'
    });
  }
});

// Get all books
app.get('/api/books', async (req, res) => {
  try {
    const db = client.db("BeReadyUsers");
    const books = await db.collection("books").find().toArray();
    
    res.status(200).json({
      success: true,
      books
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching books'
    });
  }
});

// Add book endpoint
app.post('/api/books', authenticateToken, isAdmin, validateBook, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }

    const { title, description, author, imageUrl } = req.body;

    const db = client.db("BeReadyUsers");
    const result = await db.collection("books").insertOne({
      title,
      description,
      author,
      imageUrl,
      createdAt: new Date()
    });

    res.status(201).json({
      success: true,
      message: `Book "${title}" added successfully`,
      bookId: result.insertedId
    });

  } catch (error) {
    console.error('Add book error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while adding the book'
    });
  }
});

// Update book endpoint
app.put('/api/books/:id', authenticateToken, isAdmin, validateBook, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }

    const { title, description, author, imageUrl } = req.body;
    const bookId = req.params.id;

    const db = client.db("BeReadyUsers");
    const result = await db.collection("books").updateOne(
      { _id: new ObjectId(bookId) },
      {
        $set: {
          title,
          description,
          author,
          imageUrl,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `Book "${title}" updated successfully`
    });

  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the book'
    });
  }
});

// Delete book endpoint
app.delete('/api/books/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const bookId = req.params.id;
    const db = client.db("BeReadyUsers");
    
    const result = await db.collection("books").deleteOne({
      _id: new ObjectId(bookId)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully'
    });

  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the book'
    });
  }
});

// Server status endpoint
app.get('/getstatus', (req, res) => {
  res.status(200).json({
      status: "success",
      message: "Server is running",
      timestamp: new Date().toISOString()
  });
});

// Connect to MongoDB and start server
async function startServer() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

startServer().catch(console.dir);

// Add book endpoint
app.post('/api/books', validateBook, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }

    const { title, description, author, imageUrl } = req.body;

    // Save book to database
    const db = client.db("BeReadyUsers");
    const result = await db.collection("books").insertOne({
      title,
      description,
      author,
      imageUrl,
      createdAt: new Date()
    });

    res.status(201).json({
      success: true,
      message: `Book "${title}" added successfully`,
      bookId: result.insertedId
    });

  } catch (error) {
    console.error('Add book error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while adding the book'
    });
  }
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  try {
    await client.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.log('Error closing MongoDB connection:', error);
  }
});
