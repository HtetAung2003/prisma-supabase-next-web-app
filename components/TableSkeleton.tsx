export const TableSkeleton = ({ columns }: { columns: number }) => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, rowIndex) => (
        <tr key={rowIndex} className="border-b">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className="py-3 px-2">
              <div className="h-4 w-full bg-muted animate-pulse rounded" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};