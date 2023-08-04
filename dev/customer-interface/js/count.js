//----Getting count data------------//


//--------------Start of fetching address data to get account balance----------//
let currentAddress;
let fetchAddressData = (req, res) => {
  // console.log('Fetching balance');
    fetch(`/address/${currentAddress}`,{
        method: 'GET',
    }).then(res => res.json())
    .then(data => {
      setUserBalance(data);
    });
}
//------------End of searching address data----------------//
  
  const setUserBalance = (data) => {
    // console.log("Block chain data: "+data.chain.length);
    const totalBalance = document.querySelector("#current-user-balance");
    totalBalance.innerHTML = data.addressData.addressBalance;
  };
  //reading total number of blocks
  fetchAddressData();


  //fetch transactions count data
const fetchTotalCountOfTransactions = () => {
  fetch("/blockchain", {
    method: "GET",
    // headers: new Headers({ "Content-Type": "application/json" }),
    // body: JSON.stringify({}),
  })
    .then((res) => res.json())
    .then((data) => {
      calculateTheNumberTotalOfTransactionsInTheBlockchain(data);
    })
    .catch((err) => {
      // location.replace('/404 ');
      //console.log(err);
    });
};

const calculateTheNumberTotalOfTransactionsInTheBlockchain = (data) => {
  let allTransactions = [];

    data.chain.forEach(block => { //iterating through blocks
      //checking if the transaction array in a block is empty, if not, add the transaction to the transactions array, if its length is greater than 0, then it's not empty
      if(block.transactions.length > 0){
        allTransactions.push(block.transactions);
      }
    });

    console.log("Transactions = "+allTransactions);
    //using Set() to create an instance of unique values deleting duplicates
    let uniqueTransactions = [...new Set(allTransactions)];
    console.log("Unique transactions = "+uniqueTransactions);
  setTotalCountOfAllTransactionsData(uniqueTransactions.length);
}

const setTotalCountOfAllTransactionsData = (data) => {
  console.log("Transactions in Block chain data: "+data);
  const totalCountAllTransactions = document.querySelector("#no-of-transactions");
  totalCountAllTransactions.innerHTML = data;

};
//reading total number of all transactions
fetchTotalCountOfTransactions();
  

  //fetch addresses count data
  const fetchTotalCountOfAddresses = () => {
    fetch("/blockchain", {
      method: "GET",
      // headers: new Headers({ "Content-Type": "application/json" }),
      // body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((data) => {
        calculateTheNumberOfAddresses(data);
      })
      .catch((err) => {
        // location.replace('/404 ');
        //console.log(err);
      });
  };


  const calculateTheNumberOfAddresses = (data) => {
    let transactionIDs = [];

    data.chain.forEach(block => { //iterating through blocks
        block.transactions.forEach(transaction => { //iterating through transactions in the current block
          //adding transaction Ids to the transactionIds array
          transactionIDs.push(transaction.transactionId);
        });
    });

    console.log("Non Unique address = "+transactionIDs);
    //using Set() to create an instance of unique values deleting duplicates
    let uniqueAddresses = [...new Set(transactionIDs)];
    console.log("Unique address = "+uniqueAddresses);
    setTotalCountOfAllAddressesData(uniqueAddresses.length);
  }

  const setTotalCountOfAllAddressesData = (count) => {
    console.log("Addresses in Block chain data: "+count);
    const totalCountAllTransactions = document.querySelector("#no-of-addresses");
    totalCountAllTransactions.innerHTML = count;
  
  };
  //reading total number of all addresses
  fetchTotalCountOfAddresses();
  
    
  //----Getting all jobs in the server------------//
  
  
  //fetch All blocks
  const getAllBlocks = () => {
    return fetch("/blockchain", {
      method: "GET",
      // headers: new Headers({ "Content-Type": "application/json" }),
      // body: JSON.stringify({ currentUser: currentUser }),
    })
      .then((res) => res.json())
      .then((data) => {
        // if(data != null){
        //   spinnerBelow.classList.add('hide');
        // }
        return data;
      });
  };

  const displayActivities = () => {
    contentContainer.innerHTML = `
    <div class="activities__container">
        <div class="activity">
            <span class="activity__icon"><i class="uil uil-bitcoin-circle"></i></span>
            <h5>Send Money</h5>
        </div>

        <div class="activity">
            <span class="activity__icon"><i class="uil uil-palette"></i></span>
            <h5>Withdraw</h5>
        </div>

        <div class="activity">
            <span class="activity__icon"><i class="uil uil-file-edit-alt"></i></span>
            <h5>Balance</h5>
        </div>  
    </div>
    ${getActivitiesStyles()}
    `;
  }
  
  const getActivitiesStyles = () => {
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
          --color-bg2: #b0d5a9;
          --color-theme-border: #f2f2f2;
          --color-blue: #5389fcff;
        }
        .activities__container{
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.2rem;
        }
        
        .activity{
            background: var(--color-bg2);
            padding: 2rem;
            border-radius: 2rem;
            transition: var(--transition);
            display: flex;
            gap: 1rem;
        }
        
        .activity:hover{
            box-shadow: 0 3rem 3rem rgba(0, 0, 0, 0.3);
            cursor: pointer;
            z-index: 1;
        }
        
        .activity:nth-child(2) .activity__icon{
            background: var(--color-danger);
        }
        
        .activity:nth-child(3) .activity__icon{
            background: var(--color-success);
        }
        
        .activity:nth-child(4) .activity__icon{
            background: var(--color-warning);
        }
        
        .activity:nth-child(5) .activity__icon{
            background: var(--color-success);
        }
        
        .activity__icon{
            background: var(--color-primary);
            padding: 0.7rem;
            border-radius: 0.9rem;
        }
        
        .activity h5{
            margin: 2rem 1rem;
        }
        
        .activity p{
            font-size: 0.85rem;
        }

        @media screen and (max-width: 600px) {
          .activities__container{
            grid-template-columns: 100%;
          }
        }
      </style>
    `;
  }
  //fetch All Transactions
  const getAllTransactions = (currentUser) => {
    return fetch("/blockchain", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        return data;
      });
  };
  
  
  //fetch Pending jobs submitted by users
  const getAllAddresses = (currentUser) => {
    return fetch("/blockchain", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        // if(data != null){
        //   spinnerBelow.classList.add('hide');
        // }
        return data;
      });
  };

  
  //creating the jobs list
  const createBlockList = (data, parent) => {
    let blocksContainer = document.querySelector(".content-items");
    let loader = document.querySelector("#loader");
    if (loader) {
      loader.remove()
    }
    // //console.log(data);
    if (data != "no jobs") {
      blocksContainer.innerHTML += `
        ${createBlockCards(data)}
    `;
    }
  };
  
  const createBlockCards = (data, parent) => {
  
    let blocksCards = `
      <h2 class="all">${text}</h2>
    `
    // console.log("populateBlocksPage Function"+data.chain.length);

    for (let i = 0; i < data.chain.length; i++) {
      blocksCards += `
        <block-container type="block" block-id="${data.chain[i].hash}" url="url" status="${data.chain[i].index}" text="Block index ${data.chain[i].index}"
          name="${data.chain[i].index}" date="${data.chain[i].timestamp}">
        </block-container>
      `;
    }
    return blocksCards;
  };
  
  
  //displaying all blocks
  getAllBlocks().then((data) =>
    createBlockList(data, ".blog-area")
  );
  
  let tabController = document.querySelector('section#controls');
  const tabLoader = `
    <div id="loader" class="loader">
    <div class="post">
      <div class="top">
        <div class="info">
          <p class="name"></p>
          <span class="time"></span>
        </div>
      </div>
    </div>
    <div class="post">
      <div class="top">
        <div class="info">
          <p class="name"></p>
          <span class="time"></span>
        </div>
      </div>
    </div>
    <div class="post">
      <div class="top">
        <div class="info">
          <p class="name"></p>
          <span class="time"></span>
        </div>
      </div>
    </div>
    </div>
  `
  let activeTab = tabController.querySelector('div.item.current');
  let contentContainer = document.querySelector('#content-items');
  
  
  if (tabController != null && contentContainer != null) {
    const tabItems = tabController.querySelectorAll('div.item');
    tabItems.forEach(tab => {
      tab.addEventListener("click", (e) => {
        e.stopPropagation();
        activeTab.classList.remove('current')
        tab.classList.add('current')
        activeTab = tab
  
        this.updateContent(tab)
      })
    });
  }

  const populateBlocksPage = (data, text) => {
  
    let blocksCards = `
      <h2 class="all">${text}</h2>
    `
    // console.log("populateBlocksPage Function"+data.chain.length);

    for (let i = 0; i < data.chain.length; i++) {
      blocksCards += `
        <block-container type="block" block-id="${data.chain[i].hash}" url="url" status="${data.chain[i].index}" text="Block index ${data.chain[i].index}"
          name="${data.chain[i].index}" date="${data.chain[i].timestamp}">
        </block-container>
      `;
    }
    return blocksCards;
  };
  
  const populateTransactionsPage = (data, text) => {
  
    let noTransactionsHeader = `<h2> You have not made any transaction.</h2>`;
    let transactionsCards = `<h2 class="all">${text}</h2>`;
    let transactionsLength;
    data.chain.forEach(block => { //iterating through blocks
      // console.log("block.transactions.length: "+block.transactions.length)
      transactionsLength = block.transactions.length;
      block.transactions.forEach(transaction => { //iterating through transactions in the current block
        transactionsCards += `
                              <block-container type="transaction" block-id="${transaction.transactionId}" url="url" text="Transaction ID: ${transaction.transactionId}, Amount sent: ${transaction.sender} "
                                name="${transaction.sender}">
                              </block-container>
                            `;
      });
    });
    //checking if the transactions are empty, if they are empty, show the noTransactionsHeader else display the transactions and change the header
    if (transactionsLength === 0) {
      contentContainer.innerHTML = noTransactionsHeader;
    } else if (transactionsLength > 0) {
      contentContainer.innerHTML = transactionsCards;
    }
  };


  const populateAddressesPage = (data, text) => {
  
    let addressCards = `
      <h2 class="all">${text}</h2>
    `;
    let transactionIDs = [];
      data.chain.forEach(block => { //iterating through blocks
        if (block.transactions.length === 0) {
          // console.log("block.transactions.length condition: "+block.transactions.length)
          addressCards = `<h2> You have not made any transaction to any address.</h2>`;
        } else {
          addressCards = `<h2 class="all">${text}</h2>`
          block.transactions.forEach(transaction => { //iterating through transactions in the current block
            //adding transaction Ids to the transactionIds array
            transactionIDs.push(transaction.transactionId);
            // console.log("Non Unique address = "+transactionIDs);
            //using Set() to create an instance of unique values deleting duplicates
            let uniqueAddresses = [...new Set(transactionIDs)];
            // console.log("Unique address = "+uniqueAddresses);
            uniqueAddresses.forEach(address => {
              // console.log("Each Address = "+address)
              addressCards += `
                <block-container type="address" block-id="${address}" url="url" text="This is a unique address" "
                  name="${address}">
                </block-container>
              `;
            })
          });
        }
        
    });
    contentContainer.innerHTML = addressCards;
  };
  
  //default
  contentContainer.innerHTML = tabLoader
        setTimeout(() => {
          // getAllBlocks().then((data) =>
          //   // populateBlocksPage(data, "All Blocks")
          //   contentContainer.innerHTML = populateBlocksPage(data, "All Blocks")
          // );
          displayActivities();
        }, 1000);
  
  function updateContent(tab) {

    switch (tab.dataset.item) {
      case "blocks":
        contentContainer.innerHTML = tabLoader
        setTimeout(() => {
          displayActivities();
          // getAllBlocks().then((data) =>
          //  contentContainer.innerHTML = populateBlocksPage(data, "All Blocks")
          // );
        }, 1000);
        break;
      case "transactions":
        contentContainer.innerHTML = tabLoader
        setTimeout(() => {
          getAllTransactions().then((data) =>
          populateTransactionsPage(data, "All Transactions")
          );
        }, 1000);
        break;
      case "addresses":
        contentContainer.innerHTML = tabLoader
        setTimeout(() => {
          getAllAddresses().then((data) =>
          populateAddressesPage(data, "All Addresses")
          );
        }, 1000);
        break;
      case "search":
        contentContainer.innerHTML = tabLoader
        setTimeout(() => {
          getSearchKey()
          // then((data) =>
          // populateSearchPage(data, "Search the entire blockchain")
          // );
        }, 1000);
        break;
        
      default:
        contentContainer.innerHTML = tabLoader
        setTimeout(() => {
          getAllBlocks().then((data) =>
            populateBlocksPage(data, "All Blocks")
            // contentContainer.innerHTML = populateBlocksPage(data, "All Blocks")
          );
        }, 1000);
    }
  }