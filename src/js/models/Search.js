import axios from 'axios';
import {key, url} from '../config.js'

export default class Search {
    constructor(query) {
        this.query = query;
    }

   async getResults() {       
       try {
            const res = await axios(`${url}/search?key=${key}&q=${this.query}`);            
            this.result = res.data.recipes;
        } catch(error) {
            alert(error);
        }
    };  
}

