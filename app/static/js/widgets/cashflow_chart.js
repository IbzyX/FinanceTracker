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
    return income.reduce((total, entry) => total + entry.amount, 0);
}

function calculateTotalExpense() {
    const expenses = getExpense();
    return expenses.reduce((total, exp) => total + exp.expenseAmount, 0);
}
function calculateTotalBills() {
    const bills = getBills();
    return bills.reduce((total, bill) => total + bill.amount, 0);
}



function initCashflow_chart() {
    const canvas = document.getElementById("cashflow-chart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    
    const totalIncome = calculateTotalIncome();
    const totalExpense = calculateTotalExpense();
    const totalBills = calculateTotalBills();

    document.getElementById("income-total").textContent =  `£${totalIncome.toLocaleString()}`;
    document.getElementById("expense-total").textContent =  `£${totalExpense.toLocaleString()}`;
    document.getElementById("bills-total").textContent =  `£${totalBills.toLocaleString()}`;

    const data = {
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
    };

    if (window.cashflowChart) {
        window.cashflowChart.destroy();
    }

    window.cashflowChart = new Chart(ctx, {
        type: 'bar',  
        data: data,
        options: {
            responsive: true,
            indexAxis: 'y',  
            scales: {
                x: {
                    beginAtZero: true,
                    stacked: true,
                    ticks: {
                        callback: function(value) {
                            return `£${value.toLocaleString()}`; 
                        }
                    },
                    grid: {
                        display: false,
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
                    position: 'top', 
                }
            }
        }
    });
}

window.onload = function() {
    initCashflow_chart();
};