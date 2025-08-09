
let chart;

async function getStockInfo() {
    const symbol = document.getElementById("symbolInput").value.trim().toUpperCase();
    if (!symbol) {
        alert("Please enter a stock symbol.");
        return;
    }

    // const apiKey = "c4111ac3814740a895978ee961e97fa0";

    try {
        const quoteUrl = `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${apiKey}`;
        console.log("Fetching:", quoteUrl);
        const res = await fetch(quoteUrl);
        const rawQuoteText = await res.text(); // get raw text
        console.log("Raw quote response:", rawQuoteText);
        
        let stock;
        try {
            stock = JSON.parse(rawQuoteText);
        } catch (err) {
            throw new Error("Quote API did not return valid JSON.");
        }

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
        console.log("Fetching:", chartUrl);
        const chartRes = await fetch(chartUrl);
        const rawChartText = await chartRes.text();
        console.log("Raw chart response:", rawChartText);

        let chartData;
        try {
            chartData = JSON.parse(rawChartText);
        } catch (err) {
            
        }

        if (!chartData || !chartData.values) {
            alert("No chart data available.");
            return;
        }

        const dates = [];
        const prices = [];

        for (let entry of chartData.values.reverse()) {
            dates.push(entry.datetime);
            prices.push(parseFloat(entry.close));
        }

        drawChart(dates, prices);

    } catch (err) {
        console.error("Fetch error:", err);
    }
}
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
const apiKey = "c4111ac3814740a895978ee961e97fa0";
const symbols = ["AMZN", "AAPL", "GOOGL"];

async function fetchStock(symbol) {
    const url = `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${apiKey}`;
    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.code || !data.name) {
            console.error(`Error for ${symbol}:`, data.message);
            return;
        }

        document.getElementById(`price-${symbol}`).innerText = `$${data.close}`;
    } catch (err) {
        console.error(`Error fetching ${symbol}:`, err);
    }
}

function updateAllStocks() {
    symbols.forEach(fetchStock);
}

document.addEventListener("DOMContentLoaded", updateAllStocks);

// Refresh every 1 minute
setInterval(updateAllStocks, 60000); 