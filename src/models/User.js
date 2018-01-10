import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import uniqueValidator from 'mongoose-unique-validator';

// doing some validation on API
const schema = new mongoose.Schema(
  {
  email: { 
    type: String, 
    required: true, 
    lowercase: true, 
    index: true, 
    unique: true 
  },
  passwordHash: { type: String, required: true },
  confirmed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

schema.methods.isValidPassword = function isValidPassword(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

// Sync the password hash between react app and api
schema.methods.setPassword = function setPassword(password) {
  this.passwordHash = bcrypt.hashSync(password, 10);
};

// use jwt with sign method to create and encrypt the user web token
// first parameter is email (public) and the second is secretkey
schema.methods.generateJWT = function generateJWT() {
  return jwt.sign(
  {
    email: this.email 
  }, 
  process.env.JWT_SECRET
  );
};

// object to passing to client
// not using in router because need to centralized in user
schema.methods.toAuthJSON = function toAuthJSON() {
  return {
  	email: this.email,
    confirmed: this.confirmed,
  	token: this.generateJWT()
  }
};

schema.plugin(uniqueValidator, { message: "This email is already registered" });

export default mongoose.model('User', schema);