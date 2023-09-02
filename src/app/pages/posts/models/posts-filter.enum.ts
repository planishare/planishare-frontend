export enum PostFilterName {
    ACADEMIC_LEVEL = 'Nivel',
    SUBJECT = 'Asignatura',
    AXIS = 'Eje',
    ORDERING = 'Ordenar',
}

export enum PostOrderingType {
    LESS_LIKED = 'total_likes',
    MOST_LIKED = '-total_likes',
    LESS_VIEWED = 'total_views',
    MOST_VIEWED = '-total_views',
    LESS_RECENT = 'created_at',
    MOST_RECENT = '-created_at',
}

export enum PostOrderingName {
    'total_likes' = 'Más gustadas (Descendente)',
    '-total_likes' = 'Más gustadas',
    'total_views' = 'Más vistas (Descendente)',
    '-total_views' = 'Más vistas',
    'created_at' = 'Más antiguas',
    '-created_at' = 'Más recientes',
}
