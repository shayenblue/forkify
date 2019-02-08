import axios from 'axios';
import {key, url} from '../config.js'
import {search} from './Mock';

export default class Search {
    constructor(query) {
        this.query = query;
    }

   async getResults() {       
       try {
            // const res = {};
            // res.data = search;
            const res = await axios(`${url}/search?key=${key}&q=${this.query}`);            
            console.log(res);
            if (!res.data.error) {
                this.result = res.data.recipes;                
            } else {
                throw `There is an error in data: ${res.data.error}`;
            }            
            console.log(res);
        } catch(error) {
            alert(error);
        }
    };  
}

