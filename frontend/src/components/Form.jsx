import { useState, useContext } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, RFRESH_TOKEN } from "../constants";
import { ThemeContext } from "../App";
import '../styles/Form.css';

function Form ({route, method}){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);
    const name = method === "login"? "Welcome Back" : "Create Account";
    const subtitle = method === "login" ? "Sign in to continue to your notes" : "Start your note-taking journey";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await api.post(route, { username, password })
            if(method === 'login'){
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(RFRESH_TOKEN, res.data.refresh);
                navigate("/");
            }else {
                navigate("/login");
            }
        } catch (error) {
            setError(error.response?.data?.detail || "An error occurred. Please try again.");
        }finally{
            setLoading(false);
        }

    }
    return(
        <div className="form-page">
            <button 
                className="theme-toggle"
                onClick={() => setIsDarkMode(!isDarkMode)}
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
                {isDarkMode ? '🌞' : '🌙'}
            </button>

            <div className="form-container">
                <h1 className="form-title">{name}</h1>
                <p className="form-subtitle">{subtitle}</p>

                {error && (
                    <div className="error-message">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="username">Username</label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                id="username"
                                className="form-input"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                required
                                autoComplete="username"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Password</label>
                        <div className="input-wrapper">
                            <input
                                type="password"
                                id="password"
                                className="form-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                autoComplete="current-password"
                            />
                        </div>
                    </div>

                    <button 
                        className={`form-button ${loading ? 'loading' : ''}`} 
                        type="submit" 
                        disabled={loading}
                    >
                        <span>{loading ? 'Please wait...' : method === 'login' ? 'Sign In' : 'Create Account'}</span>
                        {!loading && (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                    </button>

                    <div className="auth-redirect">
                        {method === 'login' 
                            ? "Don't have an account? " 
                            : "Already have an account? "
                        }
                        <span 
                            onClick={() => navigate(method === 'login' ? '/register' : '/login')}
                            className="auth-link"
                        >
                            {method === 'login' ? 'Sign up' : 'Sign in'}
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Form;

