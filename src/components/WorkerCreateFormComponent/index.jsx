import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useApiMutation from "../../hocks/useApiMutation";
import workersAddService from "../../async/services/post/workersAddService";
import workersUpdateServices from "../../async/services/put/workersUpdateServices";
import AlertMessage from "../common/AlertMessage";

export default function WorkerCreateForm({ specialties }) {
  const location = useLocation();
  const navigate = useNavigate();
  const editingWorker = location.state?.worker || null;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [localError, setLocalError] = useState("");

  const selectedService = editingWorker
    ? workersUpdateServices
    : workersAddService;

  const { mutate, isPending, message, type, reset, data, setIdEdit } =
    useApiMutation(selectedService);

  useEffect(() => {
    if (editingWorker) {
      setForm({
        firstName: editingWorker.firstName || "",
        lastName: editingWorker.lastName || "",
        email: editingWorker.email || "",
        phone: editingWorker.phone || "",
        role: editingWorker.role || "",
        password: "",
        confirmPassword: "",
      });
      if (editingWorker.specialties) {
        const ids = editingWorker.specialties.map((s) =>
          typeof s === "string" ? s : s.id
        );
        setSelectedSpecialties(ids);
      }
    }
  }, [editingWorker]);

  useEffect(() => {
    if (data && data.ok) navigate("/trabajador");
  }, [data, navigate]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^\+?\d{7,15}$/.test(phone);

  const validateForm = () => {
    const requiredFields = ["firstName", "lastName", "email", "phone", "role"];

    for (let field of requiredFields) {
      if (!form[field]?.trim()) {
        setLocalError("Por favor completa todos los campos obligatorios.");
        return false;
      }
    }

    if (!validateEmail(form.email)) {
      setLocalError("Correo electrónico inválido.");
      return false;
    }

    if (!validatePhone(form.phone)) {
      setLocalError("Número de teléfono inválido.");
      return false;
    }

    if (form.role === "DOCTOR" && selectedSpecialties.length === 0) {
      setLocalError("Selecciona al menos una especialidad.");
      return false;
    }

    if (!editingWorker) {
      if (!form.password || form.password.length < 6) {
        setLocalError("La contraseña debe tener al menos 6 caracteres.");
        return false;
      }
      if (form.password !== form.confirmPassword) {
        setLocalError("Las contraseñas no coinciden.");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");
    if (!validateForm()) return;

    setIdEdit && setIdEdit(editingWorker?.id || null);

    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      role: form.role,
    };

    if (form.role === "DOCTOR") {
      payload.specialties = selectedSpecialties.slice(); // array of ids
    }

    if (!editingWorker) {
      payload.password = form.password;
    }

    mutate(payload);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSpecialty = (id) => {
    setSelectedSpecialties((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto mt-8 space-y-6 bg-[var(--color-surface)] p-6 rounded-2xl shadow-sm border border-[var(--color-border)]"
    >
      <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)] mb-4">
        {editingWorker ? "Editar Trabajador" : "Registrar Nuevo Trabajador"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-[color:var(--color-text-secondary)] mb-2">
            Nombres
          </label>
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="Ej: Pedro"
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[color:var(--color-text-secondary)] mb-2">
            Apellidos
          </label>
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Ej: Gonzales"
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[color:var(--color-text-secondary)] mb-2">
            Correo Electrónico
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[color:var(--color-text-secondary)] mb-2">
            Teléfono
          </label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+59170123456"
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[color:var(--color-text-secondary)] mb-2">
            Rol
          </label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="input"
          >
            <option value="">Selecciona un rol...</option>
            <option value="ADMIN">Administrador</option>
            <option value="DOCTOR">Doctor</option>
            <option value="RECEPTIONIST">Recepcionista</option>
          </select>
        </div>

        {!editingWorker && (
          <>
            <div>
              <label className="block text-sm font-medium text-[color:var(--color-text-secondary)] mb-2">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[color:var(--color-text-secondary)] mb-2">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Repite la contraseña"
                className="input"
              />
            </div>
          </>
        )}
      </div>

      {form.role === "DOCTOR" && (
        <div>
          <label className="block text-sm font-semibold text-[color:var(--color-text-primary)] mb-3">
            Especialidades
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {specialties && specialties.length > 0 ? (
              specialties.map((spec) => {
                const active = selectedSpecialties.includes(spec.id);
                return (
                  <button
                    type="button"
                    key={spec.id}
                    onClick={() => toggleSpecialty(spec.id)}
                    className={` cursor-pointer w-full text-left px-4 py-2 rounded-lg border transition flex items-center justify-between ${
                      active
                        ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm"
                        : "bg-[var(--color-surface-variant)] text-[color:var(--text-muted)] border-[var(--color-border)] hover:border-[var(--color-primary)]"
                    }`}
                  >
                    <div>
                      <div className="font-medium uppercase ">{spec.name}</div>
                      {spec.description && (
                        <div className="text-sm ">{spec.description}</div>
                      )}
                    </div>
                    <div className="ml-2">
                      {active ? (
                        <span className="text-sm font-semibold">✓</span>
                      ) : (
                        <span className="text-sm text-[color:var(--color-text-subtle)]">
                          +
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              <p className="text-sm text-[color:var(--color-text-subtle)]">
                No hay especialidades disponibles.
              </p>
            )}
          </div>
        </div>
      )}

      {message && (
        <AlertMessage message={message} type={type} onClose={reset} />
      )}

      {localError && (
        <p className="text-sm text-[var(--danger)] text-center mt-2">
          {localError}
        </p>
      )}

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 cursor-pointer py-3 rounded-xl text-white font-semibold bg-[var(--color-primary)] hover:bg-[var(--color-primary-600)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/30 shadow-sm transition"
        >
          {isPending
            ? "Guardando..."
            : editingWorker
            ? "Actualizar Trabajador"
            : "Guardar Trabajador"}
        </button>
      </div>
    </form>
  );
}
