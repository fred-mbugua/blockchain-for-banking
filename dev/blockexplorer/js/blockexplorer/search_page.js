//create a search input and get search key
  const getSearchKey = () => {
    getSearchBar();
    const searchBtn = document.querySelector('.search_button');
    
      // console.log("searchBtn"+searchBtn)
      if(searchBtn != null){
        searchBtn.addEventListener('click', () => {
          const searchKey = document.querySelector('.search_input').value;
          const type = document.querySelector('.search__section-option').value;
          // console.log("Button clicked!"+searchKey)
          // this.hideSearchBar();
          this.openBlockSearchDetails(searchKey, type);
        });
      }
  }

 function openBlockSearchDetails(key, type) {
    // updating the state
    let parent  = document.querySelector('body');

    // response.remove()
    let html  = `
      <modal-task
          id="${key}"
          status="paid"
          type="${type}"
        >
      </modal-task>`;

    parent.insertAdjacentHTML('beforeEnd', html);
  }

  function getSearchBar() {
    let searchPageContainer = document.querySelector('.content-items');
    const searchInput = `
    <h1 class="search-pg-title">Search the entire blockchain</h1>
    <section class="search__section">
      <div class="search__section-items">
        <select class="search__section-option">
          <option value="block">Block</option>
          <option value="transaction">Transaction</option>
          <option value="address">Address</option>
        </select>
        <div class="search__section-items-input">
          <input
            type="text"
            name="search_input"
            class="search_input item"
            placeholder="search blocks, transactions or addresses here.."
          />
        </div>
        <div class="search__section-items-searchicon">
          <button class="search_button" id="search_button" name="search_button">
          <i class="bi bi bi-search"></i>
          </button>
        </div>
      </div>
    </section>
    <!--End of nav section-->

    ${getSearchBarStyles()}
    `;
    searchPageContainer.innerHTML = searchInput;
  }

  function getSearchBarStyles() {
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

    .search-pg-title{
      align-items: center;
      display: flex;
      justify-content: center;
    }

    .search__section{
      display: flex;
      width: 100%;
      height: 30px;
      align-items: center;
      /* position: sticky; */
      top: 0.4rem;
      justify-content: center;
    }
    
    .search__section-items{
      width: 70%;
      height: fit-content;
      display: flex;
      align-items: center;
    }

    .search__section-option{
      width: fit-content;
      height: 40px;
      border-radius: 7px 0 0 7px;
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
        border-radius: 0;
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


      