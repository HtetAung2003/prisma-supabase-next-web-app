import { del } from '@/actions/delete-model'
import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { EllipseSelectionFreeIcons, More01FreeIcons } from '@hugeicons/core-free-icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { toast } from 'sonner'

interface MenuDropdownProps {
    modelId : number,
    setIsEditing : React.Dispatch<React.SetStateAction<boolean>>
}
const MenuDropdown = ({ modelId, setIsEditing }: MenuDropdownProps) => {
    const queryClient = useQueryClient();
    const {mutateAsync : deleteModelMutation} = useMutation({
        mutationFn: del,
        onSuccess: () => {    
            queryClient.invalidateQueries({queryKey: ["models"]});
            toast.success("Model deleted successfully");     
        },
        onError: (error) => {
            toast.error("Failed to delete model: " + (error as Error).message);
        }
    })

    const handleDelete = async () => {
        await deleteModelMutation(modelId);
    };
  return (
<DropdownMenu>
    <DropdownMenuTrigger>
    <Button variant="ghost" className="h-6 w-6 cursor-pointer"><Icon icon={More01FreeIcons} size={20} /></Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className='w-40 bg-neutral-800 text-white border-none ' align='start'>
    <DropdownMenuGroup>
        <DropdownMenuItem onClick={() => {
            setIsEditing(true);
        }}>
            Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete}>
            Delete
        </DropdownMenuItem>
    </DropdownMenuGroup>
    </DropdownMenuContent>
</DropdownMenu>  )
}

export default MenuDropdown