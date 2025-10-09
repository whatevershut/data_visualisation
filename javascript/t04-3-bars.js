// Create an SVG inside the responsive container
const svg = d3.select("svg")


// Test shape: a thin blue rectangle near the top-left
svg
.append("rect")
.attr("x", 10)
.attr("y", 10)
.attr("width", 414)
.attr("height", 16)
.attr("fill", "blue");