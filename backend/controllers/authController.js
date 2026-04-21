const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../models/User')

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'threadcraft-secret-key-2026', {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d'
  })
}

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id)
  
  // Remove password from output
  user.password = undefined

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user }
  })
}

// Mock database for environments without MongoDB
const mockUsers = []

exports.signup = async (req, res, next) => {
  try {
    // Check if DB is connected
    if (mongoose.connection.readyState !== 1) {
      console.warn('⚠️ MongoDB not connected. Falling back to Mock Auth (In-Memory).')
      
      const { name, email, password } = req.body
      if (mockUsers.find(u => u.email === email)) {
        return res.status(400).json({ status: 'fail', message: 'Email already registered (Mock DB)' })
      }
      
      const newUser = { _id: Date.now().toString(), name, email, role: 'user' }
      mockUsers.push({ ...newUser, password }) // In mock mode we store plain for simplicity
      
      return createSendToken(newUser, 201, res)
    }

    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role || 'user'
    })

    createSendToken(newUser, 201, res)
  } catch (err) {
    console.error('[SIGNUP ERROR]', err)
    let message = err.message
    
    // Handle duplicate key error (MongoDB code 11000)
    if (err.code === 11000) {
      message = 'This email address is already registered.'
    }

    res.status(400).json({
      status: 'fail',
      message
    })
  }
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // 1) Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({ status: 'fail', message: 'Please provide email and password' })
    }

    // 2) Handle Mock mode
    if (mongoose.connection.readyState !== 1) {
      const user = mockUsers.find(u => u.email === email && u.password === password)
      if (!user) {
        return res.status(401).json({ status: 'fail', message: 'Incorrect email or password (Mock DB)' })
      }
      return createSendToken(user, 200, res)
    }

    // 3) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password')

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ status: 'fail', message: 'Incorrect email or password' })
    }

    // 3) If everything ok, send token to client
    createSendToken(user, 200, res)
  } catch (err) {
    console.error('[LOGIN ERROR]', err)
    res.status(400).json({
      status: 'fail',
      message: err.message
    })
  }
}

exports.protect = async (req, res, next) => {
  try {
    // 1) Getting token and check of it's there
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({ status: 'fail', message: 'You are not logged in!' })
    }

    // 2) Verification token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'threadcraft-secret-key-2026')

    // 3) Check if user still exists
    let currentUser
    if (mongoose.connection.readyState !== 1) {
      currentUser = mockUsers.find(u => u._id === decoded.id)
    } else {
      currentUser = await User.findById(decoded.id)
    }

    if (!currentUser) {
      return res.status(401).json({ status: 'fail', message: 'The user belonging to this token no longer exists.' })
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser
    next()
  } catch (err) {
    res.status(401).json({ status: 'fail', message: 'Invalid token' })
  }
}

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ status: 'fail', message: 'You do not have permission to perform this action' })
    }
    next()
  }
}
