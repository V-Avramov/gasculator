function calculateFuelCost(e) {
    e.preventDefault();
    const pricePerLitre = document.getElementById('price-per-litre').value;
    const distancePassed = document.getElementById('distance-passed').value;
    const consumption = document.getElementById('consumption').value;
    const passengersNumber = document.getElementById('passengers-number').value;

    if (
        isNaN(pricePerLitre) ||
        isNaN(distancePassed) ||
        isNaN(consumption) ||
        isNaN(passengersNumber) ||
        passengersNumber <= 0
    ) {
        alert("Please fill out all fields with valid numbers.");
        return;
    }

    const totalPrice = getTotalPrice(distancePassed, consumption, pricePerLitre);
    let priceAsMoney = formatAsMoneyFull(totalPrice, true);
    
    document.getElementById('label-final-result').classList.remove('d-none');
    document.getElementById('final-result').value = priceAsMoney.moneyFormat;

    const onAveragePayment = getAveragePayment(priceAsMoney.rawMoney, passengersNumber);
    const formattedAvg = formatAsMoneyFull(onAveragePayment, true).moneyFormat;
    document.getElementById('on-average').classList.remove('d-none');
    document.getElementById('on-average-price').innerHTML = `<span class="currency-symbol">$</span>${formattedAvg}`;

    const passengersPayment = getPassengersPayment(priceAsMoney.rawMoney, passengersNumber);
    const hasToPay = document.getElementById('has-to-pay-container');
    hasToPay.innerHTML = '';
    for (const pass of passengersPayment) {
        let imgName = 'smile.svg';
        if (pass.is_paying_more) {
            imgName = 'sad.svg'
        }
        hasToPay.innerHTML += `
                <div class="image-wrapper m-2">
                    <img class="result-img dark-mode-inv-img" src="img/${imgName}">
                    <p class="has-to-pay"><span class="currency-symbol">$</span>${pass.payment}</p>
                </div>`;
    }
    document.getElementById('payment-schema').classList.remove('inactive-payment-schema');
}

function getTotalPrice(distancePassed, consumption, pricePerLitre) {
    if (
        isNaN(pricePerLitre) ||
        isNaN(distancePassed) ||
        isNaN(consumption)
    ) {
        throw new Error("Incorrect input data");
    }
    return (distancePassed / 100) * consumption * pricePerLitre;
}

function getAveragePayment(rawMoney, passengersNumber) {
    if (isNaN(rawMoney)
        || isNaN(passengersNumber)
        || passengersNumber <= 0
    ) {
        throw new Error("Incorrect input data");
    }
    return rawMoney / passengersNumber;
}

function getPassengersPayment(totalPrice, passengersNumber) {
    const divPrice = totalPrice / passengersNumber;
    const fixedDivPrice = formatAsMoneyFull((Math.floor(Number(divPrice) * 100) / 100), true).rawMoney;
    let remainerAfterSubtract = Number((totalPrice - (fixedDivPrice * passengersNumber))) * 100;
    remainerAfterSubtract = Number(remainerAfterSubtract.toFixed(2));
    let isRemainderSameAsPassengersNumber = false;
    if (remainerAfterSubtract > passengersNumber) {
        console.error("Problem", passengersNumber, remainerAfterSubtract);
    }
    else if (remainerAfterSubtract == passengersNumber) {
        isRemainderSameAsPassengersNumber = true;
    }
    const passPayment = [];
    for (let i = 0; i < passengersNumber; i++) {
        let payingSum = fixedDivPrice * 100;
        let is_paying_more = false;
        if (remainerAfterSubtract > 0) {
            payingSum += 1;
            if (!isRemainderSameAsPassengersNumber) {
                is_paying_more = true;
            }
            remainerAfterSubtract--;
        }
        payingSum = (payingSum / 100).toFixed(2);
        passPayment.push({ payment: payingSum, is_paying_more: is_paying_more});
    }
    return passPayment;
}
//getPassengersPayment(31.53, 2)

function getConsumption() {
    const fuelUsed = document.getElementById('fuel-used').value;
    const distancePassed = document.getElementById('cons-distance-passed').value;

    const consumption = (fuelUsed / distancePassed) * 100;
    document.getElementById('consumption-result').value = consumption;
    document.getElementById('consumption').value = consumption;
}

function modifyDistancePassed() {
    document.getElementById('cons-distance-passed').value = document.getElementById('distance-passed').value;
}

function formatAsMoneyFull(num, hascents) {
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num)) num = "0";

    const sign = Number(num) >= 0;
    let cents = '';
    
    if (hascents) {
        num = Math.floor(num * 100 + 0.50000000001);
        cents = num % 100;
        num = Math.floor(num / 100).toString();
        if (cents < 10) cents = "0" + cents;
        cents = "." + cents;
    } else {
        num = Math.floor(num + 0.50000000001).toString();
    }

    const rawMoney = Number(num.replace(/,/g, '') + cents);

    for (let i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
        num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
    }

    return {
        moneyFormat: (sign ? '' : '-') + num + cents,
        rawMoney: rawMoney
    };
}

module.exports = { getTotalPrice, getAveragePayment, formatAsMoneyFull, getPassengersPayment }