import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';

import { NoteService } from './note.service';

export interface Note {
  id: number;
  text: string;
}

export class NoteData {
  id: number = 0;
  text: string = '';
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'test';

  url = 'http://test/api/';
  formValue!: FormGroup;

  notesList: Note[] = [];
  noteModel: NoteData = new NoteData();
  tags: string[] = [];

  arrayTags: string[] = [];

  hashTags!: any;

  hashTagsArray: string[] = [];

  hashTagValue: string = '';

  searchTerm: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private noteService: NoteService
  ) {}

  ngOnInit() {
    this.formValue = this.formBuilder.group({
      id: [''],
      text: [''],
    });

    this.noteService.getNotes().subscribe((res) => {
      this.notesList = res;
      localStorage.setItem('notes', JSON.stringify(this.notesList));
    });

    this.hashTags = localStorage.getItem('tags');
    this.hashTagsArray = JSON.parse(this.hashTags);
  }

  postNoteData() {
    if (this.formValue.value.text.trim().length === 0) {
      return;
    } else {
      this.noteModel.text = this.formValue.value.text;

      this.noteService.postNote(this.noteModel).subscribe((res) => {
        console.log(res);
      });

      this.formValue.reset();

      this.getAllNotes();
    }
  }

  deleteNoteData(id: number) {
    this.noteService.deleteNote(id).subscribe((res) => {
      this.getAllNotes();
    });
  }

  editNoteData(note: NoteData) {
    this.noteModel.id = note.id;
    this.noteModel.text = note.text;

    this.formValue.controls['text'].setValue(this.noteModel.text);
  }

  updateNoteData() {
    this.noteModel.text = this.formValue.value.text;

    this.noteService
      .updateNote(this.noteModel, this.noteModel.id)
      .subscribe((res) => {
        this.getAllNotes();
      });
  }

  getAllNotes() {
    this.noteService.getNotes().subscribe((res) => {
      this.notesList = res;
      localStorage.setItem('notes', JSON.stringify(this.notesList));
    });
  }

  openModal() {
    let modal = document.getElementById('modal');
    modal?.classList.remove('modal-close');
    modal?.classList.add('modal-open');
  }

  closeModal() {
    let modal = document.getElementById('modal');
    modal?.classList.remove('modal-open');
    modal?.classList.add('modal-close');
    this.formValue.reset();
  }

  cancelAdd() {
    const ref = document.getElementById('cancel');
    ref?.click();
    this.formValue.reset();
    this.closeModal();
  }

  searchTag(event: any) {
    const hashTag = event.target.value;
    const array = hashTag.split(' ');
    for (let i = 0; i < array.length; i++) {
      if (array[i].includes('#') === true) {
        this.tags.push(array[i]);
        this.hashTagsArray = this.tags;

        localStorage.setItem('tags', JSON.stringify(this.hashTagsArray));
      }
    }
  }

  applyFilter(event: any) {
    const filterValue = event.target.innerHTML;
    const result = this.notesList.filter((s) => s.text.includes(filterValue));
    this.notesList = result;
  }

  searchMathes(event: any) {
    this.searchTerm = event.target.value;
  }
}
