import React, { useState } from 'react';
import { useForm, FormProvider, useFieldArray, Controller, SubmitHandler, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Candidate, Education, Experience } from '../types/candidate';

// Esquema de validación con Yup
const educationSchema = yup.object().shape({
  institution: yup.string().required('Institución es requerida'),
  title: yup.string().required('Título es requerido'),
  startDate: yup.string().required('Fecha de inicio es requerida').matches(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
  endDate: yup.string().required('Fecha de fin es requerida').matches(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
  degree: yup.string().optional().nullable(),
  fieldOfStudy: yup.string().optional().nullable(),
  description: yup.string().optional().nullable(),
});

const experienceSchema = yup.object().shape({
  company: yup.string().required('Compañía es requerida'),
  position: yup.string().required('Posición es requerida'),
  startDate: yup.string().required('Fecha de inicio es requerida').matches(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
  endDate: yup.string().required('Fecha de fin es requerida').matches(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
  description: yup.string().required('Descripción es requerida'),
  location: yup.string().optional().nullable(),
  currentJob: yup.boolean().optional(),
  achievements: yup.array().of(yup.string().required()).optional().nullable(),
  skills: yup.array().of(yup.string().required()).optional().nullable(),
});

const schema = yup.object().shape({
  firstName: yup.string().required('Nombre es requerido'),
  lastName: yup.string().required('Apellido es requerido'),
  email: yup.string().email('Email inválido').required('Email es requerido'),
  phone: yup.string().required('Teléfono es requerido'),
  street: yup.string().required('Calle es requerida'),
  city: yup.string().required('Ciudad es requerida'),
  state: yup.string().required('Estado/Provincia es requerida'),
  postalCode: yup.string().required('Código Postal es requerido'),
  country: yup.string().required('País es requerido'),
  status: yup.string().required().default('Nuevo'), // status es requerido y tiene default
  tags: yup.array().of(yup.string().required()).optional().nullable().default([]), // tags es opcional, nullable y tiene default
  education: yup.array().of(educationSchema).min(1, 'Debe haber al menos un registro de educación').required(),
  experience: yup.array().of(experienceSchema).min(1, 'Debe haber al menos un registro de experiencia').required(),
}).required();

// Definición de tipos para el formulario
export interface EducationFormData {
  institution: string;
  title: string;
  startDate: string;
  endDate: string;
  degree?: string | null;
  fieldOfStudy?: string | null;
  description?: string | null;
}

export interface ExperienceFormData {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  location?: string | null;
  currentJob?: boolean;
  achievements?: string[] | null;
  skills?: string[] | null;
}

export interface CandidateFormData extends FieldValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  status: string; 
  tags: string[] | null; // tags puede ser string[] o null para yup.default([])
  education: EducationFormData[];
  experience: ExperienceFormData[];
}

// Props del componente
interface CandidateFormProps {
  onSubmit: (data: Omit<Candidate, 'id' | 'cvPath' | 'recruitmentStages' | 'createdAt' | 'updatedAt'>, cv?: File) => void;
  isLoading?: boolean;
  initialData?: Partial<CandidateFormData>;
}

const CandidateForm: React.FC<CandidateFormProps> = ({ onSubmit, isLoading = false, initialData }) => {
  const [cv, setCv] = useState<File | undefined>(undefined);

  const methods = useForm<CandidateFormData>({
    resolver: yupResolver(schema), 
    defaultValues: initialData || {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      status: 'Nuevo',
      tags: [], // Coincide con yup.default([]) y CandidateFormData
      education: [{ institution: '', title: '', startDate: '', endDate: '', degree: null, fieldOfStudy: null, description: null }],
      experience: [{ company: '', position: '', startDate: '', endDate: '', description: '', location: null, currentJob: false, achievements: [], skills: [] }],
    },
  });

  const { register, handleSubmit, control, formState: { errors }, reset, setValue } = methods;

  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control,
    name: "education",
  });

  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
    control,
    name: "experience",
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setCv(event.target.files[0]);
    }
  };

  const handleFormSubmit: SubmitHandler<CandidateFormData> = (data) => {
    const dataForSubmit: Omit<Candidate, 'id' | 'cvPath' | 'recruitmentStages' | 'createdAt' | 'updatedAt'> = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      street: data.street,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      country: data.country,
      status: data.status, 
      tags: data.tags || [], // Asegurar que tags sea un array
      education: data.education.map(edu => ({
        ...edu,
        degree: edu.degree || undefined,
        fieldOfStudy: edu.fieldOfStudy || undefined,
        description: edu.description || undefined,
      })),
      experience: data.experience.map(exp => ({
        ...exp,
        location: exp.location || undefined,
        currentJob: exp.currentJob || false,
        achievements: exp.achievements || [],
        skills: exp.skills || [],
      })),
    };
    onSubmit(dataForSubmit, cv);
    reset(); 
    setCv(undefined);
  };

  const autofillForm = () => {
    const testData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '123456789',
      street: 'Calle Falsa 123',
      city: 'Ciudad Ejemplo',
      state: 'Provincia Ejemplo',
      postalCode: '12345',
      country: 'País Ejemplo',
      status: 'Contactado',
      tags: ['developer', 'frontend'],
      education: [
        {
          institution: 'Universidad de Ejemplo',
          title: 'Ingeniero en Sistemas',
          startDate: '2015-01-01',
          endDate: '2020-01-01',
          degree: 'Grado',
          fieldOfStudy: 'Ingeniería de Software',
          description: 'Proyecto final sobre IA.'
        },
      ],
      experience: [
        {
          company: 'Empresa Tech',
          position: 'Desarrollador Frontend',
          startDate: '2020-06-01',
          endDate: '2023-05-31',
          description: 'Desarrollo de interfaces de usuario interactivas.',
          location: 'Ciudad Ejemplo',
          currentJob: false,
          achievements: ['Optimización de rendimiento del 20%', 'Liderazgo técnico en proyecto X'],
          skills: ['React', 'TypeScript', 'Node.js']
        },
      ],
    } as const; // Usar "as const" para que TypeScript infiera tipos más específicos para las claves

    // Usar setValue para cada campo
    (Object.keys(testData) as Array<keyof typeof testData>).forEach(key => {
        const value = testData[key];
        if (key === 'education' || key === 'experience' || key === 'tags') {
            // Para arrays, es mejor asegurarse de que el tipo coincida exactamente
            // o usar un enfoque más específico si setValue tiene problemas con la inferencia.
            if (key === 'education' && Array.isArray(value)) {
                setValue(key, value as EducationFormData[]);
            } else if (key === 'experience' && Array.isArray(value)) {
                setValue(key, value as ExperienceFormData[]);
            } else if (key === 'tags' && Array.isArray(value)) {
                setValue(key, value as string[] | null);
            }
        } else if (value !== undefined && typeof key === 'string') {
             // Asegurar que la clave sea un string y el valor no sea undefined
            setValue(key as any, value); // Usar 'as any' aquí puede ser una solución pragmática si los tipos son complejos
        }
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="form-container">
        <div className="flex justify-between items-center mb-6">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Añadir Nuevo Candidato</h2>
          <button type="button" onClick={autofillForm} className="btn btn-secondary">
            Autocompletar Datos de Prueba
          </button>
        </div>

        {/* Campos del Candidato */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="firstName" className="label">Nombre</label>
            <input id="firstName" {...register('firstName')} className="input" />
            {errors.firstName && <p className="error-message">{errors.firstName.message}</p>}
          </div>
          <div>
            <label htmlFor="lastName" className="label">Apellido</label>
            <input id="lastName" {...register('lastName')} className="input" />
            {errors.lastName && <p className="error-message">{errors.lastName.message}</p>}
          </div>
          <div>
            <label htmlFor="email" className="label">Email</label>
            <input id="email" type="email" {...register('email')} className="input" />
            {errors.email && <p className="error-message">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="phone" className="label">Teléfono</label>
            <input id="phone" {...register('phone')} className="input" />
            {errors.phone && <p className="error-message">{errors.phone.message}</p>}
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-2">Dirección</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="street" className="label">Calle</label>
            <input id="street" {...register('street')} className="input" />
            {errors.street && <p className="error-message">{errors.street.message}</p>}
          </div>
          <div>
            <label htmlFor="city" className="label">Ciudad</label>
            <input id="city" {...register('city')} className="input" />
            {errors.city && <p className="error-message">{errors.city.message}</p>}
          </div>
          <div>
            <label htmlFor="state" className="label">Estado/Provincia</label>
            <input id="state" {...register('state')} className="input" />
            {errors.state && <p className="error-message">{errors.state.message}</p>}
          </div>
          <div>
            <label htmlFor="postalCode" className="label">Código Postal</label>
            <input id="postalCode" {...register('postalCode')} className="input" />
            {errors.postalCode && <p className="error-message">{errors.postalCode.message}</p>}
          </div>
          <div>
            <label htmlFor="country" className="label">País</label>
            <input id="country" {...register('country')} className="input" />
            {errors.country && <p className="error-message">{errors.country.message}</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="status" className="label">Estado del Candidato</label>
            <select id="status" {...register('status')} className="input" defaultValue="Nuevo">
              <option value="Nuevo">Nuevo</option>
              <option value="Contactado">Contactado</option>
              <option value="Entrevistado">Entrevistado</option>
              <option value="Oferta">Oferta</option>
              <option value="Contratado">Contratado</option>
              <option value="Rechazado">Rechazado</option>
            </select>
            {errors.status && <p className="error-message">{errors.status.message}</p>}
          </div>
          <div>
            <label htmlFor="tags" className="label">Etiquetas (separadas por comas)</label>
            <Controller
              name="tags"
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <input 
                  id="tags"
                  type="text"
                  className="input"
                  value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                  onChange={(e) => field.onChange(e.target.value ? e.target.value.split(',').map(tag => tag.trim()) : [])}
                />
              )}
            />
            {errors.tags && <p className="error-message">{Array.isArray(errors.tags) ? errors.tags.map(e => e.message).join(', ') : errors.tags.message}</p>}
          </div>
        </div>

        {/* Sección de Educación */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Educación</h3>
          {educationFields.map((field, index) => (
            <div key={field.id} className="border p-4 mb-4 rounded">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`education.${index}.institution`} className="label">Institución</label>
                  <input id={`education.${index}.institution`} {...register(`education.${index}.institution`)} className="input" />
                  {errors.education?.[index]?.institution && <p className="error-message">{errors.education?.[index]?.institution?.message}</p>}
                </div>
                <div>
                  <label htmlFor={`education.${index}.title`} className="label">Título</label>
                  <input id={`education.${index}.title`} {...register(`education.${index}.title`)} className="input" />
                  {errors.education?.[index]?.title && <p className="error-message">{errors.education?.[index]?.title?.message}</p>}
                </div>
                <div>
                  <label htmlFor={`education.${index}.degree`} className="label">Grado (Opcional)</label>
                  <input id={`education.${index}.degree`} {...register(`education.${index}.degree`)} className="input" />
                </div>
                <div>
                  <label htmlFor={`education.${index}.fieldOfStudy`} className="label">Campo de Estudio (Opcional)</label>
                  <input id={`education.${index}.fieldOfStudy`} {...register(`education.${index}.fieldOfStudy`)} className="input" />
                </div>
                <div>
                  <label htmlFor={`education.${index}.startDate`} className="label">Fecha de Inicio</label>
                  <input id={`education.${index}.startDate`} type="date" {...register(`education.${index}.startDate`)} className="input" />
                  {errors.education?.[index]?.startDate && <p className="error-message">{errors.education?.[index]?.startDate?.message}</p>}
                </div>
                <div>
                  <label htmlFor={`education.${index}.endDate`} className="label">Fecha de Fin</label>
                  <input id={`education.${index}.endDate`} type="date" {...register(`education.${index}.endDate`)} className="input" />
                  {errors.education?.[index]?.endDate && <p className="error-message">{errors.education?.[index]?.endDate?.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <label htmlFor={`education.${index}.description`} className="label">Descripción (Opcional)</label>
                  <textarea id={`education.${index}.description`} {...register(`education.${index}.description`)} className="input" />
                </div>
              </div>
              <button type="button" onClick={() => removeEducation(index)} className="btn btn-danger mt-2">
                Eliminar Educación
              </button>
            </div>
          ))}
          <button type="button" onClick={() => appendEducation({ institution: '', title: '', startDate: '', endDate: '', degree: null, fieldOfStudy: null, description: null })} className="btn btn-secondary">
            Añadir Educación
          </button>
        </div>

        {/* Sección de Experiencia */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Experiencia Laboral</h3>
          {experienceFields.map((field, index) => (
            <div key={field.id} className="border p-4 mb-4 rounded">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`experience.${index}.company`} className="label">Compañía</label>
                  <input id={`experience.${index}.company`} {...register(`experience.${index}.company`)} className="input" />
                  {errors.experience?.[index]?.company && <p className="error-message">{errors.experience?.[index]?.company?.message}</p>}
                </div>
                <div>
                  <label htmlFor={`experience.${index}.position`} className="label">Posición</label>
                  <input id={`experience.${index}.position`} {...register(`experience.${index}.position`)} className="input" />
                  {errors.experience?.[index]?.position && <p className="error-message">{errors.experience?.[index]?.position?.message}</p>}
                </div>
                <div>
                  <label htmlFor={`experience.${index}.location`} className="label">Ubicación (Opcional)</label>
                  <input id={`experience.${index}.location`} {...register(`experience.${index}.location`)} className="input" />
                </div>
                 <div>
                  <label htmlFor={`experience.${index}.startDate`} className="label">Fecha de Inicio</label>
                  <input id={`experience.${index}.startDate`} type="date" {...register(`experience.${index}.startDate`)} className="input" />
                  {errors.experience?.[index]?.startDate && <p className="error-message">{errors.experience?.[index]?.startDate?.message}</p>}
                </div>
                <div>
                  <label htmlFor={`experience.${index}.endDate`} className="label">Fecha de Fin</label>
                  <input id={`experience.${index}.endDate`} type="date" {...register(`experience.${index}.endDate`)} className="input" />
                  {errors.experience?.[index]?.endDate && <p className="error-message">{errors.experience?.[index]?.endDate?.message}</p>}
                </div>
                <div className="flex items-center">
                  <Controller
                    name={`experience.${index}.currentJob`}
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                      <input 
                        id={`experience.${index}.currentJob`}
                        type="checkbox" 
                        onChange={(e) => field.onChange(e.target.checked)} 
                        checked={!!field.value} // Asegurar que el valor sea booleano
                        className="mr-2"
                      />
                    )}
                  />
                  <label htmlFor={`experience.${index}.currentJob`} className="label mb-0">Trabajo Actual</label>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor={`experience.${index}.description`} className="label">Descripción</label>
                  <textarea id={`experience.${index}.description`} {...register(`experience.${index}.description`)} className="input" />
                  {errors.experience?.[index]?.description && <p className="error-message">{errors.experience?.[index]?.description?.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <label htmlFor={`experience.${index}.achievements`} className="label">Logros (separados por comas, opcional)</label>
                  <Controller
                    name={`experience.${index}.achievements`}
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => (
                      <input 
                        id={`experience.${index}.achievements`}
                        type="text"
                        className="input"
                        value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                        onChange={(e) => field.onChange(e.target.value ? e.target.value.split(',').map(ach => ach.trim()) : [])}
                      />
                    )}
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor={`experience.${index}.skills`} className="label">Habilidades (separadas por comas, opcional)</label>
                  <Controller
                    name={`experience.${index}.skills`}
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => (
                      <input 
                        id={`experience.${index}.skills`}
                        type="text"
                        className="input"
                        value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                        onChange={(e) => field.onChange(e.target.value ? e.target.value.split(',').map(skill => skill.trim()) : [])}
                      />
                    )}
                  />
                </div>
              </div>
              <button type="button" onClick={() => removeExperience(index)} className="btn btn-danger mt-2">
                Eliminar Experiencia
              </button>
            </div>
          ))}
          <button type="button" onClick={() => appendExperience({ company: '', position: '', startDate: '', endDate: '', description: '', location: null, currentJob: false, achievements: [], skills: []})} className="btn btn-secondary">
            Añadir Experiencia
          </button>
        </div>

        {/* Campo de CV */}
        <div className="mb-4">
          <label htmlFor="cv" className="label">CV (PDF o DOCX)</label>
          <input 
            id="cv" 
            type="file" 
            onChange={handleFileChange} 
            className="input"
            accept=".pdf,.doc,.docx"
          />
        </div>

        <button type="submit" disabled={isLoading} className="btn btn-primary w-full">
          {isLoading ? 'Enviando...' : 'Añadir Candidato'}
        </button>
      </form>
    </FormProvider>
  );
};

export default CandidateForm;

// Estilos CSS (puedes moverlos a un archivo .css si prefieres)
const styles = `
.form-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #f9fafb;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  box-sizing: border-box; /* Asegura que padding no aumente el tamaño total */
}

.input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.btn-primary {
  background-color: #2563eb;
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #1d4ed8;
}

.btn-primary:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
  border: none;
  margin-right: 0.5rem; /* Para espaciar botones */
}

.btn-secondary:hover {
  background-color: #4b5563;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
  border: none;
}

.btn-danger:hover {
  background-color: #dc2626;
}

/* Grid and Flex utilities (si no usas TailwindCSS, necesitarás definirlos) */
.grid { display: grid; }
.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.gap-4 { gap: 1rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-4 { margin-bottom: 1rem; }
.mb-6 { margin-bottom: 1.5rem; }
.p-4 { padding: 1rem; }
.border { border-width: 1px; border-style: solid; border-color: #e5e7eb; }
.rounded { border-radius: 0.25rem; }
.md\:col-span-2 {
    /* Esto es para Tailwind, necesitarías media queries para CSS puro */
}
.flex { display: flex; }
.justify-between { justify-content: space-between; }
.items-center { align-items: center; }
.text-lg { font-size: 1.125rem; }
.font-semibold { font-weight: 600; }
.w-full { width: 100%; }
.mr-2 { margin-right: 0.5rem; }

/* Estilos para el título del formulario */
.form-title {
    font-size: 1.875rem; /* Equivalente a text-2xl en Tailwind */
    font-weight: bold;
    margin-bottom: 1.5rem; /* Equivalente a mb-6 en Tailwind */
    color: #1f2937; /* Un color oscuro para el texto */
}

/* Estilos para los encabezados de sección */
.section-title {
    font-size: 1.25rem; /* Equivalente a text-xl en Tailwind */
    font-weight: 600; /* semibold */
    margin-top: 1.5rem; /* mb-6 */
    margin-bottom: 1rem; /* mb-4 */
    padding-bottom: 0.5rem; /* pb-2 */
    border-bottom: 1px solid #e5e7eb; /* border-b */
    color: #374151;
}

`;

// Inyectar estilos en el head del documento (solo para demostración)
// En una aplicación real, esto iría en un archivo CSS importado.
if (typeof window !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}
