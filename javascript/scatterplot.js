// energy consumption vs star rating   
function renderScatterPlot() {
  console.log("Loading scatter plot data...");
  
  d3.csv("data/LAB6_7.csv", d => ({
      brand: d.Brand_Reg,
      model: d.Model_No,
      star: +d.Star2,
      energy: +d.Energy
  })).then(data => {
      const filteredData = data.filter(d =>
          !isNaN(d.star) && !isNaN(d.energy) && d.star > 0 && d.energy > 0
      );
      
      console.log(`Loaded ${filteredData.length} valid data points`);
      
      if (filteredData.length === 0) {
          console.error("No valid data found for scatter plot");
          displayErrorMessage("No valid data available for scatter plot");
          return;
      }
      
      cal_data(filteredData);
      draw_scatterplot(filteredData);
      
  }).catch(error => {
      console.error("Error loading CSV:", error);
      displayErrorMessage("Error loading data: " + error.message);
  });
}

function displayErrorMessage(message) {
  const container = d3.select("#scatterplot");
  container.selectAll("*").remove();
  container.append("div")
      .attr("class", "error-message")
      .style("color", "red")
      .style("padding", "20px")
      .style("text-align", "center")
      .html(`<i class="fas fa-exclamation-triangle"></i><br>${message}`);
}

function cal_data(data) {
  const stats = {
      count: data.length,
      avgStar: d3.mean(data, d => d.star),
      avgEnergy: d3.mean(data, d => d.energy),
      minStar: d3.min(data, d => d.star),
      maxStar: d3.max(data, d => d.star),
      minEnergy: d3.min(data, d => d.energy),
      maxEnergy: d3.max(data, d => d.energy)
  };
  
  console.log("Data Statistics:", stats);
  return stats;
}

function draw_scatterplot(data) {
  // Get container dimensions for responsive design
  const container = d3.select("#scatterplot");
  const containerWidth = container.node().getBoundingClientRect().width || 800;
  
  // Set up dimensions and margins
  const margin = { top: 40, right: 30, bottom: 50, left: 60 };
  const width = Math.min(containerWidth - margin.left - margin.right, 800);
  const height = 420 - margin.top - margin.bottom;
  
  // Clear any existing SVG
  container.select("svg").remove();
  
  // Create SVG
  const svg = container
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  
  // Create scales with some padding
  const xScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.star) - 0.5, d3.max(data, d => d.star) + 0.5])
      .range([0, width])
      .nice();
  
  const yScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.energy) - 10, d3.max(data, d => d.energy) + 10])
      .range([height, 0])
      .nice();
  
  // Create axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);
  
  // Add X axis
  svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .append("text")
      .attr("x", width / 2)
      .attr("y", 35)
      .attr("fill", "black")
      .style("text-anchor", "middle")
      .style("font-weight", "bold")
      .text("Star Rating");
  
  // Add Y axis
  svg.append("g")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("x", -height / 2)
      .attr("fill", "black")
      .style("text-anchor", "middle")
      .style("font-weight", "bold")
      .text("Energy Consumption (kWh/year)");
  
  // Add dots
  svg.selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", d => xScale(d.star))
      .attr("cy", d => yScale(d.energy))
      .attr("r", 4)
      .attr("fill", "steelblue")
      .attr("opacity", 0.7)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
          d3.select(this)
              .raise()
              .transition()
              .duration(200)
              .attr("r", 8)
              .attr("fill", "#ff6b6b")
              .attr("opacity", 1);
          
          // Optional: Add tooltip
          showTooltip(event, d);
      })
      .on("mouseout", function(event, d) {
          d3.select(this)
              .transition()
              .duration(200)
              .attr("r", 4)
              .attr("fill", "steelblue")
              .attr("opacity", 0.7);
          
          // Remove tooltip
          hideTooltip();
      });

  // Add title
  svg.append("text")
      .attr("x", width / 2)
      .attr("y", -15)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .style("fill", "#333")
      .text("TV Energy Consumption vs Star Rating");

  // Optional: Add grid lines
  svg.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale)
          .tickSize(-height)
          .tickFormat("")
      )
      .style("stroke-dasharray", "3,3")
      .style("opacity", 0.2);

  svg.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(yScale)
          .tickSize(-width)
          .tickFormat("")
      )
      .style("stroke-dasharray", "3,3")
      .style("opacity", 0.2);
}

// Optional: Tooltip functions
function showTooltip(event, d) {
  const tooltip = d3.select("body").selectAll(".scatter-tooltip").data([0]);
  
  tooltip.enter()
      .append("div")
      .attr("class", "scatter-tooltip")
      .style("position", "absolute")
      .style("background", "rgba(0,0,0,0.8)")
      .style("color", "white")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("z-index", "1000");
  
  d3.select(".scatter-tooltip")
      .html(`
          <strong>${d.brand} ${d.model}</strong><br>
          Star Rating: ${d.star}<br>
          Energy: ${d.energy.toFixed(1)} kWh/year
      `)
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 10) + "px");
}

function hideTooltip() {
  d3.selectAll(".scatter-tooltip").remove();
}

// Make function globally available
window.renderScatterPlot = renderScatterPlot;