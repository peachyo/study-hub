/* Experimental Design interactive tools: statistics + outliers, trial budget, report self-score */
(function () {
  "use strict";
  window.HWidgets = window.HWidgets || {};
  function h(tag, attrs, kids) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { if (k === "text") e.textContent = attrs[k]; else if (k === "html") e.innerHTML = attrs[k]; else e.setAttribute(k, attrs[k]); });
    (kids || []).forEach(function (c) { e.appendChild(c); });
    return e;
  }
  function fmt(x, d) { if (x === null || x === undefined || isNaN(x)) return "–"; d = d === undefined ? 2 : d; return String(+x.toFixed(d)); }
  function quantile(sorted, p) { // inclusive method (Excel QUARTILE.INC): matches the CER sample sheet
    var pos = (sorted.length - 1) * p, lo = Math.floor(pos), hi = Math.ceil(pos);
    return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
  }
  function stats(vals, roundDigits) {
    var n = vals.length, s = vals.slice().sort(function (a, b) { return a - b; });
    var sum = vals.reduce(function (a, b) { return a + b; }, 0), mean = sum / n;
    var ss = vals.reduce(function (a, v) { return a + (v - mean) * (v - mean); }, 0);
    var sd = n > 1 ? Math.sqrt(ss / (n - 1)) : NaN;
    var q1 = quantile(s, 0.25), q3 = quantile(s, 0.75), med = quantile(s, 0.5), iqr = q3 - q1;
    var f = Math.pow(10, roundDigits), cnt = {}, best = 0;
    vals.forEach(function (v) { var r = Math.round(v * f) / f; cnt[r] = (cnt[r] || 0) + 1; if (cnt[r] > best) best = cnt[r]; });
    var modes = best > 1 ? Object.keys(cnt).filter(function (k) { return cnt[k] === best; }).map(Number).sort(function (a, b) { return a - b; }) : [];
    var lo = q1 - 1.5 * iqr, hi = q3 + 1.5 * iqr;
    return { n: n, sum: sum, mean: mean, med: med, modes: modes, min: s[0], max: s[n - 1], range: s[n - 1] - s[0], q1: q1, q3: q3, iqr: iqr, sd: sd, ss: ss, lo: lo, hi: hi,
      out: vals.filter(function (v) { return v < lo || v > hi; }) };
  }

  /* ---------- Statistics & outlier calculator ---------- */
  window.HWidgets.edstats = function (root) {
    var rows = [
      ["No weight (SOC)", "0", "3.25, 3.82, 3.55, 4.58, 1.95"],
      ["1 paperclip", "1", "4.22, 4.85, 5.22, 5.44, 6.11"],
      ["2 paperclips", "2", "5.14, 5.28, 6.33, 3.25, 5.58"],
      ["3 paperclips", "3", "5.98, 6.13, 6.55, 8.22, 6.25"]
    ];
    root.innerHTML = "<div class='hx-calc'><p class='sh-muted'>Enter one row per level of the independent variable. Statistics are computed <b>within each level</b>, as the scoring guide requires. The numeric IV value (optional) is used for the line of best fit. Pre-filled with the paper-airplane data from the Science Olympiad CER guide, so you can check your own arithmetic against theirs.</p>" +
      "<div class='hx-fields'><label>Units of the DV<input id='es-u' value='sec'></label><label>Round for mode (decimals)<input id='es-r' type='number' min='0' max='3' value='0'></label><label>Expected value (optional, for % error)<input id='es-e' placeholder='e.g. 5.0'></label></div>" +
      "<div id='es-rows'></div><button type='button' class='sh-btn' id='es-add'>+ Add level</button><div id='es-out'></div></div>";
    var box = root.querySelector("#es-rows"), out = root.querySelector("#es-out");
    function addRow(r) {
      var d = h("div", { class: "hx-fields es-row" });
      d.innerHTML = "<label style='flex:2 1 160px'>Level name<input class='n' value=''></label><label style='flex:0 1 90px'>IV value<input class='x' value=''></label><label style='flex:4 1 260px'>Trials (comma or space separated)<input class='v' value=''></label>";
      d.querySelector(".n").value = r[0]; d.querySelector(".x").value = r[1]; d.querySelector(".v").value = r[2];
      var rm = h("button", { type: "button", class: "sh-btn", text: "×", title: "Remove level", style: "align-self:end" });
      rm.onclick = function () { d.remove(); run(); }; d.appendChild(rm);
      box.appendChild(d);
    }
    rows.forEach(addRow);
    root.querySelector("#es-add").onclick = function () { addRow(["Level " + (box.children.length + 1), "", ""]); };
    function run() {
      var u = root.querySelector("#es-u").value, rd = parseInt(root.querySelector("#es-r").value, 10) || 0;
      var exp = parseFloat(root.querySelector("#es-e").value);
      var lv = [];
      Array.prototype.forEach.call(box.children, function (d) {
        var vals = d.querySelector(".v").value.split(/[\s,;]+/).filter(Boolean).map(Number).filter(function (v) { return !isNaN(v); });
        if (vals.length) lv.push({ name: d.querySelector(".n").value || "(level)", x: parseFloat(d.querySelector(".x").value), vals: vals, s: stats(vals, rd) });
      });
      if (!lv.length) { out.innerHTML = "<div class='hx-warn'>Enter at least one level with numbers.</div>"; return; }
      var th = "<tr><th></th>" + lv.map(function (l) { return "<th>" + l.name + "</th>"; }).join("") + "</tr>";
      function row(label, fn) { return "<tr><th>" + label + "</th>" + lv.map(function (l) { return "<td>" + fn(l.s, l) + "</td>"; }).join("") + "</tr>"; }
      var html = "<h4>Statistics per level <span class='sh-muted'>(" + u + ")</span></h4><div class='hx-scroll'><table class='hx-tbl'>" + th +
        row("n (trials)", function (s) { return s.n; }) +
        "<tr><th colspan='" + (lv.length + 1) + "' class='hx-sub'>Central tendency</th></tr>" +
        row("Mean", function (s) { return fmt(s.mean); }) + row("Median", function (s) { return fmt(s.med); }) +
        row("Mode (rounded)", function (s) { return s.modes.length ? s.modes.join(" or ") : "none"; }) +
        (isNaN(exp) ? "" : row("% error of mean", function (s) { return fmt(Math.abs(s.mean - exp) / Math.abs(exp) * 100, 1) + "%"; })) +
        "<tr><th colspan='" + (lv.length + 1) + "' class='hx-sub'>Variation</th></tr>" +
        row("Range (min–max)", function (s) { return fmt(s.range) + " (" + fmt(s.min) + "–" + fmt(s.max) + ")"; }) +
        row("Q1 / Q3", function (s) { return fmt(s.q1) + " / " + fmt(s.q3); }) +
        row("IQR", function (s) { return fmt(s.iqr); }) +
        row("Std. deviation (sample)", function (s) { return fmt(s.sd); }) +
        "<tr><th colspan='" + (lv.length + 1) + "' class='hx-sub'>Outliers (1.5 × IQR rule)</th></tr>" +
        row("Fences (low – high)", function (s) { return fmt(s.lo) + " – " + fmt(s.hi); }) +
        row("Outliers", function (s) { return s.out.length ? s.out.join(", ") : "none"; }) + "</table></div>";
      var total = lv.reduce(function (a, l) { return a + l.s.out.length; }, 0), pts = lv.reduce(function (a, l) { return a + l.vals.length; }, 0);
      html += "<p><b>" + total + "</b> outlier(s) out of " + pts + " data points. Quote this in your outlier CER.</p>";
      // line of best fit across all points with numeric x
      var X = [], Y = [];
      lv.forEach(function (l) { if (!isNaN(l.x)) l.vals.forEach(function (v) { X.push(l.x); Y.push(v); }); });
      var distinct = X.filter(function (v, i) { return X.indexOf(v) === i; }).length;
      if (distinct >= 2) {
        var n = X.length, mx = X.reduce(function (a, b) { return a + b; }, 0) / n, my = Y.reduce(function (a, b) { return a + b; }, 0) / n;
        var sxy = 0, sxx = 0, syy = 0; for (var i = 0; i < n; i++) { sxy += (X[i] - mx) * (Y[i] - my); sxx += (X[i] - mx) * (X[i] - mx); syy += (Y[i] - my) * (Y[i] - my); }
        var m = sxy / sxx, b = my - m * mx, r2 = syy ? sxy * sxy / (sxx * syy) : 1;
        html += "<h4>Line of best fit (all trials, IV numeric)</h4><div class='hx-ans'>y = <b>" + fmt(m, 3) + "</b>x + " + fmt(b, 3) + " &nbsp; (slope " + fmt(m, 3) + " " + u + " per unit of IV; R² = " + fmt(r2, 3) + ")<br>" +
          (m > 0 ? "Positive slope: the DV tends to increase as the IV increases." : m < 0 ? "Negative slope: the DV tends to decrease as the IV increases." : "Zero slope: no trend.") + "</div>";
      }
      var f = lv[0], s = f.s;
      html += "<h4>Sample calculation for “" + f.name + "” (write one like this for each statistic)</h4><div class='sh-code'>Mean = (" + f.vals.join(" + ") + ") ÷ " + s.n + " = " + fmt(s.sum) + " ÷ " + s.n + " = " + fmt(s.mean) + " " + u + "\n" +
        "Median = middle of the sorted values (" + f.vals.slice().sort(function (a, b) { return a - b; }).join(", ") + ") = " + fmt(s.med) + " " + u + "\n" +
        "Range = " + fmt(s.max) + " − " + fmt(s.min) + " = " + fmt(s.range) + " " + u + "\n" +
        "IQR = Q3 − Q1 = " + fmt(s.q3) + " − " + fmt(s.q1) + " = " + fmt(s.iqr) + " " + u + "\n" +
        "SD = √[ Σ(x − mean)² ÷ (n − 1) ] = √[ " + fmt(s.ss, 3) + " ÷ " + (s.n - 1) + " ] = " + fmt(s.sd) + " " + u + "\n" +
        "Outlier fences = Q1 − 1.5·IQR = " + fmt(s.lo) + " and Q3 + 1.5·IQR = " + fmt(s.hi) + " " + u + "</div>";
      out.innerHTML = html;
    }
    root.addEventListener("input", run);
    root.addEventListener("click", function (e) { if (e.target.id === "es-add") run(); });
    run();
  };

  /* ---------- Trial budget ---------- */
  window.HWidgets.edbudget = function (root) {
    root.innerHTML = "<div class='hx-calc'><b>Will my design fit in the time?</b><p class='sh-muted'>Part 1 is 20 minutes and Part 2 is 30 minutes. In Part 2 you may keep experimenting, but you also need that time for graph, statistics, errors and conclusion. Count the SOC as a level.</p>" +
      "<div class='hx-fields'><label>Levels (including SOC)<input id='eb-l' type='number' min='1' value='4'></label><label>Trials per level<input id='eb-t' type='number' min='1' value='5'></label>" +
      "<label>Seconds per trial (incl. reset &amp; recording)<input id='eb-s' type='number' min='1' value='40'></label><label>Seconds to change the IV between levels<input id='eb-c' type='number' min='0' value='30'></label>" +
      "<label>Set-up &amp; practice (minutes)<input id='eb-p' type='number' min='0' value='6'></label><label>Minutes you can spend experimenting<input id='eb-a' type='number' min='1' value='25'></label></div><div id='eb-o'></div></div>";
    var g = function (id) { return parseFloat(root.querySelector("#eb-" + id).value) || 0; }, o = root.querySelector("#eb-o");
    function run() {
      var L = g("l"), T = g("t"), S = g("s"), C = g("c"), P = g("p"), A = g("a");
      var trials = L * T, mins = P + (trials * S + L * C) / 60, left = A - mins;
      var cls = left >= 0 ? "hx-ans" : "hx-warn";
      var msg = "<b>" + trials + " trials</b> in total → about <b>" + mins.toFixed(1) + " min</b> of work (" + P + " set-up + " + ((trials * S + L * C) / 60).toFixed(1) + " testing). " +
        (left >= 0 ? "You have <b>" + left.toFixed(1) + " min</b> spare. " : "You are <b>" + (-left).toFixed(1) + " min over</b>. ");
      if (T < 3) msg += "<br>⚠ Fewer than 3 trials per level makes median, IQR and outliers meaningless; keep at least 3.";
      if (L < 4) msg += "<br>⚠ You need at least 3 levels of the IV, plus an SOC.";
      if (left < 0) { var maxT = Math.floor(((A - P) * 60 - L * C) / (L * S)); msg += "<br>Try <b>" + Math.max(0, maxT) + " trials per level</b> (min 3) or shorten the reset time."; }
      else { var more = Math.floor(left * 60 / (L * S)); if (more >= 1) msg += "<br>You could afford up to <b>" + more + " more trial(s) per level</b>; more repeats means a better estimate of variation."; }
      o.innerHTML = "<div class='" + cls + "'>" + msg + "</div>";
    }
    root.addEventListener("input", run); run();
  };

  /* ---------- Self-score checklist ---------- */
  // [id, title, max, rule ('d' = deduct one point per missing item, else proportional), criteria]
  var R = [
    ["A", "A · Statement of problem", 2, "", ["Not a yes/no question", "Topic of the experiment is defined", "Both IV and DV are named", "Clearly testable with the materials provided"]],
    ["B1", "B · Hypothesis: relationship", 2, "", ["Predicts a relationship between IV and DV", "Both variables appear in the statement"]],
    ["B2", "B · Hypothesis: direction", 2, "", ["Takes a specific direction (not open-ended)", "Both IV and DV included"]],
    ["B3", "B · Hypothesis: rationale", 2, "", ["Brief scientific rationale given", "Rationale is relevant to this experiment"]],
    ["C1", "C · IV identified & defined", 4, "d", ["Correctly identified", "Only one IV", "It is the variable you manipulate", "Operationally defined with units and tools"]],
    ["C2", "C · IV levels", 3, "", ["Level 1 given and relevant", "Level 2 given and relevant", "Level 3 given and relevant"]],
    ["C3", "C · DV identified & defined", 4, "d", ["Correctly identified", "Only one DV", "It is the measured variable showing the IV’s effect", "Operationally defined with units and tools"]],
    ["C4", "C · Controlled variable #1", 2, "", ["Correctly identified as controlled", "Relevant to the experiment"]],
    ["C5", "C · Controlled variable #2", 2, "", ["Correctly identified as controlled", "Relevant to the experiment"]],
    ["C6", "C · Constant", 2, "", ["A true constant is identified", "Relevant to the experiment"]],
    ["D1", "D · Materials list", 2, "", ["In list format, separate from the procedure", "All materials used are listed", "Quantified by the amount actually used"]],
    ["D2", "D · No extras", 2, "", ["No unused items listed", "No items listed that were only provided"]],
    ["E1", "E · Numbered list", 2, "", ["Procedure is a numbered list", "One step per line"]],
    ["E2", "E · Sequence", 2, "", ["Logical order", "All relevant actions included"]],
    ["E3", "E · Repeated trials", 2, "", ["Repeated trials at each level of the IV", "Repeats are within the same level, not across levels"]],
    ["E4", "E · Diagrams (number)", 2, "", ["Relevant diagram #1", "Relevant diagram #2"]],
    ["E5", "E · Diagram quality", 2, "", ["Diagrams help explain the procedure or set-up", "Diagrams are labeled and titled"]],
    ["E6", "E · Repeatable by someone else", 4, "d", ["No unstated assumptions", "No reasonable questions remain after reading", "Diagrams enhance the procedure", "States the specific quantitative and qualitative data collected", "States how the SOC was determined and measured"]],
    ["F1", "F · Observations: procedure", 4, "d", ["Words-based", "What worked well", "What did not work well", "Modifications that were needed / irregularities"]],
    ["F2", "F · Observations: results", 4, "d", ["Words-based", "Results as expected? Why or why not", "Outliers and possible reasons", "Trend in the data"]],
    ["F3", "F · Observations: throughout", 4, "d", ["Words-based", "Taken from the pre-lab stage onward", "About data collection", "About results"]],
    ["G1", "G · Raw data table", 2, "", ["Numbers-based, in a properly labeled table with units", "All measured data included"]],
    ["G2", "G · Condensed table", 2, "", ["Second table with only the data to be graphed", "At least one example calculation for each derived value"]],
    ["G3", "G · Titles & labels", 2, "", ["Every table has a title", "Every column and row is labeled"]],
    ["G4", "G · Units", 2, "", ["Units in every column/row heading or on each value", "No data point is missing a unit"]],
    ["H1", "H · Graph type & axes", 4, "", ["Graph type fits the IV (bars if qualitative, scatter/line if quantitative)", "IV on the x-axis and DV on the y-axis", "A readable graph is present"]],
    ["H2", "H · Graph labels", 4, "d", ["Descriptive, relevant title", "X-axis heading", "Y-axis heading", "Legend with a title if several symbols"]],
    ["H3", "H · Units & scale", 4, "", ["Units on data or axis headings", "Scale fits the data and uses the space", "No breaks in either axis"]],
    ["I1", "I · Central tendency", 4, "", ["At least three measures", "Computed within each level, not across levels"]],
    ["I2", "I · Example calculations", 4, "", ["An example calculation for every statistic", "Units included"]],
    ["I3", "I · Variation", 4, "", ["At least three measures (State/Nationals) or the required number", "Computed within each level"]],
    ["I4", "I · Accuracy", 2, "", ["No arithmetic errors", "Correct formulas (e.g., sample standard deviation)"]],
    ["K1", "K · CER: variation, claim", 2, "", ["About variation (not the trend)", "Relates to this experiment"]],
    ["K2", "K · CER: variation, evidence", 2, "", ["Cites variation statistics (SD, range, IQR)", "Only evidence that supports the claim"]],
    ["K3", "K · CER: variation, reasoning", 2, "", ["Links evidence to claim", "Explains why (e.g., uncontrolled variables)"]],
    ["K4", "K · CER: outliers, claim", 2, "", ["States which or how many outliers", "Relates to this data"]],
    ["K5", "K · CER: outliers, evidence", 2, "", ["Applies a quantitative rule (e.g., 1.5 × IQR)", "Shows fences and the outlier values"]],
    ["K6", "K · CER: outliers, reasoning", 2, "", ["Links evidence to claim", "Interprets what the outliers mean"]],
    ["K7", "K · CER: trend, claim", 2, "", ["States the effect of the IV on the DV", "Matches the data"]],
    ["K8", "K · CER: trend, evidence", 2, "", ["Means, medians or slope of best fit", "Only relevant evidence"]],
    ["K9", "K · CER: trend, reasoning", 2, "", ["Links evidence to claim", "Compares with the hypothesis or science"]],
    ["J1", "J · Error #1", 4, "d", ["Specific error identified", "Type named (random / procedural / systematic)", "Effect on the resulting data", "Effect on the data trend"]],
    ["J2", "J · Error #2", 4, "d", ["Specific error identified", "Type named (random / procedural / systematic)", "Effect on the resulting data", "Effect on the data trend"]],
    ["L1", "L · Hypothesis restated", 2, "", ["Hypothesis restated", "Not changed from the original"]],
    ["L2", "L · Conclusion claim", 2, "", ["Says the data support / do not support the hypothesis (not “proved” or “wrong”)", "Related to your hypothesis"]],
    ["L3", "L · Conclusion evidence", 2, "", ["Cites specific data", "Evidence is relevant to the hypothesis"]],
    ["L4", "L · Conclusion reasoning", 2, "", ["Ties evidence to the claim", "Data-driven, not opinion"]],
    ["M1", "M · Improvements (3)", 3, "", ["Specific improvement #1", "Specific improvement #2", "Specific improvement #3"]],
    ["M2", "M · Practical applications (3)", 3, "", ["Application #1", "Application #2", "Application #3"]],
    ["M3", "M · Future experiments (3)", 3, "", ["Future experiment #1", "Future experiment #2", "Future experiment #3"]]
  ];
  window.HWidgets.edscore = function (root) {
    var total = R.reduce(function (a, g) { return a + g[2]; }, 0);
    root.innerHTML = "<div class='hx-calc'><div class='hx-score'><div><b id='sc-t'>0</b> / " + total + " <span class='sh-muted'>estimated points</span></div><div class='hx-meter'><span id='sc-bar'></span></div><div class='sh-muted' id='sc-w'></div></div>" +
      "<p class='sh-muted'>Tick everything your report actually contains. Be strict: a grader will be. Partial credit is estimated from the scoring guide and may differ slightly from your judges’. Your ticks are not saved.</p><div id='sc-g'></div>" +
      "<button type='button' class='sh-btn' id='sc-reset'>Clear all</button></div>";
    var holder = root.querySelector("#sc-g");
    R.forEach(function (g) {
      var d = h("details", { class: "hx-grp" });
      d.appendChild(h("summary", { html: "<span>" + g[1] + "</span> <span class='sh-muted gs' data-id='" + g[0] + "'>0/" + g[2] + "</span>" }));
      g[4].forEach(function (c, i) {
        var l = h("label", { class: "hx-chk" });
        var cb = h("input", { type: "checkbox" }); cb.setAttribute("data-g", g[0]);
        l.appendChild(cb); l.appendChild(h("span", { text: " " + c })); d.appendChild(l);
      });
      holder.appendChild(d);
    });
    function score(g) {
      var cbs = holder.querySelectorAll("input[data-g='" + g[0] + "']"), have = 0;
      Array.prototype.forEach.call(cbs, function (c) { if (c.checked) have++; });
      var n = g[4].length, miss = n - have, sc;
      if (g[3] === "d") sc = Math.max(0, g[2] - miss); else sc = Math.round(g[2] * have / n * 2) / 2;
      return sc;
    }
    function run() {
      var sum = 0, weak = [];
      R.forEach(function (g) {
        var s = score(g); sum += s;
        holder.querySelector(".gs[data-id='" + g[0] + "']").textContent = s + "/" + g[2];
        if (s < g[2]) weak.push([g[2] - s, g[1]]);
      });
      weak.sort(function (a, b) { return b[0] - a[0]; });
      root.querySelector("#sc-t").textContent = sum;
      root.querySelector("#sc-bar").style.width = (100 * sum / total) + "%";
      root.querySelector("#sc-w").textContent = sum && weak.length ? "Biggest gaps: " + weak.slice(0, 3).map(function (w) { return w[1] + " (−" + w[0] + ")"; }).join("; ") : "";
    }
    holder.addEventListener("change", run);
    root.querySelector("#sc-reset").onclick = function () { Array.prototype.forEach.call(holder.querySelectorAll("input"), function (c) { c.checked = false; }); run(); };
    run();
  };
  window.HWidgets._edTotal = function () { return R.reduce(function (a, g) { return a + g[2]; }, 0); };
})();
