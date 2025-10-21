
//TODO: remove once create is tested
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { categories, entries } from '@/db/schema';
import { SQLiteProvider } from 'expo-sqlite';
import { migrate } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '../drizzle/migrations';

export async function seedDatabase(db: any) {
  const drizzleDb = drizzle(db);

  // Insert sample categories
  await drizzleDb.insert(categories).values([
    { categoryId: 'anime', name: 'Anime', lastAccessed: Date.now(), ord: 1 },
    { categoryId: 'drama', name: 'Drama', lastAccessed: Date.now(), ord: 2 },
    { categoryId: 'movie', name: 'Movie', lastAccessed: Date.now(), ord: 3 },
  ]);

  // Insert sample entries
  const now = Date.now();
  await drizzleDb.insert(entries).values([
    {
      entryId: 'entry_1',
      categoryId: 'anime',
      title: 'Attack on Titan',
      status: 'completed',
      description: 'A story about humanity fighting titans',
      userRating: 5,
      createdAt: now,
      updatedAt: now,
    },
    {
      entryId: 'entry_2',
      categoryId: 'anime',
      title: 'One Piece',
      status: 'current',
      description: 'Pirate adventure',
      userRating: 4.5,
      createdAt: now,
      updatedAt: now,
    },
    {
      entryId: 'entry_3',
      categoryId: 'drama',
      title: 'Breaking Bad',
      status: 'completed',
      description: 'A chemistry teacher turned meth manufacturer',
      userRating: 5,
      createdAt: now,
      updatedAt: now,
    },
  ]);
}