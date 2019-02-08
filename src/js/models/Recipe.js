import axios from 'axios';
import {key, url} from '../config.js'
import { AssertionError } from 'assert';

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
            this.ingredients = [
                '2 jalapeno peppers, cut in half lengthwise and seeded', 
                '2 slices sour dough bread', 
                '1 tablespoon butter, room temperature', 
                '2 1/2 tablespoons cream cheese, room temperature', 
                '1/2 cup jack and cheddar cheese, shredded', 
                '1 tablespoon tortilla chips, crumbled'
            ];            
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

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitShort, 'kg, g'];
        const newIngredients = this.ingredients.map(el => {
            // 1)Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitShort[i]);
            })

            //2) Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            //3) Parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIng;
            if(unitIndex > -1) {
                //There is a unit
                //ex. 4 1/2 cups, arrCount is [4, 1/2]
                //ex. 4 cups, arrCount is [4]
                const arrCount = arrIng.slice(0, unitIndex); 
                let count;
                if(arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-','+'));
                } else if (arrCount.length > 1) {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }

            } else if (parseInt(arrIng[0], 10)) {
                //There is no unit, but the first element is a number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
            }
            } else if (unitIndex === -1) {
                //There is no unit and NO number in first position of ingredient
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient //ingredient : ingredient
                }
            }

            return objIng;
        });
        this.ingredients = newIngredients;
    }

    updateServings (type) {
        //Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        //Ingredients
        
        this.ingredients.forEach( ing => {
            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings;
    }
}