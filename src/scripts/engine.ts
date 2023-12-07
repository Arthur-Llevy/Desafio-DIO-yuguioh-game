interface IScore {
	playerScore: number,
	computerScore: number,
	scoreBox: HTMLSpanElement | null
};

interface ICardSprites {	
	avatar: HTMLImageElement | null;
	name: HTMLParagraphElement | null;
	type: HTMLParagraphElement | null;
};

interface IFieldCards {
	player: HTMLImageElement | null;
	computer: HTMLImageElement | null;
};

interface IPlayerSides {
	player: string;
	playerBOX: HTMLDivElement | null;
	computer: string;
	computerBOX: HTMLDivElement | null;
}

interface IActions {
	button: HTMLButtonElement | null;
};

interface IState {
	score: IScore;
	cardSprites: ICardSprites;
	fieldCards: IFieldCards;
	playerSides: IPlayerSides;
	actions: IActions;
};

interface ICardData {
	id: number;
	name: string;
	type: string;
	img: string;
	WinOf: number[];
	LoseOf: number[];
};

const playerSides: { player: string, computer: string } = {
	player: "player-cards",
	computer: "computer-cards"
};

const state: IState = {
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

const pathNames: string = "./src/assets/icons/";

const cardData: ICardData[] = [
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

async function playAudio(status: string): Promise<void> {
	const audio: HTMLAudioElement = new Audio();
	audio.src = `./src/assets/audios/${status}.wav`
	audio.play();
};

async function resetDuel() {
	if(state.cardSprites.avatar && state.actions.button && state.fieldCards.player && state.fieldCards.computer){
		state.cardSprites.avatar.src = "";
		state.actions.button.style.display = "none";

		state.fieldCards.player.style.display = "none";
		state.fieldCards.computer.style.display = "none";
		init();
	};
};

async function getRandomCardId(): Promise<number>  {
	const randomIndex = Math.floor(Math.random() * cardData.length);
	return cardData[randomIndex].id;
};

async function createCardImage(randomIdCard: number, fieldSide: string): Promise<HTMLImageElement> {
	const cardImage: HTMLImageElement = document.createElement('img');
	cardImage.setAttribute('height', '100px');
	cardImage.setAttribute('src', './src/assets/icons/card-back.png');
	cardImage.setAttribute('data-id', randomIdCard.toString());
	cardImage.classList.add('card');

	if(fieldSide === playerSides.player){
		cardImage.addEventListener('click', () => {
			setCardsField(Number(cardImage.getAttribute('data-id')));
		})

		cardImage.addEventListener('mouseover', () => {
			drawSelectCard(randomIdCard);
		});
	};

	return cardImage;

};

async function setCardsField(cardId: number) {
	await removeAllCardsImages();
	let computerCardId: number = await getRandomCardId();


	state.fieldCards.player!.style.display = 'block';
	state.fieldCards.computer!.style.display = 'block';

	await hiddenCardDetails();

	state.fieldCards.player!.src = cardData[Number(cardId)].img;
	state.fieldCards.computer!.src = cardData[Number(computerCardId)].img;

	let duelResults = await checkDuelResults(cardId, computerCardId);

	await updateScore();
	await drawButton(duelResults);

};

async function hiddenCardDetails(): Promise<void> {
	state.cardSprites.name!.innerText = "";
	state.cardSprites.type!.innerText = "";
	state.cardSprites.avatar!.src = "";
};

async function drawButton(text: string): Promise<void> {
	if(state.actions.button){
		state.actions.button.innerText = text;
		state.actions.button.style.display = 'block';
	};
};

async function updateScore() {	
	if(state.score.scoreBox){
		state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
	};
};

async function checkDuelResults(playerCardId: number, computerCardId: number): Promise<string> {
	let duelResults: string = "Empate";
	let playerCard: ICardData = cardData[playerCardId];

	if(playerCard.WinOf.includes(computerCardId)){
		duelResults = "Ganhou";
		state.score.playerScore++;
		playAudio("win");
	};

	if(playerCard.LoseOf.includes(computerCardId)){
		duelResults = "Perdeu";
		state.score.computerScore++;
		playAudio("lose");
	};

	return duelResults;

};

async function removeAllCardsImages() {
	let cards: HTMLDivElement | null = state.playerSides.computerBOX;
	if(cards){
		let imgElements: NodeListOf<HTMLImageElement> = cards.querySelectorAll("img");
		imgElements.forEach((img) => {
			img.remove()
		});
	};

	cards = state.playerSides.playerBOX;

	if(cards){
		let imgElements: NodeListOf<HTMLImageElement> = cards.querySelectorAll("img");
		imgElements.forEach((img) => {
			img.remove()
		});
	};

};

async function drawSelectCard(index: number): Promise<void> {
	if(state.cardSprites.avatar && state.cardSprites.name && state.cardSprites.type){
		state.cardSprites.avatar.src = cardData[index].img;
		state.cardSprites.name.innerText = cardData[index].name;
		state.cardSprites.type.innerText = `Attribute : ${cardData[index].type}`;
	};
};

async function drawCards(cardNumbers: number, fieldSide: string): Promise<void> {
	for(let i: number = 0; i < cardNumbers; i++){
		const randomIdCard = await getRandomCardId();
		const cardImage = await createCardImage(randomIdCard, fieldSide)
		const currentFieldSide = document.querySelector(`#${fieldSide}`);
		if(currentFieldSide){
			currentFieldSide.appendChild(cardImage);
		};
	};
};

const init = (): void => {
	state.fieldCards.player!.style.display = "none";
	state.fieldCards.computer!.style.display = "none";
	drawCards(5, playerSides.player);
	drawCards(5, playerSides.computer);

	const bgm: HTMLAudioElement | null = document.querySelector("#bgm");
	if(bgm){
		bgm.play();
	}
};

init();