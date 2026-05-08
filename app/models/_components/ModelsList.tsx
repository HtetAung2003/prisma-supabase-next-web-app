import { Model } from '@/lib/generated/prisma/client';
import React from 'react'
import Card from './Card';

interface ModelsListProps {
 models?: Model[];   
}

const ModelsList = ({ models }: ModelsListProps) => {
  const safeModels = models ?? [];

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 justify-items-center'>
      {safeModels.map((model: Model) => (
        <Card key={model.id} model={model} />
      ))}
      {safeModels.length === 0 && (
        <div className='col-span-full rounded-lg border border-border bg-card p-6 text-center text-sm text-muted-foreground'>
          No models found yet.
        </div>
      )}
    </div>
  );
}

export default ModelsList