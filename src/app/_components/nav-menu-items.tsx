import type { NavLinkWithSubRoutes } from '@/@types/nav-links'

import { NavLink } from './nav-link'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './ui/navigation-menu'

export function NavMenuItems({
  navLinks,
  className,
  onClick,
}: {
  navLinks: NavLinkWithSubRoutes[]
  className?: string
  onClick?: () => void
}) {
  return (
    <NavigationMenu className={className}>
      <NavigationMenuList className='flex-wrap gap-4'>
        {navLinks.map(({ href, label, subRoutes }, i) => {
          if (subRoutes) {
            return (
              <NavigationMenuItem key={i}>
                <NavigationMenuTrigger className='text-foreground'>
                  {label}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className='flex flex-col gap-2 p-2'>
                    {subRoutes.map((subLink, j) => (
                      <li key={j}>
                        <NavLink
                          href={subLink.href}
                          label={subLink.label}
                          onClick={onClick}
                        />
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            )
          }
          return (
            <NavigationMenuItem key={i}>
              <NavLink href={href} label={label} onClick={onClick} />
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
