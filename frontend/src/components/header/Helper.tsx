import { Home, Image } from 'lucide-react'
import { memo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

export const navigationItems = Object.freeze([
  { path: '/', label: 'Dashboard', icon: Home },
  { path: '/gallery', label: 'Gallery', icon: Image },
])

export const NavItem = memo<{
  item: (typeof navigationItems)[number]
  isActive: boolean
}>(({ item, isActive }) => (
  <Link
    to={item.path}
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      'flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary',
      isActive
        ? 'text-primary bg-primary/10'
        : 'text-muted-foreground hover:text-foreground hover:bg-muted',
    )}
  >
    <item.icon className="h-4 w-4" aria-hidden="true" />
    <span>{item.label}</span>
  </Link>
))

export default function NavLinks() {
  const location = useLocation()

  return (
    <nav role="navigation" aria-label="Main navigation" className="hidden md:flex space-x-6">
      {navigationItems.map((item) => (
        <NavItem key={item.path} item={item} isActive={location.pathname === item.path} />
      ))}
    </nav>
  )
}
