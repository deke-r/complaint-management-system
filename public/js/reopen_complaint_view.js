



// -------------------image and video js start-------------------
// -------------------image and video js start-------------------


$(document).ready(function() {
  function openMediaModal(source) {
    let mediaElement;
    if (source.includes('.mp4') || source.includes('.webm') || source.includes('.ogg') || source.includes('.mov') || source.includes('.avi') || source.includes('.wmv') || source.includes('.avchd') || source.includes('.flv') || source.includes('.quicktime')) {
      mediaElement = `<video id="modalMedia" class="img_inlarge22 w-100 h-75" controls  >
                        <source src="${source}" type="video/mp4">
                        <source src="${source}" type="video/webm">
                        <source src="${source}" type="video/ogg">
                        <source src="${source}" type="video/mov">
                        <source src="${source}" type="video/avi">
                        <source src="${source}" type="video/wmv">
                        <source src="${source}" type="video/avchd">
                        <source src="${source}" type="video/flv">
                        <source src="${source}" type="video/quicktime">
                        Your browser does not support the video tag.
                      </video>`;
    } else {
      mediaElement = `<img src="${source}" class="img-fluid  h-75" id="enlargedImage" alt="Event Photo" >`;
    }

    $('#mediaContainer').html(mediaElement);
    $('#mediaModal').modal('show');
  }

  $('.img_inlarge, .img_inlarge22').click(function() {
    let source = $(this).attr('src') || $(this).find('source').attr('src');
    openMediaModal(source);
  });
});


// -------------------image and video js end-------------------
// -------------------image and video js end-------------------

// -------------------ticket status js start-------------------

$(document).ready(function () {
  var ticket_status = $("#ticket_status").text();
  if (ticket_status == 1) {
    $("#ticket_status").html("Open");
  } else if (ticket_status == 2) {
    $("#ticket_status").html("In-Process");
  } else if (ticket_status == 3) {
    $("#ticket_status").html("Resolved");
  } else if (ticket_status == 4) {
    $("#ticket_status").html("Closed");
  } else if (ticket_status == 5) {
    $("#ticket_status").html("Reopen");
  }
});

// -------------------ticket status js end-------------------

// ----------status change  js start---------------
// ----------status change  js start---------------
// ----------status change  js start---------------
// ----------status change  js start---------------

$(document).on("change", "#tkt_status_chg", function () {
  let ticket_status_change = $(this).val();
  console.log(ticket_status_change, "ticket_status_change");

  if (ticket_status_change == 2) {
    $("#curt_tkt_status").val("In-Process");
  } else if (ticket_status_change == 3) {
    $("#curt_tkt_status").val("Resolved");
  } else if (ticket_status_change == 4) {
    $("#curt_tkt_status").val("Closed");
  }
});

$(document).ready(function () {
  let ticket_status = $("#ticket_status").text();
  console.log(ticket_status, "ticket_status111111");

  var isAppended = false;

  $(document).on("click", "#status_chg_btn", function () {
    $.ajax({
      method: "GET",
      url: "/cms_status",
      success: function (res) {
        // console.log(res.status_Data[0].action_value,'qqqq22222')
        let emp_role=$('#emp_role').text()
        let emp_designation=$('#emp_designation').text()
        console.log(emp_role,'emp_role22222')
        console.log(emp_designation,'emp_designation_@222')

        let options = "";

        if( emp_role==="MANAGER" || emp_role==="EMPLOYEE" ){
          for (var i = 0; i<res.status_Data.length; i++) {
            if( res.status_Data[i].action_id === 4 ){
              options += `<option value="${res.status_Data[i].action_id}">${res.status_Data[i].action_value}</option>`;
            }
          }
        }


        else if( emp_role==="QUILITY TEAM" && emp_designation==="CEE" || emp_designation==="QC"){
          for (var i = 0; i<res.status_Data.length; i++) {
            if( res.status_Data[i].action_id === 2 || res.status_Data[i].action_id === 3 ){
              options += `<option value="${res.status_Data[i].action_id}">${res.status_Data[i].action_value}</option>`;
            }
          }
        }

        else if( emp_role==="SUPER_ADMIN" ){
          for (var i = 0; i<res.status_Data.length; i++) {
            if( res.status_Data[i].action_id === 2 || res.status_Data[i].action_id === 3 || res.status_Data[i].action_id === 4  ){
              options += `<option value="${res.status_Data[i].action_id}">${res.status_Data[i].action_value}</option>`;
            }
          }
        }

        


        if (!isAppended) {
          $("#ticket_status_edit").append(
            `<div class="row">
                  <div class="col-lg-5 col-md-6 pt-3 pt-lg-0">
                      <h6 class="fw_bold f_13 ms-1">Current Ticket Status</h6>
                      <input type="text" id="curt_tkt_status"  value="${ticket_status}" class="form-control border-leftb box_sdw11 f_13" disabled>
                  </div>
                  <div class="col-lg-5 col-md-6 pt-3 pt-lg-0">
                      <h6 class="fw_bold f_13 ms-1">Ticket Status Change</h6>
                      
                      
                      <select name="" id="tkt_status_chg" class="form-select border-leftb box_sdw11 f_13 ">
                          <option value="none" >Change Ticket Status</option>
                        ${options}          
                      </select>


                  </div>
                  <div class="col-lg-2 col-md-12 pt-3 pt-lg-0 d-flex justify-content-end align-items-end">
                      <div class="btn bg_gg fw_600 f_13 text-light" id="submit_btn">Submit</div>
                  </div>
              </div>`
          );

          isAppended = true;
        }

      if( emp_role === "MANAGER" || emp_role === "EMPLOYEE" || emp_role === "QUILITY TEAM" || emp_role === "BUSINESS HEAD"){
        let curt_tkt_status = $("#curt_tkt_status").val(); 
        console.log(curt_tkt_status,'curt_tkt_status_pppppppp')
        
        
        if( curt_tkt_status == 'Reopen'){
          $('#tkt_status_chg option[value="3"]').prop('disabled',true)
          $('#tkt_status_chg option[value="4"]').prop('disabled',true)
          $('#tkt_status_chg option[value="none"]').prop('disabled',true)
        }
        else if( curt_tkt_status == 'In-Process'){
          $('#tkt_status_chg option[value="2"]').prop('disabled',true)
          $('#tkt_status_chg option[value="4"]').prop('disabled',true)
          $('#tkt_status_chg option[value="none"]').prop('disabled',true)
        }
        else if( curt_tkt_status == 'Resolved'){
          $('#tkt_status_chg option[value="3"]').prop('disabled',true)
          $('#tkt_status_chg option[value="2"]').prop('disabled',true)
          $('#tkt_status_chg option[value="none"]').prop('disabled',true)
        }
        else if( curt_tkt_status == 'Closed'){
          $('#tkt_status_chg option[value="2"]').prop('disabled',true)
          $('#tkt_status_chg option[value="3"]').prop('disabled',true)
          $('#tkt_status_chg option[value="4"]').prop('disabled',true)
          $('#tkt_status_chg option[value="none"]').prop('disabled',true)
        }
      }

      },
    });
  });
});

$(document).on("change", "#tkt_status_chg", function () {
  let tkt_status_chg = $("#tkt_status_chg").val();
  let person_meet = $("#person_meet").text();
  console.log(tkt_status_chg, "323232");

  if (tkt_status_chg == 3) {
    $(".invst_colum").empty();
    $(".invst_colum").append(`
  <div class="row ">
              
  <div class="col-md-6 my-2 ">
                        <h6 class="fw_bold f_13 ms-1 ">Investigation Date: <span class="text-danger">*</span> </h6>
                        <input type="text" class="form-control border-leftb box_sdw11 f_13 fw_600" id="invest_date" name=""
                        placeholder="Select Investigation Date" readonly required>
                      </div>

                      <div class="col-md-6 my-2 ">
                        <h6 class="fw_bold f_13 ms-1 ">Person Meet: <span class="text-danger">*</span></h6>
                        <input type="text" class="form-control border-leftb box_sdw11 f_13 fw_600" id="person_meet1" name=""
                        value="${person_meet}" disabled >
                      </div>
                      
                    </div>
                   
                    <div class="row">
                    <div class="col-md-6 my-2 ">
                        <h6 class="fw_bold f_13 ms-1">Investigation Details: <span class="text-danger">*</span></h6>
                        <textarea id="invst_detl" cols="30" rows="2" class="form-control box_sdw11 border-leftb f_13 " placeholder="Enter Investigation Details..." required></textarea>
                        <div class="f_13 text-end">
                            <span id="char_count1">0</span>/500
                        </div>
                    </div>
                    
                
                      <div class="col-md-6 my-2 ">
                        <h6 class="fw_bold f_13 ms-1 ">Action Taken: <span class="text-danger">*</span></h6>
                        <textarea name="" id="action_taken" cols="30" rows="2" class="form-control box_sdw11 border-leftb f_13 " placeholder="Enter Action Taken..." required></textarea>
                        <div class="f_13 text-end">
                          <span id="char_count2">0</span>/500
                      </div>
                    </div>
                    
                  </div>

                    <div class="row mb-2">
                
                      <div class="col-md-4 my-2 ">
                        <h6 class="fw_bold f_13 ms-1 ">Investigation Image 1: <span class="text-danger">*</span>
                        </h6>
                        <input type="file" class="form-control border-leftb box_sdw11 f_13 fw_600" id="invest_img1" name="" accept="image/* " required>
                      </div>
                      
                      <div class="col-md-4 my-2 ">
                        <h6 class="fw_bold f_13 ms-1 ">Investigation Image 2: <span class="text-danger">*</span>
                        </h6>
                        <input type="file" class="form-control border-leftb box_sdw11 f_13 fw_600" id="invest_img2" name="" accept="image/* " required>
                      </div>
                
                      <div class="col-md-4 my-2 ">
                        <h6 class="fw_bold f_13 ms-1 ">Investigation Video:
                        </h6>
                        <input type="file" class="form-control border-leftb box_sdw11 f_13 fw_600" id="invest_video" name="" accept="video/* ">
                      </div>
                    
                
                      
                
                    
                  </div>
  
  `);
  } else if (tkt_status_chg == 4) {
    $(".invst_colum").empty();
    $(".invst_colum").append(`
  <div class="row ">
  <div class="col-md-6 my-2 ">
    <h6 class="fw_bold f_13 ms-1 ">Remarks</h6>
    <textarea name="" id="close_comment" cols="30" rows="2" class="form-control box_sdw11 border-leftb f_13" placeholder="Enter Remarks..." required></textarea>
    
</div>            
  
  </div> 
  `);
  } else {
    $(".invst_colum").empty();
  }
});

$(document).on("focus", "#invest_date", function () {
  $(this)
    .datepicker({
      dateFormat: "dd-mm-yy",
    })
    .datepicker("show");
});

// ---------------------textarea count js start-----------
// ---------------------textarea count js start-----------

$(document).on("input", "#invst_detl", function () {
  var text = $(this).val();
  var count = text.length;
  $("#char_count1").text(count);
  if (count > 500) {
    $(this).val(text.slice(0, 500));
    $("#char_count1").text(500);
  }
});

$(document).on("input", "#action_taken", function () {
  var text = $(this).val();
  var count = text.length;
  $("#char_count2").text(count);
  if (count > 500) {
    $(this).val(text.slice(0, 500));
    $("#char_count2").text(500);
  }
});

// ---------------------textarea count js end-----------
// ---------------------textarea count js end-----------






$(document).on('change', '#tkt_status_chg', function() {
  let tkt_status_chg = $(this).val();

  console.log(tkt_status_chg, 'tkt_status_chg');

  if (tkt_status_chg == 3) {
    $('#submit_btn').prop('disabled', true).addClass('bg_gray_colr');

    
  $(document).on('change input', '#invest_date, #person_meet1, #invst_detl, #action_taken, #invest_img1, #invest_img2, #invest_video',function(){
  let invest_date = $('#invest_date').val().trim();
  let person_meet = $('#person_meet1').val().trim();
  let invst_detl = $('#invst_detl').val().trim();
  let action_taken = $('#action_taken').val().trim();
  let invest_img1 = $('#invest_img1').val();
  let invest_img2 = $('#invest_img2').val();

    if (invest_date !== '' && person_meet !== '' && invst_detl !== '' && action_taken !== '' && invest_img1 !=='none' && invest_img1 !=='' && invest_img2 !=='none' && invest_img2 !=='' && invest_video !=='none' && invest_video !=='') {
      $('#submit_btn').prop('disabled', false).removeClass('bg_gray_colr');
    } else {
      $('#submit_btn').prop('disabled', true).addClass('bg_gray_colr');
    }
  });

  }
});










$(document).on("click", "#submit_btn", function () {
  let reopen_ticket_id = $("#reopen_ticket_id").text();
  let tkt_status_chg = $("#tkt_status_chg").val();

  let pre_ticket_id = $("#pre_ticket_id").text();
  let reopen_tkt_crt_date = $("#reopen_tkt_crt_date").text();
  let pre_tkt_crt_date = $("#pre_tkt_crt_date").text();

  let ticket_catgy=$('#ticket_catgy').text().trim();
  let customer_name=$('#customer_name').text().trim();
  let customer_phone=$('#customer_phone').text().trim();

  let product_catgy=$('#product_catgy').text().trim();
  let batch_no=$('#batch_no').text().trim();
  let sku=$('#sku').text().trim();
  let customer_location=$('#customer_location').text().trim();
  let quantity_purchage=$('#quantity_purchage').text().trim();
  let quantity_rejected=$('#quantity_rejected').text().trim();
  let manufacturing_date=$('#manufacturing_date').text().trim();
  let ticket_type=$('#ticket_type').text().trim();
  let product_name=$('#product_name').text().trim();
  let sales_person_ph_no=$('#sales_person_ph_no').text().trim();
  
  console.log(tkt_status_chg, 'tkt_status_chg122');  
  console.log(pre_ticket_id, 'pre_ticket_id122');
  console.log(reopen_tkt_crt_date, 'reopen_tkt_crt_date122');
  console.log(pre_tkt_crt_date, 'pre_tkt_crt_date122');
  console.log(ticket_catgy, 'ticket_catgy_111');
  console.log(customer_name, 'customer_name_111');
  console.log(customer_phone, 'customer_phone_111');
  console.log(product_catgy, 'product_catgy_11');
  console.log(batch_no, 'batch_no_11');
  console.log(sku, 'sku_11');
  console.log(customer_location, 'customer_location_11');
  console.log(quantity_purchage, 'quantity_purchage_11');
  console.log(quantity_rejected, 'quantity_rejected_11');
  console.log(manufacturing_date, 'manufacturing_date_11');
  console.log(ticket_type, 'ticket_type_11');
  console.log(product_name, 'product_name_11');
  console.log(sales_person_ph_no, 'sales_person_ph_no_11');

  console.log(tkt_status_chg, "tkt_status_chg122");

  // if (tkt_status_chg == 1 ) {

  //   $.ajax({
  //     method: 'POST',
  //     url: '/ticket_status_open',
  //     data: {
  //       ticket_id:ticket_id,
  //       tkt_status_chg: tkt_status_chg
  //     },
  //     success: function(result) {
  //       console.log('updated');
  //       Swal.fire({
  //         title: 'Good Job!',
  //         text: 'Ticket Status Open Successfully Updated',
  //         icon: 'success'
  //       })
  //       .then(function(){
  //         location.reload();
  //       });
  //     },
  //     error: function(err) {
  //       console.log(err, 'err');
  //     }
  //   });
  // }


  if (tkt_status_chg == 2) {
    $.ajax({
      method: "POST",
      url: "/reopen_ticket_status_inprocess",
      data: {
        reopen_ticket_id: reopen_ticket_id,
        tkt_status_chg: tkt_status_chg,
      },
      success: function (result) {
        console.log("updated");
        
                      
        Swal.fire({
          title: "Good Job!",
          text: "Ticket Status In-Process Successfully Updated",
          icon: "success",
        })
        .then(()=>{
          location.reload();
        })

        .then(function(){
          $.ajax({
            
            method:'POST',
            url:'/send_status_email2',
            data:{              
              reopen_ticket_id:reopen_ticket_id,
              tkt_status_chg:tkt_status_chg,
              pre_ticket_id:pre_ticket_id,
              reopen_tkt_crt_date:reopen_tkt_crt_date,
              pre_tkt_crt_date:pre_tkt_crt_date,
              ticket_catgy:ticket_catgy,
              customer_name:customer_name,
              customer_phone:customer_phone,
              product_catgy:product_catgy,
              batch_no:batch_no,
              sku:sku,
              customer_location:customer_location,
              quantity_purchage:quantity_purchage,
              quantity_rejected:quantity_rejected,
              manufacturing_date:manufacturing_date,
              ticket_type:ticket_type,
              product_name:product_name,
              sales_person_ph_no:sales_person_ph_no
            },
            success:function(result2){
              console.log(result2,'result2')
              console.log('mail sended status In-Process')
                                                      
            }                    
        })
        })

      },
      error: function (err) {
        console.log(err, "err");
      },
    });
  } else if (tkt_status_chg == 3) {
    let invest_date = $("#invest_date").val().trim();

    let person_meet = $("#person_meet1").val().trim();
    let invst_detl = $("#invst_detl").val().trim();
    let action_taken = $("#action_taken").val().trim();
    let invest_img1 = $("#invest_img1").prop("files")[0];
    let invest_img2 = $("#invest_img2").prop("files")[0];
    let invest_video = $("#invest_video").prop("files")[0];

    console.log(
      invest_date,
      person_meet,
      invst_detl,
      action_taken,
      invest_img1,
      invest_img2,
      invest_video,
      "ajax data"
    );

    let formData = new FormData();
    formData.append("reopen_ticket_id", reopen_ticket_id);
    formData.append("tkt_status_chg", tkt_status_chg);
    formData.append("invest_date", invest_date);
    formData.append("person_meet", person_meet);
    formData.append("invst_detl", invst_detl);
    formData.append("action_taken", action_taken);
    formData.append("invest_img1", invest_img1);
    formData.append("invest_img2", invest_img2);
    formData.append("invest_video", invest_video);

    $.ajax({
      method: "POST",
      url: "/reopen_ticket_status_resolved",
      data: formData,
      processData: false,
      contentType: false,
      success: function (result) {
        console.log("updated");

        
        Swal.fire({
          title: "Good Job!",
          text: "Ticket Status Resolved Successfully Updated",
          icon: "success",
        })
        .then(()=>{
          location.reload();
        })   
        .then(function(){
          $.ajax({
            
            method:'POST',
            url:'/send_status_email2',
            data:{              
              reopen_ticket_id:reopen_ticket_id,
              tkt_status_chg:tkt_status_chg,
              pre_ticket_id:pre_ticket_id,
              reopen_tkt_crt_date:reopen_tkt_crt_date,
              pre_tkt_crt_date:pre_tkt_crt_date,
              ticket_catgy:ticket_catgy,
              customer_name:customer_name,
              customer_phone:customer_phone,
              product_catgy:product_catgy,
              batch_no:batch_no,
              sku:sku,
              customer_location:customer_location,
              quantity_purchage:quantity_purchage,
              quantity_rejected:quantity_rejected,
              manufacturing_date:manufacturing_date,
              ticket_type:ticket_type,
              product_name:product_name,
              sales_person_ph_no:sales_person_ph_no
            },
            success:function(result2){
              console.log(result2,'result2')
              console.log('mail sended status In-Process')
                                                                 
            }                    
        })
        })
        

      },
      error: function (err) {
        console.log(err, "err");
      },
    });
  } 
  
  
  else if (tkt_status_chg == 4) {
    let close_comment = $("#close_comment").val();
    console.log(close_comment, "close_comment");
    $.ajax({
      method: "POST",
      url: "/reopen_ticket_status_closed",
      data: {
        reopen_ticket_id: reopen_ticket_id,
        tkt_status_chg: tkt_status_chg,
        close_comment: close_comment,
      },
      success: function (result) {
        console.log("updated");
        
        Swal.fire({
          title: "Good Job!",
          text: "Ticket Status Closed Successfully Updated",
          icon: "success",
        })
        .then(()=>{
          location.reload();
        })

        .then(function(){
          $.ajax({
            
            method:'POST',
            url:'/send_status_email2',
            data:{              
              reopen_ticket_id:reopen_ticket_id,
              tkt_status_chg:tkt_status_chg,
              pre_ticket_id:pre_ticket_id,
              reopen_tkt_crt_date:reopen_tkt_crt_date,
              pre_tkt_crt_date:pre_tkt_crt_date,
              ticket_catgy:ticket_catgy,
              customer_name:customer_name,
              customer_phone:customer_phone,
              product_catgy:product_catgy,
              batch_no:batch_no,
              sku:sku,
              customer_location:customer_location,
              quantity_purchage:quantity_purchage,
              quantity_rejected:quantity_rejected,
              manufacturing_date:manufacturing_date,
              ticket_type:ticket_type,
              product_name:product_name,
              sales_person_ph_no:sales_person_ph_no
            },
            success:function(result2){
              console.log(result2,'result2')
              console.log('mail sended status In-Process')
                                                                    
            }                    
        })
        })
        

      },
      error: function (err) {
        console.log(err, "err");
      },
    });
  }
  
  
  
});

// ----------status change  js end---------------
// ----------status change  js end---------------
// ----------status change  js end---------------
// ----------status change  js end---------------
// ----------status change  js end---------------
