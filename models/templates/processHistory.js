class Note {
  constructor(content, imageUrl=null) {
      this.date = new Date();
      this.content = content;
      this.imageUrl = imageUrl;
  }
}

class ProcessHistory {
  constructor(notes=[], isCompleted=false) {
    this.notes = notes.map(note => new Note(note.content, note.imageUrl))
    this.isCompleted = isCompleted;
  }

  addNote(content, imageUrl=null) {
    this.notes.push(new Note(content, imageUrl));
  }
}

module.exports =  ProcessHistory;
