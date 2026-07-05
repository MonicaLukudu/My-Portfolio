import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../../data');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const ANALYTICS_FILE = path.join(DATA_DIR, 'analytics.json');

export let isFallback = true;

// Default Mock Data
const DEFAULT_REVIEWS = [
  {
    id: "rev-1",
    name: "Alex Rivera",
    email: "alex@techflow.io",
    message: "Monica's ability to simplify complex system requirements into elegant code is unmatched. Her approach to Soft-UI makes developer tools actually delightful to use.",
    rating: 5,
    status: "approved",
    avatarColor: "#A78BFA",
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString()
  },
  {
    id: "rev-2",
    name: "Sarah Jenkins",
    email: "sarah@cloudscale.net",
    message: "Architecting the future is a bold claim, but Monica delivers. We worked together on a legacy migration that seemed impossible, and she handled it with calm competence and technical rigor.",
    rating: 5,
    status: "approved",
    avatarColor: "#EC4899",
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString()
  },
  {
    id: "rev-3",
    name: "Marcus Thorne",
    email: "marcus@studiov.design",
    message: "A brilliant architect who understands the value of user experience. Rare to find someone who codes so deeply but cares about the interface so much.",
    rating: 4,
    status: "approved",
    avatarColor: "#3B82F6",
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString()
  },
  {
    id: "rev-4",
    name: "David Wu",
    email: "david@fullstack.dev",
    message: "Precision. That's the one word for Monica's work.",
    rating: 5,
    status: "approved",
    avatarColor: "#10B981",
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString()
  },
  {
    id: "rev-5",
    name: "Alice Smith",
    email: "alice@example.com",
    message: "How do I get in touch for a collaboration on a web application project?",
    rating: 5,
    status: "pending",
    avatarColor: "#F59E0B",
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString()
  }
];

const DEFAULT_SETTINGS = {
  name: "Monica David Lukudu",
  title: "Software Engineer",
  bio: "A dedicated Software Engineering graduate from ULK with a passion for building elegant, user-centric solutions. Blending technical precision with creative problem-solving to deliver high-quality digital experiences.",
  location: "Kigali, Rwanda",
  email: "monicalukudu@gmail.com",
  linkedin: "https://www.linkedin.com/in/monica-lukudu-842002303/",
  github: "https://github.com/monicalukudu",
  cvUrl: "#",
  profileImageUrl: ""
};

const DEFAULT_ANALYTICS = {
  hits: 0,
  engagementSeconds: 0,
  sessionsCount: 0,
  referrers: {},
  dailyHits: [
    { date: "Mon", count: 0 },
    { date: "Tue", count: 0 },
    { date: "Wed", count: 0 },
    { date: "Thu", count: 0 },
    { date: "Fri", count: 0 },
    { date: "Sat", count: 0 },
    { date: "Sun", count: 0 }
  ]
};

// Ensure JSON data files exist in fallback mode
function ensureJsonFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(REVIEWS_FILE)) {
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(DEFAULT_REVIEWS, null, 2));
  }
  if (!fs.existsSync(SETTINGS_FILE)) {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2));
  }
  if (!fs.existsSync(ANALYTICS_FILE)) {
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(DEFAULT_ANALYTICS, null, 2));
  }
}

// Connect to MongoDB or setup Fallback
export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn("[DB WARNING] MONGODB_URI not provided. Falling back to local JSON file database.");
    isFallback = true;
    ensureJsonFiles();  
    return;
  }

  try {
    // Set shorter timeout for local fast fail
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
      dbName: "portfolio"
    });
    console.log("[Database] Connected successfully to MongoDB.");
    isFallback = false;
  } catch (error) {
    console.warn(`[Database] MongoDB connection failed: ${error.message}.`);
    console.warn("[Database] Falling back to local JSON file database.");
    isFallback = true;
    ensureJsonFiles();
  }
}

// JSON helpers (locks/sync helper or simple read/write since it's local single user)
function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    console.error(`Error reading ${filePath}:`, e);
    return [];
  }
}

function writeJson(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (e) {
    console.error(`Error writing ${filePath}:`, e);
    return false;
  }
}

// Unified Database Access Functions
export const dbService = {
  // --- REVIEWS ---
  async getReviews(includePending = false) {
    if (!isFallback) {
      const ReviewModel = mongoose.model('Review');
      const query = includePending ? {} : { status: 'approved' };
      return await ReviewModel.find(query).sort({ createdAt: -1 });
    } else {
      const reviews = readJson(REVIEWS_FILE);
      const filtered = includePending ? reviews : reviews.filter(r => r.status === 'approved');
      // Sort descending by date
      return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  },

  async createReview(reviewData) {
    const avatarColors = ["#A78BFA", "#EC4899", "#3B82F6", "#10B981", "#F59E0B", "#EF4444"];
    const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];
    
    const newDoc = {
      name: reviewData.name,
      email: reviewData.email,
      message: reviewData.message,
      rating: Number(reviewData.rating || 5),
      status: 'pending',
      avatarColor: randomColor,
      createdAt: new Date().toISOString()
    };

    if (!isFallback) {
      const ReviewModel = mongoose.model('Review');
      const review = new ReviewModel(newDoc);
      return await review.save();
    } else {
      const reviews = readJson(REVIEWS_FILE);
      newDoc.id = 'rev-' + Date.now();
      reviews.push(newDoc);
      writeJson(REVIEWS_FILE, reviews);
      return newDoc;
    }
  },

  async updateReviewStatus(id, status) {
    if (!isFallback) {
      const ReviewModel = mongoose.model('Review');
      return await ReviewModel.findByIdAndUpdate(id, { status }, { new: true });
    } else {
      const reviews = readJson(REVIEWS_FILE);
      const idx = reviews.findIndex(r => r.id === id);
      if (idx !== -1) {
        reviews[idx].status = status;
        writeJson(REVIEWS_FILE, reviews);
        return reviews[idx];
      }
      return null;
    }
  },

  async deleteReview(id) {
    if (!isFallback) {
      const ReviewModel = mongoose.model('Review');
      return await ReviewModel.findByIdAndDelete(id);
    } else {
      const reviews = readJson(REVIEWS_FILE);
      const filtered = reviews.filter(r => r.id !== id);
      writeJson(REVIEWS_FILE, filtered);
      return true;
    }
  },

  // --- SETTINGS ---
  async getSettings() {
    if (!isFallback) {
      const SettingsModel = mongoose.model('Settings');
      let settings = await SettingsModel.findOne();
      if (!settings) {
        settings = new SettingsModel(DEFAULT_SETTINGS);
        await settings.save();
      }
      return settings;
    } else {
      return readJson(SETTINGS_FILE);
    }
  },

  async updateSettings(settingsData) {
    if (!isFallback) {
      const SettingsModel = mongoose.model('Settings');
      let settings = await SettingsModel.findOne();
      if (!settings) {
        settings = new SettingsModel(DEFAULT_SETTINGS);
      }
      Object.assign(settings, settingsData);
      return await settings.save();
    } else {
      const current = readJson(SETTINGS_FILE);
      const updated = { ...current, ...settingsData };
      writeJson(SETTINGS_FILE, updated);
      return updated;
    }
  },

  // --- ANALYTICS ---
  async getAnalytics() {
    if (!isFallback) {
      const AnalyticsModel = mongoose.model('Analytics');
      let analytics = await AnalyticsModel.findOne();
      if (!analytics) {
        analytics = new AnalyticsModel(DEFAULT_ANALYTICS);
        await analytics.save();
      }
      return analytics;
    } else {
      return readJson(ANALYTICS_FILE);
    }
  },

  async recordHit(referrer = 'Direct') {
    const validReferrers = ['LinkedIn', 'GitHub', 'Direct'];
    let refKey = 'Direct';
    if (referrer) {
      const matched = validReferrers.find(r => referrer.toLowerCase().includes(r.toLowerCase()));
      if (matched) refKey = matched;
    }

    if (!isFallback) {
      const AnalyticsModel = mongoose.model('Analytics');
      let analytics = await AnalyticsModel.findOne();
      if (!analytics) {
        analytics = new AnalyticsModel(DEFAULT_ANALYTICS);
      }
      analytics.hits += 1;
      analytics.sessionsCount += 1;
      
      const currentCount = analytics.referrers.get(refKey) || 0;
      analytics.referrers.set(refKey, currentCount + 1);

      // Increment daily hit count for today
      const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'short' });
      const dayIndex = analytics.dailyHits.findIndex(dh => dh.date === todayStr);
      if (dayIndex !== -1) {
        analytics.dailyHits[dayIndex].count += 1;
      } else {
        analytics.dailyHits.push({ date: todayStr, count: 1 });
        if (analytics.dailyHits.length > 7) analytics.dailyHits.shift();
      }
      
      await analytics.save();
      return analytics;
    } else {
      const analytics = readJson(ANALYTICS_FILE);
      analytics.hits += 1;
      analytics.sessionsCount += 1;
      if (!analytics.referrers[refKey]) analytics.referrers[refKey] = 0;
      analytics.referrers[refKey] += 1;

      // Update daily hits
      const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'short' });
      const dayIndex = analytics.dailyHits.findIndex(dh => dh.date === todayStr);
      if (dayIndex !== -1) {
        analytics.dailyHits[dayIndex].count += 1;
      } else {
        analytics.dailyHits.push({ date: todayStr, count: 1 });
        if (analytics.dailyHits.length > 7) analytics.dailyHits.shift();
      }

      writeJson(ANALYTICS_FILE, analytics);
      return analytics;
    }
  },

  async recordEngagement(seconds) {
    if (!isFallback) {
      const AnalyticsModel = mongoose.model('Analytics');
      let analytics = await AnalyticsModel.findOne();
      if (!analytics) {
        analytics = new AnalyticsModel(DEFAULT_ANALYTICS);
      }
      analytics.engagementSeconds += seconds;
      await analytics.save();
      return analytics;
    } else {
      const analytics = readJson(ANALYTICS_FILE);
      analytics.engagementSeconds += seconds;
      writeJson(ANALYTICS_FILE, analytics);
      return analytics;
    }
  }
};
