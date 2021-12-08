import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
// import { Post } from "./posts/post.model"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  constructor(private authService: AuthService){}

  ngOnInit(): void {
    this.authService.autoAuthUsers();
  }
  // storedPosts : Post[] = [];    
  // onPostAdded(post:any){                  this commented things are used in without service coding
  //   this.storedPosts.push(post);
  // }
}
