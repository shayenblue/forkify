import axios from 'axios';
import {key, url} from '../config.js'

export default class Recipe {
    constructor (id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            // const res = await axios(`${url}/get?key=${key}&rId=${this.id}`);            
            // this.title = res.data.recipe.title;
            // this.author = res.data.recipe.publisher;
            // this.img = res.data.recipe.image_url;
            // this.url = res.data.recipe.source_url;
            // this.ingredients = res.data.recipe.ingredients;

            this.title = 'Jalapeno Popper Grilled Cheese Sandwich ';
            this.author = 'Closet Cooking';
            this.img = 'http://static.food2fork.com/Jalapeno2BPopper2BGrilled2BCheese2BSandwich2B12B500fd186186.jpg';
            this.url = 'https://www.food2fork.com/view/Jalapeno_Popper_Grilled_Cheese_Sandwich/35382';
            this.ingredients = ['2 jalapeno peppers, cut in half lengthwise and seeded', '2 slices sour dough bread', '1 tablespoon butter, room temperature', '2 tablespoons cream cheese, room temperature', '1/2 cup jack and cheddar cheese, shredded', '1 tablespoon tortilla chips, crumbled'];            
        } catch(error) {
            console.log(error);
            alert('Something went wrong :(')
        }
    }

    calcTime() {
        //Assuming that we need 15 minuted for each 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }
}