import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SpecialtyCard from "../specialties/SpecialtyCard";
import { Search, Plus, Filter } from "lucide-react";

export default function SpecialtiesComponent({
  specialties = [],
  doctors = [],
  onUpdate,
}) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredSpecialties = specialties.filter((spec) => {
    const matchesSearch =
      spec.name.toLowerCase().includes(search.toLowerCase()) ||
      spec.description.toLowerCase().includes(search.toLowerCase()) ||
      spec.code.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    switch (filter) {
      case "withFees":
        return spec.fees.length > 0;
      case "withSchedules":
        return spec.schedules.length > 0;
      case "empty":
        return spec.fees.length === 0 && spec.schedules.length === 0;
      case "all":
      default:
        return true;
    }
  });

  const stats = {
    total: specialties.length,
    withFees: specialties.filter((s) => s.fees.length > 0).length,
    withSchedules: specialties.filter((s) => s.schedules.length > 0).length,
    empty: specialties.filter(
      (s) => s.fees.length === 0 && s.schedules.length === 0
    ).length,
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar por nombre, código o descripción..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-700"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/especialidades/crear")}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Especialidad
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded-full text-sm font-medium transition ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Todas ({stats.total})
        </button>
        <button
          onClick={() => setFilter("withFees")}
          className={`px-3 py-1 rounded-full text-sm font-medium transition ${
            filter === "withFees"
              ? "bg-green-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Con Tarifas ({stats.withFees})
        </button>
        <button
          onClick={() => setFilter("withSchedules")}
          className={`px-3 py-1 rounded-full text-sm font-medium transition ${
            filter === "withSchedules"
              ? "bg-purple-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Con Horarios ({stats.withSchedules})
        </button>
        <button
          onClick={() => setFilter("empty")}
          className={`px-3 py-1 rounded-full text-sm font-medium transition ${
            filter === "empty"
              ? "bg-gray-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Sin Datos ({stats.empty})
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold">T</span>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Con Tarifas</p>
              <p className="text-2xl font-bold text-green-700">
                {stats.withFees}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold">$</span>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Con Horarios</p>
              <p className="text-2xl font-bold text-purple-700">
                {stats.withSchedules}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-bold">H</span>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completas</p>
              <p className="text-2xl font-bold text-orange-700">
                {
                  specialties.filter(
                    (s) => s.fees.length > 0 && s.schedules.length > 0
                  ).length
                }
              </p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-bold">✓</span>
            </div>
          </div>
        </div>
      </div>

      {search && (
        <div className="text-sm text-gray-600 mb-2">
          Mostrando {filteredSpecialties.length} de {specialties.length}{" "}
          especialidades
          {search && ` para "${search}"`}
        </div>
      )}

      {filteredSpecialties.length > 0 ? (
        <div className="space-y-4">
          {filteredSpecialties.map((specialty) => (
            <SpecialtyCard
              key={specialty.id}
              specialty={specialty}
              doctors={doctors}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-gray-500 text-lg mb-2">
            {search || filter !== "all"
              ? "No se encontraron especialidades"
              : "No hay especialidades registradas"}
          </h3>

          <div className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
            {search ? (
              <p>
                Intenta con otros términos de búsqueda o modifica los filtros
              </p>
            ) : filter !== "all" ? (
              <p>No hay especialidades que coincidan con este filtro</p>
            ) : (
              <p>Comienza creando tu primera especialidad médica</p>
            )}
          </div>

          <button
            onClick={() => {
              setSearch("");
              setFilter("all");
              navigate("/especialidades/crear");
            }}
            className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition mx-auto"
          >
            <Plus className="w-5 h-5 mr-2" />
            Crear Nueva Especialidad
          </button>
        </div>
      )}

      {filteredSpecialties.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div>
              Mostrando{" "}
              <span className="font-semibold">
                {filteredSpecialties.length}
              </span>{" "}
              especialidades
            </div>
            <div className="flex gap-4">
              <span className="flex items-center">
                <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded-full mr-1"></div>
                Tarifas:{" "}
                {filteredSpecialties.reduce(
                  (sum, spec) => sum + spec.fees.length,
                  0
                )}
              </span>
              <span className="flex items-center">
                <div className="w-3 h-3 bg-purple-100 border border-purple-300 rounded-full mr-1"></div>
                Horarios:{" "}
                {filteredSpecialties.reduce(
                  (sum, spec) => sum + spec.schedules.length,
                  0
                )}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
