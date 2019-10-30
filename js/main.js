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

    console.log(`#${selectInput.value}`)
    modalContent.style.width = '768px'
    formSelected.style.display = 'block'
}
modals.forEach( modal => {
    //Close button
    const closeButton = modal.querySelector('.close');
    closeButton.addEventListener('click', (e)=> modal.classList.remove('show'))

    //Show form
    const selectInput = modal.querySelector('.custom-select');
    selectInput.addEventListener('change',()=>displayForm(modal, selectInput))
});


