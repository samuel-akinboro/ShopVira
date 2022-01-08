import { fetchItems, addItem, allItems } from './databaseFunctions.js'

// DOM selection and variable declaration
let welcomePageContainer = document.querySelector("#welcome__container");
let welcomeButton = document.querySelector("#welcome__page__button");
export let emptyListPageContainer = document.querySelector("#empty__list");
let emptyListPageButton = document.querySelector("#empty__list__page__button");
export let allListContainer = document.querySelector("#all__list");
export let addItemButton = document.querySelector("#add__item__button");
export let addItemForm = document.querySelector("#add__item__form");
export let addItemFormContainer = document.querySelector("#add__item__form__container");
export let allItemContainer = document.querySelector("#your__list__items");
let closeAddItemButton = document.querySelector("#close__add__item__form");
let closeEditItemButton = document.querySelector("#close__edit__item__form");
let bottomNavPlusButton = document.querySelector("#bottom__nav__plus");
export let editItemForm = document.querySelector("#edit__item__form");
export let editItemFormContainer = document.querySelector("#edit__item__form__container");
export let confirmEditModal = document.querySelector('.confirm__edit__modal');
export let closeConfirmEditModalButton = document.querySelector(".close__edit__modal");
export let confirmEditModalButton = document.querySelector(".confirm__edit");
let menuButton = document.querySelector("#menu");
export let deleteAllItemButton = document.querySelector('.delete__all');
let homeButton = document.querySelector("#home__button");
let userGuideButton = document.querySelector("#user__guide__button");
export let userGuideContainer = document.querySelector(".tour");
export let confirmDeleteModal = document.querySelector('.delete__all__modal');
export let confirmDeleteModalMessage = document.querySelector('.delete__modal__message');
export let closeConfirmDeleteModalButton = document.querySelector(".close__delete__all__modal");
export let confirmDeleteModalButton = document.querySelector(".confirm__delete__all");
let backToListButton = document.querySelector("#back__button");

// Page Transition
const leaveWelcomePage = (e) => {
  welcomePageContainer.style.transform = "translateX(-90%)";
  welcomePageContainer.addEventListener("transitionend", ()=>{welcomePageContainer.style.display="none"})
  if(allItems.length == 0) {
    emptyListPageContainer.style.transform = "translateX(0)";
    emptyListPageContainer.style.display = "block"
  }else{
    allListContainer.style.transform = "translateX(0)";
    allListContainer.style.display = "block"
  }
}

const leaveEmptyListPage = (e) => {
  emptyListPageContainer.style.transform = "translateX(-90%)";
  emptyListPageContainer.addEventListener("transitionend", ()=>{welcomePageContainer.style.display="none"})
  allListContainer.style.display = "block"
}

const hideAddItemForm = (e) => {
  addItemFormContainer.style.display = "none";
}

const goHome = () => {
  location.reload();
}

const userGuidePage = () =>{
  userGuideButton.style.display = "none";
  userGuideContainer.style.display = "block";
  backToListButton.style.display = "block";
}

const allListPage = () => {
  userGuideContainer.style.display = "none"
  allListContainer.style.display = "block"
  userGuideButton.style.display = "block";
  backToListButton.style.display = "none"
}



// on render
window.addEventListener('DOMContentLoaded', ()=>{
  emptyListPageContainer.style.display = "none";
  allListContainer.style.display = "none";
  addItemFormContainer.style.display = "none";
  editItemFormContainer.style.display = "none";
  confirmEditModal.style.display = "none";
  deleteAllItemButton.style.display = "none";
  fetchItems();
})

// Event Listeners
welcomeButton.addEventListener('click', leaveWelcomePage);
emptyListPageButton.addEventListener('click', leaveEmptyListPage);
addItemForm.addEventListener('submit', addItem);
closeAddItemButton.addEventListener('click', hideAddItemForm);
closeEditItemButton.addEventListener('click', (e)=> {e.preventDefault(); editItemFormContainer.style.display = "none"});
homeButton.addEventListener('click', goHome);
backToListButton.addEventListener('click', allListPage)
userGuideButton.addEventListener('click', userGuidePage)
bottomNavPlusButton.addEventListener('click', ()=> {userGuideContainer.style.display = "none"; addItemFormContainer.style.display = "block"});
deleteAllItemButton.addEventListener('click', deleteAllItems)
menuButton.addEventListener('click', ()=>{
  if(deleteAllItemButton.style.display == "none"){
      deleteAllItemButton.style.display = "block"
  }else{
      deleteAllItemButton.style.display = "none"
  }
})
// emptyListPageButton.addEventListener('touchstart', ()=> editItem(false));
// emptyListPageButton.addEventListener('touchend', resetEditItem);
