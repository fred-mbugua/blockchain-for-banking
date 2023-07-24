//variables
let nav_area = document.querySelector('.navbar');
const nav_function = () => {
    nav_area.innerHTML = `
            <div class="container nav__container">
                <a href="/"><img  class="website_logo"/></a>
                
                <div class="theme-toggler">
                    <span class="material-icons-sharp light active">light_mode</span>
                    <span class="material-icons-sharp dark">dark_mode</span>
                </div>
                <ul class="nav__menu">
                    <li><a href="/index">Home</a></li>
                    <li><a href="/articles_page">Articles</a></li>
                    <li><a href="/contacts">Contacts</a></li>
                    <li class="start-btn"><a href="#">Follow Us</a>
                </ul>
                
                <button id="open-menu-button" class="btn_color navbtn open-menu-button"><i class="uil uil-bars"></i></button>
                <button id="close-menu-button" class="btn_color navbtncancel close-menu-button"><i class="uil uil-multiply"></i></button>
            </div>
`;
}

//call nav_function here..
nav_function();

//search box
const searchBtn = document.querySelector('.search_button');
const searchBox = document.querySelector('.search_input');

//categories section
const computing = document.querySelector('#computing');
const blockChain = document.querySelector('#blockchain');
const softwareEngineering = document.querySelector('#software_engineering');
const mobile = document.querySelector('#mobile');
const smartCitiesTech = document.querySelector('#smart_cities_tech');
const evs = document.querySelector('#evs');

if ((searchBtn && searchBox) !== null){
    searchBtn.addEventListener('click', () => {
        if(searchBox.value.length){
          location.href = `/search/${searchBox.value}`
        }
      })
}

if ((computing && blockChain && softwareEngineering && mobile && smartCitiesTech && evs) !== null){
    computing.addEventListener('click', () => {
        location.href = `/search/${'health'}`
      })

      blockChain.addEventListener('click', () => {
        location.href = `/search/${'tech'}`
      })

      softwareEngineering.addEventListener('click', () => {
        location.href = `/search/${'climate'}`
      })

      mobile.addEventListener('click', () => {
        location.href = `/search/${'politics'}`
      })

      smartCitiesTech.addEventListener('click', () => {
        location.href = `/search/${'sports'}`
      })

      evs.addEventListener('click', () => {
        location.href = `/search/${'evs'}`
      })
}


// THEME
const themeToggler = document.querySelector(".theme-toggler");
let lightTheme = document.querySelector(".light");
let dark_mode = document.querySelector(".dark");

  //effect theme from session storage on window onload
  window.onload = (event) => {
    let lightTheme = document.querySelector(".light");
    let dark_mode = document.querySelector(".dark");

    ////console.log(sessionStorage.getItem('KenyanTechZoneTheme'));


    if (sessionStorage.getItem('KenyanTechZoneTheme') == null){
      lightTheme.classList.add('active');
      dark_mode.classList.remove('active');
      sessionStorage.setItem('KenyanTechZoneTheme', 'light');
      document.querySelector('.website_logo').classList.add('website_logo_dark');

    }else if(sessionStorage.getItem('KenyanTechZoneTheme') == 'light'){
      document.querySelector('.website_logo').classList.add('website_logo_dark');
      document.querySelector('.website_logo').classList.remove('website_logo_white');

    }else if(sessionStorage.getItem('KenyanTechZoneTheme') == 'dark'){
      document.body.classList.toggle('dark-theme-variables');
      dark_mode.classList.add('active');
      dark_mode.style.color = 'black';
      lightTheme.classList.remove('active');
      document.querySelector('.website_logo').classList.remove('website_logo_dark');
      document.querySelector('.website_logo').classList.add('website_logo_white');
    }

  };

  themeToggler.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme-variables');
   
    if (sessionStorage.getItem('KenyanTechZoneTheme') == 'light'){

      sessionStorage.setItem('KenyanTechZoneTheme', 'dark');
      document.querySelector('.website_logo').classList.add('website_logo_white');
      document.querySelector('.website_logo').classList.remove('website_logo_dark');
      lightTheme.classList.remove('active');
      dark_mode.classList.add('active');
      dark_mode.style.color = 'black';
        
    } else if(sessionStorage.getItem('KenyanTechZoneTheme') == 'dark'){
      sessionStorage.setItem('KenyanTechZoneTheme', 'light');
      document.querySelector('.website_logo').classList.remove('website_logo_white');
      document.querySelector('.website_logo').classList.add('website_logo_dark');
      dark_mode.classList.remove('active');
      lightTheme.classList.add('active');
    }
  })