export async function DELETE(req) {
  const { transaction_date, stock, stock_quantity } = await req.json();

  try {
    await sql`
      DELETE FROM Stocks
      WHERE transaction_date = ${transaction_date} AND stock = ${stock} AND stock_quantity = ${stock_quantity};
    `;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
