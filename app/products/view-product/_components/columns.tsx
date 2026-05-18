import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { useRouter } from "next/navigation"

export type Product = {
  id: string
  name: string
  brand: {
    name: string
  }
  category: {
    name: string
  }
  createdAt: Date,
  updatedAt: Date,
  variants: []

}
export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "brand.name",
    header: "Brand",
  },
  {
    accessorKey: "category.name",
    header: "Category",
  },

  {
    accessorKey: "createdAt",
    header: "cratedAt",
    cell: ({ row }) => {
      const dateValue = row.getValue("createdAt") as string | Date;

      if (!dateValue) return "-";


      const localDate = new Date(dateValue).toLocaleString();

      return localDate;
    }
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => {
      const dateValue = row.getValue("createdAt") as string | Date;

      if (!dateValue) return "-";


      const localDate = new Date(dateValue).toLocaleString();

      return localDate;
    }
  },
  {
    accessorKey: "variants",
    header: "Action",
    cell: ({ row }) => {
      const route = useRouter();
      const variants = row.original.variants;
        console.log(row.original.id);
        
      if (!variants) {
        return <span className="text-muted-foreground">-</span>;
      }
      return variants && variants.length > 0 ? (
        <div className="flex gap-3">
        <Button variant="outline" size="sm"
        
         onClick={() => row.toggleExpanded()}   // toogle expand and collapse ( built-in)
          >
          {row.getIsExpanded() ? "Hide Variant" : "View Variant"}
         
        </Button>
        <Button onClick={()=> route.push(`products/${row.original.id}`)}>Edit</Button></div>
      ) : (
       <Button onClick={()=> route.push(`products/${row.original.id}`)}>Edit</Button>   
      );
    }
  }
]