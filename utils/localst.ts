import { Decomposition } from "./decompose";

export const PrimeKey = "primes";

/**
 * Compte le nombre d'occurences d'une valeur dans la liste de valeurs.
 * @param liste la liste contenant différentes valeurs, y compris en plusieurs exemplaires.
 * @param valeur la valeur à trouver
 * @returns le nombre de fois que cette valeur a été trouvée dans la liste (0 ou nombre de fois)
 */
const CompteValeur: (liste: string[], valeur: string) => number = (
	liste,
	valeur
) => {
	let cpt: number = 0;
	for (const elt of liste) {
		if (elt === valeur) {
			cpt++;
		}
	}
	return cpt;
};

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
	if (str.length === 0) {
		return [];
	}
	const nb_premiers: bigint[] = [];
	for (let pp of str) {
		pp = pp.replace(" (nb premier)", "");
		const tmp = BigInt(pp);
		if (!nb_premiers.includes(tmp) && tmp !== 0n) {
			nb_premiers.push(tmp);
		}
	}
	nb_premiers.sort((a, b) => Number(a - b));
	return nb_premiers;
};

/**
 * type de l'analyse d'une décomposition : une liste de premiers
 * et leurs coefficients de puissance associés.
 */
export type ResuDecomp = {
	liste_prems: string[];
	coeffs_prems: number[];
};

/**
 * Analyse la décomposition : à partir d'une liste de premiers,
 * compte le nombre de fois que chaque premier apparait.
 * @param dec la décomposition à analyser
 * @returns les nombres premiers et leurs coefficients associés
 * @author Etienne Schwartz
 */
export const analyse_decomposition: (dec: Decomposition) => ResuDecomp = (
	dec: Decomposition
) => {
	const resu: ResuDecomp = {
		liste_prems: [],
		coeffs_prems: [],
	};
	// on passe la décomposition par ces deux fonctions (deux boucles inutiles!!) pour oter les doublons...
	const liste = GetStringFromBigint(GetBigintFromString(dec));

	if (liste) {
		const compteurs: number[] = [];
		for (const bi of liste) {
			const nb = CompteValeur(dec, bi);
			compteurs.push(nb);
		}
		resu.coeffs_prems = compteurs;
		resu.liste_prems = liste;
	} else {
		resu.liste_prems = ['0'],
		resu.coeffs_prems = [1]
	}
	return resu;
};

export const affiche_analyse: (ana: ResuDecomp) => string = (
	ana: ResuDecomp
) => {
	let resu = "";
	for (let i = 0; i < ana.liste_prems.length; i++) {
		const puiss = ana.coeffs_prems[i];
		if (puiss === 1) {
			resu += ana.liste_prems[i] + " * ";
		} else {
			resu += ana.liste_prems[i] + "^" + puiss + " * ";
		}
	}
	if (resu.length > 3) {
		resu = resu.slice(0, resu.length - 3);
	}
	return resu;
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
			if (!nv_list.includes(elt) && elt !== "0" && elt !== "1") {
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
