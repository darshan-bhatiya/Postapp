import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PostCreatCompont } from "src/app/posts/post-create/post-create.component";
import { PostListComponent } from "src/app/posts/post-list/post-list.component";

const routes: Routes = [
    {path: '', component: PostListComponent},
    {path:'create', component: PostCreatCompont},
    {path:'edit/:postId', component: PostCreatCompont}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}