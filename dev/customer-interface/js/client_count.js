// //----GET count data------------//
// //get balance
// const balanceCount = (req, res) => {
//     const customerAddress = customer.customerAddress;
//     fetch('/user/:address', {
//         method: 'post',
//         headers: new Headers({"Content-Type": "application/json"}),
//         body: JSON.stringify({customerAddress})
//     })
//     .then(res => res.json())
//     .then(data => {
//         if (data.success) {
//             const time = new Date(Date.now());
//             let month;
//             let day;

//             //putting a zero before the date-time values incase a value is less than ten
//             if (time.getMonth() < 10) {
//             month = `0${time.getMonth()}`;
//             }

//             if (time.getDate() < 10) {
//             day = `0${time.getDate()}`;
//             }

//             //formatted date
//             const customerInterfaceDate = document.querySelector('.customer-interface-date');
//             customerInterfaceDate.innerHTML = `Today ${day}/${month}/${time.getFullYear()}`;

//            //displaying balance
//            const customerBalance = document.querySelector('.current-user-balance');
//            const balance = data.success[0].customers_customer_balance;
//            customerBalance.innerHTML = balance;
//         }
//     })
// }
// balanceCount();