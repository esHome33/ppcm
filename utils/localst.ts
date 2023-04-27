export const PrimeKey = "primes";

/**
 * Gets a list of BigInt from a list of string ... eliminates doubles
 * @returns a sorted array of BigInt, without doubles
 * @author Etienne Schwartz
 */
export const GetBigintFromString: (str: string[] | null) => bigint[] = (
	str
) => {
	if (!str) {
		return [];
	}
	if (0 === str.length) {
		return [];
	}
	const nb_premiers: bigint[] = [];
	for (let pp of str) {
		pp = pp.replace(" (nb premier)", "");
		let tmp: bigint;
		try {
			tmp = BigInt(pp);
			if (!nb_premiers.includes(tmp) && tmp !== 0n) {
				nb_premiers.push(tmp);
			}
		} catch (error) {
			throw new Error(pp);
		}
	}
	nb_premiers.sort((a, b) => Number(a - b));
	return nb_premiers;
};

/**
 * transforme une liste de nombres tous uniques (ou pas), ordonnée ou pas, en une liste de strings
 * @param bi_list a list of bigint (ordered or not, unique or not)
 * @returns a list of string (values of bigint, ordered)
 */
export const GetStringFromBigint: (bi_list: bigint[]) => string[] | null = (
	bi_list
) => {
	if (!bi_list || bi_list.length === 0) {
		return null;
	}
	bi_list.sort((a, b) => Number(a - b));
	const resu: string[] = [];
	for (const nb of bi_list) {
		const tmp = nb.toString();
		if (!resu.includes(tmp) && nb !== 0n) {
			resu.push(nb.toString());
		}
	}
	return resu;
};

/**
 *	Ajoute une liste de nouveaux primes à une liste existante
 * @param new_p nouveaux primes, contient éventuellement des doublons et n'est pas trié.
 * @param liste la liste à laquelle il faut ajouter les nouveaux
 * @returns liste des nouveaux sans doublons non triée.
 */
export function AddToPrimesList(
	new_p: string[],
	liste: string[] | null
): string[] | null {
	// si new_primes est vide, on renvoie la liste courante.
	if (new_p.length === 0) {
		return liste;
	}
	// si la liste n'existe pas, on en produit une nouvelle à l'aide des new_primes
	if (!liste) {
		const nv_list: string[] = [];
		new_p.forEach((elt) => {
			if (
				!nv_list.includes(elt) &&
				elt !== "0" &&
				elt !== "1" &&
				!elt.includes("a")
			) {
				nv_list.push(elt);
			}
		});
		return nv_list;
	}

	// on a une liste de départ et un tableau de string à rajouter :

	// on ajoute les nouveaux primes s'ils ne sont pas déjà dans la liste courante
	for (const pp of new_p) {
		if (!liste.includes(pp) && pp !== "0" && pp !== "1") {
			liste.push(pp);
		}
	}
	// et on renvoie cette nouvelle liste stringifiée.
	return liste;
}
