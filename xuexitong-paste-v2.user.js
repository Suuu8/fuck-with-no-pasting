// ==UserScript==
// @name         Xuexitong Paste Unblock v2 (iframe-aware)
// @namespace    user-local
// @version      2.0
// @description  Allow paste in Xuexitong/Chaoxing assignment editors, including editors living in iframes. v2 fixes v1's gap: v1 only cleaned iframes once on window load and never installed a capture listener inside them.
// @match        *://*.chaoxing.com/*
// @match        *://*.xuexitong.com/*
// @match        *://*.mooc.chaoxing.com/*
// @grant        none
// @run-at       document-start
// @all-frames   true
// ==/UserScript==
(function () {
  'use strict';
  var BLOCKED = ['copy', 'cut', 'paste', 'beforepaste', 'contextmenu', 'selectstart', 'dragstart'];
  function unblock(doc) {
    if (!doc || doc.__xxtUnblocked) return;
    doc.__xxtUnblocked = true;
    BLOCKED.forEach(function (type) {
      doc.addEventListener(type, function (e) {
        // Capture phase, before the page's own handler runs: stop it
        // from seeing the event. Do NOT preventDefault(), so the
        // browser's own paste action still happens.
        e.stopImmediatePropagation();
      }, true);
    });
  }
  function clean(root) {
    if (!root || !root.querySelectorAll) return;
    root.querySelectorAll('*').forEach(function (el) {
      ['oncopy', 'oncut', 'onpaste', 'oncontextmenu', 'onselectstart'].forEach(function (attr) {
        try { if (el[attr]) el[attr] = null; } catch (err) { /* ignore */ }
      });
      try { if (el.style) el.style.userSelect = 'text'; } catch (err) { /* ignore */ }
    });
    try { if (root.body) root.body.style.userSelect = 'text'; } catch (err) { /* ignore */ }
  }
  function installInto(doc) {
    unblock(doc);
    clean(doc);
    if (doc.body && !doc.__xxtObserved) {
      doc.__xxtObserved = true;
      var observer = new MutationObserver(function () { clean(doc); });
      observer.observe(doc.body, { childList: true, subtree: true, attributes: true });
    }
    // Same-origin iframes added later (rich-text editors often load late):
    // install into them as they appear, not just once on window load.
    doc.querySelectorAll('iframe').forEach(function (frame) {
      frame.addEventListener('load', function () {
        try { installInto(frame.contentDocument); } catch (err) { /* cross-origin: skip */ }
      });
      try { installInto(frame.contentDocument); } catch (err) { /* cross-origin: skip */ }
    });
  }
  installInto(document);
  document.addEventListener('DOMContentLoaded', function () { installInto(document); });
  window.addEventListener('load', function () { installInto(document); });
})();
