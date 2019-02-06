import axios from 'axios';

export default class Search {
    constructor(query) {
        this.query = query;
    }

   async getResults(query) {
       const key = '3d6d87256e741e8667598a2c5ab951cf';
       try {
            const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);            
            this.result = res.data.recipes;
            // console.log(this.result);
        } catch(error) {
            alert(error);
        }
    };  
}

