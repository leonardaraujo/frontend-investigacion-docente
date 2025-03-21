import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Button,
	TextField,
	Typography,
} from "@mui/material";
import Select from "react-select";
import axios from "axios";
import { OBSERVATION_STATUS } from "../../constants/data/VariableStatus";

const RevisarObservacion = ({
	open,
	onClose,
	observationId,
	deliveryId,
	onReviewSuccess,
	userId,
	researchProjectId,
}) => {
	const [selectedStatus, setSelectedStatus] = useState(null);
	const [comments, setComments] = useState("");

	useEffect(() => {
		if (!open) {
			setSelectedStatus(null);
			setComments("");
		}
	}, [open]);

	const handleStatusChange = (selectedOption) => {
		setSelectedStatus(selectedOption);
	};

	const handleCommentsChange = (event) => {
		setComments(event.target.value);
	};

	const handleReviewSubmit = () => {
		const reviewData = {
			observation_id: observationId,
			delivery_id: deliveryId,
			status_observation_id: selectedStatus.value,
			user_id: userId,
			comments,
			researchProjectId,
		};

		axios
			.post(
				"http://localhost:3000/review/update_observation_status",
				reviewData,
			)
			.then((response) => {
				console.log(
					"Estado de observación y revisión actualizados exitosamente:",
					response.data,
				);
				onReviewSuccess();
				onClose();
			})
			.catch((error) => {
				console.error(
					"Error al actualizar el estado de observación y crear la revisión:",
					error,
				);
			});
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle>Revisar Observación</DialogTitle>
			<DialogContent>
				<Typography variant="body1" gutterBottom>
					Seleccione el estado de la observación:
				</Typography>
				<div style={{ marginBottom: "20px" }}>
					<Select
						isSearchable={false}
						options={OBSERVATION_STATUS.filter((status) =>
							[2, 3, 4].includes(status.ID),
						).map((status) => ({
							value: status.ID,
							label: status.ESTADO,
						}))}
						value={selectedStatus}
						onChange={handleStatusChange}
						placeholder="Seleccione un estado"
					/>
				</div>
				<Typography variant="body1" gutterBottom>
					Comentarios:
				</Typography>
				<TextField
					multiline
					rows={4}
					value={comments}
					onChange={handleCommentsChange}
					variant="outlined"
					fullWidth
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="primary">
					Cancelar
				</Button>
				<Button
					onClick={handleReviewSubmit}
					color="secondary"
					variant="contained"
					disabled={!selectedStatus}
				>
					Aceptar
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default RevisarObservacion;
