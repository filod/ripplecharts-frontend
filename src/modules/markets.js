angular.module('ripplecharts.modules', ['ng', 'templates-modules'])

.directive('ripplechartsMarket', [function(){
  // Runs during compile
  return {
    // name: '',
    // priority: 1,
    // terminal: true,
    // scope: {}, // {} = isolate, true = child, false/undefined = no change
    controller: MarketsCtrl,
    // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
    restrict: 'A',
    // template: '',
    templateUrl: 'markets.tpl.html'
    // replace: true,
    // transclude: true,
    // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
    // link: function($scope, iElm, iAttrs, controller) {

    // }
  };
}]);

function MarketsCtrl($scope, $templateCache) {

  if ($state.params.base && $state.params.trade) {

    var base = $state.params.base.split(":");
    base = {currency:base[0],issuer:base[1] ? base[1]:""};
    var trade = $state.params.trade.split(":");
    trade = {currency:trade[0],issuer:trade[1] ? trade[1]:""};

    store.set('base',  base);
    store.set('trade', trade);
    store.session.set('base',  base);
    store.session.set('trade', trade);
    $location.path("/markets").replace(); //to remove the data from the URL
  }

//load settings from session, local storage, options, or defaults
  $scope.base  = store.session.get('base') || store.get('base') ||
    Options.base || {currency:"XRP", issuer:""};

  $scope.trade = store.session.get('trade') || store.get('trade') ||
    Options.trade || {currency:"USD", issuer:"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"};

  $scope.chartType = store.session.get('chartType') || store.get('chartType') ||
    Options.chartType || "line";

  $scope.interval  = store.session.get('interval') || store.get('interval') ||
    Options.interval  || "1h";

//set up the currency pair dropdowns
  var loaded  = false,
    dropdownB = ripple.currencyDropdown().selected($scope.trade)
      .on("change", function(d) {
        if (loaded) {
          $scope.trade = d;
          loadPair();
        }}),
    dropdownA = ripple.currencyDropdown().selected($scope.base)
      .on("change", function(d) {
        if (loaded) {
          $scope.base = d;
          loadPair();
        }});

  d3.select("#base").call(dropdownA);
  d3.select("#quote").call(dropdownB);
  d3.select("#flip").on("click", function(){ //probably better way to do this
    dropdownA.selected($scope.trade);
    dropdownB.selected($scope.base);
    d3.select("#base").selectAll("select").remove();
    d3.select("#quote").selectAll("select").remove();
    loaded = false;
    d3.select("#base").call(dropdownA);
    d3.select("#quote").call(dropdownB);
    loaded = true;

    swap         = $scope.trade;
    $scope.trade = $scope.base;
    $scope.base  = swap;
    loadPair();
  });


  loaded = true;
//the code below should not be needed as it should load via the 'online' indicator
//d3.select("#interval .selected")[0][0].click(); //to load the first chart

//set up the order book
  function emitHandler (type, data) {
    if (type=='spread') {
      document.title = data.bid+"/"+data.ask+" "+$scope.base.currency+"/"+$scope.trade.currency;
    }
  }

  book = new OrderBook ({
    chartID : "bookChart",
    tableID : "bookTables",
    remote  : orderBookRemote,
    resize  : true,
    emit    : emitHandler
  });

  book.getMarket($scope.base, $scope.trade);

//set up trades feed
  tradeFeed = new TradeFeed({
    id     : "tradeFeed",
    url    : API
  });

  tradeFeed.loadPair ($scope.base, $scope.trade);

//single function to reload all feeds when something changes
  function loadPair() {

    var interval = d3.select("#interval .selected").datum();

    store.set('base',  $scope.base);
    store.set('trade', $scope.trade);

    store.session.set('base',  $scope.base);
    store.session.set('trade', $scope.trade);

    priceChart.load($scope.base, $scope.trade, interval);
    book.getMarket($scope.base, $scope.trade);
    tradeFeed.loadPair ($scope.base, $scope.trade);
  }


//stop the listeners when leaving page
  $scope.$on("$destroy", function (){
    priceChart.suspend();
    book.suspend();
    tradeFeed.suspend();
    orderBookRemote.disconnect();
  });


//reload data when coming back online
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
