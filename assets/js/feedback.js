


  const validation = new JustValidate('#feedbackForm');

  validation
    .addField('#fullName', [
      { rule: 'required', errorMessage: 'Full name is required' },
      { rule: 'minLength', value: 3 },
    ])
    .addField('#email', [
      { rule: 'required', errorMessage: 'Email is required' },
      { rule: 'email' },
    ])
    .addField('#userType', [
      { rule: 'required', errorMessage: 'Please select a user type' },
    ])
    .addField('#eventAttended', [
      { rule: 'required', errorMessage: 'Please select an event' },
    ])
    .addField('#rating', [
      { rule: 'required', errorMessage: 'Rating is required' },
      { rule: 'number' },
      { rule: 'minNumber', value: 1 },
      { rule: 'maxNumber', value: 5 },
    ])
    .addField('#comments', [
      { rule: 'required', errorMessage: 'Comments are required' },
      { rule: 'minLength', value: 5 },
    ])
    .onSuccess((event) => {
      event.preventDefault();

      const submitBtn = event.target.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      // Show loading inside button
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Reloading...`;

      // Simulate short delay then show success
      setTimeout(() => {
        // Reset form
        event.target.reset();

        // Restore button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        // SweetAlert2 success popup
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your work has been saved",
          showConfirmButton: false,
          timer: 1500
        });
      }, 1200);
    });
