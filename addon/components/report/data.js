import Component from '@glimmer/component';
import { action } from '@ember/object';

function csvCell(value) {
    if (value === null || value === undefined) return '';
    const text = typeof value === 'object' ? JSON.stringify(value) : String(value);
    return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/**
 * Report result table. "Export CSV" builds the file from the rows already shown: the server
 * export endpoint is unfinished upstream (no download route, PDF stub).
 */
export default class ReportDataComponent extends Component {
    get rows() {
        return this.args.resource?.data ?? [];
    }

    get limit() {
        return this.args.resource?.query_config?.limit;
    }

    /** The rows stop exactly at the query limit, so there are probably more records than shown. */
    get limitReached() {
        return Boolean(this.limit) && this.rows.length >= this.limit;
    }

    get columns() {
        return this.args.resource?.result_columns ?? [];
    }

    @action exportCsv() {
        const lines = [this.columns.map((column) => csvCell(column.label ?? column.name)).join(',')];
        for (const row of this.rows) {
            lines.push(this.columns.map((column) => csvCell(row?.[column.name])).join(','));
        }

        // BOM so Excel opens Thai text as UTF-8
        const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const title = String(this.args.resource?.title ?? 'report').replace(/[\\/:*?"<>|]+/g, '-');
        link.href = url;
        link.download = `${title}.csv`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
}
