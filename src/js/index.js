import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
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

        //5) Render results on UI IF getResults() returned
        if(state.search.result) {
            try {
                clearLoader();
                searchView.renderResults(state.search.result);
            } catch(error) {
                alert(`Something went wrong: ${error}`);
                console.log(error)
                clearLoader();
            }  
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
      const id = window.location.hash.replace('#', '');      
    //  const id = 48164; //TODO Delete, use window.location.hash.replace('#', '');

     if (id) {
         // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
                
        //Create new recipe
        state.recipe = new Recipe(id);

        // Highlight selected search item
        if (state.search) {
            searchView.highlightSelected(state.recipe.id);
        }
        

        try {
            //Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            //Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            //Render recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
                );
        } catch(error) {
            console.log(error);
            alert('Error processing recipe! Sorry :(')
        }        
     }

 }

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));
// controlRecipe(); //TODO Delete, use ['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe);)

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
    });
    if (!listView.isDeleteBtn()) {
        listView.addDeleteBtn();
    }
    console.log(state.list.items);
};

//Handle Enter input in list

//Handle delete and update list item events
elements.shopping.addEventListener('click', el => {      
  
    //If 'Delete all items' button clicked
    if (el.target.matches('.btn-delete, .btn-delete *')) {
        //Delete ALL items from list
        state.list.items.forEach (el => {
            console.log(el);
            listView.deleteItem(el.id);
            // state.list.deleteItem(el.id);                        
        });
        state.list.items=[];
        listView.removeDeleteBtn();
    
        //If 'Add item' button clicked
    } else if (el.target.matches('.list__btn-add')) {
        addCustomItem();
    } else {
        const id = el.target.closest('.shopping__item').dataset.itemid;    

    //Handle Delete button
    if (el.target.matches('.shopping__delete, .shopping__delete *')) {
        //Delete from state
        state.list.deleteItem(id);

        //Delete from UI
        listView.deleteItem(id);
        //Hide "Delete all elements" button if there is no elements
        if (state.list.length === 0) {
            listView.removeDeleteBtn();
        }
    //Handle the count update
    } else if (el.target.matches('.shopping__count-value')) {
        const val = parseFloat(el.target.value, 10);
        state.list.updateCount(id, val);
    }
    }
    
})

const addCustomItem = () => {
    if (!state.list) state.list = new List();        
        let newItem = {};
        [newItem.val, newItem.unit, newItem.ingredient] = listView.returnCustomInput();
        newItem = state.list.addItem(newItem.val, newItem.unit, newItem.ingredient);
        listView.renderItem(newItem);
}


/*
* LIKE CONTROLLER
*/


const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;
    
    // User has not yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        )
        //Toggle the like button
            likesView.toggleLikeBtn(true);
        //Add like to the UI
            likesView.renderLike(newLike);
    // User HAS liked current recipe
    } else {
        // Delete like to the state
        state.likes.deleteLike(currentID);
        //Toggle the like button
        likesView.toggleLikeBtn(false);
        //Remove like fromt the UI list
        likesView.deleteLike(currentID);
    };

    likesView.toggleLikeMenu(state.likes.getNumberLikes());
}

//Restore liked recipe on page load
window.addEventListener('load', () => {
    state.likes = new Likes();
    
    //Restore likes
    state.likes.readStorage();

    //Toggle like button
    likesView.toggleLikeMenu(state.likes.getNumberLikes());

    //Render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
    
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
    // Add ingredients to shopping list
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {        
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        controlLike();
    }  
})