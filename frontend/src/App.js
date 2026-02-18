import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./NavigationBar/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LandingPage from './landingpage/landingpage';
import ProtectedRoute from "./RouteProtection/ProtectedRoute.js";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />   {/* Navbar stays common on all pages */}
        <div className="page-content"> {/* ensures centering / navbar padding from App.css */}
          <Routes>
            <Route path="/" element={<Login />} />        {/* Default = Login */}
            <Route path="/register" element={<Register />} />
            <Route
              path="/landingpage"
              element={
                <ProtectedRoute>
                  <LandingPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
