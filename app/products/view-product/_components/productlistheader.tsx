'use client';

import { useEffect, useState } from "react";

import { Icon } from "@/components/Icon";

import { Button } from "@/components/ui/button";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";

import {
  CalendarFreeIcons,
  FilterAddFreeIcons,
  Search01FreeIcons,
} from "@hugeicons/core-free-icons";

import { format } from "date-fns";

import { getbrand } from "@/actions/brands/get-brands";
import { getCategory } from "@/actions/categories/get-categories";

interface ProductHeaderProps {
  brandId: number | null;
  setBrandId: (id: number | null) => void;

  categoryId: number | null;
  setCategoryId: (id: number | null) => void;

  search: string;
  setSearch: (value: string) => void;
}

type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

function ProductHeader({
  brandId,
  setBrandId,
  categoryId,
  setCategoryId,
  search,
  setSearch,
}: ProductHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [brands, setBrands] = useState<
    { id: number; name: string }[]
  >([]);
 const [inputBrand ,setInputBrand]= useState<number | null >(null )
  const [inputCategory , setInputCateogry]= useState<number | null >( null)
  const [categories, setCategories] = useState<
    { id: number; name: string }[]
  >([]);

  const [date, setDate] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(inputValue);

    }, 1000);

    return () => clearTimeout(handler);
  }, [inputValue]);
  useEffect(() => {
    const load = async () => {
      const fetchedBrands = await getbrand();
      const fetchedCategories = await getCategory();

      setBrands(fetchedBrands);
      setCategories(fetchedCategories);
    };

    load();
  }, []);
const ApplyFilter = () => {
  setBrandId(inputBrand)
  setCategoryId(inputCategory)
}
  return (
    <div className="space-y-5">
      {/* TOP HEADER */}
      <div className="flex items-center justify-between">
        {/* TITLE */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Product Inventory
          </h1>

          <p className="text-muted-foreground mt-1">
            Manage your products and stocks.
          </p>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="space-y-4">
        {/* MAIN ROW */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* FILTER BUTTON */}
          <Button
            variant="outline"
            size="lg"
            onClick={() => setIsOpen((prev) => !prev)}
            className="
              h-12
              rounded-xl
              border
              px-6
              shadow-sm
              transition-all
              duration-300
              hover:scale-[1.01]
              active:scale-[0.98]
            "
          >
            <Icon
              icon={FilterAddFreeIcons}
              className="mr-2"
            />

            {isOpen ? "Hide Filters" : "Show Filters"}
          </Button>

          {/* SEARCH */}
          <InputGroup
            className="
              h-12
              flex-1
              rounded-xl
              border
              shadow-sm
              transition-all
              duration-300
              focus-within:ring-2
              focus-within:ring-primary/20
            "
          >
            <InputGroupInput
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search products..."
              className="border-0 focus-visible:ring-0"
            />

            <InputGroupAddon align="inline-end">
              <Icon
                icon={Search01FreeIcons}
                className="mr-2 text-muted-foreground"
              />
            </InputGroupAddon>
          </InputGroup>
        </div>

        {/* FILTER PANEL */}
        <div
          className={`
            overflow-hidden
            transition-all
            duration-300
            ease-in-out

            ${
              isOpen
                ? "max-h-[500px] opacity-100"
                : "max-h-0 opacity-0"
            }
          `}
        >
          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-3
              gap-4
              rounded-2xl
              border
              bg-card
              p-5
              shadow-sm
            "
          >
            {/* BRAND */}
            <div className="space-y-2">
              <p className="text-sm font-medium">
                Brand
              </p>

              <Select
                value={
                  brandId
                    ? Number(inputBrand)
                    : undefined
                }
                onValueChange={(value) =>
                    setInputBrand(Number(value))
                }
              >
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Select Brand">
                    {brands.find(
                      (b) => b.id === inputBrand
                    )?.name || "Select Brand"}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {brands.map((brand) => (
                      <SelectItem
                        key={brand.id}
                        value={String(brand.id)}
                      >
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* CATEGORY */}
            <div className="space-y-2">
              <p className="text-sm font-medium">
                Category
              </p>

              <Select
                value={
                  categoryId
                    ? Number(inputCategory)
                    : undefined
                }
                onValueChange={(value) =>
                    setInputCateogry(Number(value))
                }
              >
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Select Category">
                    {categories.find(
                      (c) => c.id === inputCategory
                    )?.name || "Select Category"}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={String(category.id)}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* DATE RANGE */}
            <div className="space-y-2">
              <p className="text-sm font-medium">
                Date Range
              </p>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="
                      h-12
                      w-full
                      justify-start
                      rounded-xl
                      font-normal
                    "
                  >
                    <Icon
                      icon={CalendarFreeIcons}
                      className="mr-2"
                    />

                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(
                            date.from,
                            "LLL dd, y"
                          )}{" "}
                          -{" "}
                          {format(
                            date.to,
                            "LLL dd, y"
                          )}
                        </>
                      ) : (
                        format(
                          date.from,
                          "LLL dd, y"
                        )
                      )
                    ) : (
                      <span>
                        Pick a date range
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  className="w-auto p-0"
                  align="start"
                >
                  <Calendar
                    mode="range"
                    selected={date}
                    onSelect={(value: any) =>
                      setDate(value)
                    }
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* ACTIONS */}
            <div className="flex items-end gap-3 xl:col-span-3">
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => {
                  setBrandId(null);
                  setCategoryId(null);
                  setInputBrand(null);
                  setInputCateogry(null);
                  setDate({
                    from: undefined,
                    to: undefined,
                  });

                  setSearch("");
                  setInputValue("");
                }}
              >
                Clear Filters
              </Button>

              <Button className="rounded-xl" onClick={() => ApplyFilter()}>
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductHeader;