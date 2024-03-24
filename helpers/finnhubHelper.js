import { ApiClient, DefaultApi } from "finnhub";

class FinnHub {
  constructor() {
    const api_key = ApiClient.instance.authentications["api_key"];
    api_key.apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
    this.finnhubClient = new DefaultApi();
  }

  async getStockData(stock) {
    return new Promise((resolve, reject) => {
      this.finnhubClient.quote(stock, (error, data, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  }
}

export const useFinnhub = () => {
  const finnhub = new FinnHub();

  const getStockData = async (stock) => {
    return await finnhub.getStockData(stock);
  };

  return { getStockData };
};
