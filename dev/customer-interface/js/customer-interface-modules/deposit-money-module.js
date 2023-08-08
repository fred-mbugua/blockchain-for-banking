const depositMoneyActivity = () => {
    const depositMoney = document.querySelector('.activity_deposit_money');
    const closeOverlayButton = document.querySelector('.close-overlay');
    const depositMoneyOverlay = document.querySelector('.overlay');
    const depositMoneyForm = document.querySelector('#deposit-details-input');
    const sendResponse = document.querySelector('#deposit-response');

    depositMoney.addEventListener('click', () => {
      sendResponse.style.display = 'none';
      depositMoneyOverlay.style.display = 'flex';
      depositMoneyForm.style.display = 'flex';
      depositMoneyToAccount();
    });
    closeOverlayButton.addEventListener('click', () => {
      depositMoneyOverlay.style.display = 'none';
      depositMoneyForm.style.display = 'none';
      location.reload();
    });
    
  }

  const depositMoneyToAccount = () => {
    const depositMoneyButton = document.querySelector('#proceed_depositing');
    const depositResponse = document.querySelector('#deposit-response');
    const amount = document.querySelector('#deposit_amount');
    const currentUserAddress = JSON.parse(sessionStorage.getItem("fredblockchain")).customerAddress;

    depositMoneyButton.addEventListener("click", () => {
        if (amount.value === "" || amount.value === null) {
            depositResponse.innerHTML = "Ensure there is a value in the amount field.";
            depositResponse.style.display = "flex";
            depositMoneyButton.style.display = "none";
          } else {
            fetch('/transaction/broadcast', {
                method: 'post',
                headers: new Headers({"Content-Type": "application/json"}),
                body: JSON.stringify({
                    amount: amount.value,
                    sender: currentUserAddress,
                    recipient: currentUserAddress
                  })
            }).then((res) => res.json())
            .then((data) => {
              if (data.success) {
                // console.log("SEND RESPONSE DATA"+data.note)
                depositResponse.innerHTML = data.success;
                depositResponse.style.color = "#08b86f";
                depositResponse.style.display = "flex";
                depositMoneyButton.style.display = "none";
              } else {
                depositResponse.innerHTML = data.note;
                depositResponse.style.display = "flex";
                depositMoneyButton.style.display = "none";
              }
            });
          }
    })
  }