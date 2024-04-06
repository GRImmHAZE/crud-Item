import { Component, OnInit } from '@angular/core';
import { DocumentData, QuerySnapshot } from '@firebase/firestore';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-crud-here',
  templateUrl: './crud-here.component.html',
  styleUrls: ['./crud-here.component.scss']
})
export class CrudHereComponent implements OnInit {
  studentDetails = {
    name: '',
    age: ''
  };

  studentCollectiondata: { id: string, name: string, age: string }[] = [];
  isListInputsDisabled: boolean = true;

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit(): void {
    this.get();
    this.firebaseService.obsr_UpdatedSnapshot.subscribe((snapshot) => {
      this.updateStudentCollection(snapshot);
    });
  }

  async add() {
    await this.firebaseService.addStudent(this.studentDetails.name, this.studentDetails.age);
    this.clearInputs();
  }

  async get() {
    const snapshot = await this.firebaseService.getStudents();
    this.updateStudentCollection(snapshot);
  }

  updateStudentCollection(snapshot: QuerySnapshot<DocumentData>) {
    this.studentCollectiondata = snapshot.docs.map((student) => {
      const data = student.data();
      const id = student.id;
      const name = data && data['name'] ? data['name'] : '';
      const age = data && data['age'] ? data['age'] : '';
      return { id, name, age };
    });
  }

  async delete(docId: string) {
    await this.firebaseService.deleteStudent(docId);
  }

  async update(docId: string) {
    const updatedName = this.studentDetails.name; // Update the name directly from the input
    const updatedAge = this.studentDetails.age; // Update the age directly from the input
    await this.firebaseService.updateStudent(docId, updatedName, updatedAge);
    this.clearInputs();
  }

  clearInputs() {
    this.studentDetails.name = '';
    this.studentDetails.age = '';
  }

  toggleListInputs() {
    this.isListInputsDisabled = !this.isListInputsDisabled;
  }
}
