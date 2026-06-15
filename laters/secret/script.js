// script.js

// User data
const userData = {
    name: "Kavya",
    age: 17,
    dob: "2009-06-16", // yyyy-mm-dd format
    picture: "furi.jpg" // must be in the same folder
};

// Get DOM elements
const nameInput = document.getElementById("name");
const ageInput = document.getElementById("age");
const dobInput = document.getElementById("dob");
const pictureInput = document.getElementById("picture");
const overlay = document.getElementById("overlay");

// Typing effect for inputs
function typeSlowly(element, value, delay = 200, callback) {
    let index = 0;
    const interval = setInterval(() => {
        element.value += value[index];
        index++;
        if (index === value.length) {
            clearInterval(interval);
            if (callback) callback();
        }
    }, delay);
}

// Fill form step by step
function fillForm() {
    typeSlowly(nameInput, userData.name, 300, () => {
        typeSlowly(ageInput, userData.age.toString(), 300, () => {
            // DOB cannot be typed slowly in <input type="date">, set directly
            dobInput.value = userData.dob;

            // Simulate picture upload by showing image preview
            const imgPreview = document.createElement("img");
            imgPreview.src = userData.picture;
            imgPreview.style.width = "100px";
            imgPreview.style.marginTop = "10px";
            pictureInput.parentNode.appendChild(imgPreview);

            // Small delay before showing birthday page
            setTimeout(() => {
                displayBirthday();
            }, 1000);
        });
    });
}

// Show birthday page
function displayBirthday() {
    // Hide form
    document.querySelector('.form-container').style.display = 'none';

    // Fill birthday header
    document.getElementById('birthdayName').textContent = `Today is ${userData.name}'s Birthday`;
    document.getElementById('birthdayAge').textContent = `${userData.age} years old`;
    const dob = new Date(userData.dob);
    document.getElementById('birthdayDate').textContent = dob.toLocaleDateString();

    // Set image
    document.getElementById('birthdayImage').src = userData.picture;

    // Show header, gifts, and footer
    document.getElementById('birthdayHeader').style.display = 'block';
    const giftSections = document.querySelectorAll('.gift-section, .footer');
    giftSections.forEach((section) => (section.style.display = 'block'));

    // Play audio
    const audio = document.getElementById('birthdayAudio');
    audio.play();
}

// Wait for overlay click to start everything (needed for autoplay)
window.onload = () => {
    overlay.addEventListener("click", () => {
        overlay.style.display = "none"; // remove overlay
        fillForm(); // start auto-fill
    });
};
