// Function for saving story states/passages
// Will figure of how to connect it to the bar later

/* Saving... actually I think they could be the same function
// Just with an if
    Like If button has page load value with a pid
    open the story to that passage
    Else give the button the value/pid of the current passage
*/
function saveGame() {
    //localStorage! 
    const saveData = {
        pid: pid,
        timestamp: new Date().toISOString(), // Optional for tracking save time
    };

    localStorage.setItem(save1, JSON.stringify(saveData)); // Save data in a specific slot
    console.log(`Progress saved to slot: ${save1}`);
}


function loadProgress(save1) {
    const saveData = JSON.parse(localStorage.getItem(save1));

    if (saveData && saveData.pid) {
        // Redirect to the story page with the saved `pid`
        window.location.href = `story.html?pid=${saveData.pid}`;
    } else {
        console.log(`No save found in slot: ${slotId}`);
    }
}

// Add an option to delete saves...

function deleteSave(save1) {
    localStorage.removeItem(save1);
    console.log(`Deleted save from slot: ${save1}`);
}
