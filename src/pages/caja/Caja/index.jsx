import React, { useState } from "react";
import LayoutComponent from "../../../components/LayoutComponent";
import CajaHeaderComponent from "../../../components/CajaHeaderComponent";
import CajaResumenComponent from "../../../components/CajaResumenComponent";
import CajaMovimientosComponent from "../../../components/CajaMovimientosComponent";
import { useQuery, useMutation } from "@tanstack/react-query";
import cashRegisterService from "../../../async/services/get/cashRegisterService";
import createCashRegisterService from "../../../async/services/post/createCashRegisterService";
import BackArrow from "../../../components/common/BackArrow";
import { Plus } from "lucide-react";
import AperturaCajaModal from "../../../components/AperturaCajaModal.jsx";
import useApiMutation from "../../../hocks/useApiMutation.js";

function Caja() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["cashRegister"],
    queryFn: cashRegisterService,
  });

  const { mutate, isPending, message, type, reset } = useApiMutation(
    createCashRegisterService
  );

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitApertura = (payload) => {
    mutate(payload);
  };

  if (isLoading) {
    return (
      <LayoutComponent>
        <div className="flex justify-center items-center h-64 text-[var(--color-text-secondary)]">
          Cargando Caja...
        </div>
      </LayoutComponent>
    );
  }

  if (isError) {
    return (
      <LayoutComponent>
        <div className="min-h-screen flex font-sans bg-[var(--color-background)] text-[var(--text-primary)]">
          <main className="flex-1 p-8">
            <div className="flex flex-col items-center justify-center h-96">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold mb-2">
                  No hay caja abierta
                </h2>
                <p className="text-[var(--text-secondary)]">
                  Debes abrir una caja para comenzar a operar
                </p>
              </div>
              <button
                className="btn-primary cursor-pointer flex items-center gap-2"
                onClick={handleOpenModal}
              >
                <Plus size={18} /> Abrir Caja
              </button>
            </div>
          </main>
        </div>

        <AperturaCajaModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmitApertura}
          refetch={refetch}
        />
      </LayoutComponent>
    );
  }

  const lastCashRegister = response?.data || [];

  return (
    <LayoutComponent>
      <div className="min-h-screen flex font-sans bg-[var(--color-background)] text-[var(--text-primary)]">
        <main className="flex-1 p-8">
          <CajaHeaderComponent
            cashRegisterId={lastCashRegister.id}
            lastCashRegister={lastCashRegister}
            actualAmount={lastCashRegister?.actualAmount}
            refetch={refetch}
          />
          <CajaResumenComponent lastCash={lastCashRegister} />
          <CajaMovimientosComponent movements={lastCashRegister?.movements} />
        </main>
      </div>
    </LayoutComponent>
  );
}

export default Caja;
