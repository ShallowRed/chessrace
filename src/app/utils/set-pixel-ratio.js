const vendorKeys = [
    "webkitBackingStorePixelRatio",
    "mozBackingStorePixelRatio",
    "msBackingStorePixelRatio",
    "oBackingStorePixelRatio",
    "backingStorePixelRatio"
];
export const PIXEL_RATIO = (() => {
    const ctx = document.createElement('canvas')
        .getContext('2d');
    const devicePixelRatio = window.devicePixelRatio || 1;
    let backingStorePixelRatio = 1;
    for (const vendorKey of vendorKeys) {
        const vendorBackingPixelRatio = ctx[vendorKey];
        if (vendorBackingPixelRatio) {
            backingStorePixelRatio = vendorBackingPixelRatio;
        }
    }
    return devicePixelRatio / backingStorePixelRatio;
})();
