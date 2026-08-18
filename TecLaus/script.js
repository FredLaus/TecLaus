/* ENGINE PRINCIPAL DO JOGO TECLAUS - APENAS JAVASCRIPT PURO */
let progresso = {
    level: 1, isNMD: false, notaIndex: 0, ofensiva: 0, lenes: 50, vidas: 5, combo: 0,
    ultimoAcessoDia: "", totalProvasHoje: 0, totalDesafiosHoje: 0, aepAtivo: false
};

const listagemNotas = ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"];
let respostaCorretaAtual = 0;
let modoAtualAtivo = "";
let dicaAtual = "";
let idAbaRankingAtiva = 1;

function iniciarJogo() {
    document.getElementById("tela-splash").classList.add("oculto");
    document.getElementById("menu-principal").classList.remove("oculto");
    carregarDados();
}

function carregarDados() {
    const salvamento = localStorage.getItem("teclaus_v2_save");
    if (salvamento) {
        progresso = JSON.parse(salvamento);
    }
    atualizarEcossistema();
}

function salvarDados() {
    localStorage.setItem("teclaus_v2_save", JSON.stringify(progresso));
    atualizarEcossistema();
}

function atualizarEcossistema() {
    if (progresso.level > 1000) {
        progresso.isNMD = true;
        document.getElementById("hud-nmd").classList.remove("oculto");
    }
    
    if (progresso.level >= 150 && progresso.notaIndex >= 4) {
        progresso.aepAtivo = true;
        document.getElementById("tag-aep").classList.remove("oculto");
        document.getElementById("banner-aep-bloco").classList.remove("oculto");
    }

    document.getElementById("hud-level").innerText = progresso.level;
    document.getElementById("hud-nota").innerText = listagemNotas[progresso.notaIndex] || "C3";
    document.getElementById("hud-ofensiva").innerText = progresso.ofensiva;
    document.getElementById("hud-lenes").innerText = progresso.lenes;
    document.getElementById("hud-vidas").innerText = progresso.vidas;

    const body = document.body;
    const climaDiv = document.getElementById("clima");
    body.className = "";
    let moduloEstacao = Math.floor((progresso.level - 1) / 50) % 4;
    if (moduloEstacao === 0) { body.classList.add("verao"); climaDiv.innerHTML = "☀️"; }
    else if (moduloEstacao === 1) { body.classList.add("inverno"); climaDiv.innerHTML = "❄️"; }
    else if (moduloEstacao === 2) { body.classList.add("outono"); climaDiv.innerHTML = "🍁"; }
    else { body.classList.add("primavera"); climaDiv.innerHTML = "🌸"; }
}

function trocarMusicaSimulada() {
    const track = document.getElementById("select-musica").value;
    document.getElementById("status-musica").innerText = "▶️ Tocando: " + track;
}

function comprarDica() {
    if (progresso.lenes >= 30) {
        progresso.lenes -= 30;
        document.getElementById("bloco-dica-texto").innerText = dicaAtual || "Observe atentamente as regras de subtração.";
        document.getElementById("bloco-dica-texto").classList.remove("oculto");
        salvarDados();
    } else {
        alert("Moedas LENES insuficientes para comprar dica!");
    }
}

function manterOfensiva() {
    progresso.ofensiva++;
    alert("Ofensiva atualizada! Você manteve seu fogo ativo.");
    
    if (progresso.ofensiva % 100 === 0) {
        progresso.lenes += 1000;
        alert("🎉 META HISTÓRICA! 100 dias de ofensiva alcançados: +1000 LENES e 5 Skins adicionadas ao seu vestuário!");
    } else if (progresso.ofensiva % 10 === 0) {
        progresso.lenes += 100;
        alert("🔥 Ofensiva Lendária! 10 dias alcançados: Direito a realizar Super Prova concedido. +100 LENES e 1 Skin extra desbloqueada!");
    }
    salvarDados();
}

function abrirModo(modo) {
    modoAtualAtivo = modo;
    document.getElementById("menu-principal").classList.add("oculto");
    document.getElementById("tela-jogo").classList.remove("oculto");
    document.getElementById("bloco-dica-texto").classList.add("oculto");
    
    const esq = document.getElementById("jogo-explicacao");
    const dir = document.getElementById("jogo-problema");

    if (progresso.vidas <= 0 && modo !== "exercicios" && modo !== "tutorial") {
        esq.innerHTML = "<h3>⚠️ Vidas Esgotadas!</h3><p>Recupere energias executando o modo <b>Exercícios</b>.</p>";
        dir.innerHTML = "";
        return;
    }

    switch(modo) {
        case "tutorial":
            dicaAtual = "Apenas leia os guias de cada aba comercial.";
            esq.innerHTML = "<h3>📖 Tutorial e Regras de Negócio</h3><p>Para fechar o caixa: (Estoque Final - Estoque Inicial). Se o valor inicial for maior ou igual, zera. No fim adicione o montante líquido de moedas de troco.</p>";
            dir.innerHTML = "<p>Tutorial fixado. Retorne ao menu para iniciar os testes valendo moedas.</p>";
            break;
            
        case "caixas":
            let f2 = Math.floor(Math.random() * 5) + 5;
            let f3 = Math.floor(Math.random() * 10) + 10;
            let preco = 3;
            let troco = 40;
            respostaCorretaAtual = (f3 - f2) * preco + troco;
            dicaAtual = `Multiplique a diferença por ${preco} e adicione ${troco}.`;
            esq.innerHTML = `<h3>💰 Modo Fechamento Contábil</h3><p>Calcule o valor total geral considerando:<br>Estoque F2: ${f2}<br>Estoque F3: ${f3}<br>Preço Base: R$ ${preco},00<br>Troco F3: R$ ${troco},00</p>`;
            dir.innerHTML = `<input type='number' id='input-res' placeholder='Resultado Total'><br><button class='btn-acao' onclick='validarResposta()'>Submeter Caixa</button>`;
            break;

        case "achar_erro":
            let correto = 100;
            respostaCorretaAtual = 80;
            dicaAtual = "Subtraia 20 unidades do valor padrão exibido na nota fiscal.";
            esq.innerHTML = "<h3>🔍 Auditoria de Caixa (Achar o Erro)</h3><p>O operador fechou o caixa declarando R$ 100,00. Contudo, 2 maços de cigarro de R$ 10,00 sumiram da contagem física final.</p>";
            dir.innerHTML = `<p>Qual deveria ser o valor correto real deste balanço?</p><input type='number' id='input-res'><br><button class='btn-acao' onclick='validarResposta()'>Corrigir Operador</button>`;
            break;

        case "online":
            respostaCorretaAtual = 15;
            dicaAtual = "O oponente virtual responde em média em 4 segundos.";
            esq.innerHTML = "<h3>⚡ Confronto Sincronizado 1v1</h3><p>Oponente Localizado: <b>MathPro_Bot</b><br>Resolva a equação o mais rápido possível para garantir os LENES da aposta.</p>";
            dir.innerHTML = `<p>Calcule rapidamente: 5 + 5 + 5</p><input type='number' id='input-res'><br><button class='btn-acao' onclick='validarResposta()'>Bater Cronômetro</button>`;
            break;

        case "prova":
            respostaCorretaAtual = 50;
            dicaAtual = "Exames formais não permitem dicas completas. Resolva a soma direta.";
            esq.innerHTML = "<h3>📝 Exame de Certificação Acadêmica</h3><p>Esta prova definirá sua progressão de nota (A1 a C3). Conteúdo do dia liberado na aba informativa.</p>";
            dir.innerHTML = `<p>Questão Padrão: 25 + 25</p><input type='number' id='input-res'><br><button class='btn-acao' onclick='validarResposta()'>Entregar Exame</button>`;
            break;

        case "tabuada":
            let n1 = Math.floor(Math.random() * 8) + 2;
            let n2 = Math.floor(Math.random() * 8) + 2;
            respostaCorretaAtual = n1 * n2;
            dicaAtual = "Some o número por ele mesmo o total de vezes indicado.";
            esq.innerHTML = `<h3>✖️ Frações e Multiplicações</h3><p>Pratique a tabuada base corporativa para agilizar contagens.</p>`;
            dir.innerHTML = `<p>Quanto resulta ${n1} x ${n2}?</p><input type='number' id='input-res'><br><button class='btn-acao' onclick='validarResposta()'>Confirmar</button>`;
            break;

        case "exercicios":
            respostaCorretaAtual = 12;
            dicaAtual = "Modo de treino livre para ganho de corações.";
            esq.innerHTML = "<h3>🏋️ Ginásio Matemático</h3><p>Acerte a equação simples para reabastecer seus corações de vida.</p>";
            dir.innerHTML = `<p>Quanto é 6 + 6?</p><input type='number' id='input-res'><br><button class='btn-acao' onclick='validarResposta()'>Responder</button>`;
            break;

        case "desafio":
            respostaCorretaAtual = progresso.level * 2;
            dicaAtual = "O dobro do nível do seu perfil atual.";
            esq.innerHTML = `<h3>🏆 Avanço de Nível (Fase ${progresso.level})</h3><p>Vença para avançar de nível rumo ao topo NMD.</p>`;
            dir.innerHTML = `<p>Resolva: ${progresso.level} + ${progresso.level}</p><input type='number' id='input-res'><br><button class='btn-acao' onclick='validarResposta()'>Confirmar Mudança</button>`;
            break;

        case "olt":
            respostaCorretaAtual = 100;
            dicaAtual = "Grande prêmio da Olimpíada principal dos TecLaus.";
            esq.innerHTML = "<h3>Stadium OLT - Olimpíada Principal TecLaus</h3><p>Grandes exames competitivos liberados.</p>";
            dir.innerHTML = `<p>Resolva o enigma do Litro: 50 + 50</p><input type='number' id='input-res'><br><button class='btn-acao' onclick='validarResposta()'>Submeter na OLT</button>`;
            break;

        case "oaep":
            respostaCorretaAtual = 200;
            dicaAtual = "Exclusivo para Alunos Exemplares.";
            esq.innerHTML = "<h3>🌟 OAEP - Olimpíada dos Alunos Exemplares</h3><p>Ambiente de alta performance matemática.</p>";
            dir.innerHTML = `<p>Calcule o balanço premium: 100 + 100</p><input type='number' id='input-res'><br><button class='btn-acao' onclick='validarResposta()'>Submeter na OAEP</button>`;
            break;
    }
}

function validarResposta() {
    const valorInput = parseFloat(document.getElementById("input-res").value);
    
    if (valorInput === respostaCorretaAtual) {
        let ganho = 5;
        
        if (modoAtualAtivo === "exercicios") {
            if (progresso.vidas < 5) progresso.vidas++;
        } else if (modoAtualAtivo === "desafio") {
            progresso.level++;
            if (progresso.level % 50 === 0) {
