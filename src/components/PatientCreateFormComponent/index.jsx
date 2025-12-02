import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useApiMutation from "../../hocks/useApiMutation";
import patientsAddService from "../../async/services/post/patientsAddService";
import patientsUpdateServices from "../../async/services/put/patientsUpdateServices";
import AlertMessage from "../common/AlertMessage";

export default function PatientCreateForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const editingPatient = location.state?.patient || null;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    ciNumber: "",
    birthDate: "",
    gender: "",
    address: "",
    phone: "",
    email: "",
    insuranceCompany: "",
    insurancePolicy: "",
  });

  const [localError, setLocalError] = useState("");

  const selectedService = editingPatient
    ? patientsUpdateServices
    : patientsAddService;

  const { mutate, isPending, message, type, reset, data, setIdEdit } =
    useApiMutation(selectedService);

  useEffect(() => {
    if (editingPatient) {
      setForm({
        firstName: editingPatient.firstName || "",
        lastName: editingPatient.lastName || "",
        ciNumber: editingPatient.ciNumber || "",
        birthDate: editingPatient.birthDate?.split("T")[0] || "",
        gender: editingPatient.gender || "",
        address: editingPatient.address || "",
        phone: editingPatient.phone || "",
        email: editingPatient.email || "",
        insuranceCompany: editingPatient.insuranceInfo?.company || "",
        insurancePolicy: editingPatient.insuranceInfo?.policy || "",
      });
    }
  }, [editingPatient]);

  useEffect(() => {
    if (data && data.ok) navigate("/pacientes");
  }, [data]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^\+?\d{7,15}$/.test(phone);

  const validateForm = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "ciNumber",
      "birthDate",
      "gender",
      "address",
      "phone",
      "email",
    ];
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
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");

    if (!validateForm()) return;
    setIdEdit(editingPatient?.id || null);

    mutate({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      ciNumber: form.ciNumber.trim(),
      birthDate: form.birthDate,
      gender: form.gender,
      address: form.address.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      insuranceInfo: {
        company: form.insuranceCompany.trim(),
        policy: form.insurancePolicy.trim(),
      },
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto mt-8 space-y-6 bg-[var(--color-background)] p-6 rounded-2xl shadow-sm border border-[var(--color-border)]"
    >
      <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)] mb-4">
        {editingPatient ? "Editar Paciente" : "Crear Nuevo Paciente"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[
          { label: "Nombres", name: "firstName", placeholder: "Ej: Juan" },
          { label: "Apellidos", name: "lastName", placeholder: "Ej: López" },
          {
            label: "Número de C.I.",
            name: "ciNumber",
            placeholder: "Ej: 1234567",
          },
          { label: "Fecha de nacimiento", name: "birthDate", type: "date" },
          { label: "Género", name: "gender", type: "select" },
          { label: "Teléfono", name: "phone", placeholder: "+59170123456" },
          {
            label: "Correo electrónico",
            name: "email",
            type: "email",
            placeholder: "correo@ejemplo.com",
          },
          {
            label: "Dirección",
            name: "address",
            placeholder: "Ej: Calle Falsa 123",
            full: true,
          },
          {
            label: "Compañía de seguro",
            name: "insuranceCompany",
            placeholder: "Ej: Seguros S.A.",
          },
          {
            label: "Póliza",
            name: "insurancePolicy",
            placeholder: "Ej: ABC123",
          },
        ].map((f, i) => (
          <div key={i} className={f.full ? "md:col-span-2" : ""}>
            <label className="block text-sm font-medium text-[color:var(--color-text-secondary)] mb-2">
              {f.label}
            </label>

            {f.type === "select" ? (
              <select
                name={f.name}
                value={form[f.name]}
                onChange={handleChange}
                className="input"
              >
                <option value="">Selecciona...</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="O">Otro</option>
              </select>
            ) : (
              <input
                type={f.type || "text"}
                name={f.name}
                value={form[f.name]}
                onChange={handleChange}
                placeholder={f.placeholder}
                className="input"
              />
            )}
          </div>
        ))}
      </div>

      {message && (
        <AlertMessage message={message} type={type} onClose={reset} />
      )}
      {localError && (
        <p className="text-sm text-red-500 text-center mt-2">{localError}</p>
      )}

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-3 cursor-pointer rounded-xl text-white font-semibold bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-primary)]/30 shadow-sm transition"
        >
          {isPending
            ? "Guardando..."
            : editingPatient
            ? "Actualizar Paciente"
            : "Guardar Paciente"}
        </button>
      </div>
    </form>
  );
}
