import SidebarLayoutComponent from "../SidebarLayoutComponent";
import HeaderComponent from "../HeaderComponent";

function LayoutComponent({ children }) {
  return (
    <div className="flex h-screen bg-[var(--color-background)]">
      <SidebarLayoutComponent />

      <div className="flex flex-col flex-1 overflow-hidden">
        <HeaderComponent />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

export default LayoutComponent;
