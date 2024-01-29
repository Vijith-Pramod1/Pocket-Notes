import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './NotesPage.css';

// NotesPage Component
const NotesPage = ({ group: { name, color, initials }, handleBackButtonClick }) => {
  // State variables
  const [inputValue, setInputValue] = useState('');
  const [notes, setNotes] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // Load initial notes from localStorage
  const loadInitialNotes = () => {
    const savedNotes = JSON.parse(localStorage.getItem(name)) || [];
    setNotes(savedNotes);
  };

  // Effect for loading initial notes and handling window resize
  useEffect(() => {
    loadInitialNotes();

    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [name]);

  // Effect for saving notes to localStorage when notes state changes
  useEffect(() => {
    localStorage.setItem(name, JSON.stringify(notes));
  }, [name, notes]);

  // Event handler for input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setIsButtonDisabled(value.trim() === '');
  };

  // Event handler for form submission
  const handleSubmit = () => {
    if (inputValue.trim() !== '') {
      const currentDateTime = new Date().toLocaleString();
      const newNote = {
        content: inputValue,
        dateTime: currentDateTime,
      };
      setNotes([...notes, newNote]);
      setInputValue('');
      setIsButtonDisabled(true);
    }
  };

  // Event handler for key press (Enter) in textarea
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // Return JSX
  return (
    <div className="notes-page-container">
      <header className="notes-header">
        <div className="header-content">
          <div className="group-icon" style={{ backgroundColor: color }}>
            {initials}
          </div>
          <h2>{name}</h2>
          {screenWidth <= 768 && <button className="back-button" onClick={handleBackButtonClick}><b>{"<-"}</b> </button>}
        </div>
      </header>
      <div className="right-section">
        <div className="notes-container">
          <div className="notes-scroll">
            {notes.map((note, index) => (
              <div className="note-box" key={index}>
                <div className="note-content">
                  <p>{note.content}</p>
                  <p className="note-date">{note.dateTime}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="input-container2">
        <textarea
          placeholder="Enter your note..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
        <button
          onClick={handleSubmit}
          disabled={isButtonDisabled}
          className={isButtonDisabled ? 'disabled' : ''}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

// PropTypes for NotesPage Component
NotesPage.propTypes = {
  group: PropTypes.shape({
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    initials: PropTypes.string.isRequired,
  }).isRequired,
  handleBackButtonClick: PropTypes.func.isRequired,
};

export default NotesPage;
