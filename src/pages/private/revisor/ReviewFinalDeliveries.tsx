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
    fGetFullEntregasByPeriodo,
    fGetFullFinalesByPeriodo,
} from "../../../fetch/fEntregasPeriodo";
import { fGetAllPeriodos } from "../../../fetch/fPeriodoInvestigacion";
import RevisarPopUp from "../../../components/revisor/RevisarPopUp";
import RevisarObservacion from "../../../components/revisor/RevisarObservacion";
import useUserStore from "../../../store/userStore";
import RevisarTrabajoFinal from "../../../components/revisor/RevisarTrabajoFinal";
import RevisarObservacionTrabajoFinal from "../../../components/revisor/RevisarObservacionTrabajoFinal";
import {
    ReviewFinalDeliveriesLayout,
    ReviewFinalDeliveriesLoadingLayout,
    ReviewFinalDeliveriesSelectLayout,
    ReviewFinalDeliveriesTableLayout,
    ReviewFinalDeliveriesTitleSelectLayout,
} from "../../../components/style/revisor/Revisor.layout";
import SyncLoader from "react-spinners/SyncLoader";
import { PRINCIPAL_COLOR_CONF } from "../../../conf/COLORS.conf";

const ReviewFinalDeliveries = () => {
    const userId = useUserStore((state) => state.id);
    const [selectedPeriodo, setSelectedPeriodo] = useState(null);
    const [Avances, setAvances] = useState([]);
    const [periodos, setPeriodos] = useState([]);
    const [openReviewPopUp, setOpenReviewPopUp] = useState(false);
    const [selectedDeliveryId, setSelectedDeliveryId] = useState(null);
    const [openObservationPopUp, setOpenObservationPopUp] = useState(false);
    const [selectedObservationId, setSelectedObservationId] = useState(null);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
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
                // En caso de error, asegurar que loadingEntregas sea false
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
            fGetFullFinalesByPeriodo(selectedPeriodo.value)
                .then((response) => {
                    setAvances(response.data);
                })
                .catch((error) => {
                    console.error("Error al obtener las entregas finales:", error);
                })
                .finally(() => {
                    setLoadingEntregas(false);
                });
        }
    }, [selectedPeriodo]);

    const handlePeriodoChange = (selectedOption) => {
        setSelectedPeriodo(selectedOption);
    };

    const getReviewStatus = (id) => {
        const status = REVIEW_STATUS.find((status) => status.ID === id);
        return status ? status.ESTADO : "Desconocido";
    };

    const getObservationStatus = (id) => {
        const status = OBSERVATION_STATUS.find((status) => status.ID === id);
        return status ? status.ESTADO : "Desconocido";
    };

    const handleOpenReviewPopUp = (deliveryId, projectId) => {
        setSelectedDeliveryId(deliveryId);
        setSelectedProjectId(projectId);
        setOpenReviewPopUp(true);
    };

    const handleCloseReviewPopUp = () => {
        setOpenReviewPopUp(false);
        setSelectedProjectId(null);
        setSelectedDeliveryId(null);
    };

    const handleOpenObservationPopUp = (observationId, projectId, deliveryId) => {
        setSelectedObservationId(observationId);
        setSelectedProjectId(projectId);
        setSelectedDeliveryId(deliveryId);
        setOpenObservationPopUp(true);
    };

    const handleCloseObservationPopUp = () => {
        setOpenObservationPopUp(false);
        setSelectedProjectId(null);
        setSelectedDeliveryId(null);
        setSelectedObservationId(null);
    };

    const handleReviewSuccess = () => {
        // Actualizar la lista de entregas después de una revisión exitosa
        if (selectedPeriodo) {
            fGetFullFinalesByPeriodo(selectedPeriodo.value)
                .then((response) => {
                    setAvances(response.data);
                })
                .catch((error) => {
                    console.error("Error al obtener las entregas finales:", error);
                });
        }
    };

    return (
        <ReviewFinalDeliveriesLayout>
            <Title>Revisar Entregas Finales</Title>
            
            {loadingPeriodos ? (
                <ReviewFinalDeliveriesLoadingLayout>
                    <SyncLoader color={PRINCIPAL_COLOR_CONF} />
                </ReviewFinalDeliveriesLoadingLayout>
            ) : periodos.length === 0 ? (
                <Box sx={{ mt: 4 }}>
                    <Alert severity="info" variant="outlined">
                        No hay períodos de investigación disponibles. Por favor, comuníquese con el administrador.
                    </Alert>
                </Box>
            ) : (
                <>
                    <ReviewFinalDeliveriesTitleSelectLayout>
                        <p>Seleccionar periodo de investigación activa</p>
                        <ReviewFinalDeliveriesSelectLayout>
                            <Select
                                options={periodos}
                                value={selectedPeriodo}
                                onChange={handlePeriodoChange}
                                isDisabled={loadingPeriodos || periodos.length === 1}
                                isSearchable={false}
                                placeholder="Seleccione un periodo"
                            />
                        </ReviewFinalDeliveriesSelectLayout>
                    </ReviewFinalDeliveriesTitleSelectLayout>
                    <ReviewFinalDeliveriesTableLayout>
                        {loadingEntregas ? (
                            <ReviewFinalDeliveriesLoadingLayout>
                                <SyncLoader color={PRINCIPAL_COLOR_CONF} />
                            </ReviewFinalDeliveriesLoadingLayout>
                        ) : Avances.length > 0 ? (
                            <TableContainer component={Paper} style={{ marginTop: "20px" }}>
                                <Table>
                                    <TableHead sx={{ backgroundColor: PRINCIPAL_COLOR_CONF }}>
                                        <TableRow>
                                            <TableCell sx={{ color: "white" }} style={{ width: "5%" }}>
                                                Numero de Presentación
                                            </TableCell>
                                            <TableCell sx={{ color: "white" }} style={{ width: "10%" }}>
                                                Fecha de inicio de subida
                                            </TableCell>
                                            <TableCell sx={{ color: "white" }} style={{ width: "10%" }}>
                                                Fecha final de subida
                                            </TableCell>
                                            <TableCell sx={{ color: "white" }} style={{ width: "30%" }}>
                                                Revisar
                                            </TableCell>
                                            <TableCell sx={{ color: "white" }} style={{ width: "30%" }}>
                                                Observación
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Avances.map((proyecto) =>
                                            proyecto.user_research_projects.map((userProject) => (
                                                <React.Fragment key={userProject.id}>
                                                    <TableRow>
                                                        <TableCell
                                                            sx={{ backgroundColor: "#EBEBEB" }}
                                                            colSpan={6}
                                                            style={{ fontWeight: "bold" }}
                                                        >
                                                            {`Nombre: ${proyecto.name} Usuario ${userProject.user_id}`}
                                                        </TableCell>
                                                    </TableRow>
                                                    {userProject.project_deliveries
                                                        .sort((a, b) => a.delivery_number - b.delivery_number)
                                                        .map((entrega) => (
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
                                                                    <Button
                                                                        variant="contained"
                                                                        color="primary"
                                                                        style={{ display: "block", marginTop: "5px" }}
                                                                        disabled={
                                                                            !entrega.doc_file_route_id ||
                                                                            entrega.review_id
                                                                        }
                                                                        onClick={() =>
                                                                            handleOpenReviewPopUp(entrega.id, proyecto.id)
                                                                        }
                                                                    >
                                                                        Revisar
                                                                    </Button>
                                                                    {entrega.doc_file_route_id ? (
                                                                        <Button
                                                                            href={`http://localhost:3000/download/download-pdf/${entrega.doc_file_route.id}`}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            variant="contained"
                                                                            color="primary"
                                                                            startIcon={<DownloadIcon />}
                                                                            style={{ display: "block", marginTop: "5px" }}
                                                                        >
                                                                            {entrega.doc_file_route.path
                                                                                .split("\\")
                                                                                .pop()
                                                                                .split("/")
                                                                                .pop()}
                                                                        </Button>
                                                                    ) : (
                                                                        <Typography variant="body2" color="text.secondary">
                                                                            No hay archivo subido
                                                                        </Typography>
                                                                    )}
                                                                    {entrega.review && (
                                                                        <div style={{ marginTop: "10px" }}>
                                                                            <Typography variant="body2">
                                                                                Estado de la revisión:
                                                                            </Typography>
                                                                            <Typography
                                                                                variant="body2"
                                                                                color={
                                                                                    entrega.review.status_review_id === 2
                                                                                        ? "green"
                                                                                        : entrega.review.status_review_id === 3
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
                                                                                        {entrega.review.comments || "Sin comentarios"}
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
                                                                    <Button
                                                                        variant="contained"
                                                                        color="primary"
                                                                        style={{ display: "block", marginTop: "5px" }}
                                                                        disabled={
                                                                            entrega.review?.status_review_id !== 3 ||
                                                                            !entrega.review?.observation
                                                                                ?.doc_file_route_id ||
                                                                            entrega.review?.observation
                                                                                ?.status_observation_id !== 1
                                                                        }
                                                                        onClick={() =>
                                                                            handleOpenObservationPopUp(
                                                                                entrega.review?.observation?.id,
                                                                                proyecto.id,
                                                                                entrega.id,
                                                                            )
                                                                        }
                                                                    >
                                                                        Gestionar observación
                                                                    </Button>
                                                                    {entrega.review?.observation ? (
                                                                        <>
                                                                            {entrega.review.observation
                                                                                .doc_file_route_id ? (
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
                                                                            ) : (
                                                                                <Typography variant="body2" color="text.secondary">
                                                                                    No hay archivo de observación
                                                                                </Typography>
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
                                                                                                            ?.status_observation_id === 4
                                                                                                    ? "red"
                                                                                                    : "textSecondary"
                                                                                    }
                                                                                >
                                                                                    {getObservationStatus(
                                                                                        entrega.review.observation
                                                                                            .status_observation_id,
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
                                                                                            {entrega?.review?.observation?.comments || "Sin comentarios"}
                                                                                        </Typography>
                                                                                    </div>
                                                                                </Paper>
                                                                            </div>
                                                                            <div style={{ marginTop: "10px" }}>
                                                                                <Typography
                                                                                    variant="body2"
                                                                                    color="textSecondary"
                                                                                    gutterBottom
                                                                                >
                                                                                    Periodo para corrección:
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
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <Typography variant="body2" color="text.secondary">
                                                                            No hay observación creada
                                                                        </Typography>
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
                                    No hay entregas finales para revisar en este período de investigación.
                                </Alert>
                            </Box>
                        )}
                    </ReviewFinalDeliveriesTableLayout>
                </>
            )}
            
            <RevisarTrabajoFinal
                open={openReviewPopUp}
                onClose={handleCloseReviewPopUp}
                deliveryId={selectedDeliveryId}
                onReviewSuccess={handleReviewSuccess}
                userId={userId}
                researchProjectId={selectedProjectId}
            />
            <RevisarObservacionTrabajoFinal
                deliveryId={selectedDeliveryId}
                open={openObservationPopUp}
                onClose={handleCloseObservationPopUp}
                observationId={selectedObservationId}
                onReviewSuccess={handleReviewSuccess}
                userId={userId}
                researchProjectId={selectedProjectId}
            />
        </ReviewFinalDeliveriesLayout>
    );
};

export default ReviewFinalDeliveries;