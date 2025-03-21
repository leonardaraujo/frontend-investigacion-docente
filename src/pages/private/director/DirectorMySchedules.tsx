import React,{ useState, useEffect } from "react";
import Select from "react-select";
import EmailIcon from "@mui/icons-material/Email";
import { fGetEntregasByPeriodo } from "../../../fetch/fEntregasPeriodo";
import {
	fGetAllPeriodos,
	fGetAllPeriodosDirector,
} from "../../../fetch/fPeriodoInvestigacion";
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
import { DELIVERY_TYPES } from "../../../constants/data/VariablesDelivery";
import { fSendEmailSchedule } from "../../../fetch/fSendEmailSchedule";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast, Toaster } from "react-hot-toast";
import { Title } from "../../../components/style/general/Text.styles";
import {
	DirectoMySchedulesLayout,
	DirectorMySchedulesTableLayout,
	DirectorMySchedulesTextSelectLayout,
} from "../../../components/style/director/Director.styles";
import SyncLoader from "react-spinners/SyncLoader";
import { PRINCIPAL_COLOR_CONF } from "../../../conf/COLORS.conf";
const DirectorMySchedules = () => {
	const [periodos, setPeriodos] = useState([]);
	const [selectedPeriodo, setSelectedPeriodo] = useState(null);
	const [entregas, setEntregas] = useState([]);
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		// Fetch all periodos
		fGetAllPeriodosDirector().then((response) => {
			const transformedPeriodos = response.data.map((periodo) => ({
				value: periodo.id,
				label: `Periodo ${periodo.period_number}`,
			}));
			setPeriodos(transformedPeriodos);
		});
	}, []);

	useEffect(() => {
		if (selectedPeriodo) {
			setLoading(true);
			// Fetch entregas by selected periodo
			fGetEntregasByPeriodo(selectedPeriodo.value)
				.then((response) => {
					console.log(response.data);
					const transformedEntregas = transformEntregas(response.data);
					setEntregas(transformedEntregas);
					console.log(transformedEntregas);
					setLoading(false);
				})
				.catch((err) => {
					setLoading(false);
				});
		}
	}, [selectedPeriodo]);

	const handlePeriodoChange = (selectedOption) => {
		setSelectedPeriodo(selectedOption);
	};

	const transformEntregas = (entregas) => {
		return entregas.map((proyecto) => ({
			proyecto: proyecto.name,
			start_date: proyecto.start_date,
			finish_date: proyecto.finish_date,
			user_research_projects: proyecto.user_research_projects.map(
				(userProject) => ({
					usuario: userProject.user_id,
					entregas: userProject.project_deliveries
						.map((entrega) => ({
							id: entrega.id,
							numero_entrega: entrega.delivery_number,
							estado: entrega.delivery_status_id,
							tipo: entrega.delivery_type_id,
							fecha_entrega: entrega.finish_date,
							fecha_revision: entrega.review_id ? entrega.review_id : "N/A",
							fecha_inicio_admision: entrega.start_date,
							fecha_fin_admision: entrega.finish_date,
						}))
						.sort((a, b) => a.numero_entrega - b.numero_entrega),
				}),
			),
		}));
	};

	const getDeliveryType = (id) => {
		const deliveryType = DELIVERY_TYPES.find((type) => type.id === id);
		return deliveryType ? deliveryType.tipo : "Desconocido";
	};

	const handleSendEmails = () => {
		confirmAlert({
			title: "Confirmar envío",
			message: "¿Está seguro de que desea enviar los correos?",
			buttons: [
				{
					label: "Sí",
					onClick: () => {
						fSendEmailSchedule(selectedPeriodo.value)
							.then(() => {
								toast.success("Correos enviados exitosamente");
							})
							.catch((error) => {
								toast.error("Error al enviar correos");
								console.error("Error al enviar correos:", error);
							});
					},
				},
				{
					label: "No",
					onClick: () => {
						toast("Envío de correos cancelado");
					},
				},
			],
		});
	};

	return (
		<DirectoMySchedulesLayout>
			<Toaster />
			<Title>Mis cronogramas</Title>
			<DirectorMySchedulesTextSelectLayout>
				<p>Seleccionar periodo de investigacion activa</p>
				<Select
					isSearchable={false}
					options={periodos}
					value={selectedPeriodo}
					onChange={handlePeriodoChange}
					placeholder="Seleccione un periodo"
				/>
			</DirectorMySchedulesTextSelectLayout>

			<DirectorMySchedulesTableLayout>
				{selectedPeriodo ? (
					loading ? (
						<SyncLoader color={PRINCIPAL_COLOR_CONF} />
					) : entregas.length > 0 ? (
						<>
							<Typography variant="h5" gutterBottom>
								Cronograma para el periodo {selectedPeriodo.value}
							</Typography>

							<TableContainer component={Paper}>
								<Table>
									<TableHead sx={{ backgroundColor: PRINCIPAL_COLOR_CONF }}>
										<TableRow>
											<TableCell sx={{ color: "white" }}>Proyecto</TableCell>
											<TableCell sx={{ color: "white" }}>Usuario</TableCell>
											<TableCell sx={{ color: "white" }}>
												Tipo de entrega
											</TableCell>
											<TableCell sx={{ color: "white" }}>
												Fecha de inicio
											</TableCell>
											<TableCell sx={{ color: "white" }}>Fecha final</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{entregas.map((proyecto) => (
											<React.Fragment key={proyecto.proyecto}>
												<TableRow sx={{ backgroundColor: "#EBEBEB" }}>
													<TableCell colSpan={3} style={{ fontWeight: "bold" }}>
														{proyecto.proyecto}
													</TableCell>
													<TableCell style={{ fontWeight: "bold" }}>
														{new Date(proyecto.start_date).toLocaleDateString()}
													</TableCell>
													<TableCell style={{ fontWeight: "bold" }}>
														{new Date(
															proyecto.finish_date,
														).toLocaleDateString()}
													</TableCell>
												</TableRow>
												{proyecto.user_research_projects.map((userProject) =>
													userProject.entregas.map((entrega) => (
														<TableRow key={entrega.id}>
															<TableCell></TableCell>
															<TableCell>ID:{userProject.usuario}</TableCell>
															<TableCell>
																{getDeliveryType(entrega.tipo)}{" "}
																{entrega.tipo !== 2 && entrega.numero_entrega}
															</TableCell>
															<TableCell>
																{new Date(
																	entrega.fecha_inicio_admision,
																).toLocaleDateString()}
															</TableCell>
															<TableCell>
																{new Date(
																	entrega.fecha_fin_admision,
																).toLocaleDateString()}
															</TableCell>
														</TableRow>
													)),
												)}
											</React.Fragment>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						</>
					) : (
						<Typography sx={{ fontStyle: "italic", color: "text.secondary" }}>
							No hay entregas para el periodo seleccionado.
						</Typography>
					)
				) : (
					<Typography sx={{ fontStyle: "italic", color: "text.secondary" }}>
						Seleccione un periodo para mostrar las entregas.
					</Typography>
				)}
			</DirectorMySchedulesTableLayout>
			<Button
				startIcon={<EmailIcon />}
				onClick={handleSendEmails}
				variant="contained"
				color="primary"
				style={{ marginTop: "20px" }}
				disabled={entregas.length === 0}
			>
				Enviar correos a los investigadores
			</Button>
		</DirectoMySchedulesLayout>
	);
};

export default DirectorMySchedules;
