export type PostsStats = {
    likes: PostsStat;
    views: PostsStat;
    posts: PostsStat;
};

export type PostsStat = {
    text: string;
    value?: number;
    icon?: string;
    color?: string;
};
