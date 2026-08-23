(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // ga-lite.min.js
  var require_ga_lite_min = __commonJS({
    "ga-lite.min.js"(exports, module) {
      !(function(t, e) {
        "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports.galite = e() : t.galite = e();
      })(exports, function() {
        return (function(t) {
          function e(r) {
            if (n[r]) return n[r].exports;
            var i = n[r] = { i: r, l: false, exports: {} };
            return t[r].call(i.exports, i, i.exports, e), i.l = true, i.exports;
          }
          var n = {};
          return e.m = t, e.c = n, e.d = function(t2, n2, r) {
            e.o(t2, n2) || Object.defineProperty(t2, n2, { configurable: false, enumerable: true, get: r });
          }, e.n = function(t2) {
            var n2 = t2 && t2.__esModule ? function() {
              return t2.default;
            } : function() {
              return t2;
            };
            return e.d(n2, "a", n2), n2;
          }, e.o = function(t2, e2) {
            return Object.prototype.hasOwnProperty.call(t2, e2);
          }, e.p = "", e(e.s = 2);
        })([function(t, e, n) {
          "use strict";
          function r(t2, e2) {
            a[t2] = e2;
          }
          function i(t2) {
            return a[t2];
          }
          e.a = r, e.b = i;
          var a = {};
        }, function(t, e, n) {
          "use strict";
          function r(t2, e2) {
            if (!(t2 instanceof e2)) throw new TypeError("Cannot call a class as a function");
          }
          function i() {
            return (/* @__PURE__ */ new Date()).getTime();
          }
          function a(t2) {
            var e2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [];
            if (1 === e2.length && e2[0].constructor === Object) return e2[0];
            switch (t2) {
              case "pageview":
                return { page: f(e2, 1)[0] };
              case "event":
                var n2 = f(e2, 4);
                return { eventCategory: n2[0], eventAction: n2[1], eventLabel: n2[2], eventValue: n2[3] };
              case "social":
                var r2 = f(e2, 3);
                return { socialNetwork: r2[0], socialAction: r2[1], socialTarget: r2[2] };
              case "timing":
                var i2 = f(e2, 4);
                return { timingCategory: i2[0], timingVar: i2[1], timingValue: i2[2], timingLabel: i2[3] };
              default:
                return {};
            }
          }
          n.d(e, "a", function() {
            return d;
          });
          var o = n(6), c = n(7), u = n(8), f = /* @__PURE__ */ (function() {
            function t2(t3, e2) {
              var n2 = [], r2 = true, i2 = false, a2 = void 0;
              try {
                for (var o2, c2 = t3[Symbol.iterator](); !(r2 = (o2 = c2.next()).done) && (n2.push(o2.value), !e2 || n2.length !== e2); r2 = true) ;
              } catch (t4) {
                i2 = true, a2 = t4;
              } finally {
                try {
                  !r2 && c2.return && c2.return();
                } finally {
                  if (i2) throw a2;
                }
              }
              return n2;
            }
            return function(e2, n2) {
              if (Array.isArray(e2)) return e2;
              if (Symbol.iterator in Object(e2)) return t2(e2, n2);
              throw new TypeError("Invalid attempt to destructure non-iterable instance");
            };
          })(), s = Object.assign || function(t2) {
            for (var e2 = 1; e2 < arguments.length; e2++) {
              var n2 = arguments[e2];
              for (var r2 in n2) Object.prototype.hasOwnProperty.call(n2, r2) && (t2[r2] = n2[r2]);
            }
            return t2;
          }, l = /* @__PURE__ */ (function() {
            function t2(t3, e2) {
              for (var n2 = 0; n2 < e2.length; n2++) {
                var r2 = e2[n2];
                r2.enumerable = r2.enumerable || false, r2.configurable = true, "value" in r2 && (r2.writable = true), Object.defineProperty(t3, r2.key, r2);
              }
            }
            return function(e2, n2, r2) {
              return n2 && t2(e2.prototype, n2), r2 && t2(e2, r2), e2;
            };
          })(), d = "t0", p = (function() {
            function t2(e2) {
              r(this, t2), this.fields = { trackingId: e2 }, this.userId = Object(c.a)(), this._sendTo = o.a, this._getTime = i;
            }
            return l(t2, [{ key: "send", value: function(t3) {
              for (var e2 = arguments.length, n2 = Array(e2 > 1 ? e2 - 1 : 0), r2 = 1; r2 < e2; r2++) n2[r2 - 1] = arguments[r2];
              var i2 = s({ hitType: t3 }, a(t3, n2), this.fields), o2 = Object(u.a)(this.fields.trackingId, this._getTime(), this.userId, i2);
              this._sendTo(o2);
            } }, { key: "get", value: function(t3) {
              return this.fields[t3];
            } }, { key: "set", value: function(t3, e2) {
              this.fields[t3] = e2;
            } }]), t2;
          })();
          e.b = p;
        }, function(t, e, n) {
          "use strict";
          function r(t2) {
            if (Array.isArray(t2)) {
              for (var e2 = 0, n2 = Array(t2.length); e2 < t2.length; e2++) n2[e2] = t2[e2];
              return n2;
            }
            return Array.from(t2);
          }
          function i(t2) {
            if (!Object(o.a)()) {
              for (var e2 = a(t2), n2 = d(e2, 2), r2 = n2[0], i2 = n2[1], s2 = !!c.a[t2], l2 = !!f.b.prototype[i2] && "constructor" !== i2, p = arguments.length, v = Array(p > 1 ? p - 1 : 0), g = 1; g < p; g++) v[g - 1] = arguments[g];
              if (s2) c.a[t2].apply(c.a, v);
              else if (l2) {
                var y = Object(u.b)(r2);
                y[i2].apply(y, v);
              } else {
                if ("function" != typeof t2) throw new Error("Command " + t2 + " is not available in ga-lite");
                var b = Object(u.b)(r2);
                t2(b);
              }
            }
          }
          function a(t2) {
            return "string" == typeof t2 && t2.indexOf(".") > -1 ? t2.split(".") : [f.a, t2];
          }
          Object.defineProperty(e, "__esModule", { value: true }), e.default = i;
          var o = n(3), c = n(4), u = n(0), f = n(1), s = n(14), l = n(15), d = (n.n(l), /* @__PURE__ */ (function() {
            function t2(t3, e2) {
              var n2 = [], r2 = true, i2 = false, a2 = void 0;
              try {
                for (var o2, c2 = t3[Symbol.iterator](); !(r2 = (o2 = c2.next()).done) && (n2.push(o2.value), !e2 || n2.length !== e2); r2 = true) ;
              } catch (t4) {
                i2 = true, a2 = t4;
              } finally {
                try {
                  !r2 && c2.return && c2.return();
                } finally {
                  if (i2) throw a2;
                }
              }
              return n2;
            }
            return function(e2, n2) {
              if (Array.isArray(e2)) return e2;
              if (Symbol.iterator in Object(e2)) return t2(e2, n2);
              throw new TypeError("Invalid attempt to destructure non-iterable instance");
            };
          })());
          Object.keys(c.a).forEach(function(t2) {
            i[t2] = c.a[t2];
          }), Object(s.a)().forEach(function(t2) {
            return i.apply(void 0, r(t2));
          });
        }, function(t, e, n) {
          "use strict";
          function r() {
            return 1 === parseInt(navigator.msDoNotTrack || window.doNotTrack || navigator.doNotTrack, 10);
          }
          e.a = r;
        }, function(t, e, n) {
          "use strict";
          var r = n(5), i = n(13), a = { create: r.a, getByName: i.a };
          e.a = a;
        }, function(t, e, n) {
          "use strict";
          function r(t2, e2) {
            var n2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : a.a, r2 = (arguments[3], new a.b(t2));
            return Object(i.a)(n2, r2), r2;
          }
          e.a = r;
          var i = n(0), a = n(1);
        }, function(t, e, n) {
          "use strict";
          function r(t2) {
            if ("undefined" != typeof navigator && navigator.sendBeacon) {
              if (navigator.sendBeacon(t2)) return;
            }
            try {
              var e2 = new window.XMLHttpRequest();
              e2.open("GET", t2, false), e2.send();
            } catch (e3) {
              var n2 = new window.Image();
              n2.src = t2;
            }
          }
          e.a = r;
        }, function(t, e, n) {
          "use strict";
          function r() {
            var t2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : window ? window.localStorage : null;
            if (t2 && t2.getItem(i)) return t2.getItem(i);
            var e2 = Math.random() + "." + Math.random();
            return t2 && t2.setItem(i, e2), e2;
          }
          e.a = r;
          var i = "uid";
        }, function(t, e, n) {
          "use strict";
          function r(t2, e2, n2) {
            var r2 = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {}, c = arguments.length > 4 && void 0 !== arguments[4] && arguments[4], u = Object(a.a)(Object(o.a)(r2));
            return Object(i.a)() + (u ? "&" + u : "") + (c ? "&aip=1" : "") + "&cid=" + n2 + "&tid=" + t2 + "&z=" + e2;
          }
          e.a = r;
          var i = n(9), a = n(11), o = n(12);
        }, function(t, e, n) {
          "use strict";
          function r(t2, e2) {
            return "https://www.google-analytics.com/collect?v=1&ul=en-us&de=UTF-8" + Object(i.a)("dl", [document.location.href]) + Object(i.a)("dt", [document.title]) + Object(i.a)("sd", [window.screen.colorDepth, "-bit"]) + Object(i.a)("sr", [window.screen.availHeight, "x", window.screen.availWidth]) + Object(i.a)("vp", [window.innerWidth, "x", window.innerHeight]) + Object(i.a)("dr", [document.referrer]);
          }
          e.a = r;
          var i = n(10);
        }, function(t, e, n) {
          "use strict";
          function r(t2) {
            var e2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [];
            return !t2 || e2.indexOf(void 0) > -1 ? "" : "&" + t2 + "=" + e2.map(encodeURIComponent).join("");
          }
          e.a = r;
        }, function(t, e, n) {
          "use strict";
          function r() {
            var t2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
            return Object.keys(t2).map(function(e2) {
              return [e2, t2[e2]].map(i).map(encodeURIComponent).join("=");
            }).join("&");
          }
          function i(t2) {
            return "boolean" == typeof t2 ? +t2 : t2;
          }
          e.a = r;
        }, function(t, e, n) {
          "use strict";
          function r(t2, e2, n2) {
            return e2 in t2 ? Object.defineProperty(t2, e2, { value: n2, enumerable: true, configurable: true, writable: true }) : t2[e2] = n2, t2;
          }
          function i(t2) {
            return Object.keys(t2).filter(function(t3) {
              return o.hasOwnProperty(t3);
            }).filter(function(e2) {
              return t2[e2];
            }).reduce(function(e2, n2) {
              return a({}, e2, r({}, o[n2], t2[n2]));
            }, {});
          }
          e.a = i;
          var a = Object.assign || function(t2) {
            for (var e2 = 1; e2 < arguments.length; e2++) {
              var n2 = arguments[e2];
              for (var r2 in n2) Object.prototype.hasOwnProperty.call(n2, r2) && (t2[r2] = n2[r2]);
            }
            return t2;
          }, o = { anonymizeIp: "aip", dataSource: "ds", queueTime: "qt", userId: "uid", sessionControl: "sc", referrer: "dr", campaignName: "cn", campaignSource: "cs", campaignMedium: "cm", campaignKeyword: "ck", campaignContent: "cc", campaignId: "ci", screenResolution: "sr", viewportSize: "vp", encoding: "de", screenColors: "sd", language: "ul", javaEnabled: "je", flashVersion: "fl", hitType: "t", nonInteraction: "ni", location: "dl", hostname: "dh", page: "dp", title: "dt", screenName: "cd", linkid: "linkid", appName: "an", appId: "aid", appVersion: "av", appInstallerId: "aiid", eventCategory: "ec", eventAction: "ea", eventLabel: "el", eventValue: "ev", currencyCode: "cu", socialNetwork: "sn", socialAction: "sa", socialTarget: "st", timingCategory: "utc", timingVar: "utv", timingValue: "utt", timingLabel: "utl", exDescription: "exd", exFatal: "exf", expId: "xid", expVar: "xvar" };
        }, function(t, e, n) {
          "use strict";
          function r(t2) {
            return Object(i.b)(t2);
          }
          e.a = r;
          var i = n(0);
        }, function(t, e, n) {
          "use strict";
          function r() {
            return "undefined" == typeof window ? [] : window.galite && window.galite.q || [];
          }
          e.a = r;
        }, function(t, e) {
          Array.from = Array.from || function() {
            var t2;
            return (t2 = Array.prototype.slice).call.apply(t2, arguments);
          };
        }]).default;
      });
    }
  });

  // social-buttons.js
  var require_social_buttons = __commonJS({
    "social-buttons.js"() {
      document.addEventListener("click", function(event) {
        var btn = event.target.closest(".btn-popup");
        if (!btn) {
          return;
        }
        event.preventDefault();
        PopupCenter(btn.getAttribute("href"), "share", 600, 300);
      });
      function PopupCenter(url, title, w, h) {
        var dualScreenLeft = window.screenLeft != void 0 ? window.screenLeft : screen.left;
        var dualScreenTop = window.screenTop != void 0 ? window.screenTop : screen.top;
        width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
        var left = width / 2 - w / 2 + dualScreenLeft;
        var top = height / 2 - h / 2 + dualScreenTop;
        var newWindow = window.open(url, title, "scrollbars=yes, width=" + w + ", height=" + h + ", top=" + top + ", left=" + left);
        if (window.focus) {
          newWindow.focus();
        }
      }
    }
  });

  // custom.js
  var require_custom = __commonJS({
    "custom.js"() {
      var cbpAnimatedHeader = (function() {
        if (location.pathname != "/") {
          return;
        }
        var docElem = document.documentElement, header = document.querySelector(".cbp-af-header"), didScroll = false, changeHeaderOn = 300;
        function init() {
          scrollPage();
          window.addEventListener("scroll", function(event) {
            if (!didScroll) {
              didScroll = true;
              setTimeout(scrollPage, 200);
            }
          }, false);
        }
        function scrollPage() {
          var sy = scrollY();
          if (header) {
            header.classList.toggle("cbp-af-header-shrink", sy >= changeHeaderOn);
          }
          didScroll = false;
        }
        function scrollY() {
          return window.pageYOffset || docElem.scrollTop;
        }
        init();
      })();
      galite("create", "UA-33448710-3", "auto");
      galite("send", "pageview");
      window.addEventListener(
        "unload",
        function() {
          galite("send", "timing", "JS Dependencies", "unload");
        }
      );
    }
  });

  // main.js
  require_ga_lite_min();
  require_social_buttons();
  require_custom();
})();
//# sourceMappingURL=main.js.map
