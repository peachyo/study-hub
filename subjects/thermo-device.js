/* Thermodynamics Part II: the heat-collecting device and the temperature forecast. Loaded after thermodynamics.js */
(function () {
  "use strict";
  var LV = "5 · Part II: device & forecast (50 pts)";
  window.HWidgets = window.HWidgets || {};

  function ul(a) { return "<ul>" + a.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul>"; }
  function ol(a) { return "<ol class='hx-steps'>" + a.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ol>"; }
  function tbl(head, rows) { return "<div class='hx-scroll'><table class='hx-tbl'><tr>" + head.map(function (x) { return "<th>" + x + "</th>"; }).join("") + "</tr>" + rows.map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>"; }).join("") + "</table></div>"; }
  function h4(t) { return "<h4>" + t + "</h4>"; }
  var SRC = "2027 Division B Rules, Thermodynamics B (rules 1–6); Starter Pack p.2";

  /* ---------------- helpers ---------------- */
  function num(root, id) { return parseFloat(root.querySelector("#" + id).value); }
  function fx(x, d) { return isNaN(x) || !isFinite(x) ? "–" : String(+x.toFixed(d === undefined ? 1 : d)); }

  /* Fit T(t) = Teq - (Teq - T0) e^(-t/tau) from two readings; returns {tau, a, linear} where a = Teq - T0 */
  function fitCurve(T0, t1, T1, t2, T2) {
    var d1 = T1 - T0, d2 = T2 - T0;
    if (!(d1 > 0) || !(d2 > 0) || !(t2 > t1) || !(t1 > 0)) return null;
    var r = d2 / d1, rmax = t2 / t1;
    if (r >= rmax - 1e-6) return { linear: true, rate: d1 / t1 };
    if (r <= 1 + 1e-6) return { tau: 0.05, a: d2, linear: false };
    var lo = 0.01, hi = 1e5, f = function (tau) { return (1 - Math.exp(-t2 / tau)) / (1 - Math.exp(-t1 / tau)); };
    for (var i = 0; i < 200; i++) { var mid = Math.sqrt(lo * hi); if (f(mid) < r) lo = mid; else hi = mid; }
    var tau = Math.sqrt(lo * hi);
    return { tau: tau, a: d1 / (1 - Math.exp(-t1 / tau)), linear: false };
  }
  function predict(fit, h0, T0, room0, n, h, t, Tstart, room, corr) {
    var scale = Math.pow(h0 / h, n), T;
    if (fit.linear) T = Tstart + fit.rate * scale * t;
    else {
      var theta0 = (T0 + fit.a) - room0, Teq = room + theta0 * scale;
      T = Teq - (Teq - Tstart) * Math.exp(-t / fit.tau);
    }
    return Math.max(Tstart, T) - corr;
  }

  /* ---------------- Forecast calculator ---------------- */
  window.HWidgets.thforecast = function (root) {
    root.innerHTML =
      "<div class='hx-calc'><p class='sh-muted'>Calibrate with two readings from a practice run at home (same device, same height), then forecast the competition. The model assumes the water approaches an equilibrium temperature exponentially, T(t) = T<sub>eq</sub> − (T<sub>eq</sub> − T<sub>start</sub>)·e<sup>−t/τ</sup>, and that the energy reaching the device falls with height as (h₀/h)<sup>n</sup> (n ≈ 2 for a point source). Defaults are invented numbers.</p>" +
      "<h4>1 · Your calibration run (practice at home)</h4>" +
      "<div class='hx-fields'><label>Lamp height h₀ (cm)<input id='tf-h0' type='number' value='40'></label><label>Start water temp (°C)<input id='tf-T0' type='number' step='0.1' value='21.0'></label><label>Room temp (°C)<input id='tf-r0' type='number' step='0.1' value='21.0'></label>" +
      "<label>Time 1 (min)<input id='tf-t1' type='number' step='0.5' value='5'></label><label>Water temp at time 1 (°C)<input id='tf-T1' type='number' step='0.1' value='27.0'></label>" +
      "<label>Time 2 (min)<input id='tf-t2' type='number' step='0.5' value='10'></label><label>Water temp at time 2 (°C)<input id='tf-T2' type='number' step='0.1' value='31.8'></label></div>" +
      "<h4>2 · Competition conditions (announced at the start of your block)</h4>" +
      "<div class='hx-fields'><label>Lamp height h (cm)<input id='tf-h' type='number' value='45'></label><label>Heating time (min)<input id='tf-t' type='number' step='0.5' value='10'></label><label>Start water temp (°C)<input id='tf-Ts' type='number' step='0.1' value='21.5'></label><label>Room temp (°C)<input id='tf-r' type='number' step='0.1' value='21.0'></label>" +
      "<label>Height exponent n<input id='tf-n' type='number' step='0.1' value='2'></label><label>Cooling while removing the cup (°C)<input id='tf-c' type='number' step='0.05' value='0.2'></label></div>" +
      "<div id='tf-o'></div></div>";
    var o = root.querySelector("#tf-o");
    function run() {
      var h0 = num(root, "tf-h0"), T0 = num(root, "tf-T0"), r0 = num(root, "tf-r0"), t1 = num(root, "tf-t1"), T1 = num(root, "tf-T1"), t2 = num(root, "tf-t2"), T2 = num(root, "tf-T2");
      var h = num(root, "tf-h"), t = num(root, "tf-t"), Ts = num(root, "tf-Ts"), rm = num(root, "tf-r"), n = num(root, "tf-n"), c = num(root, "tf-c") || 0;
      var fit = fitCurve(T0, t1, T1, t2, T2);
      if (!fit || [h0, h, t, Ts, rm, n].some(isNaN) || h <= 0 || h0 <= 0) { o.innerHTML = "<div class='hx-warn'>Enter a calibration run where the water warms (T2 &gt; T1 &gt; start) and time 2 &gt; time 1.</div>"; return; }
      var Tf = predict(fit, h0, T0, r0, n, h, t, Ts, rm, c);
      var html = "<div class='hx-ans'><b>Predicted final temperature: " + fx(Tf, 1) + " °C</b> (gain " + fx(Tf - Ts, 1) + " °C)<br>" +
        (fit.linear ? "Your two readings are almost linear, so the model uses a constant heating rate of " + fx(fit.rate, 2) + " °C/min at h₀ (no loss correction)." :
          "Fitted from your run: time constant τ = <b>" + fx(fit.tau, 1) + " min</b>; maximum rise from the start temperature ≈ <b>" + fx(fit.a, 1) + " °C</b> at " + h0 + " cm.") + "</div>";
      // PE table
      html += "<h4>How much does an error cost? (PE = 1 − |final − predicted| ÷ final)</h4><div class='hx-scroll'><table class='hx-tbl'><tr><th>If the real final temp is…</th>" + [-2, -1, -0.5, 0, 0.5, 1, 2].map(function (d) { return "<th>" + fx(Tf + d, 1) + "</th>"; }).join("") + "</tr><tr><th>PE</th>" +
        [-2, -1, -0.5, 0, 0.5, 1, 2].map(function (d) { var F = Tf + d; return "<td>" + fx(Math.max(0, 1 - Math.abs(F - Tf) / F), 3) + "</td>"; }).join("") + "</tr></table></div>";
      // curve
      var pts = [], i; for (i = 0; i <= Math.max(15, t); i++) pts.push([i, predict(fit, h0, T0, r0, n, h, i, Ts, rm, 0)]);
      var W = 420, Hh = 170, pl = 40, pb = 28, ymin = Math.floor(Ts - 1), ymax = Math.ceil(Math.max.apply(null, pts.map(function (p) { return p[1]; })) + 1), xmax = pts[pts.length - 1][0];
      function X(v) { return pl + (W - pl - 10) * v / xmax; } function Y(v) { return 10 + (Hh - 10 - pb) * (1 - (v - ymin) / (ymax - ymin)); }
      html += "<h4>Predicted heating curve</h4><svg viewBox='0 0 " + W + " " + Hh + "' style='max-width:100%;color:var(--fgColor-default)' role='img' aria-label='Predicted temperature versus time'>" +
        "<line x1='" + pl + "' y1='" + (Hh - pb) + "' x2='" + (W - 8) + "' y2='" + (Hh - pb) + "' stroke='currentColor'/><line x1='" + pl + "' y1='10' x2='" + pl + "' y2='" + (Hh - pb) + "' stroke='currentColor'/>" +
        "<polyline fill='none' stroke='#0969da' stroke-width='2' points='" + pts.map(function (p) { return X(p[0]).toFixed(1) + "," + Y(p[1]).toFixed(1); }).join(" ") + "'/>" +
        "<line x1='" + X(t) + "' y1='10' x2='" + X(t) + "' y2='" + (Hh - pb) + "' stroke='#cf222e' stroke-dasharray='4 3'/>" +
        "<text x='" + (pl - 4) + "' y='" + (Y(ymax) + 4) + "' text-anchor='end' font-size='10' fill='currentColor'>" + ymax + "</text><text x='" + (pl - 4) + "' y='" + (Y(ymin) + 4) + "' text-anchor='end' font-size='10' fill='currentColor'>" + ymin + "</text>" +
        "<text x='" + ((W + pl) / 2) + "' y='" + (Hh - 6) + "' text-anchor='middle' font-size='11' fill='currentColor'>Time under the lamp (min)</text><text x='12' y='" + (Hh / 2 - 10) + "' font-size='11' fill='currentColor' transform='rotate(-90 12 " + (Hh / 2 - 10) + ")'>Water °C</text>" +
        "<text x='" + (X(t) + 4) + "' y='24' font-size='10' fill='#cf222e'>heating time</text></svg>";
      // cheat grid
      var hs = [40, 45, 50, 55, 60, 65], ts = [10, 11, 12, 13, 14, 15];
      html += "<h4>Prepared table: predicted final temperature (°C) for your start " + fx(Ts, 1) + " °C, room " + fx(rm, 1) + " °C</h4><div class='hx-scroll'><table class='hx-tbl'><tr><th>Height ↓ / minutes →</th>" + ts.map(function (x) { return "<th>" + x + "</th>"; }).join("") + "</tr>" +
        hs.map(function (hh) { return "<tr><th>" + hh + " cm</th>" + ts.map(function (tt) { return "<td>" + fx(predict(fit, h0, T0, r0, n, hh, tt, Ts, rm, c), 1) + "</td>"; }).join("") + "</tr>"; }).join("") + "</table></div>" +
        "<p class='sh-muted'>Rules allow prepared graphs and tables for your calculations, but the start and room temperatures are only announced on the day, so build tables for a few likely values, or bring this calculator’s method written out. Regionals: 40–50 cm and 10 min; States 40–55 cm, 10–15 min; Nationals 40–65 cm, 10–15 min.</p>";
      o.innerHTML = html;
    }
    root.addEventListener("input", run); run();
  };

  /* ---------------- Part II / final score estimator ---------------- */
  window.HWidgets.thscore = function (root) {
    root.innerHTML =
      "<div class='hx-calc'><p class='sh-muted'>Use rule 6 to see where your points come from. Enter the highest Part I score and the best TG and PE of all teams (use rough guesses before the results are posted).</p>" +
      "<div class='hx-fields'><label>Your Part I (test) score<input id='ts-p' type='number' value='60'></label><label>Highest Part I score<input id='ts-P' type='number' value='80'></label>" +
      "<label>Your start temp (°C)<input id='ts-s' type='number' step='0.1' value='21.5'></label><label>Your final temp (°C)<input id='ts-f' type='number' step='0.1' value='33.0'></label>" +
      "<label>Your prediction (°C)<input id='ts-q' type='number' step='0.1' value='32.0'></label><label>Highest TG (°C)<input id='ts-G' type='number' step='0.1' value='14.0'></label>" +
      "<label>Highest PE of all teams<input id='ts-E' type='number' step='0.001' value='0.995'></label><label>Competition violations<input id='ts-c' type='number' min='0' value='0'></label><label>Construction violations<input id='ts-k' type='number' min='0' value='0'></label></div>" +
      "<div class='hx-fields'><label style='flex-direction:row;align-items:center;gap:8px'><input type='checkbox' id='ts-z' style='width:auto'> Touched the device or lamp during heating, or used banned materials (TS = PS = 0)</label><label style='flex-direction:row;align-items:center;gap:8px'><input type='checkbox' id='ts-np' style='width:auto'> No prediction given before heating ended (PS = 0)</label></div><div id='ts-o'></div></div>";
    var o = root.querySelector("#ts-o");
    function run() {
      var p = num(root, "ts-p"), P = num(root, "ts-P"), s = num(root, "ts-s"), f = num(root, "ts-f"), q = num(root, "ts-q"), G = num(root, "ts-G"), E = num(root, "ts-E"), c = num(root, "ts-c") || 0, k = num(root, "ts-k") || 0;
      var zero = root.querySelector("#ts-z").checked, np = root.querySelector("#ts-np").checked;
      var ES = P > 0 ? p / P * 50 : 0, TG = Math.max(0, f - s), PE = Math.max(0, 1 - Math.abs(f - q) / f);
      var mult = Math.pow(0.9, c) * Math.pow(0.7, k);
      var TS = zero || !(G > 0) ? 0 : TG / G * 30 * mult, PS = zero || np || !(E > 0) ? 0 : PE / E * 20 * mult;
      o.innerHTML = tbl(["Part", "Calculation", "Points"], [
        ["Exam score ES", "Part I ÷ highest Part I × 50 = " + fx(p, 1) + " ÷ " + fx(P, 1) + " × 50", "<b>" + fx(ES, 1) + "</b> / 50"],
        ["Temperature gain TG", "final − start = " + fx(f, 1) + " − " + fx(s, 1) + " (never below 0)", fx(TG, 1) + " °C"],
        ["Temperature score TS", "TG ÷ highest TG × 30" + (mult < 1 ? " × " + fx(mult, 3) + " (violations)" : "") + (zero ? " → zero" : ""), "<b>" + fx(TS, 1) + "</b> / 30"],
        ["Prediction estimate PE", "1 − |final − predicted| ÷ final = 1 − " + fx(Math.abs(f - q), 1) + " ÷ " + fx(f, 1), fx(PE, 3)],
        ["Prediction score PS", "PE ÷ highest PE × 20" + (mult < 1 ? " × " + fx(mult, 3) : "") + (zero || np ? " → zero" : ""), "<b>" + fx(PS, 1) + "</b> / 20"],
        ["<b>Final score FS</b>", "ES + TS + PS", "<b>" + fx(ES + TS + PS, 1) + "</b> / 100"]]) +
        "<p class='sh-muted'>Notice how little a 1 °C prediction miss costs compared with the gain race: TS is relative to the best device, so every extra degree of TG is worth a lot.</p>";
    }
    root.addEventListener("input", run); root.addEventListener("change", run); run();
  };

  /* ---------------- concepts ---------------- */
  var C = [];
  function add(id, title, def, body, extra) {
    var o = { id: id, level: LV, title: title, definition: def, body: body, points: [], formula: "", source: SRC, img: [], svg: null };
    for (var k in (extra || {})) o[k] = extra[k];
    C.push(o);
  }

  add("dev_rules", "Part II at a glance: the device, the clock and the score",
    "Half of Thermodynamics B is hands-on: build a device before the tournament that collects heat from a heat lamp and warms 100 mL of room-temperature water, then predict the final temperature. Part II is worth 50 of the 100 points.",
    tbl(["Score", "Points", "How it is calculated"], [
      ["Exam score ES", "50", "Your Part I score ÷ highest Part I score × 50"],
      ["Temperature score TS", "30", "TG ÷ highest TG of all teams × 30, where TG = final − starting water temperature (minimum 0)"],
      ["Prediction score PS", "20", "PE ÷ highest PE × 20, where PE = 1 − |final − predicted| ÷ final (minimum 0)"],
      ["<b>Final score</b>", "<b>100</b>", "FS = ES + TS + PS. Tie-breakers: best TS, then best ES, then preselected test questions"]]) +
    h4("How the 50-minute event runs") +
    tbl(["Step", "What happens", "Time"], [
      ["1", "Supervisor announces the <b>bulb height</b>, <b>heating time</b>, room temperature, source-water temperature and bulb specs (same for all teams)", ""],
      ["2", "<b>Device setup time:</b> set up or modify the device, and begin working on your prediction. You can fix construction violations now. No changes after this except inserting and removing the cup", "3 min"],
      ["3", "Supervisor pours <b>100 mL</b> into your cup and measures the <b>starting temperature</b> (0.1 °C), and tells you the value", ""],
      ["4", "<b>Water setup time:</b> put the cup into your device. You may not alter the cup or the water", "up to 1 min"],
      ["5", "Lamp on. <b>Heating time</b>: do not touch the device or lamp. Finalise your prediction in °C before it ends. You may work on the written test if the supervisor allows", "10 min Regionals; 10–15 min States/Nationals"],
      ["6", "Lamp off. Remove the cup completely from the device and set it on the table. The supervisor measures the <b>final temperature</b>, ideally within a minute to limit cooling", "~1 min"]]) +
    h4("The lamp setup (same for every team)") +
    ul(["Clamp lamp with a metal reflector, facing down, with a <b>100–125 W</b> heat-lamp bulb: untinted, not LED, halogen or ceramic.", "Height of the bottom of the bulb above the testing surface: <b>Regionals</b> 40–50 cm (5 cm steps), <b>States</b> 40–55 cm (5 cm steps), <b>Nationals</b> 40–65 cm (1 cm steps). The same for all teams in a block.", "Your device sits centred under the lamp.", "The supervisor provides the cup (clear 9-oz party cup), the water (100 mL from a source bath near room temperature) and the thermometer (0.1 °C precision). You may not use their thermometer."]) +
    h4("Penalties you must avoid") +
    tbl(["What happens", "Effect"], [
      ["Touch the device or lamp setup during heating", "TS = 0 and PS = 0"],
      ["Use banned energy sources/materials (rule 3.f)", "TS = 0 and PS = 0"],
      ["Hazardous materials (asbestos, mineral wool, fiberglass)", "Device cannot be set up or tested; written test only"],
      ["No prediction made before heating time ends", "PS = 0"],
      ["Each competition-rule violation", "TS and PS multiplied by 0.9"],
      ["Each construction violation left at the end of setup time", "TS and PS multiplied by 0.7"],
      ["No device, or device unsafe", "TS = PS = 0 (you may still take the test)"]]) +
    "<p class='sh-muted'>This summarises the 2027 Division B rules text. The official rules manual and your event supervisor always take precedence.</p>");

  add("dev_build", "Build rules: what the device may and may not be",
    "A device that breaks a construction rule loses 30% of its Part II score per violation, so check every rule before impound.",
    tbl(["Rule", "What it means for your build"], [
      ["<b>Purpose</b> (3.a)", "Collect heat from the supervisor’s lamp to warm room-temperature water"],
      ["<b>Allowed materials</b> (3.b)", "Anything except hazardous materials (asbestos, mineral wool, fiberglass), thermometers, probes, commercial thermoses, coolers and vacuum-sealed devices"],
      ["<b>Cup fit</b> (3.c)", "You must be able to insert and remove the 9-oz plastic cup of water (clear, about 3.9–4.0 in tall, mouth about 2.9–3.0 in)"],
      ["<b>Size</b> (3.d)", "Device <b>including the cup</b> must fit in a 30.0 × 30.0 × 30.0 cm cube when set up for testing"],
      ["<b>Water contact</b> (3.e)", "Parts can be inside the cup, but no part of the device may contact the water. Nothing may be added to the water"],
      ["<b>No energy sources</b> (3.f)", "No electricity, batteries, chemical reactions or anything that supplies heat other than the lamp"],
      ["<b>Starting temperature</b> (3.g, 2.d)", "No part of the device may be significantly different from room temperature at the start; everything impounded must be at room temperature"],
      ["<b>Be able to explain</b> (3.h)", "Both teammates must answer questions about the design, construction and operation (Building Policy)"]]) +
    h4("Which materials can I use? (rule 3.b and 3.f)") +
    "<p>Anything goes <b>except</b> the items below. If it is not on the banned list, it is allowed, as long as it does not break the other build rules (size, no water contact, room temperature, no energy source).</p>" +
    "<div class='hx-two'><div class='hx-good'><b>✓ Allowed (examples)</b><ul><li>Aluminium foil, thin aluminium or copper sheet, steel</li><li>Cardboard, paper, wood, cork</li><li>Polystyrene (Styrofoam-type) foam, foam board, cotton, felt</li><li>Glass, clear plastic film or sheet, plastic containers</li><li>Paint (matte black is common), tape, glue, string, wire</li><li>Spare parts and setup tools (not impounded as part of the build)</li></ul></div>" +
    "<div class='hx-bad'><b>✗ Not allowed</b><ul><li><b>Hazardous materials:</b> asbestos, <b>mineral wool</b>, <b>fiberglass</b> (and anything similar). Device is not tested; written test only</li><li><b>Thermometers</b> and <b>probes</b></li><li><b>Commercial thermoses, coolers</b> and <b>vacuum-sealed</b> devices</li><li><b>Energy sources:</b> electrical parts, batteries, battery heaters, <b>chemical reactions</b> (heat packs, hand warmers). Using one gives TS = 0 and PS = 0</li><li>Anything added to the water, or any part touching the water</li></ul></div></div>" +
    "<div class='hx-warn'><b>Unsure?</b> Ask the event supervisor before the tournament about anything unusual (insulating fabrics, odd foams, anything that resembles a cooler or thermos). Items that could be mistaken for fiberglass or mineral wool are the riskiest; the supervisor may have you disassemble the device to check.</div>" +
    h4("What you may bring (rule 2)") +
    ul(["Writing utensils and <b>two Class III calculators</b>.", "Notes and resources on paper, any size and any source (binders and sheet protectors allowed; you may separate pages).", "<b>One pre-constructed device, spare parts, tools</b> (items that aid set-up but are not part of the build) <b>and prepared graphs or tables</b> for calculating the results. Only the device and spare parts are impounded.", "Do not bring the testing materials (lamp, cup, water, thermometer): the supervisor supplies them."]) +
    h4("Pre-impound checklist") +
    ol(["Cup slides in and out freely, with the 30 cm cube test passed using the real cup (measure with a ruler or a cardboard cube).", "Nothing in the build is on the banned list: open it up and check every insulation material (use foam, cardboard, cotton, foil, wood, plastic, not fibreglass or mineral wool).", "No part touches the water; nothing goes into the water.", "Nothing generates heat on its own; no battery or hand-warmer-type materials.", "Everything has been stored at room temperature, not by a window or in a car.", "Spare parts and tools are packed; the prepared tables and notes are in your binder.", "Both teammates can say what each part does and why."]) +
    "<p class='sh-muted'>Safety: the lamp and its reflector become hot, and a lamp 40 cm above plastic or paper can scorch it. Choose materials that tolerate the heat and keep flammable material away from the bulb.</p>");

  add("dev_design", "Designing the device: the physics of collecting heat",
    "The challenge is energy accounting: how much of the lamp’s radiant energy can you capture, move into 100 g of water, and keep from leaking away? Every design choice is one of absorb, concentrate, conduct or insulate.",
    h4("How much energy do you need?") +
    "<div class='sh-code'>Q = m·c·ΔT\n100 mL of water ≈ 100 g, c = 4.186 J/(g·°C)  →  418.6 J per °C\nTo gain 10 °C: Q ≈ 4 186 J ≈ 4.2 kJ\nIn 10 min (600 s) that is an average of only 7 W absorbed by the water</div>" +
    "<p>A 100–125 W bulb gives off far more than that, but most of its power goes in all directions, much of it is infrared, and your device only intercepts a fraction. So <b>collecting area</b> and <b>losses</b> decide the result.</p>" +
    h4("1 · Absorb: turn light into thermal energy") +
    ul(["Dark, <b>matte black</b> surfaces absorb most of the radiation; shiny surfaces reflect it away. Use black paint, matte black paper, or soot-free dark material for whatever the light first hits.", "But a black surface also <b>emits</b> infrared well when it becomes hot, so insulate it so it can keep its heat (see step 4)."]) +
    h4("2 · Concentrate: gather more light") +
    ul(["Energy captured ∝ intensity × collecting area. A <b>funnel or cone of aluminium foil</b> (shiny side in) directs light onto the black part touching the cup.", "Everything must still fit in the 30 cm cube including the cup, so make the aperture as wide as the cube allows.", "Intensity from the lamp falls with distance: roughly as <b>1 ÷ height²</b> (a point-source approximation). Since the supervisor sets the height, your device has to work over the whole announced range (e.g., 40–65 cm at Nationals), and your forecast has to scale with height."]) +
    h4("3 · Conduct: move heat into the water") +
    ul(["Plastic cups and water are poor conductors, so a thin cup wall in good contact with a <b>metal sleeve</b> (aluminium or copper, painted black outside) moves heat into the water faster.", "More contact area with the cup (side wall plus bottom) is better, but you cannot touch the water itself.", "Keep the metal’s mass low: heating the device’s own parts takes energy that would otherwise warm the water (the metal’s heat capacity m·c is a cost)."]) +
    tbl(["Material", "Specific heat c (J/g·°C)", "Thermal conductivity k (W/m·K)", "Role"], [
      ["Water", "4.19", "0.6", "What you are heating (100 g)"],
      ["Aluminium", "0.90", "≈ 235", "Conducts heat well; low mass"],
      ["Copper", "0.39", "≈ 400", "Conducts very well; denser"],
      ["Glass", "0.84", "≈ 1", "Clear cover; traps infrared"],
      ["Plastic cup / film", "≈ 1–2", "≈ 0.1–0.3", "Poor conductor"],
      ["Still air", "1.0", "≈ 0.026", "Excellent insulator while it cannot circulate"],
      ["Polystyrene foam", "≈ 1.3", "≈ 0.03–0.04", "Insulator"]]) +
    "<p class='sh-muted'>Approximate textbook values for planning; check against your notes.</p>" +
    h4("4 · Insulate: stop the heat escaping") +
    ul(["<b>Conduction losses</b>: surround the heated part with foam, cardboard or trapped air; avoid metal paths to the table.", "<b>Convection losses</b>: warm air rising away carries heat; a lid or enclosure that traps still air helps.", "<b>Radiation losses</b>: a hot surface radiates away; reflective foil facing inward and a <b>clear cover</b> (glass or plastic film) that lets the bulb’s light in but blocks heat and air movement (the greenhouse effect) reduces this.", "<b>Evaporation</b>: water vapour carries away a lot of energy; a cover over the cup helps (it must not touch the water)."]) +
    h4("Design ideas to test (none is guaranteed best)") +
    tbl(["Idea", "Why it might help", "Risk"], [
      ["Foil cone above a black-painted aluminium sleeve around the cup", "Collects more light; conducts it into the cup", "Foil near the bulb gets hot; cone must stay inside the cube"],
      ["Insulated box around the sleeve with a clear lid", "Holds heat; greenhouse effect", "Condensation fogging the lid; extra thermal mass"],
      ["Black cardboard or foam sleeve (very low mass)", "Heats quickly with little energy wasted", "Poor conductor into the cup"],
      ["Thin double wall with an air gap", "Still air insulates", "Convection if the gap is large"]]) +
    h4("What loses points") +
    ul(["Shiny absorber (foil as the main absorber): reflects the heat away.", "Big heavy metal parts: they soak up energy that should go to the water.", "A device so complicated that results vary from run to run: it cannot be forecast.", "No testing: you must practise with a similar lamp and your own thermometer at several heights.", "Cup that no longer fits, or a device slightly over 30 cm (construction violation)."]) +
    h4("Test like a scientist") +
    ol(["Build, then run a <b>practice test</b> at your best guess of the competition height (and a few other heights) with 100 mL of water and your own thermometer.", "Record temperature every minute for 10–15 minutes, plus the start and room temperatures.", "Change <b>one thing</b> at a time (add the clear lid, change the sleeve) and repeat. This is Experimental Design thinking too: control the rest.", "Repeat each design at least twice to check how repeatable it is. A repeatable device is a predictable device, and the prediction is 20 points.", "Keep the heating curves: they become your forecast tables."]) +
    "<div class='hx-warn'>Always use real tests. The numbers above are textbook values for planning, not a recipe that is guaranteed to win. The next page shows an example design with a diagram and graphs.</div>");

  /* ---------- example design: diagram + graphs ---------- */
  var BUILDS = [
    { k: "A", name: "Bare cup under the lamp", tmax: 1.5, tau: 12, col: "#8c959f" },
    { k: "B", name: "+ black sleeve & foam base", tmax: 5, tau: 18, col: "#bf8700" },
    { k: "C", name: "+ foil cone", tmax: 17, tau: 14, col: "#0969da" },
    { k: "D", name: "+ clear lid & foam jacket (recommended)", tmax: 28, tau: 22, col: "#1a7f37" }
  ];
  function rise(b, t) { return b.tmax * (1 - Math.exp(-t / b.tau)); }

  function svgDevice() {
    var rays = [130, 180, 230, 280, 330].map(function (x) { return "<line x1='" + x + "' y1='46' x2='" + x + "' y2='76' stroke='#d4a72c' stroke-width='2'/><path d='M" + (x - 4) + " 70 L" + x + " 78 L" + (x + 4) + " 70' fill='none' stroke='#d4a72c' stroke-width='2'/>"; }).join("");
    function mk(n, x, y) { return "<circle cx='" + x + "' cy='" + y + "' r='9' fill='#0969da'/><text x='" + x + "' y='" + (y + 4) + "' text-anchor='middle' font-size='11' font-weight='700' fill='#fff'>" + n + "</text>"; }
    return "<figure class='hx-fig'><svg viewBox='0 0 470 335' role='img' aria-label='Cross-section of the example device' xmlns='http://www.w3.org/2000/svg' style='color:var(--fgColor-default)'>" +
      "<path d='M150 14 Q230 -6 310 14 L292 34 L168 34 Z' fill='#8c959f' fill-opacity='.5' stroke='currentColor'/><circle cx='230' cy='34' r='9' fill='#fbca04' stroke='currentColor'/>" +
      "<text x='318' y='20' font-size='10' fill='currentColor'>heat lamp, 40–65 cm above</text><text x='318' y='32' font-size='10' fill='currentColor'>the table (not to scale)</text>" + rays +
      "<line x1='20' y1='300' x2='450' y2='300' stroke='currentColor' stroke-width='2'/><text x='24' y='314' font-size='10' fill='currentColor'>testing surface</text>" +
      // foam base
      "<rect x='140' y='270' width='180' height='30' fill='#f6e8c8' stroke='currentColor'/>" +
      // foam jacket left/right
      "<rect x='172' y='190' width='18' height='80' fill='#f6e8c8' stroke='currentColor'/><rect x='270' y='190' width='18' height='80' fill='#f6e8c8' stroke='currentColor'/>" +
      // cup and water
      "<path d='M192 170 L202 270 L258 270 L268 170 Z' fill='#ffffff' fill-opacity='.12' stroke='currentColor' stroke-width='1.5'/><path d='M197 237 L202 270 L258 270 L263 237 Z' fill='#54aeff' fill-opacity='.65'/>" +
      // sleeve
      "<line x1='194' y1='195' x2='202' y2='270' stroke='#111' stroke-width='5'/><line x1='266' y1='195' x2='258' y2='270' stroke='#111' stroke-width='5'/>" +
      // cone
      "<line x1='172' y1='190' x2='100' y2='80' stroke='#6e7781' stroke-width='4'/><line x1='288' y1='190' x2='360' y2='80' stroke='#6e7781' stroke-width='4'/>" +
      "<line x1='100' y1='80' x2='360' y2='80' stroke='#1b9aaa' stroke-width='2.5' stroke-dasharray='6 4'/>" +
      // reflected rays
      "<line x1='120.5' y1='110' x2='196' y2='215' stroke='#d4a72c' stroke-width='1.5' stroke-dasharray='3 3'/><line x1='339.5' y1='110' x2='264' y2='215' stroke='#d4a72c' stroke-width='1.5' stroke-dasharray='3 3'/>" +
      // dimensions
      "<line x1='400' y1='80' x2='400' y2='300' stroke='currentColor'/><line x1='394' y1='80' x2='406' y2='80' stroke='currentColor'/><line x1='394' y1='300' x2='406' y2='300' stroke='currentColor'/><text x='410' y='194' font-size='11' fill='currentColor'>22 cm</text>" +
      "<line x1='100' y1='326' x2='360' y2='326' stroke='currentColor'/><line x1='100' y1='320' x2='100' y2='332' stroke='currentColor'/><line x1='360' y1='320' x2='360' y2='332' stroke='currentColor'/><text x='230' y='323' text-anchor='middle' font-size='11' fill='currentColor' style='paint-order:stroke;stroke:var(--bgColor-default);stroke-width:4px'>26 cm opening</text>" +
      mk(1, 80, 100) + "<line x1='89' y1='100' x2='112' y2='100' stroke='#0969da'/>" +
      mk(2, 380, 66) + "<line x1='371' y1='68' x2='358' y2='78' stroke='#0969da'/>" +
      mk(3, 318, 215) + "<line x1='309' y1='215' x2='268' y2='215' stroke='#0969da'/>" +
      mk(4, 150, 235) + "<line x1='159' y1='235' x2='172' y2='235' stroke='#0969da'/>" +
      mk(5, 230, 252) + mk(6, 345, 285) + "<line x1='336' y1='285' x2='320' y2='285' stroke='#0969da'/></svg>" +
      "<figcaption>Figure 1. Cross-section of the example device (side view, about 1 cm = 10 px). The whole assembly is 26 × 26 × 22 cm, inside the 30 cm cube including the cup.</figcaption></figure>";
  }

  function svgCurves() {
    var W = 460, H = 270, L = 48, B = 40, T = 14, R = 14, X = function (t) { return L + (W - L - R) * t / 15; }, Y = function (v) { return T + (H - T - B) * (1 - v / 15); };
    var grid = "", i;
    for (i = 0; i <= 15; i += 5) grid += "<line x1='" + L + "' y1='" + Y(i) + "' x2='" + (W - R) + "' y2='" + Y(i) + "' stroke='currentColor' stroke-opacity='.15'/><text x='" + (L - 6) + "' y='" + (Y(i) + 4) + "' text-anchor='end' font-size='11' fill='currentColor'>" + i + "</text>";
    for (i = 0; i <= 15; i += 5) grid += "<text x='" + X(i) + "' y='" + (H - B + 16) + "' text-anchor='middle' font-size='11' fill='currentColor'>" + i + "</text>";
    var lines = BUILDS.map(function (b) {
      var pts = [], t; for (t = 0; t <= 15; t += 0.5) pts.push(X(t).toFixed(1) + "," + Y(rise(b, t)).toFixed(1));
      return "<polyline fill='none' stroke='" + b.col + "' stroke-width='2.5' points='" + pts.join(" ") + "'/>" +
        "<circle cx='" + X(10) + "' cy='" + Y(rise(b, 10)) + "' r='4' fill='" + b.col + "'/>";
    }).join("");
    var legend = BUILDS.map(function (b, k) { return "<rect x='" + (L + 10) + "' y='" + (T + 6 + k * 16) + "' width='14' height='4' fill='" + b.col + "'/><text x='" + (L + 30) + "' y='" + (T + 12 + k * 16) + "' font-size='11' fill='currentColor'>" + b.k + " · " + b.name + "</text>"; }).join("");
    return "<figure class='hx-fig'><svg viewBox='0 0 " + W + " " + (H + 84) + "' role='img' aria-label='Modelled temperature gain versus time for four builds' xmlns='http://www.w3.org/2000/svg' style='color:var(--fgColor-default)'>" +
      "<text x='" + (W / 2) + "' y='12' text-anchor='middle' font-size='12' font-weight='600' fill='currentColor'></text>" + grid +
      "<line x1='" + L + "' y1='" + (H - B) + "' x2='" + (W - R) + "' y2='" + (H - B) + "' stroke='currentColor'/><line x1='" + L + "' y1='" + T + "' x2='" + L + "' y2='" + (H - B) + "' stroke='currentColor'/>" +
      "<line x1='" + X(10) + "' y1='" + T + "' x2='" + X(10) + "' y2='" + (H - B) + "' stroke='#cf222e' stroke-dasharray='4 3'/><text x='" + (X(10) + 4) + "' y='" + (T + 10) + "' font-size='10' fill='#cf222e'>10 min (Regionals)</text>" +
      lines + "<g transform='translate(0 " + (H + 4) + ")'>" + legend + "</g>" +
      "<text x='" + ((L + W - R) / 2) + "' y='" + (H - 6) + "' text-anchor='middle' font-size='12' fill='currentColor'>Time under the lamp (minutes)</text><text transform='translate(13 " + ((T + H - B) / 2 + 40) + ") rotate(-90)' font-size='12' fill='currentColor'>Water temperature gain (°C)</text></svg>" +
      "<figcaption>Figure 2. Modelled heating curves for four builds, using ΔT = ΔT<sub>max</sub>(1 − e<sup>−t/τ</sup>). <b>The numbers are invented for illustration</b>; measure your own device.</figcaption></figure>";
  }

  function svgBars() {
    var W = 460, H = 240, L = 48, B = 56, T = 16, R = 14, bw = 62, gap = (W - L - R - 4 * bw) / 5, Y = function (v) { return T + (H - T - B) * (1 - v / 12); };
    var bars = BUILDS.map(function (b, i) {
      var v = rise(b, 10), x = L + gap + i * (bw + gap), lab = b.k;
      return "<rect x='" + x + "' y='" + Y(v) + "' width='" + bw + "' height='" + (H - B - Y(v)) + "' fill='" + b.col + "'/><text x='" + (x + bw / 2) + "' y='" + (Y(v) - 5) + "' text-anchor='middle' font-size='12' font-weight='600' fill='currentColor'>" + v.toFixed(1) + "</text>" +
        "<text x='" + (x + bw / 2) + "' y='" + (H - B + 15) + "' text-anchor='middle' font-size='12' fill='currentColor'>" + lab + "</text>";
    }).join("");
    var grid = ""; for (var i = 0; i <= 12; i += 4) grid += "<line x1='" + L + "' y1='" + Y(i) + "' x2='" + (W - R) + "' y2='" + Y(i) + "' stroke='currentColor' stroke-opacity='.15'/><text x='" + (L - 6) + "' y='" + (Y(i) + 4) + "' text-anchor='end' font-size='11' fill='currentColor'>" + i + "</text>";
    return "<figure class='hx-fig'><svg viewBox='0 0 " + W + " " + H + "' role='img' aria-label='Modelled gain after 10 minutes by build stage' xmlns='http://www.w3.org/2000/svg' style='color:var(--fgColor-default)'>" + grid +
      "<line x1='" + L + "' y1='" + (H - B) + "' x2='" + (W - R) + "' y2='" + (H - B) + "' stroke='currentColor'/><line x1='" + L + "' y1='" + T + "' x2='" + L + "' y2='" + (H - B) + "' stroke='currentColor'/>" + bars +
      "<text x='" + ((L + W - R) / 2) + "' y='" + (H - 24) + "' text-anchor='middle' font-size='11' fill='currentColor'>Build stage (A bare cup, B + sleeve, C + cone, D + lid/jacket)</text>" +
      "<text transform='translate(13 " + ((T + H - B) / 2 + 40) + ") rotate(-90)' font-size='12' fill='currentColor'>Gain at 10 min (°C)</text></svg>" +
      "<figcaption>Figure 3. What each feature adds at 10 minutes (modelled, illustrative numbers). The foil cone gives the biggest jump because it collects far more light.</figcaption></figure>";
  }

  add("dev_example", "Example of a good device, with diagram and graphs",
    "One concrete design that combines the principles on the previous page: a foil funnel collects light, a black aluminium sleeve absorbs it, the cup is insulated, and a clear lid keeps the heat in. Use it as a starting point, then test and improve your own version.",
    "<div class='hx-warn'><b>Read this first.</b> This is an example design built from the physics, not a design proven to win. The graphs come from a simple model with invented numbers so you can see <i>why</i> each feature helps. Your real curves will differ: build it, measure it, and use your own data.</div>" +
    h4("Figure 1 · The design") + svgDevice() +
    tbl(["#", "Part", "How to make it", "Why it is there"], [
      ["1", "<b>Foil funnel</b> (cone)", "Cardboard cone covered with shiny foil on the inside; 26 cm opening at the top narrowing to about 11 cm around the cup; about 11 cm tall", "Collects light over a large area and reflects it down onto the cup and sleeve (the opening is about 12 times the cup’s mouth area, 530 cm² vs 44 cm²)"],
      ["2", "<b>Clear film lid</b>", "Clear plastic wrap or a thin clear sheet stretched across the top of the funnel, not touching the water", "Lets the lamp’s light in, blocks warm air from escaping (less convection) and slows evaporation; traps infrared emitted by the hot parts"],
      ["3", "<b>Black sleeve</b>", "Thin aluminium (cut from a drink can) wrapped around the upper cup, painted matte black on the outside and touching the cup wall", "Absorbs the light (black) and conducts heat into the cup and water (aluminium); low mass, so little energy is spent heating the sleeve"],
      ["4", "<b>Foam jacket</b>", "A ring of polystyrene foam or cardboard with an air gap around the sleeve", "Slows heat loss from the sleeve by conduction and convection"],
      ["5", "<b>Cup + 100 mL water</b>", "Supplied by the supervisor; must slide in and out", "What you are heating; the sleeve touches only the cup, never the water"],
      ["6", "<b>Foam base</b>", "3 cm polystyrene foam or thick cardboard under the cup", "Stops heat leaking into the table (conduction)"]]) +
    h4("Check it against the rules") +
    tbl(["Rule", "This design"], [
      ["Fits in a 30 × 30 × 30 cm cube including the cup", "26 × 26 × 22 cm ✓ (measure the real build)"],
      ["Cup can be inserted and removed", "Cup lifts straight up out of the sleeve ring ✓ (test it before impound)"],
      ["No part touches the water; nothing added", "Sleeve and film are outside the water ✓"],
      ["No banned materials, no energy source", "Foil, cardboard, foam, thin aluminium, paint, plastic film ✓ (no fibreglass, mineral wool, thermos, thermometer, electric part)"],
      ["Room temperature at start", "Store everything in the room, not in a car or by a window ✓"],
      ["Clearance from the lamp", "Top of device 22 cm; the bulb is at least 40 cm above the table, so the film is at least 18 cm below it. Check heat on the film and foam"]]) +
    h4("How to build it (about 30–40 minutes)") +
    ol(["Cut a foam disc about 18 cm across and 3 cm thick; mark where the cup stands.", "Wrap a strip of thin aluminium around the upper two thirds of a practice cup and paint the outside matte black. Let it dry well.", "Make a foam or cardboard ring around the sleeve with a small air gap (about 1 cm).", "Cut a cone from card: 26 cm across the top, about 11 cm across the bottom, about 11 cm tall. Glue foil, shiny side in, with no wrinkles.", "Fix the cone to the ring so the whole assembly stands steadily on the base.", "Stretch clear film across the top, tight and unwrinkled, and tape it.", "Slide the real cup in and out ten times: it must move freely without touching the film or tipping.", "Measure the overall size; keep a ruler or a 30 cm cardboard cube in the kit.", "Run practice tests with 100 mL of room-temperature water at several lamp heights and record temperature every minute."]) +
    h4("Figure 2 · Why each feature helps (modelled heating curves)") + svgCurves() +
    "<p>Each build adds one feature. A bare cup barely warms, because it only intercepts the light that falls on its small mouth and it loses heat by evaporation. A black sleeve helps a little. The funnel is the big jump: it brings in more energy. Insulation and the lid do not add energy, but they let the water keep what it gains, which matters more the longer the heating time (States and Nationals use up to 15 minutes).</p>" +
    h4("Figure 3 · What each stage adds at 10 minutes") + svgBars() +
    h4("What to test and change next") +
    tbl(["Variable", "Try", "Look for"], [
      ["Cone opening", "20 cm, 26 cm and 30 cm opening", "More light vs a taller cone that gets close to the lamp"],
      ["Sleeve", "Black paint vs black paper; with and without aluminium", "Temperature after 10 minutes"],
      ["Lid", "With and without the clear film", "Gain and how fast it flattens"],
      ["Foil", "Smooth vs wrinkled foil", "Bright spot on the cup; scatter between repeat runs"],
      ["Repeatability", "Run each version twice", "Differences smaller than 0.5 °C mean your forecasts will be accurate"]]) +
    "<p>When you have your own heating readings, put them into the <b>Forecasting the final temperature</b> calculator to turn them into a prediction table.</p>");

  add("dev_forecast", "Forecasting the final temperature (the 20-point prediction)",
    "Your prediction is scored against the real final temperature. Because PE is 1 − |error| ÷ final temperature, small misses cost little, but PS is relative to the best prediction at the event, so accuracy still separates teams.",
    h4("How the prediction score behaves") +
    "<div class='sh-code'>PE = 1 − |final − predicted| ÷ final\nPS = PE ÷ (highest PE of all teams) × 20\n\nExample: final 33.0 °C, you predicted 32.0 °C\nPE = 1 − 1.0 ÷ 33.0 = 0.970\nIf the best team had PE = 0.995, PS = 0.970 ÷ 0.995 × 20 = 19.5 points</div>" +
    "<p>So a 1 °C miss costs only about half a point if the best team is nearly perfect, but a 5 °C miss costs about 3 points. The big risk is not making any prediction before the end of the heating time (PS = 0) or touching the device (PS = TS = 0).</p>" +
    h4("A model you can calibrate") +
    "<p>Heat input warms the water, while losses grow as the water gets hotter than the room. A simple lumped model gives an <b>exponential approach</b> to an equilibrium temperature:</p>" +
    "<div class='sh-code'>T(t) = T_eq − (T_eq − T_start) · e^(−t/τ)\n\nT_eq − T_room  ∝  energy collected   (scales with height as (h₀/h)ⁿ, n ≈ 2)\nτ = (heat capacity of water + device) ÷ (loss coefficient)</div>" +
    ul(["<b>Early in the run</b> the curve is nearly a straight line: rate ≈ (T<sub>eq</sub> − T<sub>start</sub>)/τ.", "<b>Later</b> it flattens as losses catch up. Longer heating time (States/Nationals) means more curvature.", "A <b>warmer start</b> than the practice run means a smaller gain (higher losses); a <b>warmer room</b> raises the equilibrium temperature.", "A higher lamp (bigger h) means a lower T<sub>eq</sub> − T<sub>room</sub>."]) +
    h4("Step-by-step method") +
    ol(["<b>Before the event:</b> run the device at home at one reference height h₀. Record the temperature at two times (say 5 and 10 min) with a start temperature equal to the room temperature.", "<b>Fit the curve</b> to get τ and the maximum rise (the calculator below does this). If you have time, repeat at other heights to check the exponent n.", "<b>Make tables</b> of predicted final temperature for each possible height and heating time (prepared tables are allowed in the event).", "<b>At the event:</b> write down the height, heating time, room temperature and your starting temperature as they are announced.", "Read your prediction from the table or the formula, subtract about 0.1–0.3 °C for cooling during cup removal, and <b>write it down early</b> (before heating ends).", "Round to one decimal place, in °C."]) +
    h4("Worked example") +
    "<div class='sh-code'>Practice at 40 cm, start 21.0 °C = room:  5 min → 27.0 °C,  10 min → 31.8 °C\nΔT₁ = 6.0,  ΔT₂ = 10.8   →  e^(−5/τ) = ΔT₂/ΔT₁ − 1 = 0.80\nτ = −5 ÷ ln 0.80 = 22.4 min        maximum rise a = ΔT₁ ÷ (1 − 0.80) = 30 °C\nPrediction for 15 min at 40 cm:  ΔT = 30·(1 − 0.80³) = 14.6 °C  →  T ≈ 35.6 °C</div>" +
    "<p class='sh-muted'>(That shortcut works when t₂ = 2·t₁. The calculator solves the general case numerically.) Real devices follow this shape only approximately; test yours at the likely heights and times, and trust measurements over the model when they disagree.</p>" +
    h4("Common forecasting mistakes") +
    ul(["Using the starting temperature measured by the team instead of the supervisor’s announced value.", "Forgetting that the cup is removed and measured within about a minute, so the final reading is slightly lower than the peak.", "Using heating curves from a different lamp, height or room temperature without scaling.", "Waiting until the last second to write the prediction: do it before the end of the heating time, ideally during the setup minutes.", "Trusting one practice run. Repeat to see the scatter."]),
    { widget: "thforecast" });

  add("dev_day", "Competition-day checklist and routine",
    "Part II is a short, scripted routine. Practise it so you can do it calmly with the clock running.",
    tbl(["When", "Do this"], [
      ["Before leaving", "Device and spares at room temperature; notes, tables, two Class III calculators, tools, pens; check the 30 cm cube again"],
      ["At check-in", "Impound only the device and spare parts"],
      ["Announcement", "Write down: bulb height, heating time, room temp, source-water temp, bulb specs"],
      ["3 min setup", "Assemble the device, check the construction rules, <b>start the prediction</b> using your table (adjust for start/room temp when you learn the starting temperature)"],
      ["Water arrives", "Write down the supervisor’s starting temperature; finish the prediction number"],
      ["1 min water setup", "Place the cup in the device without altering the cup or water. Practice this move until it takes 10 s"],
      ["Heating time", "<b>Hands off.</b> Write the final prediction in °C on the scoresheet before the lamp goes off. Work on the written test if allowed"],
      ["Lamp off", "Lift the cup out completely and put it on the table, separated from every device part. Let the supervisor measure"],
      ["After", "Review the scoresheet with the supervisor, and check the numbers (start, final, your prediction). Leave the device if you plan an appeal"]]) +
    h4("Team roles for two people") +
    ul(["<b>Builder:</b> handles the device and cup; keeps hands clear of the lamp.", "<b>Calculator:</b> records announced values, computes the prediction, writes it on the scoresheet, then works on the test."]) +
    h4("If the conditions are not what you practised") +
    ul(["Height different from your practice height: scale the energy with (h₀/h)ⁿ in the forecast calculator.", "Longer heating time: use the curve, not a straight line.", "Warmer starting water than room: expect a smaller gain.", "A construction problem found during setup: fix it during the 3-minute setup time or accept the ×0.7 per violation."]) +
    h4("Time is shared with the test") + "<p>The written exam is 50 of the 100 points. While the lamp is on, if the supervisor allows it, use the waiting time on Part I rather than staring at the cup.</p>");

  add("dev_score", "Score estimator: what is each choice worth?",
    "Enter your numbers and see how ES, TS and PS combine into the final score, including violation penalties.", "<p>Try changing only the prediction or only the gain to see which matters most for your team.</p>", { widget: "thscore" });

  /* ---------------- questions ---------------- */
  var Q = [];
  function mc(n, concept, stem, opts, ci, expl) {
    Q.push({ id: "dv" + n, exam: "Practice · Part II device & forecast", set: "dv", num: n, pts: null, topic: "", typ: "Multiple Choice", stem: stem, options: opts, correct: [ci], explanation: expl, sample: "", img: null, appears: ["Practice · Part II device & forecast #" + n], concept: concept });
  }
  function sa(n, concept, stem, sample) {
    Q.push({ id: "dv" + n, exam: "Practice · Part II device & forecast", set: "dv", num: n, pts: null, topic: "", typ: "Short Answer", stem: stem, options: null, correct: [], explanation: "", sample: sample, img: null, appears: ["Practice · Part II device & forecast #" + n], concept: concept });
  }
  mc(2, "dev_rules", "Team A gains 12.0 °C and the best team gains 15.0 °C. What is Team A’s Temperature Score?",
    ["12 points", "24 points", "30 points", "20 points"], 1, "TS = TG ÷ highest TG × 30 = 12 ÷ 15 × 30 = 24.");
  mc(3, "dev_rules", "The final cup temperature was 38.0 °C and the team predicted 36.5 °C. What is PE?",
    ["0.04", "0.96", "0.99", "1.50"], 1, "PE = 1 − |38.0 − 36.5| ÷ 38.0 = 1 − 0.0395 = 0.960.");
  mc(4, "dev_rules", "A team touches its device while the lamp is on. What happens?",
    ["Nothing: they may adjust it", "TS and PS are multiplied by 0.9", "TS and PS are both zero", "They lose 5 points of ES"], 2, "Touching the device or lamp setup during the heating time gives TS = 0 and PS = 0.");
  mc(5, "dev_rules", "How are construction violations penalised if they remain at the end of setup time?",
    ["TS and PS × 0.9 per violation", "TS and PS × 0.7 per violation", "ES × 0.7", "Disqualification"], 1, "Construction violations: ×0.7 per violation. Competition violations: ×0.9 per violation.");
  mc(6, "dev_rules", "What is the order of tie-breakers?",
    ["ES, TS, test questions", "TS, ES, preselected test questions", "PS, TS, ES", "Random"], 1, "1st best TS; 2nd best ES; 3rd preselected test questions.");
  mc(7, "dev_rules", "How much water does the supervisor put in each team’s cup?",
    ["50 mL", "100 mL", "200 mL", "9 oz"], 1, "100 mL of water from the source bath, in a 9-oz clear plastic cup.");
  mc(8, "dev_build", "The device, including the cup of water, must fit inside a cube of side…",
    ["20 cm", "25 cm", "30 cm", "40 cm"], 2, "30.0 cm × 30.0 cm × 30.0 cm when set up for testing.");
  mc(9, "dev_build", "Which of these may NOT be part of the device?",
    ["Aluminium foil", "A commercially available thermos", "Black paint", "Cardboard"], 1, "Thermometers, probes, commercial thermoses, coolers and vacuum-sealed devices are banned, as are asbestos, mineral wool and fiberglass.");
  mc(10, "dev_build", "Which statement about the water is correct?",
    ["Parts of the device may touch the water if clean", "Nothing may be added to the water, and no part of the device may contact it", "Teams may stir the water during heating", "Teams may bring their own water"], 1, "Parts can be inside the cup but must not contact the water; nothing may be added to it.");
  mc(11, "dev_build", "What must be true of everything impounded?",
    ["It must be cold", "It must be at room temperature", "It must be waterproof", "It must weigh under 1 kg"], 1, "All impounded items must be at room temperature, and no part of the device should be significantly different from room temperature at the start.");
  mc(99, "dev_build", "Which of these is allowed in the device?",
    ["A hand-warmer pack", "Aluminium foil and polystyrene foam", "Fiberglass insulation", "A battery-powered fan"], 1, "Foil and polystyrene foam are allowed. Chemical heat packs, batteries and electrical parts are banned energy sources, and fiberglass is a banned hazardous material.");
  mc(100, "dev_build", "A team puts fiberglass insulation in its device. What is the consequence?",
    ["TS and PS are multiplied by 0.9", "The device cannot be set up or tested, and the team takes only the written test", "Nothing, if it is covered with tape", "ES is reduced"], 1, "Hazardous materials (asbestos, mineral wool, fiberglass) mean the device is not allowed to be set up, modified or tested.");
  mc(12, "dev_design", "Roughly how much heat is needed to warm 100 g of water by 8.0 °C? (c = 4.186 J/g·°C)",
    ["33.5 J", "335 J", "3 349 J", "33 490 J"], 2, "Q = m c ΔT = 100 × 4.186 × 8.0 = 3 349 J ≈ 3.3 kJ.");
  mc(13, "dev_design", "Why is the surface that first receives the lamp’s light usually painted matte black?",
    ["Black surfaces reflect more radiation", "Black surfaces absorb more radiation", "Black paint conducts heat better than metal", "Black prevents convection"], 1, "Dark matte surfaces absorb most incident radiation; shiny surfaces reflect it.");
  mc(14, "dev_design", "What is the main purpose of a clear lid or cover on the device?",
    ["To block the light", "To let light in while reducing convective and radiative heat loss (greenhouse effect)", "To add energy", "To lower the water temperature"], 1, "A clear cover transmits the lamp’s light but stops air from carrying heat away and blocks the longer-wavelength infrared that the hot parts emit.");
  mc(15, "dev_design", "Which material is the best insulator listed?",
    ["Aluminium", "Copper", "Still air", "Water"], 2, "Still air (k ≈ 0.026 W/m·K) is an excellent insulator as long as it cannot circulate.");
  mc(16, "dev_design", "A shielding sleeve of heavy metal is added around the cup. Which is the main drawback?",
    ["It reflects light", "Its own heat capacity absorbs energy that would otherwise warm the water", "It cannot conduct", "It is banned"], 1, "The device’s own parts must be heated too (Q = m c ΔT), so extra mass wastes energy.");
  mc(17, "dev_design", "Heat from the lamp reaches your device through the air mainly by…",
    ["Conduction", "Convection", "Radiation", "Evaporation"], 2, "The lamp heats the device mostly by thermal (infrared and visible) radiation.");
  mc(18, "dev_design", "If the lamp is raised from 40 cm to 60 cm, the intensity at the device changes by about (inverse-square approximation)…",
    ["× 2/3", "× 4/9", "× 9/4", "× 1/2"], 1, "Intensity ∝ 1/h², so (40/60)² = 4/9 ≈ 0.44.");
  mc(19, "dev_forecast", "The water starts 2 °C warmer than room temperature. Compared with a start at room temperature, the temperature GAIN will most likely be…",
    ["Larger, because it started warmer", "Smaller, because the warmer water and device lose heat faster to the surroundings", "Exactly the same", "Zero"], 1, "Heat loss grows with the temperature difference to the room, so the gain is slightly smaller.");
  mc(20, "dev_forecast", "A practice run starting at room temperature gave ΔT = 6.0 °C after 5 min and ΔT = 10.8 °C after 10 min. Using ΔT(t) = a(1 − e^(−t/τ)), what is the predicted ΔT after 15 min?",
    ["16.2 °C", "14.6 °C", "12.0 °C", "10.8 °C"], 1, "e^(−5/τ) = 10.8/6.0 − 1 = 0.80 → a = 6.0 ÷ (1 − 0.80) = 30 °C. ΔT(15) = 30(1 − 0.80³) = 30 × 0.488 = 14.6 °C. (A straight line would wrongly predict 16.2 °C.)");
  mc(21, "dev_forecast", "What happens if a team gives no temperature prediction before the heating time ends?",
    ["PS is 0", "TS is 0", "ES is reduced", "They get 10 points"], 0, "A team that does not give a final temperature prediction before the end of the heating time receives PS = 0.");
  mc(22, "dev_forecast", "Why do teams make a prepared table of predicted temperatures for several heights and heating times?",
    ["The rules require it", "The conditions are announced only at the event and the table lets them predict quickly; prepared graphs and tables are allowed", "To avoid measuring the start temperature", "It replaces the written test"], 1, "Heights and heating times are announced on the day; prepared graphs/tables for calculating results are allowed.");
  mc(23, "dev_forecast", "After the lamp turns off, why is it important that the cup is removed and measured quickly?",
    ["The water is evaporating into the lamp", "The water cools, so a delay lowers the measured final temperature", "The thermometer is not accurate after one minute", "The cup melts"], 1, "Both the team and the supervisor should finish within about a minute to minimise cooling.");
  mc(24, "dev_day", "During the heating time, a team’s best action is to…",
    ["Adjust the reflector", "Nudge the device so the cup is centred", "Keep hands off, finish the prediction and (if allowed) work on the written test", "Stir the water"], 2, "Touching the device or lamp during heating zeroes TS and PS; the prediction must be completed before the heating ends.");
  sa(25, "dev_design", "Describe a device design and explain, using absorb, concentrate, conduct and insulate, why each feature helps the water gain temperature.",
    "Example: a foil cone concentrates lamp light (concentrate) onto a matte-black aluminium sleeve wrapped around the cup (absorb); the thin sleeve and cup wall conduct heat into the water (conduct); a foam jacket, an air gap and a clear lid trap still air and reduce convection and radiation losses (insulate). Keep the metal mass low so little energy is spent heating the device itself, and keep the whole assembly inside a 30 cm cube with no part touching the water.");
  sa(26, "dev_forecast", "Explain how you would build a table for predicting the final water temperature at the competition, and what you would do on the day.",
    "Before: run the device at home at a reference height, recording temperature versus time for 10–15 minutes at several heights if possible; fit T(t) = T_eq − (T_eq − T_start)·e^(−t/τ); scale the energy with (h₀/h)² (check n against data); tabulate predicted temperatures for each possible height and time. On the day: write down the announced height, heating time, room temperature and the supervisor’s starting temperature; read or compute the prediction, subtract a small cooling correction, and write it down before the heating time ends.");

  /* ---------------- register ---------------- */
  function register() {
    var s = (window.SUBJECTS || []).filter(function (x) { return x.id === "thermodynamics"; })[0];
    if (!s) return;
    var have = {}; s.concepts.forEach(function (c) { have[c.id] = 1; });
    s.concepts = s.concepts.concat(C.filter(function (c) { return !have[c.id]; }));
    var haveQ = {}; s.questions.forEach(function (q) { haveQ[q.id] = 1; });
    Q.forEach(function (q, i) { // renumber after removals
      q.num = i + 1; q.id = "dv" + (i + 1); q.appears = ["Practice · Part II device & forecast #" + (i + 1)];
      if (!haveQ[q.id]) s.questions.push(q);
    });
    s.description = "Concepts from the 2027 Starter Pack with exam practice, plus Part II: the heat-collecting device and the temperature forecast (50 of the 100 points).";
  }
  register();
})();
