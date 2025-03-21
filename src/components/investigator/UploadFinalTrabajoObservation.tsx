import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import {
	Button,
	Typography,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	DialogContentText,
} from "@mui/material";
import axios from "axios";

const UploadFinalTrabajoObservationPopup = ({
	open,
	onClose,
	observationId,
	onUploadSuccess,
}) => {
	const [selectedFile, setSelectedFile] = useState(null);
	const [uploadedFile, setUploadedFile] = useState(null);
	const maxSize = 50 * 1024 * 1024; // 50 MB

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		accept: {
			"application/x-rar-compressed": [],
			"application/vnd.rar": [],
			"application/zip": [],
			"application/x-zip-compressed": [],
			"multipart/x-zip": [],
			"application/x-7z-compressed": [],
			"application/x-tar": [],
			"application/gzip": [],
		},
		maxSize,
		multiple: false,
		onDrop: (acceptedFiles) => {
			if (acceptedFiles.length > 0) {
				setSelectedFile(acceptedFiles[0]);
			}
		},
		onDropRejected: (rejectedFiles) => {
			rejectedFiles.forEach((file) => {
				file.errors.forEach((error) => {
					console.error(
						`Error al subir el archivo: ${file.file.name} - ${error.message}`,
					);
				});
			});
		},
	});

	const handleUpload = () => {
		if (selectedFile) {
			const formData = new FormData();
			formData.append("file", selectedFile); // Asegúrate de que el nombre del campo sea "file"
			formData.append("observation_id", observationId); // Añade el ID de la observación

			axios
				.post("http://localhost:3000/uploadf/entrega-final-observacion-comprimido", formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				})
				.then((response) => {
					console.log("Archivo subido exitosamente:", response.data);
					setUploadedFile(selectedFile);
					setSelectedFile(null); // Reset the selected file after successful upload
					onClose(); // Cierra el popup después de la subida
					onUploadSuccess(); // Llama a la función de callback para actualizar el padre
				})
				.catch((error) => {
					console.error("Error al subir el archivo:", error);
				});
		}
	};

	const handleDelete = () => {
		setSelectedFile(null);
		setUploadedFile(null);
	};
	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle>Subir correcion de entrega final y turniting</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Subir tanto la imagen con el porcentaje de turnitin como el documento
					final. Ambos deben estar comprimidos en un solo archivo.
				</DialogContentText>
				{!selectedFile && !uploadedFile ? (
					<div
						{...getRootProps({ className: "dropzone" })}
						style={{
							border: "2px dashed #cccccc",
							padding: "20px",
							textAlign: "center",
							margin: "0 auto",
						}}
					>
						<input {...getInputProps()} />
						{isDragActive ? (
							<p>Suelta el archivo aquí...</p>
						) : (
							<p>
								Arrastra y suelta un archivo aquí, o haz clic para seleccionar
								un archivo
							</p>
						)}
						<Button
							variant="contained"
							color="primary"
							style={{ marginTop: "10px" }}
						>
							Seleccionar archivo
						</Button>
					</div>
				) : (
					<div style={{ textAlign: "center", marginTop: "20px" }}>
						<Typography variant="body1">
							Archivo seleccionado: {selectedFile?.name || uploadedFile?.name} -{" "}
							{(selectedFile?.size || uploadedFile?.size) /
								(1024 * 1024).toFixed(2)}{" "}
							MB
						</Typography>
						<Button
							variant="contained"
							color="secondary"
							style={{ marginTop: "10px" }}
							onClick={handleDelete}
						>
							Eliminar entrega
						</Button>
					</div>
				)}
				<Typography
					variant="body2"
					color="textSecondary"
					style={{ marginTop: "10px", textAlign: "center" }}
				>
					Solo se admiten archivos comprimidos (RAR, ZIP, 7Z, TAR, GZIP) de
					hasta 50 MB.
				</Typography>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="primary">
					Cancelar
				</Button>
				{selectedFile && (
					<Button
						variant="contained"
						color="secondary"
						onClick={handleUpload}
						style={{ marginTop: "10px" }}
						disabled={!selectedFile}
					>
						Confirmar subida
					</Button>
				)}
			</DialogActions>
		</Dialog>
	);
};

export default UploadFinalTrabajoObservationPopup;
