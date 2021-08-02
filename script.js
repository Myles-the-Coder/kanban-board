"use strict";

const addBtns = document.querySelectorAll(".add-item");
const saveItemBtns = document.querySelectorAll(".save-item");
const textContainers = document.querySelectorAll(".text-container");
const attachItems = document.querySelectorAll(".attach-item");
//Item Lists
const listColumns = document.querySelectorAll(".board-body");
const backlogList = document.getElementById("backlog-list");
const inProgressList = document.getElementById("in-progress-list");
const completeList = document.getElementById("complete-list");
const onHoldList = document.getElementById("on-hold-list");
///////////////////////////////////////////////////////////////////////////////
//Items
let updatedOnLoad = false;

//Initialize Arrays
let backlogListArray = [];
let inProgressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];
let arrayNames = ["backlog", "inProgress", "complete", "onHold"];

//Drag Functionality
let draggedItem
let dragging = false
let currentColumn

//Get Arrays from localStorage if available, set default values it not
function getSavedColumns() {
  if (localStorage.getItem("backlogItems")) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    inProgressListArray = JSON.parse(localStorage.inProgressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ["Release the course", "Sit back and relax"];
    inProgressListArray = ["Work on projects", "Listen to music"];
    completeListArray = ["Being cool", "Getting stuff done"];
    onHoldListArray = ["Being uncool"];
  }
}

//Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [
    backlogListArray,
    inProgressListArray,
    completeListArray,
    onHoldListArray,
  ];

  arrayNames.forEach((name, index) => {
    localStorage.setItem(`${name}Items`, JSON.stringify(listArrays[index]));
  });
}

//Filter Arrays to remove empty items
function filterArray(array) {
  const filteredArray = array.filter(item => item !== null)
  return filteredArray
}

//Create DOM Elements for each list
function createItemEl(columnEl, column, item, index) {
  // console.log("columnEl:", columnEl);
  // console.log("column", column);
  // console.log("item", item);
  // console.log("index", index);
  //List Item
  const listEl = document.createElement("h2");
  listEl.classList.add("item");
  listEl.textContent = item
  listEl.draggable = true
  listEl.setAttribute('ondragstart', 'drag(event)')
  listEl.contentEditable = 'true'
  listEl.id = index
  listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`)
  //Append
  columnEl.appendChild(listEl)
}

//Update Item - Delete if necessary, or update Array value
function updateItem(id, column) {
  const selectedArray = listArrays[column]
  const selectedColumnEl = listColumns[column].children
  if(!dragging) {
    if(!selectedColumnEl[id].textContent) {
      delete selectedArray[id]
    } else {
      selectedArray[id] = selectedColumnEl[id].textContent
    }
    updateDOM()
  }
}

//Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  //Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();
  }
  //Backlog Column
  backlogList.textContent = ''
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogList, 0, backlogItem, index);
  backlogListArray = filterArray(backlogListArray)
  });
  //Progress Column
  inProgressList.textContent = ''
  inProgressListArray.forEach((inProgressItem, index) => {
    createItemEl(inProgressList, 1, inProgressItem, index);
  });
  inProgressListArray = filterArray(inProgressListArray)
  //Complete Column
  completeList.textContent = ''
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index);
  });
  completeListArray = filterArray(completeListArray)
  //On hold Column
  onHoldList.textContent = ''
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 3, onHoldItem, index);
  });
  onHoldListArray = filterArray(onHoldListArray)
  //Run getSavedColumns only once, Update localStorage
  updatedOnLoad = true
  updateSavedColumns()
}

//Add to column list / Reset text box
function addToColumn(column) {
  const itemText = textContainers[column].textContent
  const selectedArray = listArrays[column]
  selectedArray.push(itemText)
  textContainers[column].textContent = ''
  updateDOM()
}

//Show Add Item Input Box
function showInputBox(column) {
  addBtns[column].style.display = 'none'
  saveItemBtns[column].style.display = 'flex'
  textContainers[column].style.display = 'flex'
}

//Hide Item Input Box
function hideInputBox(column) {
  addBtns[column].style.display = 'flex'
  saveItemBtns[column].style.display = 'none'
  textContainers[column].style.display = 'none'
  addToColumn(column)
}

//Allow arrays to reflect Drag and Drop Items
function rebuildArrays() {
  backlogListArray = Array.from(backlogList.children.map(i => i.textContent))
  inProgressListArray = Array.from(inProgressList.children.map(i => i.textContent))
  completeListArray = Array.from(completeList.children.map(i => i.textContent))
  onHoldListArray = Array.from(onHoldList.children.map(i => i.textContent))

  updateDOM()
}

//When item starts dragging
function drag(e) {
  draggedItem = e.target  
  dragging = true
}

//Column allows for the Item to drop
function allowDrop(e) {
  e.preventDefault()
}

//When Item enters drag area
function dragEnter(column) {
  listColumns[column].classList.add('over')
  currentColumn = column
}

//When item is dropped
function drop(e) {
  e.preventDefault()

  //remove background color/padding
  listColumns.forEach((column) => {
    column.classList.remove('over')
  })

  //Add item to new column
  const parentEl = listColumns[currentColumn]
  parentEl.appendChild(draggedItem)

  //Dragging complete
  dragging = false
  rebuildArrays()
}


//On Load
updateDOM();