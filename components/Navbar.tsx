// "use client";

// import { usePathname, useRouter } from "next/navigation";
// import {
//   BubbleChatNotificationIcon,
//   Home01Icon,
//   Menu01Icon,
//   Moon02Icon,
//   SearchVisualIcon,
//   Sun03Icon,
// } from "@hugeicons/core-free-icons";

// import { Icon } from "@/components/Icon";
// import { useTheme } from "@/lib/theme-provider";

// const navItems = [
//   { label: "Overview", href: "/" },
//   { label: "Performance", href: "/analytics" },
//   { label: "Customers", href: "/customers" },
// ];

// interface NavbarProps {
//   onMenuClick: () => void;
// }

// export function Navbar({ onMenuClick }: NavbarProps) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const { setTheme, isDark } = useTheme();

//   return (
//     <nav className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-xl">
//       <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center gap-3 px-4 sm:px-6 lg:px-8">
//         <button
//           type="button"
//           onClick={onMenuClick}
//           className="inline-flex size-10 items-center justify-center rounded-xl border border-border/70 bg-card text-foreground shadow-sm transition-colors hover:bg-accent lg:hidden"
//           aria-label="Open navigation"
//         >
//           <Icon icon={Menu01Icon} size={18} />
//         </button>

//         <button
//           type="button"
//           onClick={() => router.push("/")}
//           className="flex min-w-0 items-center gap-3 text-left"
//           aria-label="Go to home"
//         >
//           <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
//             <Icon icon={Home01Icon} size={18} className="opacity-95" />
//           </span>
//           <span className="min-w-0">
//             <span className="block truncate text-sm font-semibold tracking-tight text-foreground">
//               Pulse OS
//             </span>
//             <span className="block truncate text-xs text-muted-foreground">
//               Operations command center
//             </span>
//           </span>
//         </button>

//         <div className="hidden items-center gap-1 rounded-2xl border border-border/70 bg-card/80 p-1 shadow-sm lg:flex">
//           {navItems.map((item) => {
//             const isActive = pathname === item.href;

//             return (
//               <button
//                 key={item.href}
//                 type="button"
//                 onClick={() => router.push(item.href)}
//                 className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
//                   isActive
//                     ? "bg-accent text-foreground"
//                     : "text-muted-foreground hover:bg-accent hover:text-foreground"
//                 }`}
//               >
//                 {item.label}
//               </button>
//             );
//           })}
//         </div>

//         <div className="ml-auto flex items-center gap-2">
//           <div className="hidden min-w-[260px] items-center gap-2 rounded-2xl border border-border/70 bg-card/80 px-3 py-2 text-sm text-muted-foreground shadow-sm md:flex">
//             <Icon icon={SearchVisualIcon} size={17} className="opacity-70" />
//             <span className="truncate">Search people, orders, or inventory</span>
//             <span className="ml-auto rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
//               /
//             </span>
//           </div>

//           <button
//             type="button"
//             className="inline-flex size-10 items-center justify-center rounded-xl border border-border/70 bg-card text-foreground shadow-sm transition-colors hover:bg-accent"
//             aria-label="Notifications"
//           >
//             <Icon icon={BubbleChatNotificationIcon} size={18} />
//           </button>

//           <button
//             type="button"
//             onClick={() => setTheme(isDark ? "light" : "dark")}
//             className="inline-flex size-10 items-center justify-center rounded-xl border border-border/70 bg-card text-foreground shadow-sm transition-colors hover:bg-accent"
//             aria-label="Toggle theme"
//           >
//             <Icon icon={isDark ? Sun03Icon : Moon02Icon} size={18} />
//           </button>

//           <button
//             type="button"
//             className="hidden items-center gap-3 rounded-2xl border border-border/70 bg-card px-2 py-1.5 shadow-sm sm:flex"
//             aria-label="Profile"
//           >
//             <span className="flex size-8 items-center justify-center rounded-xl bg-[color:var(--color-chart-1)]/50 text-sm font-semibold text-foreground">
//               AJ
//             </span>
//             <span className="hidden text-left lg:block">
//               <span className="block text-sm font-medium text-foreground">
//                 Ava Johnson
//               </span>
//               <span className="block text-xs text-muted-foreground">
//                 Growth Lead
//               </span>
//             </span>
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// }
'use client';

import React from "react";
import Sidebar from "./Sidebar";
import { Menu } from "@hugeicons/core-free-icons";
import { Icon } from "./Icon";

interface NavbarProps {
visible : boolean;
setVisible : React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar = ({ visible, setVisible }: NavbarProps) => {
  return (
    <div className="text-white border-b border-neutral-700 p-5 flex justif-between">
      <div
        className="hover:bg-neutral-300/10 rounded-md h-8 w-8 flex items-center justify-center cursor-pointer"
        onClick={() => setVisible(!visible)}
      >
        <Icon icon={Menu} size={18} />
        {/* <Sidebar /> */}
      </div>
    </div>
  );
};

export default Navbar;