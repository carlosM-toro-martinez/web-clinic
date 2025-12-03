import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical } from "lucide-react";
import toTitleCase from "../../utils/toTitleCase";

export default function PatientsTable({ patients }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("Todos");
  const [insuranceFilter, setInsuranceFilter] = useState("Todos");
  const [menuOpen, setMenuOpen] = useState(null);

  const navigate = useNavigate();

  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const fullName = `${p.firstName} ${p.lastName}`?.toLowerCase();
      const ci = p.ciNumber?.toLowerCase();
      const matchesSearch =
        fullName.includes(searchTerm?.toLowerCase()) ||
        ci.includes(searchTerm?.toLowerCase());

      const matchesGender =
        genderFilter === "Todos" || p.gender === genderFilter;

      const matchesInsurance =
        insuranceFilter === "Todos" ||
        p.insuranceInfo?.company === insuranceFilter;

      return matchesSearch && matchesGender && matchesInsurance;
    });
  }, [patients, searchTerm, genderFilter, insuranceFilter]);

  const insuranceCompanies = [
    ...new Set(patients.map((p) => p.insuranceInfo?.company).filter(Boolean)),
  ];

  const handleMenuToggle = (id) => {
    setMenuOpen((prev) => (prev === id ? null : id));
  };

  const handleEdit = (patient) => {
    navigate("/pacientes/crear", { state: { patient } });
  };

  const handleHistory = (patient) => {
    navigate(`/pacientes/${patient.id}/historia`);
  };

  const handleAppointments = (patient) => {
    navigate(`/pacientes/${patient.id}/citas`);
  };

  return (
    <section>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-5 gap-3">
        <h3 className="text-xl font-bold text-[color:var(--color-text-primary)]">
          Lista de Pacientes
        </h3>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o CI"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] placeholder:text-[color:var(--color-text-placeholder)] text-[color:var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition w-64"
          />

          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[color:var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
          >
            <option>Todos</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>

          <select
            value={insuranceFilter}
            onChange={(e) => setInsuranceFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[color:var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
          >
            <option>Todos</option>
            {insuranceCompanies.map((company) => (
              <option key={company}>{company}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card overflow-hidden shadow-sm border border-[var(--color-border)] rounded-2xl bg-[var(--color-background)]">
        <table className="w-full mb-20 text-left border-collapse">
          <thead className="bg-[var(--color-background-secondary)]">
            <tr>
              <th className="p-4 text-sm font-semibold text-[color:var(--text-muted)]">
                Nombre
              </th>
              <th className="p-4 text-sm font-semibold text-[color:var(--text-muted)]">
                CI
              </th>
              <th className="p-4 text-sm font-semibold text-[color:var(--text-muted)]">
                Fecha Nac.
              </th>
              <th className="p-4 text-sm font-semibold text-[color:var(--text-muted)]">
                Género
              </th>
              <th className="p-4 text-sm font-semibold text-[color:var(--text-muted)]">
                Teléfono
              </th>
              <th className="p-4 text-sm font-semibold text-[color:var(--text-muted)] text-right">
                Correo
              </th>
              <th className="p-4 text-sm font-semibold text-[color:var(--text-muted)] text-right">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredPatients.length > 0 ? (
              filteredPatients?.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-[var(--color-border)] hover:bg-[var(--color-hover-light)] transition relative"
                >
                  <td className="p-4 text-[color:var(--color-text-primary)] font-medium">
                    {toTitleCase(p?.firstName ? p?.firstName : "")}{" "}
                    {toTitleCase(p.lastName ? p.lastName : "")}
                  </td>
                  <td className="p-4 text-[color:var(--color-text-secondary)]">
                    {p.ciNumber}
                  </td>
                  <td className="p-4 text-[color:var(--color-text-secondary)]">
                    {new Date(p.birthDate).toLocaleDateString("es-BO")}
                  </td>
                  <td className="p-4">
                    {p.gender === "M" ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 font-medium">
                        Masculino
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-full bg-pink-100 text-pink-700 font-medium">
                        Femenino
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-[color:var(--color-text-secondary)]">
                    {p.phone}
                  </td>
                  <td className="p-4 text-right text-[color:var(--color-text-secondary)]">
                    {p.email}
                  </td>

                  <td className="p-4 text-right relative">
                    <button
                      onClick={() => handleMenuToggle(p.id)}
                      className="p-2 rounded-full hover:bg-[var(--color-hover-light)]"
                    >
                      <MoreVertical
                        size={18}
                        className="text-[color:var(--color-text-secondary)] cursor-pointer"
                      />
                    </button>

                    {menuOpen === p.id && (
                      <div className="absolute z-[9999] right-4 top-10 z-10 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl shadow-md w-40">
                        <button
                          onClick={() => handleEdit(p)}
                          className="block cursor-pointer w-full text-left px-4 py-2 hover:bg-[var(--color-hover-light)] text-[color:var(--color-text-primary)]"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleHistory(p)}
                          className="block cursor-pointer w-full text-left px-4 py-2 hover:bg-[var(--color-hover-light)] text-[color:var(--color-text-primary)]"
                        >
                          Historia Clínica
                        </button>
                        <button
                          onClick={() => handleAppointments(p)}
                          className="block cursor-pointer w-full text-left px-4 py-2 hover:bg-[var(--color-hover-light)] text-[color:var(--color-text-primary)]"
                        >
                          Citas
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center p-6 text-[color:var(--color-text-placeholder)]"
                >
                  No se encontraron pacientes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
