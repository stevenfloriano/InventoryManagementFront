import { ReactNode } from "react";
import { Link } from "@heroui/react";
import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-5">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        <Link
          isExternal
          target="_blank"
          className="flex items-center gap-1 text-current"
          href="#"
          title=""
        >
          <span className="text-default-600">Desarrollado por:</span>
          <p className="text-primary">David Floriano</p>
        </Link>
      </footer>
    </div>
  );
}
