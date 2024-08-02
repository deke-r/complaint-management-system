$(document).ready(function() {
    $('#updatePasswordForm').submit(function(event) {
        event.preventDefault(); // Prevent default form submission

        // Get form data
        var formData = {
            new_password: $('#newPassword').val(),
            confirm_password: $('#confirmPassword').val()
        };

        // Send AJAX request
        $.ajax({
            type: 'POST',
            url: '/updatePassword',
            data: formData,
            success: function(response) {
                if (response.success) {
                    swal('Success', 'Password updated successfully', 'success');
                    // Optionally, you can reset the form
                    $('#updatePasswordForm')[0].reset();
                } else {
                    swal('Error', response.message, 'error');
                }
            },
            error: function(xhr, status, error) {
                swal('Error', 'Something went wrong. Please try again later.', 'error');
            }
        });
    });
});