function loadComponent(id, file) {
    fetch(file)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
        })
        .catch(err => console.error(`Error Loading ${file}:`, err));
}

// Load header and footer once DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    loadComponent('header-container', './header.html');
    loadComponent('footer-container', './footer.html');
});
