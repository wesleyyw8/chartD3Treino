var options = {
  margin: {
      top: 10,
      right: 50,
      bottom: 50,
      left: 50
  },
  width: $(".chart").width(),
  height: $(".chart").height()
};
var data = inicialValues();

var svg = d3.select(".chart")
.append("svg")
.attr('width', options.width)
.attr('height', options.height)
.style("background-color", 'white');

var scaleX = loadScaleX(data);
var scaleY = loadScaleY(data);
createAxes(data,scaleX, scaleY);
loadData(data,scaleX, scaleY);
createLegends();

function inicialValues(){
	var obj = [{x:0, y:12},{x:1, y:15},{x:2, y:2},{x:3, y:10}];
	for(var x=obj.length-1;x>-1;x--){
		$("#tableInputs tr").prepend('<td><input type="text" class="dataValues" value="'+obj[x].y+'"></td>');
	}
	return obj;
}
function loadScaleX(data){
	return d3.scale.linear().range([options.margin.left, options.width - options.margin.right]).domain([0,data.length -1]);
}
function loadScaleY(){
	return d3.scale.linear().range([options.height - options.margin.bottom, options.margin.top]).domain([0,d3.max(data, function(d){
		return d.y;
	})]);  
}
function loadData(data,xScale,yScale ){
	var lineGen = d3.svg.line()
	.x(function(d) {
	    return xScale(d.x);
	})
	.y(function(d) {
	    return yScale(d.y);
	})
	.interpolate("linear");

	//create
	if ($(".linePath").length == 0){
		svg.append('path')
		    .attr('d', lineGen(data))
		    .attr('class', 'linePath')
		    .attr('stroke', 'black')
		    .attr('stroke-width', 1)
		    .attr('fill', 'none');
	}else{ //update
		svg.select(".linePath")   // change the line
			.transition()
      .duration(750)
      .attr("d", lineGen(data))
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .attr('fill', 'none');
    /*svg.select(".xaxis") // change the x axis
      .duration(750)
      .call();
    svg.select(".xaxis") // change the y axis
      .duration(750)
      .call();*/
	}
	//createCircles(data,'black');
}
function createLegends(){
	//legend of the x line
	svg.append("text")
    .attr("text-anchor", "middle") 
    //.style("font-weight", "bold")
    .attr("transform", "translate("+ (options.width/2) +","+(options.height-4)+")")  // centre below axis
    .text("Valores de x");

	//legend of the y line
	svg.append("text")
    //.style("font-weight", "bold")
    .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
    .attr("transform", "translate("+ 10 +","+((options.height- options.margin.top -20)/2)+")rotate(-90)")
    .text("Valores de y");
}
function createAxes(data,xScale,yScale ){
	var xAxis = d3.svg.axis().scale(xScale).ticks(data.length);
	var yAxis = d3.svg.axis().scale(yScale).orient("left").tickFormat(tickFormat).ticks(data.length);

	//minus 6 to fix a white gap between the xAxis and the yAxis
	if ($(".xaxis").length == 0){
		svg.append("g")
			.attr("transform", "translate(-6," + (options.height - options.margin.bottom + 0) + ")")
			.attr("class","xaxis")
			.call(xAxis);
	}else
		svg.select(".xaxis").transition().duration(750).call(xAxis);	
	if ($(".yaxis").length == 0){
		svg.append("g")
			.attr("transform", "translate(" + (options.margin.left) + ","+0+")")
			.attr("class","yaxis")
			.call(yAxis);
	}else
		svg.select(".yaxis").transition().duration(750).call(yAxis);		

	function tickFormat(val){
		if (val > 0)
			return val;
	}
}
function getValuesInputs(){
	var result = [];
	$.each($("input.dataValues"),function(index,val){
		if (val.value != ""){
			if (isNaN(val.value) == false){
				result.push({
					x:index,
					y:parseInt(val.value)
				});
			}
		}
	});
	return result;
}

$("#btnOk").click(function(){
	data = getValuesInputs();
	var scaleX = loadScaleX(data);
	var scaleY = loadScaleY(data);
	createAxes(data,scaleX, scaleY);
	loadData(data,scaleX, scaleY);
});

$("#btnAdd").click(function(){
	var lastRowIndex = $("#tableInputs tr").length-1;
	if ($($("#tableInputs tr")[lastRowIndex]).find("td").length == 4)
		$("#tableInputs").append("<tr></tr>");

		$($("#tableInputs tr")[$("#tableInputs tr").length-1]).append('<td><input type="text" class="dataValues"></td>');
});