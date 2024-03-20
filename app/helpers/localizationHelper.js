const currencies = ["TRY", "USD", "EUR", "GBP"];

const formatNumberAsCurrency = (value, currency = "USD", locale = "tr-TR") => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

module.exports = { currencies, formatNumberAsCurrency };
