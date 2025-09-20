function initSavings_projection(container = document) {
    console.log("📈 initSavings_projection called");

    const savingsData = JSON.parse(localStorage.getItem("savings"));
    const widget = container.querySelector("#savings_projection-widget");

    if (!savingsData || !widget) {
        console.warn("❌ Missing savings data or widget container.");
        return;
    }

    // Function to update the savings projection graph
    function updateSavingsProjection(data) {
        const { amount, interval, percentage, goalDate, instalment } = data;

        if (isNaN(amount) || isNaN(instalment) || isNaN(percentage)) {
            console.error("Invalid data: amount, instalment, or percentage is NaN.");
            return;
        }

        const projectionData = calculateSavingsProjection(amount, interval, percentage, goalDate, instalment);

        if (!projectionData.length) {
            console.warn("⚠️ No projection data to display.");
            return;
        }

        // ✅ AER Display
        const aerDisplayEl = container.querySelector("#aer-display");
        if (aerDisplayEl) {
            aerDisplayEl.textContent = `AER: ${percentage}%`;
        }

        // ✅ Goal Feasibility Indicator
        const finalProjection = projectionData[projectionData.length - 1];
        const finalCompound = parseFloat(finalProjection.compound);
        const goalFeasibilityEl = container.querySelector("#goal-feasibility");

        if (goalFeasibilityEl) {
            if (finalCompound >= savingsData.goalAmount) {
                goalFeasibilityEl.textContent = "✅";
                goalFeasibilityEl.style.color = "green";
                goalFeasibilityEl.setAttribute("aria-label", "Goal IS achievable.");
            } else {
                goalFeasibilityEl.textContent = "⚠️";
                goalFeasibilityEl.style.color = "crimson";
                goalFeasibilityEl.setAttribute("aria-label", "Goal NOT achievable.");
            }
        }

        renderSavingsProjection(widget, projectionData);
    }

    // Calculate projection data
    function calculateSavingsProjection(amount, interval, percentage, goalDate, instalment) {
        const projections = [];
        const startDate = new Date();
        const endDate = new Date(goalDate);

        let currentAmount = amount;
        let currentCompoundAmount = amount;

        const timeInterval = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            quarterly: 90,
            "half-year": 180,
            yearly: 365
        };

        const intervalDays = timeInterval[interval];
        if (!intervalDays) {
            console.error(`❌ Invalid interval: ${interval}`);
            return [];
        }

        const dailyRate = Math.pow(1 + percentage / 100, 1 / 365) - 1;
        const daysToGoal = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));

        for (let day = 0; day <= daysToGoal; day += intervalDays) {
            const date = new Date(startDate.getTime() + day * 86400000); // 86400000 = ms in a day

            currentAmount += instalment;
            currentCompoundAmount += instalment;

            const compoundInterest = currentCompoundAmount * (Math.pow(1 + dailyRate, intervalDays) - 1);
            currentCompoundAmount += compoundInterest;

            projections.push({
                date: date.toISOString().split("T")[0],
                amount: currentAmount.toFixed(2),
                compound: currentCompoundAmount.toFixed(2)
            });
        }

        return projections;
    }

    // Render Chart
    function renderSavingsProjection(widget, projectionData) {
        const canvas = widget.querySelector("canvas");
        if (!canvas) {
            console.warn("⚠️ Savings chart canvas not found.");
            return;
        }

        const ctx = canvas.getContext("2d");

        // Destroy existing chart if exists
        const existingChart = Chart.getChart(canvas);
        if (existingChart) {
            existingChart.destroy();
        }

        const labels = projectionData.map(item => item.date);
        const amountData = projectionData.map(item => item.amount);
        const compoundData = projectionData.map(item => item.compound);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Total',
                        data: amountData,
                        borderColor: '#6ce5e8',
                        fill: false,
                        tension: 0.1
                    },
                    {
                        label: 'Compound',
                        data: compoundData,
                        borderColor: '#ff3bb4',
                        fill: false,
                        tension: 0.1
                    }
                ]
            },
            options: {
                layout: {
                    padding: { bottom: 10 }
                },
                scales: {
                    x: {
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45,
                            autoSkip: true,
                            maxTicksLimit: 8
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

    // 🔁 Initial Render
    updateSavingsProjection(savingsData);
}

// 🔄 Re-render when localStorage updates (optional)
window.addEventListener("storage", () => initSavings_projection(document));
