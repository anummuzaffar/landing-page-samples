/* ============================================================
   Investoor.de  |  script.js
   Shared behaviour: navigation, calculator, tabs, FAQ, reveal
   ============================================================ */
(function () {
    "use strict";

    var i18n = window.INV_I18N || { t: function (s) { return s; }, locale: function () { return "de-DE"; }, apply: function () {} };

    var euro = function (n) {
        return n.toLocaleString(i18n.locale(), { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
    };
    var int = function (n) {
        return Math.round(n).toLocaleString(i18n.locale());
    };

    /* ---------- 0. Colour theme for the preview (?theme=steel|royal|light) ---------- */
    var th = /[?&](?:theme|bg)=([a-z]+)/i.exec(window.location.search);
    if (th && ["steel", "royal", "light", "onyx", "grey"].indexOf(th[1].toLowerCase()) > -1) {
        document.body.setAttribute("data-theme", th[1].toLowerCase());
    }

    /* ---------- 1. Sticky header ---------- */
    var header = document.getElementById("header");
    var toTop = document.getElementById("toTop");
    window.addEventListener("scroll", function () {
        var y = window.scrollY;
        if (header) header.classList.toggle("scrolled", y > 20);
        if (toTop) toTop.classList.toggle("show", y > 500);
    });
    if (toTop) {
        toTop.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    /* ---------- 2. Mobile drawer ---------- */
    var burger = document.getElementById("burger");
    var drawer = document.getElementById("drawer");
    var overlay = document.getElementById("overlay");
    var drawerClose = document.getElementById("drawerClose");

    function setDrawer(open) {
        if (!drawer) return;
        drawer.classList.toggle("open", open);
        if (overlay) overlay.classList.toggle("open", open);
        document.body.style.overflow = open ? "hidden" : "";
    }
    if (burger) burger.addEventListener("click", function () { setDrawer(true); });
    if (drawerClose) drawerClose.addEventListener("click", function () { setDrawer(false); });
    if (overlay) overlay.addEventListener("click", function () { setDrawer(false); });
    if (drawer) {
        drawer.querySelectorAll("a").forEach(function (a) {
            a.addEventListener("click", function () { setDrawer(false); });
        });
    }
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") { setDrawer(false); closeLang(); closeBv(); }
    });

    /* ---------- 3. Language dropdown ---------- */
    var langBtn = document.getElementById("langBtn");
    var langMenu = document.getElementById("langMenu");
    function closeLang() { if (langMenu) langMenu.classList.remove("open"); }
    if (langBtn && langMenu) {
        langBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            langMenu.classList.toggle("open");
        });
        document.addEventListener("click", closeLang);

        /* Preview mode: switching only updates the label. On the live site each
           entry gets its href from data-live-base + the language code. */
        var langLabel = document.getElementById("langLabel");
        document.addEventListener("inv:lang", function (e) {
            var code = e.detail.lang;
            if (langLabel) langLabel.textContent = code.toUpperCase();
            langMenu.querySelectorAll("a[data-lang]").forEach(function (o) {
                o.classList.toggle("active", o.getAttribute("data-lang") === code);
            });
            calculate();
        });
        langMenu.querySelectorAll("a[data-lang]").forEach(function (a) {
            a.addEventListener("click", function (e) {
                e.preventDefault();
                langMenu.querySelectorAll("a[data-lang]").forEach(function (o) { o.classList.remove("active"); });
                a.classList.add("active");
                var code = a.getAttribute("data-lang");
                if (langLabel) langLabel.textContent = code.toUpperCase();
                i18n.apply(code);
                calculate();
                closeLang();
            });
        });
    }

    /* ---------- 4. Yield calculator ---------- */
    var capitalInput = document.getElementById("capitalInput");
    var capitalRange = document.getElementById("capitalRange");
    var durationSelect = document.getElementById("durationSelect");
    var resTotal = document.getElementById("resTotal");
    var resGain = document.getElementById("resGain");
    var resRate = document.getElementById("resRate");
    var resMonthly = document.getElementById("resMonthly");
    var resCapital = document.getElementById("resCapital");
    var resTitle = document.getElementById("resTitle");
    var rate = 14;

    function paintRange(el) {
        if (!el) return;
        var pct = ((el.value - el.min) / (el.max - el.min)) * 100;
        el.style.background =
            "linear-gradient(90deg, var(--accent) 0%, var(--accent) " + pct + "%, rgba(255,255,255,0.1) " + pct + "%)";
    }

    var TERM_RATE = { 12: 14, 24: 14.5, 36: 15 };

    function calculate() {
        if (!capitalRange || !resTotal) return;
        var capital = parseFloat(capitalRange.value) || 0;
        var months = parseInt(durationSelect ? durationSelect.value : 12, 10);
        var years = months / 12;
        var effective = (rate === 14 && TERM_RATE[months]) ? TERM_RATE[months] : rate;
        var gain = capital * (effective / 100) * years;

        resTotal.textContent = euro(capital + gain);
        resGain.textContent = "+ " + euro(gain);
        resRate.textContent = effective.toLocaleString(i18n.locale(), { minimumFractionDigits: 2 }) + " % p.a.";
        resMonthly.textContent = euro(gain / months) + " " + i18n.t("/ Monat");
        resCapital.textContent = euro(capital);
        resTitle.textContent = i18n.t("Gesamtauszahlung") + " (" + months + " " + i18n.t("Monate Laufzeit") + ")";
    }

    if (capitalRange) {
        capitalRange.addEventListener("input", function () {
            if (capitalInput) capitalInput.value = int(capitalRange.value);
            paintRange(capitalRange);
            calculate();
        });
        paintRange(capitalRange);
    }

    if (capitalInput) {
        capitalInput.addEventListener("input", function () {
            var raw = capitalInput.value.replace(/[^0-9]/g, "");
            var val = parseInt(raw || "0", 10);
            if (val > parseInt(capitalRange.max, 10)) val = parseInt(capitalRange.max, 10);
            capitalRange.value = val;
            paintRange(capitalRange);
            calculate();
        });
        capitalInput.addEventListener("blur", function () {
            var val = parseInt(capitalRange.value, 10);
            if (val < parseInt(capitalRange.min, 10)) {
                val = parseInt(capitalRange.min, 10);
                capitalRange.value = val;
                paintRange(capitalRange);
                calculate();
            }
            capitalInput.value = int(val);
        });
    }

    if (durationSelect) durationSelect.addEventListener("change", calculate);

    document.querySelectorAll(".calc-head .tab").forEach(function (tab) {
        tab.addEventListener("click", function () {
            document.querySelectorAll(".calc-head .tab").forEach(function (t) { t.classList.remove("active"); });
            tab.classList.add("active");
            rate = parseFloat(tab.getAttribute("data-rate")) || 14;
            calculate();
        });
    });

    calculate();

    /* ---------- 5. Pricing tabs ---------- */
    var ptabs = document.querySelectorAll(".ptab");
    ptabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            var group = tab.getAttribute("data-group");
            ptabs.forEach(function (t) { t.classList.remove("active"); });
            tab.classList.add("active");
            document.querySelectorAll(".plan-group").forEach(function (g) {
                g.hidden = group !== "all" && g.getAttribute("data-group") !== group;
            });
        });
    });

    /* ---------- 5b. Commission and BV modal ---------- */
    var bvModal = document.getElementById("bvModal");
    var bvBody = document.getElementById("bvBody");
    var bvClose = document.getElementById("bvClose");

    function openBv(plan, bv, ref) {
        if (!bvModal || !bvBody) return;
        var en = i18n.lang && i18n.lang() === "en";
        bvBody.innerHTML =
            '<h4>' + (en ? "Business volume (BV)" : "Business Volume (BV)") + '</h4>' +
            '<p>' + (en
                ? "This plan counts with a business volume of <b>" + bv + " BV</b> in your partner network. The volume is used to calculate the matching and team bonus."
                : "Für diesen Tarif wird ein Volumen von <b>" + bv + " BV</b> in Ihrem Partner-Netzwerk angerechnet. Dieses Volumen dient zur Berechnung des Matching- und Team-Bonus.") + '</p>' +
            '<div class="kv"><span>' + (en ? "Plan" : "Tarif") + '</span><b>' + plan + '</b></div>' +
            '<div class="kv"><span>' + (en ? "Business volume" : "Business Volume") + '</span><b>' + bv + ' BV</b></div>' +
            '<div class="kv"><span>' + (en ? "Direct commission" : "Direktprovision") + '</span><b>' + ref + '</b></div>' +
            '<div class="kv"><span>' + (en ? "Payout" : "Auszahlung") + '</span><b>' + (en ? "Monthly, lifetime" : "Monatlich, lebenslang") + '</b></div>';
        bvModal.hidden = false;
        document.body.style.overflow = "hidden";
    }
    function closeBv() {
        if (!bvModal) return;
        bvModal.hidden = true;
        document.body.style.overflow = "";
    }
    document.querySelectorAll(".plan-info").forEach(function (btn) {
        btn.addEventListener("click", function () {
            openBv(btn.getAttribute("data-plan"), btn.getAttribute("data-bv"), btn.getAttribute("data-ref"));
        });
    });
    if (bvClose) bvClose.addEventListener("click", closeBv);
    if (bvModal) bvModal.addEventListener("click", function (e) { if (e.target === bvModal) closeBv(); });

    /* ---------- 6. FAQ accordion ---------- */
    document.querySelectorAll(".faq-item").forEach(function (item) {
        var q = item.querySelector(".faq-q");
        var a = item.querySelector(".faq-a");
        if (!q || !a) return;
        q.addEventListener("click", function () {
            var isOpen = item.classList.contains("open");
            document.querySelectorAll(".faq-item").forEach(function (other) {
                other.classList.remove("open");
                var oa = other.querySelector(".faq-a");
                if (oa) oa.style.maxHeight = null;
            });
            if (!isOpen) {
                item.classList.add("open");
                a.style.maxHeight = a.scrollHeight + "px";
            }
        });
    });

    /* ---------- 7. Reveal on scroll ---------- */
    var revealItems = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealItems.forEach(function (el) { io.observe(el); });
    } else {
        revealItems.forEach(function (el) { el.classList.add("visible"); });
    }
})();
