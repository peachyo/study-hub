/* Experimental Design (Science Olympiad Division B): guide built from the report form, scoring guide, CER guide and sample prompts */
(function () {
  "use strict";
  var L1 = "1 · Foundations", L2 = "2 · The report, section by section", L3 = "3 · Designing the experiment", L4 = "4 · Tools";

  /* ---------- html helpers ---------- */
  function ul(a) { return "<ul>" + a.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul>"; }
  function ol(a) { return "<ol class='hx-steps'>" + a.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ol>"; }
  function rubric(pts, a) { return "<div class='hx-callout'><b>Scoring guide · " + pts + "</b>" + ul(a) + "</div>"; }
  function good(a) { return "<div class='hx-good'><b>✓ Good</b>" + ul(a) + "</div>"; }
  function bad(a) { return "<div class='hx-bad'><b>✗ Weak</b>" + ul(a.map(function (x) { return "<i>" + x[0] + "</i><br><span class='hx-why'>Why: " + x[1] + "</span>"; })) + "</div>"; }
  function gb(g, b) { return "<div class='hx-two'>" + good(g) + bad(b) + "</div>"; }
  function h4(t) { return "<h4>" + t + "</h4>"; }
  function tbl(head, rows) { return "<div class='hx-scroll'><table class='hx-tbl'><tr>" + head.map(function (x) { return "<th>" + x + "</th>"; }).join("") + "</tr>" + rows.map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>"; }).join("") + "</table></div>"; }
  var EX = "<p class='sh-muted'>Running example used in this guide: the Purdue 2025 friction prompt. All numbers are invented for illustration, and the experiment is one reasonable design, not an official answer key.</p>";

  var C = [];
  function add(id, level, title, def, body, extra) {
    var o = { id: id, level: level, title: title, definition: def, body: body, points: [], formula: "", source: "", img: [], svg: null };
    for (var k in (extra || {})) o[k] = extra[k];
    C.push(o);
  }

  /* ======================= LEVEL 1 ======================= */
  add("ed_overview", L1, "Start here: what the event is and how it is scored",
    "In Experimental Design you are given a prompt, a list of materials and a short time. You design and run an experiment, then write a structured report. You are graded on the report, section by section, not on whether your hypothesis turned out right.",
    "<div class='hx-two'><div class='hx-callout'><b>Part 1 · 20 minutes</b><br>Design and construction: sections A to G (problem, hypothesis, variables, materials, procedure and diagrams, qualitative observations, quantitative data).</div>" +
    "<div class='hx-callout'><b>Part 2 · 30 minutes</b><br>Data, analysis and conclusions: sections H to M (graph, statistics, errors, CER analysis, conclusion, improvements). You may keep experimenting and working on Part 1 during this time.</div></div>" +
    h4("Where the points are (Division B scoring guide, July 2023)") +
    tbl(["Section", "What you write", "Points"], [
      ["A", "Statement of problem", "2"], ["B", "Hypothesis", "6"], ["C", "Variables (IV, levels, DV, 2 controls, constant)", "17"], ["D", "Materials", "4"],
      ["E", "Procedure, set-up and diagrams", "14"], ["F", "Qualitative observations", "12"], ["G", "Quantitative data (raw + condensed tables)", "8"], ["H", "Graph", "12"],
      ["I", "Statistics (central tendency + variation)", "14"], ["J", "Possible experimental errors", "8"], ["K", "Claim / Evidence / Reasoning analysis", "18"], ["L", "Conclusion", "8"], ["M", "Improvements, applications, future experiments", "9"],
      ["", "<b>Total</b>", "<b>132</b>"]]) +
    "<div class='hx-warn'><b>Heads up on letters.</b> On the 2025–26 report form the sections run …I Statistics, <b>J Errors, K CER</b>, L Conclusion. The 2023 scoring-guide document lists them the other way round (J = CER, K = Errors). The content and points are the same, so this guide follows the report form. The scoring guide itself says the official rules manual always takes precedence.</div>" +
    h4("What the graders reward, in one sentence each") +
    ul(["<b>One</b> independent variable, <b>one</b> dependent variable, at least <b>three levels</b>, with units and tools.", "Repeated trials <b>within each level</b>.", "A procedure so clear that a stranger could repeat it.", "Everything you wrote is <b>operationally defined</b> (units, tools, how it was measured).", "Statistics computed <b>within each level</b>, each with an example calculation.", "Conclusions in <b>Claim / Evidence / Reasoning</b> form, using your own numbers."]) +
    h4("Time plan that works") +
    tbl(["When", "Do this"], [
      ["First 3 min of Part 1", "Read the prompt. List constraints. Pick IV and DV (see “From prompt to question”). Write A, B, C."],
      ["Next 5 min", "Write D (materials) and E (numbered procedure). Sketch two diagrams. Start the set-up."],
      ["Rest of Part 1", "Run trials. Write observations (F) as you go. Fill the raw table (G)."],
      ["Part 2, first 10 min", "Finish raw table, condensed table, graph (H), statistics (I) with sample calculations."],
      ["Part 2, last 20 min", "Errors (J), CER (K), conclusion (L), improvements (M). These are 43 points: do not run out of time."]]) +
    "<p>Use the <b>Self-score</b> page at the end to check your draft against every scoring-guide line.</p>",
    { source: "2025–26 Div B Experimental Design Report; Experimental Design Scoring Explanation, Division B (July 2023)" });

  add("ed_terms", L1, "Key terms in plain language",
    "Most lost points come from using these words loosely. Learn the exact meaning the scoring guide uses.",
    tbl(["Term", "Meaning", "Example (friction experiment)"], [
      ["Independent variable (IV)", "The ONE thing you deliberately change.", "Surface covering the ramp"],
      ["Levels", "The different values of the IV you test (need at least 3).", "Printer paper, cardboard, sandpaper"],
      ["Dependent variable (DV)", "The ONE thing you measure to see the effect of the IV.", "Angle (°) at which the block starts to slide"],
      ["Controlled variable (CV)", "Something you hold the same. It could be an IV in a different experiment.", "Same Lego block; same lifting speed"],
      ["Constant", "A value that never changes and could not be an IV here.", "Gravity; same table; same day"],
      ["Standard of comparison (SOC)", "The baseline condition you compare the levels against.", "Bare book cover with no covering"],
      ["Operational definition", "Exactly what is measured, how, with what tool and in what units.", "“Angle in degrees to the nearest 1° read from a protractor at first movement”"],
      ["Trial", "One run of the experiment at one level. Repeat trials within each level.", "5 slides on cardboard"],
      ["Raw data / condensed data", "Every measurement / the summarised values you graph.", "All 20 angles / the 4 means"],
      ["Qualitative vs quantitative", "Words vs numbers.", "“Block twisted” vs “27°”"],
      ["Random, procedural, systematic error", "Limited instrument precision / known mistake or poor procedure / faulty equipment with a steady bias.", "Reading to the nearest degree / pushing the block / protractor reads 2° high"],
      ["Outlier", "A value far from the rest, found with a stated rule (e.g., beyond 1.5 × IQR outside Q1–Q3).", "One 35° slide among 25–28°"],
      ["Claim / Evidence / Reasoning (CER)", "A statement / the data supporting it / the logic connecting them.", "See section K"]]) +
    h4("Ideas from the “Basics of Experimental Design” article that matter here") +
    ul(["<b>Experimentation means interfering on purpose.</b> You change one thing and observe, rather than only watching. The point of the design is to rule out other causes.",
      "<b>Extraneous variables</b> are anything else that could affect the result. Your controlled variables are your defence against them. If one slips through, it is a <b>threat to validity</b> and belongs in your error discussion.",
      "<b>Control group = your SOC.</b> It tells you what happens without the treatment, so you can measure the treatment’s effect against it.",
      "<b>Randomisation:</b> spread the order of runs so that no level always goes first or last (fatigue, wear and warming up then hit every level equally).",
      "<b>Single-factor design:</b> the textbook is full of designs with several factors (factorial, blocks). Science Olympiad scores exactly one IV, so you run a one-factor, several-level design with repeated trials. Save the “what if I also changed X” for section M (future experiments).",
      "<b>Internal validity</b> asks: did the treatment really cause the effect? <b>External validity</b> asks: would the result hold for other objects or conditions? Your applications in section M talk about external validity."]),
    { source: "Basic Experimental Design (S. Sytsma); Scoring Explanation, Division B" });

  /* ======================= LEVEL 2: sections ======================= */
  var SVG_RAMP = "<figure class='hx-fig'><svg viewBox='0 0 420 205' role='img' aria-label='Side view of the ramp set-up' xmlns='http://www.w3.org/2000/svg'>" +
    "<line x1='20' y1='170' x2='400' y2='170' stroke='currentColor' stroke-width='3'/>" +
    "<line x1='372' y1='110' x2='372' y2='52' stroke='currentColor' stroke-width='2'/><path d='M366 60 L372 50 L378 60' fill='none' stroke='currentColor' stroke-width='2'/>" +
    "<line x1='50' y1='170' x2='350' y2='80' stroke='#bf8700' stroke-width='5' stroke-linecap='round'/>" +
    "<g transform='rotate(-16.7 200 125)'><rect x='180' y='105' width='40' height='20' fill='#cf222e' fill-opacity='.25' stroke='#cf222e' stroke-width='2'/></g>" +
    "<path d='M110 170 A60 60 0 0 0 107.5 152.8' fill='none' stroke='currentColor' stroke-width='2'/><text x='118' y='164' font-size='15' fill='currentColor'>θ</text>" +
    "<text x='170' y='86' font-size='12' fill='currentColor'>Lego block</text><text x='60' y='140' font-size='12' fill='#bf8700'>textbook ramp + covering</text>" +
    "<text x='296' y='40' font-size='12' fill='currentColor'>lift this end slowly</text><text x='22' y='190' font-size='12' fill='currentColor'>table top (angle θ read with protractor)</text></svg>" +
    "<figcaption>Figure 1. Side view of the ramp set-up (example diagram: titled and labeled).</figcaption></figure>";

  var SVG_BAR = "<figure class='hx-fig'><svg viewBox='0 0 420 250' role='img' aria-label='Example bar graph' xmlns='http://www.w3.org/2000/svg'>" +
    "<text x='210' y='18' text-anchor='middle' font-size='13' font-weight='600' fill='currentColor'>Slide angle of a Lego block by ramp surface</text>" +
    "<line x1='60' y1='30' x2='60' y2='200' stroke='currentColor'/><line x1='60' y1='200' x2='400' y2='200' stroke='currentColor'/>" +
    "<g font-size='10' fill='currentColor' text-anchor='end'><text x='54' y='204'>0</text><text x='54' y='170'>10</text><text x='54' y='136'>20</text><text x='54' y='102'>30</text><text x='54' y='68'>40</text><text x='54' y='34'>50</text></g>" +
    "<g stroke='currentColor' stroke-opacity='.2'><line x1='60' y1='166' x2='400' y2='166'/><line x1='60' y1='132' x2='400' y2='132'/><line x1='60' y1='98' x2='400' y2='98'/><line x1='60' y1='64' x2='400' y2='64'/></g>" +
    "<rect x='80' y='137.4' width='50' height='62.6' fill='#8c959f'/><rect x='155' y='127.2' width='50' height='72.8' fill='#0969da'/><rect x='230' y='104.1' width='50' height='95.9' fill='#0969da'/><rect x='305' y='67.4' width='50' height='132.6' fill='#0969da'/>" +
    "<g font-size='10' fill='currentColor' text-anchor='middle'><text x='105' y='132'>18.4</text><text x='180' y='122'>21.4</text><text x='255' y='99'>28.2</text><text x='330' y='62'>39.0</text>" +
    "<text x='105' y='214'>Bare cover</text><text x='105' y='225'>(SOC)</text><text x='180' y='214'>Printer</text><text x='180' y='225'>paper</text><text x='255' y='214'>Cardboard</text><text x='330' y='214'>Sandpaper</text>" +
    "<text x='230' y='243' font-size='11'>Ramp surface (independent variable)</text><text transform='translate(14 115) rotate(-90)' font-size='11'>Mean slide angle (degrees)</text></g></svg>" +
    "<figcaption>Figure 2. Qualitative IV, so a bar graph: IV on the x-axis, DV on the y-axis, title, axis headings with units, continuous scale starting at 0.</figcaption></figure>";

  add("sec_a", L2, "A · Statement of problem (2 pts)",
    "The statement of the problem is the single question your experiment answers. It names what you change and what you measure, and it can be answered with the materials in front of you.",
    rubric("2 points", ["Not a yes/no question", "The topic of the experiment is defined", "Both the independent and dependent variables are identified", "Clearly testable with the materials provided", "All four = 2 pts; missing one or two = 1 pt; missing three or four = 0"]) + EX +
    h4("How to fill it") +
    ol(["Write the <b>topic</b> in a few words (what physical idea are you studying?).", "Pick your IV and DV first (see “From prompt to question”).", "Use a sentence frame: <b>“How does [IV] affect [DV of the object]?”</b> or “What is the effect of [IV] on [DV]?”", "Check against the materials: could you do this with only what is on the table?", "Check you can circle the IV and the DV in the sentence."]) +
    h4("Sentence frames that never go wrong") +
    ul(["How does <b>[the thing you change]</b> affect <b>[the thing you measure]</b> of <b>[the object]</b>?", "What is the effect of <b>[IV, with units]</b> on <b>[DV, with units]</b>?", "How does changing <b>[IV]</b> change <b>[DV]</b>?"]) +
    gb(["How does the <b>surface covering a ramp</b> (printer paper, cardboard, sandpaper) affect the <b>angle at which a Lego block begins to slide</b>?",
        "What is the effect of <b>the number of Lego blocks stacked on a toy car</b> on <b>the distance the car rolls after leaving a ramp</b>?"],
      [["Does friction affect motion?", "Yes/no question; topic only; no IV or DV."], ["Friction.", "A topic word, not a question."], ["Does sandpaper have more friction than paper?", "Yes/no question."],
       ["How does friction work?", "Too broad; no variables; cannot be tested in 50 minutes."], ["How does the temperature of the ramp affect sliding?", "Not testable with the provided materials (no heating or thermometer)."]]) +
    h4("Quick test") + "<p>Cover the answer. Can you say the IV, the DV and the units/tools from the sentence alone? If not, rewrite it. Does a one-word answer (“yes”) fit? If so, it is a yes/no question and scores a point less.</p>",
    { source: "Scoring Explanation, Division B (section A); Purdue 2025 prompt" });

  add("sec_b", L2, "B · Hypothesis (6 pts)",
    "A hypothesis is a specific prediction of how the DV will change when the IV changes, with a short scientific reason. It is graded on three things: relationship, direction and rationale.",
    rubric("6 points = 3 parts × 2", ["<b>Relationship (2):</b> predicts a relationship between the IV and DV; both variables included", "<b>Direction (2):</b> specific direction (cannot be open-ended); both variables included", "<b>Rationale (2):</b> brief scientific reason that is relevant to the experiment"]) + EX +
    h4("How to fill it") +
    ol(["Start with the frame: <b>If [IV changes this way], then [DV will change this way], because [science].</b>", "Say a direction: increase / decrease / larger / smaller, not “change” or “be different”.", "Name <b>both</b> variables, in the words you used in the problem statement.", "Give the reason in one or two sentences using a real idea (friction depends on roughness and normal force; heavier objects have a larger normal force; air resistance grows with surface area).", "Make it testable: your data must be able to <b>support or fail to support</b> it. A hypothesis is never “proven” or “wrong” (see section L)."]) +
    gb(["If the ramp is covered with a <b>rougher surface</b> (printer paper → cardboard → sandpaper), then the <b>angle at which the Lego block begins to slide will be larger</b>, because a rougher surface has a larger coefficient of static friction, so the ramp must be tilted further before the part of gravity pulling the block down the ramp (mg sin θ) beats the friction force (μ·mg cos θ).",
        "If more Lego blocks are stacked on the toy car, then the distance it rolls will <b>decrease</b>, because the added mass increases the force pressing the wheels onto the ramp and raises rolling friction."],
      [["Sandpaper will be different from paper.", "No direction, no DV, no reason."], ["Rough surfaces have more friction.", "Not about the measured DV; no prediction for this experiment; no ‘because’."], ["The block will slide at 30°.", "A number, not a relationship; the IV is missing."], ["If I change the surface, something will happen to the angle.", "Open-ended; no direction; no rationale."], ["I think the block will slide more on rough paper because it is rough.", "Contradicts friction, and the ‘because’ just repeats the claim."]]) +
    h4("Check yourself") + ul(["Underline IV and DV: both present?", "Circle the direction word: present?", "Find the ‘because’: is the science correct and tied to this experiment?"]),
    { source: "Scoring Explanation, Division B (section B)" });

  add("sec_c", L2, "C · Variables (17 pts)",
    "The Variables box has the most structure. You must define the IV (with at least three levels), the DV, two controlled variables and one constant, each with how it is held or measured.",
    rubric("17 points", ["<b>IV defined (4):</b> correct, only one, the manipulated variable, operationally defined with units and tools", "<b>IV levels (3):</b> at least three relevant levels (a point per level)", "<b>DV defined (4):</b> correct, only one, the measured variable, operationally defined with units and tools", "<b>Controlled variable #1 and #2 (2 each):</b> correct and relevant", "<b>Constant (2):</b> a true constant, relevant"]) + EX +
    h4("Independent variable: how to fill it") +
    ol(["<b>Name</b> the one thing you change.", "<b>Define</b> it operationally: what exactly, in what units, measured or set with which tool.", "<b>List 3 or more levels</b> in the Level 1, 2, 3 boxes. If numeric, space them evenly (10°, 20°, 30°). If qualitative, choose clearly different but relevant options and order them (smoothest → roughest).", "Name your <b>standard of comparison</b> (baseline) if you use one."]) +
    gb(["<b>IV:</b> surface material covering the ramp (qualitative). Each cover is cut to the ramp size and taped flat with Scotch tape. Level 1 printer paper, Level 2 cardboard, Level 3 sandpaper. SOC: bare book cover.",
        "<b>IV:</b> ramp angle in degrees, set with a protractor to the nearest 1°. Level 1 10°, Level 2 20°, Level 3 30°."],
      [["Surfaces and angles", "Two independent variables."], ["Friction", "A concept, not something you directly manipulate; no levels."], ["Paper and sandpaper", "Only two levels, and no definition."], ["Red paper, blue paper, green paper", "Levels are not relevant to friction."], ["The surface", "Not operationally defined."]]) +
    h4("Dependent variable: how to fill it") +
    ol(["Name the <b>one measurement</b> that shows the effect.", "Say <b>what you measure, with which tool, in which units, at what moment, to what precision</b>.", "It must be a number you can actually read with the allowed materials."]) +
    gb(["<b>DV:</b> slide angle: the angle in degrees, read to the nearest 1° from a protractor held against the side of the ramp, at the moment the block first moves.", "<b>DV:</b> distance rolled in pencil-lengths, from the bottom of the ramp to the front of the car, to the nearest ¼ pencil."],
      [["How well it slides", "Not measurable."], ["Friction", "Cannot be measured directly with these materials."], ["Speed", "No tool, no units, and no timer is available in the experiment."], ["Angle and distance", "Two dependent variables."]]) +
    h4("Controlled variables vs constants") +
    tbl(["", "Controlled variable (CV)", "Constant"], [
      ["Is it something you could vary in another experiment?", "Yes (you choose to hold it fixed)", "No (it cannot change)"],
      ["Examples here", "Same Lego block; same textbook ramp; same speed of lifting; same person reads the protractor; block always placed at the same spot facing the same way; same tape used", "Acceleration due to gravity; the same table and room; the same day"],
      ["How to write it", "Name it, and say <b>how</b> you held it constant", "Name it and why it did not change"]]) +
    gb(["<b>CV 1:</b> the block: same Lego block (2×4, one piece) for every trial. <b>CV 2:</b> ramp length and starting position: the block always starts on a pencil dot 5 cm from the high edge, so the sliding distance is identical.",
        "<b>Constant:</b> acceleration due to gravity (the experiment is done at one location on Earth)."],
      [["Everything else was kept the same.", "Not a specific variable."], ["The experimenters.", "Vague; which part of the work?"], ["Temperature (as a controlled variable) with no way to measure or hold it", "Not relevant or checkable with the materials."], ["The surface (as a CV)", "That is your IV."]]),
    { source: "Scoring Explanation, Division B (section C); Purdue 2025 prompt" });

  add("sec_d", L2, "D · Materials (4 pts)",
    "A clean list of exactly what you used, with the amount you used, kept apart from the procedure.",
    rubric("4 points", ["List format, <b>separate from the procedure</b>", "All materials used are included", "Quantified by the amount <b>used</b>, not the amount provided", "No extras: nothing listed that was only provided or not used"]) + EX +
    h4("How to fill it") +
    ol(["After running the experiment, walk through your procedure step by step and tick off every object it uses.", "Write each as a quantity + item (with size or type where it matters).", "Do not list anything you did not touch.", "Do not list the measuring devices the prompt allows only for the write-up (ruler, timer, calculator in the Purdue prompt): they are not materials of the experiment."]) +
    gb(["1 Lego block (2×4)<br>1 textbook (the ramp, cover up)<br>1 sheet printer paper, 1 piece cardboard, 1 sheet sandpaper (each cut to textbook size, taped on one at a time)<br>12 strips Scotch tape (4 per covering)<br>1 protractor<br>1 pencil (to mark the start dot)"],
      [["Cars, Lego, paper, cardboard, sandpaper, tape, books…", "Copied the prompt’s list: includes unused items, no quantities."], ["Some books", "No quantity."], ["Ruler and timer", "Write-up tools are not experiment materials (when the prompt says so)."], ["Place the block on the ramp (listed under materials)", "Procedure text mixed into the materials list."]]) +
    "<p class='sh-muted'>Tip: count the exact number of tape strips or sheets while you work; it takes seconds and earns the quantification point.</p>",
    { source: "Scoring Explanation, Division B (section D); Purdue 2025 prompt" });

  add("sec_e", L2, "E · Procedure, set-up and diagrams (14 pts)",
    "The procedure is a numbered recipe that another team could follow without asking you a single question. Diagrams show the set-up. This is the most heavily weighted writing section after Variables.",
    rubric("14 points", ["<b>Numbered list (2):</b> one step per line", "<b>Logical sequence (2)</b> and all relevant actions included", "<b>Repeated trials (2):</b> repeated within each level of the IV (not “one trial per level”)", "<b>Diagrams (2):</b> at least two relevant diagrams", "<b>Diagram quality (2):</b> they explain the set-up and are labeled and titled", "<b>Repeatable (4):</b> no assumptions, no unanswered questions, diagrams help, states the quantitative and qualitative data collected, says how the SOC was determined and measured"]) + EX +
    h4("The skeleton every good procedure follows") +
    ol(["<b>Set up</b> the equipment (and describe it with a diagram).", "<b>Calibrate or check</b> the instrument (e.g., check the protractor is at 0° on a flat table).", "<b>Measure the SOC</b> first (no treatment) with the same number of trials.", "<b>For each level:</b> change <b>only</b> the IV, then run the trials.", "<b>Each trial:</b> reset, release or start in the same way, measure the DV, record it.", "<b>Repeat</b> until every level has n trials; say the order (rotate or randomise).", "<b>Record qualitative notes</b> along the way.", "<b>Clean up</b> and check data are complete."]) +
    h4("A model procedure for the running example") +
    ol(["Lay 1 textbook flat on the table, cover up. This is the ramp; its low end stays on the table and its high end will be lifted (Figure 1).", "Cut the printer paper, cardboard and sandpaper to the textbook’s size and label them 1, 2, 3.", "Make a pencil dot on the cover 5 cm from the high edge as the block’s starting place.", "Student B holds the protractor upright beside the low end with its baseline along the table. Check it reads 0° with the textbook flat.", "<b>SOC:</b> place the Lego block on the dot, long side across the ramp. Student A lifts the high end slowly and steadily (about 1° every 2 seconds) while Student B watches the block.", "Student A stops lifting the moment the block first moves. Student B reads the protractor to the nearest 1° and Student C records it in Table 1.", "Lower the ramp flat, reset the block on the dot, and repeat steps 5 and 6 until 5 SOC trials are recorded.", "Tape printer paper flat to the ramp with 4 strips of Scotch tape. Repeat steps 5 to 7 for 5 trials.", "Repeat step 8 for cardboard and sandpaper (5 trials each).", "To spread out fatigue and wear, do the 4 conditions in the order SOC, paper, cardboard, sandpaper, SOC, paper… until each has 5 trials, rather than finishing one surface before the next.", "After every trial note anything unusual (block twisting, tape lifting) in the observations table.", "Record all 20 angles in Table 1, then compute the means for Table 2."]) +
    SVG_RAMP +
    h4("What “repeated trials” means to the grader") +
    ul(["<b>Yes:</b> five slides on cardboard, five on sandpaper (repeats within a level).", "<b>No:</b> one slide on paper, one on cardboard, one on sandpaper (that is three levels, not repeated trials).", "Write the number in a step: “Repeat steps 5 to 7 until 5 trials are recorded for this surface.”"]) +
    h4("Diagrams that earn both points") +
    ul(["Draw <b>two</b>, e.g., Figure 1 the side view of the set-up and Figure 2 how the measurement is read or how the trials are laid out.", "Give each a <b>title</b>, label every part (ramp, block, protractor, books, θ), and add measurements or units where they matter.", "Use a ruler/straight lines; labels must be readable; reference them in the steps (“see Figure 1”)."]) +
    gb(["“Place the Lego block, long side across the ramp, with its back edge on the pencil dot 5 cm from the top.”", "“Repeat steps 5 to 7 until 5 trials are recorded.”", "“Student B reads the protractor to the nearest 1° at the moment the block first moves.”"],
      [["Test the block on each surface.", "Not repeatable: how many times? Where? How measured?"], ["Slide the block and see what happens.", "No measurement, no units, no trials."], ["Do the experiment three times.", "Unclear whether this means three levels or three trials."], ["One long paragraph describing everything", "Not a numbered list."], ["(No mention of the SOC or of how it was measured)", "Loses a part of the ‘repeatable’ score."]]) +
    h4("The stranger test") + "<p>Hand your procedure to someone who has not seen your experiment. Can they build the set-up and take the same measurements? Any question they ask is a missing sentence.</p>",
    { source: "Scoring Explanation, Division B (section E); Purdue 2025 prompt" });

  add("sec_f", L2, "F · Qualitative observations (12 pts)",
    "Words, not numbers: what you noticed about the set-up, the procedure and the results. The form has three boxes (Set-up, Procedure, Results), and each is worth 4 points.",
    rubric("12 points = 3 boxes × 4", ["<b>Procedure box:</b> what worked well; what did not; modifications needed; unexpected irregularities", "<b>Results box:</b> were results as expected (why or why not); outliers and possible reasons; trend in the data", "<b>Throughout:</b> observations taken the whole way, including the pre-lab/set-up stage, about the data collection and about the results", "All observations are words-based; one point lost per missing element"]) + EX +
    h4("How to fill it") +
    ol(["Keep a running log with short notes as things happen (“trial 3 cardboard: block turned slightly”). Do not wait until the end.", "Fill each box <b>in sentences</b> that answer the guide’s questions.", "Describe what you <b>saw</b> and what you <b>changed</b>, not only that it “went well”.", "Connect to the data: mention which level had the outlier and why you think it happened.", "State whether the result matched your hypothesis and why."]) +
    tbl(["Box", "Good example", "Weak example"], [
      ["Set-up", "The textbook ramp slid on the table until we taped its low end down. Sandpaper curled up at the corners, so we added two extra tape strips.", "Set up the ramp."],
      ["Procedure", "Lifting the ramp slowly with two hands worked well. At first the block twisted on the cardboard so we marked a straight edge to line it up. Trial 5 on cardboard slid early because the tape had loosened.", "It worked well."],
      ["Results", "The block slid at larger angles on rougher surfaces as predicted. The cardboard value of 35° stands out from 25–28°; the tape had lifted. Sandpaper results were tightest.", "The results were good."]]) +
    h4("Never write") + ul(["“It worked.” / “No problems.” (no detail)", "Anything that is only numbers (that goes in G)", "Opinions about team members"]),
    { source: "Scoring Explanation, Division B (section F)" });

  add("sec_g", L2, "G · Quantitative data (8 pts)",
    "Numbers, in two tables: a raw table with every measurement, and a condensed table with only what you will graph (usually means), plus an example calculation for anything you derived.",
    rubric("8 points", ["<b>Raw table (2):</b> all quantitative data, with units, in a properly labeled table; every measurement is included", "<b>Condensed table (2):</b> only the data to be graphed; derived values (including statistics) have at least one example calculation each", "<b>Titles and labels (2):</b> every table titled; every column and row labeled", "<b>Units (2):</b> in headings or on each data point"]) + EX +
    h4("Raw table (Table 1): every trial") +
    tbl(["Surface (IV)", "Trial 1 (°)", "Trial 2 (°)", "Trial 3 (°)", "Trial 4 (°)", "Trial 5 (°)"], [
      ["Bare cover (SOC)", "18", "19", "17", "18", "20"], ["Printer paper", "21", "22", "20", "23", "21"], ["Cardboard", "26", "27", "25", "28", "35"], ["Sandpaper", "38", "40", "37", "39", "41"]]) +
    "<p class='sh-muted'>Table 1. Slide angle of a Lego block, five trials for each ramp surface (degrees, ±1°). Invented data.</p>" +
    h4("Condensed table (Table 2): only what you graph") +
    tbl(["Surface (IV)", "Mean slide angle (°)"], [["Bare cover (SOC)", "18.4"], ["Printer paper", "21.4"], ["Cardboard", "28.2"], ["Sandpaper", "39.0"]]) +
    "<div class='sh-code'>Example calculation (cardboard): mean = (26 + 27 + 25 + 28 + 35) ÷ 5 = 141 ÷ 5 = 28.2 °</div>" +
    ul(["Add one example calculation for <b>each different</b> derived quantity (mean, percent change, etc.).", "Every column header carries its unit: “Trial 1 (°)”.", "Keep the raw table complete: do not delete the odd value. Discuss it later.", "Put the table title above, and number the tables so you can refer to them."]) +
    gb(["Titled, numbered tables; units in every header; raw data for all 20 trials; condensed table with only the graphed means and a sample calculation."],
      [["A table with no title and numbers without units", "Loses title and unit points."], ["Only the averages, no raw data", "Raw table missing."], ["Averages with no calculation shown", "Condensed-table point lost."]]),
    { source: "Scoring Explanation, Division B (section G)" });

  add("sec_h", L2, "H · Graph (12 pts)",
    "The graph shows how the DV changes with the IV, using your condensed data. The type of graph depends on whether the IV is words or numbers.",
    rubric("12 points", ["<b>Type and axes (4):</b> appropriate type; IV on x, DV on y (swapping them loses a point)", "<b>Labels (4):</b> descriptive title; x-axis heading; y-axis heading; legend with title if several symbols", "<b>Units and scale (4):</b> units on data or headings; scale uses the space and shows the pattern; <b>no breaks in either axis</b>"]) + EX +
    h4("Choosing the graph") +
    tbl(["If the IV is…", "Use", "Example"], [["Qualitative (categories)", "<b>Bar graph</b> (never a line or scatterplot)", "Surface type"], ["Quantitative (numbers)", "<b>Scatterplot / line graph</b>, ideally with a line of best fit", "Ramp angle, mass, height"]]) +
    SVG_BAR +
    h4("Checklist") + ul(["IV on the x-axis; DV on the y-axis", "Title says what is plotted: “Slide angle of a Lego block by ramp surface”", "Axis headings with units: “Mean slide angle (degrees)”", "Scale starts and ends sensibly; the data fill the page; no axis breaks (no “//” or skipped range)", "Legend (with a title) only if there are several symbols or series", "Optional: error bars, line of best fit with its equation"]) +
    h4("Mistakes graders see") + ul(["A line connecting categories (surfaces) as if they were numbers", "y-axis running only 36–40 because it ‘looks better’ (a break, and it exaggerates differences)", "No units; title says only “Graph 1”", "Axes swapped (DV on x)"]),
    { source: "Scoring Explanation, Division B (section H)" });

  add("sec_i", L2, "I · Statistics (14 pts)",
    "Summarise the data at each level of the IV with measures of central tendency (the typical value) and of variation (the spread). Always compute them within each level and show one example calculation for each.",
    rubric("14 points", ["<b>Central tendency (4):</b> at least three measures, computed <b>within each level</b>, not across levels (−2 if across levels, −1 per measure under three)", "<b>Example calculations (4):</b> at least one worked calculation with units for every statistic (−1 each missing)", "<b>Variation (4):</b> at least three measures within each level (the form has two slots, and Statistics #3 and #4 are State/Nationals only)", "<b>Accuracy (2):</b> every calculation correct (one error = 1 pt; two = 0)"]) +
    tbl(["Statistic", "Type", "How to compute", "Use it to say…"], [
      ["Mean", "Central tendency", "Add the trials ÷ number of trials", "Typical value (sensitive to outliers)"],
      ["Median", "Central tendency", "Sort low → high, take the middle (average the two middle values for even n)", "Typical value that ignores outliers"],
      ["Mode", "Central tendency", "Most common value (round to a stated precision first)", "Most frequent result"],
      ["Line of best fit", "Central tendency / trend", "Regression line y = mx + b (needs a numeric IV)", "Direction and rate of change (slope)"],
      ["Percent error", "Central tendency / accuracy", "|experimental − expected| ÷ expected × 100%", "How close to a known value"],
      ["Standard deviation", "Variation", "√[Σ(x − mean)² ÷ (n − 1)]", "How tightly values cluster around the mean"],
      ["IQR", "Variation", "Q3 − Q1 (spread of the middle 50%)", "Spread that ignores outliers"],
      ["Range", "Variation", "max − min (state both values)", "Total spread; very sensitive to outliers"],
      ["Frequency table / histogram", "Variation", "Count values in bins; describe the shape (skewed, roughly normal, uniform)", "Shape of the distribution"]]) +
    h4("Worked example: cardboard trials 26, 27, 25, 28, 35 (°)") +
    "<div class='sh-code'>Mean   = (26 + 27 + 25 + 28 + 35) ÷ 5 = 141 ÷ 5 = 28.2 °\nMedian = sorted 25, 26, 27, 28, 35 → middle value = 27 °\nRange  = 35 − 25 = 10 °   (min 25 °, max 35 °)\nQ1 = 26 °, Q3 = 28 °  →  IQR = 28 − 26 = 2 °\nSD     = √[(−2.2² + −1.2² + −3.2² + −0.2² + 6.8²) ÷ 4]\n       = √[(4.84 + 1.44 + 10.24 + 0.04 + 46.24) ÷ 4] = √15.7 = 3.96 °</div>" +
    "<p>Notice that mean (28.2) is pulled above median (27) by the 35 ° outlier. That is exactly the kind of contrast the CER section wants you to describe.</p>" +
    h4("Mistakes") + ul(["One mean across all levels (it must be per level; the line of best fit is the one exception because it uses the levels together)", "Statistics with no worked example", "Using population SD (÷ n) one time and sample SD (÷ n − 1) another; pick one and say which. The Science Olympiad sample sheet uses ÷ (n − 1).", "Units missing in the calculation"]) +
    "<p class='sh-muted'>Use the calculator on the Tools page to check your arithmetic, but still write the sample calculation by hand in your report.</p>",
    { source: "Scoring Explanation, Division B (section I); CER guide (sample statistics)" });

  add("sec_j", L2, "J · Possible experimental errors (8 pts)",
    "Name two <b>specific</b> errors from your own experiment, classify each as random, procedural or systematic, and say what each did to the data and to the trend.",
    rubric("8 points = 2 errors × 4", ["For each specific error: <b>identified</b>", "<b>Categorised</b> by type (circle one on the form)", "<b>Effect on the resulting data</b>", "<b>Effect on the data trend</b>", "One point lost per missing part"]) +
    tbl(["Type", "Definition (scoring guide)", "Pattern in data", "Example"], [
      ["Random", "Error from the limited precision of the instruments; can be higher or lower than the true value", "Scatter up and down", "Protractor read to the nearest 1°"],
      ["Procedural (procedure)", "A known mistake by the experimenter, or a faulty/poor procedure", "Often affects some trials, or one level", "Block was nudged on some trials; tape lifted on cardboard"],
      ["Systematic", "Faulty equipment; usually consistently higher or lower than the correct value", "Same direction every time", "Protractor’s 0° mark is off by 2°, so every angle reads 2° high"]]) + EX +
    h4("How to fill it") +
    ol(["Look at your qualitative notes and your outliers for real problems.", "Write the error as <b>one specific event</b>, not a category.", "Circle its type.", "Say the <b>effect on the numbers</b> (which trials, higher or lower, by roughly how much).", "Say the <b>effect on the trend</b> (did it exaggerate, hide or not change the pattern?)."]) +
    gb(["<b>Error:</b> on cardboard, the tape holding the cover loosened during trial 5, so the block slid earlier or later than the other trials. <b>Type:</b> procedural. <b>Effect on data:</b> produced the 35° outlier (others 25–28°) and raised the cardboard mean from about 26.5° to 28.2°. <b>Effect on trend:</b> cardboard still lies between paper and sandpaper, so the trend of larger angles for rougher surfaces is unchanged, but the gap to sandpaper looks smaller.",
        "<b>Error:</b> the protractor was read to the nearest 1°. <b>Type:</b> random. <b>Effect on data:</b> each angle could be 1° too high or low, causing the ±1° scatter within each level. <b>Effect on trend:</b> small compared with the 3° to 20° differences between levels, so the trend is not affected."],
      [["Human error", "Generic, not a specific event; no type."], ["We might have measured wrong.", "No specific error, no effect described."], ["The equipment was bad.", "Which equipment? How did it change the data?"], ["Procedural error: we ran out of time.", "Does not say its effect on data or trend."]]),
    { source: "Scoring Explanation, Division B (errors section); 2025–26 report form" });

  add("sec_k", L2, "K · Claim / Evidence / Reasoning analysis (18 pts)",
    "CER is a three-part way to argue from data. You write it for three topics (variation, outliers, data trend), and State/Nationals add a variation CER. Each CER is worth 6 points: 2 for the claim, 2 for the evidence and 2 for the reasoning.",
    rubric("18 points = 3 CERs × 6", ["<b>Variation:</b> claim about variation (not the trend), evidence from variation statistics, reasoning that links them", "<b>Outliers:</b> claim naming the outliers, evidence from a <b>quantitative rule</b> (1.5 × IQR outside Q1 to Q3), reasoning", "<b>Data trend:</b> claim about the effect the IV has on the DV, evidence from means, medians or the slope of the best-fit line, reasoning", "Each part: if one of the required elements is missing = 1 pt; both missing = 0"]) +
    h4("What each part is") +
    tbl(["Part", "It is…", "It is not…", "Starter"], [
      ["<b>Claim</b>", "A statement of what you understand from the data", "A number, a procedure, or “the data are good”", "“The …”"],
      ["<b>Evidence</b>", "Specific data (qualitative or quantitative) that support the claim, and only that", "A general feeling; extra numbers that do not matter", "“This is supported by … (value) …”"],
      ["<b>Reasoning</b>", "The logic connecting evidence to claim, ideally using the science or the controls", "Repeating the evidence", "“Since …, this shows … because …”"]]) +
    h4("Variation CER (using the sample from the CER guide)") +
    "<div class='hx-callout'><b>Claim:</b> The flight times were least consistent when two paperclips were added.<br><b>Evidence:</b> That level has the highest standard deviation (1.14 sec) and the greatest range (3.08 sec) of all levels.<br><b>Reasoning:</b> Since these flights varied the most, there was probably at least one uncontrolled variable that affected the two-paperclip planes most; the values ran from 3.25 to 6.33 sec, nearly a two-times difference.</div>" +
    h4("Outlier CER") +
    "<div class='hx-callout'><b>Claim:</b> There were four outliers: one in the standard of comparison, two in level 2 and one in level 3.<br><b>Evidence:</b> Using the common rule (a point more than 1.5 × IQR beyond Q1 or Q3), the fences for level 2 are 4.48 to 6.25 sec; the values 3.25 and 6.33 sec fall outside.<br><b>Reasoning:</b> With four outliers among 20 data points (two low and two high), the data show further evidence of high variability and uncontrolled variables in level 2, whereas level 1 has no outliers and appears better controlled.</div>" +
    h4("Data-trend CER") +
    "<div class='hx-callout'><b>Claim:</b> As the weight of the paper airplane increases, the average flight time increases.<br><b>Evidence:</b> Both mean and median rise with each added paperclip, and the slope of the line of best fit is positive.<br><b>Reasoning:</b> This mirrors the hypothesis, and because mean, median and slope all show a positive relationship, a dependent relationship between the variables is supported.</div>" +
    h4("Same thing in the running example") +
    "<div class='hx-callout'><b>Trend claim:</b> Rougher ramp surfaces produced larger slide angles.<br><b>Evidence:</b> Mean angles were 18.4° (bare), 21.4° (paper), 28.2° (cardboard) and 39.0° (sandpaper); the medians rise in the same order (18, 21, 27, 39°).<br><b>Reasoning:</b> A larger tilt is needed for gravity’s pull down the ramp to beat greater friction, so the increasing angles are consistent with a larger coefficient of static friction on rougher surfaces, as the hypothesis predicted.</div>" +
    h4("How to get all 6 points every time") +
    ul(["<b>Use your own numbers</b> in the evidence, with units and the level they belong to.", "Reasoning has to say <b>why</b> the evidence means the claim (a ‘because’ or ‘since’), not repeat it.", "Keep each CER on its topic: a variation claim is not a trend claim.", "For outliers, <b>show the rule</b> (Q1, Q3, IQR, fences), not just ‘this looks odd’.", "Do not add evidence that does not support the claim."]) +
    "<p>Practise on the Tools page: the statistics calculator gives you Q1, Q3, fences and outliers instantly.</p>",
    { source: "Using the Claim/Evidence/Reasoning in Scientific Communications (CER guide); Scoring Explanation, Division B" });

  add("sec_l", L2, "L · Conclusion (8 pts)",
    "Restate your hypothesis exactly, say whether the data support it, and defend that with evidence and reasoning.",
    rubric("8 points = 4 parts × 2", ["<b>Hypothesis restated (2):</b> unchanged (a changed hypothesis earns 1)", "<b>Claim (2):</b> says whether the data <b>support or do not support</b> the hypothesis. A hypothesis is never proven, never ‘right’ or ‘wrong’", "<b>Evidence (2):</b> data from the experiment relevant to the hypothesis", "<b>Reasoning (2):</b> ties the evidence to the claim"]) + EX +
    h4("How to fill it") +
    ol(["Copy your hypothesis word for word.", "Write the claim: “The data <b>support / do not support</b> the hypothesis.”", "Give the evidence: the means or trend, with numbers.", "Give the reasoning: why those numbers mean support (or not), using the same science as your ‘because’, and acknowledge errors if they matter."]) +
    gb(["<b>Hypothesis:</b> If the ramp is covered with a rougher surface, the angle at which the block begins to slide will be larger, because a rougher surface has a larger coefficient of static friction.<br><b>Claim:</b> The data support the hypothesis.<br><b>Evidence:</b> Mean slide angle rose from 18.4° (bare) to 21.4°, 28.2° and 39.0° (paper, cardboard, sandpaper).<br><b>Reasoning:</b> Because each rougher surface needed a larger tilt before the block moved, the results fit the idea that greater friction needs more tilt for gravity to overcome it. The one outlier (35° on cardboard) came from loose tape and does not change the order."],
      [["My hypothesis was proven right.", "Hypotheses are supported or not, never proven or right or wrong."], ["The hypothesis changed to ‘rough surfaces matter’.", "Hypothesis reworded, not restated."], ["It worked and sandpaper had the most friction.", "No numbers; no reasoning."], ["I was wrong because the results did not match.", "‘Wrong’ language; no evidence or reasoning."]]) +
    "<p>If the data <b>do not</b> support the hypothesis, say so plainly. Credit goes to the quality of the argument, not to the outcome.</p>",
    { source: "Scoring Explanation, Division B (conclusion section)" });

  add("sec_m", L2, "M · Improvements, applications & further use (9 pts)",
    "Three specific improvements to <i>this</i> experiment, three practical applications, and three future experiments: 3 × 3 points.",
    rubric("9 points = 3 lists × 3", ["<b>Improvements (3):</b> at least three suggestions for this experiment; may address your errors. ‘Better equipment’ or ‘more time’ alone do not earn credit", "<b>Practical applications (3):</b> at least three real uses of what you learned", "<b>Future experiments (3):</b> at least three new experiments (new IVs, DVs or conditions)", "One point per suggestion; fewer than three earns proportionally less"]) + EX +
    tbl(["List", "Strong examples", "Weak examples"], [
      ["Improvements", "Fix the covers to the ramp with tape on all four sides so they cannot lift; mount the protractor on the ramp instead of holding it; use a motorised or marked lift so the tilt rate is the same each trial; run 10 trials per level to measure variation better.", "Use better equipment. Have more time. Be more careful."],
      ["Practical applications", "Choosing non-slip stair or ramp coverings; deciding tyre tread and shoe-sole materials; setting safe slopes for conveyor belts and loading ramps.", "Friction is useful. It could be used in labs."],
      ["Future experiments", "Does the block’s mass change the slide angle? Does a wet or oiled surface change it? How does the contact area change static vs kinetic friction? Does the slide angle for a car differ from that of a Lego block?", "Do it again. Try other stuff."]]) +
    h4("How to fill it") + ol(["Reread your errors in J: turn each into an improvement.", "Tie each application to the variable you studied (surfaces → footwear, floors, ramps).", "Make each future experiment a new IV, a new DV or a new condition that follows from your results."]),
    { source: "Scoring Explanation, Division B (section M)" });

  /* ======================= LEVEL 3: designing ======================= */
  add("d_question", L3, "From prompt to question: choosing the IV and DV",
    "Before you write anything, spend three minutes turning the prompt into a question that you can answer with the table in front of you.",
    h4("Step by step") +
    ol(["<b>Underline the constraints:</b> the topic, the materials, which measuring tools are allowed in the experiment, the time, and any twists (“no stopwatches, analyze data relatively”).", "<b>List what you can change</b> using only the materials (brainstorm 4 to 6 IV ideas).", "<b>List what you can measure</b> with the allowed tools (3 or 4 DV ideas).", "<b>Filter each IV/DV pair</b> with the test below.", "<b>Pick the safest pair</b>, not the cleverest: simple, measurable, repeatable.", "<b>Write A, B and C</b> immediately while it is fresh."]) +
    h4("The six-question filter") +
    tbl(["Test", "Pass if…"], [
      ["One variable?", "Changing it does not accidentally change a second variable (confounding)."],
      ["Three levels?", "You can make at least three clearly different levels, plus an SOC."],
      ["Measurable?", "The DV is a number from a tool you have, with a unit and a precision."],
      ["On topic?", "It tests the prompt’s subject (e.g., friction)."],
      ["Fits the time?", "levels × trials × seconds per trial fits in the experimenting time (use the budget calculator on the next page)."],
      ["Controllable?", "You can name two things to hold constant and say how."]]) +
    h4("Confounding: the quiet killer") +
    "<p>You want to test <i>surface</i> but the sandpaper is also thicker, so the ramp is steeper where it is taped. Now angle and surface are both changing. Fix it by giving every surface the same backing, using the same tape, and measuring the angle of the base ramp (not the covering). When two things change at once, the grader will call it a second IV and you cannot say which caused the effect.</p>" +
    h4("Quantitative vs qualitative IV") +
    ul(["<b>Quantitative IV</b> (angle, mass, height): easy to space levels, allows a line of best fit and a slope in your CER. Preferred when you can.", "<b>Qualitative IV</b> (material): fine, but graph with bars and the trend CER talks about the ordering of categories.", "If you must use a qualitative IV, put the levels in a meaningful order (smooth → rough)."]),
    { source: "Scoring Explanation, Division B; sample prompts (Purdue 2025, BullSO 2025)" });

  add("d_levels", L3, "Levels, trials and changing the variable",
    "How many levels, how many trials, and how to change the IV without disturbing everything else.",
    h4("How many levels?") +
    ul(["<b>At least 3</b> (the scoring guide gives credit per level, up to three). Add an <b>SOC</b> (baseline) as an extra condition.", "Make the levels <b>evenly spaced</b> if numeric (10°, 20°, 30°) and <b>far enough apart</b> to show an effect bigger than your ±precision.", "Stay within a safe, measurable range: a ramp that is nearly flat or vertical gives useless data."]) +
    h4("How many trials?") +
    tbl(["Trials per level", "What you can do", "Verdict"], [
      ["1", "Nothing: no mean, no variation, no outlier test", "Loses repeated-trials points"],
      ["2", "A mean, but IQR/median meaningless", "Too few"],
      ["3", "Mean, median, range (IQR is crude)", "Bare minimum"],
      ["<b>5</b>", "Mean, median, mode, range, IQR, SD, outlier fences (the CER guide’s sample uses 5)", "<b>Sweet spot</b>"],
      ["8–10", "Better estimate of variation", "Only if time allows"]]) +
    "<p>Rule of thumb: <b>5 trials × (3 levels + SOC) = 20 trials</b>. If a trial takes about 40 seconds including reset, that is roughly 13 minutes. Use the budget calculator below to check your plan.</p>" +
    h4("Changing the variable the right way") +
    ol(["<b>Change only the IV</b> between levels. Everything else (block, start mark, lifting speed, observer) stays identical.", "<b>Change one level at a time</b> and fully reset (re-level the ramp, wipe the surface, put the block back on the dot).", "<b>Rotate or randomise the order</b> (SOC, A, B, C, SOC, A, B, C…) instead of finishing level A before B. If the block wears out or the team gets faster, every level shares the effect.", "<b>Keep the same person</b> doing the same job each trial (lifter, reader, recorder).", "<b>Record immediately</b>; do not rely on memory.", "<b>Do not throw out outliers</b>; record them, note a likely cause, and handle them in the CER."]) +
    h4("Repeated trials are not different levels") +
    "<p>The scoring guide gives credit for repeats <i>within</i> a level. Testing 3 surfaces once each is 3 levels with 1 trial. Testing each surface 5 times is repeated trials. Write the count in your procedure.</p>" +
    h4("Pilot first") +
    "<p>Do 1 or 2 practice trials (not recorded) to check the set-up works, the units are right, the tape holds and the DV can be read. Mention anything you changed in the procedure observations (F).</p>",
    { widget: "edbudget", source: "Scoring Explanation, Division B (sections C, E); CER guide sample (5 trials)" });

  add("d_procedure", L3, "Writing a procedure that earns every point",
    "Turn your plan into a numbered list a stranger can follow. Use one action per step, include numbers and units, and include everything you do.",
    h4("Rules for each step") +
    ul(["Begin with a verb: <i>Place, Lift, Read, Record, Repeat.</i>", "Give <b>quantity, units and tool</b>: “5 cm below the top edge”, “to the nearest 1°”.", "One action per line.", "Say <b>who</b> if roles matter (reader, lifter, recorder).", "Refer to diagrams (“see Figure 1”).", "State the <b>number of trials</b> and the <b>order of levels</b>.", "Say what <b>data you record</b> (quantitative and qualitative) and where.", "Describe how the <b>SOC</b> was set and measured."]) +
    tbl(["Weak step", "Strong step"], [
      ["Test each surface.", "Tape printer paper flat to the ramp with 4 strips of Scotch tape. Run 5 trials (steps 5 to 7)."],
      ["Lift the ramp and see when it slides.", "One student lifts the high end of the ramp slowly and steadily, about 1° every 2 s, until the block first moves."],
      ["Measure the angle.", "A second student reads the protractor, held flat against the ramp side at eye level, to the nearest 1° and states the value aloud."],
      ["Do it again.", "Return the ramp flat, reset the block on the pencil dot, and repeat steps 5 and 6 until 5 trials are recorded."],
      ["Write down what happens.", "Record the angle in Table 1 and note anything unusual (block turning, tape lifting) in the observations table."]]) +
    h4("A template you can adapt in 2 minutes") +
    ol(["Set up [equipment] as shown in Figure 1.", "Check/calibrate [instrument] by [method].", "Measure the standard of comparison: [action], [measure DV with tool to precision]. Record. Repeat until [n] trials.", "Change the IV to Level 1 by [exact action]. Keep [CV 1], [CV 2] the same.", "Run [n] trials: [start in the same way], [measure DV], [record].", "Repeat for Level 2 and Level 3, rotating the order as stated: [order].", "After each trial, note qualitative observations.", "Clean up; check that every level has n recorded trials."]) +
    h4("Checklist before you move on") +
    ul(["Numbered, one step per line", "Every step could be done by a stranger", "‘Repeat… until n trials’ appears for each level", "Two diagrams referenced", "States how the DV is measured, to what precision, with which tool", "States what was recorded, including the SOC"]),
    { source: "Scoring Explanation, Division B (section E)" });

  add("d_measure", L3, "Measuring well when tools are limited",
    "Many prompts take away your usual instruments. Good designs measure what they can with the allowed tools and make comparisons relative to a baseline.",
    h4("Read the tool rules in the prompt") +
    ul(["The Purdue prompt lets teams bring a ruler, timer and calculator for <b>write-up purposes only</b>. They <b>cannot be materials in the experiment</b>. So the experiment itself has to use the materials provided (protractors, balance, pencils, paper clips, Lego, books…).", "The BullSO prompt says <b>“no stopwatches, so analyze any data relatively”</b> and lists rulers as a material. So time is out; distances and angles are in.", "If a rule is unclear, ask the event supervisor before you start."]) +
    h4("Ways to measure with what you have") +
    tbl(["You need to measure…", "Do this", "Note"], [
      ["An angle", "Protractor against the ramp or against a plumb line", "Read at eye level to the nearest 1°"],
      ["A distance without a ruler", "Use a marked reference object (pencil lengths, paper-clip lengths, Lego lengths) and report in that unit", "Define the unit in the DV. Write the conversion in the write-up if allowed"],
      ["Mass", "Balance, or count identical items (Lego blocks)", "Say which"],
      ["Speed or time without a timer", "Replace with distance or ‘which finishes first’, or compare relative to the SOC", "Use percent of the SOC: (level ÷ SOC) × 100"],
      ["Static friction", "Tilt until the object just moves; the angle θ gives μ = tan θ", "Only needs a protractor"],
      ["Kinetic friction", "Roll or slide from a marked start and measure how far it travels", "Same start every trial"]]) +
    h4("Operational definitions") +
    "<p>Write the DV so that another team gets the same number. “Distance” is not enough: <b>from where, to where, in what unit, to what precision, at what moment</b>.</p>" +
    h4("Reducing random error") +
    ul(["Read the scale at eye level (avoid parallax).", "Use the same person and method every trial.", "Measure to a stated precision and keep that precision for the whole experiment.", "Take enough trials that the mean smooths out random error."]) +
    h4("Relative analysis (when absolute units are impossible)") +
    "<div class='sh-code'>Relative change = (level mean − SOC mean) ÷ SOC mean × 100 %\nRelative value = level mean ÷ SOC mean</div>" +
    "<p>Example: sandpaper 39.0° vs bare cover 18.4° → (39.0 − 18.4) ÷ 18.4 = <b>+112 %</b>. This also works for ranks (“slowest to fastest”) if the prompt prevents numbers.</p>",
    { source: "Purdue 2025 prompt; BullSO 2025 prompt; Scoring Explanation, Division B" });

  add("d_prompts", L3, "Worked prompts: two designs from real sample prompts",
    "Two sample prompts, each analysed the same way: constraints, candidate variables, a recommended design, and the trial plan. These are example designs for practice, not official answers.",
    h4("Prompt 1 · Purdue Invitational 2025 (Division B): friction") +
    "<div class='hx-callout'>Topic: friction, a phenomenon that opposes motion. <b>Materials:</b> 3 toy cars, Lego blocks, printer paper, construction paper, cardboard, sandpaper, duct tape, protractors, books/textbooks, Scotch tape, pencils, paper clips, a balance. One linear measuring device, one timer and one calculator are allowed for <b>write-up only</b> (not as experiment materials).</div>" +
    h4("Constraints and ideas") +
    ul(["No ruler or timer <i>in</i> the experiment: lean on the <b>protractor</b> and the <b>balance</b>.", "Candidate IVs: surface covering (paper, construction paper, cardboard, sandpaper), mass added (Lego blocks, paper clips), ramp angle (protractor), tape on wheels.", "Candidate DVs: <b>slide angle</b> (protractor), mass needed to start motion (balance + paper clips), distance in pencil-lengths."]) +
    tbl(["Design", "IV (levels)", "DV", "Verdict"], [
      ["<b>1 (recommended)</b>", "Ramp surface: printer paper, cardboard, sandpaper (SOC: bare textbook cover)", "Angle in ° at which a Lego block starts to slide (protractor)", "Simple, one tool, clear operational definition, qualitative IV → bar graph"],
      ["2", "Number of Lego blocks stacked on the car (1, 2, 3 blocks; SOC: car alone)", "Distance rolled after a ramp, in paper-clip lengths", "Quantitative IV and slope, but the unit needs careful definition"],
      ["3", "Ramp angle: 10°, 20°, 30°", "Distance rolled by a toy car", "Good, tests gravity more than friction unless the surface is also named"],
      ["✗", "Surface and angle together", "Time to roll", "Two IVs; no timer"]]) +
    h4("Trial plan for Design 1") +
    ul(["3 levels + SOC = 4 conditions × 5 trials = 20 trials, about 40 s each → about 13–14 minutes of testing plus 5 minutes of set-up (fits in Part 1 plus a little of Part 2).", "<b>CV 1:</b> same Lego block, same orientation. <b>CV 2:</b> same start mark and same lifting speed. <b>Constant:</b> gravity.", "Order: SOC, paper, cardboard, sandpaper, then repeat the cycle five times.", "Graph: bar graph of means; statistics per surface; slope is not available because the IV is qualitative."]) +
    h4("Prompt 2 · BullSO 2025 (Division B): friction and kinetics") +
    "<div class='hx-callout'>Topic: design and conduct an experiment on friction and kinetics. You may consider the effect of friction on velocity or acceleration, and static or kinetic friction. <b>No stopwatches: analyse any data relatively.</b> <b>Materials:</b> marbles, surface, standard paper, satin paper, rulers.</div>" +
    h4("Constraints and ideas") +
    ul(["Only two paper types, so a qualitative IV with the bare surface as a third level: <b>bare surface, standard paper, satin paper</b>.", "No timing: use <b>distance rolled</b> as the DV (a marble that loses speed faster rolls a shorter distance).", "Rulers are provided: use them to set ramp height and measure distance in cm.", "‘Analyse relatively’: compare each level’s mean to the bare surface (percent of SOC)."]) +
    tbl(["Design", "IV (levels)", "DV", "Verdict"], [
      ["<b>1 (recommended)</b>", "Surface the marble rolls across: bare surface (SOC), standard paper, satin paper", "Distance rolled in cm after leaving the ramp (ruler)", "Meets 3 levels using the bare surface; quantitative DV; no timer needed"],
      ["2", "Release height of the marble on a ramp: 5, 10, 15 cm", "Distance rolled on standard paper", "Quantitative IV: line of best fit and slope for the trend CER"],
      ["✗", "Paper type only (2 levels)", "Speed", "Too few levels; no timer"]]) +
    h4("Trial plan for Design 1") +
    ul(["Use one marble, one ramp (a ruler groove or folded paper channel held against a fixed support at the same height each time), and one release mark.", "4 trials is the minimum and 5 is better: 3 levels × 5 = 15 trials; spend the saved time on a quick pilot.", "<b>CV:</b> same marble; same release height and angle; same push (none, just release). <b>Constant:</b> gravity.", "Report <b>relative distance</b>: (mean on paper ÷ mean on bare surface) × 100%."]) +
    h4("What to do after designing") + ul(["Write A, B, C using the frames in section A to C.", "Draw two diagrams.", "Make the data tables in advance (blank rows for every level and trial).", "Run a pilot trial before you commit."]),
    { source: "Prompt_ExDes_Purdue2025_B; BullSO25 Experimental Design_B Prompt" });

  /* ======================= LEVEL 4: tools ======================= */
  add("t_stats", L4, "Statistics & outlier calculator",
    "Paste the trials for each level. You get mean, median, mode, range, IQR, standard deviation, outlier fences and the best-fit slope, plus a sample calculation you can copy into your report.",
    "<p class='sh-muted'>The pre-filled data come from the Science Olympiad CER guide, so you can check the tool against the published statistics (for example SOC mean 3.43, SD 0.96; two paperclips SD 1.14 with outliers 3.25 and 6.33). The guide rounds a couple of values slightly differently (its 2-paperclip median is printed as 5.29; the exact median is 5.28).</p>",
    { widget: "edstats" });
  add("t_score", L4, "Self-score your report (checklist)",
    "Go through the scoring guide line by line and tick what your report really has. The page estimates your score out of 132 and shows the sections where you lost the most.",
    "<p>Use it on a practice report, then fix the biggest gaps first. Credit for partial answers is estimated; the official scoring guide and your event supervisor decide the real score.</p>",
    { widget: "edscore" });

  /* ======================= QUESTIONS ======================= */
  var Q = [];
  function mc(n, concept, stem, opts, ci, expl) {
    Q.push({ id: "ed" + n, exam: "Practice · Experimental design", set: "ed", num: n, pts: null, topic: "", typ: "Multiple Choice", stem: stem, options: opts, correct: [ci], explanation: expl, sample: "", img: null, appears: ["Practice · Experimental design #" + n], concept: concept });
  }
  mc(1, "sec_a", "Which is the best statement of the problem for an experiment with a toy car, a ramp and different surfaces?",
    ["Does friction affect how far a car rolls?", "How does the surface covering a ramp (paper, cardboard, sandpaper) affect the distance a toy car rolls after leaving the ramp?", "Friction and toy cars", "How do cars work?"], 1, "It is a how-question (not yes/no), names the IV (surface covering) and DV (distance), defines the topic and can be tested with the materials.");
  mc(2, "sec_a", "Why does “Does sandpaper have more friction than paper?” lose a point on the problem statement?",
    ["It is too long", "It is a yes/no question and does not name a measurable DV", "It uses the word friction", "Sandpaper is not allowed"], 1, "The guide requires that the problem is NOT a yes/no question and that both variables are identified.");
  mc(3, "sec_b", "Which hypothesis earns full credit?",
    ["Sandpaper will be different from paper.", "Rough surfaces have more friction.", "If the ramp surface is rougher, then the angle at which a block begins to slide will be larger, because rougher surfaces have a larger coefficient of static friction.", "The block will slide at 30°."], 2, "It names both variables, gives a specific direction and includes a relevant scientific rationale (the ‘because’).");
  mc(4, "sec_b", "A hypothesis says, “If the mass of a car increases, then its stopping distance will change, because friction depends on the force pressing the wheels down.” Which rubric element is MOST clearly missing?",
    ["Both variables", "A specific direction", "A units statement", "A diagram"], 1, "“Change” is open-ended. The guide requires a specific direction (increase or decrease). (A rationale is also missing, but the direction is the clearest flaw.)");
  mc(5, "sec_c", "A team changes the ramp surface AND the ramp angle in the same experiment. What is the main problem?",
    ["There is more than one independent variable", "The dependent variable is not measured", "They used too many trials", "The hypothesis cannot be restated"], 0, "The scoring guide requires exactly one IV. Two changing variables are confounded and you cannot tell which caused the effect.");
  mc(6, "sec_c", "Which dependent variable is operationally defined?",
    ["How well the block slides", "Friction", "The angle in degrees, read to the nearest 1° from a protractor, at the moment the block first moves", "Speed"], 2, "An operational definition says what is measured, with which tool, in which units, to what precision, and when.");
  mc(7, "sec_c", "In a friction experiment, “using the same Lego block for every trial” is best classified as…",
    ["The independent variable", "A controlled variable", "A constant", "The dependent variable"], 1, "It is something you could vary in another experiment (use different blocks) but hold fixed here, so it is a controlled variable. A constant could not be varied (e.g., gravity).");
  mc(8, "sec_c", "Which is a constant in a ramp experiment done in one classroom?",
    ["The ramp surface", "The angle of the ramp", "Acceleration due to gravity", "The type of block"], 2, "Gravity cannot be an IV in this setting, so it is a constant. The others could be IVs in other experiments.");
  mc(9, "sec_c", "What is the minimum number of levels of the IV to earn full credit?",
    ["1", "2", "3", "5"], 2, "At least three relevant levels are required (partial credit for fewer).");
  mc(10, "sec_d", "Which materials list earns full credit?",
    ["Cars, Lego, paper, cardboard, sandpaper, tape, books, protractor (copied from the prompt list)", "1 Lego block, 1 textbook, 1 sheet each of printer paper, cardboard and sandpaper, 12 strips of Scotch tape, 1 protractor, 1 pencil", "Some books and some paper", "Ruler, timer, calculator, Lego block"], 1, "It is quantified by the amount used, separate from the procedure, with no unused items and no write-up-only tools.");
  mc(11, "sec_d", "The prompt says a ruler is allowed “for write-up purposes only.” Should it appear in the materials list?",
    ["Yes, always list every tool", "No: it was not a material used in the experiment", "Yes, but only if you used it twice", "Only for State/Nationals"], 1, "Items that are not used in the experiment (or are allowed only for the write-up) should not be listed.");
  mc(12, "sec_e", "Which procedure shows repeated trials correctly?",
    ["Slide the block once on paper, once on cardboard and once on sandpaper.", "For each surface, run 5 trials; repeat steps 5 to 7 until 5 trials are recorded for that surface.", "Do the experiment three times.", "Test each surface and record the angle."], 1, "The guide wants repeated trials within the same level of the IV, stated in the procedure.");
  mc(13, "sec_e", "How many relevant, labeled diagrams are needed for full credit on the diagram item?",
    ["0", "1", "2 or more", "5"], 2, "At least two relevant diagrams earn the full 2 points; one earns 1.");
  mc(14, "sec_e", "Which step is best written?",
    ["Test the surface.", "Place the Lego block, long side across the ramp, with its back edge on the pencil dot 5 cm from the high edge.", "Do it again.", "Measure the angle."], 1, "It has a verb, a position, a measurement and units; another person could follow it exactly.");
  mc(15, "sec_f", "Which is a qualitative observation about the procedure?",
    ["The mean angle was 28.2°.", "The cardboard value of 35° is an outlier.", "The tape lifted on cardboard during trial 5, so we added two strips.", "n = 5"], 2, "Qualitative = words describing what worked, what did not and what was modified. The others are numbers.");
  mc(16, "sec_g", "What must the condensed data table include for each derived value such as a mean?",
    ["A graph", "At least one example calculation", "Nothing extra", "A diagram"], 1, "The guide requires at least one example calculation for each derived variable.");
  mc(17, "sec_h", "The IV is “type of surface” (printer paper, cardboard, sandpaper). Which graph is best?",
    ["Line graph", "Scatterplot with best-fit line", "Bar graph", "Pie chart"], 2, "A qualitative IV should not use a line graph or scatterplot; use a bar graph.");
  mc(18, "sec_h", "The IV is ramp angle (10°, 20°, 30°) and the DV is distance rolled. Which graph is usually better?",
    ["Bar graph", "Scatterplot or line graph with a best-fit line", "Pie chart", "No graph is needed"], 1, "For a quantitative IV, a scatterplot or line graph is usually better than a bar graph.");
  mc(19, "sec_h", "Which axis should the dependent variable go on?",
    ["x-axis", "y-axis", "Either one", "Neither"], 1, "DV on y, IV on x. Swapping them loses a point.");
  mc(20, "sec_i", "Statistics should be calculated…",
    ["across all levels at once", "within each level of the IV", "only for the SOC", "only for the outliers"], 1, "The scoring guide says statistics summarise the data at one level of the IV, not among levels.");
  mc(21, "sec_i", "Which is a measure of variation?",
    ["Mean", "Median", "Interquartile range", "Mode"], 2, "IQR, range, standard deviation, frequency tables and histograms are measures of variation.");
  mc(22, "sec_i", "Cardboard trials: 25, 26, 27, 28, 35 (Q1 = 26, Q3 = 28). Using the 1.5 × IQR rule, is 35 an outlier?",
    ["No: the fences are 20 to 34", "Yes: the upper fence is 31", "Yes: the lower fence is 35", "Cannot be determined"], 1, "IQR = 2, so 1.5 × IQR = 3. Fences: 26 − 3 = 23 and 28 + 3 = 31. 35 > 31, so it is a high outlier.");
  mc(23, "sec_j", "A protractor’s zero mark is misaligned so every reading is 2° too high. This is…",
    ["Random error", "Procedural error", "Systematic error", "No error"], 2, "Faulty equipment that shifts every value the same way is a systematic error.");
  mc(24, "sec_j", "On some trials the block was nudged while being placed on the ramp. This is…",
    ["Random error", "Procedural error", "Systematic error", "A constant"], 1, "A known mistake of the experimenter or poor procedure is a procedural error.");
  mc(25, "sec_j", "Reading a protractor to the nearest degree causes values to scatter a little above and below the true angle. This is…",
    ["Random error", "Procedural error", "Systematic error", "A controlled variable"], 0, "Limited instrument precision with scatter in both directions is random error.");
  mc(26, "sec_k", "Which is the best EVIDENCE for the claim “The flights with two paperclips were the least consistent”?",
    ["The plane looked wobbly.", "That level had the highest standard deviation (1.14 sec) and the largest range (3.08 sec).", "Airplanes are hard to fly.", "The mean was 5.12 sec."], 1, "Evidence is specific data that support only this claim: here the variation statistics for that level.");
  mc(27, "sec_k", "In CER, the reasoning is…",
    ["a restatement of the data", "the logic that connects the evidence to the claim", "a list of materials", "the hypothesis"], 1, "Reasoning explains why the evidence supports the claim, often using science or the experiment’s controls.");
  mc(28, "sec_k", "Which quantitative rule is commonly used as evidence for outliers?",
    ["Values beyond 1.5 × IQR outside Q1 to Q3", "Values above the mean", "The largest value", "Any value not equal to the mode"], 0, "The CER guide uses 1.5 × IQR outside the Q1 to Q3 range, and says other defensible measures are allowed.");
  mc(29, "sec_l", "Which conclusion claim uses correct language?",
    ["The hypothesis was proven right.", "The data support the hypothesis.", "The hypothesis was wrong.", "The experiment failed."], 1, "Hypotheses cannot be proven correct or incorrect; evidence supports or does not support them.");
  mc(30, "sec_m", "Which improvement suggestion is most likely to earn credit?",
    ["Use better equipment.", "Have more time.", "Tape all four edges of each surface cover so it cannot lift, after tape loosening caused an outlier.", "Be more careful."], 2, "Specific and tied to an identified error. Generic ‘better equipment’ or ‘more time’ do not earn full credit.");
  mc(31, "d_levels", "Why rotate the order of levels (SOC, A, B, C, SOC, A, B, C…) rather than finishing all trials of one level first?",
    ["It uses fewer materials", "It spreads effects like fatigue, wear or warming up evenly across levels", "It removes the need for an SOC", "It is required to make a graph"], 1, "Rotating or randomising order stops any one level from always benefiting or suffering from drift in conditions.");
  mc(32, "d_levels", "Which plan gives you meaningful statistics for each level?",
    ["1 trial at each of 3 levels", "5 trials at each of 3 levels plus an SOC", "2 trials at each of 6 levels", "10 trials at only 1 level"], 1, "Statistics need several repeated trials per level, and the IV needs at least three levels.");
  mc(33, "d_measure", "The prompt allows a ruler and a timer for write-up only. Which dependent variable can you measure inside the experiment?",
    ["Time in seconds with the timer", "Distance in cm with the ruler", "Angle in degrees with a provided protractor", "Speed in m/s"], 2, "The protractor is a provided material, so the angle can be measured during the experiment. Write-up-only tools cannot be used in the experiment.");
  mc(34, "d_measure", "A prompt says “there are no stopwatches, so analyze any data relatively.” What is the best response?",
    ["Guess the times", "Measure distance and compare each level to the SOC (relative change or percent of SOC)", "Skip the DV", "Count seconds aloud for each trial"], 1, "Use a measurable DV (such as distance) and compare relative to a baseline.");
  mc(35, "sec_c", "Which is a correctly stated independent variable with levels?",
    ["Friction", "The surface and the ramp angle", "Ramp angle in degrees, set with a protractor: 10°, 20°, 30°", "How rough it is"], 2, "One IV, operationally defined with units and tool, and three relevant levels.");
  mc(36, "sec_e", "Which of these does NOT help a stranger repeat your experiment?",
    ["A labeled diagram", "A statement of how many trials", "An unstated assumption about where the block starts", "How the SOC was measured"], 2, "Unstated assumptions leave reasonable questions unanswered and lose points in the ‘repeatable’ section.");

  /* ======================= register ======================= */
  window.SUBJECTS = window.SUBJECTS || [];
  window.SUBJECTS.push({
    id: "expdesign",
    title: "Experimental Design (Science Olympiad Division B)",
    description: "A section-by-section guide to the report: how to fill each part, good and weak examples, scoring tips, how to design an experiment from a prompt, and tools for statistics, trials and self-scoring.",
    icon: "<svg viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"40\" height=\"40\" rx=\"12\" fill=\"#fff1e5\"/><path d=\"M16 8h8M18 8v9l-6.5 11.2A3 3 0 0 0 14.1 33h11.8a3 3 0 0 0 2.6-4.8L22 17V8\" fill=\"none\" stroke=\"#bc4c00\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M14.5 26h11\" stroke=\"#bc4c00\" stroke-width=\"2.4\" stroke-linecap=\"round\"/><circle cx=\"20\" cy=\"29.5\" r=\"1.6\" fill=\"#bc4c00\"/></svg>",
    concepts: C,
    questions: Q
  });
})();
