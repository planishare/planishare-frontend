export enum OrderingType {
    LESS_LIKED = 'total_likes',
    MOST_LIKED = '-total_likes',
    LESS_VIEWED = 'total_views',
    MOST_VIEWED = '-total_views',
    LESS_RECENT = 'created_at',
    MOST_RECENT = '-created_at',
}

export enum OrderingTypeName {
    LESS_LIKED = 'Más gustadas (Descendente)',
    MOST_LIKED = 'Más gustadas',
    LESS_VIEWED = 'Más vistas (Descendente)',
    MOST_VIEWED = 'Más vistas',
    LESS_RECENT = 'Más antiguas',
    MOST_RECENT = 'Más recientes',
}
