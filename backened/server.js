const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const app = express();
const mongoURI = 'mongodb+srv://ruchi:ruchi@cluster0.dfqr1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Update your connection string

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

app.use(express.json());
app.use(cors());

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 }
});

const User = mongoose.model('User', userSchema);

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  designation: { type: String, required: true },
  gender: { type: String, enum: ['M', 'F'], required: true },
  courses: { type: [String], required: true },
  image: { type: String } 
});

const Employee = mongoose.model('Employee', employeeSchema);


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.send({ message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error creating user' });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, 'secretkey', { expiresIn: '1h' });
    res.send({ token, message: 'Logged in successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error logging in' });
  }
});

router.get('/employee/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).send({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error fetching employee' });
  }
});
router.put('/employee/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;

  // Create an object to hold the updated data
  const updatedData = { ...req.body };

  // If a new file is uploaded, add the file path to the updated data
  if (req.file) {
    updatedData.image = req.file.filename; // Save the file name
  }

  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedEmployee) {
      return res.status(404).send({ message: 'Employee not found' });
    }
    res.json(updatedEmployee);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error updating employee' });
  }
});


router.delete('/employee/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Employee.findByIdAndDelete(id);
    res.send({ message: 'Employee deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error deleting employee' });
  }
});

router.get('/employee', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error fetching employees' });
  }
});

router.post('/employee', upload.single('image'), async (req, res) => {
  const { name, email, mobile, designation, gender, courses } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const employee = new Employee({
      name,
      email,
      mobile,
      designation,
      gender,
      courses,
      image
    });

    await employee.save();
    res.send({ message: 'Employee created successfully', employee });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error creating employee' });
  }
});
app.use('/uploads', express.static('uploads'));

app.use('/api', router);

app.listen(8000, () => {
  console.log('Server started on port 8000');
});

module.exports = app;
