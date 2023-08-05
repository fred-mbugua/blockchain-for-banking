const customer = JSON.parse(sessionStorage.getItem("fredblockchain"));
const customerNameElement = document.querySelector('.customer-name');

if (!customer) {
    location.href = '/fredblockchain-login';
} else {
    customerNameElement.innerHTML = `Welcome ${customer.customerName};<small> address:${customer.customerAddress}</small>`;
}