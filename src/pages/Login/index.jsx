import { useState } from "react";
import backgroundImg from "../../assets/images/background.jpg";
import doctors from "../../assets/images/doctors.svg";
import LoginForm from "../../components/FormLoginComponent";

export default function Login() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundColor: "var(--color-background)",
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full max-w-md bg-[var(--color-card)] rounded-2xl shadow-md border border-[var(--color-border)] p-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-[color:var(--color-text-primary)]">
            Bienvenido
          </h1>
          <p className="mt-2 text-sm text-[color:var(--color-text-subtle)]">
            Inicia sesión para acceder al sistema
          </p>
          <img src={doctors} alt="Doctors" className="w-30 h-30 mx-auto mb-6" />
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
