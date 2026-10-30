document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("pre, code").forEach(block => {
        block.addEventListener("copy", event => {
            event.preventDefault();
        });

        block.addEventListener("cut", event => {
            event.preventDefault();
        });
    });
});
