/* scrollcraft.js - scroll-driven interaction engine */
(function() {
  'use strict';

  // Core scroll state
  let scrollY = 0;
  let viewportHeight = 0;
  let viewportWidth = 0;
  let documentHeight = 0;
  let ticking = false;

  // World state
  const worlds = [];
  let currentWorld = null;

  // Initialize scrollcraft
  function init() {
    updateDimensions();
    findWorlds();
    bindEvents();
    update();
  }

  // Update viewport dimensions
  function updateDimensions() {
    viewportHeight = window.innerHeight;
    viewportWidth = window.innerWidth;
    documentHeight = document.documentElement.scrollHeight;
    scrollY = window.scrollY || window.pageYOffset;
  }

  // Find all worldflight containers
  function findWorlds() {
    const worldElements = document.querySelectorAll('[data-sc-mode="worldflight"]');
    worldElements.forEach(el => {
      const world = createWorld(el);
      worlds.push(world);
    });
    if (worlds.length > 0) {
      currentWorld = worlds[0];
    }
  }

  // Create world object from element
  function createWorld(element) {
    const segments = Array.from(element.querySelectorAll('[data-sc-segment]'));
    const copyBlocks = Array.from(element.querySelectorAll('[data-sc-copy]'));
    const spacer = element.querySelector('[data-sc-spacer]');

    return {
      element,
      segments: segments.map(createSegment),
      copyBlocks: copyBlocks.map(createCopyBlock),
      spacer,
      seam: parseFloat(element.dataset.scSeam) || 0.12,
      top: 0,
      height: 0
    };
  }

  // Create segment object
  function createSegment(element, index) {
    const poster = element.querySelector('.sc-world__poster');
    return {
      element,
      index,
      weight: parseFloat(element.dataset.scW) || 1.3,
      linger: parseFloat(element.dataset.scLinger) || 0,
      waypoint: element.dataset.scWaypoint || '',
      poster,
      top: 0,
      height: 0
    };
  }

  // Create copy block object
  function createCopyBlock(element) {
    const windowSpec = element.dataset.scWindow || 'hero';
    return {
      element,
      windowSpec,
      top: 0,
      height: 0
    };
  }

  // Bind scroll and resize events
  function bindEvents() {
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
  }

  // Scroll handler
  function onScroll() {
    scrollY = window.scrollY || window.pageYOffset;
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  // Resize handler
  function onResize() {
    updateDimensions();
    update();
  }

  // Main update loop
  function update() {
    ticking = false;
    if (currentWorld) {
      updateWorld(currentWorld);
    }
  }

  // Update world state
  function updateWorld(world) {
    const worldRect = world.element.getBoundingClientRect();
    world.top = worldRect.top + scrollY;
    world.height = worldRect.height;

    // Calculate total weight for spacer height
    const totalWeight = world.segments.reduce((sum, seg) => sum + seg.weight, 0);
    const spacerHeight = (totalWeight + 1) * viewportHeight;
    if (world.spacer) {
      world.spacer.style.height = spacerHeight + 'px';
    }

    // Update each segment
    world.segments.forEach((segment, index) => {
      updateSegment(segment, world, index);
    });

    // Update copy blocks
    world.copyBlocks.forEach(copyBlock => {
      updateCopyBlock(copyBlock, world);
    });
  }

  // Update segment visibility and opacity
  function updateSegment(segment, world, index) {
    const segmentStart = getSegmentStart(world, index);
    const segmentEnd = segmentStart + segment.weight;
    const scrollProgress = (scrollY - world.top) / viewportHeight;

    // Calculate opacity based on scroll position
    let opacity = 0;
    const seam = world.seam;

    if (scrollProgress >= segmentStart - seam && scrollProgress <= segmentEnd + seam) {
      if (scrollProgress < segmentStart) {
        // Fading in
        opacity = (scrollProgress - (segmentStart - seam)) / seam;
      } else if (scrollProgress > segmentEnd) {
        // Fading out
        opacity = 1 - ((scrollProgress - segmentEnd) / seam);
      } else {
        // Fully visible
        opacity = 1;
      }
      opacity = Math.max(0, Math.min(1, opacity));
    }

    segment.element.style.opacity = opacity;
    segment.element.style.visibility = opacity > 0 ? 'visible' : 'hidden';
    segment.element.style.zIndex = opacity > 0 ? 10 + index : 0;
  }

  // Get segment start position
  function getSegmentStart(world, index) {
    let start = 0;
    for (let i = 0; i < index; i++) {
      start += world.segments[i].weight;
    }
    return start;
  }

  // Update copy block visibility
  function updateCopyBlock(copyBlock, world) {
    const scrollProgress = (scrollY - world.top) / viewportHeight;
    const totalWeight = world.segments.reduce((sum, seg) => sum + seg.weight, 0);

    let visible = false;
    let opacity = 0;

    if (copyBlock.windowSpec === 'hero') {
      // Hero is visible at the start
      visible = scrollProgress < 0.5;
      opacity = visible ? 1 : 0;
    } else if (copyBlock.windowSpec === 'finale') {
      // Finale is visible at the end
      visible = scrollProgress > totalWeight - 1;
      opacity = visible ? 1 : 0;
    } else {
      // Parse window spec "start end"
      const parts = copyBlock.windowSpec.split(' ').map(parseFloat);
      if (parts.length === 2) {
        const [start, end] = parts;
        visible = scrollProgress >= start && scrollProgress <= end;
        if (visible) {
          // Fade in/out at edges
          const fadeInEnd = start + 0.1;
          const fadeOutStart = end - 0.1;
          if (scrollProgress < fadeInEnd) {
            opacity = (scrollProgress - start) / 0.1;
          } else if (scrollProgress > fadeOutStart) {
            opacity = (end - scrollProgress) / 0.1;
          } else {
            opacity = 1;
          }
          opacity = Math.max(0, Math.min(1, opacity));
        }
      }
    }

    copyBlock.element.style.opacity = opacity;
    copyBlock.element.style.visibility = visible ? 'visible' : 'hidden';
    copyBlock.element.style.pointerEvents = visible ? 'auto' : 'none';
  }

  // Public API
  window.ScrollCraft = {
    init,
    mount: init
  };

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
