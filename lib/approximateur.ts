import path from "path";
import { promises as fs } from "fs";

/**
 * les données contenues dans un fichier JSON contenant les nombres premiers et leur index
 */
type Fic = {
	firstprime: number;
	lastprime: number;
	name: string;
	firstpos: number;
	lastpos: number;
};

/**
 * un type permettant de regrouper les deux (ou un seul) fichiers où l'on pourra
 * retrouver tous les éléments permettant d'encadrer un nombre
 */
/*type DeuxFichiers = {
	f1: Fic | undefined;
	f2: Fic | undefined;
};*/

/**
 * les deux nombres premiers qui encadrent le nombre fourni lors de l'instanciation de la classe
 */
type Encadrement = {
	nb_avant: number;
	index_nb_avant: number;
	nb_apres: number;
	index_nb_apres: number;
};

/**
 * les limites concernant les fichiers JSON fournis. Ce sont des données
 * qui sont lues du fichier prime_positions.json.
 */
export type Limites = {
	files: Fic[];
	maxprime: number;
	maxpos: number;
};

/**
 * tableau de nombres premiers et de leurs index
 */
type NombresPremiersLus = { index: number; nb: number }[];

/**
 * Classe qui permet de trouver les deux nombres premiers qui sont
 * juste avant et juste après un nombre donné lors de l'instantiation.
 *
 * Si le nombre donné est premier, la classe fournira le nombre premier précédent
 * et le nombre premier suivant.
 *
 * Utiliser la fonction statique {@link CreateNewApproximateur()} pour instantier
 * cette classe (il n'y a pas de constructeur fourni).
 *
 * @author Etienne S.
 */
export default class Approximateur {
	/**
	 *  le nombre entier (premier ou non) qui est utilisé lors de l'instanciation de cette classe
	 */
	private myNumber: number = 0;
	/**
	 * le nombre premier qui est juste avant le (inférieur au) nombre entier fourni
	 */
	private prem_avant: number = 0;

	/**
	 * l'index du nombre premier qui est juste avant le (inférieur au) nombre entier fourni
	 */
	private index_prem_avant: number = 0;
	/**
	 * le nombre premier qui est juste après le (supérieur au) nombre entier fourni
	 */
	private prem_apres: number = 0;

	/**
	 * l'index du nombre premier qui est juste après le (supérieur au) nombre entier fourni
	 */
	private index_prem_apres: number = 0;

	/**
	 * les limites des différents fichiers JSON lues depuis le fichier prime_positions.json
	 */
	private myLimits: Limites | undefined = undefined;

	/**
	 * CONSTRUCTEUR PRIVE : inacessible aux utilisateurs de cette classe.
	 *
	 * Les utilisateurs doivent utiliser la fonction statique @see {@link CreateNewApproximateur()}.
	 *
	 * Construit une classe permettant de trouver les deux premiers entourant le nombre.
	 * La classe offre une fonction qui renvoie les deux premiers trouvés ainsi que les index
	 * de ces nombres premiers.
	 *
	 * @param nombre un nombre entier
	 */
	private constructor(nombre: number) {
		this.myNumber = nombre;
	}

	/**
	 * Fonction à utiliser pour instancier une nouvelle classe et récupérer les deux nombres
	 * premiers associés au nombre entier quelconque passé en paramètre.
	 * Si le nombre est premier, la classe permettra de trouver le nombre premier précédent et
	 * le suivant.
	 *
	 * @param nombre un nombre entier dont on cherche le premier qui le précède et celui qui le suit
	 *
	 * @returns une classe qui permet de récupérer ces deux nombres premiers.
	 */
	public static CreateNewApproximateur = async (nombre: number) => {
		const myApp = new Approximateur(nombre);
		// on lit les paramétrages
		myApp.myLimits = await myApp.litParametres();
		// on peut maintenant trouver les 2 fichiers qui
		// contiennent les premiers qui encadrent le nombre
		const les_fic = await myApp.getEncadrement();
		myApp.prem_avant = les_fic.nb_avant;
		myApp.index_prem_avant = les_fic.index_nb_avant;
		myApp.prem_apres = les_fic.nb_apres;
		myApp.index_prem_apres = les_fic.index_nb_apres;
		return myApp;
	};

	/**
	 * retourne le premier nombre premier qui est juste inférieur au nombre donné
	 * @returns 0 si il y a eu une erreur ou un nombre premier
	 */
	public getPermierAvant = () => {
		return this.prem_avant;
	};

	/**
	 * retourne l'index du premier nombre premier qui est juste inférieur au nombre donné
	 * @returns 0 si il y a eu une erreur ou un nombre entier
	 */
	public getIndexPremierAvant = () => {
		return this.index_prem_avant;
	};

	/**
	 * retourne le deuxième nombre premier qui est juste supérieur au nombre donné
	 * @returns 0 si il y a eu une erreur ou un nombre premier
	 */
	public getPremierApres = () => {
		return this.prem_apres;
	};

	/**
	 * retourne l'index du deuxième nombre premier qui est juste supérieur au nombre donné
	 * @returns 0 si il y a eu une erreur ou un nombre entier
	 */
	public getIndexPremierApres = () => {
		return this.index_prem_apres;
	};

	/**
	 * Retrouve le nombre entier qui a été fourni lors de l'instantiation de cette classe.
	 *
	 * @returns le nombre entier qui a été fourni lors de l'instantiation de cette classe.
	 */
	public getNumber = () => {
		return this.myNumber;
	};

	/**
	 * trouve les deux deux nombres premiers qui encadrent
	 * le nombre entier fourni lors de l'instantiation de cette classe.
	 */
	private getEncadrement = async () => {
		let resu: Encadrement = {
			index_nb_apres: -1,
			nb_apres: -1,
			index_nb_avant: -1,
			nb_avant: -1,
		};
		const nb = this.myNumber;

		if (!this.myLimits) {
			// ceci ne devrait pas arriver normalement sauf si je ne sais plus coder !!
			return resu;
		}

		const max_num = this.myLimits.maxprime;

		// test si le nombre est dans la limite max des nombres premiers stockés dans les fichiers
		if (nb > max_num) {
			resu.nb_avant = max_num;
			resu.index_nb_avant = this.myLimits.maxpos;
			return resu;
		}

		// test si le nombre est plus petit que le premier nombre premier, c'est-à-dire 2 !
		if (nb < 2) {
			resu.index_nb_apres = 1;
			resu.nb_apres = 2;
			return resu;
		}

		// test du cas simple où le nombre est le premier nombre premier, c'est-à-dire 2 !
		if (nb === 2) {
			resu.index_nb_apres = 2;
			resu.nb_apres = 3;
			return resu;
		}
		// maintenant on peut travailler sachant que 2 < nb < maxprime
		const nb_de_fichiers_json = this.myLimits.files.length;
		let index_courant = 0; // pointeur mobile sur le fichier courant et le fichier suivant.

		while (index_courant < nb_de_fichiers_json - 1) {
			const fic_courant = this.myLimits.files[index_courant];
			const fic_suivant = this.myLimits.files[index_courant + 1];

			const dernier_premier = fic_courant.lastprime;
			const premier_premier_suiv = fic_suivant.firstprime;

			const egalite_prem_suivant = nb - premier_premier_suiv;
			const egalite_dernier_premier = nb - dernier_premier;

			// le cas où nb est < premier_premier
			// ou le cas où nb === premier_premier est déjà traité avant cette boucle while
			
			// => soit nb est strictement supérieur au premier premier du fichier courant
			// et strictement inférieur au dernier premier du fichier courant
			if (nb < dernier_premier) {
				if (nb >= fic_courant.firstprime) {
					// on trouve les deux approchants dans ce fichier
					const donnees: NombresPremiersLus = await this.datasInPrimeFile(
						fic_courant.name
					);
					let index = 0;
					let trouve = false;
					while (index <= donnees.length - 2 && !trouve) {
						const p_av = donnees[index].nb;
						const p_ap = donnees[index + 1].nb;
						const ip_av = donnees[index].index;
						const ip_ap = donnees[index + 1].index;

						const diff1 = nb - p_av;
						const diff2 = p_ap - nb;
						// si p_av < nb && nb < p_ap alors on a trouvé l'encadrement !
						if (diff1 > 0 && diff2 > 0) {
							resu.nb_avant = p_av;
							resu.index_nb_avant = ip_av;
							resu.nb_apres = p_ap;
							resu.index_nb_apres = ip_ap;
						}
						if (diff1 === 0) {
							// nb correspond au nombre premier p_av.
							// Faut donc aussi chercher celui avant p_av

							const p_av_av = donnees[index - 1].nb;
							const p_av_av_index = donnees[index - 1].index;
							trouve = true;
							resu.nb_avant = p_av_av;
							resu.index_nb_avant = p_av_av_index;
							resu.nb_apres = p_ap;
							resu.index_nb_apres = ip_ap;
						}
						if (diff2 === 0) {
							// nb correspond au nombre premier p_ap.
							// Faut donc aussi chercher celui après p_ap
							const p_ap_ap = donnees[index + 2].nb;
							const p_ap_ap_index = donnees[index + 2].index;
							trouve = true;
							resu.nb_avant = p_av;
							resu.index_nb_avant = ip_av;
							resu.nb_apres = p_ap_ap;
							resu.index_nb_apres = p_ap_ap_index;
						}
						index++;
					}
					return resu;
				} else {
					throw new Error(
						"pas possible : nb doit être supérieur au plus petit premier du fichier (nb=" +
							nb +
							")"
					);
				}
			} else if (egalite_dernier_premier === 0) {
				// nb égale au dernier premier du fichier courant : faut trouver l'avant dernier du fichier courant
				// et le premier du fichier suivant

				const donnees_cour: NombresPremiersLus =
					await this.datasInPrimeFile(fic_courant.name);
				const donnees_suiv: NombresPremiersLus =
					await this.datasInPrimeFile(fic_suivant.name);

				resu.nb_avant = donnees_cour[donnees_cour.length - 2].nb;
				resu.index_nb_avant = donnees_cour[donnees_cour.length - 2].index;
				resu.nb_apres = donnees_suiv[0].nb;
				resu.index_nb_apres = donnees_suiv[0].index;
				return resu;
			} else {
				// le nombre est strictement supérieur au dernier premier du fichier courant
				// dans ce cas, on voit sa situation par rapport au plus petit premier du fichier suivant
				if (nb < premier_premier_suiv) {
					// le nombre est juste entre le dernier du fichier courant et le premier du fichier suivant

					resu.nb_avant = dernier_premier;
					resu.index_nb_avant = fic_courant.lastpos;
					resu.nb_apres = premier_premier_suiv;
					resu.index_nb_apres = fic_suivant.firstpos;
					return resu;
				} else if (egalite_prem_suivant === 0) {
					// le suivant est le deuxième premier du fichier suivant
					resu.nb_avant = dernier_premier;
					resu.index_nb_avant = fic_courant.lastpos;
					const datas_suiv = await this.datasInPrimeFile(fic_suivant.name);
					resu.nb_apres = datas_suiv[1].nb;
					resu.index_nb_apres = datas_suiv[1].index;
					return resu;
				} else {
					// le nombre est au dessus du premier premier du fichier suivant
					// c'est la boucle suivante qui va traiter la recherche ... sauf
					// sauf si le fichier courant est l'avant dernier fichier
					// càd si index_courant === nb_de_fichiers_json - 2
					if (index_courant === nb_de_fichiers_json - 2) {
						// dans ce cas, on cherche dans le fichier suivant les deux nombres premiers
						const datas_suiv = await this.datasInPrimeFile(
							fic_suivant.name
						);
						const dernier_p = datas_suiv[datas_suiv.length - 1].nb;
						const diff = nb - dernier_p;
						
						if (diff < 0) {
							// nb < datas_suiv[datas_suiv.length - 1].nb
							let idx = 0;
							let trouve = false;
							while (idx <= datas_suiv.length - 2 && !trouve) {
								const nb_p1 = datas_suiv[idx].nb;
								const nb_p2 = datas_suiv[idx + 1].nb;
								const d1 = nb - nb_p1;
								const d2 = nb_p2 - nb;
								if (d1 > 0 && d2 > 0) {
									trouve = true;
									resu.nb_avant = datas_suiv[idx].nb;
									resu.index_nb_avant = datas_suiv[idx].index;
									resu.nb_apres = datas_suiv[idx + 1].nb;
									resu.index_nb_apres = datas_suiv[idx + 1].index;
								}
								if (d1 === 0) {
									trouve = true;
									resu.nb_avant = datas_suiv[idx - 1].nb;
									resu.index_nb_avant = datas_suiv[idx - 1].index;
									resu.nb_apres = datas_suiv[idx + 1].nb;
									resu.index_nb_apres = datas_suiv[idx + 1].index;
								}
								if (d2 === 0) {
									trouve = true;
									resu.nb_avant = datas_suiv[idx].nb;
									resu.index_nb_avant = datas_suiv[idx].index;
									resu.nb_apres = datas_suiv[idx+2].nb;
									resu.index_nb_apres = datas_suiv[idx+2].index;
								}
								idx++;
							}
							//return resu;
						} else if (diff === 0) {
							// nb === datas_suiv[datas_suiv.length - 1].nb
							resu.nb_avant = datas_suiv[datas_suiv.length - 2].nb;
							resu.index_nb_avant =
								datas_suiv[datas_suiv.length - 2].index;
							// il n'y a pas de nombre après qui soient connus dans les fichiers !
							//return resu;
						} else {
							// normalement, on ne devrait pas entrer ici car ce cas a déjà été traité
							// en tout début de procédure getEncadrement.
							resu.nb_avant = fic_suivant.lastprime;
							resu.index_nb_avant = fic_suivant.lastpos;
							//return resu;
						}
					}
				}
			}
			index_courant++;
		}
		return resu;
	};

	/**
	 * Lit les limites indiquées dans le fichier JSON "prime_positions.json"
	 *
	 * @returns les limites lues dans le fichier JSON "prime_positions.json"
	 */
	private litParametres = async () => {
		const jsonDirectory = path.join(process.cwd(), "json");
		const filename = "prime_positions.json";
		const fileContents = await fs.readFile(
			jsonDirectory + "/" + filename,
			"utf8"
		);
		const d: Limites = JSON.parse(fileContents);
		return d;
	};

	/**
	 * Lit le contenu d'un fichier JSON contenant des nombres premiers.
	 *
	 * @param nomfichier nom du fichier JSON contenant des nombres premiers
	 * @returns  le contenu lus dans ce fichier JSON (tableau de nombres premiers et de leur index)
	 */
	private async datasInPrimeFile(nomfichier: string) {
		const jsonDirectory = path.join(process.cwd(), "json");
		const fileContents = await fs.readFile(
			jsonDirectory + "/" + nomfichier,
			"utf8"
		);
		const contenu: NombresPremiersLus = JSON.parse(fileContents);
		return contenu;
	}
}
