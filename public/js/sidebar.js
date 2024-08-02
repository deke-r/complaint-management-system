const hamBurger = document.querySelector(".toggle-btn");

hamBurger.addEventListener("click", function () {
  document.querySelector("#sidebar").classList.toggle("expand");
});




$(document).ready(function () {
  $('#logout').click(function () {
      $.ajax({
          type: 'POST',
          url: '/logout',
          success: function (response) {
              window.location.href = response.redirect;

          },
          error: function (error) {
              console.error('Error:', error);
          }
      });
  });
});

document.addEventListener("DOMContentLoaded", function() {
  let button = document.getElementById('support_link')
  button.addEventListener('click',function(){
        
let user_id = document.getElementById('user_id').value;

        $.ajax({
            url: '/connect_application',
            method: 'post',
            data: { user_id: user_id },
            success: function (result) {
                window.open(`http://localhost:8081/employee_dashboard/${result.user_id}`,'_blank');
            }
        });
    })  
  });