const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".mobile-menu");
const close = document.querySelector(".close");

hamburger.addEventListener("click", function () {
    mobileMenu.classList.add("active");
});

close.addEventListener("click", function () {
    mobileMenu.classList.remove("active");
});

const email = document.querySelector("#email");
const subscribe = document.querySelector("#subscribe");
const message = document.querySelector("#message");

subscribe.addEventListener("click", function () {
    if (email.value.includes("@")) {
        message.textContent = "Successfully subscribed!";
    } else {
        message.textContent = "Please enter a valid email!";
    }
});