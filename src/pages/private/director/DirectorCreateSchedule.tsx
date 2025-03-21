import { useEffect, useState } from "react";
import dayjs from "dayjs";
import Select from "react-select";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import EditNoteIcon from "@mui/icons-material/EditNote";
import {
	ContainerTableCreateSchedule,
	CreateScheduleDisplay,
	CreateScheduleStyledInput,
	CreateScheduleTitleSelectButtonLayout,
	DirectorCreateScheduleTitleInputLayout,
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
import {
	Button,
	Card,
	CardContent,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Typography,
} from "@mui/material";
import { fCreateSchedule } from "../../../fetch/fSchedules";
import DeleteIcon from "@mui/icons-material/Delete";
import {
	fetchInitialData,
	updateAvance,
	updateLineaInvestigacion,
	updateFechaInicio,
	updateFechaEntrega,
	handleAddUsers,
} from "../../../utils/scheduleUtils";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast, Toaster } from "react-hot-toast";

import { isScheduleCartValid } from "../../../utils/scheduleUtils";
import { Title } from "../../../components/style/general/Text.styles";
// Define the types
interface Avance {
	index: number;
	fechaInit: string;
	fechaFinish: string;
}

interface Schedule {
	id_user: number;
	name: string;
	linea_id: number;
	avances: Avance[];
	fechaInicio: string;
	fechaEntrega: string;
}

const DirectorCreateSchedule = () => {
	const [isAddingUsers, setIsAddingUsers] = useState(false);
	const [scheduleCart, setScheduleCart] = useState<Schedule[]>([]);
	const [isSettingDatesProgress, setIsSettingDatesProgress] = useState(false);
	const [actualDataAvance, setActualDataAvance] = useState({});
	const [LastPeriod, setLastPeriod] = useState(0);
	const [investigators, setInvestigators] = useState([]);
	const [lineasInvestigacion, setLineasInvestigacion] = useState([]);
	const today = dayjs();
	const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
	const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
	const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
	useEffect(() => {
		fetchInitialData(setLastPeriod, setInvestigators, setLineasInvestigacion);
	}, []);

	const handleOpen = (data) => {
		setActualDataAvance(data);
		setIsSettingDatesProgress(true);
	};

	const handleSaveAvances = (newAvances) => {
		setScheduleCart((prevCart) =>
			updateAvance(prevCart, newAvances.id_user, newAvances),
		);
	};

	const handleCreateSchedule = async () => {
		try {
			const response = await fCreateSchedule(scheduleCart);
			console.log("Schedule created successfully:", response);
			setScheduleCart([]); // Clear the schedule cart
			fetchInitialData(setLastPeriod, setInvestigators, setLineasInvestigacion); // Update the investigation period
			toast.success("Cronograma creado exitosamente");
		} catch (error) {
			console.error("Error creating schedule:", error);
			toast.error("Error al crear el cronograma");
		}
		setOpenConfirmDialog(false);
	};
	const handleConfirmCreateSchedule = () => {
		setOpenConfirmDialog(true);
	};

	const handleCloseConfirmDialog = () => {
		setOpenConfirmDialog(false);
	};

	const handleDeleteUser = () => {
		if (selectedUserId !== null) {
			setScheduleCart((prevCart) =>
				prevCart.filter((item) => item.id_user !== selectedUserId),
			);
			setSelectedUserId(null);
			setOpenDeleteConfirmDialog(false);
		}
	};

	const handleOpenDeleteConfirmDialog = (userId: number) => {
		setSelectedUserId(userId);
		setOpenDeleteConfirmDialog(true);
	};

	const handleCloseDeleteConfirmDialog = () => {
		setSelectedUserId(null);
		setOpenDeleteConfirmDialog(false);
	};
	return (
		<LayoutCreateSchedule>
			<Title>Creacion de cronograma</Title>
			<CreateScheduleTitleSelectButtonLayout>
				<DirectorCreateScheduleTitleInputLayout>
					<p>
						Usted esta creando el cronograma para el periodo de investigación
					</p>
					<CreateScheduleStyledInput disabled={true} value={LastPeriod} />
				</DirectorCreateScheduleTitleInputLayout>
				<Button
					sx={{ width: 250, height: 35 }}
					component="label"
					variant="contained"
					startIcon={<PersonAddAltIcon />}
					onClick={() => setIsAddingUsers(true)}
				>
					Agregar investigador
				</Button>
			</CreateScheduleTitleSelectButtonLayout>

			<ContainerTableCreateSchedule>
				<CreateScheduleTable>
					<TableHead>
						<TableRow>
							<TableHeader width="5%">Codigo Docente</TableHeader>
							<TableHeader width="100px">Nombre Docente</TableHeader>
							<TableHeader width="260px">Linea de Investigación</TableHeader>
							<TableHeader width="270px">Avances y Fechas</TableHeader>
							<TableHeader width="150px">Fecha inicio</TableHeader>
							<TableHeader width="150px">Fecha entrega Final</TableHeader>
							<TableHeader width="5%">Eliminar</TableHeader>
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
											(option) => option.value === schedule.linea_id,
										)}
										onChange={(selectedOption) =>
											setScheduleCart((prevCart) =>
												updateLineaInvestigacion(
													prevCart,
													schedule.id_user,
													selectedOption.value,
												),
											)
										}
									/>
								</TableCell>
								<TableCell>
									{schedule.avances?.length > 0 ? (
										<>
											{schedule.avances.map((avance) => (
												<Card key={avance.index} sx={{ marginBottom: "10px" }}>
													<CardContent>
														<Typography variant="subtitle1">
															Avance {avance.index}
														</Typography>
														<Typography variant="body2">
															Fecha inicial de subida: {avance.fechaInit}
														</Typography>
														<Typography variant="body2">
															Fecha final de entrega: {avance.fechaFinish}
														</Typography>
													</CardContent>
												</Card>
											))}
											<Card sx={{ marginBottom: "10px" }}>
												<CardContent>
													<Typography variant="subtitle1">
														Entrega Final
													</Typography>
													<Typography variant="body2">
														Fecha inicial de subida:{" "}
														{dayjs(schedule.fechaEntrega)
															.subtract(1, "day")
															.format("YYYY-MM-DD")}
													</Typography>
													<Typography variant="body2">
														Fecha final de entrega: {schedule.fechaEntrega}
													</Typography>
												</CardContent>
											</Card>
										</>
									) : (
										<Typography variant="body2">No hay avances</Typography>
									)}
									<Button
										sx={{ width: 180, height: 35 }}
										component="label"
										color="secondary"
										variant="contained"
										startIcon={<EditNoteIcon />}
										onClick={() => handleOpen(schedule)}
										disabled={!schedule.fechaInicio || !schedule.fechaEntrega}
									>
										Editar avances
									</Button>
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
												setScheduleCart((prevCart) =>
													updateFechaInicio(
														prevCart,
														schedule.id_user,
														newValue,
													),
												)
											}
											slotProps={{ textField: { fullWidth: true } }}
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
												setScheduleCart((prevCart) =>
													updateFechaEntrega(
														prevCart,
														schedule.id_user,
														newValue,
													),
												)
											}
											slotProps={{ textField: { fullWidth: true } }}
											minDate={
												schedule.fechaInicio
													? dayjs(schedule.fechaInicio)
													: today
											}
											disabled={!schedule.fechaInicio}
										/>
									</LocalizationProvider>
								</TableCell>
								<TableCell>
									<DeleteIcon
										onClick={() =>
											handleOpenDeleteConfirmDialog(schedule.id_user)
										}
										style={{ cursor: "pointer" }}
									/>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</CreateScheduleTable>
			</ContainerTableCreateSchedule>
			<Button
				variant="contained"
				color="success"
				sx={{ width: 400, height: 50 }}
				onClick={handleConfirmCreateSchedule}
				disabled={!isScheduleCartValid(scheduleCart)}
			>
				Crear cronograma
			</Button>
			<Dialog
				open={openConfirmDialog}
				onClose={handleCloseConfirmDialog}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">
					{"Confirmar creación de cronograma"}
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						¿Está seguro de que desea crear el cronograma? Esta acción no se
						puede deshacer.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseConfirmDialog} color="primary">
						Cancelar
					</Button>
					<Button onClick={handleCreateSchedule} color="primary" autoFocus>
						Confirmar
					</Button>
				</DialogActions>
			</Dialog>
			<Dialog
				open={openDeleteConfirmDialog}
				onClose={handleCloseDeleteConfirmDialog}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">
					{"Confirmar eliminación"}
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						¿Está seguro de que desea eliminar este investigador del cronograma?
						Esta acción no se puede deshacer.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDeleteConfirmDialog} color="primary">
						Cancelar
					</Button>
					<Button onClick={handleDeleteUser} color="primary" autoFocus>
						Confirmar
					</Button>
				</DialogActions>
			</Dialog>
			{isSettingDatesProgress && (
				<PopUpDatesAndProgress
					closePop={setIsSettingDatesProgress}
					dataAvance={actualDataAvance}
					dataChanger={(newAvance) => handleSaveAvances(newAvance)}
					fechaInicioPadre={dayjs(actualDataAvance.fechaInicio)}
					fechaLimitePadre={dayjs(actualDataAvance.fechaEntrega)}
					onSave={handleSaveAvances}
				/>
			)}

			<PopUpDirectorAddUser
				open={isAddingUsers}
				onClose={() => setIsAddingUsers(false)}
				onAddUsers={(selectedUsers) =>
					setScheduleCart((prevCart) =>
						handleAddUsers(selectedUsers, investigators, prevCart),
					)
				}
				users={investigators}
				existingUsers={scheduleCart}
			/>
			<Toaster />
		</LayoutCreateSchedule>
	);
};

export default DirectorCreateSchedule;
