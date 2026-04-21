const mongoose = require('mongoose')

const designSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Design must belong to a user']
  },
  name: {
    type: String,
    default: 'Untitled Design'
  },
  config: {
    color: String,
    textureUrl: String,
    roughness: Number,
    metalness: Number,
    decals: [{
      id: String,
      url: String,
      position: [Number],
      scale: [Number],
      rotation: [Number],
      type: String, // 'logo' | 'text'
      text: String,
      font: String
    }]
  },
  thumbnail: String, // Base64 or URL
  createdAt: {
    type: Date,
    default: Date.now()
  }
})

const Design = mongoose.model('Design', designSchema)
module.exports = Design
