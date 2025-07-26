const fuelCost = require('../../public/js/fuel-cost.js');

describe('Total price', () => {
    test('Basic get total price test', () => {
        const totalPrice = fuelCost.getTotalPrice(373, 6, 2);
        expect(totalPrice).toBe(44.76);
    });

    test('Get total price as money (money format)', () => {
        const totalPrice = fuelCost.getTotalPrice(373, 6.987, 1.21);
        const priceAsMoney = fuelCost.formatAsMoneyFull(totalPrice, true);

        expect(priceAsMoney.moneyFormat).toBe("31.53");
    });

    test('Get total price as money (raw money format)', () => {
        const totalPrice = fuelCost.getTotalPrice(373, 6.987, 1.21);
        const priceAsMoney = fuelCost.formatAsMoneyFull(totalPrice, true);

        expect(priceAsMoney.rawMoney).toBe(31.53);
    });
});

describe('Average payment', () => {
    test('Get average payment', () => {
        const onAveragePayment = fuelCost.getAveragePayment(31.53, 2);
        expect(onAveragePayment).toBe(15.765);
        const formattedAvg = fuelCost.formatAsMoneyFull(onAveragePayment, true);

        expect(formattedAvg.moneyFormat).toBe('15.77');
        expect(formattedAvg.rawMoney).toBe(15.77);
    });

    test('Get passengers payment', () => {
        const totalPrice = fuelCost.getTotalPrice(373, 6.987, 1.21);
        const priceAsMoney = fuelCost.formatAsMoneyFull(totalPrice, true);
        const passengersPayment = fuelCost.getPassengersPayment(priceAsMoney.rawMoney, 2);

        expect(passengersPayment).toEqual(
            [
                { payment: '15.77', is_paying_more: true },
                { payment: '15.76', is_paying_more: false }
            ]
        )
    });
});