function runPhase1() {
    const counterBox = document.getElementById('counterBox');
    counterBox.innerHTML = '';
    for (let i = 1; i <= 10; i++) {
        setTimeout(() => {
            const num = document.createElement('div');
            num.textContent = `Count: ${i}`;
            counterBox.appendChild(num);
        }, i * 500);
    }
}

function runPhase2() {
    const sumBox = document.getElementById('sumBox');
    sumBox.innerHTML = '';
    let total = 0;
    let delay = 0;

    while (total <= 30) {
        const rand = Math.floor(Math.random() * 10) + 1;
        total += rand;

        setTimeout(() => {
            const line = document.createElement('div');
            line.textContent = `Added: ${rand} → Total: ${total}`;
            sumBox.appendChild(line);
        }, delay);

        delay += 700;
    }
}

function runPhase3() {
    const colorBox = document.getElementById('colorBox');
    colorBox.textContent = 'Starting...';
    colorBox.style.backgroundColor = '#f0f4f8';

    const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
    colors.forEach((color, index) => {
        setTimeout(() => {
            colorBox.textContent = color.toUpperCase();
            colorBox.style.backgroundColor = color;
        }, index * 800);
    });
}

// Initial run
runPhase1();
runPhase2();
runPhase3();

// Restart button
document.getElementById('restartBtn').addEventListener('click', () => {
    runPhase1();
    runPhase2();
    runPhase3();
});

