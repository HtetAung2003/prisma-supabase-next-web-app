import { Categories } from '@/lib/generated/prisma/client';
import CategoryCard from './CategoryCard';

interface CategoriesListProps {
  categories?: Categories[];
  searchQuery?: string;
}

const CategoriesList = ({ categories = [], searchQuery = '' }: CategoriesListProps) => {
  const query = searchQuery.trim().toLowerCase();
  const filteredCategories = query
    ? categories.filter((category) => category.name.toLowerCase().includes(query))
    : categories;

  return (
    <div className="space-y-6">
      {filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-slate-950 p-8 text-center text-sm text-slate-400 shadow-xl shadow-slate-950/10">
          No categories found. Try another search or create a new category.
        </div>
      )}
    </div>
  );
};

export default CategoriesList;
