import React, { useState, useEffect } from "react";
import { formatDistanceToNow, intervalToDuration } from "date-fns";
import { es } from "date-fns/locale";

const RegistroTemporal = ({ tipo }) => {
  const [registros, setRegistros] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);

  useEffect(() => {
    // Solicita todos los registros desde el backend
    fetch(`http://192.168.1.132:3001/registros`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Respuesta de red no fue ok");
        }
        return response.json();
      })
      .then((data) => {
        // Filtra los registros por tipo después de cargarlos
        const registrosFiltrados = data.filter(
          (registro) => registro.tipo === tipo
        );
        setRegistros(registrosFiltrados);
      })
      .catch((error) => console.error("Error al cargar los registros:", error));

    if (isRunning) {
      const interval = setInterval(() => {
        setCurrentTime(Date.now());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [tipo, isRunning]);

  const toggleTimer = () => {
    if (isRunning) {
      const endTime = Date.now();
      const newRegistro = {
        tipo,
        start: startTime,
        end: endTime,
        duration: endTime - startTime,
      };

      // Envia el nuevo registro al backend
      fetch("http://192.168.1.132:3001/registros", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRegistro),
      })
        .then((response) => response.json())
        .then((registroAgregado) => {
          setRegistros([...registros, registroAgregado]);
        })
        .catch((error) => console.error("Error al agregar registro:", error));

      setCurrentTime(null);
    } else {
      setStartTime(Date.now());
      setCurrentTime(Date.now());
    }
    setIsRunning(!isRunning);
  };

  const calcularMedia = (dias) => {
    const filtrados = registros.filter((reg) => {
      const ahora = Date.now();
      return (ahora - reg.start) / (1000 * 3600 * 24) <= dias;
    });
    const total = filtrados.reduce((acc, cur) => acc + cur.duration, 0);
    return total / filtrados.length || 0;
  };

  const formatoDuracion = (ms) => {
    if (ms <= 0) return "00:00";
    const duration = intervalToDuration({ start: 0, end: ms });
    const hours = duration.hours ? `${duration.hours}:` : "";
    const minutes = `${duration.minutes ? duration.minutes : "0"}`.padStart(
      2,
      "0"
    );
    const seconds = `${duration.seconds ? duration.seconds : "0"}`.padStart(
      2,
      "0"
    );
    return `${hours}${minutes}:${seconds}`;
  };

  const tiempoTranscurrido = currentTime
    ? formatoDuracion(currentTime - startTime)
    : "00:00";

  return (
    <div className="card text-center" style={{ width: "100%" }}>
      <div
        className="card-header d-flex justify-content-between align-items-center"
        style={{ fontWeight: "bolder", fontSize: "15px" }}
      >
        <span>{tipo}</span>
        <button
          className={`btn btn-sm ${isRunning ? "btn-danger" : "btn-success"}`}
          onClick={toggleTimer}
        >
          {isRunning ? tiempoTranscurrido : `Iniciar`}
        </button>
      </div>
      <div className="card-body">
        <div className="card-text">
          <p style={{ margin: "0", padding: "0" }}>
            Última vez:{" "}
            <strong>
              {registros.length > 0
                ? formatDistanceToNow(
                    new Date(registros[registros.length - 1].start),
                    { addSuffix: true, locale: es }
                  )
                : "N/A"}
            </strong>
          </p>
          <p style={{ margin: "0", padding: "0" }}>
            Duración media:{" "}
            <strong>{formatoDuracion(calcularMedia(Infinity))}</strong>
          </p>
          <p style={{ margin: "0", padding: "0" }}>
            Duración media (último día):{" "}
            <strong>{formatoDuracion(calcularMedia(1))}</strong>
          </p>
          <p style={{ margin: "0", padding: "0" }}>
            Duración media (última semana):{" "}
            <strong>{formatoDuracion(calcularMedia(7))}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistroTemporal;
