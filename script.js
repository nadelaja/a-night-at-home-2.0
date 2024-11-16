let gameData;
let currentPassageId;
//Things are going to need ids later for styling BOOOOooooOOoO~!

fetch('A _Night_at_Home_JSON.json') //HTTP Fetch Request
    .then(response => response.json())   //Promise chain...
    .then(data => {
    gameData = data.passages;
        currentPassageId = "34"; // Starting passage ID ignoring the "start" page
        renderPassage(currentPassageId);
    });

// Display the text and choices for each passage  
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

// Updates the current passage via Id and re-renders the passage with the new pid
function loadNextPassage(nextPid) {
    console.log("Loading next passage with ID:", nextPid); // Debugging
    currentPassageId = nextPid;
    renderPassage(currentPassageId);
}

//Fear Bar