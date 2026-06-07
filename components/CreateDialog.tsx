import CreateForm from "@/components/CreateForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CreateDialogProps {
  entityName: string;
}
const CreateDialog = ({ entityName }: CreateDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger 
      
     >
          <Button
              variant="default"
              size="xs"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-sm transition-all duration-200 hover:shadow-md h-10"
          >
              Create {entityName}
          </Button>

        
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg bg-neutral-900 border-none shadow-md">
        <DialogHeader>
          Create New {entityName}
          <DialogDescription>
            Add a new {entityName.toLowerCase()} with a name and optional photo.
          </DialogDescription>
        </DialogHeader>
        <CreateForm entityName={entityName} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateDialog;
