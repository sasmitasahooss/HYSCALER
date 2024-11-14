const mongoose = require('../Database/mongooseConnection');

const employeeSchema = new mongoose.Schema({
  id: { 
    type: String, 
},
  name: { 
    type: String, 
    required: true 
},
  email: { 
    type: String, 
    unique: true,
    required: true 
},
  password: { 
    type: String, 
    required: true
 },
  role: {
    type: String,
    default: 'employee'
}
});

module.exports = mongoose.model('Employee', employeeSchema);

