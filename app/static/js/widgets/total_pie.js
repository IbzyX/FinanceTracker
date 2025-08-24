let totalPieChart = null;
function getCSSVariable(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function initTotal_pie() {
    
    const ctx = document.getElementById("totalpie").getContext("2d");

    const data = [40, 50, 10]; // Wants, Needs, Savings
    const labels = ["Wants", "Needs", "Savings"];
    const backgroundColors = [
        getCSSVariable('--chart-color-1'),
        getCSSVariable('--chart-color-2'),
        getCSSVariable('--chart-color-3')
        ];

    const centerTextPlugin = {
        id: 'centerText',
        beforeDraw(chart) {
            const { width, height, ctx } = chart;
            ctx.restore();

            const fontSize = (height / 100).toFixed(2);
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

    new Chart(ctx, {
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
                    display: false // Hide default legend
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
