/* Mounts the live tools and exam sheets inside a Codebusters slide.
   Ported from the original deck's app.js; the tool and sheet behaviour is unchanged. */
(function () {
  "use strict";
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; }); };

  function buildTool(el, TOOLS) {
    var def = TOOLS[el.dataset.tool];
    var form = document.createElement("form");
    form.className = "tool-form";
    form.addEventListener("submit", function (e) { e.preventDefault(); });
    var title = document.createElement("h4");
    title.textContent = def.title;
    form.appendChild(title);
    var row = document.createElement("div");
    row.className = "tool-fields";
    var inputs = {};
    def.fields.forEach(function (f) {
      var label = document.createElement("label");
      if (f.wide) label.className = "wide";
      var span = document.createElement("span");
      span.textContent = f.label;
      label.appendChild(span);
      var input;
      if (f.type === "select") {
        input = document.createElement("select");
        f.options.forEach(function (o) {
          var opt = document.createElement("option");
          opt.textContent = o;
          input.appendChild(opt);
        });
      } else {
        input = document.createElement("input");
        input.type = f.type === "number" ? "number" : "text";
        input.autocomplete = "off";
        input.spellcheck = false;
      }
      input.value = f.value;
      inputs[f.name] = input;
      label.appendChild(input);
      row.appendChild(label);
    });
    form.appendChild(row);
    var out = document.createElement("div");
    out.className = "tool-out";
    out.setAttribute("aria-live", "polite");
    form.appendChild(out);
    function run() {
      var values = {};
      Object.keys(inputs).forEach(function (k) { values[k] = inputs[k].value; });
      try { out.innerHTML = def.run(values); }
      catch (err) { out.innerHTML = '<p class="muted">Cannot compute: ' + esc(err.message) + "</p>"; }
    }
    form.addEventListener("input", run);
    form.addEventListener("change", run);
    el.replaceWith(form);
    run();
  }

  window.CbDeck = {
    mount: function (container) {
      var S = window.Slides;
      container.querySelectorAll(".tool").forEach(function (el) { buildTool(el, S.TOOLS); });
      container.querySelectorAll(".sheet-slot").forEach(function (el) { window.Sheet.mount(el, S.SHEETS[el.dataset.sheet]); });
    }
  };
})();
