import { Injectable } from '@angular/core';
import {Post} from './post.model';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs'
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({providedIn:'root'}) //it will tells the angular that we have an service for root and create a single instace of it
export class PostsService{
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();  //creating observable using rxjs

    constructor(private http: HttpClient,private router: Router) {}

    getPosts(){
        this.http.get<{message: String, posts:any}>('http://localhost:3000/api/posts')
        .pipe(map((postData) => {   //this will help us to apply multiple operater on returned observable. now we can apply map operater of rxjs on observable stream.
            return postData.posts.map((post:any) => { //==> now this is map() just JS method
                return {
                    id :post._id,
                    title :post.title,
                    content :post.content,
                };
            });  
        })) 
        .subscribe((transferedData) => {
            console.log(this.posts);
            this.posts = transferedData;
            this.postsUpdated.next([...this.posts]);
        });
    }    

    getPost(id: String | null){
        return this.http.get<{_id: String, title: String , content: String}>
        ('http://localhost:3000/api/posts/'+id);
    }

    getPostUpdateListner(){
        return this.postsUpdated.asObservable(); //it will return the emmiter object to upon call
    }

    addPost(title:string ,content:string, image:File){
        const postData = new FormData();
        postData.append("title",title);
        postData.append("content",content);
        postData.append("image",image, title);
        console.log(postData)
        this.http
            .post<{messsage:String, postId:String}>('http://localhost:3000/api/posts', postData)
            .subscribe((responseData) => {
                const post: Post = {
                    id: responseData.postId,
                    title: title,
                    content: content
                };
                this.posts.push(post);
                this.postsUpdated.next([...this.posts]);
            });
    }

    updatePost(id: String | null, title: String, content: String){
        const post: Post = {id: id, title: title, content: content};
        this.http
            .put('http://localhost:3000/api/posts/'+id, post)
            .subscribe(resonce => {
                const updatedPosts = [...this.posts];
                const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
                updatedPosts[oldPostIndex] = post;
                this.posts = updatedPosts;
                this.postsUpdated.next([...this.posts]);
                this.router.navigate(["/"]);
            });
    }

    deletePost(postId :String | null){
        this.http.delete('http://localhost:3000/api/posts/'+postId)
        .subscribe(() => {
            const updatedPosts = this.posts.filter(post => post.id !== postId);
            this.posts = updatedPosts;
            this.postsUpdated.next([...this.posts]);
        });
    }
}