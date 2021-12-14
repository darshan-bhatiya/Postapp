module.exports = (io) => {

    io.on('connection', socket => {

        console.log('new connection'); 
        
		socket.on('disconnect', () => console.log('disconnected')); 
		
        socket.on('createPost',(data) =>{
            console.log("socket-message: post Created ",data);
            io.emit("createPost",data);
	    });
    });
}