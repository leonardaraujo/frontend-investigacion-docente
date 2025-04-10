// Archivo de configuración para imágenes usadas en la aplicación
import UncpLogo from "../assets/images/uncp_logo.webp";
import UniversidadGPTLogo from "../assets/images/universidad_gpt_2_white.png";
import UncpLogoPNG from "../assets/images/uncp_logo_png.png";
import UniversidadGPTLogoPNGBlack from "../assets/images/universidad_gpt_2_black.png";
// Logos institucionales

// Obtener el tema seleccionado desde el entorno (mismo que usa COLORS.conf.ts)
const themeFromEnv = import.meta.env.THEME || "blue";

// Definir logos por tema
const THEME_LOGOS = {
	uncp: {
		UNIVERSIDAD_LOGO: UncpLogo,
		UNIVERSIDAD_LOGO_LOGIN: UncpLogo,
		UNIVERSIDAD_DOC_WATERMARK_LOGO: UncpLogoPNG,
	},
	blue: {
		UNIVERSIDAD_LOGO: UniversidadGPTLogo,
		UNIVERSIDAD_LOGO_LOGIN: UniversidadGPTLogoPNGBlack,
		UNIVERSIDAD_DOC_WATERMARK_LOGO: UniversidadGPTLogoPNGBlack,
	},
};
// Seleccionar logos del tema activo (o usar blue como fallback)
const ACTIVE_THEME_LOGOS = THEME_LOGOS[themeFromEnv] || THEME_LOGOS.blue;

export const LOGO_IMAGES = {
	// Logos principales
	UNIVERSIDAD_LOGO: ACTIVE_THEME_LOGOS.UNIVERSIDAD_LOGO,
	UNIVERSIDAD_LOGO_LOGIN: ACTIVE_THEME_LOGOS.UNIVERSIDAD_LOGO_LOGIN,
	UNIVERSIDAD_DOC_WATERMARK_LOGO:
		ACTIVE_THEME_LOGOS.UNIVERSIDAD_DOC_WATERMARK_LOGO,
	// Textos alternativos para accesibilidad
	ALT_TEXT:
		themeFromEnv === "uncp"
			? "Logo UNCP"
			: themeFromEnv === "blue"
				? "Logo Azul"
				: "Logo Alternativo",
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
