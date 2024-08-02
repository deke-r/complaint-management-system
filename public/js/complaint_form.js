$(document).on('focus', '#manufacturing_date', function() {
    $(this).datepicker({
        dateFormat: 'MM-yy',
    }).datepicker('show');
});

// document.getElementById('manufacturing_date').addEventListener('input', function(e) {
//     var selectedDate = new Date(e.target.value);
//     var selectedMonth = selectedDate.toLocaleString('default', { month: 'long' });
//     var selectedYear = selectedDate.getFullYear();
//     alert(selectedMonth + ' ' + selectedYear);
// });

$(document).ready(function () {
    $(document).on('change', '#yourSelectId', function () {
        let ticket_category = $(this).val();
       

        $.ajax({
            method: 'post',
            url: '/ticket_type_dropdown',
            data: { ticket_category: ticket_category },
            success: function (res) {
                $('#ticket_type_dd').empty();
                $('#ticket_type_dd').append('<option selected disabled>Select</option>');
                for (var i = 0; i < res.data.length; i++) {
                    $('#ticket_type_dd').append(`<option value="${res.data[i].ticket_category}">${res.data[i].ticket_category}</option>`);
                }
            },
            error: function (err) {
                console.error(err);
            }
        });
    });
});
$(document).ready(function () {
    $(document).on('change', '#ticket_type_dd', function () {
        let ticket_category1 = $(this).val();
	let cate =$('#yourSelectId').val();
        $.ajax({
            method: 'post',
            url: '/ticket_type1_dropdown',
            data: { ticket_category1: ticket_category1,cate:cate},
            success: function (res) {
                console.log(res,'resjfjlafjajl')
                $('#ticket_type1_dd').empty();
                $('#ticket_type1_dd').append('<option selected disabled>Select</option>');
                for (var i = 0; i < res.data.length; i++) {
                    $('#ticket_type1_dd').append(`<option value="${res.data[i].ticket_type}">${res.data[i].ticket_type}</option>`);
                }
            },
            error: function (err) {
                console.error(err);
            }
        });
    });
});

$(document).ready(function () {
    $(document).on('change', '#ticket_type1_dd', function () {
        let ticket_location = $('#ticket_location').val();

        $.ajax({
            method: 'post',
            url: '/ticket_location',
            data: { ticket_location: ticket_location},
            success: function (res) {
                $('#ticket_location').empty();
                $('#ticket_location').append('<option selected disabled>Select</option>');
                for (var i = 0; i < res.data.length; i++) {
                    $('#ticket_location').append(`<option value="${res.data[i].c_location}">${res.data[i].c_location}</option>`);
                }
            },
            error: function (err) {
                console.error(err);
            }
        });
    });
});


// --------------quantity condition js start--------------
// --------------quantity condition js start--------------
// --------------quantity condition js start--------------
// $(document).on('change', 'input[name=quantity_Purchase], input[name=quantity_Rejected]', function() {
//     let quantity_Purchase = parseInt($('input[name=quantity_Purchase]').val());
//     let quantity_Rejected = parseInt($('input[name=quantity_Rejected]').val());

//     if (quantity_Purchase < quantity_Rejected) {
//         $('#quantity_alert').removeAttr('hidden');

//     }
//     else{
//         $('#sub_btn').prop('disabled',false)
//         $('#quantity_alert').attr('hidden',true)
//     }

// });

// --------------quantity condition js end--------------
// --------------quantity condition js end--------------
// --------------quantity condition js end--------------



// -------------------------------------
// -------------------------------------
// -------------------------------------
// -------------------------------------
// -------------------------------------
// -------------------------------------
// $(document).on('change',function(){

   
//    if( $('#product_category').val() =='' || $('#product_category').val() =='none' ) {

//         $('#alert_product_category').removeAttr('hidden')
//         $('#sub_btn').prop('disabled',true)
//    }
//    else{

//     $('#alert_product_category').attr('hidden',true)
//     $('#sub_btn').prop('disabled',false)
//    }


//    if( $('#product_name').val() =='' || $('#product_name').val() =='none') {

//         $('#alert_product_name').removeAttr('hidden')
//         $('#sub_btn').prop('disabled',true)
//     }

//     else{

//         $('#alert_product_name').attr('hidden',true)
//         $('#sub_btn').prop('disabled',false)
//     }

//     if( $('#sku').val() =='' || $('#sku').val() =='none') {

//         $('#alert_sku').removeAttr('hidden')
//         $('#sub_btn').prop('disabled',true)
//     }
//     else{

//         $('#alert_sku').attr('hidden',true)
//         $('#sub_btn').prop('disabled',false)
//     }

//     if( $('input[name=batch_no]').val() =='') {

//         $('#alert_batch_no').removeAttr('hidden')
//         $('#sub_btn').prop('disabled',true)
//     }

//     else{

//         $('#alert_batch_no').attr('hidden',true)
//         $('#sub_btn').prop('disabled',false)
//     }




//     if( $('#manufacturing_date').val() =='') {

//         $('#alert_manufacturing_date').removeAttr('hidden')
//         $('#sub_btn').prop('disabled',true)
//     }

//     else{

//         $('#alert_manufacturing_date').attr('hidden',true)
//         $('#sub_btn').prop('disabled',false)
//     }
    
//     if( $('#visit_type').val() =='') {

//         $('#alert_visit_type').removeAttr('hidden')
//         $('#sub_btn').prop('disabled',true)
//     }
//     else{

//         $('#alert_visit_type').attr('hidden',true)
//         $('#sub_btn').prop('disabled',false)
//     }
    
//     if( $('#cutomer_type').val() =='') {

//         $('#alert_cutomer_type').removeAttr('hidden')
//         $('#sub_btn').prop('disabled',true)
//     }
//     else{

//         $('#alert_cutomer_type').attr('hidden',true)
//         $('#sub_btn').prop('disabled',false)
//     }


//     if( $('input[name=customer_phone]').val() =='') {

//         $('#alert_customer_phone').removeAttr('hidden')
//         $('#sub_btn').prop('disabled',true)
//     }

//     else{

//         $('#alert_customer_phone').attr('hidden',true)
//         $('#sub_btn').prop('disabled',false)
//     }

//     if( $('input[name=customer_name]').val() =='') {

//         $('#alert_customer_name').removeAttr('hidden')
//         $('#sub_btn').prop('disabled',true)
//     }

//     else{

//         $('#alert_customer_name').attr('hidden',true)
//         $('#sub_btn').prop('disabled',false)
//     }

//     if( $('input[name=customer_address]').val() =='') {

//         $('#alert_customer_address').removeAttr('hidden')
//         $('#sub_btn').prop('disabled',true)
//     }

//     else{

//         $('#alert_customer_address').attr('hidden',true)
//         $('#sub_btn').prop('disabled',false)
//     }

//     if( $('#c_location').val() =='') {

//         $('#alert_customer_location').removeAttr('hidden')
//         $('#sub_btn').prop('disabled',true)
//     }
//     else{

//         $('#alert_customer_location').attr('hidden',true)
//         $('#sub_btn').prop('disabled',false)
//     }
    
//     if( $('inpt[name=Person_Meet]').val() =='') {

//         $('#alert_preson_meet').removeAttr('hidden')
//         $('#sub_btn').prop('disabled',true)
//     }
//     else{

//         $('#alert_preson_meet').attr('hidden',true)
//         $('#sub_btn').prop('disabled',false)
//     }

//     if( $('input[name=Customer Code]').val() =='') {

//         $('#alert_customer_code').removeAttr('hidden')
//         $('#sub_btn').prop('disabled',true)
//     }

//     else{

//         $('#alert_customer_code').attr('hidden',true)
//         $('#sub_btn').prop('disabled',false)
//     }


//     if( $('input[name=quantity_Purchase]').val() =='') {

//         $('#alert_quantity_purchase').removeAttr('hidden')
//         $('#sub_btn').prop('disabled',true)
//     }

//     else{

//         $('#alert_quantity_purchase').attr('hidden',true)
//         $('#sub_btn').prop('disabled',false)
//     }
    
//     if( $('input[name=quantity_Rejected]').val() =='') {

//         $('#alert_quantity_rejected').removeAttr('hidden')
//         $('#sub_btn').prop('disabled',true)
//     }

//     else{

//         $('#alert_quantity_rejected').attr('hidden',true)
//         $('#sub_btn').prop('disabled',false)
//     }

// //    else if( $('input[name=manufacturing]').val() =='') {

// //         $('#alert_manufacturing_date').removeAttr('hidden')
// //         $('#sub_btn').prop('disabled',true)
// //     }
// //    else if( $('#visit_type').val() =='') {

// //         $('#alert_visit_type').removeAttr('hidden')
// //         $('#sub_btn').prop('disabled',true)
// //     }
// //    else if( $('#cutomer_type').val() =='') {

// //         $('#alert_cutomer_type').removeAttr('hidden')
// //         $('#sub_btn').prop('disabled',true)
// //     }

    
// })



// -------------------------------------
// -------------------------------------
// -------------------------------------
// -------------------------------------
// -------------------------------------
// -------------------------------------

// $(document).ready(function(){
                        
//     $.ajax({
//         url: '/ticket_location',
//         method: 'GET',                            
//         success: function (res) {
//             let ticket_location = $('#ticket_location');
//             ticket_location.empty()
//             ticket_location.append('<option selected disabled>Select</option>');

//             for (let i = 0; i < res.data.length; i++) {
//                 ticket_location.append(`<option value="${res.data[i].c_location}"> ${res.data[i].c_location} </option>`);
//             }
//         },
//         error: function (error) {
//             console.error(error);
//         }
//     });
// })


$(document).ready(function () {
    $(document).on('change', '#yourSelectId, #ticket_type_dd, #ticket_type1_dd, #ticket_location', function () {


        let ticket_type = $('#yourSelectId').val();
        let ticket_type_dd = $('#ticket_type_dd').val();
        let ticket_type_dd1 = $('#ticket_type1_dd').val();
        let ticket_location = $('#ticket_location').val();

        
        if (ticket_type && ticket_type_dd && ticket_type_dd1 && ticket_location) {
            $.ajax({
                url: '/product_category',
                method: 'POST',
                data:{ticket_type:ticket_type},
                success: function (res) {

                    let optionsHtml = '';
                    for (let i = 0; i < res.data.length; i++) {
                        optionsHtml += `<option value="${res.data[i].p_category}">${res.data[i].p_category}</option>`;
                    }

                    let visit_type = '';
                    for (let j = 0; j < res.data2.length; j++) {
                        visit_type += `<option value="${res.data2[j].visit_type}">${res.data2[j].visit_type}</option>`;
                    }

                    let customer_name = '';
                    for (let k = 0; k < res.data3.length; k++) {
                        customer_name += `<option value="${res.data3[k].customer_name}">${res.data3[k].customer_name}</option>`;
                    }

                    

                    $('#append_cr').empty().append(
                        `
                        <div class="container-fluid mt-3 border_t_g newmp bg-light py-2 rounded-3">

                        <div class="row mt-4  py-2">
                            <div class="col-md-4 my_cols">
                                <h6 class="fw_bold f_13 ms-1 ">Product Category: <span class="text-danger">*</span> </h6>
                                <select name="product_category" class="form-select border-leftb box_sdw11 f_13 fw_600" id="product_category" aria-label="Product Category" required>
                                    <option value="none" selected disabled>Select</option>
                                    ${optionsHtml}
                                </select>
                                 
                            </div>
                            <div class="col-md-4 my_cols">
                                <h6 class="fw_bold f_13 ms-1 ">Product Name: <span class="text-danger">*</span></h6>
                                <select name="product_name" class="form-select border-leftb box_sdw11 f_13 fw_600" id="product_name" aria-label="Product Name" required>
                                    <option value="none" selected disabled>Select</option>
                                </select>
                                
                            </div>
                            <div class="col-md-4 my_cols">
                                <h6 class="fw_bold f_13 ms-1 ">SKU: <span class="text-danger">*</span></h6>
                                <select name="sku" class="form-select border-leftb box_sdw11 f_13 fw_600" id="sku" aria-label="SKU" required>
                                    <option value="none" selected disabled>Select</option>
                                </select>
                                
                            </div>
                        </div>
                        <div class="row  py-2">
                            <div class="col-md-4 my_cols">
                                <h6 class="fw_bold f_13 ms-1 ">Batch No.: <span class="text-danger">*</span></h6>
                                <input type="text" name="batch_no" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="eg: 3245678 AB / A-PR" required>
                                
                            </div>
                            <div class="col-md-4 my_cols">
                                <h6 class="fw_bold f_13 ms-1 ">Manufacturing Date: <span class="text-danger">*</span></h6>
                                <input type="text" name="manufacturing" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="Select Manufacturing Date" id="manufacturing_date" required readonly>
                                
                            </div>
                            <div class="col-md-4 my_cols">
                                <h6 class="fw_bold f_13 ms-1 ">Visit Type: <span class="text-danger">*</span></h6>
                                <select name="visit_type" class="form-select border-leftb box_sdw11 f_13 fw_600" id="visit_type" aria-label="visit_type" required>
                                    <option value="none" selected disabled>Select</option>
                                    ${visit_type}
                                </select>
                                
                            </div>
                        </div>
                        <div class="row  py-2">
                            <div class="col-md-4 my_cols">
                                <h6 class="fw_bold f_13 ms-1 ">Customer Type: <span class="text-danger">*</span></h6>
                                <select name="cutomer_type" class="form-select border-leftb box_sdw11 f_13 fw_600" id="cutomer_type" aria-label="cutomer_type" required>
                                    <option value="none" selected disabled>Select</option>
                                    ${customer_name}
                                </select>
                                
                            </div>
                            <div class="col-md-4 my_cols">
                                <h6 class="fw_bold f_13 ms-1 ">Customer Phone: <span class="text-danger">*</span></h6>
                                <input type="number" name="customer_phone" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="Phone Number" required>
                                

                            </div>
                            <div class="col-md-4 my_cols">
                                <h6 class="fw_bold f_13 ms-1 ">Customer Name: <span class="text-danger">*</span></h6>
                                <input type="text" name="customer_name" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="Customer Name" required>

                            </div>
                        </div>

                        <div class="row  py-2">
                            <div class="col-md-4 my_cols">
                                <h6 class="fw_bold f_13 ms-1 ">Customer Address: <span class="text-danger">*</span></h6>
                                <input type="text" name="customer_address" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="Customer Address" required>
                                
                            </div>
                            
                            <div class="col-md-4 my_cols">
                                <h6 class="fw_bold f_13 ms-1 ">Customer Location: <span class="text-danger">*</span></h6>
                                <input type="text" name="Customer_Location" class="form-control border-leftb box_sdw11 f_13 fw_600" id="c_location" placeholder="Customer Location" required>

                                
                                
                            </div>

                            <div class="col-md-4 my_cols">
                                <h6 class="fw_bold f_13 ms-1 ">Person Meet: <span class="text-danger">*</span></h6>
                                <input type="text" name="Person_Meet" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="Person Meet" required>
                                
                            </div>
                            
                        </div>


                        <div class="row  py-2">
                            <div class="col-md-4 my_cols">
                                <h6 class="fw_bold f_13 ms-1 ">Customer Code: <span class="text-danger">*</span></h6>
                                <input type="text" name="customer_code" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="Customer Code" required id="customer_code">
                                

                            </div>
                            <div class="col-md-4 my_cols">
                                <h6 class="fw_bold f_13 ms-1 ">Quantity Purchase: <span class="text-danger">*</span></h6>
                                <input type="number" name="quantity_Purchase" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="Quantity Purchase" required>
                                
                            </div>
                            <div class="col-md-4 my_cols">
                                <h6 class="fw_bold f_13 ms-1 ">Quantity Rejected: <span class="text-danger">*</span></h6>
                                <input type="number" name="quantity_Rejected" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="Quantity Rejected" required>
                                
                                
                                <div id="quantity_alert" class="text-danger fw-bold f_11" hidden>
                                    Quantity rejected value should not greater than Quantity purchase value
                                </div>
                            </div>
                            
                        </div>



                        <div class="row  py-2">
                            <div class="col-md-4 my_cols">
                                <h6 class="fw_bold f_13 ms-1 ">Product Photo(Image 1): <span class="text-danger">*</span></h6>
                                <input type="file" name="Attachment1" id="Attachment1"  class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="" required>
                                
                            </div>
                            <div class="col-md-4 my_cols">
                                <h6 class="fw_bold f_13 ms-1 ">Product Photo(Image 2): <span class="text-danger">*</span></h6>
                                <input type="file" name="Attachment2" id="Attachment2" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="" required>
                                
                            </div>
                            <div class="col-md-4 my_cols">
                                <h6 class="fw_bold f_13 ms-1 ">Product Video: </h6>
                                <input type="file" name="Attachment3" id="Attachment3" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="" >

                            </div>
                            
                        </div>
                        


                        <div class="row  py-2">
                            
                        <div class="col-md-4 my_cols">
                            <h6 class="fw_bold f_13 ms-1 ">Reason of complaint: <span class="text-danger">*</span></h6>
                            <textarea class="form-control border-leftb box_sdw11 f_13 fw_600" rows='1' placeholder="" id="reason_for_complaint" required></textarea>
                        </div>
                        </div>                        




                        <div class="row  py-2">
                            <div class="col-12 my_cols d-flex justify-content-end ">
                                <button class="btn bg_b  text-nowrap text-light f_13 fw_600 submitExpense email" type="sumbit" id="sub_btn" disabled>Submit Details</button>
                            </div>
                            </div>

                        </div>
                        `
                    );




$(document).ready(function () {
                                  
$(document).on('change input', '#product_category, #product_name, #sku, [name=batch_no], #manufacturing_date, #visit_type, #cutomer_type, [name=customer_phone], [name=customer_name], [name=customer_address], #c_location, [name=Person_Meet], #customer_code, [name=quantity_Purchase], [name=quantity_Rejected], #Attachment1, #Attachment2,  #reason_for_complaint', function() {

    const allFieldsFilled = $('#product_category').val() !== 'none' && $('#product_name').val() !== 'none' && $('#sku').val() !== 'none' && $('[name=batch_no]').val() !== '' && $('#manufacturing_date').val() !== '' && $('#visit_type').val() !== 'none' && $('#cutomer_type').val() !== 'none' && $('[name=customer_phone]').val() !== '' && $('[name=customer_name]').val() !== '' && $('[name=customer_address]').val() !== '' && $('#c_location').val() !== 'none' && $('[name=Person_Meet]').val() !== '' && $('#customer_code').val() !== '' && $('[name=quantity_Purchase]').val() !== '' && $('[name=quantity_Rejected]').val() !== '' && $('#Attachment1').val() !== '' && $('#Attachment2').val() !== '' && $('#reason_for_complaint').val() !== '';

    let quantity_Purchase = parseInt($('input[name=quantity_Purchase]').val());
    let quantity_Rejected = parseInt($('input[name=quantity_Rejected]').val());

    if (allFieldsFilled && quantity_Purchase >= quantity_Rejected) {
        $('#sub_btn').prop('disabled', false);
        $('#quantity_alert').attr('hidden', true);

    } else {
        $('#sub_btn').prop('disabled', true);
        if (quantity_Purchase < quantity_Rejected) {
            $('#quantity_alert').removeAttr('hidden');
        } else {
            $('#quantity_alert').attr('hidden', true);
        }
    }
});

                        // --------------------------
                        // --------------------------
                        // --------------------------
                        // --------------------------
                        // --------------------------
                        // --------------------------
                        
                        $('#sub_btn').on('click', function () {



                          const formData = new FormData();
                     

                          formData.append('ticket_type', $('#yourSelectId').val());
                          formData.append('ticket_type_dd', $('#ticket_type_dd').val());
                          formData.append('ticket_type1_dd', $('#ticket_type1_dd').val());
                          formData.append('product_category', $('#product_category').val());
                          formData.append('ticket_location', $('#ticket_location').val());
                          
                          formData.append('product_name', $('#product_name').val());
                          formData.append('sku', $('#sku').val());
                          formData.append('batch_no', $('input[name=batch_no]').val());
                          formData.append('manufacturing', $('input[name=manufacturing]').val());
                          formData.append('visit_type', $('#visit_type').val());
                          formData.append('cutomer_type', $('#cutomer_type').val());
                          formData.append('customer_phone', $('input[name=customer_phone]').val());
                          formData.append('customer_name', $('input[name=customer_name]').val());
                          formData.append('customer_address', $('input[name=customer_address]').val());
                          formData.append('Customer_Location', $('#c_location').val());
                          formData.append('quantity_Purchase', $('input[name=quantity_Purchase]').val());
                          formData.append('quantity_Rejected', $('input[name=quantity_Rejected]').val());
                          formData.append('Person_Meet', $('input[name=Person_Meet]').val());
                          formData.append('cusotmer_code', $('#customer_code').val());

                        const attachment1Input = document.getElementById('Attachment1');
                        const attachment2Input = document.getElementById('Attachment2');
                        const attachment3Input = document.getElementById('Attachment3');

                        if (attachment1Input && attachment1Input.files && attachment1Input.files.length > 0) {
                        formData.append('Attachment1', attachment1Input.files[0]);
                        }

                        if (attachment2Input && attachment2Input.files && attachment2Input.files.length > 0) {
                        formData.append('Attachment2', attachment2Input.files[0]);
                        }

                        if (attachment3Input && attachment3Input.files && attachment3Input.files.length > 0) {
                            formData.append('Attachment3', attachment3Input.files[0]);
                            }


                        

                        formData.append('reason_for_complaint', $('#reason_for_complaint').val());

                       
                        fetch('/insert_data', {
                            method: 'POST',
                            body: formData,
                        })
                      
                        .then(response => {
                            console.log('Full Response:', response);
                            return response.json();
                        })
                        .then(data => {
                           
                            let ticket_data=data.all_data1[0];
                          //alert(ticket_data)

                            Swal.fire({
                                icon: 'success',
                                title: 'Submission Successfull',
                                text: 'Your Complaint has been submitted successfully. Ticket ID: ' + ticket_data.ticket_id,
                            })
                            .then(() => {
                               
                                location.reload(true);
                            });
                            sendEmail(ticket_data);
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            Swal.fire({
                                icon: 'error',
                                title: 'Submission Error',
                                text: 'There was an error submitting your data.',
                            });
                            
                        });





                    });



                    
                    
                });

                // ----------Email function start----------
                // ----------Email function start----------
                function sendEmail(ticket_data) {
                    fetch('/send-email', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ ticket_data }),
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Email Sent:', data);
                    })
                    .catch(error => {
                        console.error('Email Error:', error);
                    });
                }
                // ----------Email function end----------
                // ----------Email function end----------


                    $('#product_category').on('change', function () {
                        let selectedCategory = $(this).val();
                        $.ajax({
                            url: '/product_name',
                            method: 'POST',
                            data: { category: selectedCategory },
                            success: function (res) {
                                let productNameSelect = $('#product_name');
                                productNameSelect.empty().append('<option selected disabled>Select</option>');

                                for (let i = 0; i < res.data.length; i++) {
                                    productNameSelect.append(`<option value="${res.data[i].product_name}">${res.data[i].product_name}</option>`);
                                }
                            },
                            error: function (xhr, status, error) {
                                console.error(error);
                            }
                        });
                    });

                    $('#product_name').on('change', function () {
                        let selectedProduct = $(this).val();
                        $.ajax({
                            url: '/sku',
                            method: 'POST',
                            data: { product: selectedProduct },
                            success: function (res) {
                                let skuSelect = $('#sku');
                                skuSelect.empty().append('<option selected disabled>Select</option>');

                                for (let i = 0; i < res.data.length; i++) {
                                    skuSelect.append(`<option value="${res.data[i].sku} ${res.data[i].unit}">${res.data[i].sku} ${res.data[i].unit}</option>`);
                                }
                            },
                            error: function (xhr, status, error) {
                                console.error(error);
                            }
                        });
                    });

                    
                },
                error: function (xhr, status, error) {
                    console.error(error);
                }
            });
        } else {
            $('#append_cr').empty();
        }
    });
});








