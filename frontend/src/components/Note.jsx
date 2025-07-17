import React, { useState } from "react";
import "../styles/Note.css"


function Note({note, OnDelete}){
    const [isDeleting, setIsDeleting] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    
    const formattedDate = new Date(note.created_at).toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const handleDelete = async () => {
        setIsDeleting(true);
        await OnDelete(note.id);
    };
    
    return (
        <article className={`note-card ${isExpanded ? 'expanded' : ''}`}>
            <div className="note-content-wrapper" onClick={() => setIsExpanded(!isExpanded)}>
                <header className="note-header">
                    <div className="note-header-content">
                        <h3 className="note-title">{note.title}</h3>
                        <time className="note-date" dateTime={note.created_at}>
                            {formattedDate}
                        </time>
                    </div>
                    <button className="expand-button" aria-label={isExpanded ? 'Collapse note' : 'Expand note'}>
                        <svg className="expand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d={isExpanded ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6"} strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </header>
                <div className="note-body">
                    <div className="note-content-container">
                        <p className="note-content">{note.content}</p>
                    </div>
                </div>
            </div>
            <footer className="note-footer">
                <button 
                    className={`delete-button ${isDeleting ? 'deleting' : ''}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDelete();
                    }}
                    disabled={isDeleting}
                    aria-label="Delete note"
                >
                    <span className="delete-text">Delete</span>
                    <svg className="delete-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </footer>
        </article>
    )
}

export default Note;