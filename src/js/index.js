import Search from './models/Search';
import * as searchView from './views/searchView';
import {elements, renderLoader, clearLoader} from './views/base';

/*Global state of the app
* - Search object
* - Current recipe object
* - Shopping list object
* - Liked recipes
*/

const state = {};

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
        // console.log(state.search.result);
        clearLoader();
        searchView.renderResults(state.search.result);
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
})

