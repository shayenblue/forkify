import axios from 'axios';
import { key, url } from '../config.js'
import { AssertionError } from 'assert';
import { brokenIngredients2 } from './Mock';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = {};
            res.data = brokenIngredients2;

            // const res = await axios(`${url}/get?key=${key}&rId=${this.id}`);            
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;

        } catch (error) {
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

    // parseIngredients() {
    //     const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
    //     const unitShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
    //     const units = [...unitShort, 'kg', 'g'];
    //     const newIngredients = this.ingredients.map(el => {
    //         //1) Uniform units
    //         let ingredient = el.toLowerCase();
    //         unitsLong.forEach((unit, i) => {
    //             ingredient = ingredient.replace(unit, unitShort[i]);
    //         })

    //         //2) Remove parentheses
    //         ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

    //         //3) Parse ingredients into count, unit and ingredient
    //         const arrIng = ingredient.split(' ');
    //         const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

    //         let objIng;
    //         if (unitIndex > -1) {
    //             //There is a unit
    //             //ex. 4 1/2 cups, arrCount is [4, 1/2]
    //             //ex. 4 cups, arrCount is [4]
    //             const arrCount = arrIng.slice(0, unitIndex);
    //             let count;
    //             if (arrCount.length === 1) {
    //                 count = eval(arrIng[0].replace('-', '+'));
    //             } else if (arrCount.length > 1) {
    //                 count = eval(arrIng.slice(0, unitIndex).join('+'));
    //             }

    //             objIng = {
    //                 count,
    //                 unit: arrIng[unitIndex],
    //                 ingredient: arrIng.slice(unitIndex + 1).join(' ')
    //             }

    //         } else if (parseInt(arrIng[0], 10)) {
    //             //There is no unit, but the first element is a number
    //             objIng = {
    //                 count: parseInt(arrIng[0], 10),
    //                 unit: '',
    //                 ingredient: arrIng.slice(1).join(' ')
    //             }
    //         } else if (unitIndex === -1) {
    //             //There is no unit and NO number in first position of ingredient
    //             objIng = {
    //                 count: 1,
    //                 unit: '',
    //                 ingredient //ingredient : ingredient
    //             }
    //         }

    //         return objIng;
    //     });
    //     this.ingredients = newIngredients;
    // }

    parseIngredients() {
        const units = new Map();
        units.set('tbsp', 'tablespoons');
        units.set('tbsp', 'tablespoon');
        units.set('oz', 'ounces');
        units.set('oz', 'ounce');
        units.set('tsp', 'teaspoons');
        units.set('tsp', 'teaspoon');
        units.set('cup', 'cups');
        units.set('pound', 'pounds');
        units.set('kg', 'kg');
        units.set('g', 'g');
        units.set('ml', 'ml');

        const newIngredients = this.ingredients.map(el => {

            //1) Uniform units
            let ingredient = el.toLowerCase();

            units.forEach((key, value) => {
                // console.log(`The key is ${key}, the value is ${value} and the ingredient is ${ingredient}`)
                ingredient = ingredient.replace(key, value)
            });

            //2) Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');



            //3) Parse ingredients into count, unit, ingredient
            let arrIng = ingredient.split(' ');
            let objIng;
            let count;

            //First element is number
            if (parseInt(arrIng[0], 10)) {
                let arrCount = arrIng[0].split('-');

                //If there are two elements by -
                if (arrCount[1]) {                    
                    //If second part is int (eg. 3-4 garlic cloves)
                    if (Number.isInteger(eval(arrCount[1]))) {    
                        arrIng[0] = arrCount[0];                    
                    } else {
                        arrIng[0] = eval(arrIng[0].replace('-', '+'));                        
                    }
                    //If there is two number elements
                } else if (parseInt(arrIng[1], 10)) {                    
                    if (!Number.isInteger(eval(arrIng[1]))) {
                        arrIng[0] = eval(arrIng.slice(0, 2).join().replace(',', '+'));
                        arrIng.splice(1, 1);                    
                    }
                }
                //If there is no number 
            } else {
                //If string starts with space:
                if (arrIng[0] === '') {
                    arrIng.splice(0, 1);
                }
                arrIng.unshift('1');
            }

            //Find unit keyword in ingredient srting
            const unitIndex = arrIng.findIndex(el2 => units.has(el2));

            if (unitIndex > -1) {
                objIng = {
                    count: eval(arrIng[0]).toFixed(1),
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.splice(unitIndex + 1, arrIng.length).join(' ')
                }
            } else if (unitIndex === -1) {
                objIng = {
                    count: eval(arrIng[0]).toFixed(1),
                    unit: '',
                    ingredient: arrIng.splice(1, arrIng.length).join(' ')
                }
            }
            return objIng
        });

        this.ingredients = newIngredients;
        console.log(this.ingredients);
    }

    updateServings(type) {
        //Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        //Ingredients

        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings;
    }
}