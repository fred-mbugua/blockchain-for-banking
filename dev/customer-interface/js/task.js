export default class TaskContainer extends HTMLElement {
    constructor() {
  
  
      super();
  
    //  shadow root
      // this.shadowObj = this.attachShadow({mode: 'open'});
  
      this.render();
  
    }
  
  
    render() {
      // this.shadowObj.innerHTML = this.getTemplate();
      this.innerHTML = this.getTemplate();
    }
  
    connectedCallback() {
      // console.log('We are inside connectedCallback');
  
      let content  = this.querySelector('.item');
  
      if (content) {
        content.addEventListener('click', () => {
          this.openDetails();
        });
      }

      // const searchBtn = document.querySelector('.search_button');
      // if (searchBtn != null) {
      //   searchBtn.addEventListener('click', () => {
      //     const searchKey = document.querySelector('.search_input').value;
      //     console.log("Button clicked!")
      //   //   this.hideSearchBar();
      //   //   this.openBlockSearchDetails(searchKey);
      //   });
      // }
  
    }
  
    openDetails() {
      // updating the state
      let parent  = document.querySelector('body');
  
      // response.remove()
      let html  = `
        <modal-task
            id="${this.getAttribute('block-id')}"
            status="${this.getAttribute('status')}"
            type="${this.getAttribute('type')}"
          >
        </modal-task>`;
  
      parent.insertAdjacentHTML('beforeEnd', html);
    }
  
    disconnectedCallback() {
      // console.log('We are inside disconnectedCallback');
      // adding event handler to the button
    }
  
    getTemplate() {
      // Show HTML Here
      if (this.getAttribute('type') === 'transaction') {
        return `
                <div class="item done">
                <div class="left">
                <i class="bi bi-cash"></i>
                  <span class="name">
                    <span class="name">${this.getAttribute('name')}</span>
                    <span class="paper">${this.getAttribute('text')}</span>
                  </span>
                </div>
                ${this.getDate()}
                </div>
                ${this.getStyles()}`;
      } else if (this.getAttribute('type') === 'address') {
        return `
                <div class="item done">
                <div class="left">
                <i class="bi bi-compass"></i>
                  <span class="name">
                    <span class="name">${this.getAttribute('name')}</span>
                    <span class="paper">${this.getAttribute('text')}</span>
                  </span>
                </div>
                ${this.getDate()}
                </div>
                ${this.getStyles()}`;
      }
    }

    getDate(date){
      if(this.getAttribute('date')){
        return `
        <div class="right">
        <span class="time">${this.getAttribute('date')}</span>
      </div>
        `
      }
      else{
        return ``
      }
    }
  
   
  
    getStyles() {
      return `
      <style>
        * {
          box-sizing: border-box !important;
        }
        .item{
          background-color: #f5f5f5;
          padding: 10px 10px;
          margin: 0;
          list-style-type: none;
          display: flex;
          flex-flow: row;
          justify-content: space-between;
          align-items: center;
          gap: 3px;
          cursor: pointer;
          border-radius: 10px;
          -webkit-border-radius: 10px;
          -moz-border-radius: 10px;
          -ms-border-radius: 10px;
          -o-border-radius: 10px;
        }
        .done:hover{
          background-color:  #ebf0ff;
        }
  
        .item>.left{
          padding: 0 0 0 30px;
          margin: 0;
          list-style-type: none;
          display: flex;
          flex-flow: column;
          justify-content: center;
          gap: 0;
          position: relative;
        }
        .item>.left>i{
          position: absolute;
          left: 0px;
          font-size: 1.4rem;
          color: #f84125;
        }
        .done>.left>i{
          color: #08b86f;
        }
        .item>.left>span.status{
          padding: 0;
          margin: 0;
          list-style-type: none;
          display: flex;
          flex-flow: row;
          flex-wrap: nowrap;
          align-items: center;
          gap: 5px;
          font-size: 0.8rem;
          color: #808080;
        }
        .done>.left>span.status>.paid{
          color: #08b86f;
        }
        .item>.left>span.status>span.dot{
          padding: 0;
          margin: 0;
          list-style-type: none;
          display: flex;
          width: 4px;
          height: 4px;
          gap: 5px;
          font-size: 0.8rem;
          background-color: #808080;
          border-radius: 5px;
          -webkit-border-radius: 5px;
          -moz-border-radius: 5px;
          -ms-border-radius: 5px;
          -o-border-radius: 5px;
        }
        .item>.left>span.name{
          padding: 0;
          margin: 0;
          list-style-type: none;
          display: flex;
          flex-flow: row;
          flex-wrap: nowrap;
          align-items: center;
          gap: 5px;
          font-size: 1rem;
          color: #404040;
        }
        .item>.left>span.name>span.name{
          color: #404040;
          font-weight: bold;
        }
        .item>.right{
          margin: 0;
          list-style-type: none;
          display: flex;
          align-items: center;
          font-size: 0.9rem;
          color: #808080;
        }
        @media screen and ( max-width: 600px ){
          .item>.left>span.name{
            padding: 0;
            margin: 0;
            list-style-type: none;
            display: flex;
            flex-flow: column;
            align-items: start;
            gap: 0px;
            font-size: 1rem;
            color: #404040;
          }
          .item>.left{
            padding: 0 0 0 35px;
          }
          .item{
            cursor: default;
          }
        }
        </style>
      `;
    }
  }