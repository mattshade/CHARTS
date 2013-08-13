
var yAxisIndex

//add prepend ability
Element.prototype.prependChild = function(child) { this.insertBefore(child, this.firstChild); };

//A default configuration 
//Should change to more d3esque methods e.g. http://bost.ocks.org/mike/chart/
var chartConfig = {
	container: "#chartContainer",
	editable: true,
	legend: true,
	title: "",
	colors: ["#ff4cf4","#ffb3ff","#e69ce6","#cc87cc","#b373b3","#995f99","#804c80","#665266","#158eff","#99cdff","#9cc2e6","#87abcc","#7394b3","#5f7d99","#466780","#525c66"],
	padding :{
		top: 25,
		bottom: 80,
		left: 10,
		right: 10
	},
	xAxis: {
		domain: [0,100],
		prefix: "",
		suffix: "",
		type: "linear",
		formatter: null,
		mixed: true,
		ticks: 5
	},
	yAxis: [
		{
			domain: [null,null],
			tickValues: null,
			prefix: {
				value: "",
				use: "top" //can be "top" "all" "positive" or "negative"
			},
			suffix: {
				value: "",
				use: "top"
			},
			ticks: 4,
			formatter: null,
			color: null
		}
	],
	series: [
		{
			name: "names",
			data: ["juicyness","color","flavor","travelability"],
			source: "Some Org",
			type: "line",
			axis: 0,
			color: null
		},
		{
			name: "apples",
			data: [5.5,10.2,6.1,3.8],
			source: "Some Org",
			type: "line",
			axis: 0,
			color: null
		},
		{
			name: "oranges",
			data: [23,10,13,7],
			source: "Some Org",
			type: "line",
			axis: 0,
			color: null
		}
	],
	xAxisRef: [
		{
			data: []
		}
	],
	sourceline: "",
	creditline: "Quartz | qz.com"
}

var Gneiss = {
	longMonths: ["January","February","March","April","May","June","July","August","September","October","November","December"],
	shortMonths: ["Jan.","Feb.","March","April","May","June","July","Aug.","Sept.","Oct.","Nov.","Dec."],
	dateParsers: {
		"mmddyyyy": function(d) {return [d.getMonth()+1,d.getDate(),d.getFullYear()].join("/");},
		"mmdd": function(d) {return [d.getMonth()+1,d.getDate()].join("/")},
		"Mdd": function(d){
			return Gneiss.shortMonths[d.getMonth()] +" "+ Number(d.getDate())
		},
		"mmyy": function(d) {return [d.getMonth()+1,String(d.getFullYear()).split("").splice(2,2).join("")].join("/")},
		"yy": function(d) {return "’"+String(d.getFullYear()).split("").splice(2,2).join("")},
		"yyyy": function(d) {return d.getFullYear()},
		"MM": function(d) {
			if(d.getMonth() == 0) {
				return d.getFullYear();
			}
			else {
				return Gneiss.longMonths[d.getMonth()]
			}
			
		},
		"M": function(d) {	
			if(d.getMonth() == 0){
				return "’"+String(d.getFullYear()).split("").splice(2,2).join("")
			} 
			else { 
				return Gneiss.shortMonths[d.getMonth()]
			}
		},
		"hmm": function(d) {var hours = d.getHours(), min = d.getMinutes(); hours = hours==0 ? 12 : hours ; return (hours > 12 ? hours-12 : hours) + ":" + (min < 10 ? "0"+min : min)},
	},
	build: function(config) {
		/*
			Initializes the chart from a config object
		*/
		var g = config
		this.g = config 
		//set container as a jquery object
		g.$container = $(g.container);
		g.all = this;
		
		g.defaults =  {}
		g.defaults.padding = $.extend({}, config.padding); //change
		
		//append svg to container using svg
		g.chart = d3.select(g.container).append("svg")
			.attr("id","chart")
			.attr("width","100%") //set width to 100%
			.attr("height","100%") //set height to 100%
			
		g.width = g.$container.width() //save the width in pixels
		g.height = g.$container.height() //save the height in pixels
		
		//add rect, use as a background to prevent transparency
		g.chart.append("rect")
			.attr("id","ground")
			.attr("width",g.width)
			.attr("height",g.height)
				
		
		//group the series by their type
		this.g.sbt = this.splitSeriesByType(this.g.series);
		this.calculateColumnWidths()
			.setYScales(true)
			.setXScales(true)
			.setYAxes(true)
			.setXAxis(true);
		
		
		g.titleLine = g.chart.append("text")
			.attr("y",18)
			.attr("x", g.padding.left)
			.attr("id","titleLine")
			.text(g.title)
		
		this.drawSeriesAndLegend(true);
		
		g.metaInfo = g.chart.append("g")
			.attr("id","metaInfo")
			.attr("transform","translate(0,"+(g.height-4)+")")
		
		g.creditLine = g.metaInfo.append("text")
						.attr("id","cnbc-logo")
							.attr("text-anchor","end")
							.attr("x",g.width-g.padding.right)
							.attr("class","metaText")
							.text(g.creditLine)
			
			
			// .attr("xmlns","http://www.w3.org/2000/svg")
			// 			.attr("xlink:href","http://fm.cnbc.com/applications/cnbc.com/resources/styles/skin/DATA-VISUALIZATION/CHART-BUILDER/img/cnbc-logo-charts.png")
			// 			.attr("x","400")
			// 			.attr("y","-15")
			// 			.attr("width","99px")
			// 			.attr("height","15px")
			// 			.text(g.creditLine)
			
			// var cnbc_logo ='<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="88px" height="15px" viewBox="0 0 88 15" enable-background="new 0 0 88 15" xml:space="preserve"><g opacity="0.6"><g><g><g><path fill="#333333" d="M37.368,6.992c-0.217-1.077-1.103-1.364-2.097-1.453c-3.2-0.298-3.768,2.094-3.768,3.105c0,1.727,0.501,3.154,3.65,3.154c0.58,0,2.178-0.594,2.178-1.562h4.525c-0.185,2.875-5.021,3.559-7.127,3.559c-4.375,0-8.116-0.811-7.936-5.113c0.131-3.067,3.034-5.226,8.812-5.094c3.221,0.077,6.312,1.083,6.329,3.404H37.368z"/><path fill="#333333" d="M82.674,6.992c-0.225-1.077-1.111-1.364-2.1-1.453c-3.199-0.298-3.771,2.094-3.771,3.105c0,1.727,0.506,3.154,3.645,3.154c0.584,0,2.188-0.594,2.188-1.562h4.521c-0.184,2.875-5.02,3.559-7.131,3.559c-4.367,0-8.111-0.811-7.932-5.113c0.131-3.067,3.037-5.226,8.812-5.094c3.219,0.077,6.312,1.083,6.326,3.404H82.674z"/><path fill="#333333" d="M42.746,3.798h5.866l5.012,7.017h0.039V3.798h3.762v9.747h-5.625l-5.256-7.02h-0.037v7.02h-3.76V3.798z"/><path fill="#333333" d="M58.586,3.798h7.129c3.43,0,5.449,0.953,5.449,2.4c0,0.854-0.846,1.907-2.727,2.218v0.031c2.264,0.131,3.1,1.561,3.1,2.416c0,1.723-1.963,2.682-5.797,2.682h-7.154V3.798zM62.713,7.578h1.184c1.818,0,2.787-0.137,2.787-0.896c0-0.806-0.801-1.079-2.443-1.079h-1.527V7.578z M62.713,11.5h1.184c2.197,0,3.002-0.234,3.002-0.986c0-0.814-1.016-1.08-2.658-1.08h-1.527V11.5z"/> </g> </g> <path fill="#333333" d="M13.981,10.348l-0.986-6.213c-0.05-0.377,0.232-0.592,0.668-0.877c0.102-0.066,0.197-0.129,0.285-0.195l0.087-0.067l-0.021-0.108c-0.033-0.163-0.167-0.211-0.232-0.234c-0.012-0.004-0.023-0.007-0.034-0.013l-0.04-0.023L13.652,2.61l-0.854-0.009c0.054-0.729,0.477-1.382,1.127-1.728c0.297-0.172,0.647-0.262,1.018-0.262c0.528,0,1.043,0.18,1.411,0.496c0.288,0.257,0.493,0.529,0.608,0.806c0.363,0.733,0.106,1.656-0.223,2.227l-0.004,0.008L16.73,4.156L13.981,10.348L13.981,10.348z"/><path fill="#333333" d="M10.644,10.369l-0.073-0.148L7.539,3.458C7.291,2.681,7.511,1.83,8.113,1.237C8.49,0.853,9.038,0.634,9.618,0.634c0.29,0,0.578,0.057,0.833,0.165c0.428,0.182,0.811,0.512,1.051,0.907c0.254,0.474,0.345,0.937,0.273,1.405L10.644,10.369L10.644,10.369z"/><path fill="#333333" d="M14.312,12.113l3.19-7.2c0.393-0.695,1.123-1.119,1.943-1.119c0.11,0,0.222,0.007,0.333,0.022c0.671,0.123,1.294,0.573,1.581,1.146c0.362,0.616,0.305,1.605-0.122,2.215c-0.196,0.314-0.481,0.508-0.783,0.715c-0.108,0.074-0.216,0.146-0.319,0.225L14.312,12.113L14.312,12.113z"/><path fill="#333333" d="M10.305,12.125L3.746,7.607c-0.65-0.551-0.913-1.381-0.688-2.213c0.169-0.637,0.694-1.22,1.307-1.45c0.25-0.092,0.514-0.139,0.78-0.139c0.8,0,1.54,0.431,1.93,1.125L10.305,12.125L10.305,12.125z"/><path fill="#333333" d="M14.227,13.449l5.789-4.027c0.309-0.199,0.733-0.314,1.16-0.314c0.317,0,0.618,0.062,0.867,0.182c0.461,0.182,0.926,0.643,1.141,1.123c0.315,0.666,0.201,1.607-0.263,2.191c-0.455,0.551-1.055,0.842-1.733,0.842h-0.058L14.227,13.449L14.227,13.449z"/><path fill="#333333" d="M10.374,13.449l-6.898-0.004H3.414c-0.678,0-1.278-0.291-1.734-0.844c-0.463-0.582-0.578-1.521-0.264-2.186c0.219-0.484,0.683-0.945,1.131-1.123C2.808,9.17,3.108,9.107,3.426,9.107c0.426,0,0.851,0.115,1.167,0.318L10.374,13.449L10.374,13.449z"/> </g><rect y="-0.314" fill="none" width="88.193" height="15.314"/></g></svg>';
			// 			g.creditLine = g.metaInfo.append(cnbc_logo)
				
				// xmlns="http://www.w3.org/2000/svg"
				
			
			//<image xlink:href="18/135160/86183.png" x="0" y="0" width="256" height="256"></image
		
		g.sourceLine = g.metaInfo.append("text")
			.attr("x",g.padding.left)
			.attr("class","metaText")
			.text(g.sourceline)
			
					
		this.g = g;
		return this;
	},
	numberFormat: d3.format(","),
	resize: function(){
		/*
			Adjusts the size dependent stored variables
		*/
		var g = this.g
		g.width = g.$container.width() //save the width in pixels
		g.height = g.$container.height() //save the height in pixels
		//put a background rect to prevent transparency
		d3.select("rect#ground")
			.attr("width",g.width)
			.attr("height",g.height)
			
		g.metaInfo.attr("transform","translate(0,"+(g.height-4)+")")
		
		this.g = g;
		return this
	},
	setYScales: function(first) {
		/*
			calculates and saves the y-scales from the existing data
		*/
		var g = this.g
		/*
		*
		* Y AXIS SECTION
		*
		*/	
		//calculate number of yaxes and their maxes and mins
		var axisIndex = 0;
		var extremes = [], ex;
		for (var i = g.series.length - 1; i >= 0; i--){
			
			//CHANGE if there is no axis set to 0
			if(!g.series[i].axis) {
				g.series[i].axis = 0;
			}
			
			
			axisIndex = g.series[i].axis;
			
			
			//CHANGE check if there are any extremes for the current axis
			if(extremes[axisIndex] === undefined) {
				extremes[axisIndex] = []
			}
			
			
			if(g.yAxis[axisIndex] === undefined) {
				console.error(g.series[i].name + " ["+i+"] is associated with axis " + axisIndex + ", but that axis does not exist")
			}
			
			//calculate extremes of current series and add them to extremes array
			e = d3.extent(g.series[i].data)
			extremes[axisIndex].push(e[0])
			extremes[axisIndex].push(e[1])
		};
		
		for (var i = extremes.length - 1; i >= 0; i--){
			var ex = d3.extent(extremes[i])
			if(g.yAxis[i].domain[0] == null) {
				g.yAxis[i].domain[0] = ex[0]
			}
			
			if(g.yAxis[i].domain[1]  == null) {
				g.yAxis[i].domain[1] = ex[1]
			}
		};
		
			//set extremes in y axis objects and create scales
			for (var i = g.yAxis.length - 1; i >= 0; i--){
				//g.yAxis[i].domain = d3.extent(extremes[i])
				if(first || !g.yAxis[i].scale) {
					g.yAxis[i].scale = d3.scale.linear()
						.domain(g.yAxis[i].domain)
				}
				else {
					//set extremes in y axis objects and update scales
					g.yAxis[i].domain = d3.extent(g.yAxis[i].domain)
					g.yAxis[i].scale
						.domain(g.yAxis[i].domain)
				}
				
					
			};
			
		
		if(g.isBargrid) {
			for (var i = g.yAxis.length - 1; i >= 0; i--){
				g.yAxis[i].domain[0] = Math.min(g.yAxis[i].domain[0],0)
				g.yAxis[i].scale.range([
					g.padding.left,
					(g.width/g.sbt.bargrid.length) - g.padding.right
					]).nice()
					
			};
		}
		else {
			for (var i = g.yAxis.length - 1; i >= 0; i--){
				g.yAxis[i].scale.range([
					g.height - g.padding.bottom,
					g.padding.top
					]).nice()
			};
		}
		
		this.g = g;
		return this
	},
	setPadding: function() {
		/*
			calulates and stores the proper amount of extra padding beyond what the user specified (to account for axes, titles, legends, meta)
		*/
		var g = this.g
		var padding_top = g.defaults.padding.top,
		padding_bottom = g.defaults.padding.bottom;
		
		if(!g.legend) {
			padding_top = 5;
		}
		padding_top += g.title == "" || g.series.length == 1 ? 0:25
		padding_top += (g.yAxis.length == 1 && !g.isBargrid) ? 0:25
		
		if(g.isBargrid) {
			padding_top += -15
			padding_bottom -= 15 
		}
		
		g.padding.top = padding_top
		g.padding.bottom = padding_bottom
		this.g = g
		return this
	},
	setXScales: function(first) {
		/*
			calculate and store the x-scales
		*/
		var g = this.g
		var dateExtent, shortestPeriod = Infinity;
		if(first) {
			//create x scales
			
			/*
			*
			* X AXIS SECTION
			*
			*/

			//calculate extremes of axis
			if(g.xAxis.type == "date") {
				dateExtent = d3.extent(g.xAxisRef[0].data);
				g.xAxis.scale = d3.time.scale()
					//.domain(Gneiss.multiextent(g.series,function(d){return d.data}))
					.domain(dateExtent)
				
				//calculate smallest gap between two dates
				for (var i = g.xAxisRef[0].data.length - 2; i >= 0; i--){
					shortestPeriod = Math.min(shortestPeriod, Math.abs(g.xAxisRef[0].data[i] - g.xAxisRef[0].data[i+1]))
				}
				
				g.maxLength = Math.abs(Math.floor((dateExtent[0] - dateExtent[1]) / shortestPeriod))
			}
			else {

				//calculate longest series and store series names
				var maxLength = 0;
				for (var i = g.series.length - 1; i >= 0; i--){
					maxLength = Math.max(maxLength, g.series[i].data.length)
				};
				g.xAxis.scale = d3.scale.ordinal()
					.domain(g.xAxisRef[0].data)
					
				g.maxLength = maxLength;
			}
			
		}
		else {
			//update the existing scales

			//calculate extremes of axis
			if(g.xAxis.type == "date") {
				dateExtent = d3.extent(g.xAxisRef[0].data);
				g.xAxis.scale = d3.time.scale()
					//.domain(Gneiss.multiextent(g.series,function(d){return d.data}))
					.domain(dateExtent)
					
				//calculate smallest gap between two dates
				for (var i = g.xAxisRef[0].data.length - 2; i >= 0; i--){
					shortestPeriod = Math.min(shortestPeriod, Math.abs(g.xAxisRef[0].data[i] - g.xAxisRef[0].data[i+1]))
				}
				
				g.maxLength = Math.abs(Math.floor((dateExtent[0] - dateExtent[1]) / shortestPeriod))
			}
			else {

				//calculate longest series
				var maxLength = 0;
				for (var i = g.series.length - 1; i >= 0; i--){
					maxLength = Math.max(maxLength, g.series[i].data.length)
				};
				g.xAxis.scale.domain(g.xAxisRef[0].data)
				
				g.maxLength = maxLength;
			}
		}
		var rangeArray = []
		//set the range of the x axis
		if(g.isBargrid) {
			rangeArray = [
				g.padding.top,
				g.height - g.padding.bottom
			]
		}
		else if (g.xAxis.hasColumns) {
			rangeArray = [
				g.padding.left + this.g.columnGroupWidth/2 + (g.yAxis.length==1?0:this.g.columnGroupWidth/2),
				g.width - g.padding.right - this.g.columnGroupWidth
				] 
			//g.xAxis.scale.range([g.padding.left + this.g.columnGroupWidth/2,g.width - g.padding.right - (10* (Math.round(this.g.yAxis[0].domain[1]*3/4*100) + "").length )]) 
		}
		else {
			rangeArray = [g.padding.left,g.width - g.padding.right]
			//g.xAxis.scale.range([g.padding.left,g.width - g.padding.right])
		};
		
		if(g.xAxis.type == "date") {
			g.xAxis.scale.range(rangeArray);
		}
		else {
			g.xAxis.scale.rangePoints(rangeArray);
		}
		
		this.g = g;
		return this
		
	},
	setLineMakers: function(first) {
		var g = this.g

		for (var i = g.yAxis.length - 1; i >= 0; i--){
			if(first || !g.yAxis[i].line) {
						g.yAxis[i].line = d3.svg.line();
						g.yAxis[i].line.y(function(d,j){return d?g.yAxis[yAxisIndex].scale(d):null})
						g.yAxis[i].line.x(function(d,j){return d?g.xAxis.scale(g.xAxisRef[0].data[j]):null})
			}
			else {
				for (var i = g.yAxis.length - 1; i >= 0; i--){
					g.yAxis[i].line.y(function(d,j){return d?g.yAxis[yAxisIndex].scale(d):null})
					g.yAxis[i].line.x(function(d,j){return d?g.xAxis.scale(g.xAxisRef[0].data[j]):null})
				};
			}

		};
		this.g = g
		return this
	},
	setYAxes: function(first) {
		/*
		*
		* Y-Axis Drawing Section
		*
		*/
		var g = this.g;
		var curAxis,axisGroup;
		
		//CHANGE
		if(g.yAxis.length == 1 ){
			d3.select("#leftAxis").remove()
		}

		for (var i = g.yAxis.length - 1; i >= 0; i--){
			curAxis = g.yAxis[i]
			
			//create svg axis
			if(first || !g.yAxis[i].axis) {	
				g.yAxis[i].axis = d3.svg.axis()
					.scale(g.yAxis[i].scale)
					.orient(i==0?"right":"left")
					.tickSize(g.width - g.padding.left - g.padding.right)
					//.ticks(g.yAxis[0].ticks) // I'm not using built in ticks because it is too opinionated
					.tickValues(g.yAxis[i].tickValues?g.yAxis[i].tickValues:this.helper.exactTicks(g.yAxis[i].scale.domain(),g.yAxis[i].ticks))
					
				//append axis container

				axisGroup = g.chart.append("g")
					.attr("class","axis yAxis")
					.attr("id",i==0?"rightAxis":"leftAxis")
					.attr("transform",i==0?"translate("+g.padding.left+",0)":"translate("+(g.width-g.padding.right)+",0)")
					.call(g.yAxis[i].axis)
			}
			else {
				g.yAxis[i].axis//.ticks(g.yAxis[0].ticks) // I'm not using built in ticks because it is too opinionated
					.tickValues(g.yAxis[i].tickValues?g.yAxis[i].tickValues:this.helper.exactTicks(g.yAxis[i].scale.domain(),g.yAxis[i].ticks))
					
				axisGroup = g.chart.selectAll(i==0?"#rightAxis":"#leftAxis")
					.call(g.yAxis[i].axis)
				
			}
				
			//adjust label position and add prefix and suffix
			var topAxisLabel, minY = Infinity;
			
			this.customYAxisFormat(axisGroup,i)
			
			
			axisGroup
				.selectAll("g")
				.each(function(d,j) {
					//create an object to store axisItem info
					var axisItem = {}
					
					//store the position of the axisItem
					//(figure it out by parsing the transfrom attribute)
					axisItem.y = parseFloat(d3.select(this)
						.attr("transform")
							.split(")")[0]
								.split(",")[1]
						)
					
					//store the text element of the axisItem
					axisItem.text = d3.select(this).select("text")

					//store the line element of the axisItem	
					axisItem.line = d3.select(this).select("line")
						.attr("stroke","#E6E6E6")
						
					
					//apply the prefix as appropriate
					switch(curAxis.prefix.use) {
						case "all":
							//if the prefix is supposed to be on every axisItem label, put it there
							axisItem.text.text(curAxis.prefix.value + axisItem.text.text())
						break;
						
						case "positive":
							//if the prefix is supposed to be on positive values and it's positive, put it there
							if(parseFloat(axisItem.text.text()) > 0) {
								axisItem.text.text(curAxis.prefix.value + axisItem.text.text())
							}
						break;
						
						case "negative":
							//if the prefix is supposed to be on negative values and it's negative, put it there
							if(parseFloat(axisItem.text.text()) < 0) {
								axisItem.text.text(curAxis.prefix.value + axisItem.text.text())
							}
						break;
						
						case "top":
							//do nothing
						break;
					}
					
					//apply the suffix as appropriate
					switch(curAxis.suffix.use) {
						case "all":
							//if the suffix is supposed to be on every axisItem label, put it there
							axisItem.text.text(axisItem.text.text() + curAxis.suffix.value)
						break;

						case "positive":
							//if the suffix is supposed to be on positive values and it's positive, put it there
							if(parseFloat(axisItem.text.text()) > 0) {
								axisItem.text.text(axisItem.text.text() + curAxis.suffix.value)
							}
						break;

						case "negative":
							//if the suffix is supposed to be on negative values and it's negative, put it there
							if(parseFloat(axisItem.text.text()) < 0) {
								axisItem.text.text(axisItem.text.text() + curAxis.suffix.value)
							}
						break;

						case "top":
							//do nothing
						break;
					}
					
					//find the top most axisItem
					//store its text element
					if(axisItem.y < minY) {
						topAxisLabel = axisItem.text
						g.topAxisItem = axisItem
						minY = axisItem.y
					}
					
					//if the axisItem represents the zero line
					//change it's color and make sure there's no decimal
					if(parseFloat(axisItem.text.text()) == 0) {
						axisItem.line.attr("stroke","#666666")
						axisItem.text.text("0")
					}
				})
				
			//add the prefix and suffix to the top most label as appropriate
			if(curAxis.suffix.use == "top" && curAxis.prefix.use == "top") {
				//both preifx and suffix should be added to the top most label
				if(topAxisLabel) {
					topAxisLabel.text(g.yAxis[i].prefix.value + topAxisLabel.text() + g.yAxis[i].suffix.value)
				}
				else {
					
				}
				
			}
			else if (curAxis.suffix.use == "top") {
				//only the suffix should be added (Because the prefix is already there)
				topAxisLabel.text(topAxisLabel.text() + g.yAxis[i].suffix.value)
			}
			else if(curAxis.prefix.use == "top") {
				//only the prefix should be added (Because the suffix is already there)
				topAxisLabel.text(g.yAxis[i].prefix.value + topAxisLabel.text())
			}
			
		};
		
		if(g.isBargrid){
			d3.selectAll(".yAxis").style("display","none")
			g.titleLine.attr("y",g.padding.top - 36)
			
		}
		else {
			//isn't a bargrid
			d3.selectAll(".yAxis").style("display",null)
			
			if(g.yAxis.length==1) {
				//only has one axis
				try{
					if(!g.legend || g.series.length == 1) {
						//no legend or only one seriesgit 
						g.titleLine.attr("y",g.topAxisItem.y - 4)
					}
					else {
						g.titleLine.attr("y",g.topAxisItem.y - 25)
					}
				}catch(e){} //fail silently
					
			}
			else {
				try{
					g.titleLine.attr("y",g.padding.top - 36)
				}catch(e){} //fail silently
			}
		}
		
		d3.selectAll(".yAxis").each(function(){this.parentNode.prependChild(this);})
		d3.selectAll("#ground").each(function(){this.parentNode.prependChild(this);})
		this.g = g
		return this
		
	},
	customYAxisFormat: function(axisGroup,i) {
		//replace at your whim
	},
	setXAxis: function(first) {
		var g = this.g
		if(first) {
			/*
			*
			* X-Axis Drawing Section
			*
			*/
			g.xAxis.axis = d3.svg.axis()
				.scale(g.xAxis.scale)
				.orient(g.isBargrid?"left":"bottom")
				.tickFormat(g.xAxis.formatter ? this.dateParsers[g.xAxis.formatter] : function(d) {return d})
				.ticks(g.xAxis.ticks)
				
			if(g.xAxis.type == "date") {
				
				switch(g.xAxis.formatter) {
				   // "mmddyyyy":
				   // "mmdd"
					case "yy":
						g.xAxis.axis.ticks(d3.time.years,1)
					break;
					
					case "yyyy":
						g.xAxis.axis.ticks(d3.time.years,1)
					break;
					
					case "MM":
						g.xAxis.axis.ticks(d3.time.months,1)
					break;
					
					case "M":
						g.xAxis.axis.ticks(d3.time.months,1)
					break;
				   // "hmm"

					case "YY":
						g.xAxis.axis.ticks(d3.time.years,1)
					break;
				}
			}
			
			g.chart.append("g")
				.attr("class",'axis')
				.attr("id","xAxis")
				.attr("transform",g.isBargrid?"translate("+g.padding.left+",0)":"translate(0,"+(g.height - g.padding.bottom + 8)+")")
				.call(g.xAxis.axis)
				
			
		}
		else {
			g.xAxis.axis.scale(g.xAxis.scale)
				.tickFormat(g.xAxis.formatter ? this.dateParsers[g.xAxis.formatter] : function(d) {return d})
				.ticks(g.isBargrid?g.series[0].data.length:g.xAxis.ticks)
				.orient(g.isBargrid?"left":"bottom")
			
			if(g.xAxis.type == "date") {
				var timeSpan = g.xAxis.scale.domain()[1]-g.xAxis.scale.domain()[0],
				months = timeSpan/2592000000,
				years = timeSpan/31536000000;
				
				if(years > 20) {
					yearGap = 5;
				}
				else {
					yearGap = 1;
				}
				switch(g.xAxis.formatter) {
				   // "mmddyyyy":
				   // "mmdd"
					case "yy":
						g.xAxis.axis.ticks(d3.time.years,yearGap)
					break;
					
					case "yyyy":
						g.xAxis.axis.ticks(d3.time.years,yearGap)
					break;
					
					case "MM":
						g.xAxis.axis.ticks(d3.time.months,1)
					break;
					
					case "M":
						g.xAxis.axis.ticks(d3.time.months,1)
					break;
				   // "hmm"

					case "YY":
						g.xAxis.axis.ticks(d3.time.years,1)
					break;
				}
			}
			
			g.chart.selectAll("#xAxis")
				.attr("transform",g.isBargrid?"translate("+g.padding.left+",0)":"translate(0,"+(g.height - g.padding.bottom + 8)+")")
				.call(g.xAxis.axis)
		}
		
		g.chart.selectAll("#xAxis text")
			.attr("text-anchor", g.xAxis.type == "date" ? "start": (g.isBargrid ? "end":"middle"))
			//.attr("text-anchor", g.isBargrid ? "end":"middle")
			.each(function() {
				var pwidth = this.parentNode.getBBox().width
				var attr = this.parentNode.getAttribute("transform")
				var attrx = Number(attr.split("(")[1].split(",")[0])
				var attry = Number(attr.split(")")[0].split(",")[1])
				if(!g.isBargrid) {
					// fix labels to not fall off edge when not bargrid
					if (pwidth/2 + attrx > g.width) {
						this.setAttribute("x",Number(this.getAttribute("x"))-(pwidth + attrx - g.width + g.padding.right))
						this.setAttribute("text-anchor","start")
					}
					else if (attrx - pwidth/2 < 0) {
						this.setAttribute("text-anchor","start")
					}
					g.padding.left = g.defaults.padding.left
				}
				else {
					//adjust padding for bargrid
					if(g.padding.left - pwidth < g.defaults.padding.left) {
						g.padding.left = pwidth + g.defaults.padding.left;
						g.all.redraw() //CHANGE (maybe)
					}
					
				}
				
			})
		
		this.g = g
		return this
	},
	calculateColumnWidths: function() {
		/*
			Calculate the propper column width for column charts
		*/
		
		var g = this.g
		//store split by type for convenience
		var sbt = g.sbt
		
		
		//determine the propper column width
		//								---- Width of chart area ----------     -Num Data pts-  -Num Column Series-
		var columnWidth = Math.floor(((g.width-g.padding.right-g.padding.left) / g.maxLength) / sbt.column.length) - 3;
		//make sure width is >= 1
		columnWidth = Math.max(columnWidth, 1);
		columnWidth = Math.min(columnWidth, (g.width-g.padding.right-g.padding.left) * 0.075)
		var columnGroupShift = columnWidth + 1;
		
		this.g.columnWidth = columnWidth;
		this.g.columnGroupWidth = (columnWidth + 1) * sbt.column.length;
		this.g.columnGroupShift = columnWidth +1;
		
		return this
	},
	drawSeriesAndLegend: function(first){
		this.drawSeries(first)
		this.drawLegend()
		return this
	},
	drawSeries: function(first) {
		/*
		*
		* Series Drawing Section
		*
		*/
		var g = this.g
		
		var lineSeries;
		
		//construct line maker helper functions for each yAxis
		this.setLineMakers(first)
		
		//store split by type for convenience
		var sbt = g.sbt
		
		var columnWidth = this.g.columnWidth;
		var columnGroupShift = this.g.columnGroupShift;
		
		
		if(first) {
			
			//create a group to contain series
			g.seriesContainer = g.chart.append("g")
				.attr("id","seriesContainer")
				
				
			lineSeries = g.seriesContainer.selectAll("path");
			columnSeries = g.seriesContainer.selectAll("g.seriesColumn")
			var columnGroups
			var columnRects
			var lineSeriesDots = g.seriesContainer.selectAll("g.lineSeriesDots")
			var scatterSeries = g.seriesContainer.selectAll("g.seriesScatter")
			
			
				
			//create a group to contain the legend items
			g.legendItemContainer = g.chart.append("g")
				.attr("id","legendItemContainer")
				
				//add columns to chart
				columnGroups = columnSeries.data(sbt.column)
					.enter()
					.append("g") 
						.attr("class","seriesColumn seriesGroup")
						.attr("fill",function(d,i){return d.color? d.color : g.colors[i+sbt.line.length]})
						.attr("transform",function(d,i){return "translate("+(i*columnGroupShift - (columnGroupShift * (sbt.column.length-1)/2))+",0)"})
						
				columnGroups.selectAll("rect")
					.data(function(d,i){return d.data})
					.enter()
						.append("rect")
						.attr("width",columnWidth)
						.attr("height", function(d,i) {yAxisIndex = d3.select(this.parentElement).data()[0].axis; return Math.abs(g.yAxis[yAxisIndex].scale(d)-g.yAxis[yAxisIndex].scale(Gneiss.helper.columnXandHeight(d,g.yAxis[yAxisIndex].scale.domain())))})
						.attr("x", function(d,i) {
							return g.xAxis.scale(g.xAxisRef[0].data[i])  - columnWidth/2
							})
						.attr("y",function(d,i) {yAxisIndex = d3.select(this.parentElement).data()[0].axis; return (g.yAxis[yAxisIndex].scale(d)-g.yAxis[yAxisIndex].scale(Gneiss.helper.columnXandHeight(d,g.yAxis[yAxisIndex].scale.domain()))) >= 0 ? g.yAxis[yAxisIndex].scale(Gneiss.helper.columnXandHeight(d,g.yAxis[yAxisIndex].scale.domain())) : g.yAxis[yAxisIndex].scale(d)})
				
				
				
				//add lines to chart
				lineSeries.data(sbt.line)
					.enter()
					.append("path")
						.attr("d",function(d,j) { yAxisIndex = d.axis; pathString = g.yAxis[d.axis].line(d.data).split("L0,0L").join("M");  return pathString.indexOf("NaN")==-1?pathString:"M0,0"})
						.attr("class","seriesLine seriesGroup")
						.attr("stroke",function(d,i){return d.color? d.color : g.colors[i]})
						.attr("stroke-width",3)
						.attr("stroke-linejoin","round")
						.attr("stroke-linecap","round")
						.attr("fill","none")
				
				lineSeriesDotGroups = lineSeriesDots.data(sbt.line)
					.enter()
					.append("g")
					.attr("class","lineSeriesDots seriesGroup")
					.attr("fill", function(d,i){return d.color? d.color : g.colors[i]})
				
				lineSeriesDotGroups
					.filter(function(d){return d.data.length < 15})
					.selectAll("circle")
					.data(function(d){ return d.data})
					.enter()
						.append("circle")
						.attr("r",4)
						.attr("transform",function(d,i){
							yAxisIndex = d3.select(this.parentElement).data()[0].axis; 
							return "translate("+(g.xAxis.type=="date" ?
								g.xAxis.scale(Gneiss.g.xAxisRef[0].data[i]):
								g.xAxis.scale(i)) + "," + g.yAxis[yAxisIndex].scale(d) + ")"
							})
							
				
				//add scatter to chart
				scatterGroups = scatterSeries.data(sbt.scatter)
					.enter()
					.append("g")
					.attr("class","seriesScatter seriesGroup")
					.attr("fill", function(d,i){return d.color? d.color : g.colors[i]})

				scatterDots = scatterGroups
					.selectAll("circle")
					.data(function(d){ return d.data})
				scatterDots.enter()
						.append("circle")
						.attr("r",4)
						.attr("stroke","#fff")
						.attr("stroke-width","1")
						.attr("transform",function(d,i){
							yAxisIndex = d3.select(this.parentElement).data()[0].axis; 
							return "translate("+(g.xAxis.type=="date" ?
								g.xAxis.scale(Gneiss.g.xAxisRef[0].data[i]):
								g.xAxis.scale(i)) + "," + g.yAxis[yAxisIndex].scale(d) + ")"
							})
		}
		else {
			//update don't create
			
			lineSeries = g.seriesContainer.selectAll("path");
			columnSeries = g.seriesContainer.selectAll("g.seriesColumn")
			scatterSeries = g.seriesContainer.selectAll("g.seriesScatter")
			lineSeriesDotGroups = g.seriesContainer.selectAll("g.lineSeriesDots")
			var columnGroups
			var columnRects
			
			if(g.isBargrid) {
				//add bars to chart
				columnGroups = g.seriesContainer.selectAll("g.seriesColumn")
					.data(sbt.bargrid)
					.attr("fill",function(d,i){return d.color? d.color : g.colors[i+sbt.line.length]})
				
				var seriesColumns = columnGroups.enter()
					.append("g") 
						.attr("class","seriesColumn")
						.attr("fill",function(d,i){return d.color? d.color : g.colors[i+g.series.length]})
						.attr("transform",function(d,i){return "translate(0,"+g.padding.top+")"})
				
				var bargridLabel = columnGroups.selectAll("text.bargridLabel")
					.data(function(d,i){return [d]})
				
						
				bargridLabel.enter()
						.append("text")
						.attr("class","bargridLabel")
						.text(function(d,i){return d.name})
						.attr("x",g.yAxis[0].scale(0))
						.attr("y",g.padding.top-18)
								
				bargridLabel.transition()
					.text(function(d,i){return d.name})
					.attr("x",g.yAxis[0].scale(0))
					.attr("y",g.padding.top-18)
				
				bargridLabel.exit().remove()
				
				columnSeries.transition()
					.duration(500)
					.attr("transform",function(d,i){return "translate("+(i * (g.width-g.padding.left)/g.series.length)+",0)"})
					
				columnGroups.exit().remove()
				
				
				columnRects = columnGroups.selectAll("rect")
					.data(function(d,i){return d.data})
				
				columnRects.enter()
						.append("rect")
						.attr("height",20)
						.attr("width", function(d,i) {yAxisIndex = d3.select(this.parentElement).data()[0].axis; return Math.abs(g.yAxis[yAxisIndex].scale(d) - g.yAxis[yAxisIndex].scale(0))})
						.attr("x", function(d,i) {yAxisIndex = d3.select(this.parentElement).data()[0].axis; return g.yAxis[yAxisIndex].scale(0) - (d<0?Math.abs(g.yAxis[yAxisIndex].scale(d)):0)})
						.attr("y",function(d,i) {return g.xAxis.scale(i) - 10})
				
				columnRects.transition()
					.duration(500)
					.attr("height",20)
					.attr("width", function(d,i) {yAxisIndex = d3.select(this.parentElement).data()[0].axis; return Math.abs(g.yAxis[yAxisIndex].scale(d) - g.yAxis[yAxisIndex].scale(0))})
					.attr("x", function(d,i) {yAxisIndex = d3.select(this.parentElement).data()[0].axis; return g.yAxis[yAxisIndex].scale(0) - (d<0?Math.abs(g.yAxis[yAxisIndex].scale(d) - g.yAxis[yAxisIndex].scale(0)):0)})
					.attr("y",function(d,i) {return g.xAxis.scale(i) - 10})
				
				//add label to each bar
				var barLabels = columnGroups.selectAll("text.barLabel")
					.data(function(d,i){return d.data})
					
				barLabels.enter()
					.append("text")
					.attr("class","barLabel")
					.text(function(d,i){return g.all.numberFormat(d)})
					.attr("x", function(d,i) {yAxisIndex = d3.select(this.parentElement).data()[0].axis; return Math.abs(g.yAxis[yAxisIndex].scale(d) - g.yAxis[yAxisIndex].scale(0))})
					.attr("y",function(d,i) {return g.xAxis.scale(i) + 5})
					
				barLabels.transition()
					.text(function(d,i){var yAxisIndex = d3.select(this.parentElement).data()[0].axis; return (i==0?g.yAxis[yAxisIndex].prefix.value:"") + g.all.numberFormat(d) + (i==0?g.yAxis[yAxisIndex].suffix.value:"")})
					.attr("x", function(d,i) {yAxisIndex = d3.select(this.parentElement).data()[0].axis; return 3 + g.yAxis[yAxisIndex].scale(0) - (d<0?Math.abs(g.yAxis[yAxisIndex].scale(d) - g.yAxis[yAxisIndex].scale(0)):0) + Math.abs(g.yAxis[yAxisIndex].scale(d) - g.yAxis[yAxisIndex].scale(0))})
					.attr("y",function(d,i) {return g.xAxis.scale(i) + 5})
				
				//remove non bargrid stuff
				scatterSeries.remove()
				columnRects.exit().remove()
				lineSeriesDotGroups.remove()
				lineSeries.remove()
			}
			else {
				//Not a bargrid
				
				//add columns to chart
				columnGroups = g.seriesContainer.selectAll("g.seriesColumn")
					.data(sbt.column)
					.attr("fill",function(d,i){return d.color? d.color : g.colors[i+sbt.line.length]})
				
				//remove bargrid labels
				columnGroups.selectAll("text.barLabel").remove()
				
				columnGroups.enter()
					.append("g") 
						.attr("class","seriesColumn")
						.attr("fill",function(d,i){return d.color? d.color : g.colors[i+sbt.line.length]})
						.attr("transform",function(d,i){return "translate("+(i*columnGroupShift - (columnGroupShift * (sbt.column.length-1)/2))+",0)"})
					
				columnSeries.transition()
					.duration(500)
					.attr("transform",function(d,i){return "translate("+(i*columnGroupShift - (columnGroupShift * (sbt.column.length-1)/2))+",0)"})
			
				columnGroups.exit().remove()
			
				columnRects = columnGroups.selectAll("rect")
					.data(function(d,i){return d.data})
				
				columnRects.enter()
						.append("rect")
						.attr("width",columnWidth)
						.attr("height", function(d,i) {yAxisIndex = d3.select(this.parentElement).data()[0].axis; return Math.abs(g.yAxis[yAxisIndex].scale(d) - g.yAxis[yAxisIndex].scale(Gneiss.helper.columnXandHeight(d,g.yAxis[yAxisIndex].scale.domain())))})
						.attr("x",function(d,i) {return g.xAxis.scale(Gneiss.g.xAxisRef[0].data[i])  - columnWidth/2})
						.attr("y",function(d,i) {yAxisIndex = d3.select(this.parentElement).data()[0].axis; return (g.yAxis[yAxisIndex].scale(d)-g.yAxis[yAxisIndex].scale(Gneiss.helper.columnXandHeight(d,g.yAxis[yAxisIndex].scale.domain()))) >= 0 ? g.yAxis[yAxisIndex].scale(Gneiss.helper.columnXandHeight(d,g.yAxis[yAxisIndex].scale.domain())) : g.yAxis[yAxisIndex].scale(d)})
			
				columnRects.transition()
					.duration(500)
					.attr("width",columnWidth)
					.attr("height", function(d,i) {yAxisIndex = d3.select(this.parentElement).data()[0].axis; return Math.abs(g.yAxis[yAxisIndex].scale(d) - g.yAxis[yAxisIndex].scale(Gneiss.helper.columnXandHeight(d,g.yAxis[yAxisIndex].scale.domain())))})
					.attr("x",g.xAxis.type =="date" ? 
							function(d,i) {return g.xAxis.scale(Gneiss.g.xAxisRef[0].data[i])  - columnWidth/2}:
							function(d,i) {return g.xAxis.scale(i) - columnWidth/2}
					)
					.attr("y",function(d,i) {yAxisIndex = d3.select(this.parentElement).data()[0].axis; return (g.yAxis[yAxisIndex].scale(d)-g.yAxis[yAxisIndex].scale(Gneiss.helper.columnXandHeight(d,g.yAxis[yAxisIndex].scale.domain()))) >= 0 ? g.yAxis[yAxisIndex].scale(Gneiss.helper.columnXandHeight(d,g.yAxis[yAxisIndex].scale.domain())) : g.yAxis[yAxisIndex].scale(d)})
				
				columnRects.exit().remove()
			
				//add lines
				lineSeries = g.seriesContainer.selectAll("path")
					.data(sbt.line)
					.attr("stroke",function(d,i){return d.color? d.color : g.colors[i]});

				lineSeries.enter()
					.append("path")
						.attr("d",function(d,j) { yAxisIndex = d.axis; pathString = g.yAxis[d.axis].line(d.data).split("L0,0L").join("M0,0L"); return pathString;})
						.attr("class","seriesLine")
						.attr("stroke",function(d,i){return d.color? d.color : g.colors[i]})
						.attr("stroke-width",3)
						.attr("stroke-linejoin","round")
						.attr("stroke-linecap","round")
						.attr("fill","none");

				lineSeries.transition()
					.duration(500)
					.attr("d",function(d,j) { yAxisIndex = d.axis; pathString = g.yAxis[d.axis].line(d.data).split("L0,0L").join("M0,0M"); return pathString;})

				lineSeries.exit().remove()
			
			
				//Add dots to the appropriate line series
				lineSeriesDotGroups = g.seriesContainer.selectAll("g.lineSeriesDots")
					.data(sbt.line)
					.attr("fill",function(d,i){return d.color? d.color : g.colors[i]})
			
				lineSeriesDotGroups
					.enter()
					.append("g")
					.attr("class","lineSeriesDots")
					.attr("fill", function(d,i){return d.color? d.color : g.colors[i]})
				
				lineSeriesDotGroups.exit().remove()
			
				lineSeriesDots = lineSeriesDotGroups.filter(function(d){return d.data.length < 15})
					.selectAll("circle")
					.data(function(d,i){return d.data})
					
				lineSeriesDotGroups.filter(function(d){return d.data.length > 15})
					.remove()
				
				
				lineSeriesDots.enter()
					.append("circle")
					.attr("r",4)
					.attr("transform",function(d,i){
						yAxisIndex = d3.select(this.parentElement).data()[0].axis;
							var y = d ? g.yAxis[yAxisIndex].scale(d) : -100;
							return "translate("+ g.xAxis.scale(Gneiss.g.xAxisRef[0].data[i]) + "," + y + ")";
						})
			
				lineSeriesDots.transition()
					.duration(500)
					.attr("transform",function(d,i){
						yAxisIndex = d3.select(this.parentElement).data()[0].axis;
							var y = d ? g.yAxis[yAxisIndex].scale(d) : -100;
							return "translate("+ g.xAxis.scale(Gneiss.g.xAxisRef[0].data[i]) + "," + y + ")";
						})
			
				lineSeriesDots.exit().remove()
								
				//add scatter
				scatterGroups = g.seriesContainer.selectAll("g.seriesScatter")
					.data(sbt.scatter)
					.attr("fill", function(d,i){return d.color? d.color : g.colors[i]})
				
				scatterGroups.enter()
					.append("g")
					.attr("class","seriesScatter")
					.attr("fill",function(d,i){return d.color? d.color : g.colors[i+sbt.line.length+sbt.column.length]})
				
				scatterGroups.exit().remove()
				
				scatterDots = scatterGroups
					.selectAll("circle")
					.data(function(d){return d.data})
					
				scatterDots.enter()
						.append("circle")
						.attr("r",4)
						.attr("stroke","#fff")
						.attr("stroke-width","1")
						.attr("transform",function(d,i){
							yAxisIndex = d3.select(this.parentElement).data()[0].axis;
							return "translate("+g.xAxis.scale(Gneiss.g.xAxisRef[0].data[i]) + "," + g.yAxis[yAxisIndex].scale(d) + ")"
							})
					
				scatterDots.transition()
						.duration(500)
						.attr("transform",function(d,i){
							yAxisIndex = d3.select(this.parentElement).data()[0].axis;
							return "translate("+g.xAxis.scale(Gneiss.g.xAxisRef[0].data[i]) + "," + g.yAxis[yAxisIndex].scale(d) + ")"
							})
			}
			
		}
		
		//arrange elements in propper order	
		
		//bring bars to front
		if(g.sbt.column.length > 0) {
			columnGroups.each(function(){this.parentNode.appendChild(this);})
			columnSeries.each(function(){this.parentNode.appendChild(this);})
		}
		
		
		//bring lines to front
		if(g.sbt.line.length > 0){
			lineSeries.each(function(){if(this.parentNode){this.parentNode.appendChild(this);}})
			//bring dots to front
			lineSeriesDotGroups.each(function(){if(this.parentNode){this.parentNode.appendChild(this);}})
		}
		
		//bring scatter to front
		if(g.sbt.scatter.length > 0) {
			scatterGroups.each(function(){this.parentNode.appendChild(this);})
			scatterDots.each(function(){this.parentNode.appendChild(this);})
		}
		
		this.g = g;
		return this
		
		
	},
	drawLegend: function() {
		var g = this.g
		
		//remove current legends
		g.legendItemContainer.selectAll("g.legendItem").remove()
		
		if(!g.isBargrid) {
			//add legend to chart
			var legendGroups = g.legendItemContainer.selectAll("g")
				.data(g.series);

			var legItems = 	legendGroups.enter()
				.append("g")
				.attr("class","legendItem")
				.attr("transform",function(d,i) {
					if(g.yAxis.length == 1) {
						return "translate("+g.padding.left+","+(g.padding.top-25)+")"
					}
					else {
						return "translate("+g.padding.left+","+(g.padding.top-50)+")"
					}
					
				});
			
			var legLabels = legItems.append("text")
					.filter(function(){return g.series.length > 1})
					.attr("class","legendLabel")
					.attr("x",12)
					.attr("y",18)
					.attr("fill",function(d,i){return d.color? d.color : g.colors[i]})
					.text(function(d,i){return d.name});
				
		
					
			//if there is more than one line
			if(g.series.length > 1) {
				legItems.append("rect")
					.attr("width",10)
					.attr("height",10)
					.attr("x",0)
					.attr("y",8)
					.attr("fill", function(d,i){return d.color? d.color : g.colors[i]})

				var legendItemY;
				legendGroups.each(function(d,i) {
					if(i > 0) {
						var prev = d3.select(legendGroups[0][i-1])
						var prevWidth = parseFloat(prev.select("text").style("width").split("p")[0])

						var cur = d3.select(this)
						var curWidth = parseFloat(cur.select("text").style("width").split("p")[0])
						legendItemY = cur.attr("transform").split(",")[1].split(")")[0];
						var x = parseFloat(prev.attr("transform").split(",")[0].split("(")[1]) + prevWidth + 20

						if(x + curWidth > g.width) {
							x = g.padding.left
							legendItemY += 15;						
						}
						d3.select(this).attr("transform","translate("+x+","+legendItemY+")")
					}
				})
		
				//test if the chart needs more top margin because of a large number of legend items
				if (legendItemY > 0 && g.padding.top == 25) { //CHANGE
					g.padding.top = legendItemY + 25;
					this.g = g;				
			
				};
			} else {
				if(g.title == "") {
					g.titleLine.text(g.series[0].name)
				}
			}
		}
		
		this.g = g
		return this
	},
	updateMetaAndTitle: function() {
		var g = this.g
		g.metaInfo.attr("transform","translate(0,"+(g.height-4)+")")
		this.g = g
		return this
	},
	splitSeriesByType: function(series) {
		/*
			splits the data by the way it is supposed to be displayed
		*/
		var o = {
			"line":[],
			"column":[],
			"bargrid":[],
			"scatter":[]
		}
		for (var i=0; i < series.length; i++) {
			o[series[i].type].push(series[i])
		}
		
		if(o.column.length > 0) {
			this.g.xAxis.hasColumns = true;
		}
		else {
			this.g.xAxis.hasColumns = false;
		}
		
		if(o.bargrid.length > 0) {
			this.g.isBargrid = true;
		}
		else {
			this.g.isBargrid = false;
		}
		
		return o
	},
	update: function() {
		/*
			Nothing yet
		*/
		return this
	},
	updateSeries: function() {
		/*
			Nothing yet
		*/
		return this
	},
	redraw: function() {
		/*
			Redraw the chart
		*/
		var g = this.g
		
		//group the series by their type
		this.g.sbt = this.splitSeriesByType(this.g.series);
		this.calculateColumnWidths()
		
		this.setPadding()
			.setYScales()
			.setXScales()
			.setYAxes()
			.setXAxis()
			.drawSeriesAndLegend()
			.updateMetaAndTitle();	
		return this
	},
	randomizeData: function(d) {
		delta = 10 * (Math.random() - 0.5)
		for (var i = d.length - 1; i >= 0; i--){
			d[i] = d[i] + ((Math.random()-0.5)*5) + delta
		};
		return d
	},
	helper: {
		multiextent: function(a,key) {
			//a function to find the max and min of multiple arrays
			var data = [],ext;
			if(key) {
				//if there is a key function
				for (var i = a.length - 1; i >= 0; i--){
					ext = d3.extent(key(a[i]))
					data.push(ext[0])
					data.push(ext[1])
				}
			}
			else {
				for (var i = a.length - 1; i >= 0; i--){
					ext = d3.extent(a[i])
					data.push(ext[0])
					data.push(ext[1])
				};
			}
			return d3.extent(data)
		},
		columnXandHeight: function(d,domain) {
			//a function to find the propper value to cut off a column
			if(d > 0 && domain[0] > 0) {
				return domain[0]
			}
			else if (d < 0 && domain[1] < 0) {
				return domain[1]
			}
			
			return 0
		},
		exactTicks: function(domain,numticks) {
			numticks -= 1;
			var ticks = [];
			var delta = domain[1] - domain[0];
			ticks.push(domain[0])
			for (var i=0; i < numticks; i++) {
				ticks.push(domain[0] + (delta/numticks)*i);
			};
			ticks.push(domain[1])
			
			if(domain[1]*domain[0] < 0) {
				//if the domain crosses zero, make sure there is a zero line
				var hasZero = false;
				for (var i = ticks.length - 1; i >= 0; i--){
					//check if there is already a zero line
					if(ticks[i] == 0) {
						hasZero = true;
					}
				};
				if(!hasZero) {
					ticks.push(0)
				}
			}
			
			return ticks;
		}
	},
	q: {}
}