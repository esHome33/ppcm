import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { promises as fs } from "fs";

export type Result = {
	index: string;
	premiers: string[];
	isError: boolean;
};

/**
 *  Etudie la chaine de query et en tire un nombre
 * @param queryString chaine de query
 * @returns le nombre qui se trouve dans la chaine de query (= n° d'index du premier souhaité)
 */
const getNombre = (queryString: string | string[] | undefined) => {
	if (queryString) {
		const qs = queryString as string;
		if (qs) {
			const res = BigInt(qs);
			if (res <= 0n) {
				return -1n;
			} else {
				return res;
			}
		} else {
			return -1n;
		}
	} else {
		return -1n;
	}
};

/**
 * Retrouve le nom de fichier qui contient les nombres premiers qui encadrent
 * le nombre fourni en paramètre
 *
 * @param nb un nombre quelconque
 * @returns un nom de fichier JSON ou "ERR"
 */
const getFileName = (nb: bigint) => {
	if (nb === -1n || nb === 0n || nb > 400000n) {
		return "ERR";
	}
	if (nb <= 30000n) {
		return "p-1-30000.json";
	} else if (nb <= 60000n) {
		return "p-30001-60000.json";
	} else if (nb <= 90000n) {
		return "p-60001-90000.json";
	} else if (nb <= 120000n) {
		return "p-90001-120000.json";
	} else if (nb <= 150000n) {
		return "p-120001-150000.json";
	} else if (nb <= 180000n) {
		return "p-150001-180000.json";
	} else if (nb <= 210000n) {
		return "p-180001-210000.json";
	} else if (nb <= 240000n) {
		return "p-210001-240000.json";
	} else if (nb <= 270000n) {
		return "p-240001-270000.json";
	} else if (nb <= 300000n) {
		return "p-270001-300000.json";
	} else if (nb <= 330000n) {
		return "p-300001-330000.json";
	} else if (nb <= 360000n) {
		return "p-330001-360000.json";
	} else if (nb <= 380000n) {
		return "p-360001-380000.json";
	} else {
		return "p-380001-400000.json";
	}
};

/**
 * Retrouve le fichier qui contient les nombres premiers inférieurs au plus petit premier contenu
 * dans le fichier filename.
 *
 * @param filename nom d'un fichier json contenant les nombres premiers
 * @returns le filename qui précède le filename indiqué
 */
const getPrecedentFilename = (filename: string) => {
	const filenames = [
		"p-1-30000.json",
		"p-30001-60000.json",
		"p-60001-90000.json",
		"p-90001-120000.json",
		"p-120001-150000.json",
		"p-150001-180000.json",
		"p-180001-210000.json",
		"p-210001-240000.json",
		"p-240001-270000.json",
		"p-270001-300000.json",
		"p-300001-330000.json",
		"p-330001-360000.json",
		"p-360001-380000.json",
		"p-380001-400000.json",
	];
	const index_recherche = filenames.findIndex((val) => {
		return val === filename;
	});
	if (index_recherche < 0) {
		return "ERR";
	} else {
		if (index_recherche === 0) {
			return "ERR";
		} else {
			return filenames[index_recherche - 1];
		}
	}
};

/**
 * Lit un fichier JSON et fournit un tableau des données contenues dans ce fichier
 * @param filename le nom du fichier JSON
 * @returns un tableau des données contenues dans ce fichier
 */
const ouvreFichier = async (filename: string) => {
	const jsonDirectory = path.join(process.cwd(), "json");
	const fileContents = await fs.readFile(
		jsonDirectory + "/" + filename,
		"utf8"
	);
	const d: { index: number; nb: number }[] = JSON.parse(fileContents);
	return d;
};
/**
 * Extrait "quantité" de nombres premiers parmi les derniers
 * nombres premiers d'un fichier JSON
 *
 * @param filename le nom du fichier JSON
 * @param quantite la quantité de nombres premiers à extraire de ce fichier depuis la fin du fichier
 * @returns un tableau contenant les nombres premiers extraits
 * @author Etienne
 */
const getLastPrimes = async (filename: string, quantite: number) => {
	const d = await ouvreFichier(filename);
	const resu: string[] = [];
	const taille = d.length - 1;
	for (let i: number = quantite - 1; i >= 0; i--) {
		resu.push(d[taille - i].nb + "");
	}
	return resu;
};

export default async function prime(
	req: NextApiRequest,
	res: NextApiResponse<Result>
) {
	if (req.method === "GET") {
		const nb_str = req.query.n;

		let nb: bigint = getNombre(nb_str);
		let resu: Result = {
			index: nb.toString(),
			premiers: ["2"],
			isError: nb === -1n ? true : false,
		};

		if (resu.isError) {
			res.status(500).json(resu);
			return;
		}

		const filename = getFileName(nb);
		if (filename === "ERR") {
			resu.premiers = ["2"];
			resu.isError = true;
		} else {
			const d = await ouvreFichier(filename);
			const index_souhaite = nb;
			const i = d.findIndex((v) => {
				return BigInt(v.index) === index_souhaite;
			});

			if (i > -1) {
				// dans ce cas on a trouvé le nb ième nombre premier !
				let resultats: string[] = [];
				let tmp_index = 9;
				let otherPrimes: string[] = [];
				if (i < tmp_index) {
					// il y a moins de 9 nombres premiers qui précèdent notre nombre recherché
					tmp_index = i;
					// et on cherchera 9-i nombres dans le fichier précédent à partir du dernier nombre premier.
					otherPrimes = await getLastPrimes(
						getPrecedentFilename(filename),
						9 - i
					);
				}
				while (tmp_index >= 0) {
					const tmp_nb = d[i - tmp_index].nb;
					resultats.push(tmp_nb.toString());
					tmp_index--;
				}
				// le cas échéant, on insère les premiers du fichier précédent
				if (otherPrimes.length > 0) {
					resultats.unshift(...otherPrimes);
				}
				resu.premiers = resultats;
				resu.isError = false;
			} else {
				resu.premiers = ["2"];
				resu.isError = true;
			}
		}

		res.status(200).json(resu);
	} else {
		const zero: bigint = 0n;
		const resu: Result = {
			index: zero.toString(),
			premiers: ["2"],
			isError: true,
		};
		res.status(501).json(resu);
	}
}
