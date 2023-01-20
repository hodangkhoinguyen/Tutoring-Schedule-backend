import mongoose from 'mongoose';
import Appointment from './appointment.model.js';
import User from './user.model.js';
import Schedule from './schedule.model.js';

// mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;
db.appointment = Appointment;
db.user = User;
db.schedule = Schedule;

db.ROLES = ["student", "tutor", "admin"]
export default db;
