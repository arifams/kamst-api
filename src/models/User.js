import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// doing some validation on API
const schema = new mongoose.Schema(
  {
  email: { type: String, required: true, lowercase: true, index: true },
  passwordHash: { type: String, required: true }
  }, 
  { timeStamps: true }
);

schema.methods.isValidPassword = function isValidPassword(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

export default mongoose.model('User', schema);