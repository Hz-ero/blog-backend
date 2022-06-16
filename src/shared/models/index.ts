
export interface Post {
    _id: string;
    title: string;
    content: string;
    published: boolean;
    tags: Array<string>;
    category: string;
    view?: number;

    createdAt: Date;
    updatedAt?: Date;
}
