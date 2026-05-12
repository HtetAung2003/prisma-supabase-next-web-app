'use server';

import { db } from '@/lib/db';

export const delCategory = async (id: number) => {
  await db.category.delete({ where: { id } });
};
