// HISTOGRAM FILTERING (Interactive with Screen Size, Brand & Star Info)

// SVG dimensions
const margin = { top: 50, right: 30, bottom: 60, left: 70 };
const width = 850 - margin.left - margin.right;
const height = 450 - margin.top - margin.bottom;

// Append SVG
const svg = d3.select("#histogram")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Tooltip for hover info
const tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

let tvData = [];

// Load data
d3.csv("data/Ex6_TVdata.csv").then(data => {
  data.forEach(d => {
    d.energyConsumption = +d.energyConsumption;
    d.brand = d.brand;
    d.model = d.model;
    d.screenSize = +d.screenSize;
    d.screenTech = d.screenTech.trim();
    d.energy = +d.energyConsumption;
    d.star = +d.star;
  });

  tvData = data;

  // Draw default histogram
  renderHistogram("All");
});

// Function to render histogram
function renderHistogram(selectedTech) {
  const filteredData = selectedTech === "All"
    ? tvData
    : tvData.filter(d => d.screenTech === selectedTech);

  // Clear old chart
  svg.selectAll("*").remove();

  // X scale (Energy Consumption)
  const x = d3.scaleLinear()
    .domain([0, d3.max(filteredData, d => d.energyConsumption)])
    .nice()
    .range([0, width]);

  // Histogram bins
  const bins = d3.bin()
    .domain(x.domain())
    .thresholds(25)
    (filteredData.map(d => d.energyConsumption));

  // Y scale (Frequency)
  const y = d3.scaleLinear()
    .domain([0, d3.max(bins, d => d.length)])
    .range([height, 0])
    .nice();

  // X axis
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("font-size", "13px");

  // Y axis
  svg.append("g")
    .call(d3.axisLeft(y))
    .selectAll("text")
    .style("font-size", "13px");

  // Bars
  const bars = svg.selectAll("rect")
    .data(bins)
    .enter()
    .append("rect")
    .attr("x", d => x(d.x0) + 1)
    .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 2))
    .attr("y", height)
    .attr("height", 0)
    .style("fill", "#69b3a2")
    .style("opacity", 0.85)
    .on("mouseover", function (event, d) {
      d3.select(this).style("fill", "#4e9e8c");
      const avgSize = d3.mean(filteredData.filter(tv => tv.energyConsumption >= d.x0 && tv.energyConsumption < d.x1), tv => tv.screenSize);
      const avgStar = d3.mean(filteredData.filter(tv => tv.energyConsumption >= d.x0 && tv.energyConsumption < d.x1), tv => tv.star);
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip.html(`
        <strong>Energy Range:</strong> ${d.x0.toFixed(1)} - ${d.x1.toFixed(1)} kWh<br>
        <strong>TV Count:</strong> ${d.length}<br>
        <strong>Avg Screen Size:</strong> ${avgSize ? avgSize.toFixed(1) + '"' : "N/A"}<br>
        <strong>Avg Star Rating:</strong> ${avgStar ? avgStar.toFixed(1) + "★" : "N/A"}
      `)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function () {
      d3.select(this).style("fill", "#69b3a2");
      tooltip.transition().duration(300).style("opacity", 0);
    });

  // Animate bars
  bars.transition()
    .duration(800)
    .attr("y", d => y(d.length))
    .attr("height", d => height - y(d.length));

  // Chart title
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", -20)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .style("font-weight", "600")
    .style("fill", "#444")
    .text(`Energy Consumption Distribution — ${selectedTech}`);

  // Axis labels
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height + 45)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Energy Consumption (kWh/year)");

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -50)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Number of TVs");
}

// Filter button interactivity
d3.selectAll(".filter-btn").on("click", function () {
  d3.selectAll(".filter-btn").classed("active", false);
  d3.select(this).classed("active", true);
  const selectedTech = d3.select(this).attr("data-tech");
  renderHistogram(selectedTech);
});
