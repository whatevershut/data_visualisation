// SCATTER PLOT: Energy Consumption vs Star Rating

const scatterMargin = { top: 50, right: 30, bottom: 60, left: 80 };
const scatterWidth = 850 - scatterMargin.left - scatterMargin.right;
const scatterHeight = 450 - scatterMargin.top - scatterMargin.bottom;

const scatterSvg = d3.select("#scatterplot")
  .append("svg")
  .attr("width", scatterWidth + scatterMargin.left + scatterMargin.right)
  .attr("height", scatterHeight + scatterMargin.top + scatterMargin.bottom)
  .append("g")
  .attr("transform", `translate(${scatterMargin.left},${scatterMargin.top})`);

const scatterTooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

let scatterData = [];

// Load the same dataset
d3.csv("data/Ex6_TVdata.csv").then(data => {
  data.forEach(d => {
    d.energyConsumption = +d.energyConsumption;
    d.star = +d.star;
    d.brand = d.brand;
    d.model = d.model;
    d.screenSize = +d.screenSize;
    d.screenTech = d.screenTech.trim();
  });

  scatterData = data;
  renderScatterPlot("All");
});

// Render function for scatter plot
function renderScatterPlot(selectedTech) {
  const filtered = selectedTech === "All"
    ? scatterData
    : scatterData.filter(d => d.screenTech === selectedTech);

  // Clear previous plot
  scatterSvg.selectAll("*").remove();

  // X Scale - Star Rating
  const x = d3.scaleLinear()
    .domain([0, d3.max(filtered, d => d.star) + 0.5])
    .range([0, scatterWidth]);

  // Y Scale - Energy Consumption
  const y = d3.scaleLinear()
    .domain([0, d3.max(filtered, d => d.energyConsumption)])
    .nice()
    .range([scatterHeight, 0]);

  // Color scale by screenTech
  const color = d3.scaleOrdinal()
    .domain(["LCD", "LED", "OLED"])
    .range(["#8ecae6", "#69b3a2", "#ffb703"]);

  // X axis
  scatterSvg.append("g")
    .attr("transform", `translate(0,${scatterHeight})`)
    .call(d3.axisBottom(x).ticks(6))
    .selectAll("text")
    .style("font-size", "13px");

  // Y axis
  scatterSvg.append("g")
    .call(d3.axisLeft(y).ticks(8))
    .selectAll("text")
    .style("font-size", "13px");

  // Points
  const points = scatterSvg.selectAll("circle")
    .data(filtered)
    .enter()
    .append("circle")
    .attr("cx", d => x(d.star))
    .attr("cy", d => y(d.energyConsumption))
    .attr("r", 0)
    .style("fill", d => color(d.screenTech))
    .style("opacity", 0.75)
    .on("mouseover", function (event, d) {
      d3.select(this).transition().duration(100).attr("r", 8).style("opacity", 1);
      scatterTooltip.transition().duration(200).style("opacity", 0.95);
      scatterTooltip.html(`
        <strong>${d.brand} ${d.model}</strong><br>
        Screen: ${d.screenSize}" ${d.screenTech}<br>
        Energy: ${d.energyConsumption} kWh/year<br>
        Star Rating: ${d.star}★
      `)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function () {
      d3.select(this).transition().duration(200).attr("r", 5).style("opacity", 0.75);
      scatterTooltip.transition().duration(300).style("opacity", 0);
    });

  // Animate points appearing
  points.transition()
    .duration(800)
    .attr("r", 5);

  // Chart Title
  scatterSvg.append("text")
    .attr("x", scatterWidth / 2)
    .attr("y", -20)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .style("font-weight", "600")
    .style("fill", "#444")
    .text(`Energy Consumption vs Star Rating — ${selectedTech}`);

  // Axis labels
  scatterSvg.append("text")
    .attr("x", scatterWidth / 2)
    .attr("y", scatterHeight + 45)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Star Rating (★)");

  scatterSvg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -scatterHeight / 2)
    .attr("y", -55)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Energy Consumption (kWh/year)");
}

// Reuse same filter buttons
d3.selectAll(".filter-btn").on("click", function () {
  d3.selectAll(".filter-btn").classed("active", false);
  d3.select(this).classed("active", true);
  const selectedTech = d3.select(this).attr("data-tech");
  renderHistogram(selectedTech);
  renderScatterPlot(selectedTech);
});
