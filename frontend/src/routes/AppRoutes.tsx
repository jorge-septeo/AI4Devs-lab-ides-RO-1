import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';
import AddCandidatePage from '../pages/AddCandidatePage';
import CandidateDetailPage from '../pages/CandidateDetailPage'; // Importar CandidateDetailPage

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/add-candidate" element={<AddCandidatePage />} />
        <Route path="/candidates/:id" element={<CandidateDetailPage />} /> {/* Añadir ruta para CandidateDetailPage */}
        {/* Aquí puedes añadir más rutas según sea necesario */}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
