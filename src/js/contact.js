const form = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

const fields = {
    name: document.getElementById("name"),
    email: document.getElementById("email"),
    topic: document.getElementById("topic"),
    message: document.getElementById("message"),
};

if (form) {
    function validateEmail(email) {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    }

    function showError(input) {
        input.style.borderColor = "#B92770";
    }

    function clearError(input) {
        input.style.borderColor = "#ccc";
    }

    function validateRequired(input) {
        if (input.value.trim() === "") {
            showError(input);
            return false;
        } else {
            clearError(input);
            return true;
        }
    }


    fields.email.addEventListener("input", () => {
        if (fields.email.value.trim() !== "" && !validateEmail(fields.email.value)) {
            showError(fields.email);
        } else {
            clearError(fields.email);
        }
    });

    fields.email.addEventListener("blur", () => {
        validateRequired(fields.email);
        if (fields.email.value.trim() !== "" && !validateEmail(fields.email.value)) {
            showError(fields.email);
        }
    });


    Object.values(fields).forEach(field => {
        if (field !== fields.email) {
            field.addEventListener("blur", () => validateRequired(field));
        }

        field.addEventListener("input", () => clearError(field));
    });


    form.addEventListener("submit", function(e) {
        e.preventDefault();

        let isValid = true;

        Object.values(fields).forEach(field => {
            if (!validateRequired(field)) isValid = false;
        });

        if (fields.email.value.trim() !== "" && !validateEmail(fields.email.value)) {
            showError(fields.email);
            isValid = false;
        }

        if (!isValid) {
            formMessage.textContent = "Please fill in all required fields correctly.";
            formMessage.style.color = "red";
            return;
        }

        formMessage.textContent = "Your message has been sent successfully!";
        formMessage.style.color = "green";

        form.reset();
    });
}