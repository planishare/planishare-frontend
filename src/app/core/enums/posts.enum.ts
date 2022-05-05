export enum OrderingType {
    // TODO: Add most_popular (likes and downloads)
    LESS_LIKED = 'total_likes',
    MOST_LIKED = '-total_likes',
    LESS_DOWNLOADED = 'total_downloads',
    MOST_DOWNLOADED = '-total_downloads',
    LESS_RECENT = 'created_at',
    MOST_RECENT = '-created_at',
}

export enum OrderingTypeName {
    MOST_LIKED = 'Más gustadas',
    LESS_LIKED = 'Más gustadas (Descendente)',
    LESS_DOWNLOADED = 'Menos descargadas',
    MOST_DOWNLOADED = 'Más descargadas',
    LESS_RECENT = 'Más antiguas',
    MOST_RECENT = 'Más recientes',
}
