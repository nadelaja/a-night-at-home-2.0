//A better fucntion to open my pop-ups

// Open a pop-up
function openPopup(popupId) {
    document.querySelector(popupId).style.display = 'block';
}

// Close a pop-up
function closePopup(popup) {
    popup.style.display = 'none';
}

// Add event listeners after DOM loads
document.addEventListener('DOMContentLoaded', function () {

// Open the save pop-up
document.getElementById('save-btn').addEventListener('click', function () {
    openPopup('#save-popup');
});

// Close close all pop-ups
document.querySelectorAll('.close-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
        closePopup(this.parentNode.parentNode);
    });
});

// Close all pop-ups when clicking outside
function outsideClick(event) {
    const popups = document.querySelectorAll('.popup');
    popups.forEach(function (popup) {
        if (event.target === popup) {
            closePopup(popup);
        }
    });
}

window.addEventListener('click', outsideClick);
//window.addEventListener('touchstart', outsideClick);

});