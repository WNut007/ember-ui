import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
import formatDurationUtil from '../utils/format-duration';

export function formatDurationValue(secs, unit) {
    return formatDurationUtil(secs, unit);
}

/**
 * {{format-duration seconds}}: a compact duration with each unit in the user's language
 * (ember-ui.duration.d|h|m|s), falling back to the compact English form.
 */
export default class FormatDurationHelper extends Helper {
    @service intl;

    compute([secs]) {
        return formatDurationValue(secs, (unit, n) => {
            const key = `ember-ui.duration.${unit}`;

            return this.intl.exists(key) ? this.intl.t(key, { n }) : `${n}${unit}`;
        });
    }
}
