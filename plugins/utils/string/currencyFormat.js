
function currencyFormat(value) {
    let number = +(Math.round(value + "e+3")  + "e-3");
    // return (parseFloat(value)).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$&,')
    return (parseFloat(number)).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$&,')
}

export default currencyFormat
