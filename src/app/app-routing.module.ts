import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { Authguard } from "./auth/auth.guard";

import { PostCreatCompont } from "./posts/post-create/post-create.component";
import { PostListComponent } from "./posts/post-list/post-list.component";

const routes: Routes = [
    {path: '', component: PostListComponent},
    {path:'create', component: PostCreatCompont, canActivate:[Authguard]},
    {path:'edit/:postId', component: PostCreatCompont, canActivate:[Authguard]},
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers:[Authguard]
})
export class AppRoutingModule {}