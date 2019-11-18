import { getTrips, newTrip }  from '../utils/tripServices.js';

const TRIP = 'trip'
const CHECKBOX_SELECTOR = 'input[name="select"]'
const SELECT_ALL_SELECTOR = 'input[name="select-all"]'
var expenses;


window.onload = function(){
    getTripsRemote();
};

function getTripsRemote(){
    getTrips()
        .then(data=>{
            expenses = data
            expensesManager()
        });
}

function addTrip(trip){
    newTrip(trip);
    getTripsRemote();
}

//Trips and other expenses filter
const btnTrip = document.querySelector('#tripLink')
const btnOtherExpenses = document.querySelector('#OtherExpensesLink')
const btnShare = document.querySelector('#share')
const btnExport = document.querySelector('#export')
let filterSelected = btnTrip.classList.contains('active') ? TRIP : 'others'

function filterManager(){
    btnTrip.classList.toggle('active')
    btnOtherExpenses.classList.toggle('active')
    filterSelected = btnTrip.classList.contains('active') ? TRIP : 'others'
    expensesManager()
}

btnTrip.addEventListener('click', filterManager )
btnOtherExpenses.addEventListener('click', filterManager)


// Tables
function expenseTable(tableBody) {
    let headCells; 
    if(filterSelected === TRIP){
        headCells = `
            <th>Destination</th>
            <th>From</th>
            <th>To</th>
            <th>Last Update</th>`
    }else {
        headCells = `
            <th>Date</th>
            <th>Name</th>
            <th>Type</th>
            <th>Purpose</th>
            <th>Last Updated</th>`
    }

    return `<table class="expense-table ">
        <thead>
            <tr>
                <th class="check-field" >
                <label class="check-container">
                    <input type="checkbox" name="select-all" value="select-all">
                    <span class="checkmark"></span>
                </label>               
                </th>
                ${headCells}
            </tr>
        </thead>
        <tbody>
            ${tableBody}
        </tbody>
    </table> ` 
}


function expensesManager(){
    if(expenses.length < 1) return
    const listContainer = document.querySelector('#list')
    const html = expenses
        .filter(expense => filterSelected === TRIP? expense.type === filterSelected : expense.type !== TRIP)
        .map(expense => {
            let bodyCell;
            if(filterSelected === TRIP){
                bodyCell = `
                <td>${expense.destination}</td>
                <td>${expense.startDate}</td>
                <td>${expense.endDate}</td>
                <td>${expense.endDate}</td>`
            }else {
                bodyCell = `
                <td>${expense.startDate}</td>
                <td>${expense.destination}</td>
                <td>${expense.type}</td>
                <td>Porpouse ....</td>
                <td>${expense.endDate}</td>`
            }
            return `<tr>
                <td class="check-field">
                    <label class="check-container">
                        <input type="checkbox" name="select" value="select">
                        <span class="checkmark"></span>
                    </label>
                </td>
                ${bodyCell}
            </tr>
            `   
    }).join('');

    listContainer.innerHTML = expenseTable(html);   
    
    selectManager(listContainer)
}

function selectManager(listContainer) {
    const btnSelectAll = listContainer.querySelector(SELECT_ALL_SELECTOR)     
    btnSelectAll.addEventListener('change', ()=>selectAll(btnSelectAll, rowList))
    
    const rowList = listContainer.querySelectorAll('tr')
    rowList.forEach((row)=>{
        const btnSelect = row.querySelector(CHECKBOX_SELECTOR)
        if(!btnSelect)return 

        btnSelect.addEventListener('change', ()=> {
            backgroundManager(row, CHECKBOX_SELECTOR)
            const checked = isAllChecked(rowList)
            btnSelectAll.checked = checked
            if(checked) selectAll(btnSelectAll , rowList)
            else backgroundManager(rowList[0], SELECT_ALL_SELECTOR, checked)

            const anyChecked = isAnyChecked(rowList)
            if(anyChecked){
                btnShare.classList.remove('hide')
                btnExport.classList.remove('hide')
            }else {
                btnShare.classList.add('hide')
                btnExport.classList.add('hide')
            }
        })
    }); 
}

function selectAll(btnSelectAll, rowList) {
    const checkAll = btnSelectAll.checked
    rowList.forEach(row=>backgroundManager(row, 'input', checkAll))
}

function backgroundManager(row, qSelector, selected){
    const checkBox = row.querySelector(qSelector)
    const isSelected = selected!==undefined ? selected : checkBox.checked
    checkBox.checked = isSelected    
    if(!checkBox) return; 
     if(isSelected){
        row.classList.add('selected')
    }else {
        row.classList.remove('selected')
    }       
}

function isAllChecked(rowList){
    return Object
        .keys(rowList)
        .every(row=>{
            const checkBox = rowList[row].querySelector(CHECKBOX_SELECTOR)
            if(checkBox){
                return checkBox.checked
            }
            return true
        })
}

function isAnyChecked(rowList){
    return Object
        .keys(rowList)
        .slice(1)
        .some(row=>{
            const checkBox = rowList[row].querySelector(CHECKBOX_SELECTOR)
            if(checkBox){
                return checkBox.checked
            }
        })
}



//Modals
const modalButtons = document.querySelectorAll('[data-toggle="modal"]');
const modals = document.querySelectorAll('.modal');

function toggleDisplayModal(){
   const idTarget = this.dataset.target;
   const target = document.getElementById(`${idTarget}`);
   target.classList.add('show');
}

modalButtons.forEach(button => button.addEventListener('click', toggleDisplayModal));

function displayForm(modal, selectInput){
    const modalContent = modal.querySelector(`.modal-content`);
    const formSelected = modal.querySelector(`#${selectInput.value}`);

    modalContent.style.width = '768px'
    formSelected.style.display = 'block'
}

modals.forEach( modal => {
    const closeButton = modal.querySelector('.close');
    closeButton.addEventListener('click', ()=> modal.classList.remove('show'))

    const selectInput = modal.querySelector('.custom-select');
    selectInput.addEventListener('change',()=>displayForm(modal, selectInput))
});


