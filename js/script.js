// Get the navbar element
const navbar = document.querySelector('.navbar');

// Add a scroll event listener to the window object
window.addEventListener('scroll', function () {
    // Check the scroll position of the window
    if (window.scrollY > 0) {
        // Add a dark class to the navbar element
        navbar.classList.add('dark');
    } else {
        // Remove the dark class from the navbar element
        navbar.classList.remove('dark');
    }
});

// Custom JavaScript

// Change the background color of the navbar on page scroll
window.onscroll = function () {
    var navbar = document.querySelector(".navbarScroll");
    if (window.pageYOffset > 0) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
};

// Add a smooth scroll effect to the navbar links
var links = document.querySelectorAll(".nav-link");
for (var i = 0; i < links.length; i++) {
    links[i].addEventListener("click", function (event) {
        event.preventDefault();
        var target = this.getAttribute("href");
        var element = document.querySelector(target);
        var offset = element.offsetTop - 80;
        window.scrollTo({
            top: offset,
            behavior: "smooth"
        });
    });
}

// Validate the contact form
var form = document.getElementById("contact-form");
form.addEventListener("submit", function (event) {
    event.preventDefault();
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var subject = document.getElementById("subject").value;
    var message = document.getElementById("message").value;
    if (name && email && subject && message) {
        // Send the form data to your server or email service
        // For example, using Ajax
        var xhr = new XMLHttpRequest();
        xhr.open("POST", form.action, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send("name=" + name + "&email=" + email + "&subject=" + subject + "&message=" + message);
        xhr.onload = function () {
            if (xhr.status == 200) {
                // Display a success message
                alert("Your message has been sent successfully!");
                // Reset the form fields
                form.reset();
            } else {
                // Display an error message
                alert("Something went wrong. Please try again later.");
            }
        };
    } else {
        // Display a warning message
        alert("Please fill in all the fields.");
    }
    
});

