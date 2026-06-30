import { openDB, type IDBPDatabase } from 'idb';

interface AphasaideDB {
  photos: {
    key: string;
    value: { id: string; blob: Blob };
    indexes: { id: string };
  };
}

let db: IDBPDatabase<AphasaideDB> | null = null;

async function getDB(): Promise<IDBPDatabase<AphasaideDB>> {
  if (!db) {
    db = await openDB<AphasaideDB>('aphasaide', 1, {
      upgrade(database) {
        database.createObjectStore('photos', { keyPath: 'id' });
      },
    });
  }
  return db;
}

export async function sauvegarderPhoto(id: string, blob: Blob): Promise<void> {
  const d = await getDB();
  await d.put('photos', { id, blob });
}

export async function lirePhoto(id: string): Promise<Blob | null> {
  const d = await getDB();
  const result = await d.get('photos', id);
  return result?.blob ?? null;
}

export async function supprimerPhoto(id: string): Promise<void> {
  const d = await getDB();
  await d.delete('photos', id);
}

export async function toutesLesPhotos(): Promise<{ id: string; blob: Blob }[]> {
  const d = await getDB();
  return d.getAll('photos');
}
