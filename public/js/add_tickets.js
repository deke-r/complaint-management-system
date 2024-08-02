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

        $.ajax({
            method: 'post',
            url: '/ticket_type1_dropdown',
            data: { ticket_category1: ticket_category1},
            success: function (res) {
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
    $(document).on('change', '#yourSelectId, #ticket_type_dd, #ticket_type1_dd', function () {
        let ticket_type = $('#yourSelectId').val();
     
        let ticket_type_dd = $('#ticket_type_dd').val();
        let ticket_type_dd1 = $('#ticket_type1_dd').val();
        
        if (ticket_type && ticket_type_dd && ticket_type_dd1) {
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
                                <h6 class="fw_bold f_13 ms-1 ">Product Category:</h6>
                                <select name="product_category" class="form-select border-leftb box_sdw11 f_13 fw_600" id="product_category" aria-label="Product Category">
                                    <option selected disabled>Select</option>
                                    ${optionsHtml}
                                </select>
                            </div>
                            <div class="col-md-4 my_cols">
                                <h6 class="fw_bold f_13 ms-1 ">Product Name:</h6>
                                <select name="product_name" class="form-select border-leftb box_sdw11 f_13 fw_600" id="product_name" aria-label="Product Name">
                                    <option selected disabled>Select</option>
                                </select>
                            </div>
                            <div class="col-md-4 my_cols">
                                <h6 class="fw_bold f_13 ms-1 ">SKU:</h6>
                                <select name="sku" class="form-select border-leftb box_sdw11 f_13 fw_600" id="sku" aria-label="SKU">
                                    <option selected disabled>Select</option>
                                </select>
                            </div>
                        </div>
                        <div class="row  py-2">
                            <div class="col-md-4 my_cols">
                                <h6 class="fw_bold f_13 ms-1 ">Batch No.:</h6>
                                <input type="text" name="batch_no" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="eg: 3245678 AB / A-PR" required>
                            </div>
                            <div class="col-md-4 my_cols">
                                <h6 class="fw_bold f_13 ms-1 ">Manufacturing Date:</h6>
                                <input type="text" name="manufacturing" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="eg: May 2024" required>
                            </div>
                            <div class="col-md-4 my_cols">
                                <h6 class="fw_bold f_13 ms-1 ">Visit Type:</h6>
                                <select name="visit_type" class="form-select border-leftb box_sdw11 f_13 fw_600" id="visit_type" aria-label="visit_type">
                                    <option selected disabled>Select</option>
                                    ${visit_type}
                                </select>
                            </div>
                        </div>
                        <div class="row  py-2">
                            <div class="col-md-4 my_cols">
                                <h6 class="fw_bold f_13 ms-1 ">Customer Type:</h6>
                                <select name="cutomer_type" class="form-select border-leftb box_sdw11 f_13 fw_600" id="cutomer_type" aria-label="cutomer_type">
                                    <option selected disabled>Select</option>
                                    ${customer_name}
                                </select>
                            </div>
                            <div class="col-md-4 my_cols">
                                <h6 class="fw_bold f_13 ms-1 ">Customer Phone:</h6>
                                <input type="number" name="customer_phone" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="Phone Number" required>
                            </div>
                            <div class="col-md-4 my_cols">
                                <h6 class="fw_bold f_13 ms-1 ">Customer Name:</h6>
                                <input type="text" name="customer_name" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="Customer Name" required>
                            </div>
                        </div>

                        <div class="row  py-2">
                            <div class="col-md-4 my_cols">
                                <h6 class="fw_bold f_13 ms-1 ">Customer Address:</h6>
                                <input type="text" name="customer_address" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="Customer Address" required>
                            </div>
                            <div class="col-md-4 my_cols">
                                <h6 class="fw_bold f_13 ms-1 ">Customer Location:</h6>
                                <input type="text" name="Customer_Location" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="Customer Location" required>
                            </div>
                            <div class="col-md-4 my_cols">
                                <h6 class="fw_bold f_13 ms-1 ">Quantity Purchase:</h6>
                                <input type="text" name="quantity_Purchase" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="Quantity Purchase" required>
                            </div>
                        </div>


                        <div class="row  py-2">
                            <div class="col-md-4 my_cols">
                                <h6 class="fw_bold f_13 ms-1 ">Customer Code:</h6>
                                <input type="text" name="Customer Code" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="Customer Code" required>
                            </div>
                            <div class="col-md-4 my_cols">
                                <h6 class="fw_bold f_13 ms-1 ">Quantity Rejected:</h6>
                                <input type="text" name="quantity_Rejected" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="Quantity Rejected" required>
                            </div>
                            <div class="col-md-4 my_cols">
                                <h6 class="fw_bold f_13 ms-1 ">Person Meet:</h6>
                                <input type="text" name="Person_Meet" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="Person Meet" required>
                            </div>
                        </div>



                        <div class="row  py-2">
                            <div class="col-md-4 my_cols">
                                <h6 class="fw_bold f_13 ms-1 ">Product Photo(Front):</h6>
                                <input type="file" name="Attachment1" id="Attachment1" accept="image/*, video/*, .pdf" capture="environment" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="" required>
                            </div>
                            <div class="col-md-4 my_cols">
                                <h6 class="fw_bold f_13 ms-1 ">Product Photo(Back):</h6>
                                <input type="file" name="Attachment2" id="Attachment2" accept="image/*, video/*, .pdf" capture="environment" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="" required>
                                
                            </div>
                            <div class="col-md-4 my_cols">
                                <h6 class="fw_bold f_13 ms-1 ">Product Video:</h6>
                                <input type="file" name="Attachment3" id="Attachment3" accept="image/*, video/*, .pdf" capture="environment" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="" >
                                
                            </div>
                            
                        </div>
                        


                        <div class="row  py-2">
                            
                        <div class="col-md-4 my_cols">
                            <h6 class="fw_bold f_13 ms-1 ">Reason of complaint:</h6>
                            <textarea class="form-control border-leftb box_sdw11 f_13 fw_600" rows='1' placeholder="" required></textarea>
                        </div>
                        </div>                        




                        <div class="row  py-2">
                            <div class="col-12 my_cols d-flex justify-content-end ">
                                <button class="btn bg_b  text-nowrap text-light f_13 fw_600 submitExpense email" type="sumbit" id="sub_btn">Submit Details</button>
                            </div>
                            </div>

                        </div>
                        `
                    );

                    $(document).ready(function () {
                        
                        $('#sub_btn').on('click', function () {
                         
                          const formData = new FormData();
                     
                        
                          formData.append('ticket_type', $('#yourSelectId').val());
                          formData.append('ticket_type_dd', $('#ticket_type_dd').val());
                          formData.append('product_category', $('#product_category').val());
                          formData.append('product_name', $('#product_name').val());
                          formData.append('sku', $('#sku').val());
                          formData.append('batch_no', $('input[name=batch_no]').val());
                          formData.append('manufacturing', $('input[name=manufacturing]').val());
                          formData.append('visit_type', $('#visit_type').val());
                          formData.append('cutomer_type', $('#cutomer_type').val());
                          formData.append('customer_phone', $('input[name=customer_phone]').val());
                          formData.append('customer_name', $('input[name=customer_name]').val());
                          formData.append('customer_address', $('input[name=customer_address]').val());
                          formData.append('Customer_Location', $('input[name=Customer_Location]').val());
                          formData.append('quantity_Purchase', $('input[name=quantity_Purchase]').val());
                          formData.append('quantity_Rejected', $('input[name=quantity_Rejected]').val());
                          formData.append('Person_Meet', $('input[name=Person_Meet]').val());

                        const attachment1Input = document.getElementById('Attachment1');
                        const attachment2Input = document.getElementById('Attachment2');

                        if (attachment1Input && attachment1Input.files && attachment1Input.files.length > 0) {
                        formData.append('Attachment1', attachment1Input.files[0]);
                        }

                        if (attachment2Input && attachment2Input.files && attachment2Input.files.length > 0) {
                        formData.append('Attachment2', attachment2Input.files[0]);
                        }

                        

                        formData.append('textarea', $('textarea').val());

                       
                        fetch('insert_data', {
                            method: 'POST',
                            body: formData,
                        })
                      
                        .then(response => {
                            console.log('Full Response:', response);
                            return response.json();
                        })
                        .then(data => {
                            console.log('Success:', data);

                            const ticketId = data.ticket_id;
                            Swal.fire({
                                icon: 'success',
                                title: 'Submission Successful',
                                text: 'Your data has been submitted successfully. Ticket ID: ' + ticketId,
                            })
                            .then(() => {
                               
                                location.reload(true);
                            });
                            sendEmail(ticketId);
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
                    function sendEmail(ticketId) {
                        fetch('/send-email', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ ticketId }),
                        })
                        .then(response => response.json())
                        .then(data => {
                            console.log('Email Sent:', data);
                        })
                        .catch(error => {
                            console.error('Email Error:', error);
                        });
                    }
                });

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
                                    skuSelect.append(`<option value="${res.data[i].sku}">${res.data[i].sku}</option>`);
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


// $(document).ready(function () {
//     $(document).on('change', '#yourSelectId, #ticket_type_dd, #ticket_type1_dd', function () {
//         let ticket_type = $('#yourSelectId').val();
     
//         let ticket_type_dd = $('#ticket_type_dd').val();
//         let ticket_type_dd1 = $('#ticket_type1_dd').val();
        
//         if (ticket_type && ticket_type_dd && ticket_type_dd1) {
//             $.ajax({
//                 url: '/product_category',
//                 method: 'POST',
//                 data:{ticket_type:ticket_type},
//                 success: function (res) {

//                     let optionsHtml = '';
//                     for (let i = 0; i < res.data.length; i++) {
//                         optionsHtml += `<option value="${res.data[i].p_category}">${res.data[i].p_category}</option>`;
//                     }

//                     let visit_type = '';
//                     for (let j = 0; j < res.data2.length; j++) {
//                         visit_type += `<option value="${res.data2[j].visit_type}">${res.data2[j].visit_type}</option>`;
//                     }

//                     let customer_name = '';
//                     for (let k = 0; k < res.data3.length; k++) {
//                         customer_name += `<option value="${res.data3[k].customer_name}">${res.data3[k].customer_name}</option>`;
//                     }

//                     $('#append_cr').empty().append(
//                         `
//                         <div class="container-fluid mt-3 border_t_g newmp bg-light py-2 rounded-3">

//                         <div class="row mt-4  py-2">
//                             <div class="col-md-4 my_cols">
//                                 <h6 class="fw_bold f_13 ms-1 ">Product Category:</h6>
//                                 <select name="product_category" class="form-select border-leftb box_sdw11 f_13 fw_600" id="product_category" aria-label="Product Category">
//                                     <option selected disabled>Select</option>
//                                     ${optionsHtml}
//                                 </select>
//                             </div>
//                             <div class="col-md-4 my_cols">
//                                 <h6 class="fw_bold f_13 ms-1 ">Product Name:</h6>
//                                 <select name="product_name" class="form-select border-leftb box_sdw11 f_13 fw_600" id="product_name" aria-label="Product Name">
//                                     <option selected disabled>Select</option>
//                                 </select>
//                             </div>
//                             <div class="col-md-4 my_cols">
//                                 <h6 class="fw_bold f_13 ms-1 ">SKU:</h6>
//                                 <select name="sku" class="form-select border-leftb box_sdw11 f_13 fw_600" id="sku" aria-label="SKU">
//                                     <option selected disabled>Select</option>
//                                 </select>
//                             </div>
//                         </div>
//                         <div class="row  py-2">
//                             <div class="col-md-4 my_cols">
//                                 <h6 class="fw_bold f_13 ms-1 ">Batch No.:</h6>
//                                 <input type="text" name="batch_no" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="eg: 3245678 AB / A-PR" required>
//                             </div>
//                             <div class="col-md-4 my_cols">
//                                 <h6 class="fw_bold f_13 ms-1 ">Manufacturing Date:</h6>
//                                 <input type="text" name="manufacturing" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="eg: May 2024" required>
//                             </div>
//                             <div class="col-md-4 my_cols">
//                                 <h6 class="fw_bold f_13 ms-1 ">Visit Type:</h6>
//                                 <select name="visit_type" class="form-select border-leftb box_sdw11 f_13 fw_600" id="visit_type" aria-label="visit_type">
//                                     <option selected disabled>Select</option>
//                                     ${visit_type}
//                                 </select>
//                             </div>
//                         </div>
//                         <div class="row  py-2">
//                             <div class="col-md-4 my_cols">
//                                 <h6 class="fw_bold f_13 ms-1 ">Customer Type:</h6>
//                                 <select name="cutomer_type" class="form-select border-leftb box_sdw11 f_13 fw_600" id="cutomer_type" aria-label="cutomer_type">
//                                     <option selected disabled>Select</option>
//                                     ${customer_name}
//                                 </select>
//                             </div>
//                             <div class="col-md-4 my_cols">
//                                 <h6 class="fw_bold f_13 ms-1 ">Customer Phone:</h6>
//                                 <input type="number" name="customer_phone" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="Phone Number" required>
//                             </div>
//                             <div class="col-md-4 my_cols">
//                                 <h6 class="fw_bold f_13 ms-1 ">Customer Name:</h6>
//                                 <input type="text" name="customer_name" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="Customer Name" required>
//                             </div>
//                         </div>

//                         <div class="row  py-2">
//                             <div class="col-md-4 my_cols">
//                                 <h6 class="fw_bold f_13 ms-1 ">Customer Address:</h6>
//                                 <input type="text" name="customer_address" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="Customer Address" required>
//                             </div>
//                             <div class="col-md-4 my_cols">
//                                 <h6 class="fw_bold f_13 ms-1 ">Customer Location:</h6>
//                                 <input type="text" name="Customer_Location" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="Customer Location" required>
//                             </div>
//                             <div class="col-md-4 my_cols">
//                                 <h6 class="fw_bold f_13 ms-1 ">Quantity Purchase:</h6>
//                                 <input type="text" name="quantity_Purchase" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="Quantity Purchase" required>
//                             </div>
//                         </div>


//                         <div class="row  py-2">
//                             <div class="col-md-4 my_cols">
//                                 <h6 class="fw_bold f_13 ms-1 ">Customer Code:</h6>
//                                 <input type="text" name="Customer Code" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="Customer Code" required>
//                             </div>
//                             <div class="col-md-4 my_cols">
//                                 <h6 class="fw_bold f_13 ms-1 ">Quantity Rejected:</h6>
//                                 <input type="text" name="quantity_Rejected" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="Quantity Rejected" required>
//                             </div>
//                             <div class="col-md-4 my_cols">
//                                 <h6 class="fw_bold f_13 ms-1 ">Person Meet:</h6>
//                                 <input type="text" name="Person_Meet" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="Person Meet" required>
//                             </div>
//                         </div>



//                         <div class="row  py-2">
//                             <div class="col-md-4 my_cols">
//                                 <h6 class="fw_bold f_13 ms-1 ">Product Photo(Front):</h6>
//                                 <input type="file" name="Attachment1" id="Attachment1" accept="image/*, video/*, .pdf" capture="environment" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="" required>
//                             </div>
//                             <div class="col-md-4 my_cols">
//                                 <h6 class="fw_bold f_13 ms-1 ">Product Photo(Back):</h6>
//                                 <input type="file" name="Attachment2" id="Attachment2" accept="image/*, video/*, .pdf" capture="environment" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="" required>
                                
//                             </div>
//                             <div class="col-md-4 my_cols">
//                                 <h6 class="fw_bold f_13 ms-1 ">Product Video:</h6>
//                                 <input type="file" name="Attachment3" id="Attachment3" accept="image/*, video/*, .pdf" capture="environment" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="" >
                                
//                             </div>
                            
//                         </div>
                        


//                         <div class="row  py-2">
                            
//                         <div class="col-md-4 my_cols">
//                             <h6 class="fw_bold f_13 ms-1 ">Reason of complaint:</h6>
//                             <textarea class="form-control border-leftb box_sdw11 f_13 fw_600" rows='1' placeholder="" required></textarea>
//                         </div>
//                         </div>                        




//                         <div class="row  py-2">
//                             <div class="col-12 my_cols d-flex justify-content-end ">
//                                 <button class="btn bg_b  text-nowrap text-light f_13 fw_600 submitExpense email" type="sumbit" id="sub_btn">Submit Details</button>
//                             </div>
//                             </div>

//                         </div>
//                         `
//                     );

//                     $(document).ready(function () {
                        
//                         $('#sub_btn').on('click', function () {
                         
//                           const formData = new FormData();
                     
                        
//                           formData.append('ticket_type', $('#yourSelectId').val());
//                           formData.append('ticket_type_dd', $('#ticket_type_dd').val());
//                           formData.append('product_category', $('#product_category').val());
//                           formData.append('product_name', $('#product_name').val());
//                           formData.append('sku', $('#sku').val());
//                           formData.append('batch_no', $('input[name=batch_no]').val());
//                           formData.append('manufacturing', $('input[name=manufacturing]').val());
//                           formData.append('visit_type', $('#visit_type').val());
//                           formData.append('cutomer_type', $('#cutomer_type').val());
//                           formData.append('customer_phone', $('input[name=customer_phone]').val());
//                           formData.append('customer_name', $('input[name=customer_name]').val());
//                           formData.append('customer_address', $('input[name=customer_address]').val());
//                           formData.append('Customer_Location', $('input[name=Customer_Location]').val());
//                           formData.append('quantity_Purchase', $('input[name=quantity_Purchase]').val());
//                           formData.append('quantity_Rejected', $('input[name=quantity_Rejected]').val());
//                           formData.append('Person_Meet', $('input[name=Person_Meet]').val());

//                         const attachment1Input = document.getElementById('Attachment1');
//                         const attachment2Input = document.getElementById('Attachment2');

//                         if (attachment1Input && attachment1Input.files && attachment1Input.files.length > 0) {
//                         formData.append('Attachment1', attachment1Input.files[0]);
//                         }

//                         if (attachment2Input && attachment2Input.files && attachment2Input.files.length > 0) {
//                         formData.append('Attachment2', attachment2Input.files[0]);
//                         }

                        

//                         formData.append('textarea', $('textarea').val());

                       
//                         fetch('insert_data', {
//                             method: 'POST',
//                             body: formData,
//                         })
                      
//                         .then(response => {
//                             console.log('Full Response:', response);
//                             return response.json();
//                         })
//                         .then(data => {
//                             console.log('Success:', data);

//                             const ticketId = data.ticket_id;
//                             Swal.fire({
//                                 icon: 'success',
//                                 title: 'Submission Successful',
//                                 text: 'Your data has been submitted successfully. Ticket ID: ' + ticketId,
//                             })
//                             .then(() => {
                               
//                                 location.reload(true);
//                             });
//                             sendEmail(ticketId);
//                         })
//                         .catch(error => {
//                             console.error('Error:', error);
//                             Swal.fire({
//                                 icon: 'error',
//                                 title: 'Submission Error',
//                                 text: 'There was an error submitting your data.',
//                             });
                            
//                         });
//                     });
//                     function sendEmail(ticketId) {
//                         fetch('/send-email', {
//                             method: 'POST',
//                             headers: {
//                                 'Content-Type': 'application/json',
//                             },
//                             body: JSON.stringify({ ticketId }),
//                         })
//                         .then(response => response.json())
//                         .then(data => {
//                             console.log('Email Sent:', data);
//                         })
//                         .catch(error => {
//                             console.error('Email Error:', error);
//                         });
//                     }
//                 });

//                     $('#product_category').on('change', function () {
//                         let selectedCategory = $(this).val();
//                         $.ajax({
//                             url: '/product_name',
//                             method: 'POST',
//                             data: { category: selectedCategory },
//                             success: function (res) {
//                                 let productNameSelect = $('#product_name');
//                                 productNameSelect.empty().append('<option selected disabled>Select</option>');

//                                 for (let i = 0; i < res.data.length; i++) {
//                                     productNameSelect.append(`<option value="${res.data[i].product_name}">${res.data[i].product_name}</option>`);
//                                 }
//                             },
//                             error: function (xhr, status, error) {
//                                 console.error(error);
//                             }
//                         });
//                     });

//                     $('#product_name').on('change', function () {
//                         let selectedProduct = $(this).val();
//                         $.ajax({
//                             url: '/sku',
//                             method: 'POST',
//                             data: { product: selectedProduct },
//                             success: function (res) {
//                                 let skuSelect = $('#sku');
//                                 skuSelect.empty().append('<option selected disabled>Select</option>');

//                                 for (let i = 0; i < res.data.length; i++) {
//                                     skuSelect.append(`<option value="${res.data[i].sku}">${res.data[i].sku}</option>`);
//                                 }
//                             },
//                             error: function (xhr, status, error) {
//                                 console.error(error);
//                             }
//                         });
//                     });

//                 },
//                 error: function (xhr, status, error) {
//                     console.error(error);
//                 }
//             });
//         } else {
//             $('#append_cr').empty();
//         }
//     });
// });



$(document).ready(function () {
    $(document).on('change', '#yourSelectId, #ticket_type_dd', function () {
        let ticket_type = $('#yourSelectId').val();
        let ticket_type_dd = $('#ticket_type_dd').val();

        if (ticket_type === 'Supply Chain Related Issues' && ticket_type_dd) {
            $.ajax({
                url: '/product_category',
                method: 'POST',
                success: function (res) {
                    let optionsHtml = '';
                    for (let i = 0; i < res.data.length; i++) {
                        optionsHtml += `<option value="${res.data[i].product_category}">${res.data[i].product_category}</option>`;
                    }





                    $('#append_cr').empty().append(
                        `
                        <div class="container-fluid mt-3 border_t_g newmp bg-light py-2 rounded-3">

                        <div class="row mt-4  py-2">
                            <div class="col-md-4 my_cols">
                                <h6 class="fw_bold f_13 ms-1 ">Product Category:</h6>
                                <select name="product_category" class="form-select border-leftb box_sdw11 f_13 fw_600" id="product_category" aria-label="Product Category">
                                    <option selected disabled>Select</option>
                                    ${optionsHtml}
                                </select>
                            </div>
                            <div class="col-md-4 my_cols">
                                <h6 class="fw_bold f_13 ms-1 ">Product Name:</h6>
                                <select name="product_name" class="form-select border-leftb box_sdw11 f_13 fw_600" id="product_name" aria-label="Product Name">
                                    <option selected disabled>Select</option>
                                </select>
                            </div>
                            <div class="col-md-4 my_cols">
                                <h6 class="fw_bold f_13 ms-1 ">SKU:</h6>
                                <select name="sku" class="form-select border-leftb box_sdw11 f_13 fw_600" id="sku" aria-label="SKU">
                                    <option selected disabled>Select</option>
                                </select>
                            </div>
                        </div>
                        <div class="row  py-2">
                            <div class="col-md-6 my_cols">
                                <h6 class="fw_bold f_13 ms-1 ">Batch No.:</h6>
                                <input type="text" name="batch_no" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="eg: 3245678 AB / A-PR" required>
                            </div>
                            <div class="col-md-6 my_cols">
                                <h6 class="fw_bold f_13 ms-1 ">Manufacturing Date:</h6>
                                <input type="text" name="manufacturing" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="eg: May 2024" required>
                            </div>
                            
                        </div>
                        

                        <div class="row  py-2">
                        <div class="col-md-6 my_cols">
                                <h6 class="fw_bold f_13 ms-1 ">Distributor Code:</h6>
                                <input type="text" name="Distributor_Code" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="Distributor Code" required>
                            </div>

                        <div class="col-md-6 my_cols">
                        <h6 class="fw_bold f_13 ms-1 ">Quantity Purchase:</h6>
                        <input type="text" name="quantity_Purchase" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="Quantity Purchase" required>
                    </div>
                            

                           
                        </div>


                        



                        <div class="row  py-2">
                            <div class="col-md-4 my_cols">
                                <h6 class="fw_bold f_13 ms-1 ">Product Photo(Front):</h6>
                                <input type="file" name="Attachment1" accept="image/*, video/*, .pdf" capture="environment" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="" required>
                            </div>
                            <div class="col-md-4 my_cols">
                                <h6 class="fw_bold f_13 ms-1 ">Product Photo(Back):</h6>
                                <input type="file" name="Attachment2" accept="image/*, video/*, .pdf" capture="environment" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="" required>
                                <h6 class="f_11 fw_bold ms-1 mt-1 displaynun">&nbsp;</h6>
                            </div>
                            <div class="col-md-4 my_cols">
                            <h6 class="fw_bold f_13 ms-1 ">Reason of complaint:</h6>
                            <textarea class="form-control border-leftb box_sdw11 f_13 fw_600" rows='1' placeholder="" required></textarea>
                            <h6 class="f_11 fw_bold ms-1 mt-1 displaynun">&nbsp;</h6>
                        </div>
                        </div>


                        <div class="row  py-2">
                            <div class="col-12 my_cols d-flex justify-content-end ">
<button class="btn bg_b  text-nowrap text-light f_13 fw_600 submitExpense email" type="sumbit"
id="sub_btn">Submit Details</button>
                            </div>
                            </div>

                        </div>
                        `
                    );

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
                                    skuSelect.append(`<option value="${res.data[i].sku}">${res.data[i].sku}</option>`);
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





// $(document).ready(function () {
//     $(document).on('change', '#yourSelectId, #ticket_type_dd', function () {
//         let ticket_type = $('#yourSelectId').val();
//         let ticket_type_dd = $('#ticket_type_dd').val();


//         if (ticket_type === 'Billing Related issue' && ticket_type_dd) {
//             $.ajax({
//                 url: '/product_category',
//                 method: 'POST',
//                 success: function (res) {
//                     let optionsHtml = '';
//                     for (let i = 0; i < res.data.length; i++) {
//                         optionsHtml += `<option value="${res.data[i].product_category}">${res.data[i].product_category}</option>`;
//                     }


//                     $('#append_cr').empty().append(
//                         `
//                         <div class="container-fluid mt-3 border_t_g newmp bg-light py-2 rounded-3">

//                         <div class="row mt-4  py-2">
//                             <div class="col-md-4 my_cols">
//                                 <h6 class="fw_bold f_13 ms-1 ">Product Category:</h6>
//                                 <select name="product_category" class="form-select border-leftb box_sdw11 f_13 fw_600" id="product_category" aria-label="Product Category">
//                                     <option selected disabled>Select</option>
//                                     ${optionsHtml}
//                                 </select>
//                             </div>
//                             <div class="col-md-4 my_cols">
//                                 <h6 class="fw_bold f_13 ms-1 ">Product Name:</h6>
//                                 <select name="product_name" class="form-select border-leftb box_sdw11 f_13 fw_600" id="product_name" aria-label="Product Name">
//                                     <option selected disabled>Select</option>
//                                 </select>
//                             </div>
//                             <div class="col-md-4 my_cols">
//                                 <h6 class="fw_bold f_13 ms-1 ">SKU:</h6>
//                                 <select name="sku" class="form-select border-leftb box_sdw11 f_13 fw_600" id="sku" aria-label="SKU">
//                                     <option selected disabled>Select</option>
//                                 </select>
//                             </div>
//                         </div>
//                         <div class="row  py-2">
//                             <div class="col-md-4 my_cols">
//                                 <h6 class="fw_bold f_13 ms-1 ">Batch No.:</h6>
//                                 <input type="text" name="batch_no" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="eg: 3245678 AB / A-PR" required>
//                             </div>
//                             <div class="col-md-4 my_cols">
//                                 <h6 class="fw_bold f_13 ms-1 ">Manufacturing Date:</h6>
//                                 <input type="text" name="manufacturing" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="eg: May 2024" required>
//                             </div>
//                             <div class="col-md-4 my_cols">
//                             <h6 class="fw_bold f_13 ms-1 ">Invoice No.:</h6>
//                             <input type="text" name="Invoice_No." class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="Invoice No." required>
//                         </div>
//                         </div>
                        



//                         <div class="row  py-2">
//                             <div class="col-md-4 my_cols">
//                                 <h6 class="fw_bold f_13 ms-1 ">Distributor Code:</h6>
//                                 <input type="text" name="Distributor_Code" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="Distributor Code" required>
//                             </div>
//                             <div class="col-md-4 my_cols">
//                                 <h6 class="fw_bold f_13 ms-1 ">Invoice Upload:</h6>
//                                 <input type="file" name="Attachment2" accept="image/*, .pdf" capture="environment" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="" required>
//                                 <h6 class="f_11 fw_bold ms-1 mt-1 displaynun">&nbsp;</h6>
//                             </div>
//                             <div class="col-md-4 my_cols">
//                             <h6 class="fw_bold f_13 ms-1 ">Reason of complaint:</h6>
//                             <textarea class="form-control border-leftb box_sdw11 f_13 fw_600" rows='1' placeholder="" required></textarea>
//                             <h6 class="f_11 fw_bold ms-1 mt-1 displaynun">&nbsp;</h6>
//                         </div>
//                         </div>


//                         <div class="row  py-2">
//                             <div class="col-12 my_cols d-flex justify-content-end ">
// <button class="btn bg_b  text-nowrap text-light f_13 fw_600 submitExpense email" type="sumbit"
// id="sub_btn">Submit Details</button>
//                             </div>
//                             </div>

//                         </div>
//                         `
//                     );

//                     $('#product_category').on('change', function () {
//                         let selectedCategory = $(this).val();
//                         $.ajax({
//                             url: '/product_name',
//                             method: 'POST',
//                             data: { category: selectedCategory },
//                             success: function (res) {
//                                 let productNameSelect = $('#product_name');
//                                 productNameSelect.empty().append('<option selected disabled>Select</option>');

//                                 for (let i = 0; i < res.data.length; i++) {
//                                     productNameSelect.append(`<option value="${res.data[i].product_name}">${res.data[i].product_name}</option>`);
//                                 }
//                             },
//                             error: function (xhr, status, error) {
//                                 console.error(error);
//                             }
//                         });
//                     });

//                     $('#product_name').on('change', function () {
//                         let selectedProduct = $(this).val();
//                         $.ajax({
//                             url: '/sku',
//                             method: 'POST',
//                             data: { product: selectedProduct },
//                             success: function (res) {
//                                 let skuSelect = $('#sku');
//                                 skuSelect.empty().append('<option selected disabled>Select</option>');

//                                 for (let i = 0; i < res.data.length; i++) {
//                                     skuSelect.append(`<option value="${res.data[i].sku}">${res.data[i].sku}</option>`);
//                                 }
//                             },
//                             error: function (xhr, status, error) {
//                                 console.error(error);
//                             }
//                         });
//                     });

//                 },
//                 error: function (xhr, status, error) {
//                     console.error(error);
//                 }
//             });
//         } else {
//             $('#append_cr').empty();
//         }
//     });
// });




// $(document).ready(function () {
//     $(document).on('change', '#yourSelectId, #ticket_type_dd', function () {
//         let ticket_type = $('#yourSelectId').val();
//         let ticket_type_dd = $('#ticket_type_dd').val();


//         if (ticket_type === 'Packaging Complain' && ticket_type_dd) {
//             $.ajax({
//                 url: '/product_category',
//                 method: 'POST',
//                 success: function (res) {
//                     let optionsHtml = '';
//                     for (let i = 0; i < res.data.length; i++) {
//                         optionsHtml += `<option value="${res.data[i].product_category}">${res.data[i].product_category}</option>`;
//                     }


//                     $('#append_cr').empty().append(
//                         `
//                         <div class="container-fluid mt-3 border_t_g newmp bg-light py-2 rounded-3">

//                         <div class="row mt-4  py-2">
//                             <div class="col-md-4 my_cols">
//                                 <h6 class="fw_bold f_13 ms-1 ">Product Category:</h6>
//                                 <select name="product_category" class="form-select border-leftb box_sdw11 f_13 fw_600" id="product_category" aria-label="Product Category">
//                                     <option selected disabled>Select</option>
//                                     ${optionsHtml}
//                                 </select>
//                             </div>
//                             <div class="col-md-4 my_cols">
//                                 <h6 class="fw_bold f_13 ms-1 ">Product Name:</h6>
//                                 <select name="product_name" class="form-select border-leftb box_sdw11 f_13 fw_600" id="product_name" aria-label="Product Name">
//                                     <option selected disabled>Select</option>
//                                 </select>
//                             </div>
//                             <div class="col-md-4 my_cols">
//                                 <h6 class="fw_bold f_13 ms-1 ">SKU:</h6>
//                                 <select name="sku" class="form-select border-leftb box_sdw11 f_13 fw_600" id="sku" aria-label="SKU">
//                                     <option selected disabled>Select</option>
//                                 </select>
//                             </div>
//                         </div>
//                         <div class="row  py-2">
//                             <div class="col-md-4 my_cols">
//                                 <h6 class="fw_bold f_13 ms-1 ">Batch No.:</h6>
//                                 <input type="text" name="batch_no" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="eg: 3245678 AB / A-PR" required>
//                             </div>
//                             <div class="col-md-4 my_cols">
//                                 <h6 class="fw_bold f_13 ms-1 ">Manufacturing Date:</h6>
//                                 <input type="text" name="manufacturing" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="eg: May 2024" required>
//                             </div>
//                             <div class="col-md-4 my_cols">
//                             <h6 class="fw_bold f_13 ms-1 ">Registered Mobile No.:</h6>
//                             <input type="text" name="Registered_Mobile_No" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="Registered Mobile No." required>
//                         </div>
//                         </div>
                        



//                         <div class="row  py-2">
//                             <div class="col-md-3 my_cols">
//                                 <h6 class="fw_bold f_13 ms-1 ">Registered Name:</h6>
//                                 <input type="text" name="Registered_Name" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="Registered Name" required>
//                             </div>
//                             <div class="col-md-3 my_cols">
//                                 <h6 class="fw_bold f_13 ms-1 ">Drum and lid back side picutre:</h6>
//                                 <input type="file" name="Attachment2" accept="image/*, video/*, .pdf" capture="environment" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="" required>
//                                 <h6 class="f_11 fw_bold ms-1 mt-1 displaynun">&nbsp;</h6>
//                             </div>
//                             <div class="col-md-3 my_cols">
//                                 <h6 class="fw_bold f_13 ms-1 ">Batch No & Mfg date img:</h6>
//                                 <input type="file" name="Attachment3" accept="image/*, video/*, .pdf" capture="environment" class="form-control border-leftb box_sdw11 f_13 fw_600" placeholder="" required>
//                                 <h6 class="f_11 fw_bold ms-1 mt-1 displaynun">&nbsp;</h6>
//                             </div>
//                             <div class="col-md-3 my_cols">
//                             <h6 class="fw_bold f_13 ms-1 ">Detail Issue Discripton:</h6>
//                             <textarea class="form-control border-leftb box_sdw11 f_13 fw_600" rows='1' placeholder="" required></textarea>
//                             <h6 class="f_11 fw_bold ms-1 mt-1 displaynun">&nbsp;</h6>
//                         </div>
//                         </div>


//                         <div class="row  py-2">
//                             <div class="col-12 my_cols d-flex justify-content-end ">
// <button class="btn bg_b  text-nowrap text-light f_13 fw_600 submitExpense email" type="sumbit"
// id="sub_btn">Submit Details</button>
//                             </div>
//                             </div>

//                         </div>
//                         `
//                     );

//                     $('#product_category').on('change', function () {
//                         let selectedCategory = $(this).val();
//                         $.ajax({
//                             url: '/product_name',
//                             method: 'POST',
//                             data: { category: selectedCategory },
//                             success: function (res) {
//                                 let productNameSelect = $('#product_name');
//                                 productNameSelect.empty().append('<option selected disabled>Select</option>');

//                                 for (let i = 0; i < res.data.length; i++) {
//                                     productNameSelect.append(`<option value="${res.data[i].product_name}">${res.data[i].product_name}</option>`);
//                                 }
//                             },
//                             error: function (xhr, status, error) {
//                                 console.error(error);
//                             }
//                         });
//                     });

//                     $('#product_name').on('change', function () {
//                         let selectedProduct = $(this).val();
//                         $.ajax({
//                             url: '/sku',
//                             method: 'POST',
//                             data: { product: selectedProduct },
//                             success: function (res) {
//                                 let skuSelect = $('#sku');
//                                 skuSelect.empty().append('<option selected disabled>Select</option>');

//                                 for (let i = 0; i < res.data.length; i++) {
//                                     skuSelect.append(`<option value="${res.data[i].sku}">${res.data[i].sku}</option>`);
//                                 }
//                             },
//                             error: function (xhr, status, error) {
//                                 console.error(error);
//                             }
//                         });
//                     });

//                 },
//                 error: function (xhr, status, error) {
//                     console.error(error);
//                 }
//             });
//         } else {
//             $('#append_cr').empty();
//         }
//     });
// });






