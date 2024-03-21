export async function POST(request) {
  try {
    const {
      stock,
      stock_quantity,
      currency,
      stock_price,
      total_cost,
      market,
      transaction_type,
    } = request.body;
    let res;
    if (transaction_type === "buy") {
      res = await sql`
                INSERT INTO holdings (
                    stock,
                    stock_quantity,
                    currency,
                    stock_price,
                    total_cost,
                    market,
                    sold
                ) VALUES (
                    ${stock},
                    ${stock_quantity},
                    ${currency},
                    ${stock_price},
                    ${total_cost},
                    ${market},
                    false
                )
                ON CONFLICT (stock) DO UPDATE SET
                    stock_quantity = holdings.stock_quantity + EXCLUDED.stock_quantity,
                    total_cost = holdings.total_cost + EXCLUDED.total_cost,
                    stock_price = (holdings.total_cost + EXCLUDED.total_cost) / (holdings.stock_quantity + EXCLUDED.stock_quantity),
                    sold = false;
            `;
    } else if (transaction_type === "sell") {
      res = await sql`
                UPDATE holdings SET
                    stock_quantity = holdings.stock_quantity - ${stock_quantity},
                    total_cost = holdings.total_cost - ${total_cost},
                    stock_price = (holdings.total_cost - ${total_cost}) / (holdings.stock_quantity - ${stock_quantity}),
                    sold = (holdings.stock_quantity - ${stock_quantity}) <= 0
                WHERE stock = ${stock};
            `;
    }
    if (!res) {
      throw new Error("Failed to add, update, or sell holding.");
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json(
    {
      message: "Transaction processed successfully",
    },
    { status: 200 }
  );
}
