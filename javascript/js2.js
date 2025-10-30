
// Sidebar Navigation Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Function to handle navigation
    function handleNavigation(e) {
        e.preventDefault();
        
        // Remove active class from all links and sections
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        const allSections = document.querySelectorAll('.viz-block');
        allSections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Add active class to clicked link
        this.classList.add('active');
        
        // Get the target section ID
        const targetId = this.getAttribute('data-target');
        
        // Show the target section
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        // Update active indicator position
        updateActiveIndicator(this);
    }
    
    // Function to update the active indicator position
    function updateActiveIndicator(activeLink) {
        const indicator = document.querySelector('.active-indicator');
        const linkRect = activeLink.getBoundingClientRect();
        const sidebarRect = activeLink.closest('.sidebar').getBoundingClientRect();
        
        // Position the indicator relative to the active link
        indicator.style.transform = `translateY(${linkRect.top - sidebarRect.top}px)`;
    }
    
    // Add click event listeners to all navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    // Initialize the active indicator position
    const initialActiveLink = document.querySelector('.nav-link.active');
    if (initialActiveLink) {
        updateActiveIndicator(initialActiveLink);
    }
});


