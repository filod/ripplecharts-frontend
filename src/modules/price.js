angular.module('ripplecharts.modules')
.directive('ripplechartsPrice', ['$timeout', '$rootScope', function($timeout, $rootScope){

  return {
    restrict: 'EA',
    scope: {
      pair: '='
    },
    template: '<div id="interval"></div><div id="chartType"></div><div class="chartContainer"></div>',
    link: function($scope, iElm, attrs, controller) {
      var id = 'c' + Math.random().toString(16).slice(2)
      iElm.find('.chartContainer').attr('id', id)
      //load settings from session, local storage, options, or defaults
      $scope.chartType = store.get('chartType') || "line";

      $scope.interval  = store.get('interval') || "1h";

      //set up the interval selector
      var list = d3.select(iElm[0]).select("#interval").attr("class","selectList");
      list.append("label").html("分时:");
      var interval = list.selectAll("a")
        .data([
          //{name: "5s",  interval:"second", multiple:5,  offset: function(d) { return d3.time.hour.offset(d, -1); }},//testing purposes only
          {name: "1m",  interval:"minute", multiple:1,  offset: function(d) { return d3.time.hour.offset(d, -2); }},
          {name: "5m",  interval:"minute", multiple:5,  offset: function(d) { return d3.time.hour.offset(d, -12); }},
          {name: "15m", interval:"minute", multiple:15, offset: function(d) { return d3.time.day.offset(d, -2); }},
          {name: "1h",  interval:"hour",   multiple:1,  offset: function(d) { return d3.time.day.offset(d, -5); }},
          {name: "4h",  interval:"hour",   multiple:4,  offset: function(d) { return d3.time.day.offset(d, -20); }},
          {name: "1d",  interval:"day",    multiple:1,  offset: function(d) { return d3.time.day.offset(d, -120); }},
          {name: "3d",  interval:"day",    multiple:3,  offset: function(d) { return d3.time.year.offset(d, -1); }}
          //{name: "1w",  interval:"week",   multiple:1,  offset: function(d) { return d3.time.year.offset(d, -3); }}
          ])
        .enter().append("a")
        .attr("href", "#")
        .classed("selected", function(d) { return d.name === $scope.interval; })
        .text(function(d) { return d.name; })
        .on("click", function(d) {
          d3.event.preventDefault();
          var that = this;
          store.set("interval", d.name);

          interval.classed("selected", function() { return this === that; });
          priceChart.load($scope.pair.base, $scope.pair.trade, d);
        });

      //set up the chart type selector
      var chartTypeMap = {
        'line': '折线图',
        'candlestick': 'K 线图'
      };
      var chartType = d3.select(iElm[0]).select("#chartType").attr("class","selectList").selectAll("a")
        .data(["line", "candlestick"])
        .enter().append("a")
        .attr("href", "#")
        .classed("selected", function(d) { return d === $scope.chartType; })
        .text(function(d) { return chartTypeMap[d]; })
        .on("click", function(d) {
          d3.event.preventDefault();
          var that = this;
          store.set("chartType", d);

          chartType.classed("selected", function() { return this === that; });
          chartType.selected = d;
          priceChart.setType(d);
        });

      //set up the price chart
      var priceChart = new PriceChart ({
        id     : id,
        url    : API,
        type   : $scope.chartType,
        live   : true,
        // height : 100,
        resize : true
      });


      function loadPair () {
        var interval = d3.select(iElm[0]).select("#interval .selected").datum();
        priceChart.load($scope.pair.base, $scope.pair.trade, interval);
      }
      var _loadPair = _.debounce(loadPair, 50);
      $scope.$watch('pair', _loadPair, true);
      //stop the listeners when leaving page
      $scope.$on("$destroy", function(){
        priceChart.suspend();
      });
      $scope.$watch('online', function(online) {
        if (online) {
          setTimeout(function(){ //put this in to prevent getting "unable to load data"
            loadPair();
          }, 100);
        }
      });
      loadPair();
    }
  };
}]);