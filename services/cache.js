const mongoose = require('mongoose');

// get reference to original mongoose exec func
const exec = mongoose.Query.prototype.exec;

// Have to use function() instead of =>
mongoose.Query.prototype.exec = function () {
  console.log('ABOUT TO RUN A QUERY');
  return exec.apply(this, arguments);
}