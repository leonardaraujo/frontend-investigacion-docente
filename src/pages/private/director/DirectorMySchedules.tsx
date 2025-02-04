import React, { useState, useEffect } from "react";
import Select from "react-select";
import { fGetEntregasByPeriodo } from "../../../fetch/fEntregasPeriodo";
import { fGetAllPeriodos } from "../../../fetch/fPeriodoInvestigacion";

const DirectorMySchedules = () => {
  const [periodos, setPeriodos] = useState([]);
  const [selectedPeriodo, setSelectedPeriodo] = useState(null);
  const [entregas, setEntregas] = useState([]);

  useEffect(() => {
    // Fetch all periodos
    fGetAllPeriodos().then((response) => {
      const transformedPeriodos = response.data.map((periodo) => ({
        value: periodo.id,
        label: periodo.nombre,
      }));
      setPeriodos(transformedPeriodos);
    });
  }, []);

  useEffect(() => {
    if (selectedPeriodo) {
      // Fetch entregas by selected periodo
      fGetEntregasByPeriodo(selectedPeriodo.value).then((response) => {
        console.log(response);
        setEntregas(response.data);
      });
    }
  }, [selectedPeriodo]);

  const handlePeriodoChange = (selectedOption) => {
    setSelectedPeriodo(selectedOption);
  };

  return (
    <div>
      <h1>Director My Schedules</h1>
      <Select
        options={periodos}
        value={selectedPeriodo}
        onChange={handlePeriodoChange}
        placeholder="Seleccione un periodo"
      />
      <div>
        <h2>Entregas</h2>
        {entregas.length > 0 ? (
          <ul>
            {entregas.map((entrega) => (
              <li key={entrega.id}>
                <p>Entrega ID: {entrega.id}</p>
                <p>Numero de Entrega: {entrega.numero_entrega}</p>
                <p>Estado: {entrega.EntregaEstado.nombre}</p>
                <p>Tipo: {entrega.EntregaTipo.nombre}</p>
                <p>
                  Fecha de Entrega:{" "}
                  {new Date(entrega.fecha_entrega).toLocaleDateString()}
                </p>
                <p>
                  Fecha de Revisión:{" "}
                  {entrega.fecha_revision
                    ? new Date(entrega.fecha_revision).toLocaleDateString()
                    : "N/A"}
                </p>
                {entrega.ProyectoUsuario && (
                  <div>
                    <p>Usuario: {entrega.ProyectoUsuario.User.name}</p>
                    <p>Proyecto: {entrega.ProyectoUsuario.Proyecto.nombre}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay entregas para el periodo seleccionado.</p>
        )}
      </div>
    </div>
  );
};

export default DirectorMySchedules;
