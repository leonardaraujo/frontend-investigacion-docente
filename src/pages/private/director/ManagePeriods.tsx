import { useState, useEffect } from "react";
import {
	Typography,
	Button,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Chip,
	Box,
	CircularProgress,
	Card,
	CardContent,
	Grid,
	Alert,
	Snackbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WarningIcon from "@mui/icons-material/Warning";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { PERIOD_STATUS } from "../../../constants/data/VariableStatus";
import { PRINCIPAL_COLOR_CONF } from "../../../conf/COLORS.conf";

interface ResearchPeriod {
	id: number;
	period_number: number;
	status_id: number;
	doc_file_route_id?: number | null;
	start_date: string;
	finish_date: string | null;
	total_proyectos?: number;
	research_projects_count?: number;
	research_projects?: ResearchProject[];
}

interface ResearchProject {
	id: number;
	name: string;
	start_date: string;
	finish_date: string;
	status_project_id: number;
	line_research_id: number;
	research_period_id: number;
	user_research_projects: UserResearchProject[];
}

interface UserResearchProject {
	id: number;
	user_id: number;
	research_project_id: number;
	creation_date: string;
	project_deliveries: ProjectDelivery[];
}

interface ProjectDelivery {
	id: number;
	delivery_number: number;
	delivery_status_id: number;
	start_date: string;
	finish_date: string;
	delivery_type_id: number;
	user_research_project_id: number;
	doc_file_route_id: number;
	review_id: number;
	review: Review;
	doc_file_route: DocFileRoute;
}

interface Review {
	id: number;
	user_id: number;
	status_review_id: number;
	review_date: string;
	observation_id: number;
	comments: string;
	observation: Observation;
}

interface Observation {
	id: number;
	user_id: number | null;
	start_date: string;
	finish_date: string;
	status_observation_id: number;
	doc_file_route_id: number | null;
	comments: string | null;
	doc_file_route: DocFileRoute | null;
}

interface DocFileRoute {
	id: number;
	path: string;
	upload_date: string;
}

// Componentes de estilo
const StyledTableHead = styled(TableHead)(({ theme }) => ({
	backgroundColor: PRINCIPAL_COLOR_CONF,
	"& .MuiTableCell-root": {
		color: theme.palette.common.white,
		fontWeight: "bold",
	},
}));

const StatusChip = styled(Chip)(
	({ theme, status }: { theme: any; status: "active" | "inactive" }) => ({
		backgroundColor:
			status === "active"
				? theme.palette.success.light
				: theme.palette.grey[500],
		color:
			status === "active"
				? theme.palette.success.contrastText
				: theme.palette.grey[50],
		fontWeight: "bold",
	}),
);

const ActionButton = styled(Button)(({ theme }) => ({
	margin: theme.spacing(0.5),
}));

const ManagePeriods = () => {
	// Estado para manejar los períodos
	const [periods, setPeriods] = useState<ResearchPeriod[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Estado para diálogos
	const [openFinalizeDialog, setOpenFinalizeDialog] = useState(false);
	const [selectedPeriod, setSelectedPeriod] = useState<ResearchPeriod | null>(
		null,
	);

	// Estado para notificaciones
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		severity: "success" as "success" | "error",
	});

	// Estado para manejar operaciones
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Cargar períodos al montar el componente
	useEffect(() => {
		fetchPeriods();
	}, []);

	// Función para obtener los períodos
	const fetchPeriods = async () => {
		setLoading(true);
		try {
			const response = await axios.get(
				"http://localhost:3000/directorData/all-periodos",
			);
			console.log(response);
			// Verificar que response.data es un array antes de mapearlo
			if (Array.isArray(response.data)) {
				// Mapear los datos para incluir el recuento de proyectos
				const periodsWithCounts = response.data.map(
					(period: ResearchPeriod) => ({
						...period,
						research_projects_count: period.research_projects
							? period.research_projects.length
							: 0,
					}),
				);

				setPeriods(periodsWithCounts);
			} else if (typeof response.data === "object" && response.data !== null) {
				// Si es un objeto único, lo convertimos en un array con un elemento
				const periodWithCount = {
					...response.data,
					research_projects_count: response.data.research_projects
						? response.data.research_projects.length
						: 0,
				};
				setPeriods([periodWithCount]);
			} else {
				// Si no es ni un array ni un objeto, establecemos un array vacío
				setPeriods([]);
				setError("El formato de datos recibido no es válido");
			}

			setError(null);
		} catch (err: any) {
			setError(err.message || "Error al cargar los períodos");
			console.error("Error al cargar los períodos:", err);
		} finally {
			setLoading(false);
		}
	};

	// Función para finalizar un período
	const finalizePeriod = async (periodId: number) => {
		setIsSubmitting(true);
		try {
			const response = await axios.put(
				`http://localhost:3000/directorData/finalizar-periodo/${periodId}`,
			);

			if (response.data.success) {
				// Obtener el período actualizado de la respuesta
				const updatedPeriod = response.data.data;

				// Actualizar el estado local con los datos exactos que devuelve el servidor
				setPeriods((prevPeriods) =>
					prevPeriods.map((period) =>
						period.id === periodId
							? {
									...period,
									status_id: 2, // Marcamos como finalizado
									finish_date: updatedPeriod.finish_date, // Actualizamos con la fecha de finalización que asignó el servidor
								}
							: period,
					),
				);

				setSnackbar({
					open: true,
					message:
						response.data.message ||
						"El período ha sido finalizado correctamente",
					severity: "success",
				});
			} else {
				throw new Error(
					response.data.message || "Error desconocido al finalizar el período",
				);
			}
		} catch (err: any) {
			console.error("Error al finalizar el período:", err);

			// Obtener el mensaje de error, ya sea del objeto de respuesta o del error mismo
			const errorMessage =
				err.response?.data?.message || err.message || "Error desconocido";

			setSnackbar({
				open: true,
				message: `Error al finalizar el período: ${errorMessage}`,
				severity: "error",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	// Handlers
	const handleOpenFinalizeDialog = (period: ResearchPeriod) => {
		setSelectedPeriod(period);
		setOpenFinalizeDialog(true);
	};

	const handleCloseFinalizeDialog = () => {
		setOpenFinalizeDialog(false);
		setSelectedPeriod(null);
	};

	const handleFinalizePeriod = () => {
		if (selectedPeriod) {
			finalizePeriod(selectedPeriod.id);
			handleCloseFinalizeDialog();
		}
	};

	const handleCloseSnackbar = () => {
		setSnackbar({ ...snackbar, open: false });
	};

	// Formateo de fechas utilizando el objeto Date nativo
	const formatDate = (dateString: string | null) => {
		if (!dateString) {
			return "No tiene fecha de finalización";
		}
		const date = new Date(dateString);
		return date.toLocaleDateString("es-ES", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		});
	};

	// Obtener el estado del período
	const getPeriodStatus = (statusId: number) => {
		const status = PERIOD_STATUS.find((status) => status.ID === statusId);
		return status ? status.ESTADO : "Desconocido";
	};

	// Stats
	const activePeriods = periods.filter((p) => p.status_id === 1).length;
	const inactivePeriods = periods.filter((p) => p.status_id === 2).length;

	if (loading) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				height="80vh"
			>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Box m={2}>
				<Alert severity="error">Error al cargar los períodos: {error}</Alert>
			</Box>
		);
	}

	return (
		<Box sx={{ padding: 3 }}>
			<Typography variant="h4" component="h1" gutterBottom>
				Gestión de Períodos de Investigación
			</Typography>

			<Grid container spacing={3} sx={{ mb: 4 }}>
				<Grid item xs={12} md={4}>
					<Card>
						<CardContent>
							<Typography variant="h6" component="div">
								Períodos Activos
							</Typography>
							<Typography variant="h3" color="primary">
								{activePeriods}
							</Typography>
						</CardContent>
					</Card>
				</Grid>
				<Grid item xs={12} md={4}>
					<Card>
						<CardContent>
							<Typography variant="h6" component="div">
								Períodos Finalizados
							</Typography>
							<Typography variant="h3" color="text.secondary">
								{inactivePeriods}
							</Typography>
						</CardContent>
					</Card>
				</Grid>
				<Grid item xs={12} md={4}>
					<Card>
						<CardContent>
							<Typography variant="h6" component="div">
								Total de Períodos
							</Typography>
							<Typography variant="h3" color="text.primary">
								{periods.length}
							</Typography>
						</CardContent>
					</Card>
				</Grid>
			</Grid>

			<TableContainer
				sx={{
					maxHeight: "550px",
					overflow: "auto",
				}}
				component={Paper}
			>
				<Table>
					<StyledTableHead>
						<TableRow>
							<TableCell>ID</TableCell>
							<TableCell>Número</TableCell>
							<TableCell>Fecha de Inicio</TableCell>
							<TableCell>Fecha de Finalización</TableCell>
							<TableCell>Estado</TableCell>
							<TableCell>Proyectos</TableCell>
							<TableCell align="center">Acciones</TableCell>
						</TableRow>
					</StyledTableHead>
					<TableBody>
						{periods.map((period) => (
							<TableRow key={period.id} hover>
								<TableCell>{period.id}</TableCell>
								<TableCell>Período {period.period_number}</TableCell>
								<TableCell>{formatDate(period.start_date)}</TableCell>
								<TableCell>{formatDate(period.finish_date)}</TableCell>
								<TableCell>
									<StatusChip
										label={getPeriodStatus(period.status_id)}
										status={period.status_id === 1 ? "active" : "inactive"}
									/>
								</TableCell>
								<TableCell>
									{period.total_proyectos ||
										period.research_projects_count ||
										0}
								</TableCell>
								<TableCell align="center">
									{period.status_id === 1 && (
										<ActionButton
											variant="contained"
											color="warning"
											size="small"
											onClick={() => handleOpenFinalizeDialog(period)}
											startIcon={<CloseIcon />}
										>
											Finalizar
										</ActionButton>
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Dialog para finalizar un período */}
			<Dialog
				open={openFinalizeDialog}
				onClose={handleCloseFinalizeDialog}
				aria-labelledby="finalize-dialog-title"
			>
				<DialogTitle id="finalize-dialog-title">
					<Box display="flex" alignItems="center">
						<WarningIcon color="warning" sx={{ mr: 1 }} />
						Finalizar Período
					</Box>
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						¿Está seguro que desea finalizar el Período{" "}
						{selectedPeriod?.period_number}? Esta acción no se puede deshacer.
					</DialogContentText>
					{selectedPeriod && (
						<Box mt={2}>
							<Typography variant="subtitle2">Detalles del período:</Typography>
							<Typography variant="body2">
								Inicio: {formatDate(selectedPeriod.start_date)}
							</Typography>
							<Typography variant="body2">
								Proyectos asociados:{" "}
								{selectedPeriod.total_proyectos ||
									selectedPeriod.research_projects_count ||
									0}
							</Typography>
						</Box>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseFinalizeDialog} color="primary">
						Cancelar
					</Button>
					<Button
						onClick={handleFinalizePeriod}
						color="warning"
						variant="contained"
						startIcon={<CloseIcon />}
						disabled={isSubmitting}
					>
						{isSubmitting ? "Finalizando..." : "Finalizar Período"}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Snackbar para notificaciones */}
			<Snackbar
				open={snackbar.open}
				autoHideDuration={6000}
				onClose={handleCloseSnackbar}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
			>
				<Alert
					onClose={handleCloseSnackbar}
					severity={snackbar.severity}
					variant="filled"
					sx={{ width: "100%" }}
				>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</Box>
	);
};

export default ManagePeriods;
