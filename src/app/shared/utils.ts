// TODO-OPT: stop using this in html templates, prefer use css media queries
// TODO-OPT: replace isMobile for isMobileX
export const isMobileX = window.innerWidth < 768; // 48rem

export function isMobile(): boolean {
    return window.innerWidth < 768; // 48rem
}

export function isTablet(): boolean {
    return window.innerWidth <= 992; // 62rem
}

export function isDesktop(): boolean {
    return window.innerWidth > 992;
}
