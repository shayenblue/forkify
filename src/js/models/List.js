import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    }

    addItem (count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        };
        this.items.push(item);

         //Persist data in localStorage
         this.persistData();
        return item;
    }

    deleteItem(id) {
        const index = this.items.findIndex(el => el.id === id);
        //[2, 4, 8] splice(1, 2) --> returns [4, 8], oriignal array is [2]
        //[2, 4, 8] slice(1, 2) --> returns [4], oriignal array is [2, 4, 8]
        console.log(index);
        this.items.splice(index, 1);
        this.persistData();
    }

    updateCount(id, newCount) {
        this.items.find(el => el.id === id).count = newCount;
        this.persistData();
    }     

    persistData () {
        localStorage.setItem('items', JSON.stringify(this.items));
    }

    readStorage() {
        const items = JSON.parse(localStorage.getItem('items'));

        //Restore items from the localstorage
        if (items) this.items = items;
    }

    deleteAllItems() {
        this.items = [];
        this.persistData();
    }


}