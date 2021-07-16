export default () => {
	
const priceInBananoElement = document.querySelector('input[name="banano_price"]');
const priceInVesElement = document.querySelector('input[name="ves_price"]');
const priceInUsdElement = document.querySelector('input[name="usd_price"]');

const Banano = 'BANANO';
const Ves = 'VES';
const Usd = 'USD';

let bananoToUsdPrice = 0;
let vesToUsdPrice = 0;

priceInBananoElement.addEventListener('input', e => updateValue(Banano, e.target.value));
priceInVesElement.addEventListener('input', e => updateValue(Ves, e.target.value));
priceInUsdElement.addEventListener('input', e => updateValue(Usd, e.target.value));

priceInBananoElement.addEventListener('blur', e => resetValues(e));
priceInVesElement.addEventListener('blur', e => resetValues(e));
priceInUsdElement.addEventListener('blur', e => resetValues(e));

const getNanoPrice = async newValue => {
	const url = 'https://api.coingecko.com/api/v3/simple/price?ids=banano&vs_currencies=usd';
	try{
		const res = await fetch(url);
		const data = await res.json();
		bananoToUsdPrice = data.banano.usd;
		priceInBananoElement.value = 1;
		updateValue(Banano, priceInBananoElement.value);
		checkData();
	} catch (e){
		console.log(e);
	}
}
const getVesPrice = async newValue => {
	const url = 'https://s3.amazonaws.com/dolartoday/data.json';
	try{
		const res = await fetch(url);
		const data = await res.json();
		vesToUsdPrice = data.USD.dolartoday;
		priceInBananoElement.value = 1;
		updateValue(Banano, priceInBananoElement.value);
		checkData();
	} catch (e){
		console.log(e);
	}
}

const updateValue = (currency, value) => {

	const parsedValue = value === '' ? 1 : parseFloat(value);

	if(currency === Banano){
		priceInVesElement.value =  (parsedValue * bananoToUsdPrice * vesToUsdPrice).toFixed(2);
		priceInUsdElement.value = (parsedValue * bananoToUsdPrice).toFixed(2);

	} else if(currency === Ves){
		priceInBananoElement.value = (parsedValue / (bananoToUsdPrice * vesToUsdPrice)).toFixed(2);
		priceInUsdElement.value = (parsedValue / vesToUsdPrice).toFixed(2);

	} else if(currency === Usd){
		 priceInBananoElement.value = (parsedValue / bananoToUsdPrice).toFixed(2);
		 priceInVesElement.value = (parsedValue * vesToUsdPrice).toFixed(2);
	}
}
const resetValues = e => {
	if (e.target.value === '' || parseFloat(e.target.value) === 0) {
		priceInBananoElement.value = 1;
		updateValue(Nano, 1);
	};
}

const checkData = () => {
	if (bananoToUsdPrice !== 0 && vesToUsdPrice !== 0) {
		setTimeout(() => {
			document.querySelector('.card').classList.toggle('animation');
			document.querySelector('.card .card__loader').classList.toggle('card__loader--loading');
			setTimeout(() => {
				document.querySelector('.card .card__loader').style.display = 'none';
			}, 500);
		}, 500);
	}
}

getNanoPrice();
getVesPrice();
}