import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  hits: {
    type: Number,
    default: 0
  },
  sessionsCount: {
    type: Number,
    default: 0
  },
  engagementSeconds: {
    type: Number,
    default: 0
  },
  referrers: {
    type: Map,
    of: Number,
    default: {
      LinkedIn: 0,
      GitHub: 0,
      Direct: 0
    }
  },
  dailyHits: [
    {
      date: String,
      count: Number
    }
  ]
});

export default mongoose.model('Analytics', analyticsSchema);
