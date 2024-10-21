// models/Patient.js
const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  id: { type: String, required: true, unique: true },
  descirption: { type: String},
});

const Patient = mongoose.model('Patient', PatientSchema);
module.exports = Patient;
