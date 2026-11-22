export const secondsToTime = (secs) => {
    const value = Number(secs);
    const totalSeconds = Number.isFinite(value) ? Math.max(0, Math.ceil(value)) : 0;
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
        d: days,
        h: hours,
        m: minutes,
        s: seconds,
    };
};

const compactUnit = (unit, n) => `${n}${unit}`;

/**
 * Seconds as a compact duration ("1d 8h", "20m 34s"). `unit(unit, n)` renders one part, so a caller
 * can put each unit in the user's language; the default is the compact English form.
 */
export default function formatDuration(secs, unit = compactUnit) {
    const time = secondsToTime(secs);
    const parts = [];

    if (time.d) {
        parts.push(unit('d', time.d));
    }

    if (time.h) {
        parts.push(unit('h', time.h));
    }

    if (!time.d && time.m) {
        parts.push(unit('m', time.m));
    }

    if (!time.d && !time.h && parts.length < 2 && time.s) {
        parts.push(unit('s', time.s));
    }

    return parts.length ? parts.join(' ') : unit('s', 0);
}
