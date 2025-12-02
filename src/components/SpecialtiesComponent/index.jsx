import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  User,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Search,
  Plus,
} from "lucide-react";

export default function SpecialtiesComponent({ specialties = [] }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState("");

  const daysOfWeek = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  const filtered = specialties.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase())
  );

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-4">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar especialidad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-700"
          />
        </div>

        <button
          onClick={() => navigate("/especialidades/crear")}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4 mr-2" />
          Crear nueva especialidad
        </button>
      </div>

      {filtered.length > 0 ? (
        filtered.map((spec) => (
          <div
            key={spec.id}
            className="bg-white rounded-2xl shadow-md border border-gray-200 p-6"
          >
            {/* Encabezado */}
            <div
              onClick={() => toggleExpand(spec.id)}
              className="flex items-center justify-between cursor-pointer select-none"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {spec.name}
                </h2>
                <p className="text-gray-500 text-sm">{spec.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-blue-600 font-medium text-sm bg-blue-50 px-3 py-1 rounded-full">
                  Código: {spec.code}
                </span>
                {expanded === spec.id ? (
                  <ChevronUp className="text-blue-600" />
                ) : (
                  <ChevronDown className="text-gray-500" />
                )}
              </div>
            </div>

            {/* Contenido desplegable */}
            {expanded === spec.id && (
              <div className="mt-5 border-t pt-4 animate-fadeIn">
                {/* Tarifas */}
                <div className="mb-5">
                  <h3 className="flex items-center text-gray-700 font-semibold mb-2">
                    <DollarSign className="w-4 h-4 mr-2 text-blue-600" />
                    Tarifas
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {spec.fees.map((fee) => (
                      <div
                        key={fee.id}
                        className="bg-blue-50 border border-blue-100 rounded-xl p-3"
                      >
                        <p className="font-medium text-gray-800">
                          {fee.feeType === "INITIAL"
                            ? "Consulta inicial"
                            : "Control de seguimiento"}
                        </p>
                        <p className="text-blue-700 font-semibold text-lg">
                          {fee.amount} {fee.currency}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {fee.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="flex items-center text-gray-700 font-semibold mb-2">
                    <CalendarDays className="w-4 h-4 mr-2 text-blue-600" />
                    Horarios disponibles
                  </h3>

                  {spec.schedules.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-3">
                      {spec.schedules.map((sch) => (
                        <div
                          key={sch.id}
                          className="flex flex-col bg-gray-50 border border-gray-200 rounded-xl p-3"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-800">
                              {daysOfWeek[sch.dayOfWeek]}
                            </span>
                            <span className="flex items-center text-sm text-gray-600">
                              <Clock className="w-4 h-4 mr-1 text-blue-500" />
                              {sch.startTime} - {sch.endTime}
                            </span>
                          </div>
                          {sch.doctor && (
                            <div className="flex items-center text-gray-600 text-sm mt-1">
                              <User className="w-4 h-4 mr-1 text-blue-500" />
                              Dr(a). {sch.doctor.firstName}{" "}
                              {sch.doctor.lastName}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No hay horarios registrados.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 mt-6">
          No se encontraron especialidades.
        </p>
      )}
    </div>
  );
}
