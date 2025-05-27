import axios from 'axios';
import { Candidate, ApiResponse } from '../types/candidate';

const API_URL = 'http://localhost:3010/api';

// Manejar errores de manera consistente
const handleApiError = (error: any): ApiResponse => {
  if (axios.isAxiosError(error)) {
    // Error específico de Axios (respuesta del servidor o problema de red)
    const status = error.response?.status;
    const serverMessage = error.response?.data?.message;

    if (status === 400) {
      return {
        success: false,
        message: serverMessage || 'Datos de candidato inválidos. Por favor revisa la información'
      };
    } else if (status === 401 || status === 403) {
      return {
        success: false,
        message: 'No tienes permisos para realizar esta acción'
      };
    } else if (status === 404) {
      return {
        success: false,
        message: 'El recurso solicitado no fue encontrado'
      };
    } else if (status === 413) {
      return {
        success: false,
        message: 'El archivo CV es demasiado grande. Debe ser menor a 5 MB'
      };
    } else if (status === 500) {
      return {
        success: false,
        message: 'Error en el servidor. Intenta de nuevo más tarde'
      };
    }

    // Error de red o respuesta desconocida
    return {
      success: false,
      message: error.message || 'Error de conexión con el servidor'
    };
  } else {
    // Error no relacionado con Axios
    return {
      success: false,
      message: error.message || 'Error inesperado al procesar la solicitud'
    };
  }
};

export const candidateService = {
  addCandidate: async (candidateData: FormData): Promise<ApiResponse> => {
    try {
      const response = await axios.post(`${API_URL}/candidates`, candidateData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        // Añadir timeout para evitar esperas indefinidas
        timeout: 30000
      });
      return {
        success: true,
        message: 'Candidato añadido exitosamente',
        data: response.data
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  getAllCandidates: async (): Promise<ApiResponse> => {
    try {
      const response = await axios.get(`${API_URL}/candidates`, {
        timeout: 10000
      });
      return {
        success: true,
        message: 'Candidatos obtenidos exitosamente',
        data: response.data
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },
  
  // Método para obtener un candidato específico por ID
  getCandidateById: async (id: string): Promise<ApiResponse> => {
    try {
      const response = await axios.get(`${API_URL}/candidates/${id}`, {
        timeout: 10000
      });
      return {
        success: true, 
        message: 'Candidato obtenido exitosamente',
        data: response.data
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  }
};
