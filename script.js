//if statments to change passage bg colors?? 
let gameData;
let currentPassageId;
const passageHistory = []; //Passage history array!
const forwardHistory = []; // Tracks forward navigation
//So when the back button is used the value is updated to true and the forward button appears
let backButtonUsed = false; 

//Things are going to need ids later for styling BOOOOooooOOoO~!

//Fetch game data from the JSON file
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
    console.log("Rendering passage:", passage);

    document.getElementById('passageText').innerHTML = formatText(passage.text);
    createNavigationButtons(passage); // Nav button creation
}

// Format text and create clickable links
function formatText(text) {
    return text.replace(/\[\[(.*?)\-\>(.*?)\]\]/g, (match, linkText, linkName) => {
        const linkPid = getPassageIdByName(linkName); // Find the actual pid using the link name
        if (!linkPid) {
            console.error(`Could not find pid for passage ${linkName}`);
            return linkText; // Return plain text if pid isn't found
        }
        return `<span stlye="" class="link" onclick="loadNextPassage('${linkPid}')"><b>${linkText}</b></span>`;
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

    // Return null if there is no matching link found
    return null;
}

// Updated function to load the next passage via Id add current passage to history array
function loadNextPassage(nextPid) {
    console.log("Loading next passage with ID:", nextPid);
    // Save current passage to history array before changing (including the start page!)
    if (currentPassageId && !backButtonUsed) {  //And backButtonUsed is false 
        passageHistory.push(currentPassageId);
        console.log(passageHistory)
    }
    forwardHistory.length = 0; // Clear forward history
    currentPassageId = nextPid;
    backButtonUsed = false;
    renderPassage(currentPassageId);
}

// Button Navigation!
function createNavigationButtons(passage) {
    const buttonContainer = document.getElementById('buttonContainer');
    buttonContainer.innerHTML = ''; // Clear previous buttons

    // Create Back button if there's a history
    if (shouldShowButton(passage, 'previous')) {
        const backButton = document.createElement('button');
        backButton.id = 'backButton';
        backButton.className = 'navigation-button';
        backButton.textContent = 'Back';
        backButton.onclick = () => handleNavigationAction(passage, 'previous');
        buttonContainer.appendChild(backButton);
    }

    // Create Forward button
    if (shouldShowButton(passage, 'next')) {
        const forwardButton = document.createElement('button');
        forwardButton.id = 'forwardButton';
        forwardButton.className = 'navigation-button';
        forwardButton.textContent = 'Forward';
        forwardButton.onclick = () => handleNavigationAction(passage, 'next');
        buttonContainer.appendChild(forwardButton);
    }
}

function handleNavigationAction(passage, action) {
    switch (action) {
        case 'previous':
            if (passageHistory.length > 0) {
                const previousPid = passageHistory.pop();  // Remove passage ID from history array
                forwardHistory.push(currentPassageId);    // Save the current passage to the forward navigation array
                currentPassageId = previousPid;          // Navigate to the previous passage
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

function shouldShowButton(passage, action) {
    switch (action) {
        case 'previous': // Show the back button if there's anything in the history
            return passageHistory.length > 0;

        case 'next': // Show the forward button if there's anything in forward history
            return forwardHistory.length > 0;

        default: // For anything else, whatever it might be
            return false;
    }
}
