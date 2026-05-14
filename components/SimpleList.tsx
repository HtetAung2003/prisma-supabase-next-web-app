import { Brand, Category } from '@/lib/generated/prisma/client';
import SimpleCard from './SimpleCard';
type ListItem = {
  id: number;
  name: string;
};
interface SimpleListProps {
  items: ListItem[];
  searchQuery?: string;
  title?: string;
}
const SimpleList = ({ searchQuery = '' , title , items = []}: SimpleListProps) => {
  const query = searchQuery.trim().toLowerCase();
  console.log(items, "items in list", query , "query in list" , title , "title in list");
  const filteredItems = query
    ? items.filter((item) =>
        item.name.toLowerCase().includes(query)
      )
    : items;


  return (
    <div className="space-y-6 overflow-y-auto no-scrollbar pt-2 h-full">
      {title && (
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      )}
     
           {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <SimpleCard
              key={item.id}
              item={item}
              title={title}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-slate-400">
          No data found
        </div>
      )}
    </div>
  );
};

export default SimpleList;
