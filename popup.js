document.addEventListener('DOMContentLoaded', function () {
    console.log('Popup system initializing...');

    // DOM elements
    const closeBtn = document.getElementById('close-btn');
    const saveBtn = document.getElementById('save-btn');
    const savePopup = document.getElementById('save-popup');

    // Check if elements exist before adding listeners
    if (closeBtn && savePopup) {
        closeBtn.addEventListener('click', function () {
            console.log('Closing popup - close button');
            savePopup.style.display = 'none';
        });
        console.log('Close button listener added');
    } else {
        console.error('Save popup elements not found. Make sure the popup HTML is included in the page.');
        console.error('Missing elements:', {
            closeBtn: !!closeBtn,
            savePopup: !!savePopup
        });
    }

    if (saveBtn && savePopup) {
        saveBtn.addEventListener('click', function () {
            console.log('Opening popup');
            savePopup.style.display = 'block';
        });
        console.log('Save button listener added');
    } else {
        console.warn('Save button not found. Check for an element with id="save-btn" in the page.');
    }

    // Close popup when clicking outside
    window.addEventListener('click', function(event) {
        if (savePopup && event.target === savePopup) {
            console.log('Closing popup - outside click');
            savePopup.style.display = 'none';
        }
    });

    // ESC key to close popup
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && savePopup && savePopup.style.display === 'block') {
            console.log('Closing popup - ESC key');
            savePopup.style.display = 'none';
        }
    });

    console.log('Popup system initialized');
});