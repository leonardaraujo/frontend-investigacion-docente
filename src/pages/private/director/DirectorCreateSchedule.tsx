import { useEffect, useState } from "react";
import dayjs from "dayjs";
import Select from "react-select";
import {
  ContainerTableCreateSchedule,
  CreateScheduleDisplay,
  LayoutCreateSchedule,
} from "../../../components/style/create-schedule/LayoutCreateSchedule.style";
import {
  CreateScheduleTable,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from "../../../components/style/create-schedule/TableCreateSchedule.style";
import { Tittle } from "../../../components/style/Text";
import PopUpDatesAndProgress from "../../../components/PopUpDatesAndProgress";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import PopUpDirectorAddUser from "../../../components/PopUpDirectorAddUser";
import { Button } from "@mui/material";
import { fCreateSchedule } from "../../../fetch/fSchedules";
import { fGetInvestigators } from "../../../fetch/fUser";
import { fgetLineasInvestigacion } from "../../../fetch/fLineasInvestigacion";
import { fGetLastInvestigacionPeriodo } from "../../../fetch/fPeriodoInvestigacion";
import DeleteIcon from "@mui/icons-material/Delete";
const DirectorCreateSchedule = () => {
  const [isAddingUsers, setIsAddingUsers] = useState(false);
  const [scheduleCart, setScheduleCart] = useState([]);
  const [isSettingDatesProgress, setIsSettingDatesProgress] = useState(false);
  const [actualDataAvance, setActualDataAvance] = useState({});
  const [LastPeriod, setLastPeriod] = useState(0);
  const [investigators, setInvestigators] = useState([]);
  console.log("investigators", investigators);
  const [lineasInvestigacion, setLineasInvestigacion] = useState([]);
  const today = dayjs();
  useEffect(() => {
    fGetLastInvestigacionPeriodo().then((response) => {
      setLastPeriod((state) => response.data.id + 1);
    });
    fGetInvestigators().then((response) => {
      setInvestigators((state) => response.data);
    });
    fgetLineasInvestigacion().then((response) => {
      const transformedData = response.data.map((investigacion) => ({
        value: investigacion.id,
        label: investigacion.nombre,
      }));
      setLineasInvestigacion((state) => transformedData);
    });
  }, []);
  const handleOpen = (data) => {
    setActualDataAvance(data);
    setIsSettingDatesProgress(true);
  };

  const updateAvance = (id, newAvance) => {
    setScheduleCart((prevCart) =>
      prevCart.map((item) =>
        item.id_user === id
          ? {
              ...item,
              avances: {
                cantAvances: newAvance.avances.cantAvances,
                avancesData: newAvance.avances.avancesData.map((avance) => ({
                  ...avance,
                  fechaInit: dayjs(avance.fechaInit).format("YYYY-MM-DD"),
                  fechaFinish: dayjs(avance.fechaFinish).format("YYYY-MM-DD"),
                })),
              },
            }
          : item
      )
    );
  };

  const updateLineaInvestigacion = (id, newLinea) => {
    setScheduleCart((prevCart) =>
      prevCart.map((item) =>
        item.id_user === id
          ? {
              ...item,
              linea_id: newLinea,
            }
          : item
      )
    );
  };

  const updateFechaInicio = (id, newFechaInicio) => {
    setScheduleCart((prevCart) =>
      prevCart.map((item) =>
        item.id_user === id
          ? {
              ...item,
              fechaInicio: newFechaInicio
                ? newFechaInicio.format("YYYY-MM-DD")
                : null,
              avances: { avancesData: [], cantAvances: 0 },
            }
          : item
      )
    );
  };

  const updateFechaEntrega = (id, newFechaEntrega) => {
    setScheduleCart((prevCart) =>
      prevCart.map((item) =>
        item.id_user === id
          ? {
              ...item,
              fechaEntrega: newFechaEntrega
                ? newFechaEntrega.format("YYYY-MM-DD")
                : null,
              avances: { avancesData: [], cantAvances: 0 },
            }
          : item
      )
    );
  };
  const handleDeleteUser = (id) => {
    setScheduleCart((prevCart) =>
      prevCart.filter((item) => item.id_user !== id)
    );
  };
  const handleSaveAvances = (newAvances) => {
    updateAvance(newAvances.id_user, newAvances);
  };
  const handleAddUsers = (selectedUsers) => {
    const newUsers = selectedUsers
      .map((user) => {
        const foundUser = investigators.find((u) => u?.id === user.value);
        if (!foundUser) {
          console.error(`User with id ${user.value} not found`);
          return null;
        }
        const alreadyExists = scheduleCart.some(
          (existingUser) => existingUser.id === user.value
        );
        if (alreadyExists) {
          console.error(`User with id ${user.value} already added`);
          return null;
        }
        return {
          id_user: user.value,
          name:
            foundUser.name +
            " " +
            foundUser.name_paterno +
            " " +
            foundUser.name_materno,
          linea_id: "",
          avances: {
            cantAvances: 0,
            avancesData: [],
          },
          fechaInicio: null,
          fechaEntrega: null,
        };
      })
      .filter((user) => user !== null);

    if (newUsers.length > 0) {
      setScheduleCart((prevCart) => [...prevCart, ...newUsers]);
    }
  };
  const handleCreateSchedule = async () => {
    try {
      const response = await fCreateSchedule(scheduleCart);
      console.log("Schedule created successfully:", response);
      setScheduleCart([]); // Clear the schedule cart
      fGetLastInvestigacionPeriodo().then((response) => {
        setLastPeriod((state) => response.data.id + 1); // Update the investigation period
      });
    } catch (error) {
      console.error("Error creating schedule:", error);
    }
  };
  console.log(scheduleCart);
  return (
    <LayoutCreateSchedule>
      <Tittle>Creacion de cronograma</Tittle>
      <CreateScheduleDisplay>
        <p>
          Usted esta creando el cronograma para el period de investigación
          <input disabled={true} value={LastPeriod} />
        </p>
        <button onClick={() => setIsAddingUsers(true)}>Agregar usuario</button>
        <ContainerTableCreateSchedule>
          <CreateScheduleTable>
            <TableHead>
              <TableRow>
                <TableHeader width="50px">Codigo Docente</TableHeader>
                <TableHeader width="100px">Nombre Docente</TableHeader>
                <TableHeader width="260px">Linea de Investigación</TableHeader>
                <TableHeader width="270px">Avances y Fechas</TableHeader>
                <TableHeader width="150px">Fecha Inicio</TableHeader>
                <TableHeader width="150px">Fecha Entrega Final</TableHeader>
                <TableHeader width="50px">Eliminar</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {scheduleCart.map((schedule) => (
                <TableRow key={schedule.id_user}>
                  <TableCell>{schedule.id_user}</TableCell>
                  <TableCell>{schedule.name}</TableCell>
                  <TableCell>
                    <Select
                      options={lineasInvestigacion}
                      value={lineasInvestigacion.find(
                        (option) => option.value === schedule.linea
                      )}
                      onChange={(selectedOption) =>
                        updateLineaInvestigacion(
                          schedule.id_user,
                          selectedOption.value
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {schedule.avances.cantAvances > 0 ? (
                      schedule.avances.avancesData.map((avance) => (
                        <div key={avance.index}>
                          <p>Avance n: {avance.index}</p>
                          <p>Fecha de inicio: {avance.fechaInit}</p>
                          <p>Fecha de entrega: {avance.fechaFinish}</p>
                        </div>
                      ))
                    ) : (
                      <p>No hay avances</p>
                    )}
                    <button
                      onClick={() => handleOpen(schedule)}
                      disabled={!schedule.fechaInicio || !schedule.fechaEntrega}
                    >
                      Editar
                    </button>
                  </TableCell>
                  <TableCell>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Fecha Inicio"
                        value={
                          schedule.fechaInicio
                            ? dayjs(schedule.fechaInicio)
                            : null
                        }
                        onChange={(newValue) =>
                          updateFechaInicio(schedule.id_user, newValue)
                        }
                        renderInput={(params) => <TextField {...params} />}
                        minDate={today}
                      />
                    </LocalizationProvider>
                  </TableCell>
                  <TableCell>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Fecha Entrega"
                        value={
                          schedule.fechaEntrega
                            ? dayjs(schedule.fechaEntrega)
                            : null
                        }
                        onChange={(newValue) =>
                          updateFechaEntrega(schedule.id_user, newValue)
                        }
                        renderInput={(params) => <TextField {...params} />}
                        minDate={today}
                      />
                    </LocalizationProvider>
                  </TableCell>
                  <TableCell>
                    <DeleteIcon
                      onClick={() => handleDeleteUser(schedule.id_user)}
                      style={{ cursor: "pointer" }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </CreateScheduleTable>
        </ContainerTableCreateSchedule>
        {isSettingDatesProgress && (
          <PopUpDatesAndProgress
            closePop={setIsSettingDatesProgress}
            dataAvance={actualDataAvance}
            dataChanger={(newAvance) =>
              updateAvance(actualDataAvance.id_user, newAvance)
            }
            fechaInicioPadre={dayjs(actualDataAvance.fechaInicio)}
            fechaLimitePadre={dayjs(actualDataAvance.fechaEntrega)}
            onSave={handleSaveAvances}
          />
        )}
        <Button onClick={handleCreateSchedule}>Crear cronograma</Button>
      </CreateScheduleDisplay>
      <PopUpDirectorAddUser
        open={isAddingUsers}
        onClose={() => setIsAddingUsers(false)}
        onAddUsers={handleAddUsers}
        users={investigators}
        existingUsers={scheduleCart}
      />
    </LayoutCreateSchedule>
  );
};

export default DirectorCreateSchedule;
