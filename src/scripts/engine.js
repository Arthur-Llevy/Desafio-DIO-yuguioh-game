"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
;
;
;
;
;
;
const playerSides = {
    player: "player-cards",
    computer: "computer-cards"
};
const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.querySelector('#score-points')
    },
    cardSprites: {
        avatar: document.querySelector("#card-image"),
        name: document.querySelector("#card-name"),
        type: document.querySelector("#card-type")
    },
    fieldCards: {
        player: document.querySelector("#player-field-card"),
        computer: document.querySelector("#computer-field-card"),
    },
    playerSides: {
        player: "player-cards",
        playerBOX: document.querySelector('.card-box.framed#player-cards'),
        computer: "computer-cards",
        computerBOX: document.querySelector('.card-box.framed#computer-cards')
    },
    actions: {
        button: document.querySelector("#next-duel")
    }
};
const pathNames = "./src/assets/icons/";
const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathNames}dragon.png`,
        WinOf: [1],
        LoseOf: [2]
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathNames}magician.png`,
        WinOf: [2],
        LoseOf: [0]
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathNames}exodia.png`,
        WinOf: [0],
        LoseOf: [1]
    }
];
function playAudio(status) {
    return __awaiter(this, void 0, void 0, function* () {
        const audio = new Audio();
        audio.src = `./src/assets/audios/${status}.wav`;
        audio.play();
    });
}
;
function resetDuel() {
    return __awaiter(this, void 0, void 0, function* () {
        if (state.cardSprites.avatar && state.actions.button && state.fieldCards.player && state.fieldCards.computer) {
            state.cardSprites.avatar.src = "";
            state.actions.button.style.display = "none";
            state.fieldCards.player.style.display = "none";
            state.fieldCards.computer.style.display = "none";
            init();
        }
        ;
    });
}
;
function getRandomCardId() {
    return __awaiter(this, void 0, void 0, function* () {
        const randomIndex = Math.floor(Math.random() * cardData.length);
        return cardData[randomIndex].id;
    });
}
;
function createCardImage(randomIdCard, fieldSide) {
    return __awaiter(this, void 0, void 0, function* () {
        const cardImage = document.createElement('img');
        cardImage.setAttribute('height', '100px');
        cardImage.setAttribute('src', './src/assets/icons/card-back.png');
        cardImage.setAttribute('data-id', randomIdCard.toString());
        cardImage.classList.add('card');
        if (fieldSide === playerSides.player) {
            cardImage.addEventListener('click', () => {
                setCardsField(Number(cardImage.getAttribute('data-id')));
            });
            cardImage.addEventListener('mouseover', () => {
                drawSelectCard(randomIdCard);
            });
        }
        ;
        return cardImage;
    });
}
;
function setCardsField(cardId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield removeAllCardsImages();
        let computerCardId = yield getRandomCardId();
        state.fieldCards.player.style.display = 'block';
        state.fieldCards.computer.style.display = 'block';
        yield hiddenCardDetails();
        state.fieldCards.player.src = cardData[Number(cardId)].img;
        state.fieldCards.computer.src = cardData[Number(computerCardId)].img;
        let duelResults = yield checkDuelResults(cardId, computerCardId);
        yield updateScore();
        yield drawButton(duelResults);
    });
}
;
function hiddenCardDetails() {
    return __awaiter(this, void 0, void 0, function* () {
        state.cardSprites.name.innerText = "";
        state.cardSprites.type.innerText = "";
        state.cardSprites.avatar.src = "";
    });
}
;
function drawButton(text) {
    return __awaiter(this, void 0, void 0, function* () {
        if (state.actions.button) {
            state.actions.button.innerText = text;
            state.actions.button.style.display = 'block';
        }
        ;
    });
}
;
function updateScore() {
    return __awaiter(this, void 0, void 0, function* () {
        if (state.score.scoreBox) {
            state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
        }
        ;
    });
}
;
function checkDuelResults(playerCardId, computerCardId) {
    return __awaiter(this, void 0, void 0, function* () {
        let duelResults = "Empate";
        let playerCard = cardData[playerCardId];
        if (playerCard.WinOf.includes(computerCardId)) {
            duelResults = "Ganhou";
            state.score.playerScore++;
            playAudio("win");
        }
        ;
        if (playerCard.LoseOf.includes(computerCardId)) {
            duelResults = "Perdeu";
            state.score.computerScore++;
            playAudio("lose");
        }
        ;
        return duelResults;
    });
}
;
function removeAllCardsImages() {
    return __awaiter(this, void 0, void 0, function* () {
        let cards = state.playerSides.computerBOX;
        if (cards) {
            let imgElements = cards.querySelectorAll("img");
            imgElements.forEach((img) => {
                img.remove();
            });
        }
        ;
        cards = state.playerSides.playerBOX;
        if (cards) {
            let imgElements = cards.querySelectorAll("img");
            imgElements.forEach((img) => {
                img.remove();
            });
        }
        ;
    });
}
;
function drawSelectCard(index) {
    return __awaiter(this, void 0, void 0, function* () {
        if (state.cardSprites.avatar && state.cardSprites.name && state.cardSprites.type) {
            state.cardSprites.avatar.src = cardData[index].img;
            state.cardSprites.name.innerText = cardData[index].name;
            state.cardSprites.type.innerText = `Attribute : ${cardData[index].type}`;
        }
        ;
    });
}
;
function drawCards(cardNumbers, fieldSide) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < cardNumbers; i++) {
            const randomIdCard = yield getRandomCardId();
            const cardImage = yield createCardImage(randomIdCard, fieldSide);
            const currentFieldSide = document.querySelector(`#${fieldSide}`);
            if (currentFieldSide) {
                currentFieldSide.appendChild(cardImage);
            }
            ;
        }
        ;
    });
}
;
const init = () => {
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";
    drawCards(5, playerSides.player);
    drawCards(5, playerSides.computer);
    const bgm = document.querySelector("#bgm");
    if (bgm) {
        bgm.play();
    }
};
init();
