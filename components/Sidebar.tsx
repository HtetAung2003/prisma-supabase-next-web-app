'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface SidebarItem {
  label: string;
  href: string;
  icon?: string;
  children?: SidebarItem[];
}

const defaultItems: SidebarItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: '📊',
  },
  {
    label: 'Products',
    href: '/products',
    icon: '📦',
    children: [
      { label: 'All Products', href: '/products' },
      { label: 'Categories', href: '/products/categories' },
      { label: 'Inventory', href: '/products/inventory' },
    ],
  },
  {
    label: 'Orders',
    href: '/orders',
    icon: '🛒',
    children: [
      { label: 'All Orders', href: '/orders' },
      { label: 'Pending', href: '/orders/pending' },
      { label: 'Completed', href: '/orders/completed' },
    ],
  },
  {
    label: 'Customers',
    href: '/customers',
    icon: '👥',
  },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: '📈',
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: '⚙️',
  },
];

interface SidebarProps {
  items?: SidebarItem[];
}

export function Sidebar({ items = defaultItems }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [currentPath, setCurrentPath] = useState('/');

  const toggleExpanded = (label: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(label)) {
      newExpanded.delete(label);
    } else {
      newExpanded.add(label);
    }
    setExpandedItems(newExpanded);
  };

  const SidebarItemComponent = ({ item, depth = 0 }: { item: SidebarItem; depth?: number }) => {
    const isExpanded = expandedItems.has(item.label);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.label}>
        <div className="flex items-center">
          {hasChildren ? (
            <button
              onClick={() => toggleExpanded(item.label)}
              className={`flex items-center w-full gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isOpen ? '' : 'justify-center'
              } text-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`}
            >
              {item.icon && <span className="flex-shrink-0 text-base">{item.icon}</span>}
              {isOpen && (
                <>
                  <span className="flex-1">{item.label}</span>
                  <svg
                    className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </>
              )}
            </button>
          ) : (
            <Link
              href={item.href}
              className={`flex items-center w-full gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isOpen ? '' : 'justify-center'
              } text-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`}
            >
              {item.icon && <span className="flex-shrink-0 text-base">{item.icon}</span>}
              {isOpen && <span>{item.label}</span>}
            </Link>
          )}
        </div>

        {/* Submenu */}
        {hasChildren && isExpanded && isOpen && (
          <div className="pl-4 space-y-1">
            {item.children!.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                className="block px-3 py-2 rounded-md text-sm text-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              >
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className={`border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="flex h-full flex-col">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b border-sidebar-border px-4 py-4">
          {isOpen && <h2 className="text-lg font-bold text-sidebar-primary">Menu</h2>}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center rounded-md p-2 text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg
              className={`h-5 w-5 transition-transform ${!isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
          {items.map((item) => (
            <SidebarItemComponent key={item.label} item={item} />
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-sidebar-border px-3 py-4">
          <button
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors text-sidebar-foreground hover:bg-sidebar-accent ${
              isOpen ? '' : 'justify-center'
            }`}
          >
            <span className="flex-shrink-0 text-base">👤</span>
            {isOpen && <span className="text-sm">Profile</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
