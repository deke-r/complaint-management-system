$(document).ready(function () {
    $(document).on('change', '#c_catgy', function () {
        let complaint_category = $(this).val();
       


        $.ajax({
            method: 'post',
            url: '/ticket_category_dropdown',
            data: { complaint_category: complaint_category },
            success: function (res) {
                $('#ticket_catgy').empty();
                $('#ticket_catgy').append('<option selected disabled>Select Ticket Category</option>');
                for (var i = 0; i < res.data.length; i++) {
                    $('#ticket_catgy').append(`<option value="${res.data[i].ticket_category}">${res.data[i].ticket_category}</option>`);
                }
            },
            error: function (err) {
                console.error(err);
            }
        });
    });
});
$(document).ready(function () {
    $(document).on('change', '#ticket_catgy', function () {
        let ticket_category = $(this).val();

        $.ajax({
            method: 'post',
            url: '/ticket_type_dropdown111',
            data: { ticket_category: ticket_category},
            success: function (res) {
                $('#ticket_type').empty();
                $('#ticket_type').append('<option selected disabled>Select Ticket Type</option>');
                for (var i = 0; i < res.data.length; i++) {
                    $('#ticket_type').append(`<option value="${res.data[i].ticket_type}">${res.data[i].ticket_type}</option>`);
                }
            },
            error: function (err) {
                console.error(err);
            }
        });
    });
});





$(document).on('click','#submit_btn',function(){

    console.log('11111')
    let c_catgy=$('#c_catgy').val();
    let ticket_catgy=$('#ticket_catgy').val();
    let ticket_type=$('#ticket_type').val();
    let level_1st_tat=$('#level_1st_tat').val();
    let level_1st_sla=$('#level_1st_sla').val();
    let level_2nd_tat=$('#level_2nd_tat').val();
    let level_2nd_sla=$('#level_2nd_sla').val();
    let level_3rd_tat=$('#level_3rd_tat').val();
    let level_3rd_sla=$('#level_3rd_sla').val();
    


    console.log(c_catgy,ticket_catgy,ticket_type,level_1st_tat,level_1st_sla,level_2nd_tat,level_2nd_sla,level_3rd_tat,level_3rd_sla,'daat1111111111')
    $.ajax({
        type:'POST',
        url:"/add_sla_tat_config",
        data:{
            c_catgy:c_catgy,
            ticket_catgy:ticket_catgy,
            ticket_type:ticket_type,
            level_1st_tat:level_1st_tat,
            level_1st_sla:level_1st_sla,
            level_2nd_tat:level_2nd_tat,
            level_2nd_sla:level_2nd_sla,
            level_3rd_tat:level_3rd_tat,
            level_3rd_sla:level_3rd_sla
            },
        success:(function(result){
            // console.log('UPDATED')
            Swal.fire({
                title: "Good job!",
                text: "SLA & TAT Configuration Successfully Added",
                icon: "success"
              })
              .then(function(){
                location.reload()    
              })
            
           
        }),
        error:function(error){
            console.log(error)
            
        }

    })
})