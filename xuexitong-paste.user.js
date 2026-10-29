// ==UserScript==
// @name         Xuexitong Paste Unblock (fallback)
// @namespace    user-local
// @version      1.0
// @description  Allow copy/paste in Xuexitong/Chaoxing assignment editors by neutralising page-level copy/paste blockers. Fallback only if the browser extensions did not work.
// @match        *://*.chaoxing.com/*
// @match        *://*.xuexitong.com/*
// @match        *://*.mooc.chaoxing.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==
(function () {
  'use strict';
  var events = ['copy', 'cut', 'paste', 'contextmenu', 'selectstart', 'dragstart'];
  events.forEach(function (type) {
    document.addEventListener(type, function (e) { e.stopPropagation(); }, true);
  });
  function clean(root) {
    if (!root || !root.querySelectorAll) return;
    root.querySelectorAll('*').forEach(function (el) {
      ['oncopy', 'oncut', 'onpaste', 'oncontextmenu', 'onselectstart'].forEach(function (attr) {
        if (el[attr]) el[attr] = null;
      });
      if (el.style) el.style.userSelect = 'text';
    });
    document.body && (document.body.style.userSelect = 'text');
  }
  document.addEventListener('DOMContentLoaded', function () { clean(document); });
  // Rich-text editors often live in iframes; re-apply after they load.
  window.addEventListener('load', function () {
    clean(document);
    Array.prototype.forEach.call(document.querySelectorAll('iframe'), function (frame) {
      try { clean(frame.contentDocument); } catch (err) { /* cross-origin frame: skip */ }
    });
  });
})();
