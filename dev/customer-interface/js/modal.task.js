export default class ModalTask extends HTMLElement {
  constructor() {
    super();

    // shadow root
    // this.shadowObj = this.attachShadow({mode: 'open'});

    this.render();

  }


  render() {
    // this.shadowObj.innerHTML = this.getTemplate();
    this.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    // console.log('We are inside connectedCallback');
    this.disableScroll()
    // console.log(this.getAttribute('status'))
    let content = this.querySelector('#order-contents')

    switch (this.getAttribute('type')) {
      case 'block':
        setTimeout(() => {
          fetch(`/block/${this.getAttribute('id')}`,{
            method: 'GET',
        }).then(res => res.json())
        .then(data => {
          // console.log(data.block)
          if (data.block) {
            content.innerHTML = this.getContent('block', data)
          } else {
            content.innerHTML = `<p class="thats-it">No block found for this hash</p>`
          }
        });
        }, 100);

        setTimeout(() => {
          let items = this.querySelectorAll('a.transaction-item')
          console.log(items)
          if (items) {
            items.forEach(item => {
              item.addEventListener('click', (event) => {
                event.preventDefault()
                this.openTransaction(item.dataset.id)
              })
            });
          }
        }, 1500);
         
        break;
      case 'transaction':
        setTimeout(() => {
          fetch(`/transaction/${this.getAttribute('id')}`,{
            method: 'GET',
        }).then(res => res.json())
        .then(data => {

          // console.log(data)
          if (data.transaction) {
            content.innerHTML = this.getContent('transaction', data)
          } else {
            content.innerHTML = `<p class="thats-it">No transaction found for this id</p>`
          }
        });
        }, 1500);
        break;
      case 'address':
        setTimeout(() => {
          fetch(`/address/${this.getAttribute('id')}`,{
            method: 'GET',
        }).then(res => res.json())
        .then(data => {
          
          if (data.addressData) {
            // console.log("address endpoint "+data.addressData.addressBalance)
            content.innerHTML = this.getContent('address', data.addressData)
          } else {
            content.innerHTML = `<p class="thats-it">No address found for this address</p>`
          }
        });
        }, 1500);

        break;
    
      default:
        break;
    }



    let close  = this.querySelector('#responses .response-head > .actions > .control');

    if (close) {
      close.addEventListener('click', () => {
        this.remove();
      });
    }

  }

  disconnectedCallback() {
    // console.log('We are inside disconnectedCallback');
    // adding event handler to the button
    this.enableScroll()
  }

  disableScroll() {
    // Get the current page scroll position
    let scrollTop = window.scrollY || document.documentElement.scrollTop;
    let scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    document.body.classList.add("stop-scrolling");

    // if any scroll is attempted, set this to the previous value
    window.onscroll = function() {
      window.scrollTo(scrollLeft, scrollTop);
    };
  }

  enableScroll() {
    document.body.classList.remove("stop-scrolling");
    window.onscroll = function() {};
  }

  openTransaction(key){
      // updating the state
      let parent  = document.querySelector('body');

      let html  = `
        <modal-task
            id="${key}"
            status="paid"
            type="transaction"
          >
        </modal-task>`;

      parent.insertAdjacentHTML('beforeEnd', html);

      this.remove()
  }

  getTemplate() {
    // Show HTML Here
    return `
      <section id="responses" class="responses">
        <div class="response-head">
          <div class="actions">
            <span class="control">
              <i class="bi-chevron-left text-mobile"></i>
              <span class="text text-mobile">Back</span>
              <i class="bi-x text-desktop"></i>
              <span class="text text-desktop">Cancel</span>
            </span>
          </div>
        </div>
        <div id="order-contents" class="order-contents">
          ${this.getLoader()}
        </div>
      </section>
    ${this.getStyles()}`;
  }


  getContent(type, data){
    switch (type) {
      case 'block':
        return`
          <div class="infos">
            
            <div class="description">
            <p class="title">Block Index:</p>
              <span class="text">
              ${data.block.index}
              </span>
            </div>
            <div class="description">
            <p class="title">Timestamp:</p>
              <span class="text">
              ${data.block.timestamp}
              </span>
            </div>
            <div class="description-all">
              <p class="title">Block Transactions:</p>
              ${this.getFiles(data.block.transactions)}
            </div>
            <div class="description">
              <p class="title">Block Nonce Value:</p>
              <span class="text">
              ${data.block.nonce}
              </span>
            </div>
            <div class="description">
              <p class="title">Block Hash</p>
              <span class="text">
                ${data.block.hash}
              </span>
            </div>
            <div class="description">
              <p class="title">Previous Block Hash: </p>
              <span class="text">
                ${data.block.previousBlockHash}
              </span>
            </div>
          
          </div>
        `
        break;

        case 'transaction':
          return`
            <div class="infos">
              
              <div class="description">
              <p class="title">Transaction ID</p>
                <span class="text">
                ${data.transaction.transactionId}
                </span>
              </div>
              <div class="description">
              <p class="title">Transaction Amount</p>
                <span class="text">
                ${data.transaction.amount}
                </span>
              </div>
              <div class="description">
              <p class="title">Sender</p>
                <span class="text">
                ${data.transaction.sender}
                </span>
              </div>
              <div class="description">
                <p class="title">Recipient</p>
                <span class="text">
                ${data.transaction.recipient}
                </span>
              </div>
              
            </div>
          `
          break;

          case 'address':
        return`
          <div class="infos">
            <div class="description">
              <p class="title">Balance</p>
              <span class="text">
              ${data.addressBalance}
              </span>
            </div>
            ${this.getAddressData(data.addressTransactions)}
            
            
          </div>
        `
        break;
    
      default:
        break;
    }
    
  }

  getAddressData(addressTransactions){
    let html = ``;
    addressTransactions.forEach(transaction => {
      html += `
              <div class="address_transactions_list">
                  <div class="description">
                  <p class="title">Sender</p>
                    <span class="text">
                    ${transaction.sender}
                    </span>
                  </div>
                  <div class="description">
                  <p class="title">Recipient</p>
                    <span class="text">
                    ${transaction.recipient}
                    </span>
                  </div>
                  <div class="description">
                  <p class="title">Transaction Amount</p>
                    <span class="text">
                    ${transaction.amount}
                    </span>
                  </div>
              </div>
              `;
    })
    return html;
  }

  getFiles(transactions){
    let html = ``
    for (let index = 0; index < transactions.length; index++) {
      html += `
        <a style="padding: 0px 0;" class="transaction-item" data-id="${transactions[index].transactionId}" href="#">
          <span class="file-name">${transactions[index].transactionId}</span>
        </a>
      `
    }

    return html
  }

  getLoader() {
    return `
      <div id="loader" class="loader">
        <div class="post">
          <div class="top">
            <div class="info">
              <p class="name"></p>
              <span class="time"></span>
            </div>
          </div>
        </div>
        <div class="post">
          <div class="top">
            <div class="info">
              <p class="name"></p>
              <span class="time"></span>
            </div>
          </div>
        </div>
        <div class="post">
          <div class="top">
            <div class="info">
              <p class="name"></p>
              <span class="time"></span>
            </div>
          </div>
        </div>
      </div>
    `
  }

  getStyles() {
    return `
    <style>
      * {
        box-sizing: border-box !important;
      }
      p.thats-it{
        margin: 0;
        padding: 20px 0;
        color: #404040;
        text-align: center;
        font-size: 1.5rem;
        width: 100%;
      }
      .address_transactions_list{
        border: 1px solid #08b86f;
        border-radius: 7px;
        margin-top: 3px;
        margin-bottom: 3px;
        padding: 3px;
      }
      .delete-popup{
        margin-top: 10px;
        top: 30%;
        position: absolute;
        z-index: 2;
        opacity: 1;
        padding: 0;
        max-width: 80%;
        display: none;
        flex-flow: column;
        gap: 10px;
        align-items: center;
        align-self: center;
      }
      .delete-popup>.delete-modal{
        display: flex;
        padding: 15px 20px;
        flex-flow: column;
        gap: 5px;
        align-items: center;
        align-self: center;
        background-color: #ffffff;
        border:  1px solid #80808027;
        box-shadow: rgba(109, 117, 141, 0.2) -10px -12px 48px -10px;
        border-radius: 20px;
      }
      .delete-popup>.delete-modal>.container{
        display: flex;
        flex-flow: column;
        gap: 5px;
        align-items: center;
        align-self: center;
      }
      .delete-popup>.delete-modal>.container>.warning{
        text-align: center;
        color: #808080;
        font-size: 0.85rem;
      }
      .delete-popup>.delete-modal>.container>.options{
        display: flex;
        padding-top:  10px;
        width: 100%;
        flex-flow: column;
        gap: 0px;
        align-items: center;
        align-self: center;
      }
      .delete-popup>.delete-modal>.container>.options>span{
        color: #808080;
        text-align: center;
        width: 100%;
        padding: 8px 0;
        cursor: pointer;
        font-size: 1.4rem;
      }
      .delete-popup>.delete-modal>.container>.options>span.cancel{
        border-top:  1px solid #80808027;
      }
      .delete-popup>.delete-modal>.container>.options>span.delete{
        color: #08b86f;
      }
      .status-container{
        margin-top: 30px;
        background-color: #08b86f;
        color: #ffffff;
        opacity: .9;
        padding: 6px 20px 7px 19px;
        width: max-content;
        display: none;
        flex-flow: row;
        gap: 30px;
        align-items: center;
        align-self: center;
        border-top-right-radius: 15px;
        border-bottom-right-radius: 15px;
        border-bottom-left-radius: 15px;
      }
      .status-container>.content{
        color: #ffffff;
        font-weight: bold;
        padding: 0;
        width: max-content;
        display: flex;
        flex-flow: row;
        gap: 10px;
        align-items: center;
      }
      .status-container>.cancel{
        background-color: #ee7752;
        color: #ffffff;
        font-weight: bold;
        padding: 0;
        width: max-content;
        display: flex;
        flex-flow: row;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        border-radius: 50px;
      }
      .sending{
        animation: send 1s linear infinite alternate;
      }

      @keyframes send {
        0%{
          opacity: .6;
        }
        50%{
          opacity: .8;
        }
        100%{
          opacity: 1;
        }
      }
      .infos{
        padding: 20px 0 0 0;
        margin: 0;
        display: flex;
        flex-flow: column;
        justify-content: center;
        gap: 15px;
      }
      .infos>.head{
        padding: 0 0 0 0;
        margin: 0;
        display: flex;
        flex-flow: column;
        justify-content: center;
        gap: 1px;
      }
      .infos>.head>.name{
        color: #404040;
        font-weight: bold;
      }
      .infos>.head>.user-info{
        display: flex;
        flex-flow: column;
        gap: 0;
        color: #808080;
      }
      .infos>.description{
        padding: 0 0 0 0;
        margin: 0;
        display: flex;
        flex-flow: column;
        justify-content: center;
        gap: 5px;
        color: #404040;
      }
      .infos>.address_transactions_list>.description{
        padding: 0 0 0 0;
        margin: 0;
        display: flex;
        flex-flow: column;
        justify-content: center;
        gap: 5px;
        color: #404040;
      }
      .infos>.description-all{
        padding: 0 0 0 0;
        margin: 0;
        display: flex;
        flex-flow: column;
        justify-content: center;
        gap: 2px;
        color: #404040;
      }
      .infos>.description-all>p{
        margin: 5px 0;
        font-weight: bold;
      }
      .infos>.description>p{
        margin: 0;
        font-weight: bold;
      }
      .infos>.address_transactions_list>.description>p{
        margin: 0;
        font-weight: bold;
      }
      .infos>.files{
        padding: 0 0 0 0;
        margin: 0;
        display: flex;
        flex-flow: column;
        justify-content: center;
        gap: 8px;
        color: #404040;
      }
      .infos>.files>p{
        font-weight: bold;
        margin: 0;
      }
      .infos>.files>.links{
        display: flex;
        flex-flow: column;
        gap: 5px;
      }
      .infos>.files>.links>a{
        text-decoration: none;
        color: #404040;
        width: max-content;
      }
      .infos>.files>.links>a:hover{
        color: #08b86f;
      }
      #responses {
        background-color: #ffffff;
        position: relative;
        padding: 15px 0 30px 0;
        display: flex;
        flex-flow: column;
        justify-content: space-between;
        gap: 0px;
        width: 700px;
        max-height: 90%;
        height: max-content;
        border-radius: 25px;
      }

      #responses .response-head{
        margin: 0 20px;
        border-bottom: 1px solid #80808027;
        padding: 5px 0 10px 0;
        display: flex;
        flex-flow: column;
        gap: 0px;
        justify-content: center;
      }

      #responses .response-head > .actions{
        display: flex;
        flex-flow: row;
        align-items: center;
        justify-content: space-between;
      }

      #responses .response-head > .actions > .control{
        width: max-content;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        color: #808080;
        cursor: pointer;
      }

      #responses .response-head > .actions > .control:hover{
        color: #ee7752;
      }

      #responses .response-head > .actions > .control > i{
        font-size: 1.2rem;
        display: flex;
        flex-flow: row;
        align-items: center;
        justify-content: center
      }

      #responses .response-head > .actions > .control > span.text{
        font-size: 1.2rem;
        font-weight: bold;
      }

      #responses .response-head > .actions > .control .text-mobile{
        display: none;
      }

      #responses .response-head > .actions > span.respond {
        background-color: #08b86f;
        color: #ffffff;
        padding: 4px 15px 5px 12px;
        display: flex;
        flex-flow: row;
        align-items: center;
        justify-content: center;
        gap: 5px;
        cursor: pointer;
        border-top-right-radius: 15px;
        border-bottom-left-radius: 15px;
        border-bottom-right-radius: 15px;
      }

      #responses .response-head > .actions > span.completed {
        background-color: #ee7752;
      }

      #responses .response-head > .actions > span.respond > i{
        display: flex;
        flex-flow: row;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
        margin-top: 0px;
      }

      #responses .response-head > span.details{
        color: #808080;
        font-size: 0.8rem;
        display: flex;
        flex-flow: row;
        align-items: center;
        justify-content: center;
        gap: 5px;
      }
      #responses .response-head > span.details span.dot{
        display: inline-block;
        margin-top: 1px;
        width: 3px;
        height: 3px;
        background-color: #808080c1;
        border-radius: 5px;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        -ms-border-radius: 5px;
        -o-border-radius: 5px;
      }

      .order-contents{
        margin: 0 20px;
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: start;
        overflow-y: scroll;
        /*-ms-overflow-style: none;
        scrollbar-width: none;*/
      }
      /*.order-contents::-webkit-scrollbar {
        display: none !important;
        visibility: hidden;
      }*/
      .order-contents{
        margin: 0 20px;
        display: flex;
        flex-flow: column;
        align-items: start;
      }

      p.thats-all{
        margin: 15px 0 30px 0;
        text-align: center;
        color: #808080;
        font-size: 0.8rem;
      }
      .loader{
        margin: 15px 0 30px 0;
        display: flex;
        flex-flow: column;
        gap: 20px;
      }
      .loader>.post{
        display: flex;
        flex-flow: column;
        gap: 15px;
      }
      .loader>.post>.top{
        display: flex;
        flex-flow: row;
        flex-wrap: nowrap;
        gap: 10px;
      }
      .loader>.post>.top>.image{
        height: 45px;
        width: 45px;
        border-radius: 50px;
        background-color: #ececec;
        animation: skeleton 1s linear infinite alternate;
      }
      .loader>.post>.top>.info{
        display: flex;
        flex-flow: column;
        gap: 5px;
        justify-content: center;
      }
      .loader>.post>.top>.info>p{
        width: 250px;
        margin: 0px 0 0 0;
        height: 20px;
        background-color: #ececec;
        border-radius: 10px;
        animation: skeleton 1s linear infinite alternate;
      }
      .loader>.post>.top>.info>span{
        width: 150px;
        margin: 0;
        height: 15px;
        border-radius: 10px;
        background-color: #ececec;
        animation: skeleton 1s linear infinite alternate;
      }
      .loader>.post>.content{
        height: 80px;
        background-color: #ececec;
        border-radius: 15px;
        animation: skeleton 1s linear infinite alternate;
      }
      @keyframes skeleton {
        0%{
          background-color: #ececec;
        }
        100%{
          background-color: #f8f8f8;
        }
      }

      @media screen and ( max-width: 850px ){
        #responses {
          background-color: #ffffff;
          width: 90%;
        }
      }
      @media screen and ( max-width: 600px ){
        #responses {
          box-sizing: border-box !important;
          padding: 5px 0 0 0;
          margin: 0;
          width: 100%;
          max-width: 100%;
          max-height: 100%;
          min-height: max-content;
          border-radius: 0px;
          position: fixed;
          bottom: 0;
        }
        .infos{
          padding: 20px 0 30px 0;
          margin: 0;
          display: flex;
          flex-flow: column;
          justify-content: center;
          gap: 15px;
        }
        .order-contents{
          margin: 0 10px;
        }

        #responses .response-head{
          border-bottom: none;
          margin: 0 10px;
          padding-bottom: 0;
          gap: 13px;
          position: sticky;
          top: 0px;
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          background-color: #ffffff;
        }
        #responses .response-head > .actions{
          padding: 0 0 10px 0;
          border-bottom: 1px solid #808080f0;
          background-color: transparent;
        }
        #responses .response-head > .actions > .control .text-mobile{
          display: flex;
        }
        #responses .response-head > .actions > .control .text-desktop{
          display: none;
        }
        #responses .response-head > .actions > span.respond {
          margin-top: 3px;
        }
        #responses response-popup{
          margin: 0 10px;
          padding: 0 0 30px 0;
        }

        #responses .response-head > span.details{
          background-color: transparent;
          border-bottom: 1px dashed #808080f0;
          display: none;
        }
        #responses .response-head > .actions > span.respond {
          cursor: default;
        }
        #responses .response-head > .actions > .control{
          cursor: default;
        }

        section > respond-container {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
        }
        .delete-popup{
          position: fixed;
          right: 0;
          left: 0;
          top: unset;
          bottom: 0;
          z-index: 20;
          opacity: 1;
          padding: 0;
          width: 100%;
          min-width: 100%;
          display: none;
          flex-flow: column;
          gap: 10px;
          align-items: end;
          align-self: center;
        }
        .delete-popup>.delete-modal{
          width: 100%;
          min-width: 100%;
          display: flex;
          padding: 10px 20px;
          flex-flow: column;
          gap: 5px;
          align-items: center;
          align-self: center;
          border-radius: 0px;
          border-top-left-radius: 20px;
          border-top-right-radius: 20px;
        }
        .delete-popup>.delete-modal>.container{
          display: flex;
          flex-flow: column;
          gap: 10px;
          align-items: center;
          align-self: center;
        }
        .delete-popup>.delete-modal>.container>.warning{
          text-align: center;
          font-size: 0.95rem;
        }
        .delete-popup>.delete-modal>.container>.options{
          display: flex;
          width: 100%;
          flex-flow: column;
          gap: 5px;
          align-items: center;
          align-self: center;
        }
        .delete-popup>.delete-modal>.container>.options>span{
          text-align: center;
          width: 100%;
          padding: 10px 0;
          cursor: default;
          font-size: 1.5rem;
        }

        .status-container{
          margin-bottom: 70px;
          opacity: .9;
          padding: 6px 20px 7px 19px;
          width: max-content;
          display: none;
          flex-flow: row;
          gap: 30px;
          align-items: center;
          align-self: center;
          border-top-right-radius: 15px;
          border-bottom-right-radius: 15px;
          border-bottom-left-radius: 15px;
        }
        .status-container>.content{
          color: var(--white);
          font-weight: bold;
          padding: 0;
          width: max-content;
          display: flex;
          flex-flow: row;
          gap: 10px;
          align-items: center;
        }
        .status-container>.cancel{
          font-weight: bold;
          padding: 0;
          width: max-content;
          display: flex;
          flex-flow: row;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          border-radius: 50px;
        }
        .sending{
          animation: send 1s linear infinite alternate;
        }

        @keyframes send {
          0%{
            opacity: .6;
          }
          50%{
            opacity: .8;
          }
          100%{
            opacity: 1;
          }
        }

      }
      </style>
    `;
  }
}