import React, { useState, useEffect } from "react";
import Select from "react-select";
import { fGetEntregasByPeriodo } from "../../../fetch/fEntregasPeriodo";
import { fGetAllPeriodos } from "../../../fetch/fPeriodoInvestigacion";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
} from "@mui/material";

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
        setEntregas(response.data);
      });
    }
  }, [selectedPeriodo]);

  const handlePeriodoChange = (selectedOption) => {
    setSelectedPeriodo(selectedOption);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Director My Schedules
      </Typography>
      <Select
        options={periodos}
        value={selectedPeriodo}
        onChange={handlePeriodoChange}
        placeholder="Seleccione un periodo"
      />
      <div>
        <Typography variant="h5" gutterBottom>
          Entregas
        </Typography>
        {entregas.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Proyecto</TableCell>
                  <TableCell>Numero de Entrega</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Fecha de Entrega</TableCell>
                  <TableCell>Fecha de Revisión</TableCell>
                  <TableCell>Fecha de Inicio de Admisión</TableCell>
                  <TableCell>Fecha de Fin de Admisión</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {entregas.map((entrega) => (
                  <TableRow key={entrega.id}>
                    <TableCell>{entrega.ProyectoUsuario.User.name}</TableCell>
                    <TableCell>{entrega.ProyectoUsuario.Proyecto.nombre}</TableCell>
                    <TableCell>{entrega.numero_entrega}</TableCell>
                    <TableCell>{entrega.EntregaEstado.nombre}</TableCell>
                    <TableCell>{entrega.EntregaTipo.nombre}</TableCell>
                    <TableCell>{entrega.fecha_entrega
                        ? new Date(entrega.fecha_entrega).toLocaleDateString()
                        : "N/A"}</TableCell>
                    <TableCell>
                      {entrega.fecha_revision
                        ? new Date(entrega.fecha_revision).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>{new Date(entrega.admision_entrega_fecha_init).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(entrega.admision_entrega_fecha_finish).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>No hay entregas para el periodo seleccionado.</Typography>
        )}
      </div>
      <Button variant="contained" color="primary" style={{ marginTop: '20px' }}>
        Enviar Correos
      </Button>
    </div>
  );
};

export default DirectorMySchedules;