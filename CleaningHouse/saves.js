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
    currentPid = String(pid) // Remeber that the PIDS ARE STRINGS


    // Prepare save data
    const saveData = {
        pid: currentPid,
        timestamp: new Date().toISOString()
    };

    try {
        // Save to localStorage
        localStorage.setItem(slotKey, JSON.stringify(saveData));
        console.log(`Progress saved to slot: ${slotKey}`);
        updateSaveSlotUI(); // Update UI to reflect new save
        return true;
    } catch (error) {
        console.error('Error saving game:', error);
        return false;
    }
}

// Function to load game progress
function loadProgress(slotIndex) {
    // Ensure we're using a valid save slot
    if (slotIndex < 0 || slotIndex >= SAVE_SLOTS.length) {
        console.error('Invalid save slot');
        return false;
    }

    const slotKey = SAVE_SLOTS[slotIndex];
    const saveData = JSON.parse(localStorage.getItem(slotKey));

    if (saveData && saveData.pid) {
        // Redirect to the story page with the saved `pid`
        window.location.href = `story.html?pid=${saveData.pid}`;
        return true;
    } else {
        console.log(`No save found in slot: ${slotKey}`);
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

// Function to get current passage ID
function getCurrentPassageId() {
    // Check if currentPassageId is defined in script.js
    if (typeof currentPassageId !== 'undefined') {
        return currentPassageId;
    }

    // Fallback to getting PID from URL
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('pid') || '34'; // Default to start passage if no PID found
}

// Function to update save slot UI
function updateSaveSlotUI() {
    // This assumes you have elements with IDs save1, save2, etc.
    SAVE_SLOTS.forEach((slotKey, index) => {
        const slotElement = document.getElementById(`save${index + 1}`);
        if (!slotElement) return;

        const saveData = JSON.parse(localStorage.getItem(slotKey));

        if (saveData) {
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
    });
}

// Event Listeners for Save Slots
document.addEventListener('DOMContentLoaded', () => {
    // Initialize save slot UI
    updateSaveSlotUI();

    // Add event listeners to save slots
    SAVE_SLOTS.forEach((slotKey, index) => {
        const saveSlot = document.getElementById(`save${index + 1}`);
        const deleteButton = document.getElementById(`delete${index + 1}`);

        if (saveSlot) {
            saveSlot.addEventListener('click', () => {
                const saveData = JSON.parse(localStorage.getItem(slotKey));
                if (saveData) {
                    // Load existing save
                    loadProgress(index);
                } else {
                    // Save current progress
                    saveGame(index);
                }
            });
        }

        if (deleteButton) {
            deleteButton.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent triggering save/load
                deleteSave(index);
            });
        }
    });
});

/*export {
    saveGame,
    loadProgress,
    deleteSave,
    updateSaveSlotUI
};*/