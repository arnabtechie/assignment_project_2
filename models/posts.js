import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
  },
  completed: {
    type: Boolean,
  },
}, {
  timestamps: true,
  versionKey: false,
});

postSchema.index({ id: 1 }, { unique: true });

const PostModel = mongoose.model('Post', postSchema);

export default PostModel;
