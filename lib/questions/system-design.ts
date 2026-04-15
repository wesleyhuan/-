import type { Question } from './behavioral'

export const systemDesignQuestions: Question[] = [
  // Scalability classics
  {
    id: 'sys-001', type: 'SYSTEM_DESIGN', category: 'scalability', difficulty: 'MEDIUM',
    question: 'Design a URL shortener like bit.ly. The system should generate short unique URLs, redirect users, and handle millions of requests per day.',
    requiresCode: false, googleFocus: true,
  },
  {
    id: 'sys-002', type: 'SYSTEM_DESIGN', category: 'distributed-systems', difficulty: 'HARD',
    question: 'Design a real-time collaborative document editor like Google Docs. Multiple users should be able to edit the same document simultaneously with conflict resolution.',
    requiresCode: false, googleFocus: true,
  },
  {
    id: 'sys-003', type: 'SYSTEM_DESIGN', category: 'social', difficulty: 'HARD',
    question: 'Design a news feed system like Twitter or Facebook. Users can post, follow others, and see a personalized feed of recent posts from those they follow.',
    requiresCode: false, googleFocus: true,
  },
  {
    id: 'sys-004', type: 'SYSTEM_DESIGN', category: 'storage', difficulty: 'HARD',
    question: 'Design a distributed file storage system like Dropbox or Google Drive. Users should be able to upload, download, and sync files across devices.',
    requiresCode: false, googleFocus: true,
  },
  {
    id: 'sys-005', type: 'SYSTEM_DESIGN', category: 'video', difficulty: 'HARD',
    question: 'Design a video streaming platform like YouTube. The system must handle video upload, transcoding, storage, CDN distribution, and playback at scale.',
    requiresCode: false, googleFocus: true,
  },
  {
    id: 'sys-006', type: 'SYSTEM_DESIGN', category: 'messaging', difficulty: 'HARD',
    question: 'Design a real-time chat application like WhatsApp or Slack. It should support one-on-one and group messaging, message delivery receipts, and offline message storage.',
    requiresCode: false, googleFocus: true,
  },
  {
    id: 'sys-007', type: 'SYSTEM_DESIGN', category: 'ride-sharing', difficulty: 'HARD',
    question: 'Design a ride-sharing service like Uber. Focus on location tracking, driver-rider matching, pricing, and handling real-time updates at massive scale.',
    requiresCode: false, googleFocus: true,
  },
  {
    id: 'sys-008', type: 'SYSTEM_DESIGN', category: 'search', difficulty: 'HARD',
    question: 'Design a web search engine like Google Search. Describe how you would crawl the web, build an inverted index, rank results, and serve search queries at scale.',
    requiresCode: false, googleFocus: true,
  },
  {
    id: 'sys-009', type: 'SYSTEM_DESIGN', category: 'e-commerce', difficulty: 'MEDIUM',
    question: 'Design an e-commerce checkout system. It should handle product catalog, shopping cart, inventory management, payment processing, and order fulfillment.',
    requiresCode: false, googleFocus: false,
  },
  {
    id: 'sys-010', type: 'SYSTEM_DESIGN', category: 'notifications', difficulty: 'MEDIUM',
    question: 'Design a notification system that sends push notifications, emails, and SMS at scale. It should support scheduling, templating, and handling delivery failures.',
    requiresCode: false, googleFocus: true,
  },
  {
    id: 'sys-011', type: 'SYSTEM_DESIGN', category: 'rate-limiting', difficulty: 'MEDIUM',
    question: 'Design a rate limiter that can restrict the number of API requests a user can make in a given time window. It must work in a distributed environment.',
    requiresCode: false, googleFocus: true,
  },
  {
    id: 'sys-012', type: 'SYSTEM_DESIGN', category: 'caching', difficulty: 'MEDIUM',
    question: 'Design a distributed caching system like Memcached or Redis. Describe how you would handle cache invalidation, eviction policies, and consistency.',
    requiresCode: false, googleFocus: true,
  },
  {
    id: 'sys-013', type: 'SYSTEM_DESIGN', category: 'maps', difficulty: 'HARD',
    question: 'Design a maps and navigation service like Google Maps. Focus on storing map data, calculating routes, handling real-time traffic, and serving location queries.',
    requiresCode: false, googleFocus: true,
  },
  {
    id: 'sys-014', type: 'SYSTEM_DESIGN', category: 'payment', difficulty: 'HARD',
    question: 'Design a payment processing system like Stripe. The system should handle transactions, prevent fraud, ensure idempotency, and provide reconciliation.',
    requiresCode: false, googleFocus: false,
  },
  {
    id: 'sys-015', type: 'SYSTEM_DESIGN', category: 'analytics', difficulty: 'HARD',
    question: 'Design a real-time analytics platform that ingests billions of events per day (like clicks, page views) and provides dashboards with near-real-time metrics.',
    requiresCode: false, googleFocus: true,
  },
  {
    id: 'sys-016', type: 'SYSTEM_DESIGN', category: 'recommendations', difficulty: 'HARD',
    question: 'Design a recommendation engine like Netflix\'s. It should provide personalized content recommendations based on user history, preferences, and global trends.',
    requiresCode: false, googleFocus: true,
  },
  {
    id: 'sys-017', type: 'SYSTEM_DESIGN', category: 'distributed-systems', difficulty: 'HARD',
    question: 'Design a distributed key-value store like Amazon DynamoDB. Address consistency models, partitioning, replication, and failure handling.',
    requiresCode: false, googleFocus: true,
  },
  {
    id: 'sys-018', type: 'SYSTEM_DESIGN', category: 'messaging', difficulty: 'MEDIUM',
    question: 'Design a job queue system. Producers enqueue tasks, workers process them, and the system should handle task prioritization, retries, and dead-letter queues.',
    requiresCode: false, googleFocus: false,
  },
  {
    id: 'sys-019', type: 'SYSTEM_DESIGN', category: 'social', difficulty: 'MEDIUM',
    question: 'Design a photo-sharing service like Instagram. Focus on upload, storage, feed generation, CDN delivery, and the challenges of serving millions of images.',
    requiresCode: false, googleFocus: false,
  },
  {
    id: 'sys-020', type: 'SYSTEM_DESIGN', category: 'search', difficulty: 'MEDIUM',
    question: 'Design a type-ahead search (autocomplete) system. As the user types, it should return relevant suggestions in under 100ms even at massive scale.',
    requiresCode: false, googleFocus: true,
  },
]
