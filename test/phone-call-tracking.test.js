const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('/Users/kenichi/Projects/kaban/index.html', 'utf8');
const scriptMatches = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
const inlineScript = scriptMatches[scriptMatches.length - 1][1];

function createClassList(initialClasses = []) {
    const classes = new Set(initialClasses);

    return {
        add(name) {
            classes.add(name);
        },
        remove(name) {
            classes.delete(name);
        },
        contains(name) {
            return classes.has(name);
        },
        toggle(name, force) {
            if (typeof force === 'boolean') {
                if (force) {
                    classes.add(name);
                } else {
                    classes.delete(name);
                }
                return force;
            }

            if (classes.has(name)) {
                classes.delete(name);
                return false;
            }

            classes.add(name);
            return true;
        }
    };
}

function createEnvironment() {
    const documentListeners = {};
    const domContentLoadedCallbacks = [];
    const loadCallbacks = [];
    const phoneEvents = [];
    const scrollCalls = [];
    const historyCalls = [];
    const activeLinks = [];

    const toggleBtn = {
        classList: createClassList(),
        addEventListener(eventName, callback) {
            this[`on_${eventName}`] = callback;
        }
    };
    const spNav = { classList: createClassList() };
    const header = { offsetHeight: 88 };
    const sections = [{ id: 'top' }, { id: 'pricing' }];

    const createHeadRightLink = (href) => ({
        href,
        classList: {
            toggle(_className, isActive) {
                activeLinks.push({ href, isActive });
            }
        },
        getAttribute(name) {
            return name === 'href' ? href : null;
        }
    });

    const context = {
        console,
        setTimeout(fn) {
            fn();
            return 1;
        },
        clearTimeout() {},
        history: {
            pushState(_state, title, path) {
                historyCalls.push({ title, path });
            }
        },
        location: {
            pathname: '/',
            hash: ''
        },
        window: {
            pageYOffset: 0,
            location: {
                pathname: '/',
                hash: ''
            },
            addEventListener(eventName, callback) {
                if (eventName === 'popstate') {
                    this.popstateCallback = callback;
                } else if (eventName === 'load') {
                    loadCallbacks.push(callback);
                }
            },
            scrollTo(optionsOrX, maybeY) {
                if (typeof optionsOrX === 'object') {
                    scrollCalls.push(optionsOrX);
                    return;
                }

                scrollCalls.push({ top: maybeY, behavior: 'auto' });
            }
        },
        document: {
            title: 'Initial title',
            documentElement: {
                style: {}
            },
            querySelector(selector) {
                if (selector === 'header') return header;
                if (selector === '#fnMenuToggleButton') return toggleBtn;
                if (selector === '#spNav') return spNav;
                return null;
            },
            querySelectorAll(selector) {
                if (selector === '.head-right-link') {
                    return [createHeadRightLink('/'), createHeadRightLink('/pricing')];
                }
                if (selector === 'section, .pg-top') {
                    return sections;
                }
                return [];
            },
            getElementById(id) {
                if (id === 'fnMenuToggleButton') return toggleBtn;
                if (id === 'spNav') return spNav;
                if (id === 'top' || id === 'pricing') {
                    return {
                        id,
                        getBoundingClientRect() {
                            return { top: id === 'top' ? 0 : 320 };
                        }
                    };
                }
                return null;
            },
            addEventListener(eventName, callback) {
                if (eventName === 'click') {
                    documentListeners.click = callback;
                } else if (eventName === 'DOMContentLoaded') {
                    domContentLoadedCallbacks.push(callback);
                }
            }
        },
        IntersectionObserver: class {
            constructor(callback) {
                this.callback = callback;
            }

            observe() {}
        },
        gtag(...args) {
            phoneEvents.push(args);
        }
    };

    context.window.history = context.history;
    context.window.document = context.document;
    context.window.gtag = context.gtag;
    context.globalThis = context;

    vm.createContext(context);
    vm.runInContext(inlineScript, context);

    for (const callback of domContentLoadedCallbacks) {
        callback();
    }
    for (const callback of loadCallbacks) {
        callback();
    }

    return {
        click(event) {
            documentListeners.click(event);
        },
        phoneEvents,
        scrollCalls,
        historyCalls,
        activeLinks,
        toggleBtn,
        spNav
    };
}

function createClickEvent(link) {
    return {
        defaultPrevented: false,
        preventDefault() {
            this.defaultPrevented = true;
        },
        target: {
            closest(selector) {
                return selector === 'a' ? link : null;
            }
        }
    };
}

test('tracks tel links as phone_call with location metadata', () => {
    const env = createEnvironment();
    const link = {
        textContent: '',
        ariaLabel: '電話をかける',
        className: 'floating-tel-button',
        closest(selector) {
            return selector === '.floating-tel-button' ? this : null;
        },
        getAttribute(name) {
            if (name === 'href') return 'tel:0552413449';
            if (name === 'aria-label') return '電話をかける';
            return null;
        }
    };

    env.click(createClickEvent(link));

    assert.equal(env.phoneEvents.length, 1);
    const [eventType, eventName, eventParams] = env.phoneEvents[0];
    assert.equal(eventType, 'event');
    assert.equal(eventName, 'phone_call');
    assert.equal(eventParams.click_location, 'floating_button');
    assert.equal(eventParams.link_url, 'tel:0552413449');
    assert.equal(eventParams.link_text, '電話をかける');
    assert.equal(eventParams.page_path, '/');
});

test('keeps internal route clicks working without sending phone_call', () => {
    const env = createEnvironment();
    const link = {
        closest() {
            return null;
        },
        getAttribute(name) {
            return name === 'href' ? '/pricing' : null;
        }
    };
    const event = createClickEvent(link);

    env.click(event);

    assert.equal(event.defaultPrevented, true);
    assert.equal(env.phoneEvents.length, 0);
    assert.deepEqual(env.historyCalls, [
        {
            title: '修理メニュー・料金 | 波切カバン店',
            path: '/pricing'
        }
    ]);
    assert.equal(env.toggleBtn.classList.contains('menu-active'), false);
    assert.equal(env.spNav.classList.contains('active'), false);
});
