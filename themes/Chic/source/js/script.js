// declaraction of document.ready() function.
(function () {
    var ie = !!(window.attachEvent && !window.opera);
    var wk = /webkit\/(\d+)/i.test(navigator.userAgent) && (RegExp.$1 < 525);
    var fn = [];
    var run = function () {
        for (var i = 0; i < fn.length; i++) fn[i]();
    };
    var d = document;
    d.ready = function (f) {
        if (!ie && !wk && d.addEventListener)
            return d.addEventListener('DOMContentLoaded', f, false);
        if (fn.push(f) > 1) return;
        if (ie)
            (function () {
                try {
                    d.documentElement.doScroll('left');
                    run();
                } catch (err) {
                    setTimeout(arguments.callee, 0);
                }
            })();
        else if (wk)
            var t = setInterval(function () {
                if (/^(loaded|complete)$/.test(d.readyState))
                    clearInterval(t), run();
            }, 0);
    };
})();


document.ready(
    // toggleTheme function.
    // this script shouldn't be changed.
    () => {
        var _Blog = window._Blog || {};
        const pagebody = document.getElementsByTagName('body')[0];
        const toggleButton = document.getElementById('theme-toggle');
        const mobileToggle = document.getElementById('mobile-toggle-theme');

        const setTheme = (isDark, shouldPersist = true) => {
            pagebody.classList.toggle('dark-theme', isDark);

            if (toggleButton) {
                toggleButton.setAttribute('aria-pressed', isDark ? 'true' : 'false');
            }
            if (mobileToggle) {
                mobileToggle.innerText = isDark ? 'Dark' : 'Light';
            }

            if (shouldPersist) {
                window.localStorage &&
                window.localStorage.setItem('theme', isDark ? 'dark' : 'light');
            }
        };

        const currentTheme = window.localStorage && window.localStorage.getItem('theme');
        setTheme(currentTheme === 'dark', false);

        _Blog.toggleTheme = function () {
            if (toggleButton) {
                toggleButton.addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setTheme(!pagebody.classList.contains('dark-theme'));
                });
            }

            if (mobileToggle) {
                mobileToggle.addEventListener('click', () => {
                    setTheme(!pagebody.classList.contains('dark-theme'));
                });
            }
        };
        _Blog.toggleTheme();
        // ready function.
    }
);

document.ready(() => {
    const revealItems = document.querySelectorAll('.about-reveal, .project-reveal, .story-item, .about-project-card, .showcase-card, .publication-card');
    if (!revealItems.length) return;

    if (!('IntersectionObserver' in window)) {
        revealItems.forEach((item) => item.classList.add('is-visible'));
        return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.16,
        rootMargin: '0px 0px -40px 0px'
    });

    revealItems.forEach((item) => revealObserver.observe(item));
});

document.ready(() => {
    const filterButtons = document.querySelectorAll('[data-project-filter]');
    const projectCards = document.querySelectorAll('[data-project-kind]');
    if (!filterButtons.length || !projectCards.length) return;

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const activeFilter = button.getAttribute('data-project-filter');

            filterButtons.forEach((item) => item.classList.toggle('is-active', item === button));
            projectCards.forEach((card) => {
                const projectKinds = (card.getAttribute('data-project-kind') || '').split(' ');
                const shouldShow = activeFilter === 'all' || projectKinds.includes(activeFilter);

                card.classList.toggle('is-hidden', !shouldShow);
            });
        });
    });
});

document.ready(() => {
    const modal = document.getElementById('project-modal');
    const projectCards = document.querySelectorAll('.showcase-card');
    if (!modal || !projectCards.length) return;

    const titleEl = document.getElementById('project-modal-title');
    const kickerEl = document.getElementById('project-modal-kicker');
    const summaryEl = document.getElementById('project-modal-summary');
    const metaEl = document.getElementById('project-modal-meta');
    const highlightsEl = document.getElementById('project-modal-highlights');
    const stackEl = document.getElementById('project-modal-stack');
    const linkEl = document.getElementById('project-modal-link');

    const closeModal = () => {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
    };

    const openModal = (card) => {
        const dataEl = card.querySelector('.project-data');
        if (!dataEl) return;
        const detail = JSON.parse(dataEl.textContent);

        titleEl.innerText = detail.title;
        kickerEl.innerText = detail.meta.join(' · ');
        summaryEl.innerText = detail.summary;
        metaEl.innerHTML = '';
        detail.meta.forEach((item) => {
            const span = document.createElement('span');
            span.innerText = item;
            metaEl.appendChild(span);
        });
        highlightsEl.innerHTML = '';
        detail.highlights.forEach((item) => {
            const li = document.createElement('li');
            li.innerText = item;
            highlightsEl.appendChild(li);
        });
        stackEl.innerHTML = '';
        detail.stack.forEach((item) => {
            const span = document.createElement('span');
            span.innerText = item;
            stackEl.appendChild(span);
        });

        if (detail.link) {
            linkEl.href = detail.link;
            linkEl.innerText = detail.linkText || 'Open link';
            linkEl.style.display = 'inline-flex';
        } else {
            linkEl.style.display = 'none';
        }

        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        modal.querySelector('.project-modal-close').focus();
    };

    projectCards.forEach((card) => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');

        card.addEventListener('click', (event) => {
            if (event.target.closest('a')) return;
            openModal(card);
        });

        card.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            openModal(card);
        });
    });

    modal.querySelectorAll('[data-project-modal-close]').forEach((item) => {
        item.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });
});
