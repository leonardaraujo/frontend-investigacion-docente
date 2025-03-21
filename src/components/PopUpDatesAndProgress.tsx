import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import {
	Overlay,
	OverlayProgress,
	PopUpContainer,
	PopUpContainerProgress,
	ProgressContainerLayout,
} from "./style/create-schedule/PopUpDatesAndProgress.style";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import dayjs, { Dayjs } from "dayjs";
import {
	MenuItem,
	Select,
	InputLabel,
	FormControl,
	Button,
	Typography,
} from "@mui/material";

interface PopUpDatesAndProgressProps {
	closePop: Dispatch<SetStateAction<boolean>>;
	dataAvance: any;
	dataChanger: Dispatch<SetStateAction<any>>;
	fechaInicioPadre: Dayjs;
	fechaLimitePadre: Dayjs;
	onSave: (newAvances: any) => void;
}

const PopUpDatesAndProgress: React.FC<PopUpDatesAndProgressProps> = ({
	closePop,
	dataAvance,
	dataChanger,
	fechaInicioPadre,
	fechaLimitePadre,
	onSave,
}) => {
	const [numAvances, setNumAvances] = useState<number>(
		dataAvance.cantAvances || 0,
	);
	const [avancesData, setAvancesData] = useState(dataAvance.avancesData || []);
	const [error, setError] = useState<string | null>(null);
	const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(true);

	useEffect(() => {
		// Verificar que todas las fechas tengan valor
		const allDatesFilled = avancesData.every(
			(avance) => avance.fechaInit && avance.fechaFinish,
		);
		setIsSaveDisabled(!allDatesFilled);
	}, [avancesData]);

	const handleNumAvancesChange = (
		event: React.ChangeEvent<{ value: unknown }>,
	) => {
		const newNumAvances = event.target.value as number;
		setNumAvances(newNumAvances);
		const newAvancesData = Array.from(
			{ length: newNumAvances },
			(_, index) => ({
				index: index + 1,
				fechaInit: avancesData[index]?.fechaInit || null,
				fechaFinish: avancesData[index]?.fechaFinish || null,
			}),
		);
		setAvancesData(newAvancesData);
		dataChanger({
			...dataAvance,
			cantAvances: newNumAvances,
			avancesData: newAvancesData,
		});
	};

	const handleDateChange = (
		index: number,
		type: "fechaInit" | "fechaFinish",
		newValue: Dayjs | null,
	) => {
		const newAvancesData = avancesData.map((avance, i) =>
			i === index
				? { ...avance, [type]: newValue ? newValue.format("YYYY-MM-DD") : null }
				: avance,
		);
		setAvancesData(newAvancesData);
		dataChanger({
			...dataAvance,
			avancesData: newAvancesData,
		});
	};

	const handleSave = () => {
		// Verificar que todas las fechas tengan valor
		const allDatesFilled = avancesData.every(
			(avance) => avance.fechaInit && avance.fechaFinish,
		);

		if (!allDatesFilled) {
			setError("Por favor, complete todas las fechas antes de guardar.");
			return;
		}

		console.log("Guardando avances", {
			id_user: dataAvance.id_user,
			avances: { cantAvances: avancesData.length, avancesData },
		});
		onSave({
			id_user: dataAvance.id_user,
			avances: { cantAvances: avancesData.length, avancesData },
		});
		closePop(false);
	};

	return (
		<OverlayProgress>
			<PopUpContainerProgress>
				<ProgressContainerLayout>
					<h2>Editar avances</h2>
					<FormControl fullWidth>
						<InputLabel id="num-avances-label">Número de Avances</InputLabel>
						<Select
							labelId="num-avances-label"
							value={numAvances}
							onChange={handleNumAvancesChange}
							label="Número de Avances"
						>
							{[...Array(5).keys()].map((i) => (
								<MenuItem key={i + 1} value={i + 1}>
									{i + 1}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					{avancesData.length > 0 ? (
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<table>
								<thead>
									<tr>
										<th>Nombre</th>
										<th>Fecha de Inicio</th>
										<th>Fecha de Término</th>
									</tr>
								</thead>
								<tbody>
									{avancesData.map((avance, index) => (
										<tr key={index}>
											<td>Avance {avance.index}</td>
											<td>
												<DatePicker
													label="Fecha Inicio"
													value={
														avance.fechaInit ? dayjs(avance.fechaInit) : null
													}
													onChange={(newValue) =>
														handleDateChange(index, "fechaInit", newValue)
													}
													renderInput={(params) => <TextField {...params} />}
													minDate={
														index === 0
															? dayjs(fechaInicioPadre)
															: dayjs(avancesData[index - 1].fechaFinish).add(
																	1,
																	"day",
																)
													}
													maxDate={dayjs(fechaLimitePadre)}
													disabled={
														index > 0 && !avancesData[index - 1].fechaFinish
													}
												/>
											</td>
											<td>
												<DatePicker
													label="Fecha Término"
													value={
														avance.fechaFinish
															? dayjs(avance.fechaFinish)
															: null
													}
													onChange={(newValue) =>
														handleDateChange(index, "fechaFinish", newValue)
													}
													renderInput={(params) => <TextField {...params} />}
													minDate={
														avance.fechaInit
															? dayjs(avance.fechaInit)
															: dayjs(fechaInicioPadre)
													}
													maxDate={dayjs(fechaLimitePadre)}
													disabled={!avance.fechaInit}
												/>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</LocalizationProvider>
					) : (
						<p>Selecciona un numero de avances</p>
					)}
					{error && (
						<Typography color="error" style={{ marginTop: "10px" }}>
							{error}
						</Typography>
					)}
					<div
						style={{ justifyContent: "flex-end", display: "flex", gap: "10px" }}
					>
						<Button
							variant="text"
							onClick={() => {
								closePop(false);
							}}
						>
							Volver
						</Button>
						<Button
							variant="contained"
							color="primary"
							onClick={handleSave}
							disabled={isSaveDisabled}
						>
							Guardar
						</Button>
					</div>
				</ProgressContainerLayout>
			</PopUpContainerProgress>
		</OverlayProgress>
	);
};

export default PopUpDatesAndProgress;
