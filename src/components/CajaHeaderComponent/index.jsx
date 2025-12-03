import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useApiMutation from "../../hocks/useApiMutation";
import cashCloseService from "../../async/services/post/cashCloseService";

export default function CajaHeaderComponent({
  cashRegisterId,
  actualAmount,
  refetch,
  setCashRegister,
}) {
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { mutate, isPending, message, type, reset } = useApiMutation(
    cashCloseService,
    {
      onSuccess: (data) => {
        setCashRegister(null);
        refetch();
        setShowConfirmModal(false);
        reset();
      },
    }
  );

  const handleGoMovement = () => {
    navigate("/caja/movimiento", { state: { cashRegisterId } });
  };

  const handleCloseCash = () => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const payload = {
      closingAmount: actualAmount.toString(),
      countedAmount: actualAmount.toString(),
      notes: `Cierre de caja - ${formattedDate}`,
      cashRegisterId: cashRegisterId,
    };

    mutate(payload);
  };

  const handleCloseModal = () => {
    setShowConfirmModal(false);
    reset();
  };

  useEffect(() => {
    if (!showConfirmModal) {
      reset();
    }
  }, [showConfirmModal, reset]);

  const formatCurrency = (amount) => {
    return parseFloat(amount).toLocaleString("es-BO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">
            Gestión de Caja
          </h2>
          <p className="text-[var(--text-muted)] mt-1">
            Administra los movimientos y cierre de caja
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleGoMovement}
            className="px-6 cursor-pointer py-3 bg-white border border-[var(--color-primary)] text-[var(--color-primary)] rounded-xl font-semibold hover:bg-[var(--color-primary)] hover:text-white transition-all duration-200 flex items-center gap-2 shadow-sm"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Nuevo Movimiento
          </button>

          <button
            onClick={() => setShowConfirmModal(true)}
            className="px-6 cursor-pointer py-3 bg-[var(--color-primary)] text-white rounded-xl font-semibold hover:bg-[var(--color-primary-hover)] transition-all duration-200 flex items-center gap-2 shadow-md"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Cerrar Caja
          </button>
        </div>
      </header>

      {showConfirmModal && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-9000 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-[var(--color-border)]">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
                  Confirmar Cierre de Caja
                </h3>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="cursor-pointer text-[var(--text-muted)] hover:text-[var(--color-text-primary)]"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {message && (
              <div
                className={`mx-6 mt-4 p-3 rounded-lg ${
                  type === "success"
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-red-100 text-red-800 border border-red-200"
                }`}
              >
                {message}
              </div>
            )}

            <div className="p-6 space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-blue-600 font-medium">
                      Monto en Caja
                    </div>
                    <div className="text-2xl font-bold text-blue-800">
                      {formatCurrency(actualAmount)} BOB
                    </div>
                  </div>
                  <div className="text-3xl">💰</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="py-3">
                  <div className="text-sm text-[var(--color-text-secondary)] mb-1">
                    Notas:
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm">
                    Cierre de caja - {getCurrentDateTime()}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-3">
                  <div className="text-yellow-600">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-yellow-800">
                      ¿Estás seguro de cerrar la caja?
                    </div>
                    <div className="text-sm text-yellow-600 mt-1">
                      Esta acción no se puede deshacer
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-[var(--color-border)] flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={isPending}
                className="flex-1 cursor-pointer px-4 py-3 bg-[var(--color-border)] text-[var(--color-text-primary)] rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleCloseCash}
                disabled={isPending}
                className="flex-1 cursor-pointer px-4 py-3 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Cerrando...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Sí, Cerrar Caja
                  </>
                )}
              </button>
            </div>
            {isPending && (
              <div className="px-6 pb-6">
                <div className="text-xs text-[var(--text-muted)]">
                  <div className="font-medium mb-1">
                    Payload que se enviará:
                  </div>
                  <div className="p-2 bg-gray-50 rounded text-xs font-mono">
                    {JSON.stringify(
                      {
                        closingAmount: actualAmount.toString(),
                        countedAmount: actualAmount.toString(),
                        notes: `Cierre de caja - ${getCurrentDateTime()}`,
                        cashRegisterId: cashRegisterId,
                      },
                      null,
                      2
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
