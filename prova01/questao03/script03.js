const somaDiv = document.getElementById('soma-div');
const divText = document.getElementById('text-div')

somaDiv.addEventListener('click', () => {
    const numeroA = parseFloat(prompt('Digite um número'));
    const numeroB = parseFloat(prompt('Digite outro número'));

    if (!isNaN(numeroA) && !isNaN(numeroB)) {
        const resultado = numeroA + numeroB;
        divText.textContent = `A soma entre ${numeroA} e ${numeroB} é ${resultado}`;
    } else {
        divText.textContent = 'Por favor, insira números válidos.';
    }
});

