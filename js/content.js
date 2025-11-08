document.addEventListener("click", logKey);

function logKey(e) {
    console.log(`"The alt key is pressed: "${e.altKey}`);
}