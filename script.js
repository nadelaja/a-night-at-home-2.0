let gameData;
let currentPassageId;
const passageHistory = []; //Passage history array! 

//Things are going to need ids later for styling BOOOOooooOOoO~!

fetch('A _Night_at_Home_JSON.json') //HTTP Fetch Request
    .then(response => response.json())   //Promise chain...
    .then(data => {
        gameData = data.passages;
        currentPassageId = "34"; // Starting passage ID ignoring the "start" page
        renderPassage(currentPassageId);
    });

// Updated renderPassage function that includes button creation
function renderPassage(pid) {
    const passage = gameData.find(p => p.pid === pid);
    if (!passage) {
        console.error(`Could not find passage ${pid}`);
        return;
    }

    document.getElementById('passageText').innerHTML = formatText(passage.text);
    createNavigationButtons(passage); // Nav button creation
}

function formatText(text) {
    return text.replace(/\[\[(.*?)\-\>(.*?)\]\]/g, (match, linkText, linkName) => {
        const linkPid = getPassageIdByName(linkName); // Find the actual pid using the link name
        if (!linkPid) {
            console.error(`Could not find pid for passage ${linkName}`);
            return linkText; // Return plain text if pid isn't found
        }
        return `<span class="link" onclick="loadNextPassage('${linkPid}')">${linkText}</span>`;
    });
}

// Another function to find the pid by link name :(
function getPassageIdByName(linkName) {
    // Iterate through each passage in the game data
    for (let passageIndex = 0; passageIndex < gameData.length; passageIndex++) {
        const passage = gameData[passageIndex];

        // Iterate through the links in the current passage
        for (let linkIndex = 0; linkIndex < passage.links.length; linkIndex++) {
            const link = passage.links[linkIndex];

            // Check if the link matches the given name
            if (link.link === linkName) {
                return link.pid; // Return the pid if the link matches
            }
        }
    }

    // Return null if no matching link is found
    return null;
}

// Updateed function to update the current passage via Id and re-renders the passage with the new pid
function loadNextPassage(nextPid) {
    console.log("Loading next passage with ID:", nextPid);
    // Save current passage to history history array before changing (including the start page!)
    if (currentPassageId) { // Don't track starting page!
        passageHistory.push(currentPassageId);
    }
    currentPassageId = nextPid;
    renderPassage(currentPassageId);
}


// Button Navigation!

let buttonConfig = {
    'back': { label: 'Back', action: 'previous' },
    'continue': { label: 'Continue', action: 'next' },
    // Add more button configurations as needed
};

function createNavigationButtons(passage) {
    const buttonContainer = document.getElementById('buttonContainer'); //...hmmm
    buttonContainer.innerHTML = ''; // Clear existing buttons

    // Create buttons based on available links in the passage
    if (passage.links) {
        passage.links.forEach(link => {
            const button = document.createElement('button');
            button.className = 'navigation-button';
            button.textContent = link.text || link.link; //The || (or) means use link.text if it exists, if not, use link.link
            button.onclick = () => loadNextPassage(getPassageIdByName(link.link));
            buttonContainer.appendChild(button);
        });
    }

    // Add standard navigation buttons if configured
    Object.entries(buttonConfig).forEach(([key, config]) => { //Interating through Json objects key,config pairs
        // key would be 'back' or 'continue'
        // config would be { label: 'Back', action: 'previous' }
        if (shouldShowButton(passage, config.action)) {
            const button = document.createElement('button'); //Button element is created
            button.className = 'navigation-button'; //Given a class name
            button.textContent = config.label; //Button text is the 
            button.onclick = () => handleNavigationAction(passage, config.action);
            buttonContainer.appendChild(button);
        }
    });
}

function shouldShowButton(passage, action) {
    switch (action) {
        case 'previous':
            // Show back button if there's a history
            return passage.pid !== "34"; // Don't show on starting passage
        case 'next':
            // Show continue button if there's a default next passage
            return passage.defaultNext !== undefined;
        default:
            return false;
    }
}

function handleNavigationAction(passage, action) {
    switch (action) {
        case 'previous':
            if (passageHistory.length > 0) {
                const previousPid = passageHistory.pop(); // Get the last passage from history
                currentPassageId = previousPid;   // Load it without adding to history
                renderPassage(currentPassageId);
            }
            break;
        case 'next':
            if (passage.defaultNext) {
                loadNextPassage(passage.defaultNext);
            }
            break;
    }
}

//Fear Bar