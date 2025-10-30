// energy consumption for different screen tech across all TV combined   
// donutchart.js
function renderDonutChart() {
    d3.csv("data/LAB6_7.csv", d => ({
      brand: d.Brand_Reg,
      screentechnology: d.Screen_Tech,
      energy: +d.Energy
    })).then(data => {
      const filteredData = data.filter(d =>
        !isNaN(d.energy) && d.energy > 0 && d.screentechnology && d.screentechnology.trim() !== ""
      );
      drawDonutChart(filteredData);
    }).catch(error => {
      console.error("Error loading CSV:", error);
    });
  }
  

function calculateScreenTechData(data) {
    // Group data by screen technology and calculate total energy consumption
    const techEnergy = d3.rollup(data, 
        v => d3.sum(v, d => d.energy), // Sum energy for each technology
        d => d.screentechnology
    );
    
    console.log("Energy by Screen Technology:", techEnergy);
    
    // Convert to array of objects
    const techData = Array.from(techEnergy, ([technology, energy]) => ({
        technology,
        energy
    }));
    
    return techData;
}

function drawDonutChart(data) {
    // Calculate the data for the donut chart
    // Calculate the data for the donut chart
    const techData = calculateScreenTechData(data);
    
    // Get container dimensions
    const container = document.getElementById('donut-chart');
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight || 500; // Fallback height
    
    // Set up dimensions relative to container
    const width = Math.min(containerWidth, 600); // Max width 600px
    const height = Math.min(containerHeight, 500); // Max height 500px
    const margin = 40;
    const radius = Math.min(width, height) / 2 - margin;
    
    // Clear previous chart
    container.innerHTML = "";
    
    // Create SVG with viewBox for responsiveness
    const svg = d3.select("#donut-chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2 + 20})`); // ⬅ shift down slightly
     
   
   
        // Create color scale
    const color = d3.scaleOrdinal()
        .domain(techData.map(d => d.technology))
        .range(d3.schemeCategory10);
    
    // Create pie generator
    const pie = d3.pie()
        .value(d => d.energy)
        .sort(null);
    
    // Create arc generators
    const arc = d3.arc()
        .innerRadius(radius * 0.6) // Donut hole
        .outerRadius(radius * 0.8);
    
    const outerArc = d3.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9);
    
    // Generate arcs
    const arcs = svg.selectAll(".arc")
        .data(pie(techData))
        .enter()
        .append("g")
        .attr("class", "arc");
    
    // Draw arcs with hover effects
    arcs.append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.technology))
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .style("opacity", 0.8)
        .on("mouseover", function(event, d) {
            // Highlight segment
            d3.select(this)
                .transition()
                .duration(200)
                .style("opacity", 1)
                .attr("stroke-width", 3);
            
            // Show tooltip
            const tooltip = d3.select("body")
                .append("div")
                .attr("class", "donut-tooltip")
                .style("opacity", 0);
            
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            
            tooltip.html(`
                <strong>${d.data.technology}</strong><br/>
                Energy: ${d.data.energy.toFixed(2)}<br/>
                Percentage: ${((d.data.energy / d3.sum(techData, x => x.energy)) * 100).toFixed(1)}%
            `)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(event, d) {
            // Reset segment
            d3.select(this)
                .transition()
                .duration(200)
                .style("opacity", 0.8)
                .attr("stroke-width", 2);
            
            // Remove tooltip
            d3.selectAll(".donut-tooltip").remove();
        });
    
    // Add labels
  

            // Simple fix using arc centroid
        arcs.append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("dy", "0.35em")
        .style("text-anchor", "middle")
        .text(d => {
            const percentage = ((d.data.energy / d3.sum(techData, x => x.energy)) * 100).toFixed(1);
            return `${percentage}%`;
        })
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .style("fill", "#fff")
        .style("text-shadow", "1px 1px 2px rgba(0,0,0,0.8)")
        .style("pointer-events", "none");

            
    // Create legend
    createDonutLegend(techData, color);
}

function createDonutLegend(data, colorScale) {
    // Clear previous legend
    d3.select("#donut-chart").select(".donut-legend").remove();
    
    // Calculate total energy
    const totalEnergy = d3.sum(data, d => d.energy);
    
    // Create legend container
    const legend = d3.select("#donut-chart")
        .append("div")
        .attr("class", "donut-legend")
        .style("display", "flex")
        .style("flex-wrap", "wrap")
        .style("justify-content", "center")
        .style("gap", "15px")
        .style("margin-top", "20px");
    
    // Create legend items
    const legendItems = legend.selectAll(".legend-item")
        .data(data)
        .enter()
        .append("div")
        .attr("class", "legend-item")
        .style("display", "flex")
        .style("align-items", "center")
        .style("gap", "8px")
        .style("padding", "5px 10px")
        .style("background", "rgba(255,255,255,0.8)")
        .style("border-radius", "5px");
    
    // Add color boxes
    legendItems.append("div")
        .attr("class", "legend-color")
        .style("width", "15px")
        .style("height", "15px")
        .style("border-radius", "3px")
        .style("background-color", d => colorScale(d.technology));
    
    // Add text
    legendItems.append("span")
        .style("font-size", "12px")
        .style("color", "#333")
        .html(d => {
            const percentage = ((d.energy / totalEnergy) * 100).toFixed(1);
            return `${d.technology}: ${percentage}%`;
        });
}

