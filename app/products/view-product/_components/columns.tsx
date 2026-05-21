import { Icon } from "@/components/Icon"
import { Button } from "@/components/ui/button"
import { ArrowDown01FreeIcons, ArrowDown02Icon, ArrowDownNarrowWide, ArrowRight01FreeIcons, ArrowUp01FreeIcons } from "@hugeicons/core-free-icons"
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

export const getColumns = (
  // onSort function to handle sorting when header is clicked, it receives the field name to sort by .omes from page.tsx and is used to update sortBy and sortOrder state which in turn triggers refetching of data with new sorting)
  onSort: (field: string ) => void, 
  sortBy: string,
  sortOrder: "asc" | "desc",
  onEdit: (id: string) => void
): ColumnDef<Product>[] => [
  {
    accessorKey: "variants",
    header: "",
    cell: ({ row }) => {
      const variants = row.original.variants;
      console.log(row.original.id);

      if (!variants) {
        return <span className="text-muted-foreground">-</span>;
      }
      return variants && variants.length > 0 ? (
        <div className="flex gap-3">
          <Button variant="link" size="sm"

            onClick={() => row.toggleExpanded()}   // toogle expand and collapse ( built-in)
          >
            {row.getIsExpanded() ? <Icon icon={ArrowUp01FreeIcons} size={50}/> : <Icon icon={ArrowRight01FreeIcons} size={50}/> }

          </Button>
        </div>
      ) : (
        null
      )
    }
  },
 {
  accessorKey: "name",
header: () => {
  const isActive = sortBy === "name"

  return (
    <Button
      variant="link"
      size="sm"
      onClick={() => onSort("name")}
      className="flex items-center gap-2"
    >
      Name

      {/* ICON LOGIC */}
      {isActive ? (
        sortOrder === "asc" ? (
            <Icon icon={ArrowUp01FreeIcons} size={20} />
        ) : (
          <Icon icon={ArrowDown01FreeIcons} size={20} />
        )
      ) : (
         <Icon icon={ArrowUp01FreeIcons} size={20} />
      )}
    </Button>
  )
}
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
  header: () => {
  const isActive = sortBy === "createdAt"

  return (
    <Button
      variant="link"
      size="sm"
      onClick={() => onSort("createdAt")}
      className="flex items-center gap-2"
    >
      Created At

      {/* ICON LOGIC */}
      {isActive ? (
        sortOrder === "asc" ? (
            <Icon icon={ArrowUp01FreeIcons} size={20} />
        ) : (
          <Icon icon={ArrowDown01FreeIcons} size={20} />
        )
      ) : (
         <Icon icon={ArrowUp01FreeIcons} size={20} />
      )}
    </Button>
  )
},
    cell: ({ row }) => {
      const dateValue = row.getValue("createdAt") as string | Date;

      if (!dateValue) return "-";


      const localDate = new Date(dateValue).toLocaleString();

      return localDate;
    }
  },
  {
    accessorKey: "updatedAt",
    header: () => {
  const isActive = sortBy === "updatedAt"

  return (
    <Button
      variant="link"
      size="sm"
      onClick={() => onSort("updatedAt")}
      className="flex items-center gap-2"
    >
      Updated At

      {/* ICON LOGIC */}
      {isActive ? (
        sortOrder === "asc" ? (
            <Icon icon={ArrowUp01FreeIcons} size={20} />
        ) : (
          <Icon icon={ArrowDown01FreeIcons} size={20} />
        )
      ) : (
         <Icon icon={ArrowUp01FreeIcons} size={20} />
      )}
    </Button>
  )
},
    cell: ({ row }) => {
      const dateValue = row.getValue("createdAt") as string | Date;

      if (!dateValue) return "-";


      const localDate = new Date(dateValue).toLocaleString();

      return localDate;
    }
  },
 {
  accessorKey: "Edit",
  cell: ({ row }) => (
    <Button onClick={() => onEdit(row.original.id)}>
      Edit
    </Button>
  ),
}
]
