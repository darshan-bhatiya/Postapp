import { Component ,OnDestroy,OnInit} from "@angular/core";
// import { EventEmitter, Output, ViewChild} from "@angular/core";
import { FormControl, FormGroup, Validators} from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { PostsService } from "../post.service";
import { mimeType } from "./mime-type.validator";
// import { from } from "rxjs";
// import { Post } from "../post.model"

@Component({
    selector : 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css'],
})

export class PostCreatCompont implements OnInit,OnDestroy{
    post!: { id: String|Blob; title: String; content: String; imagePath : String; creator : String};
    private mode = 'create';
    private postId!: string | null;
    private authStatusSub!: Subscription;

    isLoading = false;
    form!: FormGroup;

    imagePreview!: String;
    // @Output() postCreated = new EventEmitter<Post>();

    constructor(public postsService :PostsService,
        public route: ActivatedRoute,
        private authService: AuthService){}
   
    ngOnInit(): void {
        this.authStatusSub = this.authService
        .getAuthStatusListener()
        .subscribe(authStatus => {
                this.isLoading = false;
            }
        );
        this.form = new FormGroup({
        title : new FormControl(null,{
            validators : [Validators.required, Validators.minLength(3)]
        }),
        content: new FormControl(null, {
            validators :[Validators.required],
        }),
        image: new FormControl(null, {
            validators :[Validators.required],
            asyncValidators :[mimeType]
        })          
      });
      this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if(paramMap.has('postId')){
                this.mode = 'edit';
                this.postId = paramMap.get('postId');
                this.isLoading = true;
                this.postsService.getPost(this.postId).subscribe(postData => {
                    this.isLoading = false;
                    this.post = {
                        id: postData._id,
                        title: postData.title,
                        content: postData.content,
                        imagePath : postData.imagePath,
                        creator : postData.creator
                    };
                    this.form.setValue({
                        title : this.post.title,
                        content : this.post.content,
                        image : this.post.imagePath
                    });
                    console.log("mesg form editpost in createComponent",this.post);               
                });

            }else{
                this.mode = 'create';
                this.postId = null;
                console.log("mesg form CREATE in createComponent");
            }
      });  
    }

    onImagePicked(event : Event){
        const file = (event.target as HTMLInputElement).files![0];
        // let newfile = file.files![0];
        this.form.patchValue({'image': file});
        this.form.get('image')?.updateValueAndValidity();
        // let abc =this.form.get('image')?.updateValueAndValidity();
        // console.log(abc);
        // console.log(file);
        // console.log(this.form);
        // debugger;
        const reader = new FileReader();
        reader.onload = () =>{
            this.imagePreview = reader.result as String;
        };
        reader.readAsDataURL(file);
    }

    onSavePost(){
        if(this.form.invalid){
            return 
        }
        // const post: Post  = {
        //     title : form.value.title,
        //     content : form.value.content
        // };
        // this.postCreated.emit(post);
        
        this.isLoading = true;
        if(this.mode == 'create'){
            console.log(this.form.value.image);  // testing
            this.postsService.addPost(
                this.form.value.title,
                this.form.value.content,
                this.form.value.image);
        }else{
            this.postsService.updatePost(this.postId!,this.form.value.title, this.form.value.content,this.form.value.image);
        }
        debugger
        this.form.reset();
        
        // console.log("",this.form);
        // this.isLoading = false;
    }

    ngOnDestroy(): void {
        this.authStatusSub.unsubscribe();
    }
}