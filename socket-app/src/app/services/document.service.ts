import { Injectable } from '@angular/core';

import { Socket } from 'ngx-socket-io';

import { Event } from '../../../../shared/models/event';
import { Document } from '../models/document';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  currentDocument = this.socket.fromEvent<Document>(Event.DOC);
  documents = this.socket.fromEvent<string[]>(Event.DOC_LIST);

  constructor(private socket: Socket) { }

  getDocument(id: string) {
    this.socket.emit(Event.GET_DOC, id);
  }

  newDocument() {
    this.socket.emit(Event.ADD_DOC, { id: this.docId(), doc: '' });
  }

  editDocument(document: Document) {
    this.socket.emit(Event.EDIT_DOC, document);
  }

  private docId() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }
}
