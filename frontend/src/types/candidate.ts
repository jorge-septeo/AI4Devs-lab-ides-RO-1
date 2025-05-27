export interface Education {
  id?: string; // Opcional, ya que el backend lo genera
  institution: string;
  title: string; // Título o Carrera
  degree?: string;
  fieldOfStudy?: string;
  startDate: string; // Considerar usar Date si se procesa antes del envío
  endDate: string;   // Considerar usar Date
  description?: string;
  // candidateId se maneja en el backend
}

export interface Experience {
  id?: string; // Opcional
  company: string;
  position: string;
  location?: string;
  startDate: string; // Considerar usar Date
  endDate: string;   // Considerar usar Date
  currentJob?: boolean;
  description: string;
  achievements?: string[];
  skills?: string[];
  // candidateId se maneja en el backend
}

export interface RecruitmentStage {
  id: string;
  stageName: string;
  notes?: string;
  date: string; // O Date
  status: string;
  candidateId: string;
  createdAt: string; // O Date
  updatedAt: string; // O Date
}

export interface Candidate {
  id?: string; // Opcional en el frontend, obligatorio en el backend (generado)
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Dirección estructurada (todos opcionales según schema.prisma)
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  
  cv?: File; // Para el upload en el frontend
  cvFilePath?: string; // Ruta del CV guardado (del backend)
  
  status?: string;
  tags?: string[];
  
  education: Education[];
  experience: Experience[];
  recruitmentStages?: RecruitmentStage[]; // Añadido para las etapas de reclutamiento
  
  // Estos campos son gestionados por el backend y pueden no ser necesarios en todos los formularios del frontend
  createdAt?: string; // O Date
  updatedAt?: string; // O Date
}

// Interfaz para la respuesta de la API, si es estándar
export interface ApiResponse<T = any> { // Hacerla genérica
  success: boolean;
  message: string;
  data?: T;
  error?: string; // Para mensajes de error más detallados
  statusCode?: number;
}
