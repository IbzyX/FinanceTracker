window.investmentChart = null;

const exchangeRates = {
    GBP: 1,
    USD: 0.78,
    EURO: 0.85
};

function initInvestments(container = document) {
    const canvas = container.querySelector("#investments-chart");
    const yearSelect = container.querySelector("#years");
    const totalDisplay = container.querySelector("#total-investments");

    if (!canvas || !yearSelect || !totalDisplay) {
        console.warn("⚠️ Investment elements not found in container", container);
        return;
    }

    const ctx = canvas.getContext("2d");
    const saved = JSON.parse(localStorage.getItem("investments"));

    if (!Array.isArray(saved) || saved.length === 0) {
        console.warn("No investment data found.");
        return;
    }

    const initialYears = parseInt(yearSelect.value, 10);

    // Initial render
    renderInvestmentProjection(saved, ctx, totalDisplay, initialYears);

    // Re-render on dropdown change
    yearSelect.addEventListener("change", () => {
        const years = parseInt(yearSelect.value, 10);
        renderInvestmentProjection(saved, ctx, totalDisplay, years);
    });
}

function renderInvestmentProjection(investments, ctx, totalDisplay, years = 10) {
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

    // Total combined line
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

    if (window.investmentChart) {
        window.investmentChart.destroy();
    }

    window.investmentChart = new Chart(ctx, {
        type: "line",
        data: { labels, datasets },
        options: {
            responsive: true,
            plugins: {
                legend: { position: "top" },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const datasetLabel = context.dataset.label || "";
                            const value = context.parsed.y;
                            const yearIndex = context.dataIndex;

                            if (!datasetLabel.includes("Total Projected Value")) {
                                const investment = investments[context.datasetIndex];
                                const baseDeposits = combineBaseDeposits([investment], years);
                                const baseForYear = baseDeposits[yearIndex];

                                return [
                                    `${datasetLabel}: £${value.toLocaleString()}`,
                                    `Base Amount: £${baseForYear.toLocaleString()}`
                                ];
                            }

                            if (datasetLabel.includes("Total Projected Value")) {
                                const baseDeposits = combineBaseDeposits(investments, years);
                                const baseForYear = baseDeposits[yearIndex];

                                return [
                                    `${datasetLabel}: £${value.toLocaleString()}`,
                                    `Base Deposits: £${baseForYear.toLocaleString()}`
                                ];
                            }

                            return `${datasetLabel}: £${value.toLocaleString()}`;
                        }
                    }
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

    // Update bottom display
    const finalTotal = combined[combined.length - 1];
    const finalBase = combineBaseDeposits(investments, years)[years];

    if (totalDisplay) {
        const difference = finalTotal - finalBase;
        const diffFormatted = difference >= 0
            ? `£${difference.toLocaleString()}`
            : `£${Math.abs(difference).toLocaleString()}`;

        totalDisplay.textContent =
            `Total Value After ${years} Years: £${finalTotal.toLocaleString()} (Difference: ${diffFormatted})`;
    }
}

// --- helpers (same as before) ---
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
