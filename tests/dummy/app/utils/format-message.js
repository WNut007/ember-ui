import messages from './ember-ui-messages';

/**
 * Minimal ICU formatting for the dummy app: `{name}` arguments, `''` and quoted braces.
 * Keys outside `ember-ui.*` are echoed back, like the original stubs.
 */
export default function formatMessage(key, options = {}) {
    const message = messages[key];
    if (message === undefined) {
        return key ?? '';
    }
    // Split on quoted braces so they are kept literally, then fill arguments in the rest.
    return message
        .split(/('[{}]')/)
        .map((part) =>
            /^'[{}]'$/.test(part) ? part[1] : part.replace(/\{\s*([\w.]+)\s*\}/g, (match, name) => (options?.[name] === undefined || options?.[name] === null ? '' : String(options[name])))
        )
        .join('')
        .replace(/''/g, "'");
}

export function hasMessage(key) {
    return Object.prototype.hasOwnProperty.call(messages, key);
}
