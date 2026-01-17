import React, { useState, useEffect, useContext, useRef } from "react";
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

  // Refs para controlar qué campo está siendo editado
  const isAgeInputFocused = useRef(false);
  const isBirthDateInputFocused = useRef(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    ciNumber: "",
    birthDate: "",
    age: "",
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

  // Función para calcular edad a partir de fecha de nacimiento
  const calculateAgeFromBirthDate = (birthDate) => {
    if (!birthDate) return "";

    const today = new Date();
    const birth = new Date(birthDate);

    // Verificar que la fecha sea válida
    if (isNaN(birth.getTime())) return "";

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    // Ajustar si aún no ha pasado el cumpleaños este año
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age.toString();
  };

  // Función para calcular fecha de nacimiento a partir de edad
  const calculateBirthDateFromAge = (age) => {
    if (!age || isNaN(age) || age < 0 || age > 120) return "";

    const today = new Date();
    const birthYear = today.getFullYear() - parseInt(age, 10);

    // Crear fecha con formato YYYY-MM-DD (para input date)
    // Asumimos fecha de nacimiento como 1ro de enero del año calculado
    // Puedes cambiar esto si prefieres otra fecha por defecto
    const birthDate = `${birthYear}-01-01`;

    return birthDate;
  };

  useEffect(() => {
    if (editingPatient) {
      const birthDate = editingPatient.birthDate?.split("T")[0] || "";
      const calculatedAge = calculateAgeFromBirthDate(birthDate);

      setForm({
        firstName: editingPatient.firstName || "",
        lastName: editingPatient.lastName || "",
        ciNumber: editingPatient.ciNumber || "",
        birthDate: birthDate,
        age: calculatedAge,
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

  // Validar que la edad sea un número válido
  const validateAge = (age) => {
    if (!age) return true;
    const ageNum = parseInt(age, 10);
    return !isNaN(ageNum) && ageNum >= 0 && ageNum <= 120;
  };

  // Función para verificar si un campo específico es inválido
  const isFieldInvalid = (fieldName) => {
    if (!requiredFields.includes(fieldName)) return false;

    if (fieldName === "email" && form.email) {
      return !validateEmail(form.email);
    }

    if (fieldName === "phone" && form.phone) {
      return !validatePhone(form.phone);
    }

    if (fieldName === "age" && form.age) {
      return !validateAge(form.age);
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

    if (form.age && !validateAge(form.age)) {
      setLocalError("Edad inválida. Debe ser un número entre 0 y 120.");
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

  const handleAgeChange = (e) => {
    const { value } = e.target;

    // Limpiar el valor (solo números)
    const cleanValue = value.replace(/[^0-9]/g, "");

    // Actualizar el campo edad
    setForm((prev) => ({
      ...prev,
      age: cleanValue,
    }));

    // Si el campo edad tiene focus, calcular la fecha de nacimiento
    if (cleanValue && isAgeInputFocused.current) {
      const calculatedBirthDate = calculateBirthDateFromAge(cleanValue);
      setForm((prev) => ({
        ...prev,
        birthDate: calculatedBirthDate,
      }));
    }
  };

  const handleBirthDateChange = (e) => {
    const { value } = e.target;

    setForm((prev) => ({
      ...prev,
      birthDate: value,
    }));

    // Si el campo fecha de nacimiento tiene focus, calcular la edad
    if (value && isBirthDateInputFocused.current) {
      const calculatedAge = calculateAgeFromBirthDate(value);
      setForm((prev) => ({
        ...prev,
        age: calculatedAge,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Manejar campos especiales
    if (name === "age") {
      handleAgeChange(e);
    } else if (name === "birthDate") {
      handleBirthDateChange(e);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }

    setTouchedFields((prev) => ({ ...prev, [name]: true }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;

    // Resetear los flags de focus
    if (name === "age") {
      isAgeInputFocused.current = false;
    } else if (name === "birthDate") {
      isBirthDateInputFocused.current = false;
    }

    // Calcular automáticamente cuando se pierde el focus
    if (name === "age" && form.age && validateAge(form.age)) {
      const calculatedBirthDate = calculateBirthDateFromAge(form.age);
      setForm((prev) => ({
        ...prev,
        birthDate: calculatedBirthDate,
      }));
    } else if (name === "birthDate" && form.birthDate) {
      const calculatedAge = calculateAgeFromBirthDate(form.birthDate);
      setForm((prev) => ({
        ...prev,
        age: calculatedAge,
      }));
    }

    setTouchedFields((prev) => ({ ...prev, [name]: true }));
  };

  const handleFocus = (e) => {
    const { name } = e.target;

    // Marcar qué campo está siendo editado
    if (name === "age") {
      isAgeInputFocused.current = true;
      isBirthDateInputFocused.current = false;
    } else if (name === "birthDate") {
      isBirthDateInputFocused.current = true;
      isAgeInputFocused.current = false;
    }
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
      label: "Edad",
      name: "age",
      type: "number",
      placeholder: "Ej: 30",
      required: false,
      min: "0",
      max: "120",
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
        <p className="text-sm text-blue-600 mt-1">
          <strong>Nota:</strong> Los campos "Edad" y "Fecha de nacimiento" se
          calculan automáticamente. Al ingresar uno, el otro se actualizará.
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
                  onFocus={handleFocus}
                  placeholder={f.placeholder}
                  min={f.min}
                  max={f.max}
                  className={`input ${
                    isFieldInvalid(f.name)
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : ""
                  }`}
                />
                {isFieldInvalid(f.name) &&
                  f.name !== "email" &&
                  f.name !== "phone" &&
                  f.name !== "age" && (
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
                {isFieldInvalid(f.name) && f.name === "age" && form.age && (
                  <p className="mt-1 text-xs text-red-500">
                    Edad inválida. Debe ser un número entre 0 y 120.
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
