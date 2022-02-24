class Note {
  constructor(content, imageUrl=null) {
      this.date = new Date();
      this.content = content;
      this.imageUrl = imageUrl;
  }
}

class ProcessHistory {
  constructor() {
    this.notes = [new Note("cool")]
  }

  addNote(content, imageUrl=null) {
    this.notes.push(new Note(content, imageUrl));
  }
}

module.exports = ProcessHistory;
