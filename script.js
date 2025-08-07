async function getStockInfo() {
    const symbol = document.getElementById("symbolInput").value.trim().toUpperCase();

    if (!symbol) {
        alert("Please enter a stock symbol.");
        return;
    }

    const apiKey = "c4111ac3814740a895978ee961e97fa0"; 

    // --- Fetch quote info ---
    const quoteUrl = `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${apiKey}`;
    try {
        const res = await fetch(quoteUrl);
        const stock = await res.json();

        console.log("Fetched stock data:", stock);
        if (stock.code || !stock.name) {
            alert("Error: " + (stock.message || "Invalid symbol or data unavailable."));
            return;
        }

        document.getElementById("price").innerText = `$${stock.close}` || "-";
        document.getElementById("dailychange").innerText = `$${stock.change}` || "-";
        document.getElementById("dailychangepercent").innerText = `${stock.percent_change}%` || "-";
        document.getElementById("volume").innerText = stock.volume || "-";
        document.getElementById("dailyhigh").innerText = `$${stock.high}` || "-";
        document.getElementById("dailylow").innerText = `$${stock.low}` || "-";

        // --- Fetch daily chart data ---
        const chartUrl = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&outputsize=30&apikey=${apiKey}`;
        const chartRes = await fetch(chartUrl);
        const chartData = await chartRes.json();

        if (chartData.status === "error") {
            alert("Chart error: " + chartData.message);
            return;
        }

        const dates = [];
        const prices = [];

        for (let entry of chartData.values.reverse()) {
            dates.push(entry.datetime);               // Date string
            prices.push(parseFloat(entry.close));      // Closing price
        }

        drawChart(dates, prices);

    } catch (err) {
        console.error("Fetch error:", err);
        alert("Error fetching stock data. Please try again later.");
    }
}
let chart; // declare globally so we can destroy and redraw

function drawChart(labels, data) {
    const ctx = document.getElementById('stockChart').getContext('2d');

    // Destroy existing chart if it exists (to avoid overlap)
    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Closing Price (INR)',
                data: data,
                borderColor: 'lime',
                backgroundColor: 'transparent',
                tension: 0.3,
                pointRadius: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: { color: 'white' },
                    title: { display: true, text: 'Date', color: 'white' }
                },
                y: {
                    ticks: { color: 'white' },
                    title: { display: true, text: 'Price', color: 'white' }
                }
            },
            plugins: {
                legend: { labels: { color: 'white' } }
            }
        }
    });
}
