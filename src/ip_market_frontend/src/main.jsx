import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Login from './pages/Login';

import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router";


import Register from './pages/Register';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
     
      
     
      {/* Protected routes */}
      
      <Route path="/" element={<App />}>
      <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Add more protected routes below if needed */}
     </Route>
    </>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>
);
