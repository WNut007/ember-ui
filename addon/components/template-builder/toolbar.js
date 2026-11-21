import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { action } from '@ember/object';

/**
 * TemplateBuilderToolbarComponent
 *
 * Top toolbar for the template builder. Provides:
 * - Element type buttons (add text, image, table, line, shape, QR, barcode)
 * - Zoom controls
 * - Undo / Redo
 * - Preview and Save/Publish actions
 *
 * @argument {Number}   zoom             - Current zoom level (e.g. 1 = 100%)
 * @argument {Object}   selectedElement  - Currently selected element (or null)
 * @argument {Boolean}  canUndo          - Whether undo is available
 * @argument {Boolean}  canRedo          - Whether redo is available
 * @argument {Boolean}  isSaving         - Whether a save is in progress
 * @argument {Function} onAddElement     - Called with element type string
 * @argument {Function} onZoomIn         - Called when zoom in is clicked
 * @argument {Function} onZoomOut        - Called when zoom out is clicked
 * @argument {Function} onZoomReset      - Called when zoom reset is clicked
 * @argument {Function} onUndo           - Called when undo is clicked
 * @argument {Function} onRedo           - Called when redo is clicked
 * @argument {Function} onPreview        - Called when preview is clicked
 * @argument {Function} onSave           - Called when save is clicked
 * @argument {Function} onRotateElement  - Called with (uuid, deltaDegrees)
 * @argument {Function} [onClose]        - Optional. If provided, a close/back button is rendered on the left.
 * @argument {String}   [closeIcon]      - FontAwesome icon name for the close button (default: 'chevron-left')
 * @argument {String}   [closeLabel]     - Text label shown beside the close icon (default: none)
 */
export default class TemplateBuilderToolbarComponent extends Component {
    @service intl;
    elementTypes = [
        { type: 'text', icon: 'font', label: this.intl.t('ember-ui.js.components.template-builder.toolbar.text') },
        { type: 'image', icon: 'image', label: this.intl.t('ember-ui.js.components.template-builder.toolbar.image') },
        { type: 'table', icon: 'table', label: this.intl.t('ember-ui.js.components.template-builder.toolbar.table') },
        { type: 'line', icon: 'minus', label: this.intl.t('ember-ui.js.components.template-builder.toolbar.line') },
        { type: 'shape', icon: 'square', label: this.intl.t('ember-ui.js.components.template-builder.toolbar.shape') },
        { type: 'qr_code', icon: 'qrcode', label: this.intl.t('ember-ui.js.components.template-builder.toolbar.qr-code') },
        { type: 'barcode', icon: 'barcode', label: this.intl.t('ember-ui.js.components.template-builder.toolbar.barcode') },
    ];

    get zoomPercent() {
        return `${Math.round((this.args.zoom ?? 1) * 100)}%`;
    }

    @action
    addElement(type) {
        if (this.args.onAddElement) {
            this.args.onAddElement(type);
        }
    }

    @action
    zoomIn() {
        if (this.args.onZoomIn) this.args.onZoomIn();
    }

    @action
    zoomOut() {
        if (this.args.onZoomOut) this.args.onZoomOut();
    }

    @action
    zoomReset() {
        if (this.args.onZoomReset) this.args.onZoomReset();
    }

    @action
    undo() {
        if (this.args.onUndo) this.args.onUndo();
    }

    @action
    redo() {
        if (this.args.onRedo) this.args.onRedo();
    }

    @action
    preview() {
        if (this.args.onPreview) this.args.onPreview();
    }

    @action
    save() {
        if (this.args.onSave) this.args.onSave();
    }

    @action
    close() {
        /* istanbul ignore else -- the close button is rendered inside {{#if @onClose}}, so this action cannot run without the callback */
        if (this.args.onClose) this.args.onClose();
    }

    @action
    rotateLeft() {
        if (this.args.onRotateElement && this.args.selectedElement) {
            this.args.onRotateElement(this.args.selectedElement.uuid, -90);
        }
    }

    @action
    rotateRight() {
        if (this.args.onRotateElement && this.args.selectedElement) {
            this.args.onRotateElement(this.args.selectedElement.uuid, 90);
        }
    }
}
