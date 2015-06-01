function chartAllRaces(){
  var margin = {top: 60, right: 20, bottom: 30, left: 40},
      width = 3000 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var x0 = d3.scale.ordinal()
      .rangeRoundBands([0, width], .05);

  var x1 = d3.scale.ordinal();

  var y = d3.scale.linear()
      .range([height, 0]);

  var color = d3.scale.ordinal()
      .range(["#c71d1d", "#11cc00", "#5a280d", "#0f68ff", "#fbfd01"]);

  var xAxis = d3.svg.axis()
      .scale(x0)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickFormat(d3.format(".2s"));

  // Define the line
	var valueline = d3.svg.line()
		//.interpolate("monotone")
		.x(function(d) { return x(d.name); })
		.y(function(d) { return y(d.value); });
    
  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
  // Create X Grid function
	/* function make_x_axis() {
		return d3.svg.axis()
			.scale(x0)
			.orient("bottom")}; */

	// Create Y Grid function
	function make_y_axis() {
		return d3.svg.axis()
			.scale(y)
			.orient("left")};
          
  // Get the data
  d3.csv("data_all_race.csv", function(error, data) {
    var ageNames = d3.keys(data[0]).filter(function(key) { return key !== "Age"; });

    data.forEach(function(d) {
      d.ages = ageNames.map(function(name) { return {name: name, value: +d[name]}; });
    });

    // Scale the range of the data
    x0.domain(data.map(function(d) { return d.Age; }));
    x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()]);
    y.domain([0, d3.max(data, function(d) { return d3.max(d.ages, function(d) { return d.value; }); })]);

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", margin.top - (height/2))  
        .attr("y", -margin.left) 
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Admitted Patients");
        
    // Add the X grid
		/* svg.append("g")
			.attr("class", "grid")
			.attr("transform", "translate(0," + height + ")")
			.call(make_x_axis()
				.tickSize(-height, 0, 0)
				.tickFormat("")
			); */

		// Add the Y grid
		svg.append("g")
			.attr("class", "grid")
			.call(make_y_axis()
				.tickSize(-width, 0, 0)
				.tickFormat("")
			);
        
    // Add title
		svg.append("text")
			.attr("x", (width / 2))             
			.attr("y", 20 - (margin.top / 2))
			.attr("text-anchor", "middle")  
			.style("font-size", "30px")  
			.style("font-family", "sans-serif")
			.text("Age Trend of All Ethnicities Combined");

    var age = svg.selectAll(".age")
        .data(data)
      .enter().append("g")
        .attr("class", "g")
        .attr("transform", function(d) { return "translate(" + x0(d.Age) + ",0)"; });

    age.selectAll("rect")
        .data(function(d) { return d.ages; })
      .enter().append("rect")
        .attr("width", x1.rangeBand()-1)
        .attr("x", function(d) { return x1(d.name); })
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .style("fill", function(d) { return color(d.name); });

    var legend = svg.selectAll(".legend")
        .data(ageNames.slice())
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .style("font-size", "10px")
        .style("font-family", "sans-serif")
        .text(function(d) { return d; });
        
  });
  
  return svg;
}