// database setup
const db = new Dexie('ShopVira');
db.version(1).stores({items:`++id, name, quantity, price, isPurchased`})

// DOM selection and variable declaration
let welcomePageContainer = document.querySelector("#welcome__container");
let welcomeButton = document.querySelector("#welcome__page__button");
let emptyListPageContainer = document.querySelector("#empty__list");
let emptyListPageButton = document.querySelector("#empty__list__page__button");
let allListContainer = document.querySelector("#all__list");
let addItemButton = document.querySelector("#add__item__button");
let addItemForm = document.querySelector("#add__item__form");
let addItemFormContainer = document.querySelector("#add__item__form__container");
let allItemContainer = document.querySelector("#your__list__items");
let closeAddItemButton = document.querySelector("#close__add__item__form");
let closeEditItemButton = document.querySelector("#close__edit__item__form");
let bottomNavPlusButton = document.querySelector("#bottom__nav__plus");
let editItemForm = document.querySelector("#edit__item__form");
let editItemFormContainer = document.querySelector("#edit__item__form__container");
let confirmEditModal = document.querySelector('.confirm__edit__modal');
let closeConfirmEditModalButton = document.querySelector(".close__edit__modal");
let confirmEditModalButton = document.querySelector(".confirm__edit");
let menuButton = document.querySelector("#menu");
let deleteAllItemButton = document.querySelector('.delete__all');
let homeButton = document.querySelector("#home__button");
let userGuideButton = document.querySelector("#user__guide__button");
let userGuideContainer = document.querySelector(".tour");
let confirmDeleteModal = document.querySelector('.delete__all__modal');
let confirmDeleteModalMessage = document.querySelector('.delete__modal__message');
let closeConfirmDeleteModalButton = document.querySelector(".close__delete__all__modal");
let confirmDeleteModalButton = document.querySelector(".confirm__delete__all");

// simple state management
let allItems;
let holdTimerValue = 0; // this is used to measure the amount of seconds the user holds a button

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
  userGuideContainer.style.display = "block"
}

// function logic

const toggleItemStatus = async (event, id, isPurchased) => {
  confirmEditModal.style.display = "none"
  clearInterval(ID)
  await db.items.update(id, {isPurchased: !isPurchased})
  await fetchItems()
}

const fetchItems = async () => {
  db.open();
  allItems = await db.items.reverse().toArray();
  if(allItems.length > 0){
    userGuideContainer.style.display = "none";
    emptyListPageContainer.style.display = "none"
  }else if(allItems.length == 0){
    allListContainer.style.display = "none";
    addItemFormContainer.style.display = "none";
    editItemFormContainer.style.display = "none";
    confirmEditModal.style.display = "none";
    deleteAllItemButton.style.display = "none";
    emptyListPageContainer.style.transform = "translateX(0)"
    emptyListPageContainer.style.display = "block"
  }
  // get total price
  document.querySelector(".total__price").innerHTML = `Total: ₦ ${allItems.reduce((total, item) => total + (item.price * item.quantity), 0)}`;
   
  allItemContainer.innerHTML = allItems.map((item, i) =>`
    <div 
      class="single__item ${item.isPurchased && 'purchased__single'}" 
      onContextMenu="editItemOnRightClick(event, ${item.id}, '${item.name}', '${item.quantity}', '${item.price}', '${item.isPurchased}')"
    >
      <label>
        <input type="checkbox" 
          id="checkbox" ${item.isPurchased && 'checked'}
        >
        <div class="single__item__container"
          onmousedown="toggleItemStatus(event, ${item.id}, ${item.isPurchased})"
          ontouchstart="editItem(event, ${item.id}, '${item.name}', '${item.quantity}', '${item.price}', '${item.isPurchased}')" 
          ontouchend="resetEditItem()"
        >
          <div class="image__container">
            <div class="image">${item.name.charAt(0).toUpperCase()}</div>
          </div>
          <div class="info">
            <h4>${item.name}</h4>
            <p>${item.isPurchased ? 'purchased' : 'pending'}</p>
          </div>
          <div class="quantity">
            <div class="mini__container">
              <h5>Price</h5>
              <p><span>₦</span>${item.price}</p>
            </div>
            <div class="mini__container">
              <h5>Quantity</h5>
              <p>${item.quantity}</p>
            </div>
          </div>
        </div>
        <div class="delete__btn" onclick="removeItem(${item.id})">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 3.752l-4.423-3.752-7.771 9.039-7.647-9.008-4.159 4.278c2.285 2.885 5.284 5.903 8.362 8.708l-8.165 9.447 1.343 1.487c1.978-1.335 5.981-4.373 10.205-7.958 4.304 3.67 8.306 6.663 10.229 8.006l1.449-1.278-8.254-9.724c3.287-2.973 6.584-6.354 8.831-9.245z"/></svg>
        </div>
      </label>
    </div>
   `)

   allItemContainer.querySelectorAll("#checkbox").forEach(checkbox => checkbox.addEventListener("change", (e)=> e.preventDefault()))
}

const addItem = async (e) => {
  e.preventDefault();
  let name = document.querySelector("#item__name").value;
  let price = document.querySelector("#item__price").value;
  let quantity = document.querySelector("#item__quantity").value;
  let isPurchased = false;

  await db.items.add({name, quantity, price, isPurchased});
  await fetchItems()
  addItemForm.reset()
}

const removeItem = async (id) => {
  addItemFormContainer.style.display = "none"
  editItemFormContainer.style.display = "none"
  confirmDeleteModalMessage.textContent = "Delete Item ?"
  confirmDeleteModal.style.display = "grid";
      closeConfirmDeleteModalButton.addEventListener('click', ()=> {
        confirmDeleteModal.style.display = "none"
      })
      confirmDeleteModalButton.addEventListener('click', async ()=> {
        await db.items.delete(id);
        await fetchItems();      
        confirmDeleteModal.style.display = "none"
      })
}

const deleteAllItems = async () => {
  addItemFormContainer.style.display = "none"
  editItemFormContainer.style.display = "none"
  confirmDeleteModalMessage.textContent = "Clear All Items?"
  confirmDeleteModal.style.display = "grid";
      closeConfirmDeleteModalButton.addEventListener('click', ()=> {
        confirmDeleteModal.style.display = "none"
      })
      confirmDeleteModalButton.addEventListener('click', async ()=> {
        await db.delete();
        await fetchItems();
        confirmDeleteModal.style.display = "none"
      })
  deleteAllItemButton.style.display = "none"
}

let ID;
const editItem = (event, id, name, quantity, price, isPurchased) =>{
  holdTimerValue = 0;
   ID = setInterval(()=>{
    if(holdTimerValue < 3){
      holdTimerValue += 1
    }else{
      holdTimerValue = 0;
      confirmEditModal.style.display = "grid";
      closeConfirmEditModalButton.addEventListener('click', ()=> {
        clearInterval(ID)
        confirmEditModal.style.display = "none"
      })
      confirmEditModalButton.addEventListener('click', ()=> {
        clearInterval(ID)
        confirmEditModal.style.display = "none"
        addItemFormContainer.style.display = "none";
        editItemFormContainer.style.display = "block";
        document.querySelector('#edit__item__name').value = name;
        document.querySelector('#edit__item__price').value = price;
        document.querySelector('#edit__item__quantity').value = quantity;

        editItemForm.addEventListener('submit', async (e)=> {
          e.preventDefault();
          let name = document.querySelector('#edit__item__name').value;
          let price = document.querySelector('#edit__item__price').value;
          let quantity = document.querySelector('#edit__item__quantity').value;
          await db.items.update(id, {name, quantity, price, isPurchased});
          await fetchItems();
          await editItemForm.reset();
          editItemFormContainer.style.display = "none"
        })
      })
      clearInterval(ID)
    }
  }, 200)
}

const editItemOnRightClick = async (e, id, name, quantity, price, isPurchased) => {
  e.preventDefault();
  confirmEditModal.style.display = "none"
  addItemFormContainer.style.display = "none";
  await db.items.update(id, {isPurchased: isPurchased})
  await fetchItems();
  confirmEditModal.style.display = "grid";
  closeConfirmEditModalButton.addEventListener('click', ()=> {
    confirmEditModal.style.display = "none"
  })
  confirmEditModalButton.addEventListener('click', ()=> {
    editItemFormContainer.style.display = "block";
    confirmEditModal.style.display = "none"
    document.querySelector('#edit__item__name').value = name;
    document.querySelector('#edit__item__price').value = price;
    document.querySelector('#edit__item__quantity').value = quantity;

    editItemForm.addEventListener('submit', async (e)=> {
      e.preventDefault();
      let name = document.querySelector('#edit__item__name').value;
      let price = document.querySelector('#edit__item__price').value;
      let quantity = document.querySelector('#edit__item__quantity').value;
      await db.items.update(id, {name, quantity, price, isPurchased});
      await fetchItems();
      await editItemForm.reset();
      editItemFormContainer.style.display = "none"
    })
  })
}

const resetEditItem = (e) =>{
  if(holdTimerValue < 2){
    clearInterval(ID)
  }
  holdTimerValue = 0;
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