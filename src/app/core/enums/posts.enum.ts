export enum OrderingType {
    // TODO: Add most_popular (likes and downloads)
    TOTAL_LIKES_AS = 'total_likes',
    TOTAL_LIKES_DES = '-total_likes',
    TOTAL_DOWNLOADS_AS = 'total_downloads',
    TOTAL_DOWNLOADS_DES = '-total_downloads',
    CREATED_AT_AS = 'created_at',
    CREATED_AT_DES = '-created_at',
}

export enum OrderingTypeName {
    // TODO: Add most_popular (likes and downloads)
    TOTAL_LIKES_AS = 'Más gustadas',
    TOTAL_LIKES_DES = 'Más gustadas (Descendente)',
    TOTAL_DOWNLOADS_AS = 'Más descargadas',
    TOTAL_DOWNLOADS_DES = 'Más descargadas (Descendente)',
    CREATED_AT_AS = 'Más recientes',
    CREATED_AT_DES = 'Más recientes (Descendente)',
}
