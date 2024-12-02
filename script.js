//if statments to change passage bg colors?? 
let gameData;
let currentPassageId;
const passageHistory = []; //Passage history array!
const forwardHistory = []; // Tracks forward navigation!
//So when the back button is used the value is updated to true and the forward button appears
let backButtonUsed = false; 

//Fetch game data from the JSON file standard start or gate selection
fetch('A _Night_at_Home_JSON.json')
    .then(response => response.json())
    .then(data => {
        gameData = data.passages;

        // Check URL parameters first
        const urlParams = new URLSearchParams(window.location.search);
        const passageFromURL = urlParams.get('pid');

        // Use the URL parameter for a gate if it exists, otherwise use default "34"
        currentPassageId = passageFromURL || "34";
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

    if (document.getElementById('passageText')) { // If...to clear an error
        document.getElementById('passageText').innerHTML = formatText(passage.text);
        createNavButtons(passage); // Nav button creation
    }
}

// Gates page functionality!
const gates = document.querySelectorAll('.gate');

gates.forEach(gate => {
    gate.addEventListener('click', () => {
        const passageId = gate.dataset.pid;
        window.location.href = `story.html?pid=${passageId}`;
    });
});

// Random passage function c:
function randomPassage(min, max, exclude) {
    let selectedPassage;
    do {
        selectedPassage = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (exclude.includes(selectedPassage)); // Exclude the specified passages
    return selectedPassage;
}

    // Add an event listener to the random passage button
if (document.getElementById('random')) { // if... to fix the type error occuring when not on the gates page
    document.getElementById('random').addEventListener('click', () => {
        const min = 2; // Define the range of passage IDs
        const max = 51;
        const exclude = [9, 12, 49, 51,]; // Passages I want exclude, just make the min 50 to exclude 51/52
        const randomPassageId = randomPassage(min, max, exclude);

        // Add the passage to my history
        passageHistory.push(randomPassageId);

        // Redirect to the new passage page
        window.location.href = `story.html?pid=${randomPassageId}`;  // Same as above but with a random passageID
        });
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
function createNavButtons(passage) {
    const buttonContainer = document.getElementById('buttonContainer');
    buttonContainer.innerHTML = ''; // Clear previous buttons

    // Create Back button if there's a history
    if (shouldShowButton(passage, 'previous')) {
        const backButton = document.createElement('button');
        backButton.id = 'backButton';
        backButton.className = 'navigation-button';
        backButton.textContent = 'Back';
        backButton.onclick = () => NavigationAction(passage, 'previous');
        buttonContainer.appendChild(backButton);
    }

    // Create Forward button
    if (shouldShowButton(passage, 'next')) {
        const forwardButton = document.createElement('button');
        forwardButton.id = 'forwardButton';
        forwardButton.className = 'navigation-button';
        forwardButton.textContent = 'Forward';
        forwardButton.onclick = () => NavigationAction(passage, 'next');
        buttonContainer.appendChild(forwardButton);
    }
}

function NavigationAction(passage, action) {
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


// Function for backround color change

const lightsOnPages = []
function lightsOn() {
/* if page in history = and page in lights on 
pages array then backgrond color and text color change*/
}

//Fear Bar
// Categorization
const braveryPIDs = [15, 4, 16, 9, 20, 23, 24, 25, 26, 28, 12, 17, 18];
const fearPIDs = [14, 6, 13, 12, 21, 22, 27, 20];
const neutralityPIDs = [34, 9, 10, 19, 11];

// Initial fear bar state
let fearLevel = 50; // Start at 50% everyone is a little nervous at night...

/* *
 * Updates the fear bar based on the choice's PID.
 * @param {number} pid - The passage ID of the user's choice.
 */
/*function updateFearBar(pid) {
    const fearBar = document.getElementById("fearBar");

    // Adjust fear level based on choice's PID
    if (braveryPIDs.includes(pid)) {
        fearLevel = Math.max(0, fearLevel - 10); // Decrease fear
    } else if (fearPIDs.includes(pid)) {
        fearLevel = Math.min(100, fearLevel + 10); // Increase fear
    }
    // NeutralityPIDs leave fearLevel unchanged

    // Update the fear bar's width
    fearBar.style.width = `${fearLevel}%`;

    // Bar's color update based on "intensity"?? PICK NEW COLORS
    if (fearLevel < 30) {
        fearBar.style.backgroundColor = "green"; // Calm
    } else if (fearLevel < 70) {
        fearBar.style.backgroundColor = "yellow"; // Uneasy
    } else {
        fearBar.style.backgroundColor = "red"; // Panicked
    }

    if (fearLevel >= 90 ) {
        currentPassageId = "2";
        renderPassage(currentPassageId);
    }
} */
