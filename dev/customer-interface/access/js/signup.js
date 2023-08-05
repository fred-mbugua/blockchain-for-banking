const customerFirstName = document.querySelector('#signup_first_name');
const customerSecondName = document.querySelector('#signup_second_name');
const customerEmail = document.querySelector('#signup_email');
const customerUserName = document.querySelector('#signup_user_name');
const customerSignupBtn = document.querySelector('#proceed_signup');
const customerPasswordOne = document.querySelector('#signup_user_password_one');
const customerConfirmPassword = document.querySelector('#signup_user_confirm_password');
let agreedPassword;

customerSignupBtn.addEventListener('click', () => {
    let data = {
        customers_customer_id: 755696,
        customers_customer_first_name: customerFirstName.value,
        customers_customer_second_name: customerSecondName.value,
        customers_customer_user_name: customerUserName.value,
        customers_customer_address: "HGFHEJVTGEYD",
        customers_customer_registration_date: "04/08/2023",
        customers_customer_last_transaction_date: "04/08/2023",
        customers_customer_last_transaction_id: 4785,
        customers_customer_password: agreedPassword,
        customers_customer_email_address: customerEmail.value,
    }
    
    if (customerPasswordOne.value === customerConfirmPassword.value) {
        agreedPassword = customerConfirmPassword.value;
        fetch("/users", {
            method: 'post',
            headers: new Headers({"Content-Type": "application/json"}),
            body: JSON.stringify({data})
        }).then(res => res.json())
        .then(status => {
            console.log(status);
            if (status.success) {
                location.pathname = '/fredblockchain-login';
            }
        });
    } else {
        alert('Given passwords do not match. Make sure they do!!');
    }

});
