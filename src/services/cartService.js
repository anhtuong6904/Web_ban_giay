// Simple cart service using localStorage and a window event for updates

const STORAGE_KEY = 'cartItems';
const EVENT_NAME = 'cartUpdated';
const CHECKOUT_KEY = 'checkoutItems';

export function readCart() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
}

function writeCart(items) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
	window.dispatchEvent(new Event(EVENT_NAME));
}

export function getCartCount() {
	return readCart().reduce((sum, it) => sum + (it.quantity || 0), 0);
}

export function onCartChange(handler) {
	window.addEventListener(EVENT_NAME, handler);
	return () => window.removeEventListener(EVENT_NAME, handler);
}

export function addToCart(product, options = {}) {
	const items = readCart();
	const id = product.ProductID || product.id;
	const key = `${id}|${options.size || ''}|${options.color || ''}`;
	const existing = items.find((it) => it.key === key);
	if (existing) {
		existing.quantity += options.quantity || 1;
	} else {
		items.push({
			key,
			productId: id,
			name: product.Name,
			price: product.Price || 0,
			image: product.MainImage || product.ImageURL || '/images/products/giay-the-thao-1.jpg',
			quantity: options.quantity || 1,
			size: options.size || null,
			color: options.color || null
		});
	}
	writeCart(items);
}

export function updateQuantity(key, quantity) {
	const items = readCart();
	const target = items.find((it) => it.key === key);
	if (!target) return;
	if (quantity <= 0) {
		removeItem(key);
		return;
	}
	target.quantity = quantity;
	writeCart(items);
}

export function removeItem(key) {
	const items = readCart().filter((it) => it.key !== key);
	writeCart(items);
}

export function clearCart() {
	writeCart([]);
}

// One-click checkout helpers
export function setCheckoutItems(items) {
	localStorage.setItem(CHECKOUT_KEY, JSON.stringify(items || []));
}

export function getCheckoutItems() {
	try {
		const raw = localStorage.getItem(CHECKOUT_KEY);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
}

export function clearCheckoutItems() {
	localStorage.removeItem(CHECKOUT_KEY);
}


