// === MAIN RENDER FUNCTION ===
function renderBarChart() {
    // Clear previous chart
    d3.select("#bar-chart").html("");

    d3.csv("data/LAB6_7.csv", d => ({
        brand: d.Brand_Reg,
        screentechnology: d.Screen_Tech,
        energy: +d.Energy,
        screensize: d.Screen_Size2 // keep as string for safety
    }))
    .then(data => {
        console.log("Unique screen sizes:", [...new Set(data.map(d => d.screensize))]);

        // Filter only 55-inch TVs with valid values
        const filteredData = data.filter(d =>
            !isNaN(d.energy) &&
            d.energy > 0 &&
            d.screentechnology &&
            d.screentechnology.trim() !== "" &&
            String(d.screensize).includes("55")
        );

        if (filteredData.length === 0) {
            console.warn("No data found for 55-inch TVs");
            d3.select("#bar-chart").html("<p>No data available for 55-inch TVs</p>");
            return;
        }

        drawBarChart(filteredData);
    })
    .catch(error => {
        console.error("Error loading CSV:", error);
        d3.select("#bar-chart").html("<p>Error loading data</p>");
    });
}


// === DRAW FUNCTION (TOTAL ENERGY) ===
function drawBarChart(data) {
    const aggregated = Array.from(
        d3.group(data, d => d.screentechnology),
        ([key, values]) => ({
            screentechnology: key,
            totalEnergy: d3.sum(values, v => v.energy)
        })
    );

    const margin = { top: 60, right: 40, bottom: 60, left: 120 }; // added top margin for spacing
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#bar-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom + 50) // extra bottom padding
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
        .domain([0, d3.max(aggregated, d => d.totalEnergy)])
        .nice()
        .range([0, width]);

    const y = d3.scaleBand()
        .domain(aggregated.map(d => d.screentechnology))
        .range([0, height])
        .padding(0.2);

    // Optional: color scale per technology
    const color = d3.scaleOrdinal()
        .domain(aggregated.map(d => d.screentechnology))
        .range(d3.schemeSet2);

    svg.selectAll(".bar")
        .data(aggregated)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", d => y(d.screentechnology))
        .attr("height", y.bandwidth())
        .attr("x", 0)
        .attr("width", d => x(d.totalEnergy))
        .attr("fill", d => color(d.screentechnology));

    svg.selectAll(".label")
        .data(aggregated)
        .enter()
        .append("text")
        .attr("x", d => x(d.totalEnergy) + 5)
        .attr("y", d => y(d.screentechnology) + y.bandwidth() / 2)
        .attr("dy", "0.35em")
        .text(d => d.totalEnergy.toFixed(2))
        .attr("fill", "#333")
        .attr("font-size", "12px");

    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .attr("font-weight", "bold")
        .attr("fill", "#2b2b2b")
        .text("Total Energy Consumption by Screen Technology (55-inch TVs)");
}

