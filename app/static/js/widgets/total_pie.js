let totalPieChart = null;

function getCSSVariable(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function getIncomeTotal() {
    const income = JSON.parse(localStorage.getItem("income")) || [];
    return income.reduce((sum, entry) => sum + (parseFloat(entry.amount) || 0), 0);
}

function getSavingsTotal() {
    const savings = JSON.parse(localStorage.getItem("savings"));
    return savings ? parseFloat(savings.amount) || 0 : 0;
}

function getInvestmentsTotal() {
    const investments = JSON.parse(localStorage.getItem("investments")) || [];
    if (!Array.isArray(investments)) return 0;
    return investments.reduce((sum, entry) => sum + (parseFloat(entry.stockAmount) || 0), 0);
}

/*function getExpensesTotal() {
    const expenses = JSON.parse(localStorage.getItem("expense")) || []; // 
    return expenses.reduce((sum, entry) => sum + (parseFloat(entry.expenseAmount) || 0), 0);
}*/

function initTotal_pie() {
    const ctx = document.getElementById("totalpie").getContext("2d");


    const data = [
        //getExpensesTotal(),  add for expense 
        getIncomeTotal(),     
        getSavingsTotal(),    
        getInvestmentsTotal() 
    ];

    const labels = [/*"Expense",*/"Income", "Savings", "Investments"];
    const backgroundColors = [
        getCSSVariable('--chart-color-1'),
        getCSSVariable('--chart-color-2'),
        getCSSVariable('--chart-color-3')
//        getCSSVariable('--chart-color-4')
    ];

    const centerTextPlugin = {
        id: 'centerText',
        beforeDraw(chart) {
            const { width, height, ctx } = chart;
            ctx.restore();

            const fontSize = (height / 110).toFixed(2);
            ctx.font = `${fontSize}em sans-serif`;
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";

            const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
            const text = `£${total.toFixed(2)}`;
            ctx.fillStyle = "#ffffff";
            ctx.fillText(text, width / 2, height / 2);
            ctx.save();
        }
    };

    if (totalPieChart) {
        totalPieChart.destroy();
    }

    totalPieChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: "70%",
            plugins: {
                legend: {
                    display: false
                }
            }
        },
        plugins: [centerTextPlugin]
    });

    const breakdown = document.getElementById("category-breakdown");
    breakdown.innerHTML = labels.map((label, i) => {
        return `
            <div>
                <span class="dot" style="background-color:${backgroundColors[i]};"></span>
                ${label}: £${data[i].toFixed(2)}
            </div>
        `;
    }).join('');
}

// Re-render when localStorage changes
window.addEventListener("storage", initTotal_pie);
