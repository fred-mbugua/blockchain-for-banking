const customer = JSON.parse(sessionStorage.getItem("fredblockchain"));
const customerNameElement = document.querySelector('.customer-name');
const customerAddress = document.querySelector('.customer-address');

if (!customer) {
    location.href = '/fredblockchain-login';
} else {
    customerNameElement.innerHTML = `Welcome ${customer.customerName}`;
    customerAddress.innerHTML = `Your fredblockchain address: ${customer.customerAddress}`;
}