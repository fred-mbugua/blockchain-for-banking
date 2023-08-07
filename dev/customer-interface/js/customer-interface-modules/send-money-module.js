const sendMoneyActivity = () => {
    const sendMoney = document.querySelector('.activity_send_money');
    const closeOverlayButton = document.querySelector('.close-overlay');
    const sendMoneyOverlay = document.querySelector('.overlay');
    const sendMoneyForm = document.querySelector('#send-details-input');
    const sendResponse = document.querySelector('#send-response');
    const sendMoneyButton = document.querySelector('#proceed_sending');

    
    sendMoney.addEventListener('click', () => {
      sendResponse.style.display = 'none';
      sendMoneyOverlay.style.display = 'flex';
      sendMoneyForm.style.display = 'flex';
      sendMoneyButton.style.display = "block";
      checkBalanceOfCurrentUser();
      
    });
    closeOverlayButton.addEventListener('click', () => {
      sendMoneyOverlay.style.display = 'none';
      sendMoneyForm.style.display = 'none';
    });
    
  }


const sendMoneyToAddress = (userBalance, pendingTransactionsBalance) => {
    console.log('balance: '+userBalance)
    const sendMoneyButton = document.querySelector('#proceed_sending');
    const sendResponse = document.querySelector('#send-response');
    const address = document.querySelector('#recipient_id');
    const amount = document.querySelector('#recipient_send_amount');
    const senderAddress = JSON.parse(sessionStorage.getItem("fredblockchain")).customerAddress;
    const totalBalance = Number(userBalance) + Number(pendingTransactionsBalance);
    const pendingAndIncomingTotal = Number(amount.value) + Number(pendingTransactionsBalance)
    // console.log('Total balance: '+totalBalance)
    // console.log('Block chain balance: '+userBalance)
    console.log('PendingTransactionsBalance: '+pendingTransactionsBalance)
    
    sendMoneyButton.addEventListener('click', () => {
        sendResponse.style.display = "none";
        // console.log('balance 2: '+Number(userBalance))
        // console.log('send value 2: '+amount.value)
      if (address.value === "" || amount.value === "" || address.value === null || amount.value === null || address.value === undefined || amount.value === undefined) {
        sendResponse.innerHTML = "Check if you have an empty input field.";
        sendResponse.style.display = "flex";
      } else if(userBalance < amount.value){
        sendResponse.innerHTML = "The amount you are trying to send is more than your account balance.";
        sendResponse.style.display = "flex";
      }else if(((Number(amount.value) + Number(pendingTransactionsBalance)) - Number(userBalance)) > 0){
        sendResponse.innerHTML = `The amount you are trying to input together with the amount already sent and in pending transactions of this blockchains' node of Ksh.${pendingTransactionsBalance} totals to Ksh.${(Number(amount.value) + Number(pendingTransactionsBalance))} which is more than your balance of Ksh.${userBalance}. You cannot transact more than you have. Deposit more to your account if you want to continue sending.`;
        sendResponse.style.display = "flex";
      } else {

        return fetch("/transaction/broadcast", {
          method: "post",
          headers: new Headers({"Content-Type": "application/json"}),
          body: JSON.stringify({
            amount: amount.value,
            sender: senderAddress,
            recipient: address.value,
          })
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              // console.log("SEND RESPONSE DATA"+data.note)
              sendResponse.innerHTML = data.success;
              sendResponse.style.color = "#08b86f";
              sendResponse.style.display = "flex";
              sendMoneyButton.style.display = "none";
              location.reload();
            } else {
              sendResponse.innerHTML = data.note;
              sendResponse.style.display = "flex";
            }
          });
      }
    })
  }

  const checkBalanceOfCurrentUser = (req, res) => {
    const currentAddress = customer.customerAddress;
    console.log("currentAddress = "+currentAddress)
    fetch(`/address/${currentAddress}`,{
        method: 'GET',
    }).then(res => res.json())
    .then(data => {
            console.log("Log data: "+data.addressData.addressBalance)
            let userBalance = data.addressData.addressBalance;
            fetchPendingTransactionBal(userBalance);
            
        // if (data.addressData.addressBalance) {
        //     console.log("Log data: "+data.addressData.addressBalance)
        //     let userBalance = data.addressData.addressBalance;
        //     fetchPendingTransactionBal(userBalance);
            
        // }
    });
  }

  const fetchPendingTransactionBal = (userBalance) => {
    const currentAddress = customer.customerAddress;
    console.log("Inside fetchPendingTransactionBal")
    fetch(`/pendingaddress/${currentAddress}`,{
        method: 'GET',
    }).then(res => res.json())
    .then(data => {
        let pendingTransactionsUserBalance = data.addressData.addressBalance;
        console.log("data.addressData.addressBalance: "+pendingTransactionsUserBalance)
        sendMoneyToAddress(userBalance, pendingTransactionsUserBalance);
    });
  }


// export default sendMoneyActivity;
  