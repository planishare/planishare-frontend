import { animate, style, transition, trigger } from "@angular/animations";

// States
const fromYState = style({ height: 0, opacity: 0, transform: 'translateY(100vh)' });
const toYState = style({ height: '*', opacity: .8, transform: 'translateY(0)' });

const fromLeftState = style({ width: '80%', opacity: 0, transform: 'translateX(-100vw)', overflowX: 'hidden', whiteSpace: 'nowrap' });
const fromRightState = style({ width: '80%', opacity: 0, transform: 'translateX(100vw)', overflowX: 'hidden', whiteSpace: 'nowrap' });
const toXState = style({ width: '*', opacity: .8, transform: 'translateX(0)', overflowX: 'hidden', whiteSpace: 'nowrap' });

// Animations
export const fadeInOutAnimation = trigger(
    'fadeInOut', [
        transition(':enter', [ style({ opacity: 0 }), animate('.2s ease-out', style({ opacity: 1 })) ]),
        transition(':leave', [ style({ opacity: 1 }), animate('.15s ease-in', style({ opacity: 0 })) ])
    ]
);

export const inOutYAnimation = trigger(
    'inOutY', [
        transition(':enter', [ fromYState, animate('.2s ease-out', toYState) ]),
        transition(':leave', [ toYState, animate('.15s ease-in', fromYState) ])
    ]
);

export const inOutLeftAnimation = trigger(
    'inOutLeft', [
        transition(':enter', [ fromLeftState, animate('.15s ease-out', toXState) ]),
        transition(':leave', [ toXState, animate('.15s ease-in', fromLeftState) ])
    ]
);

export const inOutRightAnimation = trigger(
    'inOutRight', [
        transition(':enter', [ fromRightState, animate('.15s ease-out', toXState) ]),
        transition(':leave', [ toXState, animate('.15s ease-in', fromRightState) ])
    ]
);
