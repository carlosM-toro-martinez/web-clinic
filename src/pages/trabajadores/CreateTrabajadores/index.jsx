import React from "react";
import LayoutComponent from "../../../components/LayoutComponent";
import BackArrow from "../../../components/common/BackArrow";
import WorkerCreateForm from "../../../components/WorkerCreateFormComponent";
import specialtiesService from "../../../async/services/get/specialtiesService";
import { useQuery } from "@tanstack/react-query";

function CreateTrabajadores() {
  const {
    data: specialtiesResponse,
    isLoading: isLoadingSpecialties,
    isError: isErrorSpecialties,
    error: errorSpecialties,
  } = useQuery({
    queryKey: ["specialties"],
    queryFn: specialtiesService,
  });

  return (
    <LayoutComponent>
      <BackArrow />
      {!isLoadingSpecialties && !isErrorSpecialties && (
        <WorkerCreateForm specialties={specialtiesResponse?.data} />
      )}
    </LayoutComponent>
  );
}

export default CreateTrabajadores;
