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

export const renderDeleteBtn = () => {
    const markup = `     
        <button class="btn-small btn-delete">Delete all items</button>    
    `;
    elements.shopping.insertAdjacentHTML('afterbegin', markup);
};

export const removeDeleteBtn = () => {
    const item = document.querySelector('.btn-delete');
    item.parentElement.removeChild(item);
};

export const isDeleteBtn = () => {
    return document.querySelector('.btn-delete') ? true : false;    
};

export const returnCustomInput = () => {
    const count = document.querySelector('.shopping__custom--value');
    const unit = document.querySelector('.shopping__custom--unit');
    const ingredient = document.querySelector('.shopping__custom--description');
    const item = [count.value, unit.value, ingredient.value];
    //Clear input after values are passed
    
    count.value = '';
    unit.value = '';
    ingredient.value = '';

    return item;

};


