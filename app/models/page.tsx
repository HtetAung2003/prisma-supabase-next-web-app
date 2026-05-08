'use client';
import { useQuery } from "@tanstack/react-query";
import ModelsList from "./_components/ModelsList";
import Navbar from "./_components/Navbar";
import { get } from "@/actions/get-models";


const ModelsPage = () => {
  const { data: models, isLoading, isError } = useQuery({
    queryFn: get,
    queryKey: ["models"],
  });

  return (
    <div className="p-5 space-y-5">
      <Navbar />
      {isLoading ? (
        <div className="rounded-lg border border-border bg-card p-6 text-center text-sm text-muted-foreground">
          Loading models...
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