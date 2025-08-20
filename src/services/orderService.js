export async function createOrder(recipient, items, paymentMethod) {
	const res = await fetch('http://localhost:5000/api/orders', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ recipient, items, paymentMethod })
	});
	if (!res.ok) throw new Error('Create order failed');
	return res.json();
}


