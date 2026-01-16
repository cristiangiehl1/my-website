import type { NavLinkWithSubRoutes } from '@/@types/nav-links'

import { NavLink } from './nav-link'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './ui/navigation-menu'

export function NavMenuItems({
  navLinks,
  className,
}: {
  navLinks: NavLinkWithSubRoutes[]
  className?: string
}) {
  return (
    <NavigationMenu className={className}>
      <NavigationMenuList className='flex-wrap'>
        {navLinks.map(({ href, label, subRoutes }, i) => {
          if (subRoutes) {
            return (
              <NavigationMenuItem key={i}>
                <NavigationMenuTrigger>{label}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className='flex flex-col gap-2 p-2'>
                    {subRoutes.map((subLink, j) => (
                      <li key={j}>
                        <NavigationMenuLink asChild>
                          <NavLink href={subLink.href} label={subLink.label} />
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            )
          }
          return (
            <NavigationMenuItem key={i}>
              <NavigationMenuLink asChild>
                <NavLink href={href} label={label} />
              </NavigationMenuLink>
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
