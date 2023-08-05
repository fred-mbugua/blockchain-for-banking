const customerEmail = document.querySelector('#login_email');
const customerUserName = document.querySelector('#login_userName');
const customerPassword = document.querySelector('#login_password');
const loginPassword = document.querySelector('#proceed_login');

loginPassword.addEventListener('click', () => {
    let data = {
        customers_customer_email_address: customerEmail.value,
        customers_customer_user_name: customerUserName.value,
        customers_customer_password: customerPassword.value,
    }
   
    fetch('/users/validate', {
        method: 'post',
        headers: new Headers({"Content-Type": "application/json"}),
        body: JSON.stringify({data})
    }).then(res => res.json())
    .then(data => {
        if(data.success) {
            sessionStorage.setItem("fredblockchain", JSON.stringify(data.data));
            location.href = '/fredblockchain'
            // console.log(data.data);
        } else {
            alert("Check your login credentials and try again!");
        }
    })
    
})
