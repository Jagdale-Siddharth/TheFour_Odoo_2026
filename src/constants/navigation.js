import { LayoutDashboard, Truck, Users, Route, Wrench, Fuel, Receipt, FileBarChart, Settings } from 'lucide-react';

// Grouped nav so the sidebar reads as a structured console rather than a flat
// list — each group is a real operational phase, not decorative sectioning.
export const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Fleet Operations',
    items: [
      { to: '/vehicles', label: 'Vehicles', icon: Truck },
      { to: '/drivers', label: 'Drivers', icon: Users },
      { to: '/trips', label: 'Trips', icon: Route },
      { to: '/maintenance', label: 'Maintenance', icon: Wrench },
    ],
  },
  {
    label: 'Finance',
    items: [
      { to: '/fuel', label: 'Fuel', icon: Fuel },
      { to: '/expenses', label: 'Expenses', icon: Receipt },
      { to: '/reports', label: 'Reports', icon: FileBarChart },
    ],
  },
  {
    label: 'System',
    items: [{ to: '/settings', label: 'Settings', icon: Settings }],
  },
];

// Flat list kept for anything that just needs every route (e.g. breadcrumbs).
export const NAV_ITEMS = NAV_GROUPS.flatMap((g) => g.items);
