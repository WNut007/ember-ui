import { module, test } from 'qunit';
import { setupTest } from 'dummy/tests/helpers';
import Service from '@ember/service';

const UNITS = { 'ember-ui.duration.d': 'วัน', 'ember-ui.duration.h': 'ชม.' };

module('Unit | Helper | format-duration', function (hooks) {
    setupTest(hooks);

    test('it puts each unit in the user language when a translation exists', function (assert) {
        this.owner.unregister('service:intl');
        this.owner.register(
            'service:intl',
            class extends Service {
                exists() {
                    return true;
                }
                t(key, { n }) {
                    return `${n} ${UNITS[key]}`;
                }
            }
        );
        const helper = this.owner.factoryFor('helper:format-duration').create();

        assert.strictEqual(helper.compute([115200]), '1 วัน 8 ชม.');
    });

    test('it falls back to compact English units without translations', function (assert) {
        this.owner.unregister('service:intl');
        this.owner.register(
            'service:intl',
            class extends Service {
                exists() {
                    return false;
                }
            }
        );
        const helper = this.owner.factoryFor('helper:format-duration').create();

        assert.strictEqual(helper.compute([115200]), '1d 8h');
    });
});
