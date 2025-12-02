import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical } from "lucide-react";

export default function WorkersTable({ workers }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("Todos");
  const [menuOpen, setMenuOpen] = useState(null);

  const navigate = useNavigate();

  const filteredWorkers = useMemo(() => {
    return workers.filter((w) => {
      const fullName = `${w.firstName} ${w.lastName}`.toLowerCase();
      const email = w.email.toLowerCase();

      const matchesSearch =
        fullName.includes(searchTerm.toLowerCase()) ||
        email.includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === "Todos" || w.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [workers, searchTerm, roleFilter]);

  const roles = [...new Set(workers.map((w) => w.role).filter(Boolean))];

  const handleMenuToggle = (id) => {
    setMenuOpen((prev) => (prev === id ? null : id));
  };

  const handleEdit = (worker) => {
    navigate("/trabajador/editar", { state: { worker } });
  };

  return (
    <section>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-5 gap-3">
        <h3 className="text-xl font-bold text-[color:var(--color-text-primary)]">
          Lista de Trabajadores
        </h3>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Buscar por nombre o correo"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] placeholder:text-[color:var(--color-text-placeholder)] text-[color:var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition w-64"
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[color:var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
          >
            <option>Todos</option>
            {roles.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card overflow-hidden shadow-sm border border-[var(--color-border)] rounded-2xl bg-[var(--color-background)]">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[var(--color-background-secondary)]">
            <tr>
              <th className="p-4 text-sm font-semibold text-[color:var(--text-muted)]">
                Nombre
              </th>
              <th className="p-4 text-sm font-semibold text-[color:var(--text-muted)]">
                Teléfono
              </th>
              <th className="p-4 text-sm font-semibold text-[color:var(--text-muted)] text-right">
                Correo
              </th>
              <th className="p-4 text-sm font-semibold text-[color:var(--text-muted)]">
                Estado
              </th>
              <th className="p-4 text-sm font-semibold text-[color:var(--text-muted)] text-right">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredWorkers.length > 0 ? (
              filteredWorkers.map((w, i) => (
                <tr
                  key={i}
                  className="border-t border-[var(--color-border)] hover:bg-[var(--color-hover-light)] transition relative"
                >
                  <td className="p-4 text-[color:var(--color-text-primary)] font-medium">
                    {w.firstName?.toUpperCase()} {w.lastName?.toUpperCase()}
                  </td>
                  <td className="p-4 text-[color:var(--color-text-secondary)]">
                    {w.phone}
                  </td>
                  <td className="p-4 text-right text-[color:var(--color-text-secondary)]">
                    {w.email}
                  </td>
                  <td className="p-4 text-[color:var(--color-text-secondary)]">
                    <span className="px-2 py-1 text-xs rounded-full bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] font-medium uppercase">
                      {w.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>

                  <td className="p-4 text-right relative">
                    <button
                      onClick={() => handleMenuToggle(i)}
                      className="p-2 cursor-pointer rounded-full hover:bg-[var(--color-hover-light)]"
                    >
                      <MoreVertical
                        size={18}
                        className="text-[color:var(--color-text-secondary)]"
                      />
                    </button>

                    {menuOpen === i && (
                      <div className="absolute right-4 top-10 z-10 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl shadow-md w-40">
                        <button
                          onClick={() => handleEdit(w)}
                          className="block cursor-pointer w-full text-left px-4 py-2 hover:bg-[var(--color-hover-light)] text-[color:var(--color-text-primary)]"
                        >
                          Editar Trabajador
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center p-6 text-[color:var(--color-text-placeholder)]"
                >
                  No se encontraron trabajadores.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
