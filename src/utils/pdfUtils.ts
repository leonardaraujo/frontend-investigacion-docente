import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";
import { LOGO_IMAGES } from "../conf/IMAGES.conf";
import { ROLES } from "../constants/data/VariablesRoles";
import { DELIVERY_TYPES } from "../constants/data/VariablesDelivery";
import {
	DELIVERY_STATUS,
	OBSERVATION_STATUS,
	REVIEW_STATUS,
} from "../constants/data/VariableStatus";

// Función para obtener el nombre del estado de la entrega
const getDeliveryStatusName = (statusId) => {
	const status = DELIVERY_STATUS.find((s) => s.ID === statusId);
	return status ? status.ESTADO : "Desconocido";
};

// Función para obtener el nombre del estado de la revisión
const getReviewStatusName = (statusId) => {
	const status = REVIEW_STATUS.find((s) => s.ID === statusId);
	return status ? status.ESTADO : "Desconocido";
};

// Función para obtener el nombre del estado de la observación
const getObservationStatusName = (statusId) => {
	const status = OBSERVATION_STATUS.find((s) => s.ID === statusId);
	return status ? status.ESTADO : "Desconocido";
};

// Función para obtener el tipo de entrega
const getDeliveryTypeName = (typeId) => {
	const deliveryType = DELIVERY_TYPES.find((dt) => dt.id === typeId);
	return deliveryType ? deliveryType.tipo : "Desconocido";
};

export const generatePDF = async (
	entregas,
	selectedPeriodo,
	getStatusLabel,
	userData,
) => {
	// Crear un nuevo documento PDF
	const pdfDoc = await PDFDocument.create();

	// Obtener fuentes estándar
	const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
	const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

	// Función para agregar texto con saltos de línea automáticos
	const addWrappedText = async (
		text,
		x,
		fontSize = 12,
		font = helveticaFont,
		color = rgb(0, 0, 0),
		maxWidth = width - 2 * margin,
	) => {
		// Dividir el texto en palabras
		const words = text.split(" ");
		let currentLine = "";
		let currentWidth = 0;

		// Procesar cada palabra
		for (const word of words) {
			// Calcular el ancho de la palabra actual
			const wordWidth = font.widthOfTextAtSize(word + " ", fontSize);

			// Si añadir esta palabra excede el ancho máximo, añadir la línea actual y comenzar una nueva
			if (currentWidth + wordWidth > maxWidth) {
				// Añadir la línea actual
				currentPage.drawText(currentLine, {
					x: x,
					y: y,
					size: fontSize,
					font: font,
					color: color,
				});

				// Bajar a la siguiente línea
				y -= lineHeight;

				// Si estamos cerca del final de la página, crear una nueva
				if (y < 100) {
					currentPage = pdfDoc.addPage();
					y = height - 50;
					await addWatermark();
				}

				// Comenzar una nueva línea con la palabra actual
				currentLine = word + " ";
				currentWidth = wordWidth;
			} else {
				// Añadir la palabra a la línea actual
				currentLine += word + " ";
				currentWidth += wordWidth;
			}
		}

		// Añadir la última línea si no está vacía
		if (currentLine.trim() !== "") {
			currentPage.drawText(currentLine, {
				x: x,
				y: y,
				size: fontSize,
				font: font,
				color: color,
			});
			y -= lineHeight;
		}

		return y;
	};
	// Agregar una página
	let currentPage = pdfDoc.addPage();
	const { width, height } = currentPage.getSize();

	// Posición inicial para texto
	let y = height - 50;
	const margin = 50;
	const lineHeight = 15;

	let watermarkImage;

	try {
		const response = await fetch(LOGO_IMAGES.UNIVERSIDAD_DOC_WATERMARK_LOGO);
		const arrayBuffer = await response.arrayBuffer();
		watermarkImage = await pdfDoc.embedPng(new Uint8Array(arrayBuffer));
		F;
	} catch (error) {
		console.error("Error al cargar la imagen de marca de agua:", error);
	}

	// Función para agregar texto
	const addText = async (
		text,
		x,
		fontSize = 12,
		font = helveticaFont,
		color = rgb(0, 0, 0),
	) => {
		if (y < 100) {
			// Si estamos cerca del final de la página
			currentPage = pdfDoc.addPage();
			y = height - 50;
			await addWatermark(); // Agregar marca de agua en la nueva página
		}

		currentPage.drawText(text, {
			x: x,
			y: y,
			size: fontSize,
			font: font,
			color: color,
		});

		y -= lineHeight;
		return y;
	};

	// Función para agregar marca de agua
	const addWatermark = async () => {
		try {
			if (watermarkImage) {
				// Calcular dimensiones manteniendo la proporción y ajustando para transparencia
				const imgWidth = 200; // Ajusta según necesites
				const imgHeight =
					(imgWidth / watermarkImage.width) * watermarkImage.height;

				// Posicionar en el centro de la página
				const x = (width - imgWidth) / 2; // Centro horizontal
				const y = (height - imgHeight) / 2; // Centro vertical
				// Dibujar la imagen con transparencia
				currentPage.drawImage(watermarkImage, {
					x,
					y,
					width: imgWidth,
					height: imgHeight,
					opacity: 0.2, // Esto hace que la marca de agua sea semitransparente
				});
			} else {
				// Alternativa de texto si la imagen no está disponible
				currentPage.drawText("UNIVERSIDAD LOGO", {
					x: width / 2 - 180,
					y: height / 2,
					size: 30,
					font: helveticaFont,
					color: rgb(0.8, 0.8, 0.8), // Color gris claro
					opacity: 0.2,
					rotate: degrees(45), // 45 grados
				});
			}
		} catch (error) {
			console.error("Error al agregar marca de agua:", error);
		}
	};

	// Agregar marca de agua en la primera página
	await addWatermark();

	// Contar el número de proyectos por estado
	const proyectosEnProceso = entregas.filter(
		(project) => project.status_project_id === 1,
	).length;

	const proyectosTerminados = entregas.filter(
		(project) => project.status_project_id === 2,
	).length;

	const proyectosCancelados = entregas.filter(
		(project) => project.status_project_id === 3,
	).length;

	// Título del informe
	await addText("INFORME DE ESTADO DE PROYECTOS", margin, 18, helveticaBold);
	y -= 5; // Espacio adicional entre líneas del título
	await addText(
		"Instituto Especializado de Investigación",
		margin,
		18,
		helveticaBold,
	);
	y -= 5; // Espacio adicional entre líneas del título
	await addText(`PERIODO ${selectedPeriodo.value}`, margin, 18, helveticaBold);
	y -= 10; // Espacio adicional antes del subtítulo
	await addText(
		`Fecha de creación: ${new Date().toLocaleDateString()}`,
		margin,
		12,
	);
	y -= 20; // Espacio mayor antes de la siguiente sección
	// Resumen Ejecutivo
	await addText("1. Resumen Ejecutivo", margin, 14, helveticaBold);
	await addWrappedText(
		"Este informe presenta el estado actual de los proyectos de investigación del periodo seleccionado. " +
			"Incluye detalles de cada proyecto, sus entregas y revisiones.",
		margin,
		12,
	);
	y -= 10; // Espacio adicional

	// Estado General de los Proyectos
	await addText(
		"2. Estado General de los Proyectos",
		margin,
		14,
		helveticaBold,
	);
	await addText(
		`Número total de proyectos en proceso: ${proyectosEnProceso}`,
		margin,
		12,
	);
	await addText(
		`Número de proyectos terminados: ${proyectosTerminados}`,
		margin,
		12,
	);
	await addText(
		`Número de proyectos cancelados: ${proyectosCancelados}`,
		margin,
		12,
	);
	y -= 10; // Espacio adicional

	// Detalle de Proyectos
	await addText("3. Detalle de Proyectos", margin, 14, helveticaBold);

	// Para cada proyecto
	for (const project of entregas) {
		// Información del proyecto
		await addText(`Proyecto: ${project.name}`, margin, 12, helveticaBold);
		await addText(
			`Fecha de inicio: ${new Date(project.start_date).toLocaleDateString()}`,
			margin + 10,
			12,
		);
		await addText(
			`Fecha de finalización: ${new Date(project.finish_date).toLocaleDateString()}`,
			margin + 10,
			12,
		);
		await addText(
			`Estado actual: ${getStatusLabel(project.status_project_id)}`,
			margin + 10,
			12,
		);

		// Para cada usuario del proyecto
		for (const userProject of project.user_research_projects) {
			await addText(
				`Investigador: ${userProject.user.name} ${userProject.user.paternal_surname} ${userProject.user.maternal_surname}`,
				margin + 20,
				12,
				helveticaBold,
			);
			await addText(`Email: ${userProject.user.email}`, margin + 30, 11);

			// Ordenar las entregas por delivery_number de forma ascendente
			const sortedDeliveries = [...userProject.project_deliveries].sort(
				(a, b) => {
					// Primero ordenar por tipo de entrega (Avance [1] antes que Final [2])
					if (a.delivery_type_id !== b.delivery_type_id) {
						return a.delivery_type_id - b.delivery_type_id;
					}
					// Si son del mismo tipo, ordenar por número de entrega
					return a.delivery_number - b.delivery_number;
				},
			);

			// Para cada entrega del proyecto
			for (const delivery of sortedDeliveries) {
				const deliveryType = getDeliveryTypeName(delivery.delivery_type_id);
				const deliveryStatus = getDeliveryStatusName(
					delivery.delivery_status_id,
				);

				await addText(
					`${deliveryType} ${delivery.delivery_type_id === 1 ? delivery.delivery_number : ""}`,
					margin + 30,
					12,
					helveticaBold,
				);
				await addText(
					`Estado de la presentación: ${deliveryStatus}`,
					margin + 40,
					11,
				);
				await addText(
					`Periodo de entrega: Del ${new Date(delivery.start_date).toLocaleDateString()} al ${new Date(delivery.finish_date).toLocaleDateString()}`,
					margin + 40,
					11,
				);

				// Información del archivo subido (si existe)
				if (delivery.doc_file_route) {
					await addText(`Archivo subido: Sí`, margin + 40, 11);
					await addText(
						`Fecha de subida: ${new Date(delivery.doc_file_route.upload_date).toLocaleDateString()} ${new Date(delivery.doc_file_route.upload_date).toLocaleTimeString()}`,
						margin + 40,
						11,
					);
				} else {
					await addText(`Archivo subido: No`, margin + 40, 11);
				}

				// Información de la revisión (si existe)
				if (delivery.review) {
					await addText(`Revisión:`, margin + 40, 11, helveticaBold);
					await addText(
						`Estado: ${getReviewStatusName(delivery.review.status_review_id)}`,
						margin + 50,
						11,
					);
					await addText(
						`Fecha: ${new Date(delivery.review.review_date).toLocaleDateString()} ${new Date(delivery.review.review_date).toLocaleTimeString()}`,
						margin + 50,
						11,
					);
					await addWrappedText(
						`Comentarios del revisor: ${delivery.review.comments || "Sin comentarios"}`,
						margin + 50,
						11,
					);

					// Información de la observación (si existe)
					if (delivery.review.observation) {
						const observation = delivery.review.observation;
						await addText(`Observación:`, margin + 50, 11, helveticaBold);
						await addText(
							`Estado: ${getObservationStatusName(observation.status_observation_id)}`,
							margin + 60,
							11,
						);
						await addText(
							`Periodo para corrección: Del ${new Date(observation.start_date).toLocaleDateString()} al ${new Date(observation.finish_date).toLocaleDateString()}`,
							margin + 60,
							11,
						);
						await addWrappedText(
							`Comentarios: ${observation.comments || "Sin comentarios"}`,
							margin + 60,
							11,
						);

						// Información del archivo de corrección (si existe)
						if (observation.doc_file_route) {
							await addText(
								`Archivo de corrección subido: Sí`,
								margin + 60,
								11,
							);
							await addText(
								`Fecha de subida: ${new Date(observation.doc_file_route.upload_date).toLocaleDateString()} ${new Date(observation.doc_file_route.upload_date).toLocaleTimeString()}`,
								margin + 60,
								11,
							);
						} else {
							await addText(
								`Archivo de corrección subido: No`,
								margin + 60,
								11,
							);
						}
					} else {
						await addText(`Se presentó observación: No`, margin + 50, 11);
					}
				} else {
					await addText(`Revisión: No realizada`, margin + 40, 11);
				}

				// Espacio entre entregas
				y -= 5;
			}
			// Espacio entre investigadores
			y -= 10;
		}
		// Espacio entre proyectos
		y -= 15;
	}

	// Información del generador del informe
	await addText(
		"4. Información del generador del informe",
		margin,
		14,
		helveticaBold,
	);

	// Desestructurar userData para acceder fácilmente a sus propiedades
	const { fullName, email, rol_id } = userData;
	const userRole =
		ROLES.find((role) => role.id === rol_id)?.name || "Desconocido";

	await addText(`Nombre: ${fullName}`, margin, 12);
	await addText(`Email: ${email}`, margin, 12);
	await addText(
		`Rol : ${userRole} del Instituto Especializado de Investigación`,
		margin,
		12,
	);
	await addText(
		`Fecha de generación: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
		margin,
		12,
	);
	await addWrappedText(
		"Este informe ha sido generado automáticamente por el sistema de gestión de investigación docente.",
		margin,
		12,
		helveticaFont,
		rgb(0.5, 0.5, 0.5),
	);

	// Guardar el PDF como bytes
	const pdfBytes = await pdfDoc.save();

	// En un entorno de navegador, podrías descargar el PDF así:
	const blob = new Blob([pdfBytes], { type: "application/pdf" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = `informe_proyectos_${selectedPeriodo.label}_${new Date().toISOString().split("T")[0]}.pdf`;
	link.click();
};
