let radarChart = null;

function getCSSVariable(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function getRadarData() {
    const expenses = JSON.parse(localStorage.getItem("expense")) || [];
    const labels = expenses.map(exp => exp.name);
    const data = expenses.map(exp => parseFloat(exp.expenseAmount) || 0);
    return { labels, data };
}

function renderRadarExpenseTable(container = document) {
    const expenseTable = container.querySelector("#all-habits-table-body"); 
    if (!expenseTable) return;

    const expenses = JSON.parse(localStorage.getItem("expense")) || [];
    expenseTable.innerHTML = "";

    expenses.forEach(exp => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${exp.name}</td>
            <td>${exp.occurrence}</td>
            <td>£${parseFloat(exp.expenseAmount).toFixed(2)}</td>
        `;
        expenseTable.appendChild(row);
    });
}

function initHabits(container = document) {
    const canvas = container.querySelector("#radarChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const { labels, data } = getRadarData();

    if (radarChart) {
        radarChart.destroy();
    }

    radarChart = new Chart(ctx, {
        type: "radar",
        data: {
            labels: labels,
            datasets: [{
                label: "Expenses (£)",
                data: data,
                backgroundColor: "#6ce5e8",
                borderColor: "#48e0e0",
                pointBackgroundColor: "#6ce5e8"
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                r: {
                    grid: {
                        display: true,
                        color: (ctx) =>
                            ctx.index === ctx.chart.scales.r.ticks.length - 1 
                                ? "#ffffff34"
                                : "transparent",
                        lineWidth: (ctx) =>
                            ctx.index === ctx.chart.scales.r.ticks.length - 1 
                                ? 2
                                : 0
                    },
                    angleLines: { display: false },
                    ticks: { display: false },
                    pointLabels: {
                        display: true,
                        color: "var(--text-color)",
                        font: { size: 12 }
                    }
                }
            }
        }
    });

    // ✅ Pass container for scoped table rendering
    renderRadarExpenseTable(container);
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    initHabits(document);
});

// Re-render when localStorage changes
window.addEventListener("storage", () => {
    initHabits(document);
});
