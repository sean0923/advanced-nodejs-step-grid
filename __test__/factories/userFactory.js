import mongoose from 'mongoose';

const User = mongoose.model('User');


export default () => {
  return new User({}).save();
};
