function renderLineChart() {
    // Clear previous chart
    d3.select("#line-chart").html("");
  
    // Set dimensions
    const margin = { top: 50, right: 160, bottom: 50, left: 70 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
  
    // Append SVG
    const svg = d3.select("#line-chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  
    // Tooltip div
    const tooltip = d3.select("#body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background", "rgba(0,0,0,0.7)")
      .style("color", "white")
      .style("padding", "6px 10px")
      .style("border-radius", "6px")
      .style("font-size", "13px")
      .style("pointer-events", "none");
  
    d3.csv("data/q6.csv", d => ({
      year: +d.Year,
      Queensland: +d.Queensland,
      Victoria: +d.Victoria,
      NewSouthWales: +d.NewSouthWales,
      SouthAustralia: +d.SouthAustralia,
      Tasmania: +d.Tasmania
    })).then(data => {
  
      const states = ["Queensland", "Victoria", "NewSouthWales", "SouthAustralia", "Tasmania"];
  
      // Scales
      const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([0, width]);
  
      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d3.max(states, s => d[s]))])
        .nice()
        .range([height, 0]);
  
      // Axes
      svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));
  
      svg.append("g")
        .call(d3.axisLeft(y));
  
      // Color scale
      const color = d3.scaleOrdinal()
        .domain(states)
        .range(d3.schemeTableau10);
  
      // Prepare data for each state
      const stateData = states.map(state => ({
        name: state,
        values: data.map(d => ({ year: d.year, value: d[state] }))
      }));
  
      // Draw lines
      const lines = svg.selectAll(".line-group")
        .data(stateData)
        .enter()
        .append("g")
        .attr("class", "line-group");
  
      lines.append("path")
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", d => color(d.name))
        .attr("stroke-width", 2)
        .attr("d", d => d3.line()
          .x(dv => x(dv.year))
          .y(dv => y(dv.value))(d.values)
        );
  
      // Add circles for each data point
      lines.selectAll("circle")
        .data(d => d.values.map(v => ({ ...v, state: d.name })))
        .enter()
        .append("circle")
        .attr("cx", d => x(d.year))
        .attr("cy", d => y(d.value))
        .attr("r", 4)
        .attr("fill", d => color(d.state))
        .attr("opacity", 0)
        .on("mouseover", function (event, d) {
          d3.select(this).transition().duration(100).attr("r", 6).attr("opacity", 1);
          tooltip.transition().duration(200).style("opacity", 1);
          tooltip.html(`<strong>${d.state}</strong><br>Year: ${d.year}<br>Price: ${d.value}`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", function () {
          d3.select(this).transition().duration(100).attr("r", 4).attr("opacity", 0);
          tooltip.transition().duration(300).style("opacity", 0);
        });
  
      // Interactive legend
      const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width + 20}, 20)`);
  
      const legendItem = legend.selectAll(".legend-item")
        .data(stateData)
        .enter()
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(0, ${i * 25})`)
        .style("cursor", "pointer")
        .on("click", function (event, d) {
          const active = d3.select(this).classed("inactive");
          d3.select(this).classed("inactive", !active);
          d3.select(this).select("text")
            .style("opacity", active ? 1 : 0.5);
          d3.selectAll(".line")
            .filter(line => line.name === d.name)
            .transition()
            .style("opacity", active ? 1 : 0);
          d3.selectAll("circle")
            .filter(pt => pt.state === d.name)
            .transition()
            .style("opacity", active ? 0 : 0);
        });
  
      legendItem.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 14)
        .attr("height", 14)
        .attr("fill", d => color(d.name));
  
      legendItem.append("text")
        .attr("x", 20)
        .attr("y", 11)
        .style("font-size", "13px")
        .text(d => d.name);
    });
  }
  