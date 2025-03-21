import { useState, useEffect } from "react";
import {
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Box,
	Alert,
} from "@mui/material";
import SyncLoader from "react-spinners/SyncLoader";
import useUserStore from "../../../store/userStore";
import { fGetAllPeriodos } from "../../../fetch/fPeriodoInvestigacion";
import Select from "react-select";
import { RESEARCH_STATUS } from "../../../constants/data/VariableStatus";
import { fGetEntregasByUserAndPeriod } from "../../../fetch/fEntregasPeriodo";
import {
	MyInvestigationLayout,
	MyInvestigationLoadingLayout,
	MyInvestigationTableLayout,
	MyInvestigationTitleSelectLayout,
	SelectLayout,
} from "../../../components/style/investigador/investigador.layout";
import { DELIVERY_TYPES } from "../../../constants/data/VariablesDelivery";
import { Title } from "../../../components/style/general/Text.styles";
import { PRINCIPAL_COLOR_CONF } from "../../../conf/COLORS.conf";

const InvestigatorMyInvestigation = () => {
	const userId = useUserStore((state) => state.id);
	const [periodos, setPeriodos] = useState([]);
	const [selectedPeriodo, setSelectedPeriodo] = useState(null);
	const [entregas, setEntregas] = useState([]);
	const [loadingPeriodos, setLoadingPeriodos] = useState(true);
	const [loadingEntregas, setLoadingEntregas] = useState(false);
	useEffect(() => {
		// Obtener los periodos activos
		fGetAllPeriodos()
			.then((response) => {
				const periodosData = response.data.map((periodo) => ({
					value: periodo.id,
					label: `Periodo ${periodo.period_number}`,
				}));
				setPeriodos(periodosData);
				if (periodosData.length > 0) {
					setSelectedPeriodo(periodosData[0]);
					// Solo activar el loading de entregas si hay períodos
					setLoadingEntregas(true);
				} else {
					// Asegurar que loadingEntregas sea false si no hay períodos
					setLoadingEntregas(false);
				}
			})
			.catch((error) => {
				console.error("Error al obtener los periodos:", error);
				setLoadingEntregas(false);
			})
			.finally(() => {
				setLoadingPeriodos(false);
			});
	}, []);

	useEffect(() => {
		if (selectedPeriodo) {
			// Consultar las entregas basadas en el periodo seleccionado
			setLoadingEntregas(true);
			fGetEntregasByUserAndPeriod(userId, selectedPeriodo.value)
				.then((response) => {
					setEntregas(response.data);
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

	const getStatusLabel = (statusId) => {
		const status = RESEARCH_STATUS.find((status) => status.ID === statusId);
		return status ? status.ESTADO : "Desconocido";
	};
	const getDeliveryTypeLabel = (deliveryTypeId) => {
		const deliveryType = DELIVERY_TYPES.find(
			(type) => type.id === deliveryTypeId,
		);
		return deliveryType ? deliveryType.tipo : "Desconocido";
	};
	return (
        <MyInvestigationLayout>
            <Title>Mis Investigaciones</Title>
            
            {loadingPeriodos ? (
                <MyInvestigationLoadingLayout>
                    <SyncLoader color={PRINCIPAL_COLOR_CONF} />
                </MyInvestigationLoadingLayout>
            ) : periodos.length === 0 ? (
                <Box sx={{ mt: 4 }}>
                    <Alert severity="info" variant="outlined">
                        No hay períodos de investigación disponibles. Por favor, comuníquese con el administrador.
                    </Alert>
                </Box>
            ) : (
                <>
                    <MyInvestigationTitleSelectLayout>
                        <p>Seleccionar periodo de investigacion</p>
                        <SelectLayout>
                            <Select
                                isSearchable={false}
                                options={periodos}
                                value={selectedPeriodo}
                                onChange={handlePeriodoChange}
                                placeholder="Seleccione un periodo"
                                isDisabled={loadingPeriodos || periodos.length === 1}
                            />
                        </SelectLayout>
                    </MyInvestigationTitleSelectLayout>
                    
                    <MyInvestigationTableLayout>
                        {loadingEntregas ? (
                            <MyInvestigationLoadingLayout>
                                <SyncLoader color={PRINCIPAL_COLOR_CONF} />
                            </MyInvestigationLoadingLayout>
                        ) : entregas.length > 0 ? (
                            <TableContainer component={Paper} style={{ marginTop: "20px" }}>
                                <Table>
                                    <TableHead sx={{ backgroundColor: PRINCIPAL_COLOR_CONF}}>
                                        <TableRow>
                                            <TableCell sx={{ color: "white" }}>
                                                Nombre del Proyecto
                                            </TableCell>
                                            <TableCell sx={{ color: "white" }}>
                                                Fecha de Inicio
                                            </TableCell>
                                            <TableCell sx={{ color: "white" }}>
                                                Fecha de Finalización
                                            </TableCell>
                                            <TableCell sx={{ color: "white" }}>
                                                Estado del proyecto
                                            </TableCell>
                                            <TableCell sx={{ color: "white" }}>
                                                Entregas y fechas
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {entregas.map((proyecto) => (
                                            <TableRow key={proyecto.id}>
                                                <TableCell>{proyecto.name}</TableCell>
                                                <TableCell>
                                                    {new Date(proyecto.start_date).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(proyecto.finish_date).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusLabel(proyecto.status_project_id)}
                                                </TableCell>
                                                <TableCell>
                                                    {proyecto.user_research_projects[0].project_deliveries.map(
                                                        (entrega) => (
                                                            <TableRow key={entrega.id}>
                                                                <TableCell>
                                                                    <Typography variant="body2">
                                                                        {entrega.delivery_type_id === 2
                                                                            ? "Entrega Final"
                                                                            : `Avance ${entrega.delivery_number}:`}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography variant="body2">
                                                                        Fecha de inicio:{" "}
                                                                        {new Date(
                                                                            entrega.start_date,
                                                                        ).toLocaleDateString()}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography variant="body2">
                                                                        Fecha de finalización:{" "}
                                                                        {new Date(
                                                                            entrega.finish_date,
                                                                        ).toLocaleDateString()}
                                                                    </Typography>
                                                                </TableCell>
                                                            </TableRow>
                                                        ),
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Box sx={{ mt: 4 }}>
                                <Alert severity="info" variant="outlined">
                                    No hay entregas asociadas a este período de investigación.
                                </Alert>
                            </Box>
                        )}
                    </MyInvestigationTableLayout>
                </>
            )}
        </MyInvestigationLayout>
    );
};

export default InvestigatorMyInvestigation;
