const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const phoneRegex = /^[6-9]\d{9}$/;
const emailRegex = /^\S+@\S+\.\S+$/;

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

exports.register = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const { phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Enter a valid email' });
    }
    if (!phoneRegex.test(phone)) {
      return res
        .status(400)
        .json({ message: 'Enter a valid 10-digit mobile number' });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 8 characters' });
    }

    const exists = await User.findOne({
      where: { [require('sequelize').Op.or]: [{ phone }, { email }] },
    });
    if (exists) {
      return res
        .status(409)
        .json({ message: 'Phone or email already registered' });
    }

    const hash = await bcrypt.hash(password, 12);
    await User.create({ name, email, phone, password: hash });

    res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res
        .status(400)
        .json({ message: 'Phone and password are required' });
    }

    const user = await User.scope('withPassword').findOne({ where: { phone } });
    const ok = user && (await bcrypt.compare(password, user.password));

    if (!ok) {
      return res.status(401).json({ message: 'Invalid phone or password' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    res.cookie('token', token, cookieOptions);

    res.json({
      message: 'Logged in',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.me = async (req, res) => {
  res.json({ user: req.user });
};

exports.logout = (req, res) => {
  res.clearCookie('token', { ...cookieOptions, maxAge: undefined });
  res.json({ message: 'Logged out' });
};
