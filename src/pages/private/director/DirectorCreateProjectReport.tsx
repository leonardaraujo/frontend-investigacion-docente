import { useState, useEffect } from "react";
import { Button, Typography } from "@mui/material";
import Select from "react-select";
import { fGetAllFullEntregasByPeriodo, fGetEntregasByPeriodo } from "../../../fetch/fEntregasPeriodo";
import { fGetAllPeriodos, fGetAllPeriodosDirector } from "../../../fetch/fPeriodoInvestigacion";
import { RESEARCH_STATUS } from "../../../constants/data/VariableStatus";
import { Title } from "../../../components/style/general/Text.styles";
import {
	DirectorReportLayout,
	DirectorReportTextSelectLayout,
} from "../../../components/style/director/Director.styles";
import useUserStore from "../../../store/userStore";
import { generatePDF } from "../../../utils/pdfUtils";
const DirectorCreateProjectReport = () => {
	const { rol_id, email, name, paternal_surname, maternal_surname } =
		useUserStore();
	const [periodos, setPeriodos] = useState([]);
	const [selectedPeriodo, setSelectedPeriodo] = useState(null);
	const [entregas, setEntregas] = useState([]);

	useEffect(() => {
		console.log("DirectorCreateProjectReport");

		fGetAllPeriodosDirector()
			.then((response) => {
				const periodosData = response.data.map((periodo) => ({
					value: periodo.id,
					label: `Periodo ${periodo.period_number}`,
				}));
				setPeriodos(periodosData);
				if (periodosData.length > 0) {
					setSelectedPeriodo(periodosData[0]);
				}
			})
			.catch((error) => {
				console.error("Error al obtener los periodos:", error);
			});
	}, []);

	useEffect(() => {
		if (selectedPeriodo) {

			fGetAllFullEntregasByPeriodo(selectedPeriodo.value)
				.then((response) => {
					setEntregas(response.data);
				})
				.catch((error) => {
					console.error("Error al obtener las entregas:", error);
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
	const userData = {
		rol_id,
		email,
		name,
		paternal_surname,
		maternal_surname,
		fullName: `${name} ${paternal_surname} ${maternal_surname}`,
	};
	return (
		<DirectorReportLayout>
			<Title variant="h4" gutterBottom>
				Crear informe de estado de proyectos
			</Title>
			<DirectorReportTextSelectLayout>
				<Typography variant="h6" gutterBottom>
					Seleccione el periodo
				</Typography>
				<Select
					isSearchable={false}
					options={periodos}
					value={selectedPeriodo}
					onChange={handlePeriodoChange}
					placeholder="Seleccione un periodo"
					isDisabled={periodos.length === 0}
				/>
			</DirectorReportTextSelectLayout>
			<Typography sx={{ fontStyle: "italic", color: "text.secondary" }}>
				Esta opción generará un informe del estado de los proyectos
				correspondientes al periodo seleccionado. El informe incluirá la fecha
				actual, un resumen de los proyectos, las entregas realizadas por cada
				investigador y las revisiones junto con las opiniones proporcionadas por
				los revisores.
			</Typography>
			<Button
				variant="contained"
				color="primary"
				onClick={() =>
					generatePDF(entregas, selectedPeriodo, getStatusLabel, userData)
				}
				style={{ marginTop: "20px" }}
			>
				Generar informe de proyectos
			</Button>
		</DirectorReportLayout>
	);
};

export default DirectorCreateProjectReport;
