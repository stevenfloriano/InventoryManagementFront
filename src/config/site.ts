export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Inventory Management",
  description: "Sistema de gestión de inventario y ventas.",
  navItems: [
    {
      label: "Inicio",
      href: "/home",
    },
    {
      label: "Productos",
      href: "/products",
    },
    {
      label: "Clientes",
      href: "/customers",
    },
    {
      label: "Ventas",
      href: "/sales",
    },
    {
      label: "Reportes",
      href: "/reports",
    },
    {
      label: "Usuarios",
      href: "/users",
    },
    {
      label: "Salir",
      href: "/",
    },
  ],
  links: {
    github: "https://github.com/frontio-ai/heroui",
    docs: "https://heroui.com",
  },
};
