import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CandidateForm from '../components/CandidateForm';
import { Candidate } from '../types/candidate';
import { candidateService } from '../services/candidateService';

const AddCandidatePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const navigate = useNavigate();

  // Función para manejar el envío del formulario
  const handleSubmit = async (formData: Omit<Candidate, 'id' | 'cvPath' | 'recruitmentStages' | 'createdAt' | 'updatedAt'>, cv?: File) => {
    setIsLoading(true);
    setNotification(null);

    try {
      // Crear FormData para enviar datos incluido el archivo
      const data = new FormData();
      
      // Agregar datos básicos del candidato
      data.append('firstName', formData.firstName);
      data.append('lastName', formData.lastName);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      
      // Agregar educación y experiencia como JSON strings
      data.append('education', JSON.stringify(formData.education));
      data.append('experience', JSON.stringify(formData.experience));
      
      // Agregar CV si existe
      if (cv) {
        data.append('cv', cv);
      }
      
      // Enviar los datos al backend
      const response = await candidateService.addCandidate(data);
      
      if (response.success) {
        // Mostrar mensaje de éxito
        setNotification({
          type: 'success',
          message: response.message || 'Candidato añadido exitosamente'
        });
        
        // Opcionalmente redirigir después de un tiempo
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        // Mostrar mensaje de error
        setNotification({
          type: 'error',
          message: response.message || 'Error al añadir candidato'
        });
      }
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      setNotification({
        type: 'error',
        message: 'Error inesperado al procesar la solicitud'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem' }}>
        Sistema de Seguimiento de Talento
      </h1>
      
      {/* Botón para volver al dashboard */}
      <div style={{ marginBottom: '1rem' }}>
        <Link 
          to="/dashboard" 
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          &larr; Volver al Dashboard
        </Link>
      </div>
      
      {/* Notificación de éxito o error */}
      {notification && (
        <div 
          className={`alert ${notification.type === 'success' ? 'alert-success' : 'alert-danger'}`}
          style={{ marginBottom: '1.5rem' }}
        >
          {notification.message}
          <button 
            style={{ float: 'right', background: 'none', border: 'none', fontSize: '1.5rem' }}
            onClick={() => setNotification(null)}
          >
            &times;
          </button>
        </div>
      )}
      
      <CandidateForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default AddCandidatePage;
