(function () {
  "use strict";
  var app = document.getElementById("app");
  var crumbs = document.getElementById("crumbs");
  var LIGHT = document.getElementById("lightbox");

  // ---------- helpers ----------
  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === "class") n.className = attrs[k];
      else if (k === "text") n.textContent = attrs[k];
      else if (k.indexOf("on") === 0) n.addEventListener(k.slice(2), attrs[k]);
      else n.setAttribute(k, attrs[k]);
    }
    (children || []).forEach(function (c) { if (c != null) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  }
  function svgFrag(markup) {
    var t = document.createElement("template");
    t.innerHTML = markup.trim();
    return t.content.firstChild;
  }
  function subjects() { return (window.SUBJECTS || []).slice(); }
  function getSubject(id) { return subjects().filter(function (s) { return s.id === id; })[0]; }
  function enc(s) { return encodeURIComponent(s); }
  function lightbox(src) { LIGHT.querySelector("img").src = src; LIGHT.hidden = false; }
  LIGHT.addEventListener("click", function () { LIGHT.hidden = true; });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") LIGHT.hidden = true; });

  function iconNode(s, size) {
    var ic = s.icon || "";
    if (ic.indexOf("<svg") === 0) {
      var n = svgFrag(ic);
      n.setAttribute("width", size); n.setAttribute("height", size);
      return el("span", { class: "sh-icon" }, [n]);
    }
    return el("span", { class: "icon", style: "font-size:" + size + "px", text: ic || "" });
  }
  function setCrumbs(parts) {
    crumbs.innerHTML = "";
    parts.forEach(function (p, i) {
      if (i) crumbs.appendChild(el("span", { class: "sep", text: "/" }));
      crumbs.appendChild(p.href ? el("a", { href: p.href, text: p.text }) : el("span", { text: p.text }));
    });
  }
  function levelNum(lvl) { return String(lvl).split(" ")[0]; }
  var MOBILE = window.matchMedia("(max-width: 860px)");
  var ICON_MENU = '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" style="display:block"><path fill="currentColor" d="M1 2.75A.75.75 0 0 1 1.75 2h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 2.75Zm0 5A.75.75 0 0 1 1.75 7h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 7.75ZM1.75 12h12.5a.75.75 0 0 1 0 1.5H1.75a.75.75 0 0 1 0-1.5Z"/></svg>';
  function treeOpen(tree) {
    return MOBILE.matches ? tree.classList.contains("is-open") : !tree.classList.contains("is-closed");
  }
  function setTreeOpen(tree, open) {
    if (MOBILE.matches) { tree.classList.toggle("is-open", open); }
    else { tree.classList.toggle("is-closed", !open); }
  }

  function setCrumbs(parts) {
    crumbs.innerHTML = "";
    parts.forEach(function (p, i) {
      if (i) crumbs.appendChild(el("span", { class: "sep", text: "/" }));
      crumbs.appendChild(p.href ? el("a", { href: p.href, text: p.text }) : el("span", { text: p.text }));
    });
  }
  function levelNum(lvl) { return String(lvl).split(" ")[0]; }
  // ---------- home ----------
  function removeFab() { var f = document.querySelector(".sh-hbtn"); if (f) f.remove(); }
  function renderHome() {
    removeFab();
    setCrumbs([{ text: "Dashboard" }]);
    var subs = subjects();
    app.innerHTML = "";
    app.appendChild(el("div", { class: "sh-repo-head" }, [
      el("strong", null, [el("span", { text: "Subjects" })])
    ]));
    app.appendChild(el("p", { class: "sh-desc", text: "Study one concept at a time: basics first, then exam practice with answers hidden until you check them." }));
    var box = el("div", { class: "sh-box" });
    box.appendChild(el("div", { class: "sh-box-head" }, [el("span", { text: subs.length + " subject" + (subs.length === 1 ? "" : "s") })]));
    subs.forEach(function (s) {
      var qn = (s.questions || []).length, cn = (s.concepts || []).filter(function (c) { return c.id !== "general"; }).length;
      box.appendChild(el("div", { class: "sh-row" }, [
        iconNode(s, 44),
        el("div", { class: "sh-row-main" }, [
          el("div", { class: "sh-row-title" }, [el("a", { href: "#/s/" + enc(s.id), text: s.title }), el("span", { class: "sh-label", text: "Public" })]),
          el("div", { class: "muted", text: s.description || "" }),
          el("div", { class: "sh-meta" }, [el("span", { text: cn + " " + (s.conceptsLabel || "concepts") }), qn ? el("span", { text: qn + " practice problems" }) : null])
        ])
      ]));
    });
    app.appendChild(box);
  }

  // ---------- subject shell (header + tabs) ----------
  function subjectHeader(s, tab) {
    var qn = (s.questions || []).length, cn = (s.concepts || []).filter(function (c) { return c.id !== "general"; }).length;
    var wrap = el("div");
    wrap.appendChild(el("div", { class: "sh-repo-head" }, [
      iconNode(s, 36),
      el("strong", null, [el("a", { href: "#/s/" + enc(s.id), text: s.title })])
    ]));
    wrap.appendChild(el("p", { class: "sh-desc", text: s.description || "" }));
    wrap.appendChild(el("div", { class: "sh-tabs" }, [
      el("a", { class: "sh-tab" + (tab === "concepts" ? " on" : ""), href: "#/s/" + enc(s.id) }, [document.createTextNode(s.conceptsLabel ? s.conceptsLabel.charAt(0).toUpperCase() + s.conceptsLabel.slice(1) : "Concepts"), el("span", { class: "sh-count", text: String(cn) })]),
      qn ? el("a", { class: "sh-tab" + (tab === "problems" ? " on" : ""), href: "#/s/" + enc(s.id) + "/problems" }, [document.createTextNode("Problems"), el("span", { class: "sh-count", text: String(qn) })]) : null
    ]));
    return wrap;
  }

  // ---------- concept view ----------
  function renderConcept(sid, cid) {
    var s = getSubject(sid);
    if (!s) { app.innerHTML = ""; app.appendChild(el("div", { class: "sh-empty", text: "Subject not found." })); return; }
    var concepts = s.concepts || [];
    if (!cid) cid = concepts[0] && concepts[0].id;
    var idx = concepts.findIndex(function (c) { return c.id === cid; });
    if (idx < 0) idx = 0;
    var c = concepts[idx];
    setCrumbs([{ text: "Dashboard", href: "#/" }, { text: s.title, href: "#/s/" + enc(sid) }, { text: c.title }]);

    // remember the sidebar's scroll position so a re-render does not jump it back to the top
    var oldTree = document.querySelector(".sh-tree");
    var keepScroll = oldTree && window.__treeSid === sid ? oldTree.scrollTop : null;
    window.__treeSid = sid;

    app.innerHTML = "";
    app.appendChild(subjectHeader(s, "concepts"));
    var layout = el("div", { class: "sh-layout" });

    // file-tree style concept list
    var tree = el("nav", { class: "sh-tree", "aria-label": "Concepts" });
    var lastLevel = null;
    concepts.forEach(function (x) {
      if (x.level !== lastLevel) { tree.appendChild(el("div", { class: "grp", text: x.level })); lastLevel = x.level; }
      var qCount = (s.questions || []).filter(function (q) { return q.concept === x.id; }).length;
      tree.appendChild(el("a", { href: "#/s/" + enc(sid) + "/c/" + x.id, class: x.id === c.id ? "on" : "" }, [
        el("span", { text: x.title }), (s.questions || []).length ? el("span", { class: "n", text: String(qCount) }) : null
      ]));
    });
    setTreeOpen(tree, !MOBILE.matches);

    var toggle = el("button", { type: "button", class: "sh-btn sm sh-toggle", "aria-expanded": "false" });
    function paintToggle() {
      var open = treeOpen(tree);
      toggle.innerHTML = ICON_MENU;
      toggle.setAttribute("aria-label", open ? "Hide concepts" : "Show concepts");
      toggle.setAttribute("title", open ? "Hide concepts" : "Show concepts");
      toggle.setAttribute("aria-expanded", String(open));
      layout.classList.toggle("no-tree", !open);
    }
    toggle.addEventListener("click", function () { setTreeOpen(tree, !treeOpen(tree)); paintToggle(); });
    paintToggle();
    MOBILE.addEventListener("change", paintToggle);
    toggle.classList.add("sh-hbtn");
    removeFab();
    var header = document.querySelector(".sh-header");
    header.insertBefore(toggle, header.firstChild);

    layout.appendChild(tree);

    var main = el("div");
    var article = conceptArticle(s, c);
    main.appendChild(article);
    if ((s.questions || []).length) main.appendChild(practice(s, c));
    var prev = concepts[idx - 1], next = concepts[idx + 1];
    main.appendChild(el("div", { class: "sh-pager" }, [
      prev ? el("a", { class: "sh-btn", href: "#/s/" + enc(sid) + "/c/" + prev.id, text: "← " + prev.title }) : el("span"),
      next ? el("a", { class: "sh-btn primary", href: "#/s/" + enc(sid) + "/c/" + next.id, text: next.title + " →" }) : el("span")
    ]));
    layout.appendChild(main);
    app.appendChild(layout);
    if (keepScroll !== null) tree.scrollTop = keepScroll;
    var on = tree.querySelector("a.on");
    if (on && tree.scrollHeight > tree.clientHeight) { // make sure the selected item is visible inside the sidebar
      // position of the item inside the tree's scrollable content (independent of the page scroll / sticky offset)
      var top = on.getBoundingClientRect().top - tree.getBoundingClientRect().top + tree.scrollTop, bottom = top + on.offsetHeight;
      if (top < tree.scrollTop) tree.scrollTop = top - 40;
      else if (bottom > tree.scrollTop + tree.clientHeight) tree.scrollTop = bottom - tree.clientHeight + 40;
    }
    if (location.hash.indexOf("/c/") >= 0 && window.__jumpReady) {
      if (MOBILE.matches) setTreeOpen(tree, false);
      article.scrollIntoView({ block: "start" });
    } else {
      window.scrollTo(0, 0);
    }
    window.__jumpReady = true;
  }

  function conceptArticle(s, c) {
    var box = el("article", { class: "sh-article" });
    box.appendChild(el("div", { class: "lvl" }, [el("span", { class: "sh-label accent", text: c.html ? c.level : "Level " + c.level })]));
    box.appendChild(el("h2", { text: c.title }));
    if (c.html) {
      var slideBox = el("div", { class: "cbdeck cb-slide " + (c.cls || "") });
      slideBox.innerHTML = c.html;
      box.appendChild(slideBox);
      if (window.CbDeck) window.CbDeck.mount(slideBox);
    }
    if (c.definition) box.appendChild(el("p", { class: "def", text: c.definition }));
    if (c.body) { var bodyBox = el("div", { class: "hx" }); bodyBox.innerHTML = c.body; box.appendChild(bodyBox); }
    if (c.widget && window.HWidgets && window.HWidgets[c.widget]) {
      var wBox = el("div", { class: "hx-widget" }); box.appendChild(wBox); window.HWidgets[c.widget](wBox);
    }
    if (c.points && c.points.length) {
      var ul = el("ul");
      c.points.forEach(function (p) { ul.appendChild(el("li", { text: p })); });
      box.appendChild(ul);
    }
    if (c.formula) box.appendChild(el("div", { class: "sh-code", text: c.formula }));
    if (c.svg) { var f = el("div", { class: "sh-figs" }); f.appendChild(svgFrag(c.svg)); box.appendChild(f); }
    if (c.img && c.img.length) {
      box.appendChild(el("p", { class: "sh-cap", text: "From the study notes (click to enlarge)" }));
      var figs = el("div", { class: "sh-figs" });
      c.img.forEach(function (p) {
        var src = "subjects/" + s.id + "/" + p;
        var im = el("img", { src: src, alt: c.title + " — study notes", loading: "lazy" });
        im.addEventListener("click", function () { lightbox(src); });
        figs.appendChild(im);
      });
      box.appendChild(figs);
    }
    if (c.source) box.appendChild(el("div", { class: "sh-src", text: "Source: " + c.source }));
    return box;
  }

  function practice(s, c) {
    var wrap = el("section", { class: "sh-section" });
    var qs = (s.questions || []).filter(function (q) { return q.concept === c.id; });
    wrap.appendChild(el("h3", null, [document.createTextNode("Practice problems"), el("span", { class: "sh-count", text: String(qs.length) })]));
    if (!qs.length) { wrap.appendChild(el("p", { class: "muted", text: "No exam problems are tagged to this concept yet." })); return wrap; }
    wrap.appendChild(el("p", { class: "muted", text: "Try each problem first, then press “Show answer”." }));
    return problemList(s, qs, wrap);
  }

  // shared filter + list for a set of problems
  function problemList(s, qs, container) {
    var state = { exam: "all", div: "all" };
    var examRow = el("div"), divRow = el("div"), list = el("div");
    function seg(row, key, values) {
      row.innerHTML = "";
      var group = el("div", { class: "sh-seg" });
      values.forEach(function (v) {
        var b = el("button", { type: "button", class: state[key] === v.val ? "on" : "", text: v.label });
        b.addEventListener("click", function () { state[key] = v.val; draw(); });
        group.appendChild(b);
      });
      row.appendChild(group);
    }
    function draw() {
      seg(examRow, "exam", [{ val: "all", label: "All exams" }, { val: "Regional", label: "Regional" }, { val: "State", label: "State" }, { val: "National", label: "National" }]);
      seg(divRow, "div", [{ val: "all", label: "Div B + C" }, { val: "B", label: "Division B" }, { val: "C", label: "Division C" }]);
      list.innerHTML = "";
      var shown = qs.filter(function (q) {
        var parts = q.exam.split(" · ");
        return (state.exam === "all" || parts[0] === state.exam) && (state.div === "all" || parts[1] === "Div " + state.div);
      });
      shown.forEach(function (q) { list.appendChild(problem(s, q)); });
      if (!shown.length) list.appendChild(el("div", { class: "sh-empty", text: "No problems match this filter." }));
    }
    container.appendChild(examRow); container.appendChild(divRow); container.appendChild(list);
    draw();
    return container;
  }

  function problem(s, q) {
    var card = el("div", { class: "sh-problem" });
    var typ = q.typ || "";
    var isMC = !!(q.options && q.options.length);
    var multi = /multi-select/i.test(typ);
    card.appendChild(el("div", { class: "sh-problem-head" }, [
      el("span", null, [el("strong", { text: q.exam }), document.createTextNode(" · #" + q.num + (q.pts ? " · " + q.pts + " pts" : "") + " · " + typ)])
    ]));
    var body = el("div", { class: "sh-problem-body" });
    if (q.img) {
      // the cropped exam image shows the question text and figure
      var src = "subjects/" + s.id + "/" + q.img;
      var im = el("img", { src: src, alt: "Question " + q.num + " from the exam", loading: "lazy" });
      im.addEventListener("click", function () { lightbox(src); });
      body.appendChild(el("div", { class: "sh-qfig" }, [im]));
    } else {
      body.appendChild(el("div", { class: "sh-stem", text: q.stem }));
    }

    var answerBox = el("div", { class: "sh-answer", hidden: true });
    var feedback = el("div", { class: "sh-feedback", hidden: true });
    var selected = {};
    var locked = false;
    var checkBtn, revealBtn;

    if (isMC) {
      body.appendChild(el("div", { class: "muted sh-hint", text: multi ? "Select ALL that apply, then check your answer." : "Select one answer, then check your answer." }));
      var ul = el("ul", { class: "sh-opts", role: multi ? "group" : "radiogroup" });
      var lis = [];
      q.options.forEach(function (o, i) {
        var li = el("li", { class: "sh-opt", tabindex: "0", role: multi ? "checkbox" : "radio", "aria-checked": "false" }, [
          el("span", { class: "L", text: String.fromCharCode(65 + i) + "." }), el("span", { class: "T", text: o })
        ]);
        function pick() {
          if (locked) return;
          if (multi) {
            selected[i] = !selected[i];
          } else {
            selected = {};
            selected[i] = true;
          }
          lis.forEach(function (x, k) {
            var on = !!selected[k];
            x.classList.toggle("sel", on);
            x.setAttribute("aria-checked", on ? "true" : "false");
          });
          checkBtn.disabled = !Object.keys(selected).some(function (k) { return selected[k]; });
        }
        li.addEventListener("click", pick);
        li.addEventListener("keydown", function (e) { if (e.key === " " || e.key === "Enter") { e.preventDefault(); pick(); } });
        lis.push(li);
        ul.appendChild(li);
      });
      body.appendChild(ul);

      checkBtn = el("button", { type: "button", class: "sh-btn primary sm", text: "Check answer", disabled: "disabled" });
      checkBtn.addEventListener("click", function () {
        if (locked) return;
        locked = true;
        var chosen = Object.keys(selected).filter(function (k) { return selected[k]; }).map(Number).sort();
        var want = q.correct.slice().sort();
        var right = chosen.length === want.length && chosen.every(function (v, i) { return v === want[i]; });
        lis.forEach(function (x, k) {
          var isRight = q.correct.indexOf(k) >= 0, picked = !!selected[k];
          if (isRight) x.classList.add("ok");
          if (picked && !isRight) x.classList.add("bad");
        });
        feedback.hidden = false;
        feedback.className = "sh-feedback " + (right ? "good" : "bad");
        feedback.textContent = right ? "Correct!" : "Not quite. The correct answer is " + want.map(function (k) { return String.fromCharCode(65 + k); }).join(", ") + ".";
        checkBtn.disabled = true;
        answerBox.hidden = false;
      });
      body.appendChild(el("div", { class: "sh-actions" }, [checkBtn]));
      body.appendChild(feedback);

      var names = q.correct.map(function (i) { return String.fromCharCode(65 + i); });
      answerBox.appendChild(el("div", { class: "sh-answer-head", text: "Answer: " + names.join(", ") + " — " + q.correct.map(function (i) { return q.options[i]; }).join("; ") }));
      answerBox.appendChild(el("div", { class: "sh-answer-body", text: q.explanation ? "Explanation: " + q.explanation : "No written explanation in the key." }));
    } else {
      body.appendChild(el("div", { class: "muted sh-hint", text: "Short / long answer: write your response, then compare with the sample answer." }));
      revealBtn = el("button", { type: "button", class: "sh-btn sm", text: "Show sample answer" });
      revealBtn.addEventListener("click", function () {
        var open = answerBox.hidden;
        answerBox.hidden = !open;
        revealBtn.textContent = open ? "Hide sample answer" : "Show sample answer";
      });
      body.appendChild(el("div", { class: "sh-actions" }, [revealBtn]));
      answerBox.appendChild(el("div", { class: "sh-answer-head", text: "Sample full-credit answer" }));
      answerBox.appendChild(el("div", { class: "sh-answer-body", text: q.sample || "See the answer key in the exam packet." }));
    }

    body.appendChild(answerBox);
    if (q.appears && q.appears.length > 1) body.appendChild(el("div", { class: "muted sh-hint", text: "Also appears as: " + q.appears.slice(1).join(", ") }));
    card.appendChild(body);
    return card;
  }

  // ---------- problems tab ----------
  function renderProblems(sid) {
    removeFab();
    var s = getSubject(sid);
    if (!s) { app.innerHTML = ""; app.appendChild(el("div", { class: "sh-empty", text: "Subject not found." })); return; }
    setCrumbs([{ text: "Dashboard", href: "#/" }, { text: s.title, href: "#/s/" + enc(sid) }, { text: "Problems" }]);
    app.innerHTML = "";
    app.appendChild(subjectHeader(s, "problems"));
    var wrap = el("section", { class: "sh-section", style: "margin-top:0" });
    wrap.appendChild(el("p", { class: "muted", text: "All exam problems in this subject. Each one also appears under its concept." }));
    problemList(s, s.questions || [], wrap);
    app.appendChild(wrap);
    window.scrollTo(0, 0);
  }

  // ---------- router ----------
  function route() {
    var h = location.hash.replace(/^#\/?/, "");
    var m;
    if ((m = h.match(/^s\/([^/]+)\/c\/([^/]+)/))) return renderConcept(decodeURIComponent(m[1]), decodeURIComponent(m[2]));
    if ((m = h.match(/^s\/([^/]+)\/problems/))) return renderProblems(decodeURIComponent(m[1]));
    if ((m = h.match(/^s\/([^/]+)/))) return renderConcept(decodeURIComponent(m[1]), null);
    renderHome();
  }
  window.addEventListener("hashchange", route);
  document.addEventListener("keydown", function (e) {
    if (e.target.closest && e.target.closest("input,textarea,select")) return;
    var links = document.querySelectorAll(".sh-pager a");
    if (e.key === "ArrowRight" && links[1]) links[1].click();
    if (e.key === "ArrowLeft" && links[0]) links[0].click();
  });
  route();
})();
