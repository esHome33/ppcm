import sqrt from "./sqrtbigint";

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

export type EuclideResponse = {
	dec: Decomposition;
	nb: bigint;
	isError: boolean;
};

export const EmptyEuclideResponse: EuclideResponse = {
	dec: [""],
	nb: 0n,
	isError: true,
};

const euclide: (nb: bigint) => EuclideResponse = (nb: bigint) => {
	let dec: Decomposition = [];
	let dec_b: bigint[] = [1n];
	let div = nb;

	if (nb === 0n) {
		return { dec: ["0"], nb: 0n, isError: false };
	}
	if (nb === 1n) {
		return { dec: ["1"], nb: 1n, isError: false };
	}

	const max = sqrt(nb);
	for (let index: bigint = 2n; index <= max; index = index + 1n) {
		if (index > 3n) {
			if (index % 2n === 0n) {
				// sauter les multiples de deux
				continue;
			}
			if (index % 3n === 0n) {
				// sauter les multiples de 3
				continue;
			}
			if (index > 5n && index % 5n === 0n) {
				// sauter les multiples de 5
				continue;
			}
			if (index > 7n && index % 7n === 0n) {
				// sauter les multiples de 7
				continue;
			}
			if (index > 11n && index % 11n === 0n) {
				// sauter les multiples de 11
				continue;
			}
			if (index > 13n && index % 13n === 0n) {
				// sauter les multiples de 13
				continue;
			}

			// diviser par index et compter le nombre de fois qu'on peut le faire.
			let div_tmp = div;
			let rest = div_tmp % index;
			let division_faite = false;
			const facteur = index.toString();
			while (rest === 0n) {
				dec_b.push(index);
				dec.push(facteur);
				div_tmp = div_tmp / index;
				division_faite = true;
				rest = div_tmp % index;
			}
			if (division_faite) {
				div = div_tmp;
				// et on continue avec l'index suivant et avec une valeur plus petite dans div.
			} // et sinon, on passe à l'index suivant mais toujours avec la même valeur de div.

			/// un petit coup de log tout les 1000 tours !!
			if (index % 1000n === 0n) {
				console.log("et 1000 de plus : " + index);
			}
		} else if (index === 2n) {
			/// cas de 2
			let div_tmp = div;
			let rest = div_tmp % index;
			let division_faite = false;
			while (rest === 0n) {
				dec_b.push(2n);
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
				dec_b.push(3n);
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

	// check du produit des facteurs et du nombre à décomposer
	let prod: bigint = 1n;
	for (const p of dec_b) {
		prod = prod * p;
	}
	let resu_b = prod;
	if (prod !== nb) {
		const manquant = nb / prod;
		// test de primalité de ce manquant
		for (let ii = 2n; ii <= sqrt(manquant); ii = ii + 1n) {
			if (manquant % ii === 0n) {
				throw new Error(
					"L'algo n'a pas trouvé une décomposition de " +
						nb +
						" manquant = " +
						manquant
				);
			}
		}
		resu_b = resu_b * manquant;
		dec.push(manquant.toString());
		//dec_b.push(manquant);
	}

	// et on traite le cas où on est tombé sur 0 ou sur un nombre premier
	if (dec.length === 0) {
		if (nb === 0n) {
			dec.push(nb.toString());
		} else {
			dec.push(nb.toString() + " (nb premier)");
		}
	}
	return { dec: dec, nb: resu_b, isError: false };
};

const decompose: (params: DecParams) => EuclideResponse[] = (
	params: DecParams
) => {
	let resu1: EuclideResponse;
	let resu2: EuclideResponse;
	try {
		resu1 = euclide(params.nb1);
	} catch (error: any) {
		resu1 = { dec: [error.message], nb: params.nb1, isError: true };
	}
	try {
		resu2 = euclide(params.nb2);
	} catch (error: any) {
		resu2 = { dec: [error.message], nb: params.nb2, isError: true };
	}
	let resu: EuclideResponse[] = [];
	resu.push(resu1);
	resu.push(resu2);
	return resu;
};

export default decompose;
