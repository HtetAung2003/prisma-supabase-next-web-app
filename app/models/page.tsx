'use client';
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ModelsList from "./_components/ModelsList";
import Navbar from "./_components/Navbar";
import { get } from "@/actions/get-models";
import Loader from "@/components/ui/Loader";


const ModelsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: models, isLoading, isError } = useQuery({
    queryFn: get,
    queryKey: ["models"],
  });

  return (
    <div className="p-5 space-y-5">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      {isLoading ? (
        <div className="flex min-h-screen items-center justify-center">
  <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
    <Loader />
  </div>
</div>
      ) : isError ? (
        <div className="rounded-lg border border-border bg-card p-6 text-center text-sm text-destructive">
          Unable to load models.
        </div>
      ) : (
        <ModelsList models={models} />
      )}
    </div>
  );
};

export default ModelsPage;