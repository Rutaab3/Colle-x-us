    // Validation with JustValidate
    const validation = new JustValidate('#contactForm');

    validation
      .addField('#name', [
        { rule: 'required', errorMessage: 'Name is required' },
        { rule: 'minLength', value: 3 },
      ])
      .addField('#email', [
        { rule: 'required', errorMessage: 'Email is required' },
        { rule: 'email' },
      ])
      .addField('#contactType', [
        { rule: 'required', errorMessage: 'Please select a type' },
      ])
      .addField('#subject', [
        { rule: 'required', errorMessage: 'Subject is required' },
        { rule: 'minLength', value: 3 },
      ])
      .addField('#message', [
        { rule: 'required', errorMessage: 'Message is required' },
        { rule: 'minLength', value: 10 },
      ])
      .onSuccess((event) => {
        event.preventDefault();

        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Show spinner in button
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Sending...`;

        setTimeout(() => {
          event.target.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;

          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Your message has been sent",
            showConfirmButton: false,
            timer: 1500
          });
        }, 1200);
      });
