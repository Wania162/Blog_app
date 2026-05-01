const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type:      String,
    required:  [true, 'Title are required'],
    trim:      true,
    maxlength: 100,
  },
  content: {
    type:     String,
    required: [true, 'Content is required'],
  },
  excerpt: {
    type:      String,
    maxlength: 200,
  },
  author: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User',
    required: true,
  },
  // ✅ Image fields add kiye
  image:          { type: String, default: '' },
  imagePublicId:  { type: String, default: '' },

  tags:      [String],
  published: { type: Boolean, default: true },
  views:     { type: Number,  default: 0    },
}, { timestamps: true });

postSchema.pre('save', function() {
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.substring(0, 150) + '...';
  }
});

module.exports = mongoose.model('Post', postSchema);