import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Post } from "../post.model"
import { PostsService } from "../post.service";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { SocketService } from "../socket.service";

@Component({
    selector : 'app-post-list',
    templateUrl : './post-list.component.html',
    styleUrls : ['./post-list.component.css']
})
export class PostListComponent implements OnInit,OnDestroy{

    // @Input() posts:Post[] = [];
    posts:Post[] = [];
    userId!: string | null;
    private postsSub!: Subscription;
    private authStatusSub! : Subscription; 

    isLoading = false;

    postsPerPage = 5;
    currentPage = 1;
    totalPosts = 0;
    pageSizeOptions=[1,2,5,10];
    userIsAuthenticated = false;

    constructor(public postsService: PostsService, private authService: AuthService, private socketService: SocketService){}

    ngOnInit(){
        this.isLoading = true;
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
        this.userId = this.authService.getUserId(); 
        this.postsSub = this.postsService.getPostUpdateListner()
            .subscribe((postData: {posts :Post[], postCount :number}) => {
                this.isLoading = false;
                this.totalPosts = postData.postCount;
                this.posts= postData.posts;
            });       
            this.userIsAuthenticated = this.authService.getIsAuth();
            this.authStatusSub = this.authService
            .getAuthStatusListener()
            .subscribe(isAuthenticated => {
                this.userIsAuthenticated = isAuthenticated;
                this.userId = this.authService.getUserId(); 
            });

            //OnDataModifie socket changes
            this.socketService.OnModifiedPost()
            .subscribe((data:any) => {
                    this.posts.push(data.post._doc);
                    this.totalPosts++;
            });
    }

    onDelete(postId :String|Blob){
        this.isLoading = true;
        this.postsService.deletePost(postId).subscribe(() =>{
            this.postsService.getPosts(this.postsPerPage, this.currentPage);
        }, () => {
            this.isLoading = false;
        });
    }

    ngOnDestroy(){
        this.postsSub.unsubscribe();
        this.authStatusSub.unsubscribe();
    }
 
    onChangedPage(pageData: PageEvent){
        this.isLoading = true;
        this.currentPage = pageData.pageIndex + 1;
        this.postsPerPage = pageData.pageSize;
        this.postsService.getPosts(this.postsPerPage, this.currentPage);        
    }
}