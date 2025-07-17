import React from 'react'
import { useState, useEffect, useContext } from 'react'
import api from '../api';
import Note from '../components/Note'
import { ThemeContext } from '../App';
import '../styles/Note.css'
import '../styles/CreateNote.css'

function Home() {
    const [notes, setNotes] = useState([]);
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);
    
    useEffect(() => {
        getNotes();
    }, [])

    const getNotes = async () => {
        try {
            const response = await api.get('/api/notes/');
            setNotes(response.data);
        } catch (err) {
            setError("Failed to load notes. Please try again.");
        }
    }

    const deleteNote = async (id) => {
        try {
            const response = await api.delete(`/api/notes/delete/${id}/`);
            if (response.status === 204) {
                await getNotes();
                setError('');
            }
        } catch (err) {
            setError("Failed to delete note. Please try again.");
        }
    }

    const createNote = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/api/notes/', { content, title });
            if (response.status === 201) {
                await getNotes();
                setTitle('');
                setContent('');
                setError('');
            }
        } catch (err) {
            setError("Failed to create note. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="home-container">
            <div className="content-wrapper">
                <div className="create-note-container">
                    <div className="create-note-card">
                        <h2 className="create-note-title">Create New Note</h2>
                        
                        {error && (
                            <div className="create-note-error">
                                <svg className="error-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={createNote} className="create-note-form">
                            <div className="create-note-field">
                                <label className="create-note-label" htmlFor="title">Title</label>
                                <input 
                                    type="text" 
                                    id="title" 
                                    name="title" 
                                    required 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)} 
                                    placeholder="Enter note title..."
                                    className="create-note-input"
                                />
                            </div>

                            <div className="create-note-field">
                                <label className="create-note-label" htmlFor="content">Content</label>
                                <textarea 
                                    name="content" 
                                    id="content" 
                                    required 
                                    value={content} 
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Enter note content..."
                                    className="create-note-input create-note-textarea"
                                    rows="5"
                                ></textarea>
                            </div>

                            <button 
                                type="submit" 
                                className={`create-note-button ${loading ? 'loading' : ''}`}
                                disabled={loading}
                            >
                                <span className="button-text">{loading ? 'Creating...' : 'Create Note'}</span>
                                {!loading && (
                                    <svg className="button-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 5L19 12L12 19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                <main className="notes-section">
                    <div className="notes-header">
                        <h1 className="notes-title">Your Notes</h1>
                        <button 
                            className="theme-toggle"
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {isDarkMode ? '🌞' : '🌙'}
                        </button>
                    </div>
                    <div className="notes-grid">
                        {notes.map((note) => (
                            <Note 
                                key={note.id} 
                                note={note} 
                                handleDelete={() => deleteNote(note.id)}
                            />
                        ))}
                        {notes.length === 0 && (
                            <div className="notes-empty">
                                No notes yet. Create your first note!
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Home;
