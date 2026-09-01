/* ============================================================
   Investoor.de  |  ticker.js
   Live market data for the top strip.

   Without an API key the strip shows real EUR/USD and Bitcoin
   (free public sources, no key needed) and leaves the index and
   gold values as indicative. Paste a Twelve Data key below and
   all five values become live.
   ============================================================ */
(function () {
    "use strict";

    var CONFIG = {
        /* Free key from twelvedata.com, 800 requests per day is plenty at one
           refresh per minute. Leave empty to run without indices and gold. */
        TWELVE_DATA_KEY: "",
        REFRESH_MS: 60000
    };

    var strip = document.querySelector(".ticker-inner");
    if (!strip) return;

    var note = document.querySelector(".ticker-note");
    var track = document.getElementById("tickerTrack");

    /* the row is duplicated so the marquee can loop without a visible jump */
    if (track && !track.getAttribute("data-cloned")) {
        track.innerHTML += track.innerHTML;
        track.setAttribute("data-cloned", "1");
    }

    function nodes(symbol) {
        return strip.querySelectorAll('.tick[data-symbol="' + symbol + '"]');
    }
    var symbols = {};
    [].forEach.call(strip.querySelectorAll(".tick[data-symbol]"), function (el) {
        symbols[el.getAttribute("data-symbol")] = true;
    });

    var locale = function () {
        return (window.INV_I18N && window.INV_I18N.lang() === "en") ? "en-US" : "de-DE";
    };

    function render(symbol, price, changePct, decimals) {
        if (!symbols[symbol] || price == null || isNaN(price)) return;
        [].forEach.call(nodes(symbol), function (el) {
            var value = el.querySelector(".val");
            var change = el.querySelector(".chg");
            if (value) {
                value.textContent = Number(price).toLocaleString(locale(), {
                    minimumFractionDigits: decimals,
                    maximumFractionDigits: decimals
                });
            }
            if (change && changePct != null && !isNaN(changePct)) {
                var up = changePct >= 0;
                change.textContent = (up ? "+" : "") +
                    Number(changePct).toLocaleString(locale(), { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " %";
                change.className = "chg " + (up ? "up" : "down");
            }
            el.classList.add("is-live");
        });
        updateNote();
    }

    function updateNote() {
        var total = Object.keys(symbols).length;
        var live = {};
        [].forEach.call(strip.querySelectorAll(".tick.is-live"), function (el) {
            live[el.getAttribute("data-symbol")] = true;
        });
        live = Object.keys(live).length;
        if (!live) return;
        strip.setAttribute("data-live", live >= total ? "1" : "partial");
        if (!note) return;
        var en = locale() === "en-US";
        if (!CONFIG.TWELVE_DATA_KEY) {
            /* only part of the strip has a real source, so nothing claims to be live */
            note.textContent = en ? "Indicative" : "Indikativ";
            return;
        }
        note.textContent = live >= total ? "Live" : (en ? "Partly live" : "Teilweise live");
    }

    function getJSON(url) {
        return fetch(url, { cache: "no-store" }).then(function (r) {
            if (!r.ok) throw new Error(r.status);
            return r.json();
        });
    }

    /* --- free sources, no key --- */
    function loadFree() {
        getJSON("https://api.frankfurter.dev/v1/latest?base=EUR&symbols=USD")
            .then(function (d) { render("EURUSD", d.rates && d.rates.USD, null, 4); })
            .catch(function () {});

        getJSON("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur&include_24hr_change=true")
            .then(function (d) {
                var b = d.bitcoin || {};
                render("BTC", b.eur, b.eur_24h_change, 0);
            })
            .catch(function () {});
    }

    /* --- full feed, needs a Twelve Data key --- */
    function loadKeyed() {
        var symbols = "DAX,SPX,XAU/USD,EUR/USD,BTC/EUR";
        getJSON("https://api.twelvedata.com/quote?symbol=" + encodeURIComponent(symbols) +
                "&apikey=" + encodeURIComponent(CONFIG.TWELVE_DATA_KEY))
            .then(function (d) {
                var map = {
                    "DAX": ["DAX", 2],
                    "SPX": ["SPX", 2],
                    "XAU/USD": ["XAU", 2],
                    "EUR/USD": ["EURUSD", 4],
                    "BTC/EUR": ["BTC", 0]
                };
                Object.keys(map).forEach(function (key) {
                    var q = d[key] || (d.symbol === key ? d : null);
                    if (!q || q.status === "error") return;
                    render(map[key][0], parseFloat(q.close), parseFloat(q.percent_change), map[key][1]);
                });
            })
            .catch(function () { loadFree(); });
    }

    function refresh() {
        if (CONFIG.TWELVE_DATA_KEY) loadKeyed();
        else loadFree();
    }

    /* Values without a data source drift slightly, the way the reference demo
       does it, so the strip looks alive. They stay marked as indicative. */
    /* Values without a data source drift slightly, the way the reference demo
       does it, so the strip looks alive. They stay marked as indicative.
       Every copy of a symbol gets the same value, the row is duplicated. */
    function drift() {
        Object.keys(symbols).forEach(function (sym) {
            var first = strip.querySelector('.tick[data-symbol="' + sym + '"]');
            if (!first || first.classList.contains("is-live")) return;

            var val = first.querySelector(".val");
            var chg = first.querySelector(".chg");
            if (!val) return;

            var text = val.textContent;
            var decimals = (text.split(",")[1] || "").length;
            var num = parseFloat(text.replace(/\./g, "").replace(",", "."));
            if (isNaN(num) || num <= 0) return;

            var delta = (Math.random() - 0.48) * num * 0.0009;
            var next = num + delta;
            var nextText = next.toLocaleString(locale(), {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            });

            var pctText = null, cls = null;
            if (chg) {
                var pct = parseFloat(chg.textContent.replace(",", ".").replace(/[^0-9.-]/g, ""));
                if (!isNaN(pct)) {
                    pct = pct + (delta / num) * 100;
                    var up = pct >= 0;
                    pctText = (up ? "+" : "") + pct.toLocaleString(locale(), {
                        minimumFractionDigits: 2, maximumFractionDigits: 2
                    }) + " %";
                    cls = "chg " + (up ? "up" : "down");
                }
            }

            [].forEach.call(nodes(sym), function (el) {
                var v = el.querySelector(".val");
                var c = el.querySelector(".chg");
                if (v) v.textContent = nextText;
                if (c && pctText) { c.textContent = pctText; c.className = cls; }
            });
        });
    }

    refresh();
    setInterval(refresh, CONFIG.REFRESH_MS);
    setInterval(drift, 3000);
    document.addEventListener("inv:lang", refresh);
})();
