/* ============================================================================
   scrollcraft: scroll-driven worldflight engine
   ----------------------------------------------------------------------------
   Vanilla JS. Zero dependencies. Drives the worldflight page grammar:
   one fixed stage, continuous crossfade between legs, camera dolly on posters,
   kinetic text reveals, and cue-choreographed copy blocks.
   ========================================================================== */

(function (global) {
  'use strict';

  // ── feature detection ──────────────────────────────────────────────────
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function (x, a, b) { return x < a ? a : x > b ? b : x; };
  var clamp01 = function (x) { return clamp(x, 0, 1); };
  // hermite smoothstep — gives crossfades that ease in and out
  var smooth = function (x) { x = clamp01(x); return x * x * (3 - 2 * x); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };

  // Monotone linger remap. Settles the camera mid-segment (where copy peaks)
  // and moves quicker at the edges. f(0)=0, f(1)=1 always.
  function lingerEase(x, L) {
    if (!L) return x;
    L = clamp(L, 0, 0.6);
    var c = x - 0.5;
    return (1 - L) * x + L * (4 * c * c * c + 0.5);
  }

  // ── text splitting ─────────────────────────────────────────────────────
  // Wraps each unit in a masked span so the reveal slides from behind a clean
  // edge. Lines are measured after layout.
  function splitText(el, mode) {
    if (el.__scSplit) return el.__scSplit;
    var text = el.textContent;
    var units = [];

    if (mode === 'chars' || mode === 'words') {
      var parts = mode === 'chars' ? Array.from(text) : text.split(/(\s+)/);
      el.textContent = '';
      parts.forEach(function (t) {
        if (/^\s+$/.test(t)) { el.appendChild(document.createTextNode(t)); return; }
        var mask = document.createElement('span');
        mask.className = 'sc-split';
        var inner = document.createElement('span');
        inner.className = 'sc-split__i';
        inner.textContent = t;
        mask.appendChild(inner);
        el.appendChild(mask);
        units.push(inner);
      });
    } else {
      // lines: wrap every word, measure offsetTop, regroup into line spans
      var words = text.split(/\s+/).filter(Boolean);
      el.textContent = '';
      var probes = words.map(function (w, i) {
        var s = document.createElement('span');
        s.textContent = w;
        el.appendChild(s);
        if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
        return s;
      });
      var lines = [], cur = null, lastTop = null;
      probes.forEach(function (s) {
        var top = s.offsetTop;
        if (lastTop === null || Math.abs(top - lastTop) > 1) { cur = []; lines.push(cur); lastTop = top; }
        cur.push(s.textContent);
      });
      el.textContent = '';
      lines.forEach(function (words, li) {
        var mask = document.createElement('span');
        mask.className = 'sc-split sc-split--line';
        var inner = document.createElement('span');
        inner.className = 'sc-split__i';
        inner.textContent = words.join(' ');
        mask.appendChild(inner);
        el.appendChild(mask);
        if (li < lines.length - 1) el.appendChild(document.createTextNode(' '));
        units.push(inner);
      });
    }
    el.classList.add('sc-is-split');
    el.__scSplit = units;
    return units;
  }

  // ── mount ──────────────────────────────────────────────────────────────
  function mount(root) {
    root = root || document;

    var vh = innerHeight;
    var y = 0;            // current smoothed scroll
    var yTarget = 0;      // raw scroll target
    var needsLayout = true;
    var worlds = [];

    var LERP = reduce ? 1 : 0.18;  // reduced motion = instant
    var DEADBAND = 0.5;

    // ── collect worlds ───────────────────────────────────────────────────
    Array.prototype.forEach.call(
      root.querySelectorAll('[data-sc-mode="worldflight"]'),
      function (container) {
        var worldEl = container.querySelector('[data-sc-world]') || container;
        var copyContainer = container.querySelector('[data-sc-world-copy]');
        var spacer = container.querySelector('[data-sc-spacer]');
        var seam = parseFloat(container.dataset.scSeam) || 0.12;

        // build the fixed stage
        var stage = document.createElement('div');
        stage.className = 'sc-world';
        stage.setAttribute('aria-hidden', 'true');

        // wrap each segment
        var rawSegs = Array.prototype.slice.call(container.querySelectorAll('[data-sc-segment]'));
        var segs = rawSegs.map(function (el, i) {
          var seg = document.createElement('div');
          seg.className = 'sc-world__seg';
          seg.style.cssText = 'position:absolute;inset:0;opacity:0;will-change:opacity;';

          // move children into the seg wrapper
          while (el.firstChild) seg.appendChild(el.firstChild);
          el.appendChild(seg);

          return {
            el: seg,
            poster: seg.querySelector('.sc-world__poster'),
            weight: parseFloat(el.dataset.scW) || 1.3,
            linger: parseFloat(el.dataset.scLinger) || 0,
            waypoint: el.dataset.scWaypoint || '',
            start: 0, end: 0
          };
        });

        // compute segment boundaries
        var total = 0;
        segs.forEach(function (s) { s.start = total; total += s.weight; s.end = total; });

        // collect copy blocks
        var copies = copyContainer
          ? Array.prototype.slice.call(copyContainer.querySelectorAll('[data-sc-copy]')).map(function (el) {
              var cueSpec = el.dataset.scCue || '';
              var windowSpec = el.dataset.scWindow || 'hero';
              var cueParts = cueSpec.split(/[\s,]+/).map(parseFloat).filter(function (n) { return !isNaN(n); });
              // split text elements with data-sc-kinetic
              var kineticEls = Array.prototype.slice.call(el.querySelectorAll('[data-sc-kinetic]'));
              return {
                el: el,
                windowSpec: windowSpec,
                cueStart: cueParts[0] || 0,
                cueEnd: cueParts[1] || 1,
                kineticEls: kineticEls,
                kineticUnits: kineticEls.map(function (k) {
                  return splitText(k, k.dataset.scKinetic || 'lines');
                })
              };
            })
          : [];

        // set spacer height
        if (spacer) spacer.style.height = ((total + 1) * vh) + 'px';

        // insert stage before the copy container in the DOM
        container.insertBefore(stage, copyContainer);

        worlds.push({
          container: container,
          stage: stage,
          segs: segs,
          copies: copies,
          spacer: spacer,
          seam: seam,
          totalWeight: total,
          top: 0,
          height: 0
        });
      }
    );

    if (worlds.length === 0) return;

    // ── progress bar ─────────────────────────────────────────────────────
    var progressBar = root.querySelector('[data-sc-progress]');

    // ── layout pass ──────────────────────────────────────────────────────
    function layout() {
      vh = innerHeight;
      worlds.forEach(function (w) {
        var rect = w.container.getBoundingClientRect();
        w.top = rect.top + (y / LERP);  // approximate; refined each frame
        w.height = rect.height;
        // recompute spacer
        if (w.spacer) w.spacer.style.height = ((w.totalWeight + 1) * vh) + 'px';
      });
      needsLayout = false;
    }

    // ── update loop ──────────────────────────────────────────────────────
    function tick() {
      // lerp toward target
      var diff = yTarget - y;
      if (Math.abs(diff) > DEADBAND) {
        y += diff * LERP;
      } else {
        y = yTarget;
      }

      if (needsLayout) layout();

      worlds.forEach(function (w) { updateWorld(w); });
      updateProgress();
    }

    function updateWorld(w) {
      var scrollInWorld = y - w.container.offsetTop;
      var progress = scrollInWorld / vh;  // 0 = top of world, N = bottom

      // ── segment crossfade + camera dolly ─────────────────────────────
      w.segs.forEach(function (seg) {
        var segProgress = (progress - seg.start) / seg.weight;  // 0..1 within this segment

        // linger remap — dwell in the middle
        var remapped = lingerEase(segProgress, seg.linger);

        // opacity crossfade with seam band
        var opacity = 0;
        var seamHalf = w.seam / seg.weight;
        if (segProgress >= -seamHalf && segProgress <= 1 + seamHalf) {
          if (segProgress < 0) {
            opacity = smooth((segProgress + seamHalf) / seamHalf);
          } else if (segProgress > 1) {
            opacity = smooth(1 - (segProgress - 1) / seamHalf);
          } else {
            opacity = 1;
          }
          opacity = clamp01(opacity);
        }

        seg.el.style.opacity = opacity;
        seg.el.style.visibility = opacity > 0.001 ? 'visible' : 'hidden';
        seg.el.style.zIndex = opacity > 0 ? 10 : 0;

        // camera dolly — Ken Burns push-in on the poster
        if (seg.poster && !reduce) {
          // scale from 1.0 to 1.12 as the segment plays through
          var scale = 1 + 0.12 * clamp01(remapped);
          // subtle vertical drift — top of frame to slightly lower
          var translateY = -2 + 4 * clamp01(remapped);
          seg.poster.style.transform = 'scale(' + scale + ') translateY(' + translateY + '%)';
        }
      });

      // ── copy blocks ─────────────────────────────────────────────────
      w.copies.forEach(function (copy) {
        var visible = false;
        var opacity = 0;
        var cueProgress = 0;  // 0..1 within the cue window

        if (copy.windowSpec === 'hero') {
          visible = progress < 0.5;
          opacity = visible ? 1 : 0;
          cueProgress = clamp01(progress / 0.4);
        } else if (copy.windowSpec === 'finale') {
          visible = progress > w.totalWeight - 1;
          opacity = visible ? 1 : 0;
          cueProgress = clamp01((progress - (w.totalWeight - 1)) / 0.8);
        } else {
          // numeric window spec: "start end"
          var parts = copy.windowSpec.split(/[\s,]+/).map(parseFloat).filter(function (n) { return !isNaN(n); });
          if (parts.length >= 2) {
            var winStart = parts[0];
            var winEnd = parts[1];
            var winRange = winEnd - winStart;
            if (progress >= winStart && progress <= winEnd) {
              visible = true;
              cueProgress = clamp01((progress - winStart) / winRange);
            }
          }
        }

        // cue-based opacity: fade in, hold, fade out
        if (visible) {
          var cueIn = copy.cueStart;
          var cueOut = copy.cueEnd;
          var cueRange = cueOut - cueIn;
          if (cueRange > 0) {
            var fadeInEnd = cueIn + cueRange * 0.25;
            var fadeOutStart = cueOut - cueRange * 0.25;
            if (cueProgress < fadeInEnd) {
              opacity = smooth(cueProgress / fadeInEnd);
            } else if (cueProgress > fadeOutStart) {
              opacity = smooth((cueOut - cueProgress) / (cueOut - fadeOutStart));
            } else {
              opacity = 1;
            }
          } else {
            opacity = 1;
          }
        }

        copy.el.style.opacity = clamp01(opacity);
        copy.el.style.visibility = visible ? 'visible' : 'hidden';
        copy.el.style.pointerEvents = visible ? 'auto' : 'none';

        // translateY reveal — rises from below on enter
        if (!reduce && visible) {
          var rise = 12 * (1 - clamp01(opacity));
          copy.el.style.transform = 'translateY(' + rise + 'px)';
        } else if (reduce) {
          copy.el.style.transform = 'none';
        }

        // kinetic text stagger
        if (!reduce) {
          copy.kineticUnits.forEach(function (units) {
            var count = units.length;
            units.forEach(function (unit, i) {
              var stagger = count > 1 ? i / (count - 1) : 0;
              // each unit reveals within a sub-slice of the cue window
              var unitStart = cueProgress - stagger * 0.4;
              var unitOpacity = clamp01(unitStart * 3);
              var unitRise = 8 * (1 - unitOpacity);
              unit.style.opacity = unitOpacity;
              unit.style.transform = 'translateY(' + unitRise + 'px)';
            });
          });
        }
      });
    }

    function updateProgress() {
      if (!progressBar) return;
      var maxScroll = document.documentElement.scrollHeight - vh;
      if (maxScroll <= 0) return;
      var pct = clamp01(y / maxScroll);
      progressBar.style.transform = 'scaleX(' + pct + ')';
    }

    // ── events ───────────────────────────────────────────────────────────
    function onScroll() {
      yTarget = window.scrollY || window.pageYOffset;
      if (!ticking) { requestAnimationFrame(tick); ticking = true; }
    }
    var ticking = false;

    function onResize() {
      vh = innerHeight;
      needsLayout = true;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    // ── kick off ─────────────────────────────────────────────────────────
    yTarget = window.scrollY || window.pageYOffset;
    y = reduce ? yTarget : yTarget;  // no lerp on first frame
    needsLayout = true;
    layout();
    tick();
  }

  // ── public API ─────────────────────────────────────────────────────────
  global.ScrollCraft = { mount: mount };

  // auto-init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { mount(); });
  } else {
    mount();
  }

})(typeof window !== 'undefined' ? window : this);
