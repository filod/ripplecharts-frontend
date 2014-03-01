angular.module('ripplecharts.modules')
.directive('ripplechartsBook', [function(){
  // Runs during compile
  return {
    restrict: 'EA',
    scope: {
      pair: '='
    },
    template: '<div id="bookChart" ></div><div id="bookTables"></div>',
    link: function($scope, iElm, attrs, controller) {

      var book = new OrderBook ({
        chartID : "bookChart",
        tableID : "bookTables",
        remote  : orderBookRemote,
        resize  : true
      });

      loadPair();

      function loadPair () {
        book.getMarket($scope.pair.base, $scope.pair.trade);
      }
      var _loadPair = _.debounce(loadPair, 50);
      $scope.$watch('pair', _loadPair, true);

    //stop the listeners when leaving page
      $scope.$on("$destroy", function(){
        // priceChart.suspend();
        book.suspend();
        // tradeFeed.suspend();
        orderBookRemote.disconnect();
      });

      $scope.$watch('online', function(online) {
        if (online) {
          remote.connect();
          orderBookRemote.connect();
          setTimeout(function(){ //put this in to prevent getting "unable to load data"
            loadPair();
          }, 100);


        } else {
          remote.disconnect();
          orderBookRemote.disconnect();
        }
      });
    }
  };
}]);