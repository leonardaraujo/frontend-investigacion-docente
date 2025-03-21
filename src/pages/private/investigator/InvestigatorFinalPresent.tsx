import React, { useState, useEffect } from "react";
import Select from "react-select";
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
	Box,
	Alert,
} from "@mui/material";
import { Title } from "../../../components/style/general/Text.styles";
import DownloadIcon from "@mui/icons-material/Download";
import {
	REVIEW_STATUS,
	OBSERVATION_STATUS,
} from "../../../constants/data/VariableStatus";
import {
	fGetFinalesByPeriodoAndUser,
	fGetFullEntregasByPeriodoAndUser,
} from "../../../fetch/fEntregasPeriodo";
import { fGetAllPeriodos } from "../../../fetch/fPeriodoInvestigacion";
import useUserStore from "../../../store/userStore";
import UploadFilePopUp from "../../../components/investigator/UploadFilePopUp";
import UploadObservationPopup from "../../../components/investigator/UploadObservationPopup";
import UploadFinalTrabajo from "../../../components/investigator/UploadFinalTrabajo";
import UploadFinalTrabajoObservationPopup from "../../../components/investigator/UploadFinalTrabajoObservation";
import {
	MyFinalPresentLayout,
	MyFinalPresentLoadingLayout,
	MyFinalPresentSelectLayout,
	MyFinalPresentTableLayout,
	MyFinalPresentTitleSelectLayout,
} from "../../../components/style/investigador/investigador.layout";
import SyncLoader from "react-spinners/SyncLoader";
import { PRINCIPAL_COLOR_CONF } from "../../../conf/COLORS.conf";

const InvestigatorFinalPresent = () => {
	const [selectedPeriodo, setSelectedPeriodo] = useState(null);
	const [Avances, setAvances] = useState([]);
	const [periodos, setPeriodos] = useState([]);
	const [openPopup, setOpenPopup] = useState(false);
	const [selectedDelivery, setSelectedDelivery] = useState(null);
	const [selectedObservationId, setSelectedObservationId] = useState(null);
	const [openObservationPopup, setOpenObservationPopup] = useState(false);
	const id_user = useUserStore((state) => state.id);
	const [loadingPeriodos, setLoadingPeriodos] = useState(true);
	const [loadingEntregas, setLoadingEntregas] = useState(false);

	useEffect(() => {
		// Obtener los periodos actuales al iniciar
		fGetAllPeriodos()
			.then((response) => {
				const periodosData = response.data.map((periodo) => ({
					value: periodo.id,
					label: `Periodo ${periodo.period_number}`,
				}));
				setPeriodos(periodosData);

				if (periodosData.length > 0) {
					setSelectedPeriodo(periodosData[0]); // Seleccionar el primer periodo por defecto
					// Solo activar el loading de entregas si hay períodos
					setLoadingEntregas(true);
				} else {
					// Asegurar que loadingEntregas sea false si no hay períodos
					setLoadingEntregas(false);
				}
			})
			.catch((error) => {
				console.error("Error al obtener los periodos:", error);
				// Asegurar que loadingEntregas sea false si hay un error
				setLoadingEntregas(false);
			})
			.finally(() => {
				setLoadingPeriodos(false);
			});
	}, []);

	useEffect(() => {
		// Obtener las entregas de acuerdo al periodo seleccionado
		if (selectedPeriodo) {
			setLoadingEntregas(true);
			fGetFinalesByPeriodoAndUser(id_user, selectedPeriodo.value)
				.then((response) => {
					console.log(response.data);
					setAvances(response.data);
				})
				.catch((error) => {
					console.error("Error al obtener las entregas:", error);
				})
				.finally(() => {
					setLoadingEntregas(false);
				});
		}
	}, [selectedPeriodo]);

	const handlePeriodoChange = (selectedOption) => {
		setSelectedPeriodo(selectedOption);
	};

	const handleOpenPopup = (delivery) => {
		setSelectedDelivery(delivery);
		setOpenPopup(true);
	};

	const handleClosePopup = () => {
		setOpenPopup(false);
		setSelectedDelivery(null);
	};

	const handleOpenObservationPopup = (observationId) => {
		setSelectedObservationId(observationId);
		setOpenObservationPopup(true);
	};

	const handleCloseObservationPopup = () => {
		setOpenObservationPopup(false);
		setSelectedObservationId(null);
	};

	const getReviewStatus = (id) => {
		const status = REVIEW_STATUS.find((status) => status.ID === id);
		return status ? status.ESTADO : "Desconocido";
	};

	const getObservationStatus = (id) => {
		const status = OBSERVATION_STATUS.find((status) => status.ID === id);
		return status ? status.ESTADO : "Desconocido";
	};

	const handleUploadSuccess = () => {
		// Volver a obtener las entregas después de una subida exitosa
		if (selectedPeriodo) {
			fGetFinalesByPeriodoAndUser(id_user, selectedPeriodo.value)
				.then((response) => {
					setAvances(response.data);
				})
				.catch((error) => {
					console.error("Error al obtener las entregas:", error);
				});
		}
	};

	// Función para determinar el estado de la fecha según el rango
	const getDateRangeStatus = (startDate, finishDate) => {
		const currentDate = new Date();
		const start = new Date(startDate);
		const finish = new Date(finishDate);

		// Establecer las horas para comparaciones precisas
		start.setHours(0, 0, 0, 0);
		finish.setHours(23, 59, 59, 999); // Fin del día

		if (currentDate < start) {
			return { status: "future", message: "Aún no disponible" };
		} else if (currentDate > finish) {
			return { status: "past", message: "Fuera de fecha" };
		} else {
			return { status: "current", message: "Disponible" };
		}
	};

	return (
		<MyFinalPresentLayout>
			<Title>Presentación de entrega final</Title>

			{loadingPeriodos ? (
				<MyFinalPresentLoadingLayout>
					<SyncLoader color={PRINCIPAL_COLOR_CONF} />
				</MyFinalPresentLoadingLayout>
			) : periodos.length === 0 ? (
				<Box sx={{ mt: 4 }}>
					<Alert severity="info" variant="outlined">
						No hay períodos de investigación disponibles. Por favor, comuníquese
						con el administrador.
					</Alert>
				</Box>
			) : (
				<>
					<MyFinalPresentTitleSelectLayout>
						<p>Seleccionar periodo de investigación activa</p>
						<MyFinalPresentSelectLayout>
							<Select
								options={periodos}
								value={selectedPeriodo}
								onChange={handlePeriodoChange}
								isDisabled={loadingPeriodos || periodos.length === 1}
								isSearchable={false}
								placeholder="Seleccione un periodo"
							/>
						</MyFinalPresentSelectLayout>
					</MyFinalPresentTitleSelectLayout>
					<MyFinalPresentTableLayout>
						{loadingEntregas ? (
							<MyFinalPresentLoadingLayout>
								<SyncLoader color={PRINCIPAL_COLOR_CONF} />
							</MyFinalPresentLoadingLayout>
						) : Avances.length > 0 ? (
							<TableContainer component={Paper} style={{ marginTop: "20px" }}>
								<Table>
									<TableHead sx={{ backgroundColor: PRINCIPAL_COLOR_CONF }}>
										<TableRow>
											<TableCell
												sx={{ color: "white" }}
												style={{ width: "5%" }}
											>
												Nombre de presentación
											</TableCell>
											<TableCell
												sx={{ color: "white" }}
												style={{ width: "10%" }}
											>
												Fecha de inicio de subida
											</TableCell>
											<TableCell
												sx={{ color: "white" }}
												style={{ width: "10%" }}
											>
												Fecha final de subida
											</TableCell>
											<TableCell
												sx={{ color: "white" }}
												style={{ width: "30%" }}
											>
												Subida de avance
											</TableCell>
											<TableCell
												sx={{ color: "white" }}
												style={{ width: "30%" }}
											>
												Subida de observación
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{Avances.map((proyecto) =>
											proyecto.user_research_projects.map((userProject) => (
												<React.Fragment key={userProject.id}>
													<TableRow>
														<TableCell
															colSpan={6}
															style={{ fontWeight: "bold" }}
														>
															{`Nombre: ${proyecto.name}`}
														</TableCell>
													</TableRow>
													{userProject.project_deliveries.map((entrega) => (
														<TableRow key={entrega.id}>
															<TableCell>Entrega final</TableCell>
															<TableCell>
																{new Date(
																	entrega.start_date,
																).toLocaleDateString()}
															</TableCell>
															<TableCell>
																{new Date(
																	entrega.finish_date,
																).toLocaleDateString()}
															</TableCell>
															<TableCell
																align="left"
																sx={{ verticalAlign: "top" }}
															>
																{entrega.doc_file_route_id ? (
																	<Button
																		href={`http://localhost:3000/download/download-pdf/${entrega.doc_file_route.id}`}
																		target="_blank"
																		rel="noopener noreferrer"
																		variant="contained"
																		color="primary"
																		startIcon={<DownloadIcon />}
																		style={{
																			display: "block",
																			marginTop: "5px",
																		}}
																	>
																		{entrega.doc_file_route.path
																			.split("\\")
																			.pop()
																			.split("/")
																			.pop()}
																	</Button>
																) : (
																	(() => {
																		const dateStatus = getDateRangeStatus(
																			entrega.start_date,
																			entrega.finish_date,
																		);

																		if (dateStatus.status === "current") {
																			return (
																				<div>
																					<Button
																						variant="contained"
																						color="primary"
																						style={{
																							display: "block",
																							marginTop: "5px",
																						}}
																						onClick={() =>
																							handleOpenPopup(entrega)
																						}
																					>
																						Subir entrega final
																					</Button>
																					<Typography
																						variant="caption"
																						color="success.main"
																					>
																						{dateStatus.message}
																					</Typography>
																				</div>
																			);
																		}

																		return (
																			<div>
																				<Button
																					variant="contained"
																					color="primary"
																					style={{
																						display: "block",
																						marginTop: "5px",
																					}}
																					disabled={true}
																				>
																					Subir entrega final
																				</Button>
																				<Typography
																					variant="caption"
																					color={
																						dateStatus.status === "future"
																							? "primary"
																							: "error"
																					}
																				>
																					{dateStatus.message}
																				</Typography>
																			</div>
																		);
																	})()
																)}
																{entrega.review && (
																	<div style={{ marginTop: "10px" }}>
																		<Typography variant="body2">
																			Estado de la revisión:{" "}
																		</Typography>
																		<Typography
																			variant="body2"
																			color={
																				entrega.review.status_review_id === 2
																					? "green"
																					: entrega.review.status_review_id ===
																							3
																						? "orange"
																						: "textSecondary"
																			}
																		>
																			{getReviewStatus(
																				entrega.review.status_review_id,
																			)}
																		</Typography>
																		<Paper>
																			<div style={{ padding: "10px" }}>
																				<Typography
																					variant="body2"
																					color="textSecondary"
																				>
																					Comentarios:
																				</Typography>
																				<Typography
																					variant="body2"
																					color="textSecondary"
																				>
																					{entrega.review.comments ||
																						"Sin comentarios"}
																				</Typography>
																			</div>
																		</Paper>
																	</div>
																)}
															</TableCell>
															<TableCell
																align="left"
																sx={{ verticalAlign: "top" }}
															>
																{entrega?.review?.observation_id ? (
																	<>
																		{entrega.review?.observation
																			?.doc_file_route_id ? (
																			<>
																				<Button
																					href={`http://localhost:3000/download/download-pdf/${entrega.review.observation.doc_file_route_id}`}
																					target="_blank"
																					rel="noopener noreferrer"
																					variant="contained"
																					color="primary"
																					startIcon={<DownloadIcon />}
																					style={{
																						display: "block",
																						marginTop: "5px",
																					}}
																				>
																					{entrega?.review?.observation?.doc_file_route?.path
																						.split("\\")
																						.pop()
																						.split("/")
																						.pop()}
																				</Button>
																			</>
																		) : (
																			(() => {
																				const dateStatus = getDateRangeStatus(
																					entrega.review.observation.start_date,
																					entrega.review.observation
																						.finish_date,
																				);

																				return (
																					<div>
																						{dateStatus.status === "current" ? (
																							<>
																								<Button
																									variant="contained"
																									color="primary"
																									style={{
																										display: "block",
																										marginTop: "5px",
																									}}
																									onClick={() =>
																										handleOpenObservationPopup(
																											entrega.review
																												.observation_id,
																										)
																									}
																								>
																									Subir entrega final corregida
																								</Button>
																								<Typography
																									variant="caption"
																									color="success.main"
																								>
																									{dateStatus.message}
																								</Typography>
																							</>
																						) : (
																							<>
																								<Button
																									variant="contained"
																									color="primary"
																									style={{
																										display: "block",
																										marginTop: "5px",
																									}}
																									disabled={true}
																								>
																									Subir entrega final corregida
																								</Button>
																								<Typography
																									variant="caption"
																									color={
																										dateStatus.status ===
																										"future"
																											? "primary"
																											: "error"
																									}
																								>
																									{dateStatus.message}
																								</Typography>
																							</>
																						)}
																					</div>
																				);
																			})()
																		)}
																		<div style={{ marginTop: "10px" }}>
																			<Typography variant="body2">
																				Tipo de observación:{" "}
																			</Typography>

																			<Typography
																				variant="body2"
																				color={
																					entrega.review?.observation
																						?.status_observation_id === 2
																						? "green"
																						: entrega.review?.observation
																									?.status_observation_id === 3
																							? "orange"
																							: entrega.review?.observation
																										?.status_observation_id ===
																									4
																								? "red"
																								: "textSecondary"
																				}
																			>
																				{getObservationStatus(
																					entrega?.review?.observation
																						?.status_observation_id,
																				)}
																			</Typography>
																			<Paper>
																				<div style={{ padding: "10px" }}>
																					<Typography
																						variant="body2"
																						color="textSecondary"
																					>
																						Comentarios:
																					</Typography>
																					<Typography
																						variant="body2"
																						color="textSecondary"
																					>
																						{entrega?.review?.observation
																							?.comments || "Sin comentarios"}
																					</Typography>
																				</div>
																			</Paper>
																		</div>
																		<Typography
																			variant="body2"
																			color="textSecondary"
																			gutterBottom
																		>
																			Periodo para entrega de corrección:
																		</Typography>
																		<Typography
																			variant="body2"
																			color="textSecondary"
																			gutterBottom
																		>
																			Desde:{" "}
																			{new Date(
																				entrega.review.observation.start_date,
																			).toLocaleDateString()}
																		</Typography>
																		<Typography
																			variant="body2"
																			color="textSecondary"
																			gutterBottom
																		>
																			Hasta:{" "}
																			{new Date(
																				entrega.review.observation.finish_date,
																			).toLocaleDateString()}
																		</Typography>
																	</>
																) : (
																	<></>
																)}
															</TableCell>
														</TableRow>
													))}
												</React.Fragment>
											)),
										)}
									</TableBody>
								</Table>
							</TableContainer>
						) : (
							<Box sx={{ mt: 4 }}>
								<Alert severity="info" variant="outlined">
									No hay entregas finales asociadas a este período de
									investigación.
								</Alert>
							</Box>
						)}
					</MyFinalPresentTableLayout>
				</>
			)}

			{selectedDelivery && (
				<UploadFinalTrabajo
					open={openPopup}
					onClose={handleClosePopup}
					delivery={selectedDelivery}
					onUploadSuccess={handleUploadSuccess}
				/>
			)}
			{selectedObservationId && (
				<UploadFinalTrabajoObservationPopup
					open={openObservationPopup}
					onClose={handleCloseObservationPopup}
					observationId={selectedObservationId}
					onUploadSuccess={handleUploadSuccess}
				/>
			)}
		</MyFinalPresentLayout>
	);
};

export default InvestigatorFinalPresent;
