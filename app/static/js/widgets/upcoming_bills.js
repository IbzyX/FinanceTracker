function initUpcomingBills() {
    const bills = [
        { name: "Insurance", date: "2025-09-04", amount: 104 },
        { name: "Amazon", date: "2025-09-05", amount: 4.49 },
        { name: "Youtube", date: "2025-08-26", amount: 7.99 },
        { name: "Netflix", date: "2025-09-18", amount: 12.99 }
    ];

    const tbody = document.getElementById("bills-table-body");
    const totalSpan = document.getElementById("total-bills");

    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    let total = 0;

    bills.forEach(bill => {
        const billDate = new Date(bill.date);
        if (billDate >= today && billDate <= thirtyDaysFromNow) {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${bill.name}</td><td>${bill.date}</td><td>£${bill.amount.toFixed(2)}</td>`;
            tbody.appendChild(row);
            total += bill.amount;
        }
    });

    totalSpan.textContent = total.toFixed(2);
}

if (document.getElementById("upcoming-bills-widget")) {
    initUpcomingBills();
}
