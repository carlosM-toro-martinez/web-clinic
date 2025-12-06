import React, { useState, useEffect, useContext } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import loginService from "../../async/services/post/loginService";
import useApiMutation from "../../hocks/useApiMutation";
import AlertMessage from "../common/AlertMessage";
import { MainContext } from "../../context/MainContext";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const { mutate, isPending, message, type, reset, data } =
    useApiMutation(loginService);

  const { setToken, setUser, setAuth, user } = useContext(MainContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (data && data.token) {
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);
      setAuth(true);
      navigate("/");
    }
    if (user) {
      navigate("/");
    }
  }, [data]);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");

    if (!email.trim() || !password) {
      setLocalError("Por favor completa todos los campos.");
      return;
    }

    if (!validateEmail(email)) {
      setLocalError("Por favor ingresa un correo electrónico válido.");
      return;
    }

    mutate({ email, password });
  };

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-[color:var(--color-text-secondary)] mb-2"
        >
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tucorreo@ejemplo.com"
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-placeholder)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition"
        />
      </div>

      <div className="relative">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-[color:var(--color-text-secondary)] mb-2"
        >
          Contraseña
        </label>
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Tu contraseña"
          autoComplete="current-password"
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 pr-10 text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-placeholder)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition"
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-10 transform -translate-y-1/2 text-[color:var(--color-text-placeholder)] hover:text-[color:var(--color-text-secondary)] focus:outline-none"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      <div className="flex justify-end">
        <a
          href="#"
          className="text-sm font-medium text-[color:var(--color-primary)] hover:text-[color:var(--color-primary-hover)]"
        >
          ¿Olvidaste tu contraseña?
        </a>
      </div>

      {message && (
        <div className="mt-3">
          <AlertMessage message={message} type={type} onClose={reset} />
        </div>
      )}

      {localError && (
        <p className="text-sm text-red-500 text-center mt-2">{localError}</p>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="w-full cursor-pointer h-12 rounded-xl text-white font-semibold bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-primary)]/30 shadow-sm transition"
        >
          {isPending ? "Accediendo..." : "Acceder"}
        </button>
      </div>
    </form>
  );
}
