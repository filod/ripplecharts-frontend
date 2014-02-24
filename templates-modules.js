angular.module('templates-modules', ['markets.tpl.html']);

angular.module("markets.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("markets.tpl.html",
    "<div class=\"markets row-fluid\">\n" +
    "  <div class=\"span3\">\n" +
    "    <div id=\"tradeFeed\"></div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"wrap span9\">\n" +
    "    <div id=\"currencyPair\">\n" +
    "      <div class=\"rippleStatus\">\n" +
    "        <div class=\"items\">\n" +
    "          <div class=\"label\" ng-bind=\"ledgerLabel\"></div>\n" +
    "          <div class=\"index\" ng-bind=\"ledgerIndex\">--</div>\n" +
    "          <div class=\"status\">\n" +
    "            <svg height=\"20\" width=\"20\" ng-class=\"connectionStatus\">\n" +
    "              <circle cx=\"10\" cy=\"10\" r=\"5\" fill=\"#c00\" />\n" +
    "            </svg>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "      <div id=\"base\" class=\"dropdowns\"></div>\n" +
    "      <div id=\"flip\"><span>Flip</span></div>\n" +
    "      <div id=\"quote\" class=\"dropdowns\"></div>\n" +
    "      <a id=\"toCSV\" disabled=\"true\" title=\"Export to CSV\">\n" +
    "        <img src=\"assets/images/download.svg\"/>\n" +
    "      </a>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <div id=\"interval\"></div>\n" +
    "    <div id=\"chartType\"></div>\n" +
    "    <div id=\"priceChart\"></div>\n" +
    "    <div id=\"bookChart\" ></div>\n" +
    "    <div id=\"bookTables\"></div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<style>\n" +
    "  footer .footerInner {\n" +
    "    width:94% !important;\n" +
    "    padding:10px 3% !important;\n" +
    "  }\n" +
    "</style>\n" +
    "");
}]);
