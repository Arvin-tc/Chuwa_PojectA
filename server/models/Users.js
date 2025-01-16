import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    validate: {
      validator: function (v) {
        // Regular expression for validating email
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: (props) => `${props.value} is not valid!`,
    },
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  userType: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  cart :[
    {
      id:String,
      name:String,
      price:Number,
      quantity:Number,
      image:String,
    }
  ],

});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model('User', UserSchema);

export default User;
