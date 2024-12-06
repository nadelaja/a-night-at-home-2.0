// Integrated Script for Story Navigation and Save Mechanics

let gameData;
let currentPassageId;
const passageHistory = []; // Passage history array
const forwardHistory = []; // Tracks forward navigation
let backButtonUsed = false;
let fearLevel = 50; // Initial fear bar state

// Save and Load Helper Functions
const getSaveData = (slot) => localStorage.getItem(`saveSlot${slot}`);
const setSaveData = (slot, data) => localStorage.setItem(`saveSlot${slot}`, JSON.stringify(data));
const deleteSaveData = (slot) => localStorage.removeItem(`saveSlot${slot}`);

// Categorization for Fear Bar
const braveryPIDs = [15, 4, 16, 9, 20, 23, 24, 25, 26, 28, 12, 17, 18];
const fearPIDs = [14, 6, 13, 12, 21, 22, 27, 20];
const neutralityPIDs = [34, 9, 10, 19, 11];

// Event Listener for DOM Content Loaded
document.addEventListener("DOMContentLoaded", function () {
    const saveSlots = document.querySelectorAll(".saveSlot");
    const deleteButtons = document.querySelectorAll(".deleteBtn");

    // Fetch game data from JSON file
    fetch('A _Night_at_Home_JSON.json')
        .then(response => response.json())
        .then(data => {
            gameData = data.passages;
            console.log(gameData)

            // Check URL parameters first
            const urlParams = new URLSearchParams(window.location.search);
            const passageFromURL = urlParams.get('pid');

            // Use the URL parameter for a gate if it exists, otherwise use default "34"
            currentPassageId = passageFromURL || "34";
            renderPassage(currentPassageId);

            // Update UI for saves
            updateSaveSlots();
        });

    // Update Save Slots UI
    function updateSaveSlots() {
        saveSlots.forEach((slot, index) => {
            const saveData = getSaveData(index + 1);
            if (saveData) {
                slot.textContent = `Save ${index + 1} - Active`;
                slot.classList.remove("empty-save");
                slot.classList.add("active-save");
            } else {
                slot.textContent = `Save ${index + 1} - Empty`;
                slot.classList.remove("active-save");
                slot.classList.add("empty-save");
            }
        });
    }

    // Save Game State
    saveSlots.forEach((slot, index) => {
        slot.addEventListener("click", () => {
            const gameState = {
                currentPassageId: currentPassageId,
                passageHistory: passageHistory,
                forwardHistory: forwardHistory,
                fearLevel: fearLevel
            };

            setSaveData(index + 1, gameState);
            alert(`Game saved in slot ${index + 1}`);
            updateSaveSlots();
        });
    });

    // Load Game State
    saveSlots.forEach((slot, index) => {
        slot.addEventListener("dblclick", () => {
            const saveData = getSaveData(index + 1);
            if (saveData) {
                const gameState = JSON.parse(saveData);
                console.log("Loaded Game State:", gameState);

                // Restore game state
                currentPassageId = gameState.currentPassageId;
                passageHistory.length = 0;
                passageHistory.push(...(gameState.passageHistory || []));
                forwardHistory.length = 0;
                forwardHistory.push(...(gameState.forwardHistory || []));
                fearLevel = gameState.fearLevel || 50;

                // Update fear bar if exists
                const fearBar = document.getElementById("fearBar");
                if (fearBar) {
                    fearBar.style.width = `${fearLevel}%`;
                }

                // Redirect to the saved passage
                renderPassage(currentPassageId);
            } else {
                alert("This save slot is empty.");
            }
        });
    });

    // Delete Save State
    deleteButtons.forEach((button, index) => {
        button.addEventListener("click", () => {
            deleteSaveData(index + 1);
            alert(`Save slot ${index + 1} deleted.`);
            updateSaveSlots();
        });
    });

    // Gate Selection
    const gates = document.querySelectorAll('.gate');
    gates.forEach(gate => {
        gate.addEventListener('click', () => {
            const passageId = gate.dataset.pid;
            window.location.href = `story.html?pid=${passageId}`;
        });
    });

    // Random Passage Button
    const randomButton = document.getElementById('random');
    if (randomButton) {
        randomButton.addEventListener('click', () => {
            const min = 2;
            const max = 51;
            const exclude = [9, 12, 49, 51];
            const randomPassageId = randomPassage(min, max, exclude);
            passageHistory.push(randomPassageId);
            window.location.href = `story.html?pid=${randomPassageId}`;
        });
    }
});

// Random Passage Function
function randomPassage(min, max, exclude) {
    let selectedPassage;
    do {
        selectedPassage = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (exclude.includes(selectedPassage));
    return selectedPassage;
}

// Render Passage Function
function renderPassage(pid) {
    const passage = gameData.find(p => p.pid === pid);
    if (!passage) {
        console.error(`Could not find passage ${pid}`);
        return;
    }
    console.log("Rendering passage:", passage);

    if (document.getElementById('passageText')) {
        document.getElementById('passageText').innerHTML = formatText(passage.text);
        createNavButtons(passage);
    }

    // Optional: Update Fear Bar (commented out as in original script)
    // updateFearBar(pid);
}

// Format Text Function
function formatText(text) {
    let formattedText = text.replace(/\[{2,3}(.*?)\-\>(.*?)\]{2,3}/g, (match, linkText, linkName) => {
        const linkPid = getPassageIdByName(linkName);
        if (!linkPid) {
            console.error(`Could not find pid for passage ${linkName}`);
            return linkText;
        }
        return `<span class="link" onclick="loadNextPassage('${linkPid}')"><b>${linkText}</b></span>`;
    });

    formattedText = formattedText.replace(/\n/g, '<br>');
    formattedText = formattedText.replace(/\(click:.*?\)\[/g, '');
    formattedText = formattedText.replace(/\/\/(.*?)\/\//g, "<i>$1</i>");
    formattedText = formattedText.replace(/''(.*?)''/g, "<b>$1</b>");
    formattedText = formattedText.replace(/\(button:".*?"\)/g, '');

    return formattedText;
}

// Get Passage ID by Name
function getPassageIdByName(linkName) {
    for (let passageIndex = 0; passageIndex < gameData.length; passageIndex++) {
        const passage = gameData[passageIndex];
        for (let linkIndex = 0; linkIndex < passage.links.length; linkIndex++) {
            const link = passage.links[linkIndex];
            if (link.link === linkName) {
                return link.pid;
            }
        }
    }
    return null;
}

// Load Next Passage
function loadNextPassage(nextPid) {
    console.log("Loading next passage with ID:", nextPid);

    if (currentPassageId && !backButtonUsed) {
        passageHistory.push(currentPassageId);
        console.log(passageHistory);
    }

    forwardHistory.length = 0;
    currentPassageId = nextPid;
    backButtonUsed = false;
    renderPassage(currentPassageId);
}

// Create Navigation Buttons
function createNavButtons(passage) {
    const buttonContainer = document.getElementById('buttonContainer');
    buttonContainer.innerHTML = '';

    if (shouldShowButton(passage, 'previous')) {
        const backButton = document.createElement('button');
        backButton.id = 'backButton';
        backButton.className = 'navigation-button';
        backButton.textContent = 'Back';
        backButton.onclick = () => NavigationAction(passage, 'previous');
        buttonContainer.appendChild(backButton);
    }

    if (shouldShowButton(passage, 'next')) {
        const forwardButton = document.createElement('button');
        forwardButton.id = 'forwardButton';
        forwardButton.className = 'navigation-button';
        forwardButton.textContent = 'Forward';
        forwardButton.onclick = () => NavigationAction(passage, 'next');
        buttonContainer.appendChild(forwardButton);
    }
}

// Navigation Action
function NavigationAction(passage, action) {
    switch (action) {
        case 'previous':
            if (passageHistory.length > 0) {
                const previousPid = passageHistory.pop();
                forwardHistory.push(currentPassageId);
                currentPassageId = previousPid;
                backButtonUsed = true;
                renderPassage(currentPassageId);
            }
            break;
        case 'next':
            if (forwardHistory.length > 0) {
                const nextPid = forwardHistory.pop();
                passageHistory.push(currentPassageId);
                currentPassageId = nextPid;
                backButtonUsed = false;
                renderPassage(currentPassageId);
            }
            break;
    }
}

// Determine if Navigation Buttons Should Show
function shouldShowButton(passage, action) {
    switch (action) {
        case 'previous':
            return passageHistory.length > 0;
        case 'next':
            return forwardHistory.length > 0;
        default:
            return false;
    }
}