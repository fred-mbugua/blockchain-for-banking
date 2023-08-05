const block = null;
const transaction = null;
const addressData = null;
const initialSearchMade = false;
let searchType;


const searchKey = document.querySelector('.search-key');
const searchButton = document.querySelector('.blockbutton');
const blockHash = searchKey.value;
let transactionId;

//----------Searching with BlockHash Value--------------//
let blockChainValue = document.querySelector('.blockchain_value');

let fetchBlock = (req, res) => {
    fetch(`/block/${blockHash}`,{
        method: 'GET',
    }).then(res => {
        block = res.data.block;
        transaction = null;
        addressData = null;

        blockChainValue.value = block.index;
    })
    .then(data => {

    });
}
searchButton.addEventListener('click', () => {
    fetchBlock(blockHash);
})

//--------------------End of searching with block hash value---------------------//

//-----------------Start of searching for transaction with transaction ID-----//
let transactionIdValue = document.querySelector('');
let fetchTransactionById = (req, res) => {
    fetch(`/block/${transactionId}`,{
        method: 'GET',
    }).then(res => {
        transaction = res.data.transaction;
        block = null;
        addressData = null;

        transactionIdValue.value = transaction.name;
    })
    .then(data => {

    });
}
searchButton.addEventListener('click', () => {
    fetchTransactionById(transactionId);
})

//--------------End of searching for transaction-----//

//--------------Start of fetching address data ----------//
let addressDataValue = document.querySelector('');
let fetchAddressData = (req, res) => {
    fetch(`/address/${address}`,{
        method: 'GET',
    }).then(res => {
        addressData = res.data.addressData;
        if (!addressData.addressTransactions.length) addressData = null;
        block = null;
        transaction = null;

        addressDataValue.value = transaction.name;
    })
    .then(data => {

    });
}
searchButton.addEventListener('click', () => {
    fetchAddressData(address);
})
//------------End of searching address data----------------//

//------------Searching----------------------------------//
let search = (searchKey) => {
    initialSearchMade = true;

    if (searchType === 'block') {
        fetchBlock(searchKey);
    } else if (searchType === 'transaction') {
        fetchTransactionById(searchKey);
    } else if (searchType === 'address') {
        fetchAddressData(searchKey);
    }
}

//-----------End of Searching---------------------------//

//-----------Begin Sending money---------------------------//
const sendMoneyToAddress = (req, res) => {
    fetch('/')
}
//-----------End of Sending money---------------------------//