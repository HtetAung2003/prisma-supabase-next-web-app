"use client";
import { Icon } from '@/components/Icon';
import { Model } from '@/lib/generated/prisma/client';
import { File } from '@hugeicons/core-free-icons';
import React, { useState }from 'react'
import MenuDropdown from './MenuDropdown';
import { update } from '@/actions/update-model';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
interface CardProps {
    model: Model

}
const Card = ({ model }: CardProps) => {
    const [ isEditing, setIsEditing] = useState(false);
    const [input , setInput] =useState(model.name);
    const queryClient = useQueryClient();
    const {mutateAsync : updateModelMutation} = useMutation({
        mutationFn: update,
        onSuccess: () => {    
            queryClient.invalidateQueries({queryKey: ["models"]});
            setIsEditing(false);
            toast.success("Model updated successfully");     
        },
        onError: (error) => {
            toast.error("Failed to update model: " + (error as Error).message);
            setIsEditing(false);
        }
    })
    const updateModel = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        if (!name) {
            alert("Model name is required");
            return;
        }
      await updateModelMutation({id: model.id, name});
    }
    return (
        <div className='text-white flex items-center gap-2 border border-neutral-700 rounded-md p-2 w-[250px] cursor-pointer justify-between bg-neutral-800'>
            <div className='flex items-cetner gap-2'>
                <div className='border border-neutral-700 p-3 rounded-md shadow-xs text-neutral-400 bg-neutral-500/10 shadow-white/15'>
                    <Icon icon={File} size={20} />

                </div>
                <div>
{
                    isEditing ? (
                        <form onSubmit={updateModel}>
                            <input type="text" name="name" defaultValue={model.name} value={input} onChange={(e) => setInput(e.target.value)} className='bg-transparent outline-none text-sm w-full' />
                        </form>
                    ) : (
                        <div>{model.name}</div>
                    )
}
                   
                    <div className='text-neutral-400 text-xs'>{model.updatedAt.toLocaleString()}</div>

                </div>
            </div>
            <MenuDropdown modelId={model.id} setIsEditing={setIsEditing} />
        </div>
    )
}

export default Card