import React from "react";
import endovelText from "../../assets/images/endovelText.png";

const PrintablePrescription = ({
  prescriptionRef,
  prescriptions,
  patient,
  doctor,
  date,
  prescriptionNumber,
  specialty,
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return new Date().toLocaleDateString("es-ES");
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES");
  };

  const formatBirthDate = (dateString) => {
    if (!dateString) return "";

    if (dateString.includes("T") && dateString.includes("Z")) {
      const date = new Date(dateString);
      const day = date.getUTCDate().toString().padStart(2, "0");
      const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
      const year = date.getUTCFullYear();
      return `${day}/${month}/${year}`;
    }

    if (dateString.includes("/")) {
      return dateString;
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div style={{ display: "none" }}>
      <div
        ref={prescriptionRef}
        className="bg-white p-8"
        style={{
          minHeight: "210mm",
          width: "210mm",
          boxSizing: "border-box",
          fontFamily: "'Times New Roman', Times, serif",
          fontSize: "12px",
          lineHeight: "1.3",
          color: "#000",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            position: "absolute",
          }}
        >
          <div
            style={{
              position: "relative",
              marginTop: "-60px",
              marginLeft: "-20px",
            }}
          >
            <img src={endovelText} alt="endovelText" width="200px" />
          </div>
          <div style={{ textAlign: "right" }}></div>
        </div>
        <div
          style={{
            marginBottom: "20px",
            marginTop: "100px",
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              fontSize: "14px",
              marginBottom: "5px",
            }}
          >
            {doctor
              ? `${doctor.firstName} ${doctor.lastName}`
              : "Dra. Fanny Alejandra Velasco Villca"}
          </div>
          <div style={{ fontSize: "12px", marginBottom: "3px" }}>
            {specialty?.name || "Endocrinóloga"}
          </div>
          <div style={{ fontSize: "12px" }}>
            Matrícula Nac.: {doctor?.ciNumber || "155207"}
          </div>
        </div>
        <div
          style={{
            border: "1px solid #000",
            padding: "10px",
            marginBottom: "20px",
            fontSize: "11px",
          }}
        >
          <div style={{ marginBottom: "8px", fontWeight: "bold" }}>
            Paciente:{" "}
            {patient
              ? `${patient.firstName} ${patient.lastName}`
              : "Carolina Carena"}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "5px",
            }}
          >
            <div>CI: {patient?.ciNumber || "28569477"}</div>
            <div>
              Sexo:{" "}
              {patient?.gender === "M"
                ? "Masculino"
                : patient?.gender === "F"
                ? "Femenino"
                : "Femenino"}
            </div>
          </div>

          <div>
            F. Nacimiento: {formatBirthDate(patient?.birthDate) || "19/01/1981"}
          </div>
        </div>

        <div style={{ marginBottom: "10px", fontWeight: "bold" }}>Rp:</div>

        <div style={{ marginBottom: "30px", minHeight: "450px" }}>
          {prescriptions.map((prescription, index) => (
            <div key={index} style={{ marginBottom: "15px", fontSize: "11px" }}>
              {/* Nombre del medicamento y dosis */}
              <div style={{ fontWeight: "bold", marginBottom: "3px" }}>
                {prescription.medicationName} -{" "}
                {prescription.dosage || "125 mcg"} -{" "}
                {prescription.duration || "50"}
              </div>
              {/* Frecuencia */}
              <div style={{ marginBottom: "3px", marginLeft: "15px" }}>
                {prescription.frequency || "1 vez al día"}
              </div>

              {/* Observaciones */}
              {/* <div style={{ marginBottom: "5px", marginLeft: "15px" }}>
                Observaciones:{" "}
                {prescription.instructions ||
                  `Tomar ${
                    prescription.frequency || "1 comp."
                  } cada día, media hora antes del desayuno.`}
              </div> */}
            </div>
          ))}
        </div>
        <div
          style={{ textAlign: "right", marginBottom: "30px", fontSize: "11px" }}
        >
          {formatDate(date) || "18/07/2025"}
        </div>

        <div
          style={{
            borderTop: "1px solid #000",
            paddingTop: "20px",
            textAlign: "center",
          }}
        >
          <div style={{ marginTop: "30px", fontSize: "11px" }}>
            <div
              style={{
                borderBottom: "1px solid #000",
                width: "200px",
                margin: "0 auto",
                paddingBottom: "15px",
              }}
            ></div>
          </div>

          <div
            style={{ marginTop: "15px", fontSize: "10px", fontWeight: "bold" }}
          >
            {specialty?.name || "Endocrinóloga"}
          </div>
          <div style={{ fontSize: "9px", textTransform: "uppercase" }}>
            {doctor
              ? `${doctor.firstName} ${doctor.lastName}`
              : "Fanny Alejandra Velasco Villca"}
          </div>
        </div>

        <div style={{ fontSize: "10px", marginTop: "20px" }}>
          <div>Dirección: Villa Valda Nro 15</div>
          <div>E-mail: {doctor?.email || "dra.fanny.velasco@gmail.com"}</div>
          <div>Telf.: {doctor?.phone || "+591 76357230"}</div>
        </div>
      </div>
    </div>
  );
};

export default PrintablePrescription;
