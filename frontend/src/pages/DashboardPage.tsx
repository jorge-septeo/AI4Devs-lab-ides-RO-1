import React, { useState, useEffect } from 'react';
import { candidateService } from '../services/candidateService';
import { Link } from 'react-router-dom';

interface CandidateListItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const DashboardPage: React.FC = () => {
  const [candidates, setCandidates] = useState<CandidateListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await candidateService.getAllCandidates();
        if (response.success && response.data && Array.isArray(response.data.data)) {
          setCandidates(response.data.data); // Corregido: acceder a response.data.data
        } else if (response.success && response.data && !Array.isArray(response.data.data)) {
          // Esto puede pasar si la API devuelve { success: true, data: { /* objeto no array */ } }
          // o si la API devuelve { success: true, data: null } y no hay candidatos
          console.warn("La API devolvió datos, pero no es un array:", response.data);
          setCandidates([]); // Establecer como array vacío si no hay datos o el formato es incorrecto
          // Considera si quieres mostrar un error específico aquí
          // setError(response.message || 'Los datos recibidos no tienen el formato esperado.');
        } else {
          setError(response.message || 'Error al cargar candidatos');
        }
      } catch (error) {
        setError('Error inesperado al cargar candidatos');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  return (
    <div className="container">
      <div className="flex justify-between" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Dashboard de Reclutador</h1>
        <Link 
          to="/add-candidate" 
          className="btn btn-success"
        >
          + Añadir Candidato
        </Link>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <p style={{ fontSize: '1.2rem' }}>Cargando candidatos...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">
          {error}
        </div>
      ) : candidates.length === 0 ? (
        <div className="alert" style={{ backgroundColor: '#fff3cd', color: '#856404', textAlign: 'center' }}>
          <p style={{ marginBottom: '1rem' }}>No hay candidatos registrados en el sistema.</p>
          <Link 
            to="/add-candidate" 
            className="btn" 
            style={{ backgroundColor: '#ffc107', color: 'white' }}
          >
            Añadir primer candidato
          </Link>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo Electrónico</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr key={candidate.id}>
                  <td>
                    {candidate.firstName} {candidate.lastName}
                  </td>
                  <td>{candidate.email}</td>
                  <td>{candidate.phone}</td>
                  <td>
                    <Link 
                      to={`/candidates/${candidate.id}`}
                    >
                      Ver detalle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
