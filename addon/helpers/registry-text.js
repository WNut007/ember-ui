import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
import registryText from '../utils/registry-text';

export default class RegistryTextHelper extends Helper {
    @service intl;

    compute([text]) {
        return registryText(this.intl, text);
    }
}
