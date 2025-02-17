const solAddress = '8seutMGHUWJVeV9EVKLcpQLnPyNiu5rn86Wujj5HUAbZ';
const requestUrl = `https://api.devnet.solana.com`;
const waitTime = 60000; // 60 seconds cooldown

async function requestFaucet() {
    document.getElementById("status").textContent = "Requesting SOL...";
    try {
        const response = await fetch(requestUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "jsonrpc": "2.0",
                "id": 1,
                "method": "requestAirdrop",
                "params": [
                    solAddress,
                    1000000000 // 1 SOL (in Lamports)
                ]
            })
        });

        const data = await response.json();
        if (data.error) {
            document.getElementById("status").textContent = `Error: ${data.error.message}`;
            document.getElementById("link").innerHTML = '';
        } else {
            document.getElementById("status").textContent = "Airdrop successful!";
            document.getElementById("link").innerHTML = `
                <a href="https://solscan.io/tx/${data.result}?cluster=devnet" target="_blank">
                    View Transaction on Solscan
                </a>`;
        }
    } catch (err) {
        document.getElementById("status").textContent = `Request failed: ${err.message}`;
    }
}

async function startLoop() {
    while (true) {
        await requestFaucet();
        let countdown = waitTime / 1000;
        document.getElementById("cooldown").textContent = `Cooldown: ${countdown} seconds`;
        
        while (countdown > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            countdown--;
            document.getElementById("cooldown").textContent = `Cooldown: ${countdown} seconds`;
        }
    }
}

startLoop();
