import React from "react";
import LayoutComponent from "../../../components/LayoutComponent";
import PatientCreateForm from "../../../components/PatientCreateFormComponent";
import BackArrow from "../../../components/common/BackArrow";

function CrearPaciente() {
  return (
    <LayoutComponent>
      <BackArrow />
      <PatientCreateForm />
    </LayoutComponent>
  );
}

export default CrearPaciente;
