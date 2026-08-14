/**
 * Peek - a Scroll Intent Header / Headroom-style header behavior that hides on scroll down and shows on scroll up
 * Hides header on scroll down, shows on scroll up
 * @author Chad Pierce
 * @version 1.0.0
 * @license MIT
 * @copyright 2022 A Design Link, LLC
 * @description Peek - a Scroll Intent Header / Headroom-style header behavior that hides on scroll down and shows on scroll up
 * @github https://github.com/adesignl/Peek
 * @param {HTMLElement|string} element - Header element or selector
 * @param {Object} options - Configuration options
 * @param {number} options.offset - Scroll offset before triggering (default: 100)
 * @param {number} options.tolerance - Pixels scrolled before state change (default: 5)
 * @param {string} options.classes.pinned - Class when header is pinned (default: 'header--pinned')
 * @param {string} options.classes.unpinned - Class when header is unpinned (default: 'header--unpinned')
 * @param {string} options.classes.top - Class when at top of page (default: 'header--top')
 * @param {string} options.classes.notTop - Class when not at top (default: 'header--not-top')
 *
 * Example:
 * BS.Peek('.header-main');
 * BS.Peek('.header-main', { offset: 150, tolerance: 10 });
 */
function Peek(element, options = {}) {
	// Default options
	const defaults = {
		offset: 100,
		tolerance: 5,
		classes: {
			pinned: 'main-header--pinned',
			unpinned: 'main-header--unpinned',
			top: 'main-header--top',
			notTop: 'main-header--not-top',
		},
	};

	// Merge options with defaults
	const settings = {
		...defaults,
		...options,
		classes: { ...defaults.classes, ...(options.classes || {}) },
	};

	// Get element
	const el =
		typeof element === 'string' ? document.querySelector(element) : element;

	if (!el) {
		console.warn('Headroom element not found:', element);
		return;
	}

	// State tracking
	let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
	let isAtTop = true;
	let isPinned = true;
	let ticking = false;

	/**
	 * Update header state based on scroll position
	 */
	function update() {
		const scrollY =
			window.pageYOffset || document.documentElement.scrollTop;
		const scrollDirection = scrollY > lastScrollY ? 'down' : 'up';
		const scrollDelta = Math.abs(scrollY - lastScrollY);

		// Check if at top of page
		if (scrollY <= settings.offset) {
			if (!isAtTop) {
				isAtTop = true;
				el.classList.add(settings.classes.top);
				el.classList.remove(settings.classes.notTop);
				el.classList.add(settings.classes.pinned);
				el.classList.remove(settings.classes.unpinned);
				isPinned = true;
			}
		} else {
			if (isAtTop) {
				isAtTop = false;
				el.classList.remove(settings.classes.top);
				el.classList.add(settings.classes.notTop);
			}

			// Only change pin state if scrolled enough
			if (scrollDelta >= settings.tolerance) {
				if (scrollDirection === 'down' && isPinned) {
					// Scrolling down - hide header
					isPinned = false;
					el.classList.remove(settings.classes.pinned);
					el.classList.add(settings.classes.unpinned);
				} else if (scrollDirection === 'up' && !isPinned) {
					// Scrolling up - show header
					isPinned = true;
					el.classList.add(settings.classes.pinned);
					el.classList.remove(settings.classes.unpinned);
				}
			}
		}

		lastScrollY = scrollY;
		ticking = false;
	}

	/**
	 * Request animation frame for smooth updates
	 */
	function requestTick() {
		if (!ticking) {
			window.requestAnimationFrame(update);
			ticking = true;
		}
	}

	// Initialize - set initial state
	el.classList.add(settings.classes.top);
	el.classList.add(settings.classes.pinned);

	// Attach scroll listener
	window.addEventListener('scroll', requestTick, { passive: true });

	// Return destroy function
	return {
		destroy: function () {
			window.removeEventListener('scroll', requestTick);
			el.classList.remove(
				settings.classes.pinned,
				settings.classes.unpinned,
				settings.classes.top,
				settings.classes.notTop
			);
		},
	};
}
