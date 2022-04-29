export function isMobile(): boolean {
    return window.innerWidth < 768; // 48em
}

export function isTablet(): boolean {
    return window.innerWidth <= 992; // 62em
}

export function isDesktop(): boolean {
    return window.innerWidth > 992;
}
