import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ReportBuilderExportOptionsComponent extends Component {
    @service intl;
    @tracked exportOptions = [
        { value: 'csv', label: this.intl.t('ember-ui.js.components.report-builder.export-options.csv') },
        { value: 'xlsx', label: this.intl.t('ember-ui.js.components.report-builder.export-options.excel-xlsx') },
        { value: 'json', label: this.intl.t('ember-ui.js.components.report-builder.export-options.json') },
    ];

    // PowerSelect is given whole option objects and renders `{{option.label}}`, so the default
    // has to be the OPTION, not the bare string 'csv' — a string selection renders a blank
    // trigger and `format.value` is undefined until the picker is touched.
    @tracked format = this.exportOptions[0];

    @action setFormat(val) {
        this.format = val;
    }

    @action export() {
        /* istanbul ignore next -- the Export button is rendered `@disabled={{@disabled}}`, so it
           cannot be clicked while this is true. */
        if (!this.args.disabled) this.args.onExport?.(this.format.value);
    }
}
