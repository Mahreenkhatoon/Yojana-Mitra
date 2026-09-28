const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const profileSchema = new mongoose.Schema({
  dateOfBirth    : { type: String, default: '' },
  age            : { type: Number },
  gender         : { type: String, enum: ['male', 'female', 'other', 'prefer_not_to_say', ''] },
  state          : { type: String, default: '' },
  income         : { type: Number },          // Annual family income in INR
  occupation     : { type: String, default: '' },
  category       : { type: String, enum: ['general', 'obc', 'sc', 'st', 'ews', ''], default: '' },
  location       : { type: String, enum: ['rural', 'urban', 'semi-urban', ''], default: '' },
  disability     : { type: Boolean, default: false },
  disabilityType : { type: String, default: '' },
  maritalStatus  : { type: String, enum: ['single', 'married', 'widowed', 'divorced', ''], default: '' },
  educationLevel : { type: String, default: '' },
  familySize     : { type: Number },
  landOwnership  : { type: Boolean, default: false },
  bankAccount    : { type: Boolean, default: true },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name     : { type: String, required: [true, 'Name is required'], trim: true },
  email    : {
    type     : String,
    required : [true, 'Email is required'],
    unique   : true,
    lowercase: true,
    trim     : true,
    match    : [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  password : {
    type     : String,
    required : [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select   : false,
  },
  role        : { type: String, enum: ['user', 'admin'], default: 'user' },
  profile     : { type: profileSchema, default: () => ({}) },
  isActive    : { type: Boolean, default: true },
  lastLogin   : { type: Date },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password  = await bcrypt.hash(this.password, salt);
  next();
});

// Compare plain password with stored hash
userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
