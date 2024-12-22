function calculateFuelCost(e) {
    e.preventDefault();
    const pricePerLitre = document.getElementById('price-per-litre').value;
    const distancePassed = document.getElementById('distance-passed').value;
    const consumption = document.getElementById('consumption').value;
    const passengersNumber = document.getElementById('passengers-number').value;

    const totalPrice = (distancePassed / 100) * consumption * pricePerLitre
    let priceAsMoney = formatAsMoneyFull(totalPrice, true);
    document.getElementById('label-final-result').classList.remove('d-none');
    document.getElementById('final-result').value = priceAsMoney;

    const onAveragePayment = priceAsMoney / passengersNumber;
    document.getElementById('on-average').classList.remove('d-none');
    document.getElementById('on-average-price').innerHTML = onAveragePayment;

    const passengersPayment = getPassengersPayment(priceAsMoney, passengersNumber);
    const hasToPay = document.getElementById('has-to-pay-container');
    hasToPay.innerHTML = '';
    for (const pass of passengersPayment) {
        console.lo
        let imgName = 'smile.svg';
        if (pass.is_paying_more) {
            imgName = 'sad.svg'
        }
        hasToPay.innerHTML += `
                <div class="image-wrapper m-2">
                    <img class="result-img" src="img/${imgName}">
                    <p class="has-to-pay">${pass.payment}</p>
                </div>`;
    }
    document.getElementById('payment-schema').classList.remove('inactive-payment-schema');
}

function getPassengersPayment(totalPrice, passengersNumber) {
    const divPrice = totalPrice / passengersNumber;
    const fixedDivPrice = formatAsMoneyFull((Math.floor(Number(divPrice) * 100) / 100), true);
    let remainerAfterSubtract = Math.floor(Number((totalPrice - (fixedDivPrice * passengersNumber))) * 100);
    if (remainerAfterSubtract > passengersNumber) {
        console.error("Problem", passengersNumber, remainerAfterSubtract);
    }
    const passPayment = [];
    for (let i = 0; i < passengersNumber; i++) {
        let payingSum = fixedDivPrice * 100;
        let is_paying_more = false;
        if (remainerAfterSubtract > 0) {
            payingSum += 1;
            is_paying_more = true;
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
    if (isNaN(num))
        num = "0";
    sign = (num == (num = Math.abs(num)));
    cents = '';
    if (hascents) {
        num = Math.floor(num * 100 + 0.50000000001);
        cents = num % 100;
        num = Math.floor(num / 100).toString();
        if (cents < 10)
            cents = "0" + cents;
        cents = "." + cents;
    } else {
        num = Math.floor(num + 0.50000000001).toString();
    }
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
        num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
    return Number(((sign) ? '' : '-') + num + cents);
}