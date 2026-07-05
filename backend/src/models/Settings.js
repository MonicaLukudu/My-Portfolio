import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Monica David Lukudu"
  },
  title: {
    type: String,
    default: "Software Engineer"
  },
  bio: {
    type: String,
    default: ""
  },
  location: {
    type: String,
    default: "Kigali, Rwanda"
  },
  email: {
    type: String,
    default: "monicalukudu@gmail.com"
  },
  linkedin: {
    type: String,
    default: ""
  },
  github: {
    type: String,
    default: ""
  },
  cvUrl: {
    type: String,
    default: "#"
  },
  profileImageUrl: {
    type: String,
    default: ""
  }
});

export default mongoose.model('Settings', settingsSchema);
