import Dexie from 'dexie';

export const db = new Dexie('CodeGenomeDB');

db.version(1).stores({
  genomes: '++id, title, language, technology, framework, type, status, difficulty, isFavorite, createdAt, updatedAt, *tags',
  projects: '++id, name, progress, createdAt, *stack',
  bugs: '++id, title, environment, confidence, createdAt',
  ideas: '++id, title, isTurnedToProject, createdAt',
  decisions: '++id, projectId, title, date, createdAt',
  challenges: '++id, category, type, difficulty',
  learningMemory: '++id, topic, nextReviewDate, status',
  personalStack: '++id, category, name, level',
  userSettings: 'id',
  aiConversations: '++id, mode, createdAt',
});

export default db;
