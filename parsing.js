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
    choicesContainer.innerHTML = ''; // Clear previous choice

    // Create buttons for each link in the passage
    passage.links.forEach(link => {
        let choiceButton = document.createElement('button');
        choiceButton.innerText = link.name;  // Set the button text
        choiceButton.onclick = () => loadNextPassage(link.pid);  // Set the button action
        choicesContainer.appendChild(choiceButton);  // Add the button to the choices container
    });
}

function formatText(text) {
    // Replace custom button syntax and handle links
    return text
        .replace(/\(button:"(.*?)"\)/g, '<button>$1</button>')  // Replace Harlowe button syntax if it exists
        .replace(/\[\[(.*?)\-\>(.*?)\]\]/g, '<span class="link">$1</span>');  // Display link text without link functionality
}

function loadNextPassage(nextPid) {
    currentPassageId = nextPid;
    renderPassage(currentPassageId);
}
