'use client';

import { delCategory } from '../../../actions/categories/delete-category';
import { Icon } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { More01FreeIcons } from '@hugeicons/core-free-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';

interface MenuDropdownCategoryProps {
  categoryId: number;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

const MenuDropdownCategory = ({ categoryId, setIsEditing }: MenuDropdownCategoryProps) => {
  const queryClient = useQueryClient();
  const deleteCategoryMutation = useMutation<void, Error, number>({
    mutationFn: delCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete category: ' + (error as Error).message);
    },
  });

  const handleDelete = async () => {
    const confirmed = window.confirm('Delete this category? This action cannot be undone.');
    if (!confirmed) return;
    await deleteCategoryMutation.mutateAsync(categoryId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="h-10 w-10 rounded-full bg-slate-900/80 text-slate-100 shadow-sm shadow-black/20">
     
          <Icon icon={More01FreeIcons} size={20} />
      
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44 bg-slate-950 text-white border border-slate-800" align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => setIsEditing(true)}>Edit</DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MenuDropdownCategory;
