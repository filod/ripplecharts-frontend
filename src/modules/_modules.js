angular.module('ripplecharts.modules', ['ng', 'templates-modules'])
.run(function($window, $rootScope) {
  if (typeof navigator.onLine != 'undefined') {
    $rootScope.online = navigator.onLine;
    $window.addEventListener("offline", function () {
      $rootScope.$apply(function() {
        $rootScope.online = false;
      });
    }, false);
    $window.addEventListener("online", function () {
      $rootScope.$apply(function() {
        $rootScope.online = true;
      });
    }, false);
  }
})