// t04-5-bars.js
  /* Load CSV, Convert Type, Quick Check */
  d3.csv("data/tvBrandCount.csv", d => ({ //object d to iterate data 
    brand: d.brand,
    count: +d.count
    })).then(data => {
    // Quick check
    console.log(data); // whole array
    console.log("rows:", data.length); //no of rows in total
    console.log("max:", d3.max(data, d => d.count)); 
    console.log("min:", d3.min(data, d => d.count));
    console.log("extent:", d3.extent(data, d => d.count)); // [min, max]
    //Optional: sort for easier reading (descending by count)
    data.sort((a, b) => d3.descending(a.count, b.count));    //sorting in decsending order
    // Hand off to the chart builder (implemented next exercise)
    createBarChart(data);
    });
    

const createBarChart = (data) => {
    console.log("Creating bar chart with data:", data);
    
    // Clear any existing content
    d3.select(".responsive-svg-container").selectAll("*").remove();
    
    // Set dimensions - fixed for better visibility
    const margin = { top: 20, right: 30, bottom: 40, left: 100 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    // Create SVG with proper dimensions
    const svg = d3.select(".responsive-svg-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`)
        .style("border", "1px solid black");

    // X scale (numeric - for bar width)
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)])
        .range([0, width]);

    // Y scale (categorical - for bar positions)
    const yScale = d3.scaleBand()
        .domain(data.map(d => d.brand))
        .range([0, height])
        .padding(0.2);

    // Create bars rectangle
    svg.selectAll("rect") //bars that represent the data value
        .data(data)
        .join("rect")
        .attr("class", d => `bar bar-${d.count}`)
        .attr("x", 0)
        .attr("y", d => yScale(d.brand))
        .attr("width", d => xScale(d.count))
        .attr("height", yScale.bandwidth())
        .attr("fill", "steelblue")
        .attr("rx", 3) // rounded corners
        .attr("ry", 3);

    console.log(`✅ Created ${data.length} bars successfully!`);
    
    // Add some basic labels to verify which bar is which
    //count labels 
    svg.selectAll(".label") //text showing each bars
        .data(data)
        .join("text")
        .attr("class", "label")
        .attr("x", d => xScale(d.count) + 5)
        .attr("y", d => yScale(d.brand) + yScale.bandwidth() / 2)
        .attr("dy", "0.35em")
        .text(d => d.count)
        .style("font-size", "12px")
        .style("fill", "#333");

    //label with brand name s
    svg.append("g") //group element 
    .call(d3.axisLeft(yScale)) //pre built function creating lines on vector scale
    .selectAll("text")
    .style("font-size","12px")
    .style("fill","#333");

};

