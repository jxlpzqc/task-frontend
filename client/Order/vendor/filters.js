export function toMoney(value) {
	if (typeof(value) == 'number') {
		return `￥${value.toFixed(2)}`;
	} else {
		return "￥0.00"
	}
}
