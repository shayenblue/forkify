import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import {elements, renderLoader, clearLoader} from './views/base';

/*Global state of the app
* - Search object
* - Current recipe object
* - Shopping list object
* - Liked recipes
*/

const state = {};

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
            console.log(state.recipe);
        } catch(error) {
            alert('Error processing recipe! Sorry :(')
        }        
     }

 }

// TO UNCOMMENT ['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe);)
controlRecipe(); //TODO Delete, use ['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe);)
