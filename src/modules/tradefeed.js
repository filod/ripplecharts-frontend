angular.module('ripplecharts.modules')
.directive('ripplechartsTradefeed', [function(){
  // Runs during compile
  return {
    restrict: 'EA',
    scope: {
      pair: '='
    },
    template: '<div id="tradeFeed"></div>',
    link: function($scope, iElm, attrs, controller) {


      var tradeFeed = new TradeFeed({
        id     : "tradeFeed",
        url    : API
      });

      loadPair();

      function loadPair () {
        tradeFeed.loadPair ($scope.pair.base, $scope.pair.trade);
      }
      var _loadPair = _.debounce(loadPair, 50);
      $scope.$watch('pair', _loadPair, true);

      //stop the listeners when leaving page
      $scope.$on("$destroy", function(){
        tradeFeed.suspend();
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