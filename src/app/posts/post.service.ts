import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Post } from './post.model';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/posts/';

@Injectable({ providedIn: 'root' }) //it will tells the angular that we have an service for root and create a single instace of it
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[]; postCount: number}>(); //creating observable using rxjs

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: String; posts: any; maxPosts: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map((postData) => {
          //this will help us to apply multiple operater on returned observable. now we can apply map operater of rxjs on observable stream.
          return {
            posts: postData.posts.map((post: any) => {
              //==> now this is map() just JS method
              return {
                id: post._id,
                title: post.title,
                content: post.content,
                imagePath: post.imagePath,
                creator: post.creator
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe((transformedPostData) => {
        console.log(transformedPostData);
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
            posts: [...this.posts],
            postCount: transformedPostData.maxPosts
        });
      });
  }

  getPost(id: String | null) {
    return this.http.get<{
      _id: String;
      title: String;
      content: String;
      imagePath: String;
      creator: String
    }>(BACKEND_URL + id);
  }

  getPostUpdateListner() {
    return this.postsUpdated.asObservable(); //it will return the emmiter object to upon call
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    console.log(postData);
    this.http
      .post<{ messsage: String; post: Post }>(
        BACKEND_URL,
        postData
      )
      .subscribe((responseData) => {
        // const post: Post = {
        //   id: responseData.post.id,
        //   title: title,
        //   content: content,
        //   imagePath: responseData.post.imagePath,
        // };
        // this.posts.push(post);
        // this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  updatePost(
    id: string | Blob,
    title: string,
    content: string,
    image: File | string
  ) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id!);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
      console.log('FormData form service UpdatePost', postData);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      };
      console.log(
        'FormData form service UpdatePost image is not seted',
        postData
      );
    }
    // const post: Post = {id: id, title: title, content: content, imagePath : null};
    this.http
      .put(BACKEND_URL + id, postData)
      .subscribe((resonce) => {
        // const updatedPosts = [...this.posts];
        // const oldPostIndex = updatedPosts.findIndex((p) => p.id === id);
        // const post: Post = {
        //   id: id,
        //   title: title,
        //   content: content,
        //   imagePath: '',
        // };
        // updatedPosts[oldPostIndex] = post;
        // this.posts = updatedPosts;
        // this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: String | Blob) {
    return this.http
      .delete(BACKEND_URL + postId);
    //   .subscribe(() => {
    //     const updatedPosts = this.posts.filter((post) => post.id !== postId);
    //     this.posts = updatedPosts;
    //     this.postsUpdated.next([...this.posts]);
    //   });
  }
}
