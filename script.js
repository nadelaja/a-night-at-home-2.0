let gameData;
let currentPassageId;
//Things are going to need ids later for styling BOOOOooooOOoO~!

fetch('A _Night_at_Home_JSON.json') //HTTP Fetch Request
    .then(response => response.json())   //Promise chain...
    .then(data => {
        gameData = data.passages;
        currentPassageId = "34"; // Starting passage ID
        renderPassage(currentPassageId);
    });

function renderPassage(pid) {  // Display the text and choices for each passage  
    const passage = gameData.find(p => p.pid === pid); //Find the passage in the game via passage ID
    document.getElementById('passageText').innerHTML = formatText(passage.text); //Update displayed text via passageText ID

    const choicesContainer = document.getElementById('choices'); // Initialize choices container ? buttons
    choicesContainer.innerHTML = '';  //Clear any pervious text

    //This is ugly and needs to be fixed
    passage.links.forEach(link => {  //Looping through the link choices in the passage
        let choiceButton = document.createElement('button');
        choiceButton.innerText = link.name;
        choiceButton.onclick = () => loadNextPassage(link.pid);
        choicesContainer.appendChild(choiceButton);
    });
}

function formatText(text) {
    // Basic replacements for demonstration, refine as needed
    return text
        .replace(/\(\(button:"(.*?)"\)\)/g, '<button>$1</button>')  // Handle buttons
        .replace(/\[\[(.*?)\-\>(.*?)\]\]/g, '$1');                 // Simplify link format
}

function loadNextPassage(nextPid) {
    currentPassageId = nextPid;
    renderPassage(currentPassageId);
}
