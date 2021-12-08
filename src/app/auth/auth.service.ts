import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthData } from "./auth-data.model";

import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({ providedIn: 'root' })
export class AuthService{
    tokenTimer!: any;

    private isAuthenticated = false;
    private token!: string | null;
    private userId!: string | null;
    private authStatusListener = new Subject<boolean>();

    constructor(private http:HttpClient, private router: Router){}

    getToken(){
        return this.token;
    }

    getUserId(){
        return this.userId;
    }

    getIsAuth(){
        return this.isAuthenticated;
    }

    getAuthStatusListener(){
        return this.authStatusListener.asObservable();
    }

    createUser(email: string, password: string){
        const authData : AuthData={email: email,password: password};
        this.http.post(BACKEND_URL + "/signup",authData)
        .subscribe(() => {
            this.router.navigate(['/']);
        }, error =>{
            this.authStatusListener.next(false);
        });
    }

    autoAuthUsers(){
        const authInformation = this.getAuthData();
        if(!authInformation){
            return;
        }
        const now = new Date();
        const expiresIn = authInformation?.expirationData.getTime()! - now.getTime();
        if(expiresIn > 0){
            this.token = authInformation?.token!;
            this.isAuthenticated = true;
            this.userId = authInformation.userId;
            this.setAuthTimer(expiresIn / 1000);
            this.authStatusListener.next(true);
        }
    }

    login(email: string, password: string){
        const authData : AuthData={email: email,password: password};
        this.http.post<{token: string, expiresIn:number, userId:string}>(BACKEND_URL + "/login",authData)
        .subscribe(response => {
           const expiresInDuration = response.expiresIn;
           this.setAuthTimer(expiresInDuration);
           const token = response.token;
           this.token = token;
           if(token){
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            this.userId = response.userId;
            const now = new Date();
            const expirationData = new Date(now.getTime() + expiresInDuration * 1000);
            this.saveAuthData(this.token, expirationData, this.userId);
            this.router.navigate(['/']);
           }
        }, error =>{
            this.authStatusListener.next(false);
        });
    }

    logout(){
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        this.userId = null
        this.clearAuthData();
        this.router.navigate(['/']);
        clearTimeout(this.tokenTimer);
    }

    private saveAuthData(token: string, expirationData: Date, userId: string){
        localStorage.setItem("token", token);
        localStorage.setItem("expiration", expirationData.toISOString());
        localStorage.setItem("userId",userId);
    }

    private setAuthTimer(duration : number){
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);         //3600 * 1000 becase of milisec.      
    }

    private clearAuthData(){
        localStorage.removeItem("token");
        localStorage.removeItem("expiration");
        localStorage.removeItem("userId");
    }

    private getAuthData(){
        const token = localStorage.getItem("token");
        const expirationData = localStorage.getItem("expiration");
        const userId = localStorage.getItem("userId");
        if(!token || !expirationData){
            return;
        }  
        return {
            token : token,
            expirationData : new Date(expirationData),
            userId : userId
        }
    }
}