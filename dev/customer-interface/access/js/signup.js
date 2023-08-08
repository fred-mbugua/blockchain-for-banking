const customerFirstName = document.querySelector('#signup_first_name');
const customerSecondName = document.querySelector('#signup_second_name');
const customerEmail = document.querySelector('#signup_email');
const customerUserName = document.querySelector('#signup_user_name');
const customerSignupBtn = document.querySelector('#proceed_signup');
const customerPasswordOne = document.querySelector('#signup_user_password_one');
const customerConfirmPassword = document.querySelector('#signup_user_confirm_password');
let agreedPassword;

customerSignupBtn.addEventListener('click', () => {
    // declare all characters
    const characters ='abcdefghijklmnopqrstuvwxyz0123456789';

    function generateUserBlockchainAddress(length) {
        let address = ' ';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            address += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return address;
    }

    //getting date
    let time = new Date(Date.now());
    let month;
    let day;
    let hours;
    let minutes;
    let seconds;
    //putting a zero before the date-time values incase a value is less than ten
    if (time.getMonth() < 10) {
      month = `0${time.getMonth()}`;
    }

    if (time.getDate() < 10) {
      day = `0${time.getDate()}`;
    }

    if (time.getHours() < 10) {
      hours = `0${time.getHours()}`;
    } else{
      hours = time.getHours();
    }

    if (time.getMinutes() < 10) {
      minutes = `0${time.getMinutes()}`;
    } else {
      minutes = time.getMinutes();
    }

    if (time.getSeconds() < 10) {
      seconds = `0${time.getSeconds()}`;
    } else {
      seconds = time.getSeconds();
    }

    console.log(generateUserBlockchainAddress(20));
    let data = {
        customers_customer_id: 755696,
        customers_customer_first_name: customerFirstName.value,
        customers_customer_second_name: customerSecondName.value,
        customers_customer_user_name: customerUserName.value,
        customers_customer_address: generateUserBlockchainAddress(20),
        customers_customer_registration_date: `${day}-${month}-${time.getFullYear()} ${hours}:${minutes}:${seconds}`,
        customers_customer_last_transaction_date: `${day}-${month}-${time.getFullYear()} ${hours}:${minutes}:${seconds}`,
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
