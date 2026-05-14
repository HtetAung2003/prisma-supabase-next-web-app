"use client";

// import { Categories } from '@/lib/generated/prisma/client';
import { Icon } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MenuDropdownCategory from '../app/categories/_components/MenuDropdownCategory';
import { updateCategory } from '../actions/categories/update-category';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { EllipseSelectionFreeIcons } from '@hugeicons/core-free-icons';
import React, { useState } from 'react';
import { Category } from '@/lib/generated/prisma/client';

type ListItem = {
  id: number;
  name: string;
  image?: string;
  logo?: string;
  updatedAt?: Date;
  createdAt?: Date;
};

interface SimpleCardProps {
  item: ListItem;
  title?: string;
}
const SimpleCard = ({ item, title }: SimpleCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(item.name);
  const queryClient = useQueryClient();

  const updateCategoryMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Updated successfully');
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error('Failed: ' + (error as Error).message);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }

    await updateCategoryMutation.mutateAsync({
      id: item.id,
      name: name.trim(),
    });
  };

  const formattedDate = item.updatedAt
    ? new Date(item.updatedAt).toLocaleDateString()
    : item.createdAt
    ? new Date(item.createdAt).toLocaleDateString()
    : '';

  return (
    <article className="group overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl shadow-slate-950/20 transition hover:-translate-y-1 hover:border-white/20">
      <div className="relative overflow-hidden bg-slate-900">
        {item.image || item.logo ? (
          <img
            src={item.image || item.logo}
            alt={item.name}
            className="h-52 w-full object-cover transition duration-300 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-52 items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 text-slate-400">
            <div className="flex flex-col items-center gap-2">
              <Icon icon={EllipseSelectionFreeIcons} size={48} className="text-slate-500" />
              <span className="text-sm uppercase tracking-[0.24em] text-slate-500">No photo</span>
            </div>
          </div>
        )}
        <div className="absolute right-3 top-3 z-10">
          <MenuDropdownCategory categoryId={item.id} setIsEditing={setIsEditing} />
        </div>
      </div>

      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">{title?.toUpperCase()}</p>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <Input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="min-w-0 bg-slate-900 text-white"
                  aria-label={`Edit ${title?.toLowerCase() || 'category'} name`}
                />
                <Button type="submit" className="h-10 px-3">
                  Save
                </Button>
              </form>
            ) : (
              <h2 className="text-xl font-semibold text-white">{item.name}</h2>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
          <span>Updated {formattedDate}</span>
          <span className="rounded-full border border-slate-700 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-500">
            {item.image ? 'Photo' : item.logo ? 'Logo' : 'No image'}
          </span>
        </div>
      </div>
    </article>
  );
};

export default SimpleCard;
