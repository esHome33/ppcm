import { Decomposition } from "../utils/decompose";
import { GetBigintFromString, GetStringFromBigint } from "../utils/localst";

/**
 * type de l'analyse d'une décomposition : une liste de premiers
 * et leurs coefficients de puissance associés.
 */
export type ResuDecomp = {
	liste_prems: string[];
	coeffs_prems: number[];
};

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
 * Analyse la décomposition : à partir d'une liste de premiers,
 * compte le nombre de fois que chaque premier apparait.
 * 
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
	let liste: string[] | null = [];
	try {
		liste = GetStringFromBigint(GetBigintFromString(dec));
	} catch (err: any) {
		resu.liste_prems = ["0"];
		resu.coeffs_prems = [1];
		return resu;
	}

	if (liste) {
		const compteurs: number[] = [];
		for (const bi of liste) {
			const nb = CompteValeur(dec, bi);
			compteurs.push(nb);
		}
		resu.coeffs_prems = compteurs;
		resu.liste_prems = liste;
	} else {
		resu.liste_prems = ["0"];
		resu.coeffs_prems = [1];
	}
	return resu;
};

/**
 * Fournit une représentation textuelle d'une décomposition
 *
 * @param ana une décomposition
 * @returns retourne une chaine représentant la décomposition comme produits de facteurs premiers affectés d'une puissance.
 */
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
 * Calcule le nombre (bigint) dont la décomposition est celle donnée en paramètre.
 * @param dec une décomposition
 * @returns fournit le nombre bigint correspondant à la décomposition fournie
 */
export const valeur_analyse = (dec: ResuDecomp) => {
	let resu: bigint = 1n;
	for (let i = 0; i < dec.liste_prems.length; i++) {
		const nb = BigInt(dec.liste_prems[i]);
		const puiss = BigInt(dec.coeffs_prems[i]);
		let val: bigint = 1n;
		for (let j = 0n; j < puiss; j++) {
			val = val * nb;
		}
		resu = resu * val;
	}
	return resu.toString();
};

export type TYPE_NOMBRE = "PREMIER" | "ERREUR" | "COMPOSE";

/**
 * indique si une décomposition est celle d'un nombre premier, d'un nombre composé ou d'une erreur
 *
 * @param dec une décomposition
 * @returns "PREMIER"  ou   "ERREUR"     ou     "COMPOSITE"
 */
export const isPrime: (dec: ResuDecomp) => TYPE_NOMBRE = (dec: ResuDecomp) => {
	if (dec.liste_prems.length === 1) {
		if (dec.coeffs_prems[0] === 1) {
			return "PREMIER";
		}
	}
	if (dec.liste_prems.length === 0) {
		return "ERREUR";
	} else {
		return "COMPOSE";
	}
};

/**
 * Fournit le PGCD - finds GCF of two numbers
 * @param d1 nombre 1
 * @param d2 nombre 2
 * @returns PGCD des deux nombres
 */
export const detPGCD = (d1: ResuDecomp, d2: ResuDecomp) => {
	const resu: ResuDecomp = {
		coeffs_prems: [],
		liste_prems: [],
	};
	for (let i = 0; i < d1.liste_prems.length; i++) {
		const pr = d1.liste_prems[i];
		const coeff1 = d1.coeffs_prems[i];
		const index2 = d2.liste_prems.indexOf(pr);

		if (index2 >= 0) {
			const coeff2 = d2.coeffs_prems[index2];
			resu.liste_prems.push(pr);
			resu.coeffs_prems.push(Math.min(coeff1, coeff2));
		}
	}
	if (resu.liste_prems.length === 0) {
		resu.liste_prems.push("1");
		resu.coeffs_prems.push(1);
	}
	return resu;
};

/**
 * Fournit le PPCM - finds LCM of two numbers
 * @param d1 nombre 1
 * @param d2 nombre 2
 * @returns PPCM des deux nombres
 */
export const detPPCM = (d1: ResuDecomp, d2: ResuDecomp) => {
	let resu: ResuDecomp = {
		coeffs_prems: [],
		liste_prems: [],
	};

	const lg1 = d1.liste_prems.length;
	const lg2 = d2.liste_prems.length;

	let index1 = 0;
	let index2 = 0;

	const index2_utilises: number[] = [];

	while (index1 < lg1) {
		const pr1 = d1.liste_prems[index1];
		const coeff1 = d1.coeffs_prems[index1];
		// on cherche pr1 dans la liste des facteurs du 2e nombre
		index2 = d2.liste_prems.indexOf(pr1);
		if (index2 >= 0) {
			// si il y est, on prend le coeff le plus grand
			// d'abord, on indique qu'on a déjà traité ce facteur dans la décomposition du 2e nombre
			index2_utilises.push(index2);
			// on récupère le coeff de pr1 dans la décomposition du 2e nombre
			const coeff2 = d2.coeffs_prems[index2];
			// on sauvegarde ce facteur et le coeff qui est le max des deux coeffs des deux décompositions.
			resu.liste_prems.push(pr1);
			resu.coeffs_prems.push(Math.max(coeff1, coeff2));
		} else {
			// s'il n'y est pas, on va juste utiliser ce facteur et son coeff dans la décomposition du PPCM cherché
			resu.liste_prems.push(pr1);
			resu.coeffs_prems.push(coeff1);
		}
		// on passe au facteur suivant dans la décomposition du 1er nombre
		index1++;
	}
	// on a épuisé les facteurs de la décomp du 1er nombre.
	// Il faut maintenant traiter les facteurs non vus de la décomp du 2e nombre...
	index2 = 0;
	while (index2 < lg2) {
		// on ne traite que les index non déjà vus !
		if (index2_utilises.indexOf(index2) < 0) {
			const pr2 = d2.liste_prems[index2];
			const coeff2 = d2.coeffs_prems[index2];
			resu.liste_prems.push(pr2);
			resu.coeffs_prems.push(coeff2);
		}
		// on passe à l'index suivant
		index2++;
	}

	// reste plus qu'à trier les facteurs et leurs coeffs.
	resu = trie_facteurs(resu);
	// et on renvoie enfin le résultat !
	return resu;
};

/**
 * le type qui contient à la fois un facteur et son coefficient
 */
type element = {
	coeff: number;
	facteur: bigint;
};

/**
 * Trie une décomposition suivant l'ordre croissant des facteurs
 * sans perdre l'ordre des coefficients associés au facteur
 *
 * @param dec une décomposition qui contient des facteurs dans un ordre qui n'est peut être pas croissant
 * @returns une décomposition triée dans l'ordre croissant des facteurs.
 */
const trie_facteurs = (dec: ResuDecomp) => {
	// initialisation de ce que va renvoyer cette fonction.
	const resu_trie: ResuDecomp = {
		coeffs_prems: [],
		liste_prems: [],
	};

	// initialisation de la liste d'éléments
	const resu: element[] = [];

	// on remplit le tableau d'éléments à partir de la décomposition fournie
	for (let i = 0; i < dec.liste_prems.length; i++) {
		const elt: element = {
			coeff: dec.coeffs_prems[i],
			facteur: BigInt(dec.liste_prems[i]),
		};
		resu.push(elt);
	}

	// on va trier le tableau à l'aide d'une fonction
	resu.sort((a, b) => {
		const diff = a.facteur - b.facteur;
		if (diff > 0n) {
			return 1;
		} else if (diff < 0n) {
			return -1;
		} else {
			return 0;
		}
	});

	// on remet les éléments triés dans une décomposition ... c'est du boulot gratos !!
	for (let i = 0; i < resu.length; i++) {
		const elt = resu[i];
		resu_trie.liste_prems.push(elt.facteur.toString());
		resu_trie.coeffs_prems.push(elt.coeff);
	}

	// et on renvoie le résultat trié !
	return resu_trie;
};

/**
 * Vérifie si une décomposition ne comporte qu'un seul facteur
 * 
 * @param dec une décomposition
 * @returns boolean VRAI s'il n'y a qu'un seul facteur
 */
export const isMonofacteur = (dec: ResuDecomp) => {
	return dec.liste_prems.length === 1;
}