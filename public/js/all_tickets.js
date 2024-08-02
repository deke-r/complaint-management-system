$("#endDate").datepicker({
  dateFormat: "dd-mm-yy",
});
$("#startDate").datepicker({
  dateFormat: "dd-mm-yy",
});


// --------------ticket status number to text js start----------
// --------------ticket status number to text js start----------
// --------------ticket status number to text js start----------
function status_numberTOtext(){
  var ticket_status = document.querySelectorAll(".ticket_status");
  for (var i = 0; i < ticket_status.length; i++) {
    var tick_val = $(ticket_status[i]).html();

    if (tick_val == 1) {
      $(ticket_status[i]).html("Open");
    } else if (tick_val == 2) {
      $(ticket_status[i]).html("In-Process");
    } else if (tick_val == 3) {
      $(ticket_status[i]).html("Resolved");
    } else if (tick_val == 4) {
      $(ticket_status[i]).html("Closed");
    } else if (tick_val == 5) {
      $(ticket_status[i]).html("Reopen");
    }
  }
}
  

$(document).on('change load',function () {
  status_numberTOtext()
  console.log('change')
});

$(document).ready(function () {
  status_numberTOtext()
  console.log('ready')
});

// --------------ticket status number to text js end----------
// --------------ticket status number to text js end----------
// --------------ticket status number to text js end----------





$(document).on('click', '#filter_btn', function () {
  let startDate = $('#startDate').val();
  let endDate = $('#endDate').val();
  let category = $('#category').val();
  let ticket_sts = $('#ticket_sts').val();
  console.log(startDate, endDate, category, ticket_sts, 'fdfeceewew')
 
  if (startDate !== '' && endDate !== '' && (category == '' || category == undefined) && (ticket_sts == '' || ticket_sts == undefined)) {
    $.ajax({
      url: '/filter_ticket_data',
      method: 'POST',
      data: { 
        startDate: startDate,
        endDate: endDate
      },
      success: function (res) {
        console.log(res,'dfjjjejfieiruuore')
        $('#tbody').empty();
        console.log('1156')
        for (let v = 0; v < res.all_result.length; v++) {
          $('#tbody').append(`
              <tr class="text-secondary">
                  <td>${res.all_result[v].ticket_id}</td>
                  <td>
                      <a class="f_15 text_blue" href="/complaint_view/${res.all_result[v].ticket_id}" title="View Ticket"><i class="fa-solid fa-eye"></i></a>
                  </td>
                  <td class="ticket_status">${res.all_result[v].is_active}</td>
                  <td>${res.all_result[v].formatted_date}</td>

                  <td>${res.all_result[v].ticket_category }</td>
                  <td>${res.all_result[v].ticket_location }</td>
                  <td>${res.all_result[v].ticket_type}</td>
                  <td>55 min</td>
                  <td>Within SLA (0 min min)</td>
                  <td>${res.all_result[v].raised_by}</td>
                  <td>${res.all_result[v].description}</td>
                  <td>${res.all_result[v].product_category}</td>
                  <td>${res.all_result[v].product_name}</td>
                  <td>${res.all_result[v].sku}</td>
                  <td>${res.all_result[v].batch_no}</td>
                  <td>${res.all_result[v].manufacturing_date}</td>
                  <td>${res.all_result[v].customer_name}</td>
                  <td>${res.all_result[v].customer_type}</td>
                  <td>${res.all_result[v].customer_location}</td>
                  <td>${res.all_result[v].quantity_purchage}</td>
                  <td>${res.all_result[v].quantity_rejected}</td>
                  <td>${res.all_result[v].visit_type}</td>
                  <td>${res.all_result[v].person_meet}</td>
                  <td>${res.all_result[v].customer_phone}</td>
                  <td>${res.all_result[v].inprocess_by}</td>
                  <td>${res.all_result[v].formatted_inprocess_at}</td>
                  <td>${res.all_result[v].resolved_by}</td>
                  <td>${res.all_result[v].formatted_resolved_at}</td>
                  <td>${res.all_result[v].formated_investigated_at}</td>
                  <td>${res.all_result[v].investigation_details}</td>
                  <td>${res.all_result[v].action_taken}</td>
                  <td>${res.all_result[v].closed_by}</td>
                  <td>${res.all_result[v].formatted_closed_at}</td>
                  <td>${res.all_result[v].closed_comment}</td>
              </tr>
          `);
          status_numberTOtext()
        }
        
      },
      
      error: function (err) {
        console.log(err, 'error');
      }
    });

  } 
  
  else if (category !== '' && ticket_sts !== '' && startDate !== '' && endDate !== '') {
    console.log('ereriuiueoeueoue')
    $.ajax({
      url: '/filter_ticket_data',
      method: 'POST',
      data: {
        startDate: startDate,
        endDate: endDate, 
        category: category,
        ticket_sts: ticket_sts
      },
      success: function (res) {
        console.log(res,'dfjjjejfieiruuore')
        $('#tbody').empty();
        console.log('1156')
        for (let v = 0; v < res.all_result.length; v++) {
          $('#tbody').append(`
              <tr class="text-secondary">
                <td>${res.all_result[v].ticket_id}</td>
                  <td>
                      <a class="f_15 text_blue" href="/complaint_view/${res.all_result[v].ticket_id}" title="View Ticket"><i class="fa-solid fa-eye"></i></a>
                  </td>
                  <td class="ticket_status">${res.all_result[v].is_active}</td>
                  <td>${res.all_result[v].formatted_date}</td>

                  <td>${res.all_result[v].ticket_category }</td>
                  <td>${res.all_result[v].ticket_location }</td>
                  <td>${res.all_result[v].ticket_type}</td>
                  <td>55 min</td>
                  <td>Within SLA (0 min min)</td>
                  <td>${res.all_result[v].raised_by}</td>
                  <td>${res.all_result[v].description}</td>
                  <td>${res.all_result[v].product_category}</td>
                  <td>${res.all_result[v].product_name}</td>
                  <td>${res.all_result[v].sku}</td>
                  <td>${res.all_result[v].batch_no}</td>
                  <td>${res.all_result[v].manufacturing_date}</td>
                  <td>${res.all_result[v].customer_name}</td>
                  <td>${res.all_result[v].customer_type}</td>
                  <td>${res.all_result[v].customer_location}</td>
                  <td>${res.all_result[v].quantity_purchage}</td>
                  <td>${res.all_result[v].quantity_rejected}</td>
                  <td>${res.all_result[v].visit_type}</td>
                  <td>${res.all_result[v].person_meet}</td>
                  <td>${res.all_result[v].customer_phone}</td>
                  <td>${res.all_result[v].inprocess_by}</td>
                  <td>${res.all_result[v].formatted_inprocess_at}</td>
                  <td>${res.all_result[v].resolved_by}</td>
                  <td>${res.all_result[v].formatted_resolved_at}</td>
                  <td>${res.all_result[v].formated_investigated_at}</td>
                  <td>${res.all_result[v].investigation_details}</td>
                  <td>${res.all_result[v].action_taken}</td>
                  <td>${res.all_result[v].closed_by}</td>
                  <td>${res.all_result[v].formatted_closed_at}</td>
                  <td>${res.all_result[v].closed_comment}</td>
              </tr>
          `);
          status_numberTOtext()
        }
      },
      error: function (err) {
        console.log(err, 'error');
      }
    });
  }

  // when Complaint Category and Ticket Status selected js start
  // when Complaint Category and Ticket Status selected js start

  else if (category !== '' && ticket_sts !== '' && (startDate == '' || startDate == undefined) && (endDate == '' || endDate == undefined)) {
    console.log('ereriuiueoeueoue')
    $.ajax({
      url: '/filter_ticket_data',
      method: 'POST',
      data: {                 
        category: category,
        ticket_sts: ticket_sts
      },
      success: function (res) {
        console.log(res,'new_new_data')
        $('#tbody').empty();
        console.log('1156')
        for (let v = 0; v < res.all_result.length; v++) {
          $('#tbody').append(`
              <tr class="text-secondary">
              <td>${res.all_result[v].ticket_id}</td>
                  
                  <td>
                      <a class="f_15 text_blue" href="/complaint_view/${res.all_result[v].ticket_id}" title="View Ticket"><i class="fa-solid fa-eye"></i></a>
                  </td>
                  <td class="ticket_status">${res.all_result[v].is_active}</td>
                  <td>${res.all_result[v].formatted_date}</td>
                  <td>${res.all_result[v].ticket_category }</td>
                  <td>${res.all_result[v].ticket_location }</td>

                  <td>${res.all_result[v].ticket_type}</td>
                  <td>55 min</td>
                  <td>Within SLA (0 min min)</td>
                  <td>${res.all_result[v].raised_by}</td>
                  <td>${res.all_result[v].description}</td>
                  <td>${res.all_result[v].product_category}</td>
                  <td>${res.all_result[v].product_name}</td>
                  <td>${res.all_result[v].sku}</td>
                  <td>${res.all_result[v].batch_no}</td>
                  <td>${res.all_result[v].manufacturing_date}</td>
                  <td>${res.all_result[v].customer_name}</td>
                  <td>${res.all_result[v].customer_type}</td>
                  <td>${res.all_result[v].customer_location}</td>
                  <td>${res.all_result[v].quantity_purchage}</td>
                  <td>${res.all_result[v].quantity_rejected}</td>
                  <td>${res.all_result[v].visit_type}</td>
                  <td>${res.all_result[v].person_meet}</td>
                  <td>${res.all_result[v].customer_phone}</td>
                  <td>${res.all_result[v].inprocess_by}</td>
                  <td>${res.all_result[v].formatted_inprocess_at}</td>
                  <td>${res.all_result[v].resolved_by}</td>
                  <td>${res.all_result[v].formatted_resolved_at}</td>
                  <td>${res.all_result[v].formated_investigated_at}</td>
                  <td>${res.all_result[v].investigation_details}</td>
                  <td>${res.all_result[v].action_taken}</td>
                  <td>${res.all_result[v].closed_by}</td>
                  <td>${res.all_result[v].formatted_closed_at}</td>
                  <td>${res.all_result[v].closed_comment}</td>
              </tr>
          `);
          status_numberTOtext()
        }
      },
      error: function (err) {
        console.log(err, 'error');
      }
    });
  }

  // when Complaint Category and Ticket Status selected js end
  // when Complaint Category and Ticket Status selected js end

 else if (startDate !== '' && endDate !== ''  && category !== '' && (ticket_sts == '' || ticket_sts == undefined) ) {
    console.log('ereriuiueoeueoue')
    $.ajax({
      url: '/filter_ticket_data',
      method: 'POST',
      data: {       
        startDate:startDate,
        endDate:endDate,          
        category: category
      },
      success: function (res) {
        console.log(res,'new_new_data')
        $('#tbody').empty();
        console.log('1156')
        for (let v = 0; v < res.all_result.length; v++) {
          $('#tbody').append(`
              <tr class="text-secondary">
              <td>${res.all_result[v].ticket_id}</td>
                  
                  <td>
                      <a class="f_15 text_blue" href="/complaint_view/${res.all_result[v].ticket_id}" title="View Ticket"><i class="fa-solid fa-eye"></i></a>
                  </td>
                  <td class="ticket_status">${res.all_result[v].is_active}</td>
                  <td>${res.all_result[v].formatted_date}</td>
                  <td>${res.all_result[v].ticket_category }</td>
                  <td>${res.all_result[v].ticket_location }</td>

                  <td>${res.all_result[v].ticket_type}</td>
                  <td>55 min</td>
                  <td>Within SLA (0 min min)</td>
                  <td>${res.all_result[v].raised_by}</td>
                  <td>${res.all_result[v].description}</td>
                  <td>${res.all_result[v].product_category}</td>
                  <td>${res.all_result[v].product_name}</td>
                  <td>${res.all_result[v].sku}</td>
                  <td>${res.all_result[v].batch_no}</td>
                  <td>${res.all_result[v].manufacturing_date}</td>
                  <td>${res.all_result[v].customer_name}</td>
                  <td>${res.all_result[v].customer_type}</td>
                  <td>${res.all_result[v].customer_location}</td>
                  <td>${res.all_result[v].quantity_purchage}</td>
                  <td>${res.all_result[v].quantity_rejected}</td>
                  <td>${res.all_result[v].visit_type}</td>
                  <td>${res.all_result[v].person_meet}</td>
                  <td>${res.all_result[v].customer_phone}</td>
                  <td>${res.all_result[v].inprocess_by}</td>
                  <td>${res.all_result[v].formatted_inprocess_at}</td>
                  <td>${res.all_result[v].resolved_by}</td>
                  <td>${res.all_result[v].formatted_resolved_at}</td>
                  <td>${res.all_result[v].formated_investigated_at}</td>
                  <td>${res.all_result[v].investigation_details}</td>
                  <td>${res.all_result[v].action_taken}</td>
                  <td>${res.all_result[v].closed_by}</td>
                  <td>${res.all_result[v].formatted_closed_at}</td>
                  <td>${res.all_result[v].closed_comment}</td>
              </tr>
          `);
          status_numberTOtext()
        }
      },
      error: function (err) {
        console.log(err, 'error');
      }
    });
  }

});



// $(document).ready(function(){
  
//   $.ajax({
//     url:'/filter_ticket_data111111111111111111',
//     method:'post',
//     success:function(res){
//   console.log('entry_ajax')
//       console.log(res,'fkejiucjejeojiofakcji')
  
//     },
//     error:function(err){
//       console.log('error_in_in')
//     }
    
//   })
// })


$(document).ready(function(){
  $("#export_to_excel").click(function(){
      var csv = [];
      $("#dataTables tr").each(function(){
          var row = [];
          $(this).find('td, th').not(':nth-child(2)').each(function(){
              var cellText = $(this).text();
              if (/[,\s`]/.test(cellText)) {
                  cellText = '"' + cellText.replace(/"/g, '""') + '"';
              }
              row.push(cellText);
          });
          csv.push(row.join(","));
      });
      var csvContent = "data:text/csv;charset=utf-8," + csv.join("\n");
      console.log(csvContent,'csvContent_csvContent')

      var encodedUri = encodeURI(csvContent);
      console.log(encodedUri,'encodedUri_encodedUri')

      var link = document.createElement("a");
      console.log(link,'link_link')
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "Excel_sheet.csv");
      document.body.appendChild(link); 
      console.log(document.body.appendChild(link),'document.body.appendChild(link)')
      link.click();
  });
});


