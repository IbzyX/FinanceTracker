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
