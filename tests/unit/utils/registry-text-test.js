import registryText, { registryTextKey } from '@fleetbase/ember-ui/utils/registry-text';
import { module, test } from 'qunit';

const intl = (messages) => ({
    exists: (key) => key in messages,
    t: (key) => messages[key],
});

module('Unit | Utility | registry-text', function () {
    test('the key is the slugged text, at most 48 characters', function (assert) {
        assert.strictEqual(registryTextKey('Revenue Trend'), 'registry-text.revenue-trend');
        assert.strictEqual(registryTextKey('Invoicing, payments, accounting, and real-time financial reporting.'), 'registry-text.invoicing-payments-accounting-and-real-time-fina');
    });

    test('a registered translation replaces the text; anything else is unchanged', function (assert) {
        const service = intl({ 'registry-text.revenue-trend': 'แนวโน้มรายได้' });
        assert.strictEqual(registryText(service, 'Revenue Trend'), 'แนวโน้มรายได้');
        assert.strictEqual(registryText(service, 'Wallets'), 'Wallets');
        assert.strictEqual(registryText(service, null), null);
        assert.strictEqual(registryText(intl({ 'registry-text.wallets': 'registry-text.wallets' }), 'Wallets'), 'Wallets');
    });
});
