// Chart Navigation System
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation
    initChartNavigation();
    loadInitialChart();
    
    // Render the initial chart (scatter plot by default)
    renderInitialChart();
});

function initChartNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const chartSections = document.querySelectorAll('.chart-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(nav => nav.classList.remove('active'));
            chartSections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding chart section
            const chartId = this.getAttribute('data-chart');
            const targetSection = document.getElementById(`${chartId}-section`);
            if (targetSection) {
                targetSection.classList.add('active');
                
                // Trigger chart rendering when section becomes active
                triggerChartRender(chartId);
            }
            
            // Update browser URL without page reload (optional)
            updateURL(chartId);
        });
    });
}

function triggerChartRender(chartId) {
    console.log(`Rendering ${chartId}...`);
    switch(chartId) {
        case 'scatterplot':
            if (typeof renderScatterPlot === 'function') {
                renderScatterPlot();
            }
            break;
        case 'donut':
            if (typeof renderDonutChart === 'function') {
                renderDonutChart();
            }
            break;
        case 'barchart':
            if (typeof renderBarChart === 'function') {
                renderBarChart();
            }
            break;
        case 'linechart':
            if (typeof renderLineChart === 'function') {
                renderLineChart();
            }
            break;
        default:
            console.warn(`No render function found for: ${chartId}`);
    }
}

function renderInitialChart() {
    // Render the scatter plot immediately on page load since it's the default active chart
    if (typeof renderScatterPlot === 'function') {
        console.log('Rendering initial scatter plot...');
        renderScatterPlot();
    }
}

function loadInitialChart() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        const targetLink = document.querySelector(`[data-chart="${hash}"]`);
        if (targetLink) {
            targetLink.click();
        }
    } else {
        // If no hash, ensure scatter plot is rendered (it's the default active)
        triggerChartRender('scatterplot');
    }
}

function updateURL(chartId) {
    // Update URL hash without page reload
    if (history.pushState) {
        history.pushState(null, null, `#${chartId}`);
    } else {
        window.location.hash = chartId;
    }
}

// Handle browser back/forward buttons
window.addEventListener('popstate', function() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        const targetLink = document.querySelector(`[data-chart="${hash}"]`);
        if (targetLink) {
            targetLink.click();
        }
    } else {
        // If no hash, show scatter plot
        triggerChartRender('scatterplot');
    }
});