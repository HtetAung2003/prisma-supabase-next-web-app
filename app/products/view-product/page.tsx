import { TableSkeleton } from "@/components/TableSkeleton"
import { Button } from "@/components/ui/button"
import Loader from "@/components/ui/Loader"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  Row,
  useReactTable,
  ExpandedState
} from "@tanstack/react-table"
import React, { useState } from "react"

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  isLoading : boolean
}

export function ProductTable<TData>({
  columns,
  data,
  isLoading
}: DataTableProps<TData>) {
  const [expanded, setExpanded] = useState<ExpandedState>({}) // to store which rows are open or close as object
  const table = useReactTable({
    data: data ?? [],
    columns: columns ?? [],
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,

    getCoreRowModel: getCoreRowModel(),  // to render table fundamental structure
    getExpandedRowModel: getExpandedRowModel(),   // to enable expanded rows ( support) and to work expand and collapse
  })

  const renderVariantDetails = (row: Row<TData>) => {
    const product = row.original as any;  // product data
    const variants = product.variants || [];   // variant 

    return (
      <div className="p-4 bg-muted/40 rounded-lg m-2 border">
        {/* <h4 className="font-semibold text-sm mb-2 text-primary">Variant Details:</h4> */}
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b text-muted-foreground">
              <th className="text-left py-2">SKU / Code</th>
              <th className="text-left py-2">Name</th>
              <th className="text-left py-2">Color</th>
              <th className="text-left py-2">Pre order</th>
              <th className="text-left py-2">Price (S)</th>
              <th className="text-left py-2">last Sold</th>
              <th className="text-left py-2">Stock</th>
              <th className="text-left py-2">Product Status</th>
              <th className="text-left py-2">Purchase Status</th>
              <th className="text-left py-2">Action</th>


            </tr>
          </thead>
          <tbody>
            {variants.map((v: any, index: number) => (
              <tr key={index} className="border-b last:border-0">

                <td className="py-2">{v.sku || "-"}</td>

                <td className="py-2">{v.variantName || "-"}</td>

                <td className="py-2">{v.color || "-"}</td>

                <td className="py-2">
                  {v.isPreorder ? "Yes" : "No"}
                </td>

                <td className="py-2">
                  {v.sellPrice ?? 0} MMK
                </td>

                <td className="py-2">
                  {v.lastSoldAt ? new Date(v.lastSoldAt).toLocaleString() : "-"}
                </td>

                <td className="py-2">
                  {v.stockQty} pcs
                </td>

                <td className="py-2">
                  {v.status || "-"}
                </td>

                <td className="py-2">
                  {v.purchaseStatus === "PENDING" ? (
                    <span className="bg-yellow-700 px-2.5 py-1 rounded-full text-xs font-medium   ">
                      {v.purchaseStatus}
                    </span>
                  ) : v.purchaseStatus === "PURCHASED" ? (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-700   ">
                      {v.purchaseStatus}
                    </span>
                  ) : v.purchaseStatus === "CANCELLED" ? (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium  bg-red-700  ">
                      {v.purchaseStatus}
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                      {v.purchaseStatus || "-"}
                    </span>
                  )}
                </td>
                      <td className="py-2">
                <Button variant="default">Edit</Button>
                </td>


              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

     <TableBody>
  {isLoading ? (
    <TableSkeleton columns={6} />
  ) : table.getRowModel().rows.length ? (
    table.getRowModel().rows.map((row) => (
      <React.Fragment key={row.id}>
        <TableRow data-state={row.getIsExpanded() && "selected"}>
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>

        {/* Expanded Row */}
        {row.getIsExpanded() && (
          <TableRow>
            <TableCell colSpan={columns.length} className="p-0">
              {renderVariantDetails(row)}
            </TableCell>
          </TableRow>
        )}
      </React.Fragment>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={columns.length} className="text-center h-24">
        No data found
      </TableCell>
    </TableRow>
  )}
</TableBody>

      </Table>
    </div>
  )
}