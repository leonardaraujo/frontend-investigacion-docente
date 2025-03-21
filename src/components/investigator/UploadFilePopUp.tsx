import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import {
	Button,
	Typography,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from "@mui/material";
import axios from "axios";

const UploadFilePopUp = ({ open, onClose, delivery, onUploadSuccess }) => {
	const [selectedFile, setSelectedFile] = useState(null);
	const maxSize = 50 * 1024 * 1024; // 50 MB

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		accept: {
			"application/pdf": [],
		},
		maxSize,
		multiple: false,
		onDrop: (acceptedFiles) => {
			if (acceptedFiles.length > 0) {
				setSelectedFile(acceptedFiles[0]);
			}
		},
	});

	const handleUpload = () => {
		if (selectedFile) {
			const formData = new FormData();
			formData.append("file", selectedFile); // Asegúrate de que el nombre del campo sea "file"
			formData.append("project_delivery_id", delivery.id); // Añade el ID de la entrega

			axios
				.post("http://localhost:3000/upload/avance-pdf", formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				})
				.then((response) => {
					console.log("Archivo subido exitosamente:", response.data);
					setSelectedFile(null); // Reset the selected file after successful upload
					onClose(); // Cierra el popup después de la subida
					onUploadSuccess(); // Llama a la función de callback para actualizar el padre
				})
				.catch((error) => {
					console.error("Error al subir el archivo:", error);
				});
		}
	};

	const handleRemoveFile = () => {
		setSelectedFile(null);
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle>Subir avance</DialogTitle>
			<DialogContent>
				{!selectedFile ? (
					<div
						{...getRootProps({ className: "dropzone" })}
						style={{
							border: "2px dashed #cccccc",
							padding: "20px",
							textAlign: "center",
							margin: "0 auto",
						}}
					>
						<input data-testid="inputPDF" {...getInputProps()} />
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
					<div style={{ textAlign: "center" }}>
						<Typography variant="body1">
							Archivo seleccionado: {selectedFile.path} -{" "}
							{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
						</Typography>
						<Button
							variant="contained"
							color="secondary"
							onClick={handleRemoveFile}
							style={{ marginTop: "10px" }}
						>
							Eliminar archivo
						</Button>
					</div>
				)}
				{!selectedFile && (
					<Typography
						variant="body2"
						color="textSecondary"
						style={{ marginTop: "10px", textAlign: "center" }}
					>
						Solo se admiten archivos PDF de hasta 50 MB.
					</Typography>
				)}
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="primary">
					Cancelar
				</Button>
				<Button
					variant="contained"
					color="secondary"
					onClick={handleUpload}
					style={{ marginTop: "10px" }}
					disabled={!selectedFile}
				>
					Confirmar subida
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default UploadFilePopUp;
