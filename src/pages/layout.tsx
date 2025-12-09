import { Footer, Header, Sidebar } from "@shared/components/layout";
import { ScrollFade } from "@shared/components/scroll-fade";
import { Outlet } from "react-router";

export const Layout = () => {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-sidebar">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <ScrollFade className="flex-1 rounded-l-3xl border border-r-0 bg-background">
            <div className="flex min-h-full p-8">
              <Outlet />
            </div>
          </ScrollFade>
          <Footer />
        </div>
      </div>
    </div>
  );
};
