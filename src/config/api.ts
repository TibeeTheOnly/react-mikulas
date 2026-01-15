// API Konfigurációs fájl
// Itt tudod beállítani a Backend API címét

export const config = {
  // A backend API base URL címe (NestJS)
  // Módosítsd ezt az értéket a saját backend címedre
  apiBaseUrl: 'http://localhost:3000',
  
  // API végpontok
  endpoints: {
    children: '/children',
    toys: '/toys',
    childToys: (childId: number, toyId: number) => `/children/${childId}/toys/${toyId}`,
  }
};

// Használat:
// import { config } from './config/api';
// fetch(`${config.apiBaseUrl}${config.endpoints.children}`);
