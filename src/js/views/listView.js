import { elements } from './base';

export const renderItem = item => {
    const markup = `
        <li class="shopping__item" data-itemid=${item.id}>
            <div class="shopping__count">
                <input type="number" value="${item.count}" step="${item.count}" class="shopping__count-value">
                <p>${item.unit}</p>
            </div>
            <p class="shopping__description">${item.ingredient}</p>
            <button class="shopping__delete btn-tiny">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-cross"></use>
                </svg>
            </button>
        </li>
    `;
    elements.shopping.insertAdjacentHTML('beforeend', markup);
};

export const deleteItem = id => {
    const item = document.querySelector(`[data-itemid="${id}"]`);
    item.parentElement.removeChild(item);
};

export const addDeleteBtn = () => {
    const markup = `
     <div class="btn-delete">
        <button class="btn-small">Delete all items</button>
    </div>
    `;
    elements.shopping.insertAdjacentHTML('afterbegin', markup);
};

export const removeDeleteBtn = () => {
    const item = document.querySelector('.btn-delete');
    item.parentElement.removeChild(item);
};

export const isDeleteBtn = () => {
    return document.querySelector('.btn-delete') ? true : false;    
}