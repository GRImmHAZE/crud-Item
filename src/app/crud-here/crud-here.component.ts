import { Component, OnInit } from '@angular/core';
import { DocumentData, QuerySnapshot } from '@firebase/firestore';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-crud-here',
  templateUrl: './crud-here.component.html',
  styleUrls: ['./crud-here.component.scss']
})
export class CrudHereComponent implements OnInit {
  productDetails = {
    id:'',
    name: '',
    description: '',
    image: '',
    price: ''
  };

  itemCollectiondata: { id: string, name: string, description: string, image: string, price: string }[] = [];
  isListInputsDisabled: boolean = true;

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit(): void {
    this.get();
    this.firebaseService.obsr_UpdatedSnapshot.subscribe((snapshot) => {
      this.updateitemCollection(snapshot);
    });
  }

  async add() {
    await this.firebaseService.additem(this.productDetails.name, this.productDetails.description, this.productDetails.price);
    this.clearInputs();
  }

  async get() {
    const snapshot = await this.firebaseService.getitems();
    this.updateitemCollection(snapshot);
  }

  updateitemCollection(snapshot: QuerySnapshot<DocumentData>) {
    this.itemCollectiondata = snapshot.docs.map((item) => {
      const data = item.data();
      const id = item.id;
      const name = data && data['name'] ? data['name'] : '';
      const description = data && data['description'] ? data['description'] : '';
      const image = data && data['image'] ? data['image'] : '';
      const price = data && data['price'] ? data['price'] : '';
      return { id, name, description, image, price };
    });
  }

  async delete(docId: string) {
    await this.firebaseService.deleteitem(docId);
  }

  async update(docId: string) {
    const updatedName = this.productDetails.name; // Update the name directly from the input
    const updatedDescription = this.productDetails.description; // Update the age directly from the input
    const updatedPrice = this.productDetails.price; // Update the age directly from the input
    await this.firebaseService.updateitem(docId, updatedName, updatedDescription, updatedPrice);
    this.clearInputs();
  }

  clearInputs() {
    this.productDetails.name = '';
    this.productDetails.description = '';
    this.productDetails.price = '';
  }

  toggleListInputs() {
    this.isListInputsDisabled = !this.isListInputsDisabled;
  }
}
