// Save slots array
const SAVE_SLOTS = ['save1', 'save2', 'save3', 'save4'];

// Function to save game progress
function saveGame(slotIndex) {
    // Ensure we're using a valid save slot
    if (slotIndex < 0 || slotIndex >= SAVE_SLOTS.length) {
        console.error('Invalid save slot');
        return false;
    }

    const slotKey = SAVE_SLOTS[slotIndex];

    // Get current passage ID from the global variable or URL
    const currentPid = getCurrentPassageId();

    // Prepare save data
    const saveData = {
        pid: currentPid, // Already a string from getCurrentPassageId()
        timestamp: new Date().toISOString()
    };

    try {
        // Save to localStorage
        localStorage.setItem(slotKey, JSON.stringify(saveData));
        console.log(`Progress saved to slot: ${slotKey}`, saveData);
        updateSaveSlotUI(); // Update the UI to reflect the new save
        return true;
    } catch (error) {
        console.error('Error saving game:', error);
        return false;
    }
}

// Function to load game progress
function loadProgress(slotIndex) {
    // Make sure a valid save slot is being used
    if (slotIndex < 0 || slotIndex >= SAVE_SLOTS.length) {
        console.error('Invalid save slot');
        return false;
    }

    const slotKey = SAVE_SLOTS[slotIndex];
    
    try {
        const saveDataString = localStorage.getItem(slotKey);
        const saveData = saveDataString ? JSON.parse(saveDataString) : null;

        if (saveData && saveData.pid) {
            console.log(`Loading save from slot: ${slotKey}`, saveData);
            // Redirect to the story page with the saved `pid`
            window.location.href = `story.html?pid=${saveData.pid}`;
            return true;
        } else {
            console.log(`No save found in slot: ${slotKey}`);
            return false;
        }
    } catch (error) {
        console.error('Error loading save:', error);
        return false;
    }
}

// Function to delete a specific save
function deleteSave(slotIndex) {
    // Ensure we're using a valid save slot
    if (slotIndex < 0 || slotIndex >= SAVE_SLOTS.length) {
        console.error('Invalid save slot');
        return false;
    }

    const slotKey = SAVE_SLOTS[slotIndex];

    try {
        // Remove from localStorage
        localStorage.removeItem(slotKey);
        console.log(`Deleted save from slot: ${slotKey}`);
        updateSaveSlotUI(); // Update UI to reflect deleted save
        return true;
    } catch (error) {
        console.error('Error deleting save:', error);
        return false;
    }
}

// Function to get current passage ID - FIXED with consistent string handling
function getCurrentPassageId() {
    // Check if currentPassageId is in script.js
    if (typeof currentPassageId !=='undefined') {
        return String(currentPassageId); // Fixed so it's always a string, FINALLY!!
    }

    // Fallback to getting PID from URL
    const urlParams=new URLSearchParams(window.location.search);
    const pid=urlParams.get('pid') || '34'; // Like always, default to start passage if no pid is found
    return String(pid);
}

// Function to update save slot UI - ENHANCED with error handling
function updateSaveSlotUI() {
    SAVE_SLOTS.forEach((slotKey, index) => {
        const slotElement = document.getElementById(`save${index + 1}`);
        if (!slotElement) {
            console.warn(`Save slot element save${index + 1} not found in DOM`);
            return;
        }

        try {
            const saveDataString = localStorage.getItem(slotKey);
            const saveData = saveDataString ? JSON.parse(saveDataString) : null;

            if (saveData && saveData.pid) {
                // If save exists, show details
                const saveDate = new Date(saveData.timestamp);
                slotElement.textContent = `Save ${index + 1} - ${saveDate.toLocaleString()}`;
                slotElement.classList.add('used-save');
                slotElement.classList.remove('empty-save');
            } else {
                // If no save, show empty slot
                slotElement.textContent = `Save ${index + 1} - Empty`;
                slotElement.classList.remove('used-save');
                slotElement.classList.add('empty-save');
            }
        } catch (error) {
            console.error(`Error processing save slot ${slotKey}:`, error);
            // Reset to empty state on error
            slotElement.textContent = `Save ${index + 1} - Error`;
            slotElement.classList.remove('used-save');
            slotElement.classList.add('empty-save');
        }
    });
}

// Event Listeners for Save Slots - ENHANCED with better error handling
document.addEventListener('DOMContentLoaded', () => {
    console.log('Save system initializing...');
    
    // Initialize save slot UI
    updateSaveSlotUI();

    // Add event listeners to save slots
    SAVE_SLOTS.forEach((slotKey, index) => {
        const saveSlot = document.getElementById(`save${index + 1}`);
        const deleteButton = document.getElementById(`delete${index + 1}`);

        if (saveSlot) {
            saveSlot.addEventListener('click', () => {
                try {
                    const saveDataString = localStorage.getItem(slotKey);
                    const saveData = saveDataString ? JSON.parse(saveDataString) : null;
                    
                    if (saveData && saveData.pid) {
                        // Load existing save
                        console.log(`Attempting to load save ${index + 1}`);
                        loadProgress(index);
                    } else {
                        // Save current progress
                        console.log(`Attempting to save to slot ${index + 1}`);
                        const success = saveGame(index);
                        /* if (success) {
                            // Close popup after successful save
                            const savePopup = document.getElementById('save-popup');
                            if (savePopup) {
                                savePopup.style.display = 'none';
                            }
                        } */
                    }
                } catch (error) {
                    console.error(`Error handling save slot ${index + 1} click:`, error);
                }
            });
        } else {
            console.warn(`Save slot element save${index + 1} not found`);
        }

        if (deleteButton) {
            deleteButton.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent triggering save/load
                console.log(`Attempting to delete save ${index + 1}`);
                deleteSave(index);
            });
        } else {
            console.warn(`Delete button delete${index + 1} not found`);
        }
    });
    
    console.log('Save system initialized');
});

// Make functions available globally (no module exports needed)
// These functions are now available globally as window.saveGame, window.loadProgress, etc.
window.saveGame = saveGame;
window.loadProgress = loadProgress;
window.deleteSave = deleteSave;
window.updateSaveSlotUI = updateSaveSlotUI;