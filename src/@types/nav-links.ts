export interface NavLink {
  label: string
  href: string
}

export interface NavLinkWithSubRoutes extends NavLink {
  subRoutes?: Array<NavLink>
}
