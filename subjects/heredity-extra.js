/* Heredity study aids: glossary, probability how-to, calculators, extra practice. Loaded after heredity.js */
(function () {
  "use strict";
  var LVL = "0 · Learning aids";

  /* ---------- helpers ---------- */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
  function frac(n, d) { if (n === 0) return "0"; var g = gcd(n, d); n /= g; d /= g; return d === 1 ? String(n) : n + "/" + d; }
  function h(tag, attrs, kids) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { if (k === "text") e.textContent = attrs[k]; else if (k === "html") e.innerHTML = attrs[k]; else e.setAttribute(k, attrs[k]); });
    (kids || []).forEach(function (c) { e.appendChild(c); });
    return e;
  }
  function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }

  /* ---------- glossary data: [term, category, plain-language meaning, memory tip] ---------- */
  var G = [
    ["Gene", "Basics", "A stretch of DNA that carries the instructions for one trait or protein.", "Gene = the recipe."],
    ["Allele", "Basics", "One version of a gene (e.g., tall T or short t).", "Alleles are the flavours of one recipe."],
    ["Locus", "Basics", "The physical address of a gene on a chromosome.", "Locus = location."],
    ["Genotype", "Basics", "The letters: which alleles an individual has (Aa).", "GENOtype = GENes (letters)."],
    ["Phenotype", "Basics", "What you can see or measure (tall, albino, type A blood).", "PHENOtype = pHysical appearance."],
    ["Dominant", "Basics", "An allele that shows up even with only one copy (A_).", "Capital letter. One copy is enough."],
    ["Recessive", "Basics", "An allele that only shows when there are two copies (aa).", "Lowercase. Hidden unless doubled."],
    ["Homozygous", "Basics", "Two identical alleles (AA or aa).", "HOMO = same."],
    ["Heterozygous", "Basics", "Two different alleles (Aa). Also called hybrid or carrier (if the trait is recessive).", "HETERO = different."],
    ["Carrier", "Basics", "A heterozygote who looks normal but can pass on a recessive allele.", "Carries it, doesn’t show it."],
    ["Wild type", "Basics", "The normal, most common allele or phenotype in nature.", "Often the dominant one, but not always."],
    ["True-breeding", "Basics", "Pure line: always produces the same phenotype (homozygous).", "Pure = homozygous."],
    ["Hemizygous", "Basics", "Having only one copy of a gene (males for X-linked genes).", "Half a pair."],

    ["Monohybrid cross", "Crosses", "A cross looking at ONE gene (Aa × Aa).", "Mono = one."],
    ["Dihybrid cross", "Crosses", "A cross looking at TWO genes (AaBb × AaBb). Classic ratio 9:3:3:1.", "Di = two."],
    ["Punnett square", "Crosses", "A grid that lines up every gamete from one parent against every gamete from the other.", "Gametes on the edges, babies inside."],
    ["Gamete", "Crosses", "A sperm or egg. Carries ONE allele of each gene (haploid).", "Gamete gets half."],
    ["P, F1, F2", "Crosses", "Parental generation, first filial (kids), second filial (grandkids).", "P → F1 → F2."],
    ["Test cross", "Crosses", "Cross an unknown dominant-phenotype individual with a homozygous recessive (aa) to reveal its genotype.", "1:1 → unknown was Aa; all dominant → AA."],
    ["Backcross", "Crosses", "Crossing offspring back to one of its parents.", "Back to the parent."],
    ["Reciprocal cross", "Crosses", "Same cross with the sexes of the phenotypes swapped. Differs only if X-linked or maternal.", "Switch mom and dad."],
    ["Law of Segregation", "Crosses", "The two alleles of a gene separate in meiosis, so each gamete gets one.", "Split apart."],
    ["Law of Independent Assortment", "Crosses", "Genes on different chromosomes are inherited independently, so you can multiply their probabilities.", "Different chromosomes = independent."],
    ["Product rule", "Crosses", "P(A and B) = P(A) × P(B) for independent events.", "AND → multiply."],
    ["Sum rule", "Crosses", "P(A or B) = P(A) + P(B) when they can’t both happen.", "OR → add."],

    ["Incomplete dominance", "Beyond Mendel", "Heterozygote is a blend (red × white → pink). Phenotype ratio = genotype ratio 1:2:1.", "Blend, three phenotypes."],
    ["Codominance", "Beyond Mendel", "Both alleles are fully shown at once (AB blood, roan coat).", "Both shout together."],
    ["Multiple alleles", "Beyond Mendel", "More than two alleles exist in the population (ABO: IA, IB, i) but each person has only two.", "Population many, individual two."],
    ["Epistasis", "Beyond Mendel", "One gene masks or changes the effect of a different gene (Labrador colour).", "Epi = on top of."],
    ["Pleiotropy", "Beyond Mendel", "One gene affects several traits.", "Plei = many effects."],
    ["Polygenic trait", "Beyond Mendel", "Many genes together shape one trait (height, skin colour); gives a bell curve.", "Poly = many genes."],
    ["Lethal allele", "Beyond Mendel", "An allele that kills when homozygous. Aa × Aa gives 2:1 among the living.", "The 1/4 never hatches."],
    ["Linked genes", "Beyond Mendel", "Genes close on the same chromosome that tend to be inherited together; break independent assortment.", "Neighbours travel together."],
    ["Recombination / crossing over", "Beyond Mendel", "Swapping of DNA between homologs in meiosis I; breaks up linked genes.", "Cross over = swap."],
    ["Sex-linked", "Beyond Mendel", "Gene on the X (or Y). X-linked recessive traits are more common in males.", "Males have one X, no backup."],
    ["Holandric", "Beyond Mendel", "Carried on the Y: father to ALL sons, never daughters.", "Y → sons only."],
    ["Penetrance", "Beyond Mendel", "% of people with the genotype who actually show the phenotype.", "Penetrates or not."],
    ["Expressivity", "Beyond Mendel", "How strongly a trait shows in those who have it.", "Expression strength."],
    ["Pedigree", "Beyond Mendel", "A family tree chart tracing a trait. Squares male, circles female, filled = affected.", "Square♂ circle♀."],
    ["Proband", "Beyond Mendel", "The person in the pedigree who brought the family to attention (arrow).", "The arrow person."],

    ["Chromosome", "Cells", "A long DNA molecule packaged with proteins. Humans have 46.", "Chromo = coloured body."],
    ["Homologous chromosomes", "Cells", "The matching pair, one from each parent, same genes, possibly different alleles.", "Same genes, different parents."],
    ["Sister chromatids", "Cells", "Two identical copies of a replicated chromosome, joined at the centromere.", "Identical twins."],
    ["Centromere", "Cells", "Pinched region that holds sister chromatids together.", "Centre glue."],
    ["Kinetochore", "Cells", "Protein patch on the centromere where spindle fibres attach.", "Spindle handle."],
    ["Diploid (2n) / Haploid (n)", "Cells", "Two sets vs one set of chromosomes. Gametes are haploid.", "Di = 2, hap = half."],
    ["Mitosis", "Cells", "Division making two identical diploid cells. PMAT: Prophase, Metaphase, Anaphase, Telophase.", "Growth and repair."],
    ["Meiosis", "Cells", "Two divisions making four different haploid gametes.", "Sex cells."],
    ["Cell cycle", "Cells", "G1 → S (copy DNA) → G2 → M (mitosis).", "G1, S, G2, M."],
    ["Nondisjunction", "Cells", "Chromosomes fail to separate, giving extra or missing chromosomes (Down: trisomy 21).", "Didn’t disjoin."],
    ["Aneuploidy", "Cells", "Wrong chromosome number (trisomy, monosomy).", "Not the right count."],
    ["Karyotype", "Cells", "A picture of all chromosomes lined up by size.", "Chromosome portrait."],
    ["Autosome", "Cells", "Any chromosome that isn’t a sex chromosome.", "Not X or Y."],

    ["Nucleotide", "DNA & protein", "Building block of DNA/RNA: sugar + phosphate + base.", "Sugar, phosphate, base."],
    ["Purine / Pyrimidine", "DNA & protein", "Purines (A, G) have two rings; pyrimidines (C, T, U) have one.", "PURe As Gold; CUT the Py."],
    ["Complementary base pairing", "DNA & protein", "A–T (2 H-bonds), G–C (3 H-bonds); in RNA A–U. Chargaff: %A = %T and %G = %C.", "If A = 32%, T = 32%, G = C = 18%."],
    ["5′ and 3′ ends", "DNA & protein", "Directions of a strand. DNA polymerase only adds to the 3′ end; strands run antiparallel.", "Build 5′ → 3′."],
    ["Replication", "DNA & protein", "Copying DNA before division; semi-conservative (each copy keeps one old strand).", "Half old, half new."],
    ["Helicase", "DNA & protein", "Unzips the double helix.", "Helicase = helps split."],
    ["Primase", "DNA & protein", "Lays down an RNA primer so polymerase can start.", "Primer maker."],
    ["DNA polymerase", "DNA & protein", "Adds DNA nucleotides to the 3′ end; proofreads.", "The builder."],
    ["Ligase", "DNA & protein", "Glues Okazaki fragments together.", "Ligase = ligature, join."],
    ["Okazaki fragments", "DNA & protein", "Short pieces made on the lagging strand.", "Lagging = fragments."],
    ["Leading / lagging strand", "DNA & protein", "Leading is built continuously; lagging in pieces.", "Leading is smooth."],
    ["Transcription", "DNA & protein", "DNA → mRNA, by RNA polymerase, in the nucleus. Stages: initiation, elongation, termination.", "TranscRiption = RNA, same language."],
    ["Translation", "DNA & protein", "mRNA → protein at the ribosome. TranslAtion = Amino acids.", "Language change."],
    ["Codon / anticodon", "DNA & protein", "3 mRNA bases that code one amino acid / matching 3 bases on tRNA.", "Codon on mRNA."],
    ["Start / stop codons", "DNA & protein", "AUG (Met) starts; UAA, UAG, UGA stop.", "AUG = go. U-A-A/G, U-G-A = stop."],
    ["mRNA, tRNA, rRNA", "DNA & protein", "Message, transfer (brings amino acids), ribosomal (builds the ribosome).", "Message, Taxi, Ribosome."],
    ["Wobble", "DNA & protein", "Third codon base pairs loosely, so several codons give the same amino acid.", "Degenerate code."],
    ["Central dogma", "DNA & protein", "DNA → RNA → protein. Exceptions: reverse transcriptase, telomerase.", "Information flow."],
    ["Mutation types", "DNA & protein", "Silent (same amino acid), missense (different), nonsense (stop), frameshift (insertion/deletion not a multiple of 3).", "Frameshift is the worst."],
    ["Chromatin", "DNA & protein", "DNA wrapped on histones (nucleosomes). Euchromatin: loose & active; heterochromatin: tight & silent.", "Euchromatin = easy to read."],

    ["Operon", "Regulation", "A cluster of genes controlled together, in prokaryotes.", "Prokaryote switch."],
    ["Promoter / operator", "Regulation", "Promoter: where RNA polymerase lands. Operator: where the repressor binds.", "Promoter = start, operator = on/off."],
    ["Inducible (lac)", "Regulation", "Normally OFF; turned ON by the substrate (lactose).", "Lactose present → ON."],
    ["Repressible (trp)", "Regulation", "Normally ON; turned OFF when the product (tryptophan) is plentiful.", "Enough product → OFF."],
    ["Repressor", "Regulation", "Protein that blocks transcription.", "Repress = stop."],

    ["Hardy–Weinberg", "Populations", "p² + 2pq + q² = 1 and p + q = 1 for a non-evolving population.", "p² AA, 2pq Aa, q² aa."],
    ["Allele frequency", "Populations", "How common an allele is in a population (p dominant, q recessive).", "p + q = 1."],
    ["Genetic drift", "Populations", "Random change in allele frequency, strongest in small populations.", "Chance."],
    ["Gene flow", "Populations", "Movement of alleles between populations.", "Migration."],
    ["Founder / bottleneck effect", "Populations", "Drift after a few individuals start a population / after a population crash.", "Few survivors."],

    ["PCR", "Techniques", "Amplifies DNA. Steps: denature 94 °C, anneal 50–65 °C, extend 72 °C with Taq. n cycles → 2ⁿ copies.", "Photocopier for DNA."],
    ["Gel electrophoresis", "Techniques", "Separates DNA by size; small fragments run farther toward + (DNA is negative).", "Small = fast."],
    ["Restriction enzyme", "Techniques", "Cuts DNA at a specific sequence.", "Molecular scissors."],
    ["Sanger sequencing", "Techniques", "Reads DNA using chain-terminating dideoxy nucleotides.", "Terminators stop the chain."],
    ["Recombinant DNA / plasmid", "Techniques", "Plasmid: small circular DNA used as a vector to carry a gene.", "Delivery truck."]
  ];

  /* ---------- Widgets ---------- */
  window.HWidgets = window.HWidgets || {};

  /* Glossary + flashcards */
  window.HWidgets.glossary = function (root) {
    var cats = ["All"]; G.forEach(function (g) { if (cats.indexOf(g[1]) < 0) cats.push(g[1]); });
    var st = { cat: "All", q: "", mode: "browse" };
    var bar = h("div", { class: "hx-bar" });
    var search = h("input", { type: "search", placeholder: "Search " + G.length + " terms…", "aria-label": "Search terms" });
    var sel = h("select", { "aria-label": "Category" });
    cats.forEach(function (c) { sel.appendChild(h("option", { value: c, text: c })); });
    var mBrowse = h("button", { class: "sh-btn on", text: "Browse", type: "button" });
    var mCards = h("button", { class: "sh-btn", text: "Flashcards", type: "button" });
    bar.appendChild(search); bar.appendChild(sel); bar.appendChild(mBrowse); bar.appendChild(mCards);
    var out = h("div", { class: "hx-gl" });
    root.appendChild(bar); root.appendChild(out);

    function filtered() {
      var q = st.q.toLowerCase();
      return G.filter(function (g) { return (st.cat === "All" || g[1] === st.cat) && (!q || (g[0] + " " + g[2]).toLowerCase().indexOf(q) >= 0); });
    }
    function browse() {
      out.innerHTML = "";
      var rows = filtered();
      if (!rows.length) { out.appendChild(h("p", { class: "sh-muted", text: "No terms match." })); return; }
      var lastCat = null;
      rows.forEach(function (g) {
        if (st.cat === "All" && g[1] !== lastCat) { out.appendChild(h("h4", { text: g[1], class: "hx-cat" })); lastCat = g[1]; }
        out.appendChild(h("div", { class: "hx-term", html: "<b>" + esc(g[0]) + "</b> " + esc(g[2]) + (g[3] ? "<div class='hx-tip'>💡 " + esc(g[3]) + "</div>" : "") }));
      });
    }
    var deck = [], idx = 0, known = 0, flipped = false;
    function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
    function cards(reset) {
      if (reset) { deck = shuffle(filtered()); idx = 0; known = 0; flipped = false; }
      out.innerHTML = "";
      if (!deck.length) { out.appendChild(h("p", { text: "No terms in this selection." })); return; }
      if (idx >= deck.length) {
        out.appendChild(h("div", { class: "hx-card" }, [h("div", { class: "hx-card-t", text: "Round done" }), h("p", { text: "You knew " + known + " of " + deck.length + "." })]));
        var again = h("button", { class: "sh-btn", type: "button", text: "Study again" }); again.onclick = function () { cards(true); }; out.appendChild(again);
        return;
      }
      var g = deck[idx];
      var card = h("div", { class: "hx-card", tabindex: "0" }, [
        h("div", { class: "hx-card-k", text: "Card " + (idx + 1) + " / " + deck.length + " · " + g[1] }),
        h("div", { class: "hx-card-t", text: g[0] }),
        h("div", { class: "hx-card-b", html: flipped ? esc(g[2]) + (g[3] ? "<div class='hx-tip'>💡 " + esc(g[3]) + "</div>" : "") : "<span class='sh-muted'>Say the definition out loud, then click to reveal.</span>" })
      ]);
      card.onclick = function () { flipped = true; cards(); };
      out.appendChild(card);
      var row = h("div", { class: "hx-row" });
      var bk = h("button", { class: "sh-btn", type: "button", text: "Knew it ✓" });
      var bl = h("button", { class: "sh-btn", type: "button", text: "Still learning ↻" });
      bk.onclick = function () { known++; idx++; flipped = false; cards(); };
      bl.onclick = function () { deck.push(g); idx++; flipped = false; cards(); };
      if (flipped) { row.appendChild(bk); row.appendChild(bl); } else { var rv = h("button", { class: "sh-btn", type: "button", text: "Reveal" }); rv.onclick = function () { flipped = true; cards(); }; row.appendChild(rv); }
      out.appendChild(row);
    }
    function render(reset) { if (st.mode === "browse") browse(); else cards(reset); }
    search.oninput = function () { st.q = search.value; render(true); };
    sel.onchange = function () { st.cat = sel.value; render(true); };
    mBrowse.onclick = function () { st.mode = "browse"; mBrowse.className = "sh-btn on"; mCards.className = "sh-btn"; render(true); };
    mCards.onclick = function () { st.mode = "cards"; mCards.className = "sh-btn on"; mBrowse.className = "sh-btn"; render(true); };
    render(true);
  };

  /* Punnett / probability calculator */
  function parseGeno(s) {
    s = s.replace(/[\s,×x]/g, function (c) { return c === "x" ? "x" : ""; });
    var pairs = [];
    for (var i = 0; i + 1 < s.length; i += 2) {
      var a = s[i], b = s[i + 1];
      if (!/[A-Za-z]/.test(a) || !/[A-Za-z]/.test(b) || a.toLowerCase() !== b.toLowerCase()) return null;
      pairs.push([a, b]);
    }
    if (s.length % 2 || !pairs.length) return null;
    return pairs;
  }
  function norm(a, b) { return a === b ? a + b : (a < b ? a + b : b + a); } // uppercase sorts first
  function geneDist(p1, p2) {
    var m = {}; p1.forEach(function (x) { p2.forEach(function (y) { var g = norm(x, y); m[g] = (m[g] || 0) + 1; }); });
    return m; // counts out of 4
  }
  function combine(dists) {
    var res = [{ g: "", n: 1 }];
    dists.forEach(function (d) {
      var next = [];
      res.forEach(function (r) { Object.keys(d).forEach(function (g) { next.push({ g: r.g + g, n: r.n * d[g] }); }); });
      res = next;
    });
    return res;
  }
  function phenOf(g, incomplete) {
    if (incomplete) return g;
    return g[0] === g[0].toUpperCase() ? g[0] + "_" : g;
  }
  window.HWidgets.punnett = function (root) {
    root.innerHTML =
      "<div class='hx-calc'>" +
      "<p class='sh-muted'>Type each parent’s genotype as pairs of letters, same gene order for both (e.g. <code>AaBb</code> × <code>Aabb</code>). Up to 5 genes. Uppercase = dominant.</p>" +
      "<div class='hx-fields'><label>Parent 1<input id='hx-p1' value='AaBb' autocomplete='off'></label>" +
      "<label>Parent 2<input id='hx-p2' value='AaBb' autocomplete='off'></label>" +
      "<label>Dominance<select id='hx-dom'><option value='c'>Complete dominance</option><option value='i'>Incomplete dominance / codominance</option></select></label>" +
      "<label>Find probability of (optional)<input id='hx-t' placeholder='e.g. aaB_ or Aabb' autocomplete='off'></label></div>" +
      "<div id='hx-out'></div></div>";
    var p1 = root.querySelector("#hx-p1"), p2 = root.querySelector("#hx-p2"), dom = root.querySelector("#hx-dom"), tg = root.querySelector("#hx-t"), out = root.querySelector("#hx-out");
    function run() {
      var A = parseGeno(p1.value), B = parseGeno(p2.value);
      if (!A || !B) { out.innerHTML = "<div class='hx-warn'>Enter genotypes as letter pairs like Aa, AaBb, XRXr. Each pair must use the same letter (Aa, not Ab).</div>"; return; }
      if (A.length !== B.length) { out.innerHTML = "<div class='hx-warn'>Both parents need the same number of genes.</div>"; return; }
      for (var i = 0; i < A.length; i++) if (A[i][0].toLowerCase() !== B[i][0].toLowerCase()) { out.innerHTML = "<div class='hx-warn'>Use the same gene letters in the same order for both parents (gene " + (i + 1) + " differs).</div>"; return; }
      if (A.length > 5) { out.innerHTML = "<div class='hx-warn'>Max 5 genes.</div>"; return; }
      var inc = dom.value === "i", n = A.length, total = Math.pow(4, n);
      var dists = A.map(function (a, k) { return geneDist(a, B[k]); });
      var html = "<h4>Step 1 · Treat each gene separately</h4><div class='hx-scroll'><table class='hx-tbl'><tr><th>Gene</th><th>Cross</th><th>Offspring genotypes</th></tr>";
      dists.forEach(function (d, k) {
        html += "<tr><td>" + A[k][0].toUpperCase() + "</td><td>" + A[k][0] + A[k][1] + " × " + B[k][0] + B[k][1] + "</td><td>" +
          Object.keys(d).map(function (g) { return frac(d[g], 4) + " " + g; }).join(" &nbsp; ") + "</td></tr>";
      });
      html += "</table></div>";
      // gametes + grid for <= 2 genes
      function gametes(P) { var r = [""]; P.forEach(function (pr) { var nx = []; r.forEach(function (x) { var seen = {}; pr.forEach(function (al) { if (!seen[al]) { seen[al] = 1; nx.push(x + al); } }); }); r = nx; }); return r; }
      if (n <= 2) {
        var ga = gametes(A), gb = gametes(B);
        function cell(x, y) { var s = ""; for (var k = 0; k < n; k++) s += norm(x[k], y[k]); return s; }
        html += "<h4>Step 2 · Punnett square</h4><div class='hx-scroll'><table class='hx-tbl hx-grid'><tr><th></th>" + gb.map(function (g) { return "<th>" + g + "</th>"; }).join("") + "</tr>";
        ga.forEach(function (x) { html += "<tr><th>" + x + "</th>" + gb.map(function (y) { return "<td>" + cell(x, y) + "</td>"; }).join("") + "</tr>"; });
        html += "</table></div>";
        html += "<p class='sh-muted'>Gametes: parent 1 → " + ga.join(", ") + "; parent 2 → " + gb.join(", ") + ".</p>";
      } else {
        html += "<p class='sh-muted'>With " + n + " genes a grid would have " + Math.pow(2, n) + "×" + Math.pow(2, n) + " boxes; the per-gene method above is quicker. Multiply the per-gene fractions for any target.</p>";
      }
      var combos = combine(dists);
      var g2 = {}; combos.forEach(function (c) { g2[c.g] = (g2[c.g] || 0) + c.n; });
      var gl = Object.keys(g2).map(function (k) { return [k, g2[k]]; }).sort(function (a, b) { return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0; });
      var ph = {}; combos.forEach(function (c) {
        var key = ""; for (var k = 0; k < n; k++) { key += phenOf(c.g.substr(2 * k, 2), inc) + (k < n - 1 ? " " : ""); }
        ph[key] = (ph[key] || 0) + c.n;
      });
      var pl = Object.keys(ph).map(function (k) { return [k, ph[k]]; }).sort(function (a, b) { return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0; });
      var gg = gl.map(function (x) { return x[1]; }).reduce(gcd);
      var pg = pl.map(function (x) { return x[1]; }).reduce(gcd);
      html += "<h4>Results</h4><div class='hx-two'><div><b>Genotypes</b> <span class='sh-muted'>ratio " + gl.map(function (x) { return x[1] / gg; }).join(":") + "</span><div class='hx-scroll'><table class='hx-tbl'>" +
        gl.slice(0, 40).map(function (x) { return "<tr><td>" + x[0] + "</td><td>" + frac(x[1], total) + "</td><td>" + (100 * x[1] / total).toFixed(1).replace(/\.0$/, "") + "%</td></tr>"; }).join("") +
        (gl.length > 40 ? "<tr><td colspan=3>…" + (gl.length - 40) + " more</td></tr>" : "") + "</table></div></div>" +
        "<div><b>Phenotypes</b> <span class='sh-muted'>ratio " + pl.map(function (x) { return x[1] / pg; }).join(":") + "</span><div class='hx-scroll'><table class='hx-tbl'>" +
        pl.slice(0, 40).map(function (x) { return "<tr><td>" + x[0] + "</td><td>" + frac(x[1], total) + "</td><td>" + (100 * x[1] / total).toFixed(1).replace(/\.0$/, "") + "%</td></tr>"; }).join("") +
        (pl.length > 40 ? "<tr><td colspan=3>…" + (pl.length - 40) + " more</td></tr>" : "") + "</table></div></div></div>";
      // target
      var t = tg.value.replace(/\s/g, "");
      if (t) {
        if (t.length !== 2 * n) html += "<div class='hx-warn'>Target needs " + n + " gene(s): " + n + " pairs like Aa, aa or A_ (A_ = at least one dominant allele).</div>";
        else {
          var ok = true, num = 1, steps = [];
          for (var k = 0; k < n; k++) {
            var tk = t.substr(2 * k, 2), d = dists[k], cnt = 0;
            if (tk[0].toLowerCase() !== A[k][0].toLowerCase()) { ok = false; break; }
            Object.keys(d).forEach(function (g) {
              var match = tk[1] === "_" ? (inc ? false : g[0] === g[0].toUpperCase()) : (norm(tk[0], tk[1]) === g);
              if (match) cnt += d[g];
            });
            num *= cnt; steps.push(frac(cnt, 4) + " (" + tk + ")");
          }
          if (!ok) html += "<div class='hx-warn'>Target letters must match the genes in order.</div>";
          else html += "<h4>Your target</h4><div class='hx-ans'>P = " + steps.join(" × ") + " = <b>" + frac(num, total) + "</b> (" + (100 * num / total).toFixed(2).replace(/\.?0+$/, "") + "%)</div>";
        }
      }
      out.innerHTML = html;
    }
    [p1, p2, dom, tg].forEach(function (e) { e.addEventListener("input", run); e.addEventListener("change", run); });
    run();
  };

  /* Binomial: several children */
  window.HWidgets.binom = function (root) {
    root.innerHTML =
      "<div class='hx-calc'><b>Several children? Try the “n children” calculator</b>" +
      "<p class='sh-muted'>Each child is an independent event with the same chance p. Enter p as a fraction (1/4), the number of children n, and k.</p>" +
      "<div class='hx-fields'><label>p (one child)<input id='hb-p' value='1/4'></label><label>n children<input id='hb-n' type='number' min='1' max='30' value='4'></label><label>k children<input id='hb-k' type='number' min='0' max='30' value='1'></label></div><div id='hb-out'></div></div>";
    var P = root.querySelector("#hb-p"), N = root.querySelector("#hb-n"), K = root.querySelector("#hb-k"), O = root.querySelector("#hb-out");
    function bg(a, b) { a = a < 0n ? -a : a; while (b) { var t = a % b; a = b; b = t; } return a || 1n; }
    function bf(n, d) { if (n === 0n) return "0"; var g = bg(n, d); n /= g; d /= g; return d === 1n ? String(n) : n + "/" + d; }
    function C(n, k) { var r = 1n; for (var i = 1n; i <= BigInt(k); i++) r = r * (BigInt(n) - i + 1n) / i; return r; }
    function run() {
      var m = P.value.match(/^\s*(\d+)\s*\/\s*(\d+)\s*$/);
      var a, b;
      if (m) { a = BigInt(m[1]); b = BigInt(m[2]); } else { var f = parseFloat(P.value); if (isNaN(f)) { O.innerHTML = "<div class='hx-warn'>Enter p like 1/4 or 0.25.</div>"; return; } b = 10000n; a = BigInt(Math.round(f * 10000)); }
      var n = parseInt(N.value, 10), k = parseInt(K.value, 10);
      if (!(a >= 0n && b > 0n && a <= b) || !(n >= 1) || !(k >= 0 && k <= n)) { O.innerHTML = "<div class='hx-warn'>Need 0 ≤ p ≤ 1 and 0 ≤ k ≤ n.</div>"; return; }
      function pk(j) { return C(n, j) * a ** BigInt(j) * (b - a) ** BigInt(n - j); }
      var den = b ** BigInt(n), exact = pk(k), atleast = 0n; for (var j = k; j <= n; j++) atleast += pk(j);
      var none = (b - a) ** BigInt(n);
      function pct(x) { return (Number(x * 100000n / den) / 1000).toFixed(2) + "%"; }
      O.innerHTML = "<div class='hx-ans'>Exactly " + k + " of " + n + ": C(" + n + "," + k + ")·p^" + k + "·q^" + (n - k) + " = <b>" + bf(exact, den) + "</b> (" + pct(exact) + ")<br>" +
        "At least " + k + ": <b>" + bf(atleast, den) + "</b> (" + pct(atleast) + ")<br>" +
        "At least one: 1 − q^" + n + " = <b>" + bf(den - none, den) + "</b> (" + pct(den - none) + ")</div>";
    }
    [P, N, K].forEach(function (e) { e.addEventListener("input", run); }); run();
  };

  /* ---------- Concept articles ---------- */
  var C = [];
  C.push({
    id: "glossary", level: LVL, title: "Glossary & flashcards: every term in plain language",
    definition: "Genetics is mostly vocabulary. Search any term, filter by topic, or switch to flashcards and test yourself. Each term has a one-line meaning and a memory tip.",
    widget: "glossary",
    body: "<div class='hx-callout'><b>Roots that decode most terms:</b> <i>homo</i> = same, <i>hetero</i> = different, <i>mono/di/poly</i> = one/two/many, <i>geno-</i> = the genes (letters), <i>pheno-</i> = what you see, <i>-zygous</i> = zygote (the fertilised egg: how many copies it got).</div>",
    points: [], formula: "", source: "Heredity overview, slides and practice documents; standard genetics definitions", img: [], svg: null
  });
  C.push({
    id: "howto", level: LVL, title: "How to solve any genetics problem (10 steps)",
    definition: "Most genetics problems fall to the same routine. Follow it in order and write each step down; it is hard to go wrong.",
    body:
      "<ol class='hx-steps'>" +
      "<li><b>Read it and underline what it asks.</b> Probability of a <i>genotype</i>, a <i>phenotype</i>, a <i>ratio</i>, or a <i>number of offspring</i>?</li>" +
      "<li><b>Decide dominant vs recessive.</b> Often given; if not, use clues: a trait that skips a generation is recessive; two normal parents with an affected child → recessive.</li>" +
      "<li><b>Assign letters.</b> Capital for dominant, lowercase for recessive, using the first letter of the dominant trait (P = polydactyly, p = normal).</li>" +
      "<li><b>Write the parents’ genotypes.</b> Translate wording into letters (see table). Unknown allele? Write <code>A_</code>.</li>" +
      "<li><b>List the gametes.</b> Each gamete gets ONE allele per gene. AaBb makes four: AB, Ab, aB, ab. This is where most mistakes happen.</li>" +
      "<li><b>Cross them.</b> Punnett square for 1–2 genes; per-gene multiplication for 3 or more.</li>" +
      "<li><b>Count and simplify.</b> Genotype ratio vs phenotype ratio are different questions.</li>" +
      "<li><b>Re-read the question.</b> Is it “a child” (a fraction) or “out of 8 children” (a count)? Is it “a son” (restricts to half)?</li>" +
      "<li><b>Unknown genotype?</b> Work backward: put the offspring in the square, or use ratios (see the ratio cheat-sheet).</li>" +
      "<li><b>Sanity check:</b> all fractions add to 1; each parent gives only one allele per gene.</li></ol>" +
      "<h4>Translate the wording into genotypes</h4><div class='hx-scroll'><table class='hx-tbl'><tr><th>The problem says…</th><th>Means…</th></tr>" +
      "<tr><td>“true-breeding”, “pure line”, “homozygous”</td><td>AA or aa (never Aa)</td></tr>" +
      "<tr><td>“hybrid”, “carrier”, “heterozygous”</td><td>Aa</td></tr>" +
      "<tr><td>Shows the recessive trait</td><td>aa for sure</td></tr>" +
      "<tr><td>Shows the dominant trait</td><td>A_ (AA or Aa), unknown until you have more clues</td></tr>" +
      "<tr><td>“Mary is normal but had an albino father”</td><td>Mary is Aa (she got a from her father, A from her mother)</td></tr>" +
      "<tr><td>Parent with the recessive trait has a child</td><td>The child got one a from that parent</td></tr>" +
      "<tr><td>Two normal parents have an affected child</td><td>Both are carriers (Aa × Aa)</td></tr>" +
      "<tr><td>“about half the children are…”</td><td>1:1 → test-cross type (Aa × aa)</td></tr>" +
      "<tr><td>“about three-quarters … one-quarter”</td><td>3:1 → Aa × Aa</td></tr></table></div>" +
      "<h4>Worked example</h4><p><b>An albino man marries a normally pigmented woman whose mother was albino. What children are expected?</b></p>" +
      "<ol class='hx-steps'><li>Albino is recessive: A = normal, a = albino.</li><li>Man: <code>aa</code>.</li><li>Woman is normal (A_), but her mother was aa, so she got <i>a</i> from her mother → <code>Aa</code>.</li>" +
      "<li>Cross <code>Aa × aa</code>: gametes A, a × a, a → <code>Aa, Aa, aa, aa</code>.</li><li>Answer: ½ normal carriers (Aa), ½ albino (aa).</li></ol>",
    points: [], formula: "", source: "“How to solve genetics problems” handout (6-27, 7-27) and practice problems with solutions (9-27)", img: [], svg: null
  });
  C.push({
    id: "prob_rules", level: LVL, title: "Probability toolkit: AND, OR, per-gene, several children",
    definition: "You rarely need a giant Punnett square. Learn four moves: multiply for AND, add for OR, split multi-gene crosses into single genes, and use the binomial for several children.",
    body:
      "<div class='hx-two'><div class='hx-callout'><b>AND → multiply</b><br>Independent events: P(A and B) = P(A) × P(B).<br><i>Both children aa: ¼ × ¼ = 1/16.</i></div>" +
      "<div class='hx-callout'><b>OR → add</b><br>Different ways to get the result: add them.<br><i>Aa child from Aa × Aa: Aa can come as A·a or a·A, ¼ + ¼ = ½.</i></div></div>" +
      "<h4>Move 1 · Split multi-gene crosses into single genes</h4>" +
      "<p>Genes on different chromosomes are independent, so do each gene alone, then multiply. Example from a real invitational: <b>aaBbCCDD × AaBbCcdd</b>.</p>" +
      "<div class='hx-scroll'><table class='hx-tbl'><tr><th>Gene</th><th>Cross</th><th>Offspring</th></tr>" +
      "<tr><td>A</td><td>aa × Aa</td><td>½ Aa, ½ aa</td></tr><tr><td>B</td><td>Bb × Bb</td><td>¼ BB, ½ Bb, ¼ bb</td></tr>" +
      "<tr><td>C</td><td>CC × Cc</td><td>½ CC, ½ Cc</td></tr><tr><td>D</td><td>DD × dd</td><td>all Dd</td></tr></table></div>" +
      "<ul><li><b>AaBBCc</b> = ½ × ¼ × ½ = <b>1/16</b></li><li><b>aaBbCC</b> = ½ × ½ × ½ = <b>1/8</b></li><li><b>AABBCC</b> = 0 (no AA possible, aa × Aa)</li>" +
      "<li><b>A_ B_ C_ (all dominant phenotype)</b> = ½ × ¾ × 1 = <b>3/8</b>. Phenotype per gene: A_ = ½ (Aa only), B_ = ¾, C_ = 1.</li><li><b>bb</b> alone = ¼</li></ul>" +
      "<h4>Move 2 · Heterozygous everywhere</h4>" +
      "<p>For Aa × Aa the child is Aa with chance ½. For 26 independent heterozygous genes, the child is heterozygous at all of them with probability (½)<sup>26</sup>. With n heterozygous genes a parent makes <b>2<sup>n</sup></b> kinds of gametes (AaBb → 4).</p>" +
      "<h4>Move 3 · Condition on what you already know (the 2/3 trick)</h4>" +
      "<p>Two carriers (Aa × Aa) have a child with the dominant phenotype. Is the child a carrier? Cross it out of the sample: the aa box is impossible, leaving AA, Aa, Aa. So <b>P(carrier) = 2/3</b>, not ½.</p>" +
      "<h4>Move 4 · More than one child</h4>" +
      "<p>Each child is an independent event. “At least one” is easiest as <b>1 − P(none)</b>. For an exact count use the binomial: <b>C(n,k)·p<sup>k</sup>·q<sup>n−k</sup></b>.</p>" +
      "<p><i>Aa × Aa, four children, exactly one aa:</i> C(4,1) · ¼ · (¾)³ = 27/64. <i>At least one aa:</i> 1 − (¾)⁴ = 175/256.</p>" +
      "<h4>Common traps</h4><ul><li><b>Gametes are not zygotes.</b> “Probability of an A gamete from AaBb” is ½, not ¼.</li>" +
      "<li><b>Past children do not matter.</b> After three aa kids the next is still ¼ (no memory).</li>" +
      "<li><b>“A son”</b> changes the sample space: X-linked probabilities refer to sons only, so multiply by ½ only if the question asks about “a child”.</li>" +
      "<li><b>Genotype vs phenotype:</b> in Aa × Aa the genotype ratio is 1:2:1 but the phenotype ratio is 3:1.</li></ul>",
    widget: "binom",
    points: [], formula: "P(A and B) = P(A)·P(B)    P(A or B) = P(A)+P(B)    P(≥1) = 1 − P(none)    C(n,k)·pᵏ·qⁿ⁻ᵏ", source: "Berkeley Invitational B key (2026); practice problems with solutions; BullSO 2026", img: [], svg: null
  });
  C.push({
    id: "ratios", level: LVL, title: "Ratio cheat-sheet: what ratio means what",
    definition: "Memorise the standard outcomes. They let you recognise a cross instantly and run problems backward from offspring ratios to unknown parent genotypes.",
    body:
      "<div class='hx-scroll'><table class='hx-tbl'><tr><th>Cross</th><th>Genotypes</th><th>Phenotypes (complete dominance)</th></tr>" +
      "<tr><td>AA × aa</td><td>all Aa</td><td>all dominant</td></tr>" +
      "<tr><td>Aa × Aa</td><td>1 AA : 2 Aa : 1 aa</td><td><b>3 : 1</b></td></tr>" +
      "<tr><td>Aa × aa (test cross)</td><td>1 Aa : 1 aa</td><td><b>1 : 1</b></td></tr>" +
      "<tr><td>AA × Aa</td><td>1 AA : 1 Aa</td><td>all dominant</td></tr>" +
      "<tr><td>AaBb × AaBb</td><td>9 genotype classes</td><td><b>9 : 3 : 3 : 1</b></td></tr>" +
      "<tr><td>AaBb × aabb (dihybrid test cross)</td><td>1 AaBb : 1 Aabb : 1 aaBb : 1 aabb</td><td><b>1 : 1 : 1 : 1</b></td></tr>" +
      "<tr><td>AaBb × Aabb</td><td>6 classes</td><td><b>3 : 3 : 1 : 1</b></td></tr>" +
      "<tr><td>Aa × Aa, <i>incomplete</i> dominance</td><td>1 : 2 : 1</td><td><b>1 : 2 : 1</b> (three phenotypes)</td></tr>" +
      "<tr><td>Aa × Aa, homozygous <i>lethal</i></td><td>2 Aa : 1 AA (aa dies)</td><td><b>2 : 1</b> among survivors</td></tr></table></div>" +
      "<h4>Run it backward: which parents gave this ratio?</h4>" +
      "<ul><li><b>3 : 1</b> → both parents heterozygous (Aa × Aa).</li><li><b>1 : 1</b> → one parent heterozygous, the other homozygous recessive.</li>" +
      "<li><b>All dominant</b> → at least one parent is AA.</li><li><b>9:3:3:1</b> → both parents heterozygous for both genes.</li>" +
      "<li><b>1:1:1:1</b> → test cross of a double heterozygote.</li><li><b>3:3:1:1</b> → one gene is Aa × Aa (3:1), the other is Bb × bb (1:1): multiply the ratios (3:1)×(1:1).</li></ul>" +
      "<p><b>Trick for dihybrid ratios:</b> work out each gene’s ratio, then multiply the ratios together: (3:1) × (3:1) = 9:3:3:1; (3:1) × (1:1) = 3:3:1:1.</p>" +
      "<p><b>Small samples:</b> real counts only approximate the ratio (6 short : 2 long cats from a 1:1 cross is normal). Large samples get closer to the expected ratio.</p>",
    points: [], formula: "", source: "Practice problems with solutions (9-27); Berkeley and BullSO invitationals", img: [], svg: null
  });
  C.push({
    id: "specials", level: LVL, title: "Special cases: blood types, X-linked, incomplete dominance, lethal, Hardy–Weinberg",
    definition: "Each special case changes only the notation or the bookkeeping. The cross itself is still a Punnett square.",
    body:
      "<h4>ABO blood groups (multiple alleles + codominance)</h4>" +
      "<div class='hx-scroll'><table class='hx-tbl'><tr><th>Phenotype</th><th>Genotypes</th></tr><tr><td>A</td><td>I<sup>A</sup>I<sup>A</sup>, I<sup>A</sup>i</td></tr><tr><td>B</td><td>I<sup>B</sup>I<sup>B</sup>, I<sup>B</sup>i</td></tr><tr><td>AB</td><td>I<sup>A</sup>I<sup>B</sup> (codominant)</td></tr><tr><td>O</td><td>ii</td></tr></table></div>" +
      "<p><i>AB male × I<sup>B</sup>i female:</i> gametes I<sup>A</sup>, I<sup>B</sup> × I<sup>B</sup>, i → I<sup>A</sup>I<sup>B</sup> (AB), I<sup>A</sup>i (A), I<sup>B</sup>I<sup>B</sup> (B), I<sup>B</sup>i (B). <b>P(type B) = ½.</b></p>" +
      "<h4>X-linked traits</h4>" +
      "<ul><li>Write the alleles on the X: X<sup>C</sup> (normal), X<sup>c</sup> (colour-blind). Males are X<sup>C</sup>Y or X<sup>c</sup>Y.</li>" +
      "<li>Sons get their X from the <b>mother</b> and the Y from the father. Fathers never pass an X-linked trait to sons.</li>" +
      "<li><i>Normal father (X<sup>C</sup>Y) × colour-blind mother (X<sup>c</sup>X<sup>c</sup>):</i> all daughters X<sup>C</sup>X<sup>c</sup> (carriers), all sons X<sup>c</sup>Y (colour-blind).</li>" +
      "<li><i>Carrier mother × normal father:</i> ½ of sons affected, no daughters affected, ½ of daughters carriers. Overall ¼ of children are affected.</li>" +
      "<li><b>Y-linked (holandric):</b> every son of an affected father is affected; no daughters.</li></ul>" +
      "<h4>Incomplete dominance</h4><p>Heterozygote is a blend, so each genotype has its own phenotype and the phenotype ratio equals the genotype ratio. Two wavy-haired parents (Cc × Cc) → ¼ curly : ½ wavy : ¼ straight, so out of 8 children expect 2 : 4 : 2. You can never breed a pure herd of palominos, since Aa × Aa always gives 1:2:1.</p>" +
      "<h4>Homozygous lethal alleles</h4><p>Aa × Aa → ¼ AA dies, so the survivors are ⅓ AA : ⅔ Aa shown as <b>2 : 1</b>. Out of 100 eggs: 75 live, and ⅔ of those are Aa.</p>" +
      "<h4>Hardy–Weinberg in four lines</h4>" +
      "<ol class='hx-steps'><li>Start from the one thing you can count: the recessive phenotype frequency = q².</li><li>q = √(q²); p = 1 − q.</li><li>Carriers = 2pq; dominant homozygotes = p².</li><li>Example: 1 in 10 000 is aa → q = 0.01, p = 0.99, carriers 2pq ≈ 0.0198 ≈ <b>1 in 50</b>.</li></ol>",
    points: [], formula: "p + q = 1    p² + 2pq + q² = 1", source: "Practice problems with solutions (9-27); Berkeley key (2026)", img: [], svg: null
  });
  C.push({
    id: "pedigree_howto", level: LVL, title: "Pedigree decision guide: find the mode of inheritance",
    definition: "Test the patterns in this order. The first clean match is your answer; check it by assigning genotypes.",
    body:
      "<ol class='hx-steps'>" +
      "<li><b>Do two unaffected parents ever have an affected child?</b> → <b>Recessive</b> (autosomal or X-linked). If instead every affected person has an affected parent → dominant.</li>" +
      "<li><b>Dominant checks:</b> trait appears in every generation; affected people have at least one affected parent; unaffected people never pass it on.</li>" +
      "<li><b>Recessive checks:</b> can skip generations; affected people are both male and female.</li>" +
      "<li><b>Is it X-linked?</b> Trait never passes father → son, mostly males affected (recessive), all daughters of an affected father are affected (X-linked dominant), all affected males are related through their mothers.</li>" +
      "<li><b>Is it Y-linked?</b> Only males affected, father → every son.</li>" +
      "<li><b>Mitochondrial?</b> Passed only from mother to all children; fathers never pass it on.</li>" +
      "<li>Finally <b>label genotypes</b> and check no individual contradicts the model.</li></ol>" +
      "<div class='hx-scroll'><table class='hx-tbl'><tr><th>Mode</th><th>Key giveaway</th></tr>" +
      "<tr><td>Autosomal dominant</td><td>Every generation; affected child always has an affected parent</td></tr>" +
      "<tr><td>Autosomal recessive</td><td>Unaffected parents → affected child; males and females equally</td></tr>" +
      "<tr><td>X-linked dominant</td><td>Affected father → all daughters affected, no sons</td></tr>" +
      "<tr><td>X-linked recessive</td><td>More males; no father-to-son; carrier mothers</td></tr>" +
      "<tr><td>Y-linked</td><td>Father → all sons</td></tr>" +
      "<tr><td>Mitochondrial</td><td>Mother → all children</td></tr></table></div>" +
      "<p>When asked a probability from a pedigree, first fix the genotypes (use the 2/3 rule for an unaffected sibling of an affected child), then multiply along the lines.</p>",
    points: [], formula: "", source: "“Hints on how to solve pedigree problems” (8-27)", img: [], svg: null
  });
  C.push({
    id: "calc", level: LVL, title: "Punnett & probability calculator",
    definition: "Type two genotypes, see the Punnett square, ratios and any probability you want. Use it to check your hand work, not to replace it.",
    widget: "punnett",
    body: "<p class='sh-muted'>Try: <code>Aa</code> × <code>Aa</code>; <code>AaBb</code> × <code>aabb</code>; <code>aaBbCCDD</code> × <code>AaBbCcdd</code> with target <code>A_B_C_Dd</code>. Switch to incomplete dominance for blends and codominance.</p>",
    points: [], formula: "", source: "", img: [], svg: null
  });

  /* ---------- Extra practice questions ---------- */
  var X = [];
  function mc(n, stem, opts, ci, expl, concept) {
    X.push({ id: "px" + n, exam: "Practice · Probability workshop", set: "px", num: n, pts: null, topic: "", typ: "Multiple Choice", stem: stem, options: opts, correct: [ci], explanation: expl, sample: "", img: null, appears: ["Practice · Probability workshop #" + n], concept: concept });
  }
  mc(1, "In cats, long hair (h) is recessive to short hair (H). A true-breeding short-haired male is mated to a long-haired female. What fraction of the kittens are short-haired?",
    ["0", "1/2", "3/4", "All of them"], 3, "HH × hh gives all Hh, and Hh shows the dominant phenotype, so all kittens are short-haired (all heterozygous).", "howto");
  mc(2, "A long-haired cat (recessive) mates with another cat. The litter has 2 short-haired and 3 long-haired kittens. What is the second parent’s genotype?",
    ["HH", "Hh", "hh", "Cannot be determined"], 1, "Long-haired kittens (hh) need an h from each parent. About half the litter is recessive (1:1) so this is a test cross: hh × Hh. A short-haired parent that can have long kittens must be Hh.", "ratios");
  mc(3, "Mr. and Mrs. Smith both have widow’s peaks (dominant). Their second child does not. What is the probability that a later child has NO widow’s peak?",
    ["0", "1/4", "1/2", "3/4"], 1, "A child without a peak is ww, so each parent must carry w: Ww × Ww. P(ww) = ¼. Mr. Smith is not necessarily justified in accusing his wife.", "prob_rules");
  mc(4, "Curly (CC) hair is incompletely dominant to straight (cc); heterozygotes are wavy. Two curly-haired parents have a wavy-haired child. What is the best conclusion?",
    ["Normal: CC × CC can give Cc", "Impossible by Mendelian genetics (CC × CC gives only CC)", "The mother must be wavy", "Wavy is dominant"], 1, "Both curly parents are CC, so all children must be CC. A wavy (Cc) child cannot arise, unless there is a mutation or a different father. So the father may indeed have cause for concern.", "specials");
  mc(5, "Two wavy-haired people (Cc × Cc) have eight children. How many curly : wavy : straight do you expect?",
    ["2 : 4 : 2", "6 : 0 : 2", "4 : 0 : 4", "0 : 8 : 0"], 0, "Cc × Cc → ¼ CC : ½ Cc : ¼ cc, so out of 8: 2 curly, 4 wavy, 2 straight. Real families vary around this by chance.", "specials");
  mc(6, "Palomino horses are heterozygous (incomplete dominance between chestnut and cream). A palomino is mated to a palomino. What is the phenotype ratio of the foals?",
    ["3 palomino : 1 chestnut", "1 chestnut : 2 palomino : 1 cream", "All palomino", "1 palomino : 1 cream"], 1, "Aa × Aa gives ¼ AA : ½ Aa : ¼ aa. With incomplete dominance, genotype ratio = phenotype ratio, so a pure-breeding palomino herd is impossible.", "specials");
  mc(7, "In fruit flies, Cy Cy is lethal and Cy cy is curly-winged. Two curly flies are mated and the female lays 100 eggs. How many straight-winged flies do you expect among those that hatch?",
    ["33", "25", "50", "75"], 1, "Cy cy × Cy cy → ¼ Cy Cy (dies), ½ Cy cy, ¼ cy cy. 75 live, of which 25 are straight (⅓) and 50 curly (⅔). Careful: straight-winged is ⅓ of the survivors, not ¼.", "specials");
  mc(8, "A dwarf bull (heterozygous, homozygous dwarf is lethal) is mated with many dwarf cows. What is the phenotype ratio dwarf : normal among the living calves?",
    ["3 : 1", "1 : 1", "2 : 1", "1 : 2"], 2, "Dd × Dd → ¼ DD (dies), ½ Dd (dwarf), ¼ dd (normal) → 2 : 1 among survivors.", "specials");
  mc(9, "Gene A: Aabb × AABb. What are the genotype and phenotype ratios of the offspring?",
    ["1:1:1:1 and 1:1", "9:3:3:1 and 3:1", "1:2:1 and 3:1", "1:1 and 1:1"], 0, "Gene A: Aa × AA → ½ AA, ½ Aa (all dominant). Gene B: bb × Bb → ½ Bb, ½ bb. Multiply ratios: genotypes (1:1) × (1:1) = 1:1:1:1; phenotypes: all A_, so B_ : bb = 1:1.", "prob_rules");
  mc(10, "For aaBbCCDD × AaBbCcdd, what is the probability of an offspring with genotype AaBBCc?",
    ["1/16", "1/8", "1/4", "1/32"], 0, "Per gene: aa × Aa → Aa ½. Bb × Bb → BB ¼. CC × Cc → Cc ½. Multiply: ½ × ¼ × ½ = 1/16.", "prob_rules");
  mc(11, "For aaBbCCDD × AaBbCcdd, what is the probability that an offspring shows the dominant phenotype for A, B and C?",
    ["3/4", "3/8", "9/16", "1/2"], 1, "A_ = ½ (only Aa, since aa × Aa), B_ = ¾ (Bb × Bb), C_ = 1 (CC × anything). ½ × ¾ × 1 = 3/8.", "prob_rules");
  mc(12, "Two individuals are both heterozygous for 26 independent genes (A to Z). What is the probability that an offspring is heterozygous for all 26?",
    ["(1/2)^26", "(1/4)^26", "(3/4)^26", "1/26"], 0, "Each Aa × Aa gives an Aa child with probability ½. Independent genes multiply: (½)^26.", "prob_rules");
  mc(13, "A male with blood type AB mates with a female IBi. What is the probability that a child is type B?",
    ["0", "1/4", "1/2", "3/4"], 2, "IAIB × IBi → IAIB (AB), IAi (A), IBIB (B), IBi (B). Two of four are type B: ½.", "specials");
  mc(14, "AaBb × AaBb. What is the probability of an offspring with the genotype AaBb?",
    ["1/16", "1/8", "1/4", "9/16"], 2, "Each gene: Aa × Aa → Aa with probability ½. ½ × ½ = ¼. (9/16 is the A_B_ phenotype.)", "prob_rules");
  mc(15, "In garden peas, long stem (L) and yellow seed (Y) are dominant. 100 long, yellow plants, each from a short, green parent, are interbred, giving 1600 offspring. About how many are long and green?",
    ["100", "300", "400", "900"], 1, "Each plant had a short green parent (llyy) and is long and yellow, so each is LlYy. LlYy × LlYy → 9:3:3:1. Long green = L_yy = 3/16 × 1600 = 300.", "dihybrid");
  mc(16, "An X-linked recessive colour-blind woman (XcXc) marries a man with normal vision (XCY). What are the expected children?",
    ["All normal", "Daughters carriers (normal), sons colour-blind", "Half of all sons and daughters colour-blind", "Daughters colour-blind, sons normal"], 1, "Sons get the mother’s only X (Xc) so they are XcY: colour-blind. Daughters get Xc from mom and XC from dad: carriers, normal vision.", "specials");
  mc(17, "A carrier mother (XCXc) and a normal father (XCY): what is the probability that a SON is colour-blind?",
    ["1/4", "1/2", "3/4", "0"], 1, "Restrict to sons (XCY or XcY): mom passes XC or Xc with equal chance. P(son colour-blind) = ½. (Overall ¼ of all children.)", "specials");
  mc(18, "A male Tickle-belly has a Y-linked (holandric) trait. He has six children, three sons and three daughters. How many show the trait?",
    ["All six", "Three: all the sons", "Three: all the daughters", "About half of each"], 1, "A holandric trait goes father → every son, never to daughters.", "specials");
  mc(19, "Two carriers (Aa × Aa) have four children. What is the probability that at least one child is aa?",
    ["1/4", "27/64", "175/256", "255/256"], 2, "P(no aa child) = (¾)⁴ = 81/256. At least one = 1 − 81/256 = 175/256.", "prob_rules");
  mc(20, "Two carriers (Aa × Aa) have four children. What is the probability that exactly one is aa?",
    ["1/4", "27/64", "81/256", "3/4"], 1, "Binomial: C(4,1) · (¼) · (¾)³ = 4 · 27/256 = 27/64.", "prob_rules");
  mc(21, "Two carriers (Aa × Aa) have a child with the dominant phenotype. What is the probability that this child is a carrier?",
    ["1/2", "2/3", "3/4", "1/4"], 1, "The dominant child is AA, Aa or Aa (aa excluded): 1 AA : 2 Aa → 2/3 are carriers.", "prob_rules");
  mc(22, "An autosomal recessive disease affects 1 in 10 000 people. Assuming Hardy–Weinberg, approximately what fraction are carriers?",
    ["1 in 100", "1 in 50", "1 in 10 000", "1 in 5"], 1, "q² = 1/10 000 → q = 0.01, p = 0.99. 2pq = 2(0.99)(0.01) ≈ 0.0198 ≈ 1/50.", "hardy");
  mc(23, "Halter-Man (wwpp, water-loving pacer) mates with Erlich-Mane, a dry-track trotter (W_G_) who has a parent that was ww pp. Dry W and trotter G are dominant. What is the probability of a water-loving trotter foal (wwG_)?",
    ["1/2", "1/4", "1/8", "3/16"], 1, "Erlich-Mane received w and p from her water-loving pacer parent, and she is dry and a trotter, so she is WwGg. Cross WwGg × wwpp: P(ww) = ½, P(G_) = ½ → ¼.", "prob_rules");
  mc(24, "In a pedigree, two unaffected parents have an affected daughter. What does this prove?",
    ["Autosomal dominant", "X-linked dominant", "Recessive (autosomal, since a daughter is affected)", "Y-linked"], 2, "Unaffected parents having an affected child means the trait is recessive; an affected daughter of an unaffected father rules out X-linked recessive, so autosomal recessive.", "pedigree_howto");
  mc(25, "A woman has ptosis (dominant P). Her father had ptosis, her mother and her father’s mother did not. She marries a man with normal eyelids. What proportion of their children is expected to have ptosis?",
    ["0", "1/4", "1/2", "3/4"], 2, "Her father’s mother was pp, so her father is Pp. Her mother is pp. The woman has ptosis, so she is Pp. Pp × pp → ½ Pp (ptosis).", "howto");

  /* Berkeley 2026 B, short answers with the official key */
  function sa(n, stem, sample, concept, pts) {
    X.push({ id: "bk" + n, exam: "Berkeley Invitational 2026 · Div B", set: "bk", num: n, pts: pts || null, topic: "", typ: "Short Answer", stem: stem, options: null, correct: [], explanation: "", sample: sample, img: null, appears: ["Berkeley Invitational 2026 · Div B #" + n], concept: concept });
  }
  sa(2, "(3 pts) You cross Aabb × AABb. What are the genotypic and phenotypic ratios? (Order largest to smallest.)", "Genotypic 1:1:1:1; Phenotypic 1:1.", "prob_rules", 3);
  sa(3, "(6 × 1 pt) Predict the probability of each offspring genotype or phenotype from aaBbCCDD × AaBbCcdd, where A = 2 eyes, a = 3 eyes; B = 2 arms, b = 3 arms; C = 2 legs, c = 3 legs.\n(a) AABBCC  (b) AaBBCc  (c) aaBbCC  (d) 2 eyes, 2 arms, 2 legs  (e) 3 arms  (f) 3 eyes, 3 arms, 3 legs",
    "(a) 0   (b) 1/16   (c) 1/8   (d) 3/8   (e) 1/4   (f) 0.  Work each gene separately, then multiply.", "prob_rules", 6);
  sa(4, "(2 pts) Two individuals are both heterozygous for genes A through Z (26 genes). What is the probability that an offspring is also heterozygous for all of them? Give an expression.", "(1/2)^26", "prob_rules", 2);
  sa(5, "(2 pts) A male with blood type AB is crossed with a female IBi. What is the probability the offspring is type B?", "1/2", "specials", 2);
  sa(11, "(2 pts) A cell (2n = 8) undergoes meiosis I and meiosis II. How many chromosomes do the daughter cells have after meiosis II?", "4", "meiosis", 2);
  sa(12, "(2 pts) What phenomenon makes the daughter cells genetically different from each other?", "Crossing over (with independent assortment).", "meiosis", 2);
  sa(14, "(2 pts) What is the term for uneven splitting of chromosomes during anaphase? Which of Mendel’s laws does it violate?", "Nondisjunction; it violates the Law of Segregation.", "meiosis", 3);
  sa(20, "(2 pts) Given the DNA strand 5′-GATACAGATACA-3′, write the complementary strand.", "5′-TGTATCTGTATC-3′. Pair each base (A–T, G–C) to get 3′-CTATGTCTATGT-5′, then write it 5′→3′.", "dna_structure", 2);
  sa(22, "(3 pts) Rank from least to most compact: 1 euchromatin, 2 chromosomes, 3 DNA double helix, 4 heterochromatin.", "3, 1, 4, 2", "chromatin", 3);
  sa(24, "(4 pts) A DNA double helix is 32% adenine. What percent are thymine, guanine, cytosine and uracil?", "T = 32%, G = 18%, C = 18%, U = 0% (A + T = 64%, so G + C = 36%, each 18%; DNA has no uracil).", "dna_structure", 4);
  sa(28, "(2 pts) What is the name of the phenomenon that allows several codons to code for the same amino acid?", "Wobble (degeneracy of the genetic code).", "translation", 2);
  sa(30, "(3 pts) Template strand TACGCATAACTGGTGTACATT. (a) What mRNA is transcribed? (b) What amino acid sequence is translated?", "(a) AUGCGUAUUGACCACAUGUAA  (b) Met–Arg–Ile–Asp–His–Met (UAA is the stop codon).", "translation", 3);
  sa(31, "(3 pts) Name the 3 stages of PCR and their temperatures.", "Denaturation ≈ 94 °C; annealing ≈ 50–65 °C; extension ≈ 72 °C.", "pcr", 3);
  sa(34, "(2 pts) How many DNA double helices are present after one DNA molecule undergoes 5 rounds of PCR?", "32 (2^5).", "pcr", 2);

  /* ---------- register ---------- */
  function register() {
    var s = (window.SUBJECTS || []).filter(function (x) { return x.id === "heredity"; })[0];
    if (!s) return;
    var have = {}; s.concepts.forEach(function (c) { have[c.id] = 1; });
    var fresh = C.filter(function (c) { return !have[c.id]; });
    s.concepts = fresh.concat(s.concepts);
    var haveQ = {}; s.questions.forEach(function (q) { haveQ[q.id] = 1; });
    X.concat(window.HEREDITY_BULLSO || [], window.HEREDITY_UT || []).forEach(function (q) { if (!haveQ[q.id]) s.questions.push(q); });
    s.description = "Terminology, probability how-tos and calculators, plus the 2027 Starter Pack concepts and practice from many invitational, regional, state and national tests (Division B).";
  }
  register();
})();
