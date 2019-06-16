import { createServer, Server } from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';

import { Event } from '../../shared/models/event';

export class AppServer {

    public static documents = {};

    private app: express.Application;
    private server: Server;
    private io: SocketIO.Server;

    private port: string | number;

    constructor(config) {
        this.port = config.ws.port;
        this.createApp();
        this.createServer();
        this.sockets();
        this.listen();
    }

    private createApp(): void {
        this.app = express();
    }

    private createServer(): void {
        this.server = createServer(this.app);
    }

    private sockets(): void {
        this.io = socketIo(this.server);
    }

    private listen(): void {

        this.io.on('connection', socket => {
            let previousId: string;
        
            const safeJoin = (currentId: string) => {
                socket.leave(previousId);
                socket.join(currentId, () => console.log(`Socket ${socket.id} joined room ${currentId}`));
                previousId = currentId;
            }
        
            socket.on(Event.GET_DOC, docId => {
                safeJoin(docId);
                socket.emit(Event.DOC, AppServer.documents[docId]);
            });
        
            socket.on(Event.ADD_DOC, doc => {
                AppServer.documents[doc.id] = doc;
                safeJoin(doc.id);
                this.io.emit(Event.DOC_LIST, Object.keys(AppServer.documents));
                socket.emit(Event.DOC, doc);
            });
        
            socket.on(Event.EDIT_DOC, doc => {
                AppServer.documents[doc.id] = doc;
                socket.to(doc.id).emit(Event.DOC, doc);
            });
        
            this.io.emit(Event.DOC_LIST, Object.keys(AppServer.documents));
        
            console.log(`Socket ${socket.id} has connected`);
        });
        
        this.server.listen(this.port, () => {
            console.log('Running WebSocket server on port %s', this.port);
        });

    }

    public getApp(): express.Application {
        return this.app;
    }
}