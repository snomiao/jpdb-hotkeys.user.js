// ==UserScript==
// @name         JPDB Hotkeys
// @namespace    https://docs.scriptcat.org/
// @version      0.1.1
// @description  Hotkeys for jpdb.io review page, enable wasd or hjkl to grade reviews.
// @author       snomiao
// @match        https://jpdb.io/review*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jpdb.io
// @grant        none
// @updateURL    https://github.com/snomiao/jpdb-hotkeys.user.js/raw/main/jpdb-hotkeys.user.js
// ==/UserScript==

const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const tap = (fn) => (v) => {
  fn(v);
  return v;
};
const $$click = (sel, text) =>
  $$(sel)
    .filter((e) => (text && e.textContent?.match(text)) || e.value?.match(text))
    .map(tap(console.log))
    .map(tap((e) => e.click()))
    .at(0);
const $$clickBtn = (text) =>
  $$click("button,input[type=submit],input[type=button]", text);
const hotkeyMapper = (map) => (e) =>
  Object.entries(map)
    .filter(([k, _v]) =>
      k
        .toLowerCase()
        .trim()
        .split(/,/)
        .some(
          (k) =>
            `alt,ctrl,shift,meta`
              .split(",")
              .every((m) => k.includes(m) === e[`${m}Key`]) &&
            (k.split("+").includes(e.key.toLowerCase()) ||
              k.split("+").includes(e.code.toLowerCase().replace(/^key/, "")))
          ,
        ),
    )
    .map(tap(console.log))
    .map(tap(([_, v]) => v()))
    .at(0)
  && e.stopPropagation() | e.preventDefault() | 1

const grades = [
  /Nothing|don't know/,
  /Hard|but may forget/,
  /Easy|I know this/,
];
const clickGrade = (grade) =>
  $$clickBtn(grades[grade - 1]) || $$clickBtn(/Yes, keep going!|Show answer/);

const keymap = {
  "h,a": () => clickGrade(3),
  "s,j": () => clickGrade(2),
  "d,l": () => clickGrade(1),
  "5,t,semicolon": () => $$clickBtn("Blacklist"),
};
// run
window._jpdb_hotkey_ ??= {};
const g = window._jpdb_hotkey_;
g?.ac?.abort();
g.ac = new AbortController();
window.addEventListener("keydown", hotkeyMapper(keymap), {
  signal: g.ac.signal,
});

$$("svg.kanji")[0] && $$clickBtn("Blacklist");
$$('#show-checkbox-examples')[0].checked === false && $$('label').filter(e => e.textContent.match(/toggle examples.../)).map(e => (e.click(), e))
