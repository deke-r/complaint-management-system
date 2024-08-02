// const xValues = [100,200,300,400,500,600,700,800,900,1000];

// new Chart("myChart", {
//   type: "line",
//   data: {
//     labels: xValues,
//     datasets: [{ 
//       data: [860,1140,1060,1060,1070,1110,1330,2210,7830,2478],
//       borderColor: "red",
//       fill: false
//     }, { 
//       data: [1600,1700,1700,1900,2000,2700,4000,5000,6000,7000],
//       borderColor: "green",
//       fill: false
//     }, { 
//       data: [300,700,2000,5000,6000,4000,2000,1000,200,100],
//       borderColor: "blue",
//       fill: false
//     }]
//   },
//   options: {
//     legend: {display: false}
//   }
// });


$(document).ready(function(){
  let open_count= $('#open_count').text().trim();
  let in_process_count= $('#in_process_count').text().trim();
  let resolved_count= $('#resolved_count').text().trim();
  let closed_count= $('#closed_count').text().trim();
  let reopen_count= $('#reopen_count').text().trim();

  if( open_count == ''){
    $('#open_count').html('0');
  }
  if( in_process_count == ''){
    $('#in_process_count').html('0');
  }
  if( resolved_count == ''){
    $('#resolved_count').html('0');
  }
  if( closed_count == ''){
    $('#closed_count').html('0');
  }
  if( reopen_count == ''){
    $('#reopen_count').html('0');
  }
  

  
})