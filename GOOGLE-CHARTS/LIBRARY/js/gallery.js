initGalleryCharts();

var chartsData = {};


function initGalleryCharts() {
  google.setOnLoadCallback(initCharts);
}


function initCharts() {
  $(window).resize(drawCharts);
  setupData();
  drawCharts();
}


function setupData() {
  // pie:
  chartsData.piechart = {};
  chartsData.piechart.data = new google.visualization.DataTable();
  chartsData.piechart.data.addColumn('string', 'Task');
  chartsData.piechart.data.addColumn('number', 'Hours per Day');
  chartsData.piechart.data.addRows([
    ['Work', 9],
    ['Eat', 4],
    ['Commute', 3],
    ['Watch TV', 1],
    ['Sleep', 7]
  ]);
  chartsData.piechart.chart = new google.visualization.PieChart(document.getElementById('piechart'));
  chartsData.piechart.options = {
    chartArea: {
      left: '5%',
      top: '9%',
      width: '100%',
      height: '82%'
    }
  };

  // line:
  chartsData.linechart = {};
  chartsData.linechart.data = new google.visualization.DataTable();
  chartsData.linechart.data.addColumn('string', 'Year');
  chartsData.linechart.data.addColumn('number', 'a');
  chartsData.linechart.data.addColumn('number', 'b');
  chartsData.linechart.data.addRows([
    ['2008', 1000, 400],
    ['2009', 1170, 460],
    ['2010', 660, 1200],
    ['2011', 1030, 540]
  ]);

  chartsData.linechart.chart = new google.visualization.LineChart(document.getElementById('linechart'));
  chartsData.linechart.options = {
    chartArea: {
      top: '10%'
    },
    legend: "none",
  };

  // area:
  chartsData.areachart = {};
  chartsData.areachart.data = new google.visualization.DataTable();
  chartsData.areachart.data.addColumn('string', 'Year');
  chartsData.areachart.data.addColumn('number', 'Sales');
  chartsData.areachart.data.addColumn('number', 'Expenses');
  chartsData.areachart.data.addRows([
    ['2004', 1000, 400],
    ['2005', 1170, 460],
    ['2006', 660, 1120],
    ['2007', 1030, 540]
  ]);

  chartsData.areachart.chart = new google.visualization.AreaChart(document.getElementById('areachart'));
  chartsData.areachart.options = {
    chartArea: {
      top: '10%'
    },
    legend: "none",
  };

  // bar:
  chartsData.barchart = {};
  chartsData.barchart.data = new google.visualization.DataTable();
  chartsData.barchart.data.addColumn('string', 'Year');
  chartsData.barchart.data.addColumn('number', 'Sales');
  chartsData.barchart.data.addColumn('number', 'Expenses');
  chartsData.barchart.data.addRows([
    ['2008', 1000, 400],
    ['2009', 1170, 460],
    ['2010', 660, 1200]
  ]);
  chartsData.barchart.chart = new google.visualization.BarChart(document.getElementById('barchart'));
  chartsData.barchart.options = {
    chartArea: {
      top: '10%'
    },
    legend: "none",
  };

  // columnchart:
  chartsData.columnchart = {};
  chartsData.columnchart.data = new google.visualization.DataTable();
  chartsData.columnchart.data.addColumn('string', 'Year');
  chartsData.columnchart.data.addColumn('number', 'Sales');
  chartsData.columnchart.data.addColumn('number', 'Expenses');
  chartsData.columnchart.data.addColumn('number', 'c');
  chartsData.columnchart.data.addRows([
    ['2008', 1000, 400, 600],
    ['2009', 1170, 460, 600],
    ['2010', 660, 1200, 600],
    ['2011', 1030, 540, 600]
  ]);

  chartsData.columnchart.chart = new google.visualization.ColumnChart(document.getElementById('columnchart'));
  chartsData.columnchart.options = {
    chartArea: {
      top: '10%'
    },
    legend: 'none'
  };

  // gauge
  chartsData.gauge = {};
  chartsData.gauge.data = new google.visualization.DataTable();
  chartsData.gauge.data.addColumn('string', 'Label');
  chartsData.gauge.data.addColumn('number', 'Value');
  chartsData.gauge.data.addRows(3);
  chartsData.gauge.data.setValue(0, 0, 'Memory');
  chartsData.gauge.data.setValue(0, 1, 80);
  chartsData.gauge.data.setValue(1, 0, 'CPU');
  chartsData.gauge.data.setValue(1, 1, 55);

  chartsData.gauge.chart = new google.visualization.Gauge(document.getElementById('gauge'));
  chartsData.gauge.options = {
    greenFrom: 60,
    greenTo: 75,
    redFrom: 90,
    redTo: 100,
    yellowFrom: 75,
    yellowTo: 90,
    minorTicks: 5
  };

  // scatterchart
  var M = 7919 * 6607;
  var rnds = [];
  x0 = Math.floor(M / 2);
  for (var i = 0; i < 30300; ++i) {
    rnds[i] = x0/M  - 0.5;
    x0 = (x0 * x0) % M;
  }
  chartsData.scatterchart = {};
  chartsData.scatterchart.data = new google.visualization.DataTable();
  chartsData.scatterchart.data.addColumn('number', 'A');
  chartsData.scatterchart.data.addColumn('number', 'Male');
  chartsData.scatterchart.data.addColumn('number', 'Female');

  for (var i = 0; i < 100; ++i) {
    var x = 0;
    var y1 = 0;
    var y2 = 0;
    for (var j = 0; j < 100; ++j) {
      var a1 = rnds[100 * i + j*3 + 1];
      var a2 = -0.1 + a1 * 2 + rnds[100 * i + j*3 + 2];
      var a3 = 0.1 - a1 * 1.5 + rnds[100 * i + j*3 + 3];
      x = x + a1; y1 = y1 + a2; y2 = y2 + a3;
    }
    chartsData.scatterchart.data.addRow([Math.floor(x*100)/100, Math.floor(y1*100)/100, Math.floor(y2*100)/100]);
  }

  chartsData.scatterchart.chart = new google.visualization.ScatterChart(document.getElementById('scatterchart'));

  chartsData.scatterchart.options = {
    chartArea: {
      top: '10%'
    },
    pointSize: 2,
    legend: 'none'
  };

  // table:
  chartsData.table = {};
  chartsData.table.data = new google.visualization.DataTable();
  chartsData.table.data.addColumn('string', 'Name');
  chartsData.table.data.addColumn('number', 'Salary');
  chartsData.table.data.addColumn('boolean', 'Full Time');
  chartsData.table.data.addRows(4);
  chartsData.table.data.setCell(0, 0, 'Mike');
  chartsData.table.data.setCell(0, 1, 10000, '$10,000');
  chartsData.table.data.setCell(0, 2, true);
  chartsData.table.data.setCell(1, 0, 'Jim');
  chartsData.table.data.setCell(1, 1, 8000, '$8,000');
  chartsData.table.data.setCell(1, 2, false);
  chartsData.table.data.setCell(2, 0, 'Alice');
  chartsData.table.data.setCell(2, 1, 12500, '$12,500');
  chartsData.table.data.setCell(2, 2, true);
  chartsData.table.data.setCell(3, 0, 'Bob');
  chartsData.table.data.setCell(3, 1, 7000, '$7,000');
  chartsData.table.data.setCell(3, 2, true);

  chartsData.table.chart = new google.visualization.Table(document.getElementById('table'));
  chartsData.table.options = {showRowNumber: true, width:"100%"};

  // treemap:
  chartsData.treemap = {};
  chartsData.treemap.data = new google.visualization.DataTable();
  chartsData.treemap.data.addColumn('string', 'Region');
  chartsData.treemap.data.addColumn('string', 'Parent');
  chartsData.treemap.data.addColumn('number', 'Market trade volume (size)');
  chartsData.treemap.data.addColumn('number', 'Market increase/decrease (color)');
  chartsData.treemap.data.addRows([
    ["Global",null,0,0],
    ["America","Global",0,0],
    ["Europe","Global",0,0],
    ["Asia","Global",0,0],
    ["Australia","Global",0,0],
    ["Africa","Global",0,0],
    ["Brazil","America",11,70],
    ["USA","America",52,80],
    ["France","Europe",42,40],
    ["Germany","Europe",31,30],
    ["UK","Europe",21,20],
    ["China","Asia",36,-10],
    ["Japan","Asia",20,-20],
    ["Mongolia","Asia",1,-15],
    ["Israel","Asia",12,-24],
    ["Iran","Asia",18,-13],
    ["Pakistan","Asia",11,-25],
    ["Egypt","Africa",21,-90],
    ["S. Africa","Africa",30,-80]
  ]);

  chartsData.treemap.chart = new google.visualization.TreeMap(document.getElementById('treemap'));
  chartsData.treemap.options = {maxPostDepth: 0};

  // candlestickchart:
  chartsData.candlestickchart = {};
  chartsData.candlestickchart.data = new google.visualization.DataTable();
  chartsData.candlestickchart.data.addColumn('string', 'Region');
  chartsData.candlestickchart.data.addColumn('number', 'Min');
  chartsData.candlestickchart.data.addColumn('number', 'Avg_Low');
  chartsData.candlestickchart.data.addColumn('number', 'Avg_High');
  chartsData.candlestickchart.data.addColumn('number', 'Max');
  chartsData.candlestickchart.data.addRows([
    ['Mon',20,28,38,45],
    ['Tues',31,38,55,66],
    ['Wed',50,55,77,80],
    ['Thurs',50,77,66,77],
    ['Fri',15,66,22,68]
  ]);

  chartsData.candlestickchart.chart = new google.visualization.CandlestickChart(document.getElementById('candlestickchart'));
  chartsData.candlestickchart.options = {
    hAxis: {title: '', minValue: 0, maxValue: 15},
    vAxis: {title: '', minValue: 0, maxValue: 15},
    chartArea: {
      top: '10%'
    },
    legend: 'none'
  };

  // combochart:
  chartsData.combochart = {};
  chartsData.combochart.data = new google.visualization.DataTable();
  chartsData.combochart.data.addColumn('string', 'Year');
  chartsData.combochart.data.addColumn('number', 'Bolivia');
  chartsData.combochart.data.addColumn('number', 'Ecuador');
  chartsData.combochart.data.addColumn('number', 'Brazil');
  chartsData.combochart.data.addColumn('number', 'Peru');
  chartsData.combochart.data.addColumn('number', 'Rwanda');
  chartsData.combochart.data.addColumn('number', 'Average');
  chartsData.combochart.data.addRows([
   ['2004', 165, 938, 522, 998, 450, 614.6],
   ['2005', 135, 1120, 599, 1268, 288, 682],
   ['2006', 157, 1167, 587, 807, 397, 623],
   ['2007', 139, 1110, 615, 968, 215, 609.4]
  ]);

  chartsData.combochart.chart = new google.visualization.ComboChart(document.getElementById('combochart'));
  chartsData.combochart.options = {
    chartArea: {
      top: '10%'
    },
    seriesType: "bars",
    series: {5: {type: "line"}},
    legend: 'none'
  };

  // geochart:
  chartsData.geochart = {};
  chartsData.geochart.data = new google.visualization.DataTable();
  chartsData.geochart.data.addColumn('string', 'Country');
  chartsData.geochart.data.addColumn('number', 'Popularity');
  chartsData.geochart.data.addRows([
    ['Germany', 200],
    ['United States', 300],
    ['Brazil', 400],
    ['Canada', 500],
    ['France', 600],
    ['Russia', 700]
  ]);

  chartsData.geochart.chart = new google.visualization.GeoChart(document.getElementById('geochart'));
  chartsData.geochart.options = {legend: 'none'};
}


function drawCharts() {
  $(".chart_container").each(function() {
    var id = $(this).attr("id");
    if (chartsData[id])
      chartsData[id].chart.draw(chartsData[id].data, chartsData[id].options);
  });
}