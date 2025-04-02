import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
    },
    password: {
      type: String,
      required: true,
    },
    googleId: String,
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
