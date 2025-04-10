import COLORS from "../constants/colors/COLORS";

// Definimos los temas disponibles usando colores ya existentes en tu aplicación
const THEMES = {
  // Tema UNCP - verde
  uncp: {
    PRIMARY: "#006600", // Verde principal
    SECONDARY: "#FFB500", // Dorado/amarillo secundario
    NAVBAR: "#006600", // Verde oscuro para navbar
  },
  // Tema actual - azul
  blue: {
    PRIMARY: "#1c8adb", // Azul actual
    SECONDARY: "#DBEDFA", // Azul claro actual
    NAVBAR: "#1c8adb", // Azul oscuro actual para navbar
  },
  // Tema oscuro - usando ONYX de COLORS
  dark: {
    PRIMARY: COLORS.ONYX, // "#403F4C"
    SECONDARY: COLORS.GRAY, // "#61677a" 
    NAVBAR: COLORS.DARK_BLUE, // "#3F3D56"
  }
};

// Obtener el tema desde el ambiente
// El valor será proporcionado por cross-env a través de import.meta.env.VITE_APP_THEME
const themeFromEnv = import.meta.env.VITE_APP_THEME || '';

// Obtener el tema desde la variable THEME (usada por cross-env)
const currentTheme = import.meta.env.THEME || themeFromEnv || 'blue';

console.log(`Tema actual: ${currentTheme}`);

// Seleccionar el tema activo o usar 'blue' como fallback
const ACTIVE_THEME = THEMES[currentTheme] || THEMES.blue;

// Exportar los colores del tema activo
export const PRINCIPAL_COLOR_CONF = ACTIVE_THEME.PRIMARY;
export const SECONDARY_COLOR_CONF = ACTIVE_THEME.SECONDARY;
export const NAVBAR_PRINCIPAL_COLOR_CONF = ACTIVE_THEME.NAVBAR;