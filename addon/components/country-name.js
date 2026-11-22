import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';
import getWithDefault from '@fleetbase/ember-core/utils/get-with-default';

/**
 * Represents the `CountryName` component which fetches and sets the name of a country.
 *
 * @class CountryNameComponent
 * @extends {Component}
 * @memberof @fleetbase/ember-ui
 *
 * @property {Service} fetch - Service for fetching data.
 * @property {string} countryName - The name of the country.
 *
 * @example
 * // Usage:
 * <CountryName @country="US" />
 */
/**
 * Country names already asked for, by code: a table shows one country cell per row, and
 * without this every row requested the same country again.
 */
const countryNameRequests = new Map();

export function clearCountryNameCache() {
    countryNameRequests.clear();
}

export default class CountryNameComponent extends Component {
    /**
     * Fetch service
     *
     * @type {Service}
     * @memberof CountryNameComponent
     */
    @service fetch;

    /**
     * The country name property.
     *
     * @type {String}
     * @memberof CountryNameComponent
     */
    @tracked countryName;

    /**
     * Creates an instance of CountryNameComponent.
     * @param {ApplicationInstance} owner
     * @param {Object|country=string} { country }
     * @memberof CountryNameComponent
     */
    constructor(owner, { country }) {
        super(...arguments);
        this.setCountryName(country);
    }

    /**
     * Asynchronously sets the country name. If the country code is a 2-letter string,
     * it fetches the country name; otherwise, it uses the country argument as the country name.
     *
     * @private
     * @param {string} country - The country code or country name.
     * @returns {void}
     */
    async setCountryName(country) {
        later(
            this,
            () => {
                if (typeof country === 'string' && country.length === 2) {
                    const code = country.toUpperCase();
                    if (!countryNameRequests.has(code)) {
                        const request = this.fetch.get(`lookup/country/${country}`).then((response) => getWithDefault(response, 'name', country));
                        // A failed lookup is not remembered, so a later cell can try again.
                        request.catch(() => countryNameRequests.delete(code));
                        countryNameRequests.set(code, request);
                    }
                    const show = (name) => {
                        if (!this.isDestroying && !this.isDestroyed) {
                            this.countryName = name;
                        }
                    };
                    countryNameRequests.get(code).then(show, () => show(country));
                } else {
                    this.countryName = country;
                }
            },
            300
        );
    }
}
