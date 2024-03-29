import React, { useState, useEffect } from "react";
import { db } from "../../firebase-config";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { parseISO, differenceInMinutes } from "date-fns";
import { es } from "date-fns/locale";

const RegistroEvento = ({ tipo }) => {
  const [registros, setRegistros] = useState([]);

  const obtenerRegistros = async () => {
    const q = query(collection(db, "registros"), where("tipo", "==", tipo));
    const querySnapshot = await getDocs(q);
    const registrosFiltrados = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setRegistros(registrosFiltrados);
  };

  useEffect(() => {
    obtenerRegistros();
  }, [tipo]);

  const agregarRegistro = async () => {
    await addDoc(collection(db, "registros"), {
      tipo,
      timestamp: new Date().toISOString(),
    });
    obtenerRegistros();
  };

  const calcularFrecuencia = (dias) => {
    const ahora = new Date();
    const filtrados = registros.filter((registro) => {
      const registroFecha = parseISO(registro.timestamp);
      return differenceInMinutes(ahora, registroFecha) / (60 * 24) <= dias;
    });
    return filtrados.length / dias;
  };

  const ultimoRegistro =
    registros.length > 0 ? registros[registros.length - 1] : null;
  const ultimoTiempoTexto = ultimoRegistro
    ? `hace ${Math.floor(
        differenceInMinutes(new Date(), parseISO(ultimoRegistro.timestamp)) / 60
      )}h ${
        differenceInMinutes(new Date(), parseISO(ultimoRegistro.timestamp)) % 60
      }m`
    : "N/A";

  const getColorForTipo = (tipo) => {
    switch (tipo) {
      case "Teta":
        return "btn-success text-white fw-bold";
      case "Dormir":
        return "btn-info text-white fw-bold";
      case "Caca":
        return "btn-danger";
      case "Pis":
        return "btn-warning";
      default:
        return "btn-primary";
    }
  };

  return (
    <div className="card text-center" style={{ width: "100%" }}>
      <div
        className="card-header d-flex justify-content-between align-items-center"
        style={{ fontWeight: "bold", fontSize: "15px" }}
      >
        {tipo}
        <button
          className={`btn btn-sm ${getColorForTipo(tipo)}`}
          onClick={agregarRegistro}
        >
          Registrar
        </button>
      </div>
      <div className="card-body">
        <div className="card-text">
          <p style={{ margin: "0", padding: "0" }}>
            Última vez: <strong>{ultimoTiempoTexto}</strong>
          </p>
          <p style={{ margin: "0", padding: "0" }}>
            Frecuencia (último día):{" "}
            <strong>{calcularFrecuencia(1).toFixed(0)}</strong> veces/día
          </p>
          <p style={{ margin: "0", padding: "0" }}>
            Frecuencia (última semana):{" "}
            <strong>{calcularFrecuencia(7).toFixed(2)}</strong> veces/día
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistroEvento;
