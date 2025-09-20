function getIncome() {
    return JSON.parse(localStorage.getItem("income")) || [];
}

function getExpense() {
    return JSON.parse(localStorage.getItem("expense")) || [];
}

function getBills() {
    return JSON.parse(localStorage.getItem("bills")) || [];
}

function calculateTotalIncome() {
    const income = getIncome();
    return income.reduce((total, entry) => total + (parseFloat(entry.amount) || 0), 0);
}

function calculateTotalExpense() {
    const expenses = getExpense();
    return expenses.reduce((total, exp) => total + (parseFloat(exp.expenseAmount) || 0), 0);
}

function calculateTotalBills() {
    const bills = getBills();
    return bills.reduce((total, bill) => total + (parseFloat(bill.amount) || 0), 0);
}

function initCashflow_chart(container = document) {
    console.log("📊 initCashflow_chart called");

    const canvas = container.querySelector("#cashflow-chart");
    const incomeTotalEl = container.querySelector("#income-total");
    const expenseTotalEl = container.querySelector("#expense-total");
    const billsTotalEl = container.querySelector("#bills-total");

    if (!canvas || !incomeTotalEl || !expenseTotalEl || !billsTotalEl) {
        console.warn("⚠️ Cashflow chart elements not found in container", container);
        return;
    }

    const ctx = canvas.getContext("2d");

    const totalIncome = calculateTotalIncome();
    const totalExpense = calculateTotalExpense();
    const totalBills = calculateTotalBills();

    incomeTotalEl.textContent = `£${totalIncome.toLocaleString()}`;
    expenseTotalEl.textContent = `£${totalExpense.toLocaleString()}`;
    billsTotalEl.textContent = `£${totalBills.toLocaleString()}`;

    // If chart exists, destroy it before creating a new one
    const existingChart = Chart.getChart(canvas);
    if (existingChart) {
        existingChart.destroy();
    }

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [''],
            datasets: [
                {
                    label: 'Income',
                    data: [totalIncome],
                    backgroundColor: '#6ce5e8',
                    borderColor: '#48e0e0',
                    borderWidth: 1,
                    stack: 'stack1'
                },
                {
                    label: 'Expense',
                    data: [totalExpense],
                    backgroundColor: '#ff3bb4',
                    borderColor: '#e233a2',
                    borderWidth: 1,
                    stack: 'stack2'
                },
                {
                    label: 'Bills',
                    data: [totalBills],
                    backgroundColor: '#ff9800',
                    borderColor: '#f57c00',
                    borderWidth: 1,
                    stack: 'stack2'
                }
            ]
        },
        options: {
            responsive: true,
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true,
                    stacked: true,
                    ticks: {
                        callback: (value) => `£${value.toLocaleString()}`
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    stacked: true,
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });
}

// 🔄 Re-render on localStorage changes
window.addEventListener("storage", () => initCashflow_chart(document));
