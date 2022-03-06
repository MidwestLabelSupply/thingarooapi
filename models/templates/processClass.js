

class Process {
    constructor() {
        this.date = 0;
        this.content = null;
        this.imageUrl = null;
        this.a = [{'1': '1'}]
    }
}


const test = new Process();

// const {...object} = test
console.log({...test})


// console.log(object);

// class ProcessTemplateRoot { 
//     constructor() {
//         this.arrayOfProcessObj = [];
//     }

//     mongoSeralize() {
//        const nodes = [];
//        for (const node of this.arrayOfProcessObj) {


//        } 
        
//     }
// }