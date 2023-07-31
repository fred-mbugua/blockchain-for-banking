export default class SearchContainer extends HTMLElement {
    constructor() {
  
  
      super();
  
    //  shadow root
      // this.shadowObj = this.attachShadow({mode: 'open'});
  
      this.render();
  
    }
  
  
    render() {
      // this.shadowObj.innerHTML = this.getTemplate();
      this.innerHTML = this.getTemplate();
    }
  
    searchBtnConnectedCallback() {
      console.log('inside searchBtnConnectedCallback');
      const blockSearchBtn = this.querySelector('#blocksearchbtn');
      const transactionSearchBtn = this.querySelector('#transactionsearchbtn');
      const addressSearchBtn = this.querySelector('#address_searchbtn');
      // const searchKey = document.querySelector('.search_input').value;
      
      if(blockSearchBtn != null){
        blockSearchBtn.addEventListener('click', () => {
          const searchKey = this.querySelector('#blockSearchKey').value;
          console.log("Button clicked!")
          this.hideSearchBar();
          this.openBlockSearchDetails(searchKey);
        });
      }

      if(transactionSearchBtn != null){
        transactionSearchBtn.addEventListener('click', () => {
          const searchKey = this.querySelector('#transactionSearchKey').value;
          this.hideSearchBar();
          this.openTransactionSearchDetails(searchKey);
      });
      }
      
      if(addressSearchBtn != null){
        addressSearchBtn.addEventListener('click', () => {
          const searchKey = this.querySelector('#addressSearchKey').value;
          this.hideSearchBar();
          this.openAddressSearchDetails(searchKey);
      });
      }
      
    }

    
    hideSearchBar() {
      let searchBar = document.querySelector('.search__section');
      searchBar.style.display = 'none';
    }
  
   
    openBlockSearchDetails(blockData) {
      // updating the state
      let parent  = document.querySelector('body');
  
      // response.remove()
      let html  = `
        <modal-task
            id="${blockData}"
            type="blockSearchkey"
          >
        </modal-task>`;
  
      parent.insertAdjacentHTML('beforeEnd', html);
    }

    openTransactionSearchDetails(transactionData) {
      // updating the state
      let parent  = document.querySelector('body');
  
      // response.remove()
      let html  = `
        <modal-task
            id="${transactionData}"
            type="transactionSearchkey"
          >
        </modal-task>`;
  
      parent.insertAdjacentHTML('beforeEnd', html);
    }

    openAddressSearchDetails(addressData) {
      // updating the state
      let parent  = document.querySelector('body');
  
      // response.remove()
      let html  = `
        <modal-task
            id="${addressData}"
            type="addressSearchkey"
          >
        </modal-task>`;
  
      parent.insertAdjacentHTML('beforeEnd', html);
    }
    
  
    disconnectedCallback() {
      // console.log('inside disconnectedCallback');
      // adding event handler to the button
    }
  
    getTemplate() {
      // Show HTML Here
      return `
      ${this.getSearchAreaStyles()}
        `;
    }
  
    getSearchAreaStyles() {
      return `
      <style>

      :root {
        
        --color-primary: #f2f2f2;
        --color-success: #00bf8e;
        --color-warning: #f7c94b;
        --color-danger: #f75842;
        --color-danger-variant: rgba(247, 88, 66, 0.4);
        --color-white: #fff;
        --color-light: rgba(255, 255, 255, 0.7);
        --color-black: #000;
        --color-bg: #f2f2f2;
        --color-theme-border: #f2f2f2;
        --color-blue: #5389fcff;
      }

      .search__section{
        display: flex;
        width: 100%;
        height: 30px;
        align-items: center;
        /* position: sticky; */
        top: 0.4rem;
        justify-content: center;
        z-index: 99;
      }
      
      .search__section-items{
          width: 70%;
          height: fit-content;
          display: grid;
          align-items: center;
          grid-template-columns: 90% 10%;
      }
      
      .search__section-items-input{
          width: 100%;
          height: 40px;
          
      }
      
      .search_input{
          width: 100%;
          height: 40px;
          color: #000;
          border: 1px solid var(--color-blue);
          border-radius: 7px 0 0 7px;
          padding-left: 7px;
      }
      
      .search__section-items-searchicon{
          color: #fff;
          height: fit-content;
          border: 1px solid var(--color-blue);
          border-radius: 0 7px 7px 0;
          height: 40px;
          width: 40px;
      }

      .search__section-items-searchicon:hover {
        cursor: pointer;
      }
      
      .search_button{
          color:  var(--color-blue);
          height: 35px;
          background-color: var(--color-bg);
          cursor: pointer;
          width: 35px;
          margin: auto;
      }

      .search_button:hover {
        cursor: pointer;
      }
      </style>
      `
    }
  }