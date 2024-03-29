import React from "react";
import RegistroEvento from "./components/RegistroEvento";
import "bootstrap/dist/css/bootstrap.min.css";

const PaginaPrincipal = () => {
  return (
    <div className="container-fluid py-0">
      <div className="d-flex flex-column align-items-center gap-2">
        <div className="w-100">
          <RegistroEvento tipo="Teta" esTemporal={true} />
        </div>
        <div className="w-100">
          <RegistroEvento tipo="Dormir" esTemporal={true} />
        </div>
        <div className="w-100">
          <RegistroEvento tipo="Caca" esTemporal={false} />
        </div>
        <div className="w-100">
          <RegistroEvento tipo="Pis" esTemporal={false} />
        </div>
      </div>
    </div>
  );
};

export default PaginaPrincipal;
