import CreateCategoryForm from "@/app/categories/_components/CreateCategoryForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

const CreateCategoryDialog = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button
          variant="default"
          size="xs"
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-sm transition-all duration-200 hover:shadow-md h-10"
        >
          Create Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg bg-neutral-900 border-none shadow-md">
        <DialogHeader>
          Create New Category
          <DialogDescription>
            Add a new category with a name and optional photo.
          </DialogDescription>
        </DialogHeader>
        <CreateCategoryForm />
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategoryDialog;
