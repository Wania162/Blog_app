const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const createToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

// REGISTER
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    console.log('Role received:', role); // ← yeh add karo
    console.log('Body:', req.body);      // ← yeh add karo

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Email pehle se registered hai' });
    }

    // Sirf 'user' ya 'admin' allow karo
    const userRole = role === 'admin' ? 'admin' : 'user';

    const user  = await User.create({ name, email, password, role: userRole });
    const token = createToken(user._id);

    return res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) { return next(err); }
};

// LOGIN
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = createToken(user._id);

    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) { next(err); }
};

// GET ME
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, user });
  } catch (err) { next(err); }
};