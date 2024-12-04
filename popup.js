// Open a pop-up
/*function openPopup(popupId) {
    document.querySelector(popupId).style.display = 'block';
}

// Close a pop-up
function closePopup(popup) {
    popup.style.display = 'none';
}*/

//A better function for the save pop-ups

// After DOM loads event listiner
document.addEventListener('DOMContentLoaded', function () {

    // Close button variable

    fetch('popup.html')
        .then(response => response.text())
        .then(html => {
            // Load save popup HTML
            document.body.insertAdjacentHTML('beforeend', html);

            // Close the pop-ups
            const closeBtn = document.getElementById('close-btn');

            const savePopup = document.getElementById('save-popup');
            closeBtn.addEventListener('click', function () {
                savePopup.style.display = 'none';
            });
        });
    console.log('popup error')

    const saveBtn = document.getElementById('save-btn') // For the inital save/saves buttons
    saveBtn.addEventListener('click', function () {
        const savePopup = document.getElementById('save-popup');
        savePopup.style.display = 'block';
    });

    // Close the popup when clicking outside
    function outsideClick(event) {
        const savePopup = document.getElementById('save-popup');
        if (event.target === savePopup) {
            savePopup.style.display = 'none'
        }
    }
    window.addEventListener('click', outsideClick);
});
