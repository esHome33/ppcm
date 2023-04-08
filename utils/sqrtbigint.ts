/// from https://github.com/Aisse-258/bigint-isqrt

/// using PR proposed in https://github.com/Yaffle/bigint-isqrt

var bitLength = function (value:bigint) {
	return BigInt(value.toString(16).length * 4);
};



var sqrt: (value: bigint) => bigint = (value) => {
	if (value < 2n) {
		return value;
	}

	if (value < 16n) {
		return BigInt(Math.floor(Math.sqrt(Number(value))));
	}

	// 4503599627370496n = 1n << 52n
	if (value < 4503599627370496n) {
		return BigInt(Math.floor(Math.sqrt(Number(value) + 0.5)));
	}

	let e = bitLength(value);
	let quarter = (e + 2n) / 4n;
	let half = quarter * 2n;
	let x1 = (sqrt(value >> half) + 1n) << quarter;

	let x0 = -1n;
	while (x0 !== x1 && x0 !== x1 - 1n) {
		x0 = x1;
		x1 = (value / x0 + x0) >> 1n;
	}
	return x0;
};

export default sqrt;
