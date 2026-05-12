"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { create } from "@/actions/categories/create-cateogries";
import { toast } from "sonner";
import { create } from "@/actions/categories/create-cateogries";
import { log } from "console";

const CreateCategoryForm = () => {
    const queryClient = useQueryClient();
    const {mutateAsync : CreateCategoryMutation} = useMutation({
        mutationFn : create,
        onSuccess : () => {
            queryClient.invalidateQueries({queryKey: ["categories"]});
            toast.success("Category created successfully");
        },
         onError: (error) => {
            toast.error("Failed to create model: " + (error as Error).message);
        }

    })
  const [preview, setPreview] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setPreview(null);
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  };

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    console.log("FormData entries:",formData);
    const name = formData.get("name") as string;
    const photo = formData.get("photo") as File | null;

    if (!name?.trim()) {
      alert("Category name is required");
      return;
    }
    try {
    await CreateCategoryMutation(formData);
    
  console.log("Category created successfully", { name, photo });
    form.reset();
    if (setPreview) setPreview(null); 
    
  } catch (error) {

    console.error("Submission failed:", error);
  }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-foreground">
          Name
        </label>

        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Category name"
          autoComplete="off"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="photo" className="text-sm font-medium text-foreground">
          Photo
        </label>

        <Input
          id="photo"
          name="photo"
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
        />

        {preview && (
          <div className="mt-3">
            <img
              src={preview}
              alt="Preview"
              className="h-40 w-full rounded-lg border object-cover"
            />
          </div>
        )}
      </div>

      <Button type="submit" variant="default" className="w-full">
        Create Category
      </Button>
    </form>
  );
};

export default CreateCategoryForm;