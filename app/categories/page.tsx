'use client'
import { getCategory } from "@/actions/categories/get-categories";
import { useQuery } from "@tanstack/react-query";

export default function CategoryList() {
    const { data: categories, isLoading, isError, error } = useQuery({
        queryKey: ["categories"],
        queryFn: () => getCategory(), // Wrap it in an anonymous function
    });

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {JSON.stringify(error)}</div>;

    return (
        <ul>
            {categories?.map((cat) => (
                <li key={cat.id}>{cat.name}</li>
            ))}
        </ul>
    );
}