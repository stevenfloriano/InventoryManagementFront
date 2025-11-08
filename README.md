# Inventory Management App

Aplicación web para la **gestión de inventarios**, desarrollada con **React + TypeScript + HeroUI + TailwindCSS + Vite**.  
Permite administrar productos, clientes, ventas, compras y reportes de forma moderna, rápida y escalable.

---

## Tecnologías principales

| Tecnología | Descripción |
|-------------|--------------|
| [React](https://react.dev/) | Librería para construir interfaces de usuario. |
| [TypeScript](https://www.typescriptlang.org/) | Tipado estático para JavaScript, mejora la mantenibilidad del código. |
| [Vite](https://vitejs.dev/) | Bundler rápido y eficiente para desarrollo moderno. |
| [HeroUI](https://heroui.dev/) | Librería de componentes UI moderna y accesible. |
| [TailwindCSS](https://tailwindcss.com/) | Framework CSS para diseño responsivo basado en utilidades. |

---

## Requisitos previos

Antes de iniciar, asegúrate de tener instalado:

- **Node.js 18+**
- **npm** o **yarn**

---

## Instalación y configuración

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/stevenfloriano/InventoryManagementFront.git
   cd InventoryManagementFront
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar TailwindCSS y HeroUI:**

   Si no existen, asegúrate de tener estos archivos:

   **`tailwind.config.cjs`**
   ```js
   /** @type {import('tailwindcss').Config} */
   module.exports = {
     content: [
       "./index.html",
       "./src/**/*.{js,ts,jsx,tsx}",
       "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
     ],
     theme: { extend: {} },
     plugins: [require("@heroui/theme")],
   };
   ```

   **`postcss.config.cjs`**
   ```js
   module.exports = {
     plugins: {
       "@tailwindcss/postcss": {},
       autoprefixer: {},
     },
   };
   ```

   **`src/index.css`**
   ```css
   @import "@heroui/theme";

   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

4. **Ejecutar el proyecto:**
   ```bash
   npm run dev
   ```

   Luego abre en el navegador 👉 [http://localhost:5173](http://localhost:5173)

---

## 🧱 Estructura del proyecto

```
src/
│
├── assets/               # Imágenes, íconos y recursos estáticos
├── components/           # Componentes reutilizables (botones, inputs, etc.)
├── layouts/              # Layouts generales (Dashboard, Login, etc.)
├── pages/                # Páginas principales
├── types/                # Definiciones de tipos TypeScript
├── App.tsx               # Componente principal
└── main.tsx              # Punto de entrada
```

---

## Scripts disponibles

| Comando | Descripción |
|----------|-------------|
| `npm run dev` | Ejecuta el servidor de desarrollo |
| `npm run build` | Genera una versión optimizada para producción |
| `npm run preview` | Sirve la app compilada para pruebas |
| `npm run lint` | Revisa errores de código con ESLint |

---

## Ejemplo básico de componente

```tsx
import { Button, Card } from "@heroui/react";

export default function Example() {
  return (
    <Card className="p-6 max-w-sm mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Welcome to Inventory</h2>
      <Button color="primary">Add Product</Button>
    </Card>
  );
}
```

---

## Mejores prácticas

- Usa **TypeScript** para tipar todas las props y datos.
- Implementa **React Query** o **Axios** para manejar datos del backend.
- Mantén la UI coherente utilizando los componentes de **HeroUI**.
- Usa variables de entorno (`.env`) para separar configuración sensible.

---

## Próximas mejoras

- 📊 Dashboard de estadísticas  
- 🧾 Módulo de reportes (por terminar)
- 🏷️ Gestión de categorías y proveedores  

---

## Autor

Desarrollado por **David Floriano**.  
Proyecto orientado a la modernización de soluciones ERP de escritorio hacia plataformas web escalables.

---

## Licencia

Puedes usarlo, modificarlo y distribuirlo libremente, mencionando la fuente original.

---
