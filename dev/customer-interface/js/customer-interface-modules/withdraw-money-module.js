const withdrawMoneyActivity = () => {
    const withdrawMoney = document.querySelector('.activity_withdraw_money');
    const closeOverlayButton = document.querySelector('.close-overlay');
    const withdrawMoneyOverlay = document.querySelector('.overlay');
    const withdrawMoneyForm = document.querySelector('#withdraw-details-input');
    const withdrawResponse = document.querySelector('#withdraw-response');

    withdrawMoney.addEventListener('click', () => {
      withdrawResponse.style.display = 'none';
      withdrawMoneyOverlay.style.display = 'flex';
      withdrawMoneyForm.style.display = 'flex';
      checkBalOfCurrentUser();
    });
    closeOverlayButton.addEventListener('click', () => {
      withdrawMoneyOverlay.style.display = 'none';
      withdrawMoneyForm.style.display = 'none';
    });
    
  }

  const checkBalOfCurrentUser = (req, res) => {
    const currentAddress = customer.customerAddress;
    console.log("currentAddress = "+currentAddress)
    fetch(`/address/${currentAddress}`,{
        method: 'GET',
    }).then(res => res.json())
    .then(data => {
            console.log("Log data: "+data.addressData.addressBalance)
            let userBalance = data.addressData.addressBalance;
            fetchPendingTransactionBalance(userBalance);
    });
  }

  const fetchPendingTransactionBalance = (userBalance) => {
    const currentAddress = customer.customerAddress;
    console.log("Inside fetchPendingTransactionBal")
    fetch(`/pendingaddress/${currentAddress}`,{
        method: 'GET',
    }).then(res => res.json())
    .then(data => {
        let pendingTransactionsUserBalance = data.addressData.addressBalance;
        withdrawMoneyFromAccount(userBalance, pendingTransactionsUserBalance);
    });
  }

  const withdrawMoneyFromAccount = (userBalance, pendingTransactionsUserBalance) => {
    const withdrawMoneyButton = document.querySelector('#proceed_withdrawing');
    const withdrawResponse = document.querySelector('#withdraw-response');
    const amount = document.querySelector('#withdraw_amount');
    const currentUserAddress = JSON.parse(sessionStorage.getItem("fredblockchain")).customerAddress;
    const totalBalance = Number(userBalance) - Number(pendingTransactionsUserBalance);
    const transactionCharges = Number(10);
    let totalWithdrawalAmount;
    console.log('Total balance: '+totalBalance)
    console.log('Block chain balance: '+userBalance)
    

    withdrawMoneyButton.addEventListener("click", () => {
      totalWithdrawalAmount = Number(amount.value) + Number(transactionCharges);
      console.log('Total withdrawal amount: '+totalWithdrawalAmount)
        if (amount.value === "" || amount.value === null) {
            withdrawResponse.innerHTML = "Ensure there is a value in the amount field.";
            withdrawResponse.style.display = "flex";
            location.reload();
          }else if (totalBalance < Number(totalWithdrawalAmount)) {
            withdrawResponse.innerHTML = `You account balance of ksh.${userBalance} minus you pending transactions transacted amount of ksh.${pendingTransactionsUserBalance} is less than the amount you are trying to withdraw plus the withdrawal charges of Ksh.10.`;
            withdrawResponse.style.display = "flex";
            location.reload();
          } else {
            fetch('/transaction/broadcast', {
                method: 'post',
                headers: new Headers({"Content-Type": "application/json"}),
                body: JSON.stringify({
                    amount: Number(`-${amount.value}`), //-ve value since it's a withdrawal transaction and ksh.10 withdrawal charge
                    sender: currentUserAddress,
                    recipient: currentUserAddress,
                    charges: transactionCharges
                  })
            }).then((res) => res.json())
            .then((data) => {
              if (data.success) {
                withdrawResponse.innerHTML = data.success;
                withdrawResponse.style.color = "#08b86f";
                withdrawResponse.style.display = "flex";
                location.reload();
              } else {
                withdrawResponse.innerHTML = data.note;
                withdrawResponse.style.display = "flex";
                location.reload();
              }
            });
          }
    })
  }