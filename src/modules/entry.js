angular.element(document).ready(function() {

  //load gateways file before starting the app
  d3.json("assets/gateways.json", function(error, data) {
    gateways = data;

    //connect to the ripple network;
    remote = new ripple.Remote(Options.ripple);
    remote.connect();

    //2nd connection needed for now because of a bug in ripple-lib
    //when unsubscribing from an orderbook.
    orderBookRemote = new ripple.Remote(Options.ripple);
    orderBookRemote.connect();

    angular.bootstrap(document, ['ripplecharts.modules']);

  });
});