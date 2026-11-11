/* «Менталист» — дело № RJ-2008. Интерактив досье. */
(function () {
    document.documentElement.classList.add('js');

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Плавное появление блоков при прокрутке */
    var revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && !reduceMotion) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealEls.forEach(function (el) { revealObserver.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }

    /* Дорисовка смайла Кровавого Джона */
    var smileys = document.querySelectorAll('.smiley');
    if ('IntersectionObserver' in window && !reduceMotion) {
        var smileObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-drawn');
                    smileObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });
        smileys.forEach(function (el) { smileObserver.observe(el); });
    } else {
        smileys.forEach(function (el) { el.classList.add('is-drawn'); });
    }

    /* Тень шапки при прокрутке */
    var header = document.querySelector('.header-block');
    if (header) {
        var onScroll = function () {
            header.classList.toggle('is-scrolled', window.scrollY > 8);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* Анимированные счётчики наград */
    var counters = document.querySelectorAll('[data-count]');
    var animateCounter = function (el) {
        var target = parseFloat(el.getAttribute('data-count'));
        var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
        if (reduceMotion) {
            el.textContent = target.toFixed(decimals);
            return;
        }
        var duration = 1200;
        var start = null;
        var step = function (ts) {
            if (!start) { start = ts; }
            var p = Math.min((ts - start) / duration, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = (target * eased).toFixed(decimals);
            if (p < 1) { requestAnimationFrame(step); }
        };
        requestAnimationFrame(step);
    };
    if ('IntersectionObserver' in window) {
        var countObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    countObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(function (el) { countObserver.observe(el); });
    } else {
        counters.forEach(animateCounter);
    }

    /* Лента сезонов (вкладки) */
    var tabs = document.querySelectorAll('.season-tabs button');
    var panels = document.querySelectorAll('.season-panel');
    tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            tabs.forEach(function (t) { t.setAttribute('aria-selected', 'false'); });
            tab.setAttribute('aria-selected', 'true');
            var key = tab.getAttribute('data-season');
            panels.forEach(function (panel) {
                panel.classList.toggle('is-hidden', panel.getAttribute('data-season') !== key);
            });
        });
    });

    /* Рассекречивание слов по клику */
    document.querySelectorAll('.redacted').forEach(function (el) {
        el.setAttribute('title', 'Нажми, чтобы рассекретить');
        el.addEventListener('click', function () {
            el.classList.add('is-open');
            el.removeAttribute('title');
        });
    });

    /* Печать на странице Кровавого Джона */
    var gate = document.querySelector('[data-gate]');
    var classified = document.querySelector('[data-classified]');
    var flash = document.querySelector('.flash');
    var openBtn = document.querySelector('[data-open-case]');
    if (gate && classified && openBtn) {
        openBtn.addEventListener('click', function () {
            if (flash && !reduceMotion) {
                flash.classList.remove('is-on');
                void flash.offsetWidth; /* перезапуск анимации вспышки */
                flash.classList.add('is-on');
            }
            gate.classList.add('is-hidden');
            classified.classList.remove('is-hidden');
            classified.querySelectorAll('.reveal').forEach(function (el) {
                el.classList.add('is-visible');
            });
            var firstHeading = classified.querySelector('h2, h3');
            if (firstHeading) { firstHeading.setAttribute('tabindex', '-1'); firstHeading.focus(); }
        });
    }
})();
