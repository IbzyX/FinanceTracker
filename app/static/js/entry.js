
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("savings-form");
    const updateBtn = document.getElementById("update-savings");
    if (!form) return;

    // Load saved values
    const existingData = JSON.parse(localStorage.getItem("savings"));
    if (existingData) {
        form.amount.value = existingData.amount;
        form.interval.value = existingData.interval;
        form.percentage.value = existingData.percentage;
        form.goalAmount.value = existingData.goalAmount;
        form.goalDate.value = existingData.goalDate;
    }

    // Save on submit
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const amount = parseFloat(this.amount.value);
        const interval = this.interval.value;
        const percentage = parseFloat(this.percentage.value);
        const goalAmount = parseFloat(this.goalAmount.value);
        const goalDate = this.goalDate.value;

        if (isNaN(amount) || !interval || isNaN(percentage) || isNaN(goalAmount) || !goalDate) {
            alert("Please fill in all fields correctly.");
            return;
        }

        const savingsData = { amount, interval, percentage, goalAmount, goalDate };
        localStorage.setItem("savings", JSON.stringify(savingsData));
        alert("Savings data saved!");
    });

    // Update with instalment
    updateBtn.addEventListener("click", () => {
        const data = JSON.parse(localStorage.getItem("savings"));
        if (!data) {
            alert("No savings data found. Please submit first.");
            return;
        }

        const instalment = parseFloat(form.instalment.value);
        if (isNaN(instalment) || instalment <= 0) {
            alert("Enter a valid instalment amount.");
            return;
        }

        data.amount = parseFloat(data.amount) + instalment;
        localStorage.setItem("savings", JSON.stringify(data));

        form.amount.value = data.amount.toFixed(2);
        form.instalment.value = "";

        alert("Savings updated!");
    });
});
















// --- BILLS WIDGET ---- 
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("bill-form");
    const tableBody = document.getElementById("all-bills-table-body");

    function getBills() {
        return JSON.parse(localStorage.getItem("bills")) || [];
    }

    function saveBills(bills) {
        localStorage.setItem("bills", JSON.stringify(bills));
    }

    function renderBillTable() {
        if (!tableBody) return;

        const bills = getBills().sort((a, b) => new Date(a.date) - new Date(b.date));
        tableBody.innerHTML = "";

        bills.forEach((bill, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${bill.name}</td>
                <td>${bill.date}</td>
                <td><button class="remove-btn" data-index="${index}">−</button></td>
            `; // add this -- <td>£${bill.amount.toFixed(2)}</td> to the above for amount in entry widget
            tableBody.appendChild(row);
        });
    }

    // Handle delete clicks
    tableBody?.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-btn")) {
            const index = e.target.dataset.index;
            const bills = getBills();
            bills.splice(index, 1);
            saveBills(bills);
            renderBillTable();
        }
    });

    form?.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = this.name.value.trim();
        const date = this.date.value;
        const amount = parseFloat(this.amount.value);

        if (!name || !date || isNaN(amount)) {
            alert("Please fill in all fields correctly.");
            return;
        }

        const bill = { name, date, amount };
        const bills = getBills();
        bills.push(bill);
        saveBills(bills);

        this.reset();
        renderBillTable();
    });

    renderBillTable();
});
