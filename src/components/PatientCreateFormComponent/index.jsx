import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useApiMutation from "../../hocks/useApiMutation";
import patientsAddService from "../../async/services/post/patientsAddService";
import patientsUpdateServices from "../../async/services/put/patientsUpdateServices";
import AlertMessage from "../common/AlertMessage";
import { MainContext } from "../../context/MainContext";

export default function PatientCreateForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const editingPatient = location.state?.patient || null;
  const { setPatientHistory } = useContext(MainContext);

  // Campos obligatorios según validación
  const requiredFields = ["firstName", "lastName", "ciNumber"];

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

  const [touchedFields, setTouchedFields] = useState({});
  const [showFieldErrors, setShowFieldErrors] = useState(false);
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
    if (data && data.ok) {
      const newPatientData = {
        id: editingPatient?.id,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        ciNumber: form.ciNumber.trim(),
        birthDate: form.birthDate,
        gender: form.gender,
        address: form.address.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
      };

      setPatientHistory(newPatientData);
      navigate(-1);
    }
  }, [data]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^\+?\d{7,15}$/.test(phone);

  // Función para verificar si un campo específico es inválido
  const isFieldInvalid = (fieldName) => {
    if (!requiredFields.includes(fieldName)) return false;

    if (fieldName === "email" && form.email) {
      return !validateEmail(form.email);
    }

    if (fieldName === "phone" && form.phone) {
      return !validatePhone(form.phone);
    }

    return showFieldErrors && !form[fieldName]?.trim();
  };

  const validateForm = () => {
    setShowFieldErrors(true);

    // Validar campos obligatorios
    for (let field of requiredFields) {
      if (!form[field]?.trim()) {
        setLocalError("Por favor completa todos los campos obligatorios.");
        return false;
      }
    }

    if (form.email && !validateEmail(form.email)) {
      setLocalError("Correo electrónico inválido.");
      return false;
    }

    if (form.phone && !validatePhone(form.phone)) {
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
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
  };

  // Definición de campos con información de obligatoriedad
  const fieldDefinitions = [
    {
      label: "Nombres",
      name: "firstName",
      placeholder: "Ej: Juan",
      required: true,
    },
    {
      label: "Apellidos",
      name: "lastName",
      placeholder: "Ej: López",
      required: true,
    },
    {
      label: "Número de C.I.",
      name: "ciNumber",
      placeholder: "Ej: 1234567",
      required: true,
    },
    {
      label: "Fecha de nacimiento",
      name: "birthDate",
      type: "date",
      required: false,
    },
    {
      label: "Género",
      name: "gender",
      type: "select",
      required: false,
    },
    {
      label: "Teléfono",
      name: "phone",
      placeholder: "+59170123456",
      required: false,
    },
    {
      label: "Correo electrónico",
      name: "email",
      type: "email",
      placeholder: "correo@ejemplo.com",
      required: false,
    },
    {
      label: "Dirección",
      name: "address",
      placeholder: "Ej: Calle Falsa 123",
      full: true,
      required: false,
    },
    {
      label: "Compañía de seguro",
      name: "insuranceCompany",
      placeholder: "Ej: Seguros S.A.",
      required: false,
    },
    {
      label: "Póliza",
      name: "insurancePolicy",
      placeholder: "Ej: ABC123",
      required: false,
    },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto mt-8 space-y-6 bg-[var(--color-background)] p-6 rounded-2xl shadow-sm border border-[var(--color-border)]"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)] mb-2">
          {editingPatient ? "Editar Paciente" : "Crear Nuevo Paciente"}
        </h2>
        <p className="text-sm text-gray-600">
          Los campos marcados con <span className="text-red-500">*</span> son
          obligatorios
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {fieldDefinitions.map((f, i) => (
          <div key={i} className={f.full ? "md:col-span-2" : ""}>
            <label className="block text-sm font-medium text-[color:var(--color-text-secondary)] mb-2">
              {f.label}
              {f.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {f.type === "select" ? (
              <div>
                <select
                  name={f.name}
                  value={form[f.name]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input ${
                    isFieldInvalid(f.name)
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : ""
                  }`}
                >
                  <option value="">Selecciona...</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                  <option value="O">Otro</option>
                </select>
                {isFieldInvalid(f.name) && (
                  <p className="mt-1 text-xs text-red-500">
                    Este campo es obligatorio
                  </p>
                )}
              </div>
            ) : (
              <div>
                <input
                  type={f.type || "text"}
                  name={f.name}
                  value={form[f.name]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={f.placeholder}
                  className={`input ${
                    isFieldInvalid(f.name)
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : ""
                  }`}
                />
                {isFieldInvalid(f.name) &&
                  f.name !== "email" &&
                  f.name !== "phone" && (
                    <p className="mt-1 text-xs text-red-500">
                      Este campo es obligatorio
                    </p>
                  )}
                {isFieldInvalid(f.name) && f.name === "email" && form.email && (
                  <p className="mt-1 text-xs text-red-500">
                    Formato de email inválido
                  </p>
                )}
                {isFieldInvalid(f.name) && f.name === "phone" && form.phone && (
                  <p className="mt-1 text-xs text-red-500">
                    Formato de teléfono inválido (ej: +59170123456)
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {message && (
        <AlertMessage message={message} type={type} onClose={reset} />
      )}
      {localError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-sm text-red-700">{localError}</p>
        </div>
      )}

      <div className="flex justify-end pt-4 space-x-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-6 py-3 cursor-pointer rounded-xl font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-3 cursor-pointer rounded-xl text-white font-semibold bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-primary)]/30 shadow-sm transition disabled:opacity-70 disabled:cursor-not-allowed"
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
