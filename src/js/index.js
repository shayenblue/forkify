import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import {elements, renderLoader, clearLoader} from './views/base';

/*Global state of the app
* - Search object
* - Current recipe object
* - Shopping list object
* - Liked recipes
*/

const state = {};
window.s = state;

/*
 * SEARCH CONTROLLER
 */

const controlSearch = async () => {
    // 1) Get query from view
    const query = searchView.getInput(); 
    console.log(query);

    
    if (query) {
        // 2) Create new Search object and add it to state
        state.search = new Search(query);

        //3) Prepare interface for showing results
        searchView.clearInput(); 
        searchView.clearResults();
        renderLoader(elements.searchResults);

        //4) Search for recipes
        await state.search.getResults();

        //5) Render results on UI
        try {
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch(error) {
            alert('Something went wrong');
            clearLoader();
        }        
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
})

elements.searchResultPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline')
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10); //because of data-goto attribute of button element
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
    
});

/*
 * RECIPE CONTROLLER
 */

 const controlRecipe = async () => {
     //  Get ID from URL
     //  const id = window.location.hash.replace('#', '');
     const id = 35382; //TODO Delete, use window.location.hash.replace('#', '');

     if (id) {
         // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected search item
        if (state.search) {
            searchView.highlightSelected(state.recipe.id);
        }
        
        //Create new recipe
        state.recipe = new Recipe(id);
        
        //TESTING
        window.r = state.recipe;

        try {
            //Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            //Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            //Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        } catch(error) {
            alert('Error processing recipe! Sorry :(')
        }        
     }

 }

// TO UNCOMMENT ['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe);)
controlRecipe(); //TODO Delete, use ['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe);)

/*
* LIST CONTROLLER
*/

const controlList = () => {
    //Create a new list IF there is none yet
    if (!state.list) state.list = new List();

    //Add each igredient to the list and UI;
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    })
};

//Handle delete and update list item events
elements.shopping.addEventListener('click', el => {
    const id = el.target.closest('.shopping__item').dataset.itemid;
    console.log(id);

    //Handle Delete button
    if (el.target.matches('.shopping__delete, .shopping__delete *')) {
        //Delete from state
        state.list.deleteItem(id);

        //Delete from UI
        listView.deleteItem(id);
    //Handle the count update
    } else if (el.target.matches('.shopping__count-value')) {
        const val = parseFloat(el.target.value, 10);
        state.list.updateCount(id, val);
    }
})

//Using event delegation for handling recipe button cliks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        //Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        //Increase button is clicked  
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {        
        controlList();
    }
    console.log(state.recipe);
})

window.l = new List();