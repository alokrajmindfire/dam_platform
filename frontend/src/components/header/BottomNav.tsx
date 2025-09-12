import { useLocation } from 'react-router-dom'
import { navigationItems, NavItem } from './Helper'

export default function BottomNav() {
  const location = useLocation()

  return (
    <nav
      role="navigation"
      aria-label="Bottom navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50"
    >
      <div className="flex justify-around items-center h-14">
        {navigationItems.map((item) => (
          <NavItem key={item.path} item={item} isActive={location.pathname === item.path} />
        ))}
      </div>
    </nav>
  )
}
