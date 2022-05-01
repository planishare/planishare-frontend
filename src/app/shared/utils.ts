export function isMobile(): boolean {
    return window.innerWidth < 768; // 48rem
}

export function isTablet(): boolean {
    return window.innerWidth <= 992; // 62rem
}

export function isDesktop(): boolean {
    return window.innerWidth > 992;
}
