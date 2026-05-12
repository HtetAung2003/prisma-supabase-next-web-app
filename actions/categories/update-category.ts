'use server';

import { db } from '@/lib/db';

export const updateCategory = async ({ id, name }: { id: number; name: string }) => {
  if (!name?.trim()) {
    throw new Error('Category name is required');
  }

  await db.categories.update({
    where: { id },
    data: { name: name.trim() },
  });
};
