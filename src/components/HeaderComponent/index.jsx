import { useContext, useState, useRef, useEffect } from "react";
import { MainContext } from "../../context/MainContext";
import { ChevronDown, LogOut, User, Settings, Bell } from "lucide-react";
import endovel from "../../assets/images/endovel.png";

function HeaderComponent() {
  const { user } = useContext(MainContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getUserInitials = () => {
    if (!user) return "U";
    return `${user.firstName?.charAt(0) || ""}${
      user.lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  const formatRole = (role) => {
    const roleMap = {
      ADMIN: "Administrador",
      DOCTOR: "Médico",
      RECEPTIONIST: "Recepcionista",
      PATIENT: "Paciente",
    };
    return roleMap[role] || role;
  };

  const handleLogout = () => {
    console.log("Cerrando sesión...");
    setIsDropdownOpen(false);
  };

  return (
    <header className="h-21 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center justify-between px-6 shadow-sm sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <img src={endovel} alt="endovel" width="60px" />

        <div>
          <h1 className="font-bold text-[var(--color-text-primary)] text-lg">
            Endovel
          </h1>
          <p className="text-xs text-[var(--text-muted)] hidden sm:block">
            Sistema Médico Integral
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* <button className="relative p-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-variant)] hover:text-[var(--color-primary)] transition-all duration-200 group">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--color-error)] rounded-full border-2 border-[var(--color-surface)]"></span>
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
            Notificaciones
          </div>
        </button> */}

        <div className="h-6 w-px bg-[var(--color-border)] hidden sm:block"></div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`
              flex items-center gap-3
              p-2 rounded-xl
              transition-all duration-200
              hover:bg-[var(--color-surface-variant)]
              ${isDropdownOpen ? "bg-[var(--color-surface-variant)]" : ""}
            `}
          >
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-[var(--color-text-primary)] leading-tight">
                  {user ? `${user.firstName} ${user.lastName}` : "Usuario"}
                </p>
                <p className="text-xs text-[var(--text-muted)] leading-tight">
                  {user ? formatRole(user.role) : "Rol no disponible"}
                </p>
              </div>

              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary)] to-[#0f95d7] rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-semibold text-sm">
                    {getUserInitials()}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[var(--color-success)] rounded-full border-2 border-[var(--color-surface)] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              </div>
            </div>

            <ChevronDown
              size={16}
              className={`text-[var(--color-text-secondary)] transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 border-b border-[var(--color-border)]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-primary)] to-[#0f95d7] rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-semibold text-base">
                      {getUserInitials()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[var(--color-text-primary)] text-sm truncate">
                      {user ? `${user.firstName} ${user.lastName}` : "Usuario"}
                    </p>
                    <p className="text-[var(--text-muted)] text-xs truncate">
                      {user?.email || "Email no disponible"}
                    </p>
                    <div className="mt-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[var(--color-accent-blue-light)] text-[var(--color-primary)]">
                        {user ? formatRole(user.role) : "Rol no disponible"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="py-2">
                {/* <button
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex cursor-pointer items-center gap-3 w-full px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-variant)] hover:text-[var(--color-primary)] transition-colors duration-150"
                >
                  <User size={18} />
                  <span>Mi perfil</span>
                </button> */}

                {/* <button
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-variant)] hover:text-[var(--color-primary)] transition-colors duration-150"
                >
                  <Settings size={18} />
                  <span>Configuración</span>
                </button> */}
              </div>

              {/* <div className="border-t border-[var(--color-border)] my-2"></div>

              <button
                onClick={handleLogout}
                className="flex cursor-pointer items-center gap-3 w-full px-4 py-2 text-sm text-[var(--color-error)] hover:bg-[var(--color-accent-red-light)] transition-colors duration-150"
              >
                <LogOut size={18} />
                <span>Cerrar sesión</span>
              </button> */}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default HeaderComponent;
