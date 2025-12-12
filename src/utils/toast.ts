import toast from "react-hot-toast";

/**
 * Utilidades para mostrar notificaciones toast
 * Wrapper sobre react-hot-toast con configuración personalizada
 */

const defaultOptions = {
  duration: 3000,
  position: "top-center" as const,
  style: {
    borderRadius: "8px",
    fontSize: "14px",
  },
};

export const showToast = {
  /**
   * Muestra un mensaje de éxito
   */
  success: (message: string, options = {}) => {
    return toast.success(message, {
      ...defaultOptions,
      ...options,
      icon: "✅",
    });
  },

  /**
   * Muestra un mensaje de error
   */
  error: (message: string, options = {}) => {
    return toast.error(message, {
      ...defaultOptions,
      duration: 4000, // Errores se muestran un poco más tiempo
      ...options,
      icon: "❌",
    });
  },

  /**
   * Muestra un mensaje de advertencia
   */
  warning: (message: string, options = {}) => {
    return toast(message, {
      ...defaultOptions,
      ...options,
      icon: "⚠️",
      style: {
        ...defaultOptions.style,
        background: "#FFA500",
        color: "#fff",
      },
    });
  },

  /**
   * Muestra un mensaje informativo
   */
  info: (message: string, options = {}) => {
    return toast(message, {
      ...defaultOptions,
      ...options,
      icon: "ℹ️",
      style: {
        ...defaultOptions.style,
        background: "#3B82F6",
        color: "#fff",
      },
    });
  },

  /**
   * Muestra un toast de carga con promesa
   */
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    },
    options = {},
  ) => {
    return toast.promise(promise, messages, {
      ...defaultOptions,
      ...options,
    });
  },

  /**
   * Descarta un toast específico o todos
   */
  dismiss: (toastId?: string) => {
    toast.dismiss(toastId);
  },

  /**
   * Muestra un toast personalizado
   */
  custom: (message: string, options = {}) => {
    return toast(message, {
      ...defaultOptions,
      ...options,
    });
  },
};

/**
 * Mensajes de error comunes
 */
export const errorMessages = {
  // Competidores
  noCompetitors: "No hay competidores cargados",
  competitorRequired: "Debe seleccionar un competidor",
  invalidCompetitor: "Datos del competidor inválidos",

  // Categoría y Área
  categoryRequired: "Por favor ingrese una categoría",
  areaRequired: "Por favor seleccione un área",

  // Puntajes
  scoreRequired: "Todos los puntajes son requeridos",
  invalidScore: "Puntaje inválido",
  scoreOutOfRange: "El puntaje está fuera del rango permitido",

  // Excel
  excelLoadError: "Error al cargar el archivo Excel",
  invalidExcelFormat: "Formato de Excel inválido",
  excelTooLarge: "El archivo Excel es demasiado grande",

  // General
  unexpectedError: "Ocurrió un error inesperado",
  networkError: "Error de conexión",
  validationError: "Error de validación",
};

/**
 * Mensajes de éxito comunes
 */
export const successMessages = {
  // Competidores
  competitorAdded: "Competidor agregado exitosamente",
  competitorUpdated: "Competidor actualizado exitosamente",
  competitorDeleted: "Competidor eliminado exitosamente",

  // Puntajes
  scoreSaved: "Puntaje guardado exitosamente",
  scoresCalculated: "Puntajes calculados correctamente",

  // Excel
  excelLoaded: "Excel cargado exitosamente",

  // General
  changesSaved: "Cambios guardados exitosamente",
  dataExported: "Datos exportados exitosamente",
};
