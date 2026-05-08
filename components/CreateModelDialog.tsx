import CreateModelForm from "@/app/models/_components/CreateModelForm";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from "./ui/dialog";

const CreateModelDialog = () => {
  return (
    <Dialog>
        <DialogTrigger>
            <Button 
                variant="default" 
                size="xs" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-sm transition-all duration-200 hover:shadow-md h-10"
            >
                Create Model
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg bg-neutral-900 border-none shadow-md">
        <DialogHeader>Creeate New Model
        <DialogDescription>
            Add a new model to your collection by specifying its name.
        </DialogDescription>
</DialogHeader>
<CreateModelForm/>
        </DialogContent>
       
    </Dialog>
  );
};

export default CreateModelDialog;