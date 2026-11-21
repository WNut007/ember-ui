import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { humanize } from 'ember-cli-string-helpers/helpers/humanize';

const BADGE_SIZE_CLASS = {
    xxs: 'status-badge-xxs',
    xs: 'status-badge-xs',
    sm: 'status-badge-sm',
    lg: 'status-badge-lg',
};

const BADGE_ICON_SIZE = {
    xxs: '2xs',
    xs: 'xs',
    sm: 'xs',
    lg: 'sm',
};

export default class BadgeComponent extends Component {
    @service intl;

    /**
     * Text shown in the badge. A status value with a translation under
     * `ember-ui.status.<value>` is shown translated, anything else is humanized.
     */
    get displayText() {
        const value = this.args.text || this.args.status;
        if (typeof value === 'string' && value.length) {
            const key = `ember-ui.status.${value
                .trim()
                .toLowerCase()
                .replace(/[\s-]+/g, '_')}`;
            if (this.intl?.exists?.(key)) {
                return this.intl.t(key);
            }
        }
        return humanize([`${value}`]);
    }

    get sizeClass() {
        return BADGE_SIZE_CLASS[this.args.size];
    }

    get iconSize() {
        return this.args.iconSize ?? BADGE_ICON_SIZE[this.args.size] ?? 'xs';
    }
}
