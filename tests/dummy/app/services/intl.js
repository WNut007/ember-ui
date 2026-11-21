import Service from '@ember/service';
import formatMessage, { hasMessage } from '../utils/format-message';

/**
 * Stub of the host console's `intl` service. `t(key)` echoes the key back, except
 * `ember-ui.*` keys, which return their English text (utils/ember-ui-messages.js).
 * Matches the dummy app's `t` helper (tests/dummy/app/helpers/t.js).
 */
export default class IntlService extends Service {
    calls = [];

    locales = ['en-us'];
    locale = ['en-us'];
    primaryLocale = 'en-us';

    _localeChangedCallbacks = [];

    t(key, options) {
        this.calls.push({ method: 't', args: [key, options] });
        return formatMessage(key, options);
    }

    exists(key) {
        this.calls.push({ method: 'exists', args: [key] });
        return typeof key === 'string' && key.startsWith('ember-ui.') ? hasMessage(key) : true;
    }

    setLocale(locale) {
        this.calls.push({ method: 'setLocale', args: [locale] });
        this.primaryLocale = Array.isArray(locale) ? locale[0] : locale;
        this.locale = Array.isArray(locale) ? locale : [locale];
        for (const callback of [...this._localeChangedCallbacks]) {
            callback();
        }
    }

    onLocaleChanged(callback) {
        this._localeChangedCallbacks.push(callback);
        return callback;
    }
}
