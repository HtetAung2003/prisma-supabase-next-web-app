import { create } from "@/actions/create-model";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const CreateModelForm = () => {
    const queryClient = useQueryClient();
    const {mutateAsync : CreateModelMutation} = useMutation({
        mutationFn: create,
        onSuccess: () => {    
            queryClient.invalidateQueries({queryKey: ["models"]});
            toast.success("Model created successfully");     
        },
        onError: (error) => {
            toast.error("Failed to create model: " + (error as Error).message);
        }
    })
    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
       const form = e.currentTarget;
       const formData = new FormData(form);
       const name = formData.get("name") as string;
       console.log("Model Name:", name);
       if (!name) {       
         alert("Model name is required");
        return;
       }
       await CreateModelMutation(name);
       form.reset();
    }
  return (
   <form onSubmit={handleSubmit} className="space-y-4"> 
    <Input placeholder="Model Name" type="text" id="name" name="name" className="text-white" autoComplete="off" />
    <Button type="submit" variant='outline'>
      Create Model
    </Button>
   </form>
  );
};

export default CreateModelForm;