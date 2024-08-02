$(document).ready(function () {
    let ticket_category = $("#ticket_catgy").val();

  
    $.ajax({
      method: "POST",
      url: "/ticket_type_dropdown111",
      data: { ticket_category: ticket_category },
      success: function (res) {
        $("#ticket_type").empty();
        $("#ticket_type").append(
          "<option selected disabled>Select Ticket Type</option>"
        );
        for (var i = 0; i < res.data.length; i++) {
          $("#ticket_type").append(
            `<option value="${res.data[i].ticket_type}">${res.data[i].ticket_type}</option>`
          );
        }
      },
      error: function (err) {
        console.error(err);
      },
    });
  });
  
  
  
  
  $(document).on('click','#submit_btn',function(){
  
      let compt_catgy=$('#compt_catgy').val();
      let ticket_catgy=$('#ticket_catgy').val();
      let ticket_type=$('#ticket_type').val();
      let level_1st_tat=$('#level_1st_tat').val();
      let level_1st_sla=$('#level_1st_sla').val();
      let level_2nd_tat=$('#level_2nd_tat').val();
      let level_2nd_sla=$('#level_2nd_sla').val();
      let level_3rd_tat=$('#level_3rd_tat').val();
      let level_3rd_sla=$('#level_3rd_sla').val();
      let sla_tat_id=$('#sla_tat_id').text();
        
      console.log(compt_catgy,ticket_catgy,ticket_type,level_1st_tat,level_1st_sla,level_2nd_tat,level_2nd_sla,level_3rd_tat,level_3rd_sla,sla_tat_id,'daataaaa')
      $.ajax({
          method:"POST",
          url:"/sla_tat_config_edit",
          data:{
              compt_catgy:compt_catgy,
              ticket_catgy:ticket_catgy,
              ticket_type:ticket_type,
              level_1st_tat:level_1st_tat,
              level_1st_sla:level_1st_sla,
              level_2nd_tat:level_2nd_tat,
              level_2nd_sla:level_2nd_sla,
              level_3rd_tat:level_3rd_tat,
              level_3rd_sla:level_3rd_sla,
              sla_tat_id:sla_tat_id
              },
          success:(function(results){
              console.log(results,'resultsresultsresults')
              Swal.fire({
                  title: "Good job!",
                  text: "Data successfully updated",
                  icon: "success"
                })
                .then(function(){
                  window.location.href = '/sla_tat_config';    
                })
              
             
          }),
          error:function(error){
              console.log(error)
              
          }
  
      })
  })