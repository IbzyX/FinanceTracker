// ---- INCOME WIDGET ---- 
document.addEventListener("DOMContentLoaded", () => {
    const incomeForm = document.getElementById("income-form");
    const incomeTable = document.getElementById("all-income-table-body");

    function getIncome() {
        return JSON.parse(localStorage.getItem("income")) || [];
    }

    function saveIncome(income) {
        localStorage.setItem("income", JSON.stringify(income));
    }

    function renderIncomeTable() {
        const income = getIncome();
        incomeTable.innerHTML = "";

        income.forEach((entry, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${entry.name}</td>
                <td>${entry.type}</td>
                <td>£${entry.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td>${entry.frequency}</td>
                <td>${entry.tax}%</td>
                <td>
                    <button class="income-remove" data-index="${index}" aria-label="Remove income">−</button>
                </td>
            `; 

            incomeTable.appendChild(row);
        });
    }

    incomeTable?.addEventListener("click", (e) => {
        if (e.target.classList.contains("income-remove")) {
            const index = e.target.dataset.index;
            const income = getIncome();
            income.splice(index, 1);
            saveIncome(income);
            renderIncomeTable();
        }
    });

    incomeForm?.addEventListener("submit", function (e) {
        e.preventDefault();

        const newIncome = {
            name: this.incomeName.value.trim(),
            amount: parseFloat(this.incomeAmount.value),
            tax: parseFloat(this.tax.value),
            type: this.incomeType.value,
            frequency: this.incomeFrequency.value
        };

        const income = getIncome();
        income.push(newIncome);
        saveIncome(income);
        renderIncomeTable();

        this.reset(); 
    });

    // Initial render
    renderIncomeTable();
});








// ---- SAVINGS WIDGET ----
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("savings-form");
    const updateBtn = document.getElementById("update-savings");
    if (!form) return;

    // Load saved values (including instalment)
    const existingData = JSON.parse(localStorage.getItem("savings"));
    if (existingData) {
        form.amount.value = existingData.amount;
        form.interval.value = existingData.interval;
        form.percentage.value = existingData.percentage;
        form.goalAmount.value = existingData.goalAmount;
        form.goalDate.value = existingData.goalDate;
        form.instalment.value = existingData.instalment || ""; // Load instalment value
    }

    // Save on submit (including instalment)
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const amount = parseFloat(this.amount.value);
        const interval = this.interval.value;
        const percentage = parseFloat(this.percentage.value);
        const goalAmount = parseFloat(this.goalAmount.value);
        const goalDate = this.goalDate.value;
        const instalment = parseFloat(this.instalment.value); // Get instalment value

        if (isNaN(amount) || !interval || isNaN(percentage) || isNaN(goalAmount) || !goalDate) {
            alert("Please fill in all fields correctly.");
            return;
        }

        const savingsData = { 
            amount, 
            interval, 
            percentage, 
            goalAmount, 
            goalDate,
            instalment: isNaN(instalment) ? 0 : instalment // Save instalment if valid, else 0
        };
        localStorage.setItem("savings", JSON.stringify(savingsData));
        alert("Savings data saved!");
    });

    // Update with instalment (including instalment persistence)
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
        data.instalment = instalment; // Save the instalment value as well

        localStorage.setItem("savings", JSON.stringify(data));

        form.amount.value = data.amount.toFixed(2);
        form.instalment.value = data.instalment.toFixed(2); // Set the instalment field to the saved value

        alert("Savings updated!");
    });
});




// ---- INVESTMENTS WIDGET ---- 
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("investment-entry-form");
    if (!form) return;

    // Load existing data
    let saved = JSON.parse(localStorage.getItem("investments"));
    let investments = [];

    if (Array.isArray(saved)) {
        investments = saved;
    } else if (saved && typeof saved === "object") {
        investments = [saved]; // migrate old data once
    }

    // Handle submit
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const investment = {
            name: this.name.value,
            type: this.type.value,
            stockAmount: parseFloat(this.stockAmount.value) || 0,
            currency: this.currency.value,
            contributionInterval: this.contributionInterval.value,
            contributionAmount: parseFloat(this.contributionAmount.value) || 0,
            currentValue: parseFloat(this.currentValue.value) || 0,
            annualReturn: parseFloat(this.annualReturn.value) || 0,
            purchaseDate: this.purchaseDate.value
        };

        // Add new entry
        investments.push(investment);

        // Save back to localStorage
        localStorage.setItem("investments", JSON.stringify(investments));

        alert("Investment saved!");
        form.reset();
        
        const canvas = document.getElementById("investment-chart");
         if (canvas && typeof renderInvestmentProjection === "function") {
            const ctx = canvas.getContext("2d");
            renderInvestmentProjection(investments, ctx);
         }
    });
});








// ---- EXPENSE WIDGET ----  
document.addEventListener("DOMContentLoaded", () => {
    const expenseForm = document.getElementById("expense-form");
    const expenseTable = document.getElementById("all-expenses-table-body");

    function getExpense() {
        return JSON.parse(localStorage.getItem("expense")) || [];
    }
    function saveExpense(expense) {
        localStorage.setItem("expense", JSON.stringify(expense));
    }

    function renderExpenseTable() {
        if (!expenseTable) return;

        const expense = getExpense();
        expenseTable.innerHTML = "";

        expense.forEach((exp, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${exp.name}</td>
                <td>${exp.occurrence}</td>
                <td>£${exp.expenseAmount.toFixed(2)}</td>
                <td>${exp.expenseInterval}</td>
                <td><button class="remove-btn" data-index="${index}">−</button></td>
            `;
            expenseTable.appendChild(row);
        });
    }

    expenseTable?.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-btn")) {
            const index = e.target.dataset.index;
            const expense = getExpense();
            expense.splice(index, 1);
            saveExpense(expense);
            renderExpenseTable();
        }
    });

    expenseForm?.addEventListener("submit", function (e) {
        e.preventDefault();

        const expenseInterval = this.expenseInterval.value; 
        const name = this.name.value.trim();
        const occurrence = parseFloat(this.occurrence.value);
        const expenseAmount = parseFloat(this.expenseAmount.value);

        if (!name || isNaN(occurrence) || isNaN(expenseAmount) || !expenseInterval) {
            alert("Please fill in all fields correctly.");
            return;
        }

        const newExpense = { name, expenseInterval, occurrence, expenseAmount };
        const expenses = getExpense();
        expenses.push(newExpense);
        saveExpense(expenses);

        this.reset();
        renderExpenseTable();
    });

    renderExpenseTable();
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

