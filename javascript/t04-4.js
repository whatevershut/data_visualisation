/* Stub: will draw the chart in T04-5 
function createBarChart(data) {
    console.log("createBarChart received", data.length, "rows");
  }
  /* Load CSV, Convert Type, Quick Check */
 d3.csv("data/tvBrandCount.csv", d => ({
  brand: d.brand,
  count: +d.count
  })).then(data => {
  // Quick check
  console.log(data); // whole array
  console.log("rows:", data.length);
  console.log("max:", d3.max(data, d => d.count));
  console.log("min:", d3.min(data, d => d.count));
  console.log("extent:", d3.extent(data, d => d.count)); // [min, max]
  //Optional: sort for easier reading (descending by count)
  data.sort((a, b) => d3.descending(a.count, b.count));
  // Hand off to the chart builder (implemented next exercise)
  createBarChart(data);
  });
  

  //SVG CANVAS 
  const createBarChart = (data) => {
    const svg = d3.select(".responsive-svg-container")
    .append("svg")
    .attr("viewBox", "0 0 1200 400")
    .style("border", "1px solid black");
    svg
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("class", d => {
    console.log(d); //inspect each row in the Console
    return `bar bar-${d.count}`; //"bar bar-859"
    });
    };
    