export function isMobile(): boolean {
    return window.innerWidth < 768;
}

export function isTablet(): boolean {
    return window.innerWidth <= 992;
}

export function isDesktop(): boolean {
    return window.innerWidth > 992;
}
