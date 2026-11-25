/**
 * Text an extension registered in English (header menu shortcuts, dashboard widget names and
 * descriptions), shown in the user's language when a translation exists under
 * `registry-text.<slug>`, where the slug is the text lower-cased with every run of other
 * characters replaced by "-" (at most 48 characters). Anything else is returned unchanged.
 */
export function registryTextKey(text) {
    const slug = String(text)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 48)
        .replace(/-+$/g, '');

    return slug ? `registry-text.${slug}` : null;
}

export default function registryText(intl, text) {
    if (typeof text !== 'string' || !text || !intl) {
        return text;
    }

    const key = registryTextKey(text);

    if (!key || !intl.exists(key)) {
        return text;
    }

    // A stubbed or misconfigured intl service can report a key as existing and return the
    // key (or a missing-translation message) itself; keep the registered text then.
    const translated = intl.t(key);

    return typeof translated === 'string' && translated && translated !== key && !translated.startsWith('registry-text.') && !translated.startsWith('Missing translation') ? translated : text;
}
