//API url to backend
API      = "http://data-api.rippay.com/api";
MIXPANEL = "";

Options = {
  theme     : "light",
  base      : {currency:"BTC", issuer:"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"},
  trade     : {currency:"XRP", issuer:""},
  chartType : "line",
  interval  : "1h",

  ripple    : {

    trace   : false,
    trusted : false,

    servers: [
      { host: '106.186.119.132', port: 5006, secure: false }
      // { host: 's_west.ripple.com', port: 443, secure: true }
    ],

    connection_offset: 0
  }
}