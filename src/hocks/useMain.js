import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useCallback, useRef } from "react";
import { io } from "socket.io-client";
import cashRegisterService from "../async/services/get/cashRegisterService";
import loginValidateService from "../async/services/post/loginValidateService";

function useMain() {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [cashRegister, setCashRegister] = useState(null);
  const [shouldFetchCaja, setShouldFetchCaja] = useState(false);
  const [patientHistory, setPatientHistory] = useState(null);
  const [newMessageNotification, setNewMessageNotification] = useState(null);
  const socketRef = useRef(null);

  // Función para reproducir sonido de notificación
  const playNotificationSound = useCallback(() => {
    try {
      console.log("🔊 REPRODUCIENDO sonido de notificación");
      const audioContext = new (
        window.AudioContext || window.webkitAudioContext
      )();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.5,
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);

      console.log("✅ Sonido reproducido exitosamente");
    } catch (error) {
      console.error("❌ Error al reproducir sonido:", error);
    }
  }, []);

  const {
    data: cajaResponse,
    isLoading: isLoadingCaja,
    isError: isErrorCaja,
    error: errorCaja,
    refetch: refetchCaja,
  } = useQuery({
    queryKey: ["cashRegister"],
    queryFn: cashRegisterService,
    enabled: shouldFetchCaja,
  });

  const logout = useCallback(() => {
    setUser(null);
    setAuth(false);
    setCashRegister(null);
    setShouldFetchCaja(false);
    setNewMessageNotification(null);
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }, []);

  // Función para hacer refetch de chats (la vamos a pasar al contexto)
  const triggerChatRefetch = useCallback(() => {
    console.log("Refetch de chats disparado por socket");
  }, []);

  useEffect(() => {
    const validateToken = async (storedToken) => {
      try {
        const response = await loginValidateService({ token: storedToken });

        if (response.ok && response.valid) {
          setShouldFetchCaja(true);
          return true;
        } else {
          console.warn("Token inválido o expirado:", response);
          logout();
          return false;
        }
      } catch (error) {
        console.error("Error al validar token:", error);
        logout();
        return false;
      }
    };

    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        setAuth(true);

        validateToken(storedToken);
      } catch (error) {
        console.error("Error al restaurar sesión:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, [logout]);

  useEffect(() => {
    if (cajaResponse) {
      setCashRegister(cajaResponse);
    }
  }, [cajaResponse]);

  // Socket.io connection para notificaciones de mensajes
  useEffect(() => {
    if (auth && token) {
      console.log("Iniciando conexión de socket...");

      // Desconectar socket anterior si existe
      if (socketRef.current) {
        console.log("Desconectando socket anterior");
        socketRef.current.disconnect();
      }

      socketRef.current = io("https://apiendovel.encuentrass.lat/operators", {
        auth: {
          token: token,
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      socketRef.current.on("connect", () => {
        console.log("✅ Socket CONECTADO al namespace de operadores");
        console.log("Socket ID:", socketRef.current.id);
        console.log("Token enviado:", token.substring(0, 20) + "...");

        // Intentar suscribirse/registrarse con el servidor
        socketRef.current.emit(
          "register",
          {
            token: token,
            userId: user?.id,
          },
          (response) => {
            console.log("📤 Respuesta del register:", response);
          },
        );

        // Escuchar TODOS los eventos para debugging - MÁS DETALLADO
        socketRef.current.onAny((event, ...args) => {
          console.log(`📡 *** EVENTO RECIBIDO: "${event}" *** Datos:`, args);

          // Si parece un evento de mensaje, procesar
          if (
            event.toLowerCase().includes("message") ||
            event.toLowerCase().includes("chat") ||
            event.toLowerCase().includes("whatsapp")
          ) {
            console.log(
              "🎯 Este parece ser un evento de mensaje, procesando...",
            );

            const payload = args[0];
            console.log("📦 Payload completo:", payload);
            console.log("📦 Keys del payload:", Object.keys(payload || {}));

            // Buscar el ID del paciente en diferentes propiedades posibles
            const patientId =
              payload?.patientId ||
              payload?.patient_id ||
              payload?.patientPhone ||
              payload?.patient_phone ||
              payload?.customerId ||
              payload?.customer_id ||
              payload?.senderId ||
              payload?.sender_id;

            if (patientId) {
              console.log(
                "✨ Evento de mensaje detectado para paciente:",
                patientId,
              );

              // Reproducir sonido INMEDIATAMENTE
              playNotificationSound();

              // Disparar la notificación
              console.log("🔔 ACTUALIZANDO newMessageNotification...");
              setNewMessageNotification({
                patientId: patientId,
                timestamp: new Date().getTime(),
              });

              console.log("📤 Llamando triggerChatRefetch...");
              triggerChatRefetch();
            } else {
              console.warn("⚠️ No se encontró patientId en el payload");
            }
          }
        });
      });

      socketRef.current.on("new_message", (payload) => {
        console.log("🔔 NUEVO MENSAJE RECIBIDO:", payload);

        // Marcar como notificación sin leer
        setNewMessageNotification({
          patientId: payload.patientId,
          timestamp: new Date().getTime(),
        });

        // Disparar refetch para actualizar chats
        triggerChatRefetch();
      });

      // Escuchar evento alternativo por si el nombre es diferente
      socketRef.current.on("message", (payload) => {
        console.log("📨 EVENTO 'message' RECIBIDO:", payload);
      });

      socketRef.current.on("chat_message", (payload) => {
        console.log("💬 EVENTO 'chat_message' RECIBIDO:", payload);
      });

      socketRef.current.on("whatsapp_message", (payload) => {
        console.log("📱 EVENTO 'whatsapp_message' RECIBIDO:", payload);
      });

      socketRef.current.on("disconnect", (reason) => {
        console.log("❌ Socket desconectado. Razón:", reason);
      });

      socketRef.current.on("error", (error) => {
        console.error("⚠️ Error de socket:", error);
      });

      socketRef.current.on("connect_error", (error) => {
        console.error("⚠️ Error de conexión:", error);
      });

      return () => {
        if (socketRef.current) {
          console.log("Limpiando socket...");
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }
  }, [auth, token, triggerChatRefetch, playNotificationSound]);

  const clearNewMessageNotification = useCallback((patientId) => {
    setNewMessageNotification((prev) => {
      if (prev?.patientId === patientId) {
        return null;
      }
      return prev;
    });
  }, []);

  return {
    auth,
    user,
    token,
    cashRegister,
    isLoadingCaja,
    isErrorCaja,
    errorCaja,
    patientHistory,
    setPatientHistory,
    refetchCaja,
    setToken,
    setUser,
    setAuth,
    setCashRegister,
    logout,
    newMessageNotification,
    clearNewMessageNotification,
    socket: socketRef.current,
    triggerChatRefetch,
  };
}

export default useMain;
