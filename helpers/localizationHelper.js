const currencies = ["USD", "TRY", "EUR", "GBP"];
const markets = ["NASDAQ", "BIST", "CRYPTO", "OTHER"];

const formatNumberAsCurrency = (value, currency = "USD", locale = "tr-TR") => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

const revertCurrencyFormat = (
  formattedValue,
  currency = "USD",
  locale = "tr-TR"
) => {
  //Check if the value only contains numbers, dot and comma
  if (/^[0-9.,]+$/.test(formattedValue)) {
    return parseFloat(formattedValue);
  }

  const separatorDecimal = new Intl.NumberFormat(locale, {
    style: "decimal",
  })
    .format(11.11)
    .replace(/\d/g, "");

  const separatorThousands = new Intl.NumberFormat(locale, {
    style: "decimal",
  })
    .format(1111)
    .replace(/\d/g, "");

  const symbolOnLeft = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  })
    .format(1)
    .replace(
      new RegExp(`\\d|[${separatorDecimal}${separatorThousands}]*`, "g"),
      ""
    );

  const stringNumber = formattedValue
    .replace(new RegExp(`[${separatorThousands}]`, "g"), "")
    .replace(separatorDecimal, ".")
    .replace(new RegExp(`[${symbolOnLeft}]`, "g"), "");

  return parseFloat(stringNumber);
};

module.exports = {
  currencies,
  markets,
  formatNumberAsCurrency,
  revertCurrencyFormat,
};
