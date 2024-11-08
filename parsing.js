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
    const passage = gameData.find(p => p.pid === pid); // Find the passage in the game via passage ID
    console.log("Current passage ID:", pid); // Why am i getting the name?? 
    if (!passage) {
        console.error(`Could not find passage ${pid}`);
        return;
    }

    document.getElementById('passageText').innerHTML = formatText(passage.text); // Update displayed text via passageText ID
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

// Another function to find the pid by link name
function getPassageIdByName(linkName) {
    const passage = gameData.find(p => p.links.some(link => link.link === linkName));
    return passage ? passage.links.find(link => link.link === linkName).pid : null;
}

// Updates the current passage via Id and re-renders the passage with the new pid
function loadNextPassage(nextPid) {
    console.log("Loading next passage with ID:", nextPid); // Debugging
    currentPassageId = nextPid;
    renderPassage(currentPassageId);
}
