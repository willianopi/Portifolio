const canvas = document.getElementById('roleta');
const ctx = canvas.getContext('2d');
const form = document.getElementById('opcao-form');
const novaOpcaoInput = document.getElementById('nova-opcao');
const girarBtn = document.getElementById('girar');
const limparBtn = document.getElementById('limpar');

let opcoes = [];
let anguloAtual = 0;
let girando = false;

const cores = ['#FFDD57', '#57A0FF', '#FF5757', '#57FF57', '#A057FF', '#FFA057'];

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const novaOpcao = novaOpcaoInput.value.trim();
    if (novaOpcao) {
        opcoes.push(novaOpcao);
        novaOpcaoInput.value = '';
        desenharRoleta();
    }
});

girarBtn.addEventListener('click', () => {
    if (opcoes.length > 0 && !girando) {
        girando = true;
        const anguloDestino = Math.random() * 2 * Math.PI + 4 * Math.PI; // Gira ao menos duas voltas completas
        const duracao = 3000; // 3 segundos
        const inicio = performance.now();

        function girar(timestamp) {
            const progresso = timestamp - inicio;
            anguloAtual = (progresso / duracao) * anguloDestino;
            desenharRoleta();
            if (progresso < duracao) {
                requestAnimationFrame(girar);
            } else {
                girando = false;
                const anguloFinal = anguloAtual % (2 * Math.PI);
                const indice = Math.floor((anguloFinal / (2 * Math.PI)) * opcoes.length);
                alert(`Opção sorteada: ${opcoes[indice]}`);
            }
        }

        requestAnimationFrame(girar);
    }
});

limparBtn.addEventListener('click', () => {
    opcoes = [];
    desenharRoleta();
});

function desenharRoleta() {
    const raio = canvas.width / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (opcoes.length === 0) {
        ctx.font = "20px Arial";
        ctx.fillStyle = "#000";
        ctx.fillText("Adicione opções para começar", canvas.width / 2 - 120, canvas.height / 2);
        return;
    }
    opcoes.forEach((opcao, i) => {
        const anguloInicio = (i / opcoes.length) * 2 * Math.PI + anguloAtual;
        const anguloFim = ((i + 1) / opcoes.length) * 2 * Math.PI + anguloAtual;
        ctx.beginPath();
        ctx.moveTo(raio, raio);
        ctx.arc(raio, raio, raio, anguloInicio, anguloFim);
        ctx.fillStyle = cores[i % cores.length]; // Cicla através das cores
        ctx.fill();
        ctx.stroke();
        ctx.save();
        ctx.translate(raio, raio);
        ctx.rotate((anguloInicio + anguloFim) / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#000";
        ctx.font = "16px Arial";
        ctx.fillText(opcao, raio - 10, 5);
        ctx.restore();
    });
}

desenharRoleta();
