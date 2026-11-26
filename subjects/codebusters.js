/* Codebusters (Science Olympiad Division B 2026–27).
   The slide content, ciphers and exam sheets live in subjects/codebusters/ (copied unchanged from
   the original deck). This file registers the slides as the concepts of one subject. */
(function () {
  if (!window.Slides) return;
  var slides = window.Slides.slides;
  var concepts = slides.map(function (s, i) {
    return {
      id: "s" + (i + 1),
      level: s.section,
      title: s.title || "Codebusters, Division B 2026–27",
      html: s.html,
      cls: s.cls || "",
      definition: "", points: [], formula: "", source: "", img: [], svg: null
    };
  });
  window.SUBJECTS = window.SUBJECTS || [];
  window.SUBJECTS.push({
    id: "codebusters",
    title: "Codebusters (Science Olympiad Division B 2026–27)",
    description: "Every Division B Codebusters cipher, from simplest to hardest, with worked examples, exam sheets, and live tools.",
    conceptsLabel: "slides",
    icon: '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" rx="12" fill="#ece4ff"/><g fill="none" stroke="#8250df" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="11" y="18" width="18" height="13" rx="3"/><path d="M15 18v-4a5 5 0 0 1 10 0v4"/></g><circle cx="20" cy="24.5" r="1.8" fill="#8250df"/></svg>',
    concepts: concepts,
    questions: []
  });
})();
