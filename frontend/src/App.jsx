import React, { createContext, useEffect, useState } from "react"
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import ProtectedRoutes from "./components/ProtectedRoutes"
import './styles/global.css'


export const ThemeContext = createContext(null);

function Logout() {
  localStorage.clear()
  return <Navigate to={"/login"} />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function ColorThemeSelector({ currentTheme, onThemeChange }) {
  const themes = [
    { name: 'blue', color: 'rgb(0, 210, 255)' },
    { name: 'purple', color: 'rgb(190, 75, 219)' },
    { name: 'green', color: 'rgb(72, 187, 120)' },
    { name: 'orange', color: 'rgb(237, 137, 54)' }
  ];

  return (
    <div className="theme-selector">
      {themes.map(theme => (
        <button
          key={theme.name}
          className={`color-option ${currentTheme === theme.name ? 'active' : ''}`}
          style={{ 
            background: `linear-gradient(45deg, 
              ${theme.color}88, 
              ${theme.color}aa
            )`,
            backdropFilter: 'blur(5px)'
          }}
          onClick={() => onThemeChange(theme.name)}
          aria-label={`Switch to ${theme.name} theme`}
        />
      ))}
    </div>
  );
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  const [colorTheme, setColorTheme] = useState(() => {
    const savedTheme = localStorage.getItem('colorTheme');
    return savedTheme || 'blue';
  });

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    document.body.dataset.theme = colorTheme;
    localStorage.setItem('colorTheme', colorTheme);
  }, [colorTheme]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode, colorTheme, setColorTheme }}>
      <BrowserRouter>
        <div className="background-elements"></div>
        <div className="app-wrapper">
          <button 
            className="theme-toggle neon-text"
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? '🌞' : '🌙'}
          </button>
          <ColorThemeSelector 
            currentTheme={colorTheme} 
            onThemeChange={setColorTheme}
          />
          <Routes>
            <Route path="/" element={
              <ProtectedRoutes>
                <Home />
              </ProtectedRoutes>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterAndLogout />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeContext.Provider>
  )
}

export default App
