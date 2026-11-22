import { module, test } from 'qunit';
import { setupRenderingTest } from 'dummy/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { clearCountryNameCache } from '@fleetbase/ember-ui/components/country-name';

module('Integration | Component | country-name', function (hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function () {
        clearCountryNameCache();
    });

    test('it looks up and renders the country name for a 2-letter code', async function (assert) {
        const fetch = this.owner.lookup('service:fetch');
        fetch.responses['lookup/country/US'] = { name: 'United States' };

        await render(hbs`<CountryName @country="US" />`);

        assert.dom(this.element).hasText('United States');

        const lookupCall = fetch.calls.find((call) => call.args[0] === 'lookup/country/US');
        assert.ok(lookupCall, 'country lookup was requested');
    });

    test('it renders the argument directly when it is not a 2-letter code', async function (assert) {
        await render(hbs`<CountryName @country="Singapore" />`);

        assert.dom(this.element).hasText('Singapore');

        const fetch = this.owner.lookup('service:fetch');
        assert.strictEqual(fetch.calls.length, 0, 'no lookup performed');
    });

    test('it falls back to the code when the lookup returns no name', async function (assert) {
        await render(hbs`<CountryName @country="XX" />`);

        assert.dom(this.element).hasText('XX');
    });

    test('it renders a dash when no country is provided', async function (assert) {
        await render(hbs`<CountryName />`);

        assert.dom(this.element).hasText('-');
    });

    test('one lookup per country however many cells show it', async function (assert) {
        const fetch = this.owner.lookup('service:fetch');
        fetch.responses['lookup/country/TH'] = { name: 'Thailand' };

        await render(hbs`<CountryName @country="TH" /> <CountryName @country="TH" /> <CountryName @country="th" />`);

        assert.dom(this.element).hasText('Thailand Thailand Thailand');
        assert.strictEqual(fetch.calls.filter((call) => /lookup\/country\/th/i.test(call.args[0])).length, 1, 'asked once');
    });

    test('a failed lookup is retried by the next cell', async function (assert) {
        const fetch = this.owner.lookup('service:fetch');
        const originalGet = fetch.get;
        let fail = true;
        fetch.get = function (...args) {
            if (fail) {
                fail = false;
                this.calls.push({ method: 'get', args });
                return Promise.reject(new Error('offline'));
            }
            return originalGet.apply(this, args);
        };
        fetch.responses['lookup/country/JP'] = { name: 'Japan' };

        await render(hbs`<CountryName @country="JP" />`);
        await render(hbs`<CountryName @country="JP" />`);

        assert.dom(this.element).hasText('Japan');
        assert.strictEqual(fetch.calls.filter((call) => call.args[0] === 'lookup/country/JP').length, 2, 'asked again after the failure');
    });
});
