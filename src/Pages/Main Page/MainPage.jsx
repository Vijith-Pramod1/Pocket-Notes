import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './MainPage.css';
import image from '../../assets/image-removebg-preview 1.png';
import NotesPage from '../Notes Page/NotesPage';

// Set the root element for the Modal component
Modal.setAppElement('#root');

// MainPage Component
const MainPage = () => {
  // State variables
  const [showPopup, setShowPopup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [showLeftSection, setShowLeftSection] = useState(true);

  // Effect for handling window resize and retrieving groups from local storage
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    const storedGroups = JSON.parse(localStorage.getItem('groups')) || [];
    setGroups(storedGroups.map(group => ({
      ...group,
      notes: JSON.parse(localStorage.getItem(group.name)) || [],
    })));

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Function to generate initials from group name
  const generateInitials = (groupName) => {
    const words = groupName.split(' ');
    let initials = '';
    if (words.length === 1) {
      initials = words[0].slice(0, 1).toUpperCase();
    } else if (words.length === 2) {
      initials = words.map(word => word.slice(0, 1).toUpperCase()).join('');
    } else {
      initials = words.slice(0, 2).map(word => word.slice(0, 1).toUpperCase()).join('');
    }
    return initials;
  };

  // Event handler for group click
  const handleGroupClick = (group) => {
    if (window.innerWidth <= 768) {
      setSelectedGroup(group);
      setShowLeftSection(false);
    } else {
      setSelectedGroup(group);
    }
  };

  // Event handler for adding a group
  const handleAddGroup = () => {
    setShowPopup(true);
  };

  // Event handler for creating a group
  const handleCreateGroup = () => {
    if (groupName.trim() === '') {
      setShowWarning('Group name is not assigned');
      return;
    }

    const isGroupExists = groups.some(group => group.name.toLowerCase() === groupName.toLowerCase());
    if (isGroupExists) {
      setShowWarning('Group name must not be same');
      return;
    }

    const newGroup = { name: groupName, color: selectedColor, initials: generateInitials(groupName), notes: [] };
    const updatedGroups = [...groups, newGroup];
    setGroups(updatedGroups);
    localStorage.setItem('groups', JSON.stringify(updatedGroups));
    setShowPopup(false);
    setGroupName('');
    setSelectedColor('');
    setShowWarning(false);
  };

  // Color options for selecting group color
  const colorOptions = ['#B38BFA', '#FF79F2', '#43E6FC', '#F19576', '#0047FF', '#6691FF'];

  // Event handler for back button click
  const handleBackButtonClick = () => {
    setShowLeftSection(true);
    setSelectedGroup(null);
  };

  // Return JSX
  return (
    <div className="app-container">
      {/* Left section */}
      {screenWidth <= 768 ? (
        <div className="left-section" style={{ display: showLeftSection ? 'block' : 'none' }}>
          <h1>POCKET NOTES</h1>
          {groups.map((group, index) => (
            <div
              key={index}
              className="group-details"
              onClick={() => handleGroupClick(group)}
            >
              <div className="group-icon" style={{ backgroundColor: group.color }}>
                {group.initials}
              </div>
              <span>{group.name}</span>
            </div>
          ))}
          <button className="add-group-button" onClick={handleAddGroup}>+</button>
        </div>
      ) : (
        <div className={`left-section ${selectedGroup ? 'hidden' : ''}`}>
          <h1>POCKET NOTES</h1>
          {groups.map((group, index) => (
            <div
              key={index}
              className="group-details"
              onClick={() => handleGroupClick(group)}
            >
              <div className="group-icon" style={{ backgroundColor: group.color }}>
                {group.initials}
              </div>
              <span>{group.name}</span>
            </div>
          ))}
          <button className="add-group-button" onClick={handleAddGroup}>+</button>
        </div>
      )}

      {/* Right section */}
      <div className={`right-section1 ${selectedGroup && screenWidth <= 768 ? 'notes-visible' : ''}`}>
        {selectedGroup ? (
          <NotesPage
            group={selectedGroup}
            handleBackButtonClick={handleBackButtonClick}
          />
        ) : (
          <div>
            <img src={image} alt="Pocket Notes" />
            <h1>Pocket Notes</h1>
            <p>
              Send and receive messages without keeping your phone online. <br />Use Pocket
              Notes on up to 4 linked devices and 1 mobile phone
            </p>
            <h6>end-to-end encrypted</h6>
          </div>
        )}
      </div>

      {/* Modal for adding a group */}
      <Modal
        isOpen={showPopup}
        onRequestClose={() => setShowPopup(false)}
        className="popup"
        overlayClassName="popup-background"
      >
        <p>Create New Group</p>
        <div className="input-container">
          <label htmlFor="groupName">Group Name</label>
          <input
            type="text"
            id="groupName"
            value={groupName}
            placeholder="Enter group name"
            onChange={(e) => setGroupName(e.target.value)}
          />
        </div>
        <div className="color-options">
          <label>Choose Color</label>
          <div className="color-circles">
            {colorOptions.map((color, index) => (
              <div
                key={index}
                className={`color-circle ${selectedColor === color ? 'selected' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              ></div>
            ))}
          </div>
        </div>
        <button className="create-group-btn" onClick={handleCreateGroup}>Create</button>
        {showWarning && <p className="warning">{showWarning}</p>}
      </Modal>
    </div>
  );
};

export default MainPage;
