const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true }, 
    password: { type: String, required: true }, 
    userType: { type: String, enum: ['admin', 'user'], default: 'user' }, 
  });


UserSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 8);
    }
    next();
  });

```
// Compare the password with the hashed password    
UserSchema.methods.comparePassword = async function(candidatePassword) {
    const user = this;
    return bcrypt.compare(candidatePassword, user.password);
  };
```

const User = mongoose.model('User', UserSchema);
module.exports = User;

