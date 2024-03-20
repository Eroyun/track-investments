const currencies = ["USD", "TRY", "EUR", "GBP"];
const markets = ["NASDAQ", "BIST", "CRYPTO", "OTHER"];

const formatNumberAsCurrency = (value, currency = "USD", locale = "tr-TR") => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

module.exports = { currencies, markets, formatNumberAsCurrency };
