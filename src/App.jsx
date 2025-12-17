import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MainContextProvider from "./context/MainContextProvider";
import ProtectedRoute from "./routes/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Unauthorized from "./pages/Unauthorized";
import Trabajadores from "./pages/trabajadores/Trabajadores";
import CreateTrabajadores from "./pages/trabajadores/CreateTrabajadores";
import Pacientes from "./pages/pacientes/Pacientes";
import CrearPaciente from "./pages/pacientes/CrearPaciente";
import HistorialPaciente from "./pages/pacientes/HistorialPaciente";
import CitasPaciente from "./pages/pacientes/CitasPaciente";
import Citas from "./pages/citas/Citas";
import CrearCita from "./pages/citas/CrearCita";
import CitasSemana from "./pages/citas/CitasSemana";
import Consultas from "./pages/consultas/Consultas";
import Especialidades from "./pages/especialidades/Especialidades";
import Caja from "./pages/caja/Caja";
import MovimientoCaja from "./pages/caja/MovimientoCaja";
import Login from "./pages/Login";
import CreateEspecialidad from "./pages/especialidades/CreateEspecialidad";
import CrearConsulta from "./pages/consultas/CrearConsulta";
import Reports from "./pages/Reports";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <MainContextProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route
              path="/"
              element={
                <ProtectedRoute roles={["ADMIN", "DOCTOR", "RECEPTIONIST"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trabajador"
              element={
                <ProtectedRoute roles={["ADMIN"]}>
                  <Trabajadores />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trabajador/crear"
              element={
                <ProtectedRoute roles={["ADMIN"]}>
                  <CreateTrabajadores />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trabajador/editar"
              element={
                <ProtectedRoute roles={["ADMIN"]}>
                  <CreateTrabajadores />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pacientes"
              element={
                <ProtectedRoute roles={["ADMIN", "DOCTOR", "RECEPTIONIST"]}>
                  <Pacientes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pacientes/crear"
              element={
                <ProtectedRoute roles={["ADMIN", "DOCTOR", "RECEPTIONIST"]}>
                  <CrearPaciente />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pacientes/historial"
              element={
                <ProtectedRoute roles={["ADMIN", "DOCTOR"]}>
                  <HistorialPaciente />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pacientes/:id/historia"
              element={
                <ProtectedRoute roles={["ADMIN", "DOCTOR"]}>
                  <HistorialPaciente />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pacientes/citas"
              element={
                <ProtectedRoute roles={["ADMIN", "DOCTOR", "RECEPTIONIST"]}>
                  <CitasPaciente />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pacientes/:id/citas"
              element={
                <ProtectedRoute roles={["ADMIN", "DOCTOR", "RECEPTIONIST"]}>
                  <CitasPaciente />
                </ProtectedRoute>
              }
            />
            <Route
              path="/citas"
              element={
                <ProtectedRoute roles={["ADMIN", "DOCTOR", "RECEPTIONIST"]}>
                  <Citas />
                </ProtectedRoute>
              }
            />
            <Route
              path="/citas/crear"
              element={
                <ProtectedRoute roles={["ADMIN", "DOCTOR", "RECEPTIONIST"]}>
                  <CrearCita />
                </ProtectedRoute>
              }
            />
            <Route
              path="/citas/semana"
              element={
                <ProtectedRoute roles={["ADMIN", "DOCTOR", "RECEPTIONIST"]}>
                  <CitasSemana />
                </ProtectedRoute>
              }
            />
            <Route
              path="/consultas"
              element={
                <ProtectedRoute roles={["ADMIN", "DOCTOR"]}>
                  <Consultas />
                </ProtectedRoute>
              }
            />
            <Route
              path="/consultas/crear"
              element={
                <ProtectedRoute roles={["ADMIN", "DOCTOR"]}>
                  <CrearConsulta />
                </ProtectedRoute>
              }
            />
            <Route
              path="/especialidades"
              element={
                <ProtectedRoute roles={["ADMIN"]}>
                  <Especialidades />
                </ProtectedRoute>
              }
            />
            <Route
              path="/especialidades/crear"
              element={
                <ProtectedRoute roles={["ADMIN"]}>
                  <CreateEspecialidad />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reportes"
              element={
                <ProtectedRoute roles={["ADMIN"]}>
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/caja"
              element={
                <ProtectedRoute roles={["ADMIN", "RECEPTIONIST"]}>
                  <Caja />
                </ProtectedRoute>
              }
            />
            <Route
              path="/caja/movimiento"
              element={
                <ProtectedRoute roles={["ADMIN", "RECEPTIONIST"]}>
                  <MovimientoCaja />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </MainContextProvider>
    </QueryClientProvider>
  );
}

export default App;
