angular.module('ripplecharts.modules')
.directive('ripplechartsBook', [function(){
  // Runs during compile
  return {
    restrict: 'A',
    scope: {
      base: '=?',
      trade: '=?'
    },
    template: '<div id="bookChart" ></div><div id="bookTables"></div>',
    link: function($scope, iElm, attrs, controller) {

    //load settings from session, local storage, options, or defaults
      $scope.base  = $scope.base || { currency:"XRP", issuer:""};
      $scope.trade = $scope.trade || { currency:"USD", issuer:"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"};


      function emitHandler (type, data) {
        if (type=='spread') {
          document.title = data.bid+"/"+data.ask+" "+$scope.base.currency+"/"+$scope.trade.currency;
        }
      }
      var book = new OrderBook ({
        chartID : "bookChart",
        tableID : "bookTables",
        remote  : orderBookRemote,
        resize  : true,
        emit    : emitHandler
      });

      loadPair();

      function loadPair () {
        book.getMarket($scope.base, $scope.trade);
      }
      var _loadPair = _.debounce(loadPair, 50);
      $scope.$watch('base', _loadPair, true);
      $scope.$watch('trade', _loadPair, true);

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