export type DecParams = {
	nb1: bigint;
	nb2: bigint;
};

export type Decomposition = string[];

/**
 * Fonction qui décompose un nombre en ses facteurs premiers grâce à l'algo d'Euclide.
 * Teste la divisibilité du nombre par un index qui varie de 2 à @nb/2+1
 * @param nb nombre entier à décomposer (maximum 15 chiffres car sinon
 * le type number devient imprécis pour les entiers)
 * @author Etienne SCHWARTZ
 */
/* const euclide2 = (nb: number) => {
	let dec: Decomposition = [];
	const moitie = nb / 2;
	let div = nb;

	for (let index = 2; index < moitie + 1; index = index + 1) {
		if (index > 3) {
			if (index % 2 === 0) {
				// sauter les multiples de deux
				continue;
			}
			if (index % 3 === 0) {
				// sauter les multiples de 3
				continue;
			}
			// diviser par index et compter le nombre de fois qu'on peut le faire.
			let div_tmp = div;
			let rest = div_tmp % index;
			let division_faite = false;
			const facteur = index.toString();
			while (rest === 0) {
				dec.push(facteur);
				div_tmp = div_tmp / index;
				division_faite = true;
				rest = div_tmp % index;
			}
			if (division_faite) {
				div = div_tmp;
				// et on continue avec l'index suivant et avec une valeur plus petite dans div.
			} // et sinon, on passe à l'index suivant mais toujours avec la même valeur de div.
		} else if (index === 2) {
			let div_tmp = div;
			let rest = div_tmp % index;
			let division_faite = false;
			while (rest === 0) {
				dec.push("2");
				div_tmp = div_tmp / index;
				division_faite = true;
				rest = div_tmp % index;
			}
			if (division_faite) {
				div = div_tmp;
				// et on continue avec l'index suivant et avec une valeur plus petite dans div.
			} // et sinon, on passe à l'index suivant mais toujours avec la même valeur de div.
		} else {
			// index = 3 ici obligatoirement.
			let div_tmp = div;
			let rest = div_tmp % index;
			let division_faite = false;
			while (rest === 0) {
				dec.push("3");
				div_tmp = div_tmp / index;
				division_faite = true;
				rest = div_tmp % index;
			}
			if (division_faite) {
				div = div_tmp;
				// et on continue avec l'index suivant et avec une valeur plus petite dans div.
			} // et sinon, on passe à l'index suivant mais toujours avec la même valeur de div.
		}
	}

	if (dec.length === 0) {
		if (nb === 0) {
			dec.push(nb.toString());
		} else {
			dec.push(nb.toString() + " (nb premier)");
		}
	}
	return dec;
};*/


const euclide = (nb: bigint) => {
	let dec: Decomposition = [];
	const moitie = nb / 2n;
	let div = nb;

	for (let index = 2n; index < moitie + 1n; index = index + 1n) {
		if (index > 3n) {
			if (index % 2n === 0n) {
				// sauter les multiples de deux
				continue;
			}
			if (index % 3n === 0n) {
				// sauter les multiples de 3
				continue;
			}
			// diviser par index et compter le nombre de fois qu'on peut le faire.
			let div_tmp = div;
			let rest = div_tmp % index;
			let division_faite = false;
			const facteur = index.toString();
			while (rest === 0n) {
				dec.push(facteur);
				div_tmp = div_tmp / index;
				division_faite = true;
				rest = div_tmp % index;
			}
			if (division_faite) {
				div = div_tmp;
				// et on continue avec l'index suivant et avec une valeur plus petite dans div.
			} // et sinon, on passe à l'index suivant mais toujours avec la même valeur de div.
		} else if (index === 2n) {
			let div_tmp = div;
			let rest = div_tmp % index;
			let division_faite = false;
			while (rest === 0n) {
				dec.push("2");
				div_tmp = div_tmp / index;
				division_faite = true;
				rest = div_tmp % index;
			}
			if (division_faite) {
				div = div_tmp;
				// et on continue avec l'index suivant et avec une valeur plus petite dans div.
			} // et sinon, on passe à l'index suivant mais toujours avec la même valeur de div.
		} else {
			// index = 3 ici obligatoirement.
			let div_tmp = div;
			let rest = div_tmp % index;
			let division_faite = false;
			while (rest === 0n) {
				dec.push("3");
				div_tmp = div_tmp / index;
				division_faite = true;
				rest = div_tmp % index;
			}
			if (division_faite) {
				div = div_tmp;
				// et on continue avec l'index suivant et avec une valeur plus petite dans div.
			} // et sinon, on passe à l'index suivant mais toujours avec la même valeur de div.
		}
	}

	if (dec.length === 0) {
		if (nb === 0n) {
			dec.push(nb.toString());
		} else {
			dec.push(nb.toString() + " (nb premier)");
		}
	}
	return dec;
}; 

const decompose = (params: DecParams) => {
	const resu1: Decomposition = euclide(BigInt(params.nb1));
	const resu2: Decomposition = euclide(BigInt(params.nb2));
	const resu: Decomposition[] = [];
	resu.push(resu1);
	resu.push(resu2);
	return resu;
};

export default decompose;
