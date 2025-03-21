// Archivo de configuración para imágenes usadas en la aplicación
import UncpLogo from "../assets/images/uncp_logo.webp";
import UniversidadGPTLogo from "../assets/images/universidad_gpt_2_white.png";
import UncpLogoPNG from "../assets/images/uncp_logo_png.png";
import UniversidadGPTLogoPNGBlack from "../assets/images/universidad_gpt_2_black.png";
// Logos institucionales
export const LOGO_IMAGES = {
	UNCP_LOGO: UncpLogo,
	// Puedes agregar variantes del logo aquí
	UNIVERSIDAD_GPT_LOGO: UniversidadGPTLogo,
	UNIVERSIDAD_LOGO: UniversidadGPTLogo,
	UNIVERSIDAD_LOGO_LOGIN: UniversidadGPTLogoPNGBlack,
	UNIVERSIDAD_DOC_WATERMARK_LOGO: UniversidadGPTLogoPNGBlack,    
};

// Configuración de estilos para logos
export const LOGO_STYLES = {
	DEFAULT: {
		width: "100px",
		alignSelf: "center",
		justifySelf: "center",
	},
	SMALL: {
		width: "50px",
		alignSelf: "center",
		justifySelf: "center",
	},
	LARGE: {
		width: "150px",
		alignSelf: "center",
		justifySelf: "center",
	},
};
