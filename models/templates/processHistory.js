class Note {
  constructor(content, imageUrl=null, date) {
      this.date = date;
      this.content = content;
      this.imageUrl = imageUrl;
  }
}

class ProcessHistory {
  constructor(notes=[], isCompleted=false) {
    this.notes = notes.map(note => new Note(note.content, note.imageUrl))
    this.isCompleted = isCompleted;
  }

  addNote(content, imageUrl=null, date) {
    this.notes.push(new Note(content, imageUrl, date));
  }
}

module.exports =  ProcessHistory;
