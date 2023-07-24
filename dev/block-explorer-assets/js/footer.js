//variables declaration
let footer_area = document.querySelector(".footer");
const footer_function = () => {
  footer_area.innerHTML = `
          <!-- Subscribe modal -->
          <div class="center modal-box">
            <div class="fas fa-times"></div>
            <div class="fas fa-envelope icon1"></div>
            <h1>Subscribe for Updates</h1>
            <p>
              Enter your email and get all articles and updates on this platform.
            </p>
            <div class="form">
              <div class="fas fa-envelope icon2"></div>
              <input type="email" class="blog_subscription_email" required placeholder="abc@example.com">
              <button class="blog_subscription">Subscribe</button>
            </div>
            <div class="icons">
              <a href="https://web.facebook.com/technologyinkenya"><i class="fab fa-facebook-f"></i></a>
              <a href="#"><i class="fab fa-twitter"></i></a>
              <a href="#"><i class="fab fa-instagram"></i></a>
              
              <!-- <i class="fab fa-youtube"></i> -->
            </div>
        </div>

        <div class="center modal-box-subscribed hide-modal">
          <div class="fas fa-times-circle fa-times-subscribed"></div>
          <div class="fas fa-envelope icon1"></div>
          <h1>Hi, from KenyanTechZone</h1>
          <p class="subscribe_status">
            We have confirmed that this email is already subscribed on this platform. Thanks for your coninued interest, follow us on our social media platforms via the icon links below.
          </p>
          
          <div class="icons">
            <a href="https://web.facebook.com/profile.php?id=100076953251958"><i class="fab fa-facebook-f"></i></a>
            <a href="#"><i class="fab fa-twitter"></i></a>
            <a href="#"><i class="fab fa-instagram"></i></a>
            
            <!-- <i class="fab fa-youtube"></i> -->
          </div>
      </div>
    <!-- End of subscribe modal -->


        <div class="container footer__container">
               <div class="footer__1">
                   <a href="index.html" class="footer__logo"><img class="footer__logo-image"></a>
                   <p>
                       your home of updates...
                   </p>
               </div>

               <div class="footer__2">
                    <h4>Navigation Links</h4>
                    <ul class="permalinks">
                        <li><a href="/index">Home</a></li>
                        <!-- <li><a href="about.html">About</a></li> -->
                        <li><a href="/articles_page">Blogs</a></li>
                        <li><a href="/contacts">Contact Us</a></li>
                    </ul>
                    <div class="">
                        
                        <h1>Subscribe for Updates</h1>
                        <p>
                            Enter your email and get all articles and updates on this platform.
                        </p>
                        <div class="form" action="">
                            <div class="fas fa-envelope icon2"></div>
                            <input type="email" class="blog_subscription_email_input" required placeholder="abc@example.com">
                            <button class="blog_subscription_btn">Subscribe</button>
                        </div>
                    </div>
               </div>

               <div class="footer__3">
                   <h4>Privacy</h4>
                   <ul class="privacy">
                       <li><a href="#">Privacy Policy</a></li>
                       <li><a href="#">Terms and Conditions</a></li>
                   </ul>
               </div>

               <div class="footer__4">
                   <h4>Contact Us</h4>
                   <div>
                       <p>+254729817645</p>
                       <p>mbuguafredrick645@gmail.com</p>
                   </div>

                   <ul class="footer__socials">
                       <li>
                           <a href="https://web.facebook.com/technologyinkenya"><i class="uil uil-facebook-f"></i></a>
                       </li>
                       <li>
                        <a href="#"><i class="uil uil-twitter"></i></a>
                       </li>
                       <li>
                        <a href="#"><i class="uil uil-instagram-alt"></i></a>
                       </li>
                   </ul>
               </div>
           </div>

           <div class="footer__copyright">
            <small>Copyright &copy; 2023</small>
           </div>
    `;
};

//calling footer_function
footer_function();

//variables for the form
let subscriber_email = document.querySelector(".blog_subscription_email_input");

const subscribe_btn = document.querySelector(".blog_subscription_btn");

const subscriptionData = () => {
  return (data = {
    subscriber_e_mail: subscriber_email.value,
  });
};

subscribe_btn.addEventListener("click", () => {
  let data = subscriptionData();

  let emailLogin = /^[a-zA-Z0-9]+@(gmail|yahoo|outlook)\.com$/;

  if (subscriber_email.value == null || subscriber_email.value == "") {
    
    $(".subscribe_status").html(
      "You have not entered anything on the email input box, enter a valid email address and try again"
    );
    $(".modal-box-subscribed").toggleClass("show-modal-subscribed");
    $(".fa-times-circle").click(function () {
      $(".modal-box-subscribed").toggleClass("show-modal-subscribed");
      // $('.hide-modal').toggleClass("show-modal-subscribed");
      location.reload(true);
    });
  } else if (!emailLogin.test(subscriber_email.value)) {
   
    $(".subscribe_status").html(
      "The email you have entered is not valid. Correct it and try again."
    );
    $(".modal-box-subscribed").toggleClass("show-modal-subscribed");
    $(".fa-times-circle").click(function () {
      $(".modal-box-subscribed").toggleClass("show-modal-subscribed");
      // $('.hide-modal').toggleClass("show-modal-subscribed");
      location.reload(true);
    });
  } else {
    addEmail("/add-subscriber", data);
  }
});

//add subscription function
const addEmail = (path, data) => {
  fetch(path, {
    method: "post",
    headers: new Headers({ "Content-type": "application/json" }),
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((response) => {
      // ////console.log(response);
      processData(response);
    });
};

const processData = (data) => {
  ////console.log(data);
  if (data === "subsc_email exist") {
    $(document).ready(function () {
      $(".modal-box-subscribed").toggleClass("show-modal-subscribed");
      $(".fa-times-circle").click(function () {
        $(".modal-box-subscribed").toggleClass("show-modal-subscribed");
        // $('.hide-modal').toggleClass("show-modal-subscribed");
        location.reload(true);
      });
    });
  } else {
    //querying the modal message
    $(".subscribe_status").html(
      'We have received your subscription: <span class="subscribed_email">' +
        data.subscription +
        "</span>, Thanks for subscribing."
    );
    $(".modal-box-subscribed").toggleClass("show-modal-subscribed");
    $(".fa-times-circle").click(function () {
      $(".modal-box-subscribed").toggleClass("show-modal-subscribed");
      // $('.hide-modal').toggleClass("show-modal-subscribed");
      location.reload(true);
    });
  }
};

//subscribe dialogue
$(document).ready(function () {
  $(".start-btn").click(function () {
    $(".modal-box").toggleClass("show-modal");
    $(".start-btn").toggleClass("show-modal");
  });
  $(".fa-times").click(function () {
    $(".modal-box").toggleClass("show-modal");
    $(".start-btn").toggleClass("show-modal");
  });
});
