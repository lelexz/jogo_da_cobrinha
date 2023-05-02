const boardEl = document.querySelector(".board")
const pontuacaoEl = document.querySelector(".pontuacao")
const maiorPontuacaoEl = document.querySelector(".maior-pontuacao")
const controles = document.querySelectorAll(".controles i")

let vocePerdeu = false
let frutaX, frutaY; 
let cobraX = 5 , cobraY = 10;
let corpoCobra = [];
let velocidadeX = 0, velocidadeY = 0; 
let setIntervalId;
let pontuacao = 0;


let maiorPontuacao = localStorage.getItem("maior-pontuacao") || 0;
maiorPontuacaoEl.innerText = `Maior Pontuação: ${maiorPontuacao}`;

//valor aleátorio de 0 a 30 como posição da fruta
let mudarPosicaoFruta = () =>{
    frutaX = Math.floor(Math.random() * 30) + 1;
    frutaY = Math.floor(Math.random() * 30) + 1;
}

const avisoVocePerdeu = () =>{
    //recarregando a página ao fim do jogo
    clearInterval(setIntervalId)
    alert("Você perdeu! Aperte OK pra jogar de novo.")
    location.reload()
}

//mudando o valor da velocidade de acordo com a tecla pressionada
const mudarDirecao = (e) =>{
    if (e.key === "ArrowUp" && velocidadeY != 1){
        velocidadeX = 0
        velocidadeY = -1
    }else if (e.key === "ArrowDown" && velocidadeY != -1){
        velocidadeX = 0;
        velocidadeY = 1
    }else if (e.key === "ArrowLeft" && velocidadeX != 1){
        velocidadeX = -1;
        velocidadeY = 0
    }else if (e.key === "ArrowRight" && velocidadeX != -1){
        velocidadeX = 1;
        velocidadeY = 0
    }
}

controles.forEach(key => {
    key.addEventListener("click", () => mudarDirecao({key: key.dataset.key}))
})

const inicio = () =>{
    if(vocePerdeu) return avisoVocePerdeu();

    let htmlMarkup =  `<div class="fruta" style="grid-area: ${frutaY} / ${frutaX}"></div>`;

    //checando se a cobra comeu a fruta
    if(cobraX === frutaX && cobraY === frutaY){
        mudarPosicaoFruta();
        corpoCobra.push([frutaX, frutaY])
        pontuacao++; //aumenta a pontuação em um

        //definindo "maior pontuação" como o valor de "pontuação" se "pontuação" for maior que "maior pontuação"
        maiorPontuacao = pontuacao >= maiorPontuacao ? pontuacao : maiorPontuacao;

        //armazenando "maior pontuação" para o local storage com o nome "maior-pontuacao"
        localStorage.setItem("maior-pontuacao", maiorPontuacao)
        pontuacaoEl.innerText = `Pontuação: ${pontuacao}`;
        maiorPontuacaoEl.innerText = `Maior Pontuação: ${maiorPontuacao}`;
    }

    //adicionando o corpo da cobra
    for (let i = corpoCobra.length - 1; i > 0; i--) {
        corpoCobra[i] = corpoCobra[i - 1];
    }

    corpoCobra[0] = [cobraX, cobraY]

    //mudando a posição da cabeça de acordo com a velocidade 
    cobraX += velocidadeX;  
    cobraY += velocidadeY;

    //chegando se a cabeça da cobra tocou na borda, se sim, 'você perdeu' é se torna true 
    if (cobraX <= 0 || cobraX > 30 || cobraY <= 0 || cobraY > 30) {
        vocePerdeu = true
    }
    
    for (let i = 0; i < corpoCobra.length; i++) {
    //adicionando uma div pra cada parte do corpo da cobra
    htmlMarkup +=  `<div class="cabeca" style="grid-area: ${corpoCobra[i][1]} / ${corpoCobra[i][0]}"></div>`;

    //checando se a cobra acerta o corpo, se sim, "você perdeu" se torna true
        if(i !== 0 && corpoCobra[0][1] === corpoCobra[i][1] && corpoCobra[0][0] === corpoCobra[i][0]){
            vocePerdeu = true;
        }
    }
    boardEl.innerHTML = htmlMarkup;
}

mudarPosicaoFruta();
setIntervalId = setInterval(inicio, 125) //velocidade da cobrinha;

document.addEventListener("keydown", mudarDirecao);