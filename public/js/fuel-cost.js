function hasInvalidFields(inputs) {
    const hasValidationFields = document.querySelectorAll('.has-validation');
    let hasError = false;

    for (const hasValidF of hasValidationFields) {
        const validateField = hasValidF.querySelector('input');
        for (const inputToValidate of inputs) {
            let errorInCurrInput = false;
            if (validateField.id != inputToValidate.id) {
                continue;
            }
            if (inputToValidate.value == null) {
                inputToValidate.value = validateField.value;
            }
            const errorElem = document.getElementById(`error-${inputToValidate.id}`);
            if (inputToValidate.isRequired && (inputToValidate.value == null || inputToValidate.value == '')) {
                errorElem.innerHTML = 'This field is required';
                errorInCurrInput = true;
            }
            if (validateField.type == 'number') {
                if (isNaN(inputToValidate.value)) {
                    errorInCurrInput = true;
                    errorElem.innerHTML = 'Should be a number';
                }
                else if (inputToValidate.minConstraint != null && inputToValidate.value < inputToValidate.minConstraint) {
                    errorInCurrInput = true;
                    errorElem.innerHTML = `This field should be > ${inputToValidate.minConstraint}`;
                }
                else if (inputToValidate.maxConstraint != null && inputToValidate.value > inputToValidate.maxConstraint) {
                    errorInCurrInput = true;
                    errorElem.innerHTML = `This field should be < ${inputToValidate.maxConstraint}`;
                }
            }
            if (errorInCurrInput) {
                errorElem.classList.remove('d-none');
                hasError = true;
            }
            else {
                errorElem.classList.add('d-none');
            }
        }
    }
    return hasError;
}
function calculateFuelCost(e, isLoaded) {
    e.preventDefault();
    const paymentSchema = document.getElementById('payment-schema');
    paymentSchema.classList.add('inactive-payment-schema');

    const pricePerLitre = document.getElementById('price-per-litre').value;
    const distancePassed = document.getElementById('distance-passed').value;
    const consumption = document.getElementById('consumption').value;
    const passengersNumber = document.getElementById('passengers-number').value;

    const validationInputs = [
        {
            id: 'price-per-litre',
            isRequired: true,
            value: pricePerLitre,
            minConstraint: 0,
        },
        {
            id : 'distance-passed',
            isRequired: true,
            minConstraint: 0,
        },
        {
            id : 'consumption',
            isRequired: true,
            minConstraint: 0,
        },
        {
            id : 'passengers-number',
            isRequired: true,
            minConstraint: 0,
            maxConstraint: 100,
        },
    ];
    if (hasInvalidFields(validationInputs)) {
        return;
    }

    const totalPrice = getTotalPrice(distancePassed, consumption, pricePerLitre);
    let priceAsMoney = formatAsMoneyFull(totalPrice, true);
    const onAveragePayment = getAveragePayment(priceAsMoney.rawMoney, passengersNumber);
    const avg = formatAsMoneyFull(onAveragePayment, true);
    
    showFuelCostData({ priceAsMoney: priceAsMoney, passengersNumber: passengersNumber, paymentSchema: paymentSchema });
    if (!isLoaded) {
        saveToHistory({ 
            pricePerLitre: pricePerLitre, 
            distancePassed: distancePassed, 
            consumption: consumption, 
            passengersNumber: passengersNumber,
            fuelUsed: document.getElementById('fuel-used').value,
            finalResult: priceAsMoney,
            onAveragePrice: avg,
        });

        renderHistory();
    }
}

function showFuelCostData(params) {
    document.getElementById('label-final-result').classList.remove('d-none');
    document.getElementById('final-result').value = params.priceAsMoney.moneyFormat;

    const onAveragePayment = params.onAveragePrice != null ? params.onAveragePrice.rawMoney : getAveragePayment(params.priceAsMoney.rawMoney, params.passengersNumber);
    const formattedAvg = params.onAveragePrice != null ? params.onAveragePrice.moneyFormat : formatAsMoneyFull(onAveragePayment, true).moneyFormat;
    document.getElementById('on-average').classList.remove('d-none');
    document.getElementById('on-average-price').innerHTML = `<span class="currency-symbol">$</span>${formattedAvg}`;

    const passengersPayment = getPassengersPayment(params.priceAsMoney.rawMoney, params.passengersNumber);
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
    params.paymentSchema.classList.remove('inactive-payment-schema');
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

    const validationInputs = [
        {
            id: 'fuel-used',
            isRequired: true,
            value: fuelUsed,
            minConstraint: 0,
        },
        {
            id : 'cons-distance-passed',
            isRequired: true,
            value: distancePassed,
            minConstraint: 0,
        },
    ];

    if (hasInvalidFields(validationInputs)) {
        return;
    }
    console.log("fuel", fuelUsed, "distance", distancePassed);
    const consumption = (fuelUsed / distancePassed) * 100;
    console.log(consumption);
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

function saveToHistory(params) {
    //TODO Add login logic
    //NOTE for now we store only in local storage

    const fuelCostInputs = {
        pricePerLitre: {
            id: 'price-per-litre',
            value: params.pricePerLitre,
        },
        distancePassed: {
            id : 'distance-passed',
            value: params.distancePassed,
        },
        consumption: {
            id : 'consumption',
            value: params.consumption,
        },
        passengersNumber: {
            id : 'passengers-number',
            value: params.passengersNumber,
        },
        fuelUsed: {
            id: 'fuel-used',
            value: params.fuelUsed,
        },
        finalResult: {
            id: 'final-result',
            value: params.finalResult.moneyFormat,
            hValue: params.finalResult,
        },
        onAveragePrice: {
            id: 'on-average-price',
            value: params.onAveragePrice.moneyFormat,
            hValue: params.onAveragePrice,
        }
    };
    //TODO receive data from backend for logged in users
    let fuelCosts = localStorage.getItem('fuelCostsHistory');
    try {
        fuelCosts = JSON.parse(fuelCosts) ?? [];
    } catch (e) {
        console.error(e);
        fuelCosts = [];
    }
    fuelCosts.push(fuelCostInputs);
    if (fuelCosts.length > 10) { //NOTE Hardcoded limit, must change it probably
        fuelCosts.shift();
    }
    localStorage.setItem('fuelCostsHistory', JSON.stringify(fuelCosts));
}

function renderHistory(device) {
    const historyList = document.getElementById(`${device ?? ''}history-list`);

    if (!historyList) return;

    let fuelCosts = localStorage.getItem('fuelCostsHistory');
    try {
        fuelCosts = JSON.parse(fuelCosts) ?? [];
    } catch (e) {
        fuelCosts = [];
    }

    historyList.innerHTML = ''; // Clear old list

    fuelCosts.reverse().forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center history-element';

        const label = `Trip: ${item.distancePassed.value}km, $${item.finalResult.value}`;
        li.textContent = label;

        const loadBtn = document.createElement('button');
        loadBtn.className = 'btn btn-sm btn-outline-primary';
        loadBtn.textContent = 'Load';
        loadBtn.onclick = () => loadHistory(fuelCosts.length - 1 - index);

        li.appendChild(loadBtn);

        // const removeBtn = document.createElement('button');
        // removeBtn.className = 'btn btn-sm btn-outline-danger';
        // removeBtn.textContent = 'X';

        // li.appendChild(removeBtn);
        
        historyList.appendChild(li);
    });
    if (fuelCosts.length > 0) {
        const clearHistoryBtn = document.createElement('button');
        clearHistoryBtn.className = 'btn btn-sm btn-secondary mt-2';
        clearHistoryBtn.textContent = 'Clear History';
        clearHistoryBtn.onclick = () => clearHistory(device);
        historyList.appendChild(clearHistoryBtn);
    }
}


function loadHistory(index) {
    let fuelCosts = localStorage.getItem('fuelCostsHistory');
    try {
        fuelCosts = JSON.parse(fuelCosts);
    } catch (e) {
        console.error(e);
        return;
    }

    const data = fuelCosts[index];
    if (!data) return;

    for (const key in data) {
        const el = document.getElementById(data[key].id);
        if (el) el.value = data[key].value;
    }

    calculateFuelCost(new Event('submit'), true);
}

function clearHistory(device, index) {
    if (!index) {
        localStorage.removeItem('fuelCostsHistory');
        renderHistory(device);
        return;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('show-history-btn');
    const sidebar = document.getElementById('history-sidebar');
    if (btn && sidebar) {
        btn.addEventListener('click', () => {
            sidebar.classList.toggle('d-none');
        });
    }

    renderHistory(); // show history items
});

function showHistoryMobile() {
    const container = document.getElementById('mobile-history-sidebar');
    const list = document.getElementById('mobile-history-list');

    // Clear previous items
    list.innerHTML = '';

    renderHistory('mobile-');

    // Show the container
    container.classList.toggle('d-none');
}


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
        getTotalPrice,
        getAveragePayment,
        formatAsMoneyFull,
        getPassengersPayment
    };
}