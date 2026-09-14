import { useEffect } from 'react';

/**
 * Custom Animate On Scroll (AOS) Hook using IntersectionObserver
 * Automatically detects [data-aos] elements, applies staggered delays, and triggers smooth enter animations on scroll, page load, and route change.
 */
export function useAOS(dependency = null) {
  useEffect(() => {
    const handleIntersect = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = el.getAttribute('data-aos-delay') || 0;

          setTimeout(() => {
            el.classList.add('aos-animate');
          }, Number(delay));

          const once = el.getAttribute('data-aos-once');
          if (once !== 'false') {
            observer.unobserve(el);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1,
    });

    const elements = document.querySelectorAll('[data-aos]');
    elements.forEach((el) => observer.observe(el));

    // Use MutationObserver to detect dynamically added [data-aos] elements (e.g. from network requests)
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            if (node.hasAttribute('data-aos')) {
              observer.observe(node);
            }
            const childElements = node.querySelectorAll('[data-aos]');
            childElements.forEach((el) => observer.observe(el));
          }
        });
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      mutationObserver.disconnect();
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [dependency]);
}
