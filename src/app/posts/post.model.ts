export interface Post{
    id: String | Blob,
    title: String;
    content: String;
    imagePath: String|null;
    creator: String|null;
}