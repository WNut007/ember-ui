import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
import formatCurrencyUtil from '../utils/format-currency';

/**
 * Format an amount as money. With no currency given, the organization's currency is used
 * (it used to fall back to USD, so Thai companies saw "$0.00" on records without a currency).
 */
export default class FormatCurrencyHelper extends Helper {
    @service currentUser;

    compute([amount = 0, currencyCode]) {
        const currency = currencyCode || this.defaultCurrency || 'USD';
        return formatCurrencyUtil(amount, currency);
    }

    get defaultCurrency() {
        try {
            return this.currentUser?.company?.currency || this.currentUser?.currency || null;
        } catch {
            return null;
        }
    }
}
