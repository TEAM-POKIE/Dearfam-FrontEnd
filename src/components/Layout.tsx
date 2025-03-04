import { Outlet } from "react-router-dom";
import { Navigation } from "./Navigation";

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-7 text-gray-1 dark:bg-gray-2 dark:text-gray-6">
      <Navigation />

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-bg-1 py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-3">
          <p>© 2024 DearFam - PVVM 패턴 예제</p>
        </div>
      </footer>
    </div>
  );
}
