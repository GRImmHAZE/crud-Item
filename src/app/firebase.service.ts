import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { Firestore, getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, DocumentData, CollectionReference, onSnapshot, QuerySnapshot } from 'firebase/firestore'
import { Subject } from 'rxjs';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  db: Firestore;
  itemCol: CollectionReference<DocumentData>;
  private updatedSnapshot = new Subject<QuerySnapshot<DocumentData>>();
  obsr_UpdatedSnapshot = this.updatedSnapshot.asObservable();

  constructor() {
    initializeApp(environment.firebaseConfig);
    this.db = getFirestore();
    this.itemCol = collection(this.db, 'item');

    // Get Realtime Data
    onSnapshot(this.itemCol, (snapshot) => {
      this.updatedSnapshot.next(snapshot);
    }, (err) => {
      console.log(err);
    })
  }

  async getitems() {
    const snapshot = await getDocs(this.itemCol);
    return snapshot;
  }


  async additem(name: string, description: string, price: string) {
    await addDoc(this.itemCol, {
      name,
      description,
      price
    })
    return;
  }

  async deleteitem(docId: string) {
    const docRef = doc(this.db, 'item', docId)
    await deleteDoc(docRef);
    return;
  }

  async updateitem(docId: string, name: string, description: string, price: string) {
    const docRef = doc(this.db, 'item', docId);
    await updateDoc(docRef, { name, description, price })
    return;
  }
}
