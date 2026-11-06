
// Get HTML elements
const bookingForm = document.getElementById("bookingFormElement");
const bookingResult = document.getElementById("bookingResult");
const resultDetails = document.getElementById("resultDetails");
const totalCost = document.getElementById("totalCost");

// Get input fields
const customerName = document.getElementById("customerName");
const customerEmail = document.getElementById("customerEmail");
const packageSelect = document.getElementById("package");
const quantityInput = document.getElementById("quantity");

// Function to display error messages
function showError(input, errorId, message) {
    document.getElementById(errorId).textContent = message;
    input.classList.add("input-error");
}

// Function to clear error messages
function clearError(input, errorId) {
    document.getElementById(errorId).textContent = "";
    input.classList.remove("input-error");
}

// Validate form
bookingForm.addEventListener("submit", function(event) {

    event.preventDefault();

    let isValid = true;

    // Clear previous errors
    clearError(customerName, "nameError");
    clearError(customerEmail, "emailError");
    clearError(packageSelect, "packageError");
    clearError(quantityInput, "quantityError");

    // Validate customer name
    if (customerName.value.trim() === "") {
        showError(customerName, "nameError", "Please enter your full name.");
        isValid = false;
    }

    // Validate email
    if (customerEmail.value.trim() === "") {
        showError(customerEmail, "emailError", "Please enter your email address.");
        isValid = false;
    } else if (!customerEmail.checkValidity()) {
        showError(customerEmail, "emailError", "Please enter a valid email address.");
        isValid = false;
    }

    // Validate package
    if (packageSelect.value === "") {
        showError(packageSelect, "packageError", "Please select a ghost removal package.");
        isValid = false;
    }

    // Validate quantity
    const quantity = Number(quantityInput.value);

    if (
        quantityInput.value.trim() === "" ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 20
    ) {
        showError(quantityInput, "quantityError", "Please enter between 1 and 20 rooms.");
        isValid = false;
    }

    // Stop calculation if form is invalid
    if (!isValid) {
        bookingResult.hidden = true;
        // Find the first field with an error
    const firstError = document.querySelector(".input-error");

    if (firstError) {

        firstError.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        firstError.focus();
    }
        return;
    }

    // Calculate package cost
    const packagePrice = Number(packageSelect.value);
    const packageName = packageSelect.options[packageSelect.selectedIndex].text;
    const packageTotal = packagePrice * quantity;

    // Get selected additional services
    const extras = document.querySelectorAll(".extra:checked");

    let extrasTotal = 0;
    let extrasList = [];

    extras.forEach(function(extra) {

        const extraPrice = Number(extra.value);
        const extraName = extra.dataset.name;

        extrasTotal += extraPrice;

        extrasList.push({
            name: extraName,
            price: extraPrice
        });

    });

    // Calculate final cost
    const finalTotal = packageTotal + extrasTotal;

    resultDetails.textContent = "";

    // Create result category
    function createResultGroup(title) {

        const group = document.createElement("div");
        group.className = "result-group";

        const heading = document.createElement("h3");
        heading.textContent = title;

        group.appendChild(heading);
        resultDetails.appendChild(group);

        return group;
    }

    // Create result row
    function addResultLine(group, label, value) {

        const row = document.createElement("div");
        row.className = "result-row";

        const labelText = document.createElement("span");
        labelText.textContent = label;

        const valueText = document.createElement("strong");
        valueText.textContent = value;

        row.appendChild(labelText);
        row.appendChild(valueText);

        group.appendChild(row);
    }

    // Category 1: Customer Information
    const customerGroup = createResultGroup("01. Customer Information");

    addResultLine(customerGroup, "Full Name", customerName.value.trim());
    addResultLine(customerGroup, "Email Address", customerEmail.value.trim());

    // Category 2: Booking Details
    const bookingGroup = createResultGroup("02. Booking Details");

    addResultLine(bookingGroup, "Selected Package", packageName);
    addResultLine(bookingGroup, "Number of Rooms", quantity);
    addResultLine(bookingGroup, "Package Cost", "RM" + packageTotal.toFixed(2));

    // Category 3: Additional Services
    const extrasGroup = createResultGroup("03. Additional Services");

    if (extrasList.length === 0) {

        addResultLine(extrasGroup, "Selected Services", "None");

    } else {

        extrasList.forEach(function(extra) {
            addResultLine(extrasGroup, extra.name, "RM" + extra.price.toFixed(2));
        });

    }

    addResultLine(extrasGroup, "Extras Total", "RM" + extrasTotal.toFixed(2));

    // Display total cost
    totalCost.textContent = "RM" + finalTotal.toFixed(2);

    // Show booking summary
    bookingResult.hidden = false;
    alert("Booking calculation completed successfully!");

    bookingResult.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

});

// Clear error when user starts correcting a field
customerName.addEventListener("input", function() {
    clearError(customerName, "nameError");
});

customerEmail.addEventListener("input", function() {
    clearError(customerEmail, "emailError");
});

packageSelect.addEventListener("change", function() {
    clearError(packageSelect, "packageError");
});

quantityInput.addEventListener("input", function() {
    clearError(quantityInput, "quantityError");
});

// Reset form
bookingForm.addEventListener("reset", function() {

    bookingResult.hidden = true;
    resultDetails.textContent = "";
    totalCost.textContent = "RM0.00";

    clearError(customerName, "nameError");
    clearError(customerEmail, "emailError");
    clearError(packageSelect, "packageError");
    clearError(quantityInput, "quantityError");

});
