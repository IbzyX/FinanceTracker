function initInvestments() {
    const canvas = document.getElementById("investments-chart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const saved = JSON.parse(localStorage.getItem("investments"));

    if (!Array.isArray(saved) || saved.length === 0) {
        console.warn("No investment data found.");
        return;
    }
    
    renderInvestmentProjection(saved, ctx);
}

window.investmentChart = null;

const exchangeRates = {
    GBP: 1,
    USD: 0.78,
    EURO: 0.85
};

function renderInvestmentProjection(investments, ctx, years = 10) {
    const labels = Array.from({ length: years + 1 }, (_, i) => `Year ${i}`);
    const datasets = [];

    // Individual investment lines
    investments.forEach((inv, index) => {
        const projection = getProjection(inv, years);
        datasets.push({
            label: `${inv.name} (${inv.currency})`,
            data: projection,
            borderColor: getColor(index),
            backgroundColor: "transparent",
            fill: false,
            tension: 0.3
        });
    });

    // Total combined line with growth
    const combined = combineProjections(investments, years);
    datasets.push({
        label: "Total Projected Value (£)",
        data: combined,
        borderColor: "#ff3bb4",
        backgroundColor: "rgba(255, 59, 180, 0.2)",
        fill: true,
        borderWidth: 3,
        tension: 0.3
    });



    // Base deposits line (initial + contributions, no growth)
    const baseDeposits = combineBaseDeposits(investments, years);
    datasets.push({
        label: "Base Deposits (£)",
        data: baseDeposits,
        borderColor: "#ffa500", // orange
        backgroundColor: "transparent",
        borderDash: [2, 2],
        fill: false,
        tension: 0.3
    });

    if (window.investmentChart) {
        window.investmentChart.destroy();
    }

    window.investmentChart = new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "top"
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: val => `£${val.toLocaleString()}`
                    }
                }
            }
        }
    });

    const finalTotal = combined[combined.length - 1];
    const finalBase = baseDeposits[baseDeposits.length - 1];
    const totalDisplay = document.getElementById("total-investments");

    if (totalDisplay) {
        const difference = finalTotal - finalBase;
        // Show difference with + or - sign, formatted
        const diffFormatted = difference >= 0 
            ? `£${difference.toLocaleString()}`
            : `£${Math.abs(difference).toLocaleString()}`;

        totalDisplay.textContent = `Total Value After ${years} Years: £${finalTotal.toLocaleString()} (Difference: ${diffFormatted})`;
    }

}

function getProjection(investment, years) {
    const result = [];
    const rate = (investment.annualReturn || 0) / 100;
    const contrib = convertToAnnual(investment.contributionAmount || 0, investment.contributionInterval);
    let value = investment.stockAmount || 0;

    const fx = exchangeRates[investment.currency] || 1;
    value *= fx;
    const contribGBP = contrib * fx;

    for (let year = 0; year <= years; year++) {
        if (year > 0) {
            value += contribGBP;
            value *= (1 + rate);
        }
        result.push(Math.round(value));
    }

    return result;
}

// Combine all investments projections with growth
function combineProjections(investments, years) {
    const total = Array(years + 1).fill(0);

    investments.forEach(inv => {
        const projection = getProjection(inv, years);
        for (let i = 0; i <= years; i++) {
            total[i] += projection[i];
        }
    });

    return total.map(v => Math.round(v));
}

// Combine net deposits (only contributions, no initial)
function combineNetDeposits(investments, years) {
    const deposits = Array(years + 1).fill(0);

    investments.forEach(inv => {
        const contribAnnual = convertToAnnual(inv.contributionAmount || 0, inv.contributionInterval);
        const fx = exchangeRates[inv.currency] || 1;
        const contribGBP = contribAnnual * fx;

        for (let year = 0; year <= years; year++) {
            deposits[year] += contribGBP * year; // cumulative contributions only
        }
    });

    return deposits.map(v => Math.round(v));
}

// Combine base deposits = initial amount + cumulative contributions (no growth)
function combineBaseDeposits(investments, years) {
    const deposits = Array(years + 1).fill(0);

    investments.forEach(inv => {
        const initial = (inv.stockAmount || 0) * (exchangeRates[inv.currency] || 1);
        const contribAnnual = convertToAnnual(inv.contributionAmount || 0, inv.contributionInterval);
        const fx = exchangeRates[inv.currency] || 1;
        const contribGBP = contribAnnual * fx;

        for (let year = 0; year <= years; year++) {
            deposits[year] += initial + contribGBP * year;
        }
    });

    return deposits.map(v => Math.round(v));
}

function convertToAnnual(amount, interval) {
    switch (interval) {
        case "daily": return amount * 365;
        case "weekly": return amount * 52;
        case "monthly": return amount * 12;
        case "quarterly": return amount * 4;
        case "half-year": return amount * 2;
        case "yearly": return amount;
        default: return 0;
    }
}

function getColor(index) {
    const colors = [
        "#4dc9f6", "#f67019", "#f53794", "#537bc4",
        "#acc236", "#166a8f", "#00a950", "#58595b"
    ];
    return colors[index % colors.length];
}

window.initInvestments = initInvestments;
