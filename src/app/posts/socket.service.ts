import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';  

@Injectable({
	providedIn: 'root'
})
export class SocketService {
	constructor(private socket: Socket) { }

    // emit event
    createPost(data:object) {
		this.socket.emit('createPost',data);
	} 

	// listen event
	OnModifiedPost() {
		return this.socket.fromEvent('createPost');
	}
}