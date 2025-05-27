import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { candidateService } from '../services/candidateService';
import { Candidate } from '../types/candidate'; // Asegúrate que la ruta sea correcta

const CandidateDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      candidateService.getCandidateById(id)
        .then(apiResponse => { // Renamed for clarity
          if (apiResponse.success && apiResponse.data) {
            // Based on console.log, apiResponse.data is likely { success: true, data: CandidateActualData }
            // So we try to extract the inner 'data' property.
            const actualCandidateData = (apiResponse.data as any).data;
            
            if (typeof actualCandidateData === 'object' && actualCandidateData !== null) {
              setCandidate(actualCandidateData); // actualCandidateData should be of type Candidate
            } else {
              // Fallback or error: if apiResponse.data was not the expected wrapper, 
              // or if the inner .data was not an object.
              // If apiResponse.data itself might be the candidate (e.g. if backend is inconsistent or was fixed)
              if (typeof apiResponse.data === 'object' && 'firstName' in apiResponse.data) {
                setCandidate(apiResponse.data as Candidate);
              } else {
                console.error('Could not extract actual candidate data from:', apiResponse.data);
                setError('Failed to parse candidate details from response.');
              }
            }
          } else {
            setError(apiResponse.message || 'Failed to fetch candidate details');
          }
          setLoading(false);
        })
        .catch(err => {
          setError('An error occurred while fetching candidate details.');
          setLoading(false);
          console.error(err);
        });
    }
  }, [id]);

  if (loading) {
    return <div className="container mt-5"><p>Loading candidate details...</p></div>;
  }

  if (error) {
    return <div className="container mt-5"><p className="text-danger">{error}</p></div>;
  }

  if (!candidate) {
    return <div /* className="container mt-5" */><p>Candidate not found (after load attempt).</p></div>;
  }

  console.log('Candidate data in render:', JSON.stringify(candidate, null, 2));

  const fullAddress = [
    candidate.street,
    candidate.city,
    candidate.state,
    candidate.postalCode,
    candidate.country,
  ].filter(Boolean).join(', ');

  return (
    <div className="container mt-5 mb-5">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h2 className="mb-0">{candidate.firstName} {candidate.lastName}</h2>
          <Link to="/dashboard" className="btn btn-light btn-sm">
            Back to Dashboard
          </Link>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-6">
              <p><strong>Email:</strong> {candidate.email}</p>
              <p><strong>Phone:</strong> {candidate.phone || 'N/A'}</p>
              <p><strong>Status:</strong> <span className={`badge bg-${candidate.status === 'Hired' ? 'success' : 'secondary'}`}>{candidate.status}</span></p>
            </div>
            <div className="col-md-6">
              <p><strong>Address:</strong> {fullAddress || 'N/A'}</p>
              {candidate.cvFilePath && (
                <p>
                  <strong>CV:</strong>{' '}
                  <a href={`http://localhost:3001/${candidate.cvFilePath}`} target="_blank" rel="noopener noreferrer">
                    View CV
                  </a>
                </p>
              )}
            </div>
          </div>

          {candidate.education && candidate.education.length > 0 && (
            <>
              <hr />
              <h4>Education</h4>
              {candidate.education.map((edu, index) => (
                <div key={edu.id || index} className="mb-2 p-2 border rounded">
                  <p><strong>Institution:</strong> {edu.institution}</p>
                  <p><strong>Degree:</strong> {edu.degree}</p>
                  <p><strong>Field of Study:</strong> {edu.fieldOfStudy || 'N/A'}</p>
                  <p><strong>Graduation Date:</strong> {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : 'N/A'}</p>
                  {edu.description && <p><em>{edu.description}</em></p>}
                </div>
              ))}
            </>
          )}

          {candidate.experience && candidate.experience.length > 0 && (
            <>
              <hr />
              <h4>Experience</h4>
              {candidate.experience.map((exp, index) => (
                <div key={exp.id || index} className="mb-2 p-2 border rounded">
                  <p><strong>Company:</strong> {exp.company}</p>
                  <p><strong>Position:</strong> {exp.position}</p>
                  <p><strong>Location:</strong> {exp.location || 'N/A'}</p>
                  <p><strong>Dates:</strong> {new Date(exp.startDate).toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : (exp.currentJob ? 'Present' : 'N/A')}</p>
                  {exp.description && <p><em>{exp.description}</em></p>}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <>
                      <strong>Achievements:</strong>
                      <ul>
                        {exp.achievements.map((ach, achIndex) => (
                          <li key={achIndex}>{ach}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              ))}
            </>
          )}

          {/* Remove Skills section that was causing an error, skills are per experience 
          {candidate.skills && candidate.skills.length > 0 && (
            <>
              <hr />
              <h4>Skills</h4>
              <p>
                {candidate.skills.map((skill, index) => (
                  <span key={index} className="badge bg-info text-dark me-1 mb-1">{skill}</span>
                ))}
              </p>
            </>
          )}
          */}
          
          {candidate.tags && candidate.tags.length > 0 && (
            <>
              <hr />
              <h4>Tags</h4>
              <p>
                {candidate.tags.map((tag, index) => (
                  <span key={index} className="badge bg-light text-dark me-1 mb-1">{tag}</span>
                ))}
              </p>
            </>
          )}

          {candidate.recruitmentStages && candidate.recruitmentStages.length > 0 && (
            <>
              <hr />
              <h4>Recruitment Process</h4>
              {candidate.recruitmentStages.map((stage, index) => (
                <div key={stage.id || index} className="mb-2 p-2 border rounded">
                  <p><strong>Stage:</strong> {stage.stageName}</p>
                  <p><strong>Date:</strong> {new Date(stage.date).toLocaleString()}</p>
                  <p><strong>Notes:</strong> {stage.notes || 'N/A'}</p>
                  <p><strong>Status:</strong> {stage.status}</p>
                </div>
              ))}
            </>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default CandidateDetailPage;
