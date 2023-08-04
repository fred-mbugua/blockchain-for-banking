// let searchPageContainer = document.querySelector('.content-items');
// const searchInput = `
//     <h1 class="search-pg-title">Search the entire blockchain</h1>
//     <section class="search__section">
//       <div class="search__section-items">
//         <div class="search__section-items-input">
//           <input
//             type="text"
//             name="search_input"
//             class="search_input"
//             placeholder="search blocks, transactions or addresses here.."
//           />
//         </div>
//         <div class="search__section-items-searchicon">
//           <button class="search_button" name="search_button">
//             <i class="fa fa-search"></i>
//           </button>
//         </div>
//       </div>
//     </section>
//     <!--End of nav section-->
//     `;
//     searchPageContainer.innerHTML = searchInput;



      

//       const populateSearchPage = (data, text) => {
  
//         let transactionsCards = `
//           <h2 class="all">${text}</h2>
//         `
//         data.chain.forEach(block => { //iterating through blocks
//           block.transactions.forEach(transaction => { //iterating through transactions in the current block
           
//             console.log("Transactions: "+transaction.sender);
//             transactionsCards += `
//             <block-container type="transaction" block-id="${transaction.transactionId}" url="url" text="Transaction ID: ${transaction.transactionId}, Amount sent: ${transaction.sender} "
//               name="${transaction.sender}">
//             </block-container>
//           `;
//           });
//       });
        
//         contentContainer.innerHTML = transactionsCards;
//       };

//create a search input and get search key
  const getSearchKey = () => {
    getSearchBar();
  }

  function getSearchBar() {
    let searchPageContainer = document.querySelector('.content-items');
    const searchInput = `
    <h1 class="search-pg-title">Search the entire blockchain</h1>
    <section class="search__section">
      <div class="search__section-items">
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
            <i class="fa fa-search"></i>
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


      const searchBtn = document.querySelector('.search_button');
    //   searchBtn.addEventListener('click', () => {
    //     const searchKey = document.querySelector('.search_input').value;
    //     console.log("Button clicked!")
    //   //   this.hideSearchBar();
    //   //   this.openBlockSearchDetails(searchKey);
    //   });

      
      if(searchBtn != null){
        searchBtn.addEventListener('click', () => {
          const searchKey = document.querySelector('.search_input').value;
          console.log("Button clicked!")
        //   this.hideSearchBar();
        //   this.openBlockSearchDetails(searchKey);
        });
      }