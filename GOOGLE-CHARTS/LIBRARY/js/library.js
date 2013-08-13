google.load('visualization', '1', {'packages' : ['corechart', 'geochart', 'treemap', 'table', 'gauge']});
google.setOnLoadCallback(function() { sendAndDraw('') });


// PieChart Source and Options
var PieDataSourceUrl = 'ttps://docs.google.com/spreadsheet/tq?range=A1%3AB14&key=0AgAtV671nd7CdERwMHJzQUdKSGtqZmFWMjRUemVucEE&gid=0&headers=-1';
var query;
var PieOptions = {'title':'2010 Global Sovereign Debt Issuance at Record Level', 'width':400, 'height':300};

// LineChart Source and Options
var LineDataSourceUrl = 'https://docs.google.com/spreadsheet/tq?range=A1%3AE253&key=0AkwgJlRgEsqUdGcwSWFGdWN4b3VaQW5QckVEQ3RGSVE&gid=0&headers=-1';
var LineOptions = {'title':'GOOGLE Stock Data', 'width':400, 'height':300,
'chartArea': {
    'backgroundColor': {
        'fill': '#F4F4F4',
        'opacity': 100
     },
 }		
};

// BarChart Source and Options		
var BarDataSourceUrl = 'https://docs.google.com/spreadsheet/tq?key=0AgAtV671nd7CdHlYalJxeDNyc0JndVMtZG5nMkw4Q3c&range=A1%3AC12&headers=-1';
var BarOptions = {'title':'CBO Assumptions - Debt Held by Public & Rate Paid For Debt', 'width':400, 'height':300};

// ColumnChart Source and Options		
var ColumnDataSourceUrl = 'https://docs.google.com/spreadsheet/tq?key=0AgAtV671nd7CdHlYalJxeDNyc0JndVMtZG5nMkw4Q3c&range=A1%3AC12&headers=-1';
var ColumnOptions = {           
    title: 'CBO Assumptions - Debt Held by Public & Rate Paid For Debt',
	seriesType: "bars",			
	series:{
		0:{targetAxisIndex:1},
	    1:{targetAxisIndex:0}
	},			
	'width': 400,
	'height': 300				
 };

// ComboChart Source and Options
var ComboDataSourceUrl = 'https://docs.google.com/spreadsheet/tq?key=0AgAtV671nd7CdGwzaHJVbHVUMHhtSXROeTBqcHV6SVE&range=A1%3AD6&headers=-1';
var ComboOptions = {
          title : 'Trade Flow with Latin America:  Asia vs. Europe vs. U.S.',
          vAxis: {title: "IFC Guarantee USD Volume (in USD MIllions)"},
          seriesType: "bars",
series: {3: {type: "line"}}, 'width':400, 'height':300};

// Combo2Chart Source and Options
		var Combo2DataSourceUrl = 'https://docs.google.com/spreadsheet/tq?key=0AgAtV671nd7CdHlYalJxeDNyc0JndVMtZG5nMkw4Q3c&range=A1%3AC12&headers=-1';

				var Combo2Options = {           
				    title: 'CBO Assumptions - Debt Held by Public & Rate Paid For Debt',
					seriesType: "bars",			
					series:{
						0:{targetAxisIndex:1, type: "line"},
					    1:{targetAxisIndex:0}
					},

					'width': 400,
					'height': 300				
				 };
				
	// GeoChart Source and Options			
	var GeoDataSourceUrl = 'https://docs.google.com/spreadsheet/tq?key=0AgAtV671nd7CdFF1V2ItaDhmRnVqNnV2NUQ0LVNCLVE&range=A1%3AD21&headers=-1';

	var GeoOptions = {
	'title':'U.S. Top 20 Markets',
        region: 'US',
        displayMode: 'markers',
        colorAxis: {colors: ['red']},
		legend: 'none',
		resolution:'provinces',
		'width':400,
		'height':300
      };

// BubbleChart Source and Options
	var BubbleDataSourceUrl = 'https://docs.google.com/spreadsheet/tq?key=0AgAtV671nd7CdFF1V2ItaDhmRnVqNnV2NUQ0LVNCLVE&headers=-1';
    
	var BubbleOptions = {
		'title':'U.S. Top 20 Markets',
		hAxis: {title: 'Horizontal Axis Label'},
		vAxis: {title: 'Vertical Axis Label'},
		          bubble: {textStyle: {fontSize: 11}},
			'width':400,
			'height':300
	      };
	
// CandleStick Source and Options
var CandleStickDataSourceUrl = 'https://docs.google.com/spreadsheet/tq?key=0AgAtV671nd7CdDJQdFJSZ3FOTnVqWFdLaWd6dVdmYWc&range=A1%3AE7&headers=-1';		

var CandleStickOptions = {	
title: 'sample candlestick chart',
vAxis: {title: "vertical axis label"},
hAxis: {title: "horizontal axis label"},     
	'width':400,
	'height':300
  };

// ScatterChart Source and Options
var ScatterDataSourceUrl = 'https://docs.google.com/spreadsheet/tq?key=0AgAtV671nd7CdGpfWUhpTjFMLWhTV2JjMnJYWTdQc0E&range=A%3AB&headers=-1';
var ScatterOptions = {'title':'Amount of Cupcakes to Friends', 'width':400, 'height':300};

// TreeMap Source and Options
var TreeMapDataSourceUrl = 'https://docs.google.com/spreadsheet/tq?key=0AgAtV671nd7CdDdta3hOSno0LXllWFhFTVctMXFwZEE&range=A%3AD&headers=-1';
var TreeMapOptions = {'title':'A visual representation of a data tree', 'width':300, 'height':200};

// Table Source and Options
var TableDataSourceUrl = 'https://docs.google.com/spreadsheet/tq?key=0AgAtV671nd7CdDdta3hOSno0LXllWFhFTVctMXFwZEE&range=A%3AD&headers=-1';
var TableOptions = {'title':'A visual representation of a data tree', 'width':300, 'height':200};

// AreaChart Source and Options
var AreaChartDataSourceUrl = 'https://docs.google.com/spreadsheet/tq?key=0AgAtV671nd7CdDJQdFJSZ3FOTnVqWFdLaWd6dVdmYWc&range=A1%3AE7&headers=-1';
var AreaChartOptions = {'title':'Sample AreaChart', 'width':400, 'height':300};

// SteppedAreaChart Source and Options
var SteppedAreaChartDataSourceUrl = 'https://docs.google.com/spreadsheet/tq?key=0AgAtV671nd7CdDJQdFJSZ3FOTnVqWFdLaWd6dVdmYWc&range=A1%3AE7&headers=-1';
var SteppedAreaChartOptions = {'title':'Sample AreaChart', 'width':400, 'height':300};

// Gauge Source and Options
var GaugeDataSourceUrl = 'https://docs.google.com/spreadsheet/tq?key=0AgAtV671nd7CdDJZR3JrMU94ZHJsY0RlRTBmZS0wdnc&range=A%3AB&headers=-1';

var GaugeOptions = {
          'width': 200, 'height': 200,
          'redFrom': 90, 'redTo': 100,
          'yellowFrom':75, 'yellowTo': 90,
          'minorTicks': 5
        };


function sendAndDraw(queryString) {
  // PieChart
  var PieContainer = document.getElementById('piechart_div');
  var cnbcPieChart = new google.visualization.PieChart(PieContainer);	      
  var PieQuery = new google.visualization.Query(PieDataSourceUrl + queryString);
  var PieQueryWrapper = new QueryWrapper(PieQuery, cnbcPieChart, PieOptions);
  PieQueryWrapper.sendAndDraw();

  // LineChart
  var LineContainer = document.getElementById('linechart_div');
  var cnbcLineChart = new google.visualization.LineChart(LineContainer);	      
  var LineQuery = new google.visualization.Query(LineDataSourceUrl + queryString);
  var LineQueryWrapper = new QueryWrapper(LineQuery, cnbcLineChart, LineOptions);
  LineQueryWrapper.sendAndDraw();

  // BarChart
  var BarContainer = document.getElementById('barchart_div');
  var cnbcBarChart = new google.visualization.BarChart(BarContainer);	      
  var BarQuery = new google.visualization.Query(BarDataSourceUrl + queryString);
  var BarQueryWrapper = new QueryWrapper(BarQuery, cnbcBarChart, BarOptions);
  BarQueryWrapper.sendAndDraw();

  // ColumnChart
  var ColumnContainer = document.getElementById('columnchart_div');
  var cnbcColumnChart = new google.visualization.ColumnChart(ColumnContainer);	      
  var ColumnQuery = new google.visualization.Query(ColumnDataSourceUrl + queryString);
  var ColumnQueryWrapper = new QueryWrapper(ColumnQuery, cnbcColumnChart, ColumnOptions);
  ColumnQueryWrapper.sendAndDraw();

  // ComboChart
  var ComboContainer = document.getElementById('combochart_div');
  var cnbcComboChart = new google.visualization.ComboChart(ComboContainer);	      
  var ComboQuery = new google.visualization.Query(ComboDataSourceUrl + queryString);
  var ComboQueryWrapper = new QueryWrapper(ComboQuery, cnbcComboChart, ComboOptions);
  ComboQueryWrapper.sendAndDraw();

  // ComboChart Line and Bar
  var Combo2Container = document.getElementById('combo2chart_div');
  var cnbcCombo2Chart = new google.visualization.ComboChart(Combo2Container);	      
  var Combo2Query = new google.visualization.Query(Combo2DataSourceUrl + queryString);
  var Combo2QueryWrapper = new QueryWrapper(Combo2Query, cnbcCombo2Chart, Combo2Options);
  Combo2QueryWrapper.sendAndDraw();	

  // GeoChart
  var GeoContainer = document.getElementById('geochart_div');
  var cnbcGeoChart = new google.visualization.GeoChart(GeoContainer);	      
  var GeoQuery = new google.visualization.Query(GeoDataSourceUrl + queryString);
  var GeoQueryWrapper = new QueryWrapper(GeoQuery, cnbcGeoChart, GeoOptions);
  GeoQueryWrapper.sendAndDraw();

 // BubbleChart
  var BubbleContainer = document.getElementById('bubblechart_div');
  var cnbcBubbleChart = new google.visualization.BubbleChart(BubbleContainer);	      
  var BubbleQuery = new google.visualization.Query(BubbleDataSourceUrl + queryString);
  var BubbleQueryWrapper = new QueryWrapper(BubbleQuery, cnbcBubbleChart, BubbleOptions);
  BubbleQueryWrapper.sendAndDraw();

  // CandleStickChart
  var CandleStickContainer = document.getElementById('candlestickchart_div');
  var cnbcCandleStickChart = new google.visualization.CandlestickChart(CandleStickContainer);	      
  var CandleStickQuery = new google.visualization.Query(CandleStickDataSourceUrl + queryString);
  var CandleStickQueryWrapper = new QueryWrapper(CandleStickQuery, cnbcCandleStickChart, CandleStickOptions);
  CandleStickQueryWrapper.sendAndDraw();
	
  //ScatterChart
  var ScatterContainer = document.getElementById('scatterchart_div');
  var cnbcScatterChart = new google.visualization.ScatterChart(ScatterContainer);	      
  var ScatterQuery = new google.visualization.Query(ScatterDataSourceUrl + queryString);
  var ScatterQueryWrapper = new QueryWrapper(ScatterQuery, cnbcScatterChart, ScatterOptions);
  ScatterQueryWrapper.sendAndDraw();

  //TreeMap
  var TreeMapContainer = document.getElementById('treemap_div');
  var cnbcTreeMapChart = new google.visualization.TreeMap(TreeMapContainer);	      
  var TreeMapQuery = new google.visualization.Query(TreeMapDataSourceUrl + queryString);
  var TreeMapQueryWrapper = new QueryWrapper(TreeMapQuery, cnbcTreeMapChart, TreeMapOptions);
  TreeMapQueryWrapper.sendAndDraw();
	
  //Table
  var TableContainer = document.getElementById('table_div');
  var cnbcTableChart = new google.visualization.Table(TableContainer);	      
  var TableQuery = new google.visualization.Query(TableDataSourceUrl + queryString);
  var TableQueryWrapper = new QueryWrapper(TableQuery, cnbcTableChart, TableOptions);
  TableQueryWrapper.sendAndDraw();

  //AreaChart
  var AreaChartContainer = document.getElementById('areachart_div');
  var cnbcAreaChart = new google.visualization.AreaChart(AreaChartContainer);	      
  var AreaChartQuery = new google.visualization.Query(AreaChartDataSourceUrl + queryString);
  var AreaChartQueryWrapper = new QueryWrapper(AreaChartQuery, cnbcAreaChart, AreaChartOptions);
  AreaChartQueryWrapper.sendAndDraw();
  
  //SteppedAreaChart
  var SteppedAreaChartContainer = document.getElementById('steppedareachart_div');
  var cnbcSteppedAreaChart = new google.visualization.SteppedAreaChart(SteppedAreaChartContainer);	      
  var SteppedAreaChartQuery = new google.visualization.Query(SteppedAreaChartDataSourceUrl + queryString);
  var SteppedAreaChartQueryWrapper = new QueryWrapper(SteppedAreaChartQuery, cnbcSteppedAreaChart, SteppedAreaChartOptions);
  SteppedAreaChartQueryWrapper.sendAndDraw();


  //Gauge
  var GaugeContainer = document.getElementById('gauge_div');
  var cnbcGauge = new google.visualization.Gauge(GaugeContainer);	      
  var GaugeQuery = new google.visualization.Query(GaugeDataSourceUrl + queryString);
  var GaugeQueryWrapper = new QueryWrapper(GaugeQuery, cnbcGauge, GaugeOptions);
  GaugeQueryWrapper.sendAndDraw();
}