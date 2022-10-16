import { animate, style, transition, trigger } from "@angular/animations";

// States
const fromYState = style({ height: 0, opacity: 0, transform: 'translateY(2rem)' });
const toYState = style({ height: '*', opacity: .8, transform: 'translateY(0)' });

const fromLeftState = style({ width: 0, opacity: 0, transform: 'translateX(2rem)' });
const fromRightState = style({ width: 0, opacity: 0, transform: 'translateX(-2rem)' });
const toXState = style({ width: '*', opacity: .8, transform: 'translateX(0)', overflowX: 'hidden', whiteSpace: 'nowrap' });

// Animations
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
