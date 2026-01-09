import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  ClipboardList,
  BriefcaseMedical,
  FileText,
  UserCog,
  Activity,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import logo from "../../assets/images/Logo.png";
import { useLogout } from "../../hocks/useLogout";

const menuItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Trabajadores", path: "/trabajador", icon: UserCog },
  { label: "Pacientes", path: "/pacientes", icon: Users },
  { label: "Citas", path: "/citas", icon: CalendarDays },
  { label: "Consultas", path: "/consultas", icon: ClipboardList },
  { label: "Caja", path: "/caja", icon: BriefcaseMedical },
  { label: "Especialidades", path: "/especialidades", icon: FileText },
  { label: "Reportes", path: "/reportes", icon: Activity },
];

function SidebarLayoutComponent() {
  const { logout } = useLogout();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[var(--color-surface)] border-b border-[var(--color-border)] z-50 flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="font-semibold text-[var(--color-text-primary)]">
            MediClinic
          </span>
        </div>

        <button
          onClick={toggleMobileSidebar}
          className="p-2 rounded-lg cursor-pointer border border-[var(--color-border)] hover:bg-[var(--color-surface-variant)] transition-colors text-[var(--color-text-secondary)]"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:relative
          top-0 left-0
          h-screen
          bg-[var(--color-surface)]
          border-r border-[var(--color-border)]
          shadow-lg
          transition-all duration-300 ease-in-out
          z-50
          flex flex-col
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${collapsed ? "w-20" : "w-64"}
        `}
      >
        <div
          className={`flex ${
            collapsed ? "justify-center px-2" : "justify-between px-6"
          } py-5 border-b border-[var(--color-border)]`}
        >
          {!collapsed && (
            <div className="flex items-center gap-2">
              <h1 class="text-1xl md:text-2xl font-extrabold tracking-tight">
                <span class="text-[var(--color-text-primary)]">Nova</span>
                <span
                  class="ml-1
           text-[var(--color-primary)]"
                >
                  Med
                </span>
              </h1>

              {/* <img src={logo} alt="logo" className="mt-0.5" width="150px" /> */}
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className={`
              cursor-pointer
              hidden md:flex
              items-center justify-center
              w-8 h-8
              rounded-lg
              border border-[var(--color-border)]
              bg-[var(--color-surface)]
              hover:bg-[var(--color-surface-variant)]
              hover:border-[var(--color-primary)]
              text-[var(--color-text-secondary)]
              transition-all duration-200
              shadow-sm
              ${collapsed ? "mx-auto" : ""}
            `}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {menuItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `
                  group
                  flex items-center
                  rounded-xl
                  px-3 py-3
                  text-sm font-medium
                  transition-all duration-200
                  hover:shadow-md
                  border border-transparent
                  ${
                    isActive
                      ? "bg-[var(--color-accent-blue-light)] text-[var(--color-primary)] border-[var(--color-primary)] shadow-sm"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-variant)] hover:border-[var(--color-border)]"
                  }
                  ${collapsed ? "justify-center" : ""}
                `
              }
            >
              <div className="relative">
                <Icon
                  size={20}
                  className={`
                    transition-transform duration-200
                    ${collapsed ? "" : "group-hover:scale-110"}
                  `}
                />
                {!collapsed && (
                  <div
                    className={`
                    absolute -top-1 -right-1 w-2 h-2 rounded-full
                    transition-all duration-200
                    ${
                      location.pathname === path
                        ? "bg-[var(--color-primary)] scale-100"
                        : "bg-transparent scale-0"
                    }
                  `}
                  />
                )}
              </div>

              {!collapsed && (
                <span className="ml-3 transition-all duration-200 font-medium">
                  {label}
                </span>
              )}

              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-[var(--color-text-primary)] text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                  {label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        <div
          className={`
          border-t border-[var(--color-border)]
          ${collapsed ? "px-2" : "px-4"}
          py-4
        `}
        >
          <button
            className={`
              cursor-pointer
              group
              flex items-center
              w-full
              rounded-xl
              px-3 py-3
              text-sm font-medium
              text-[var(--color-text-secondary)]
              hover:text-[var(--color-error)]
              hover:bg-[var(--color-accent-red-light)]
              hover:border-[var(--color-error)]
              border border-transparent
              transition-all duration-200
              ${collapsed ? "justify-center" : ""}
            `}
            onClick={logout}
          >
            <LogOut
              size={20}
              className={`
                transition-transform duration-200
                ${collapsed ? "" : "group-hover:scale-110"}
              `}
            />

            {!collapsed && (
              <span className="ml-3 transition-all duration-200 font-medium">
                Cerrar sesión
              </span>
            )}
            {collapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-[var(--color-text-primary)] text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                Cerrar sesión
              </div>
            )}
          </button>
        </div>
      </aside>
      <div className="md:hidden h-16" />
    </>
  );
}

export default SidebarLayoutComponent;
