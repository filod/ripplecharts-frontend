angular.module('ripplecharts.modules')
.directive('ripplechartsTradefeed', [function(){
  // Runs during compile
  return {
    restrict: 'A',
    scope: {
      base: '=',
      trade: '='
    },
    template: '<div id="tradeFeed"></div>',
    link: function($scope, iElm, attrs, controller) {

    //load settings from session, local storage, options, or defaults
      $scope.base  = $scope.base || { currency:"XRP", issuer:""};
      $scope.trade = $scope.trade || { currency:"USD", issuer:"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"};


      var tradeFeed = new TradeFeed({
        id     : "tradeFeed",
        url    : API
      });


    //stop the listeners when leaving page
      $scope.$on("$destroy", function(){
        tradeFeed.suspend();
      });

      $scope.$watch('online', function(online) {
        if (online) {
          remote.connect();
          orderBookRemote.connect();
          setTimeout(function(){ //put this in to prevent getting "unable to load data"
            tradeFeed.loadPair ($scope.base, $scope.trade);
          }, 100);


        } else {
          remote.disconnect();
          orderBookRemote.disconnect();
        }
      });
    }
  };
}]);