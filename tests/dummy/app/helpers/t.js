import { helper } from '@ember/component/helper';
import formatMessage from '../utils/format-message';

/**
 * Stub of the host console's `{{t}}` translation helper. Echoes the key back, except
 * `ember-ui.*` keys, which return their English text. Matches the dummy `intl` service.
 */
export function t([key], options = {}) {
    return formatMessage(key, options);
}

export default helper(t);
