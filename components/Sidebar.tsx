

"use client";

import { Icon } from './Icon';
import { DashboardCircleAddIcon, LibraryFreeIcons, Package01FreeIcons, PlayCircleIcon, ProductLoadingFreeIcons, TimeScheduleFreeIcons, TypeCursorIcon } from '@hugeicons/core-free-icons';
import { usePathname, useRouter } from 'next/navigation'; 
 const sidebarItems = [   
  {
    id :1,
    item : "Dashboard",
    path : "/models",
    Icon : DashboardCircleAddIcon

  },
  {
    id :2,
    item : "Categories",
    path : "/categories",
    Icon : TypeCursorIcon
  },
  {
    id :3,
    item : "Brands",
    path : "/brands",
    Icon : TimeScheduleFreeIcons
  },
  {
    id :4,
    item : "Products",
    path : "/products",
    Icon : ProductLoadingFreeIcons
  },
  {
      id :5,
    item : "Create Product",
    path : "/products/create-product",
    Icon : Package01FreeIcons
  }
 ]
interface SidebarProps {
  visible : boolean;
}
const Sidebar = ({visible} : SidebarProps) => {
  const pathname = usePathname();
  const route = useRouter();
  return (
    <div className={`text-foreground ${visible ? "w-[300px]" : "w-20"} space-y-5 transtion-all duration-300 ease-in-out bg-card border border-border/70 rounded-2xl p-5`}>

      {/* to show title and sub title if visible */}
    {visible && (
     <div >
      <div className='text-4xl tracking-widest text-foreground'>
        CRUD
      </div>
      <div className='text-xs text-muted-foreground'>Prisma with Supabase</div>
     </div>
    )}
      {/* to show icons */}
      <div className='space-y-3'>
        {sidebarItems.map((item) => {
          const isActive = pathname === item.path;
        return (
          <div 
            onClick={() => route.push(item.path)}
          key={item.id} className={`flex cursor-pointer hover:bg-accent rounded-md p-2 transition-colors ${visible ? 'flex-row text-md item-center gap-4' : 'flex-col text-xs justify-content items-center gap-2 text-center'} ${isActive ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            <Icon icon={item.Icon} size={20} />
           <div>{item.item}</div>
          </div>
        )
}        )}
      </div>
    </div>
  );
};

export default Sidebar;