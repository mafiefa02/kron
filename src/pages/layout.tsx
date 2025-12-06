import { Footer, Header, Sidebar } from "@shared/components/layout";
import { Outlet } from "react-router";

export const Layout = () => {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto overscroll-contain rounded-l-3xl border border-r-0 bg-accent/35 p-8">
            <Outlet />
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};
