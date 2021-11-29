import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Post } from "../post.model"
import { PostsService } from "../post.service";
import { Subscription } from "rxjs";

@Component({
    selector : 'app-post-list',
    templateUrl : './post-list.component.html',
    styleUrls : ['./post-list.component.css']
})
export class PostListComponent implements OnInit,OnDestroy{

    // @Input() posts:Post[] = [];
    posts:Post[] = [];
    private postsSub!: Subscription; 

    isLoading = false;
 
    constructor(public postsService: PostsService){}

    ngOnInit(){
        this.isLoading = true;
        this.postsService.getPosts(); 
        this.postsSub = this.postsService.getPostUpdateListner()
            .subscribe((posts :Post[]) => {
                this.isLoading = false;
                this.posts= posts;
            });       
    }

    onDelete(postId :String | null){
        this.postsService.deletePost(postId);
    }

    ngOnDestroy(){
        this.postsSub.unsubscribe();
    }
        
}