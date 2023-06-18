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

const getFileName = (nb: bigint) => {
	//console.log("traitement de " + nb.toString());
	if (nb === -1n) {
		return "ERR";
	}
	if (nb <= 1000n) {
		return "primes-0-1000-.json";
	} else if (nb <= 3000n) {
		return "primes-1000-3000-.json";
	} else if (nb <= 5000n) {
		return "primes-3000-5000-.json";
	} else if (nb <= 8000n) {
		return "primes-5000-8000-.json";
	} else if (nb <= 11000n) {
		return "primes-8000-11000-.json";
	} else if (nb <= 15000n) {
		return "primes-11000-15000-.json";
	} else if (nb <= 20000n) {
		return "primes-15000-20000-.json";
	} else if (nb <= 30000n) {
		return "primes-20000-30000-.json";
	} else if (nb <= 50000n) {
		return "primes-30000-50000-.json";
	} else if (nb <= 100000n) {
		return "primes-50000-100000-.json";
	} else if (nb <= 150000n) {
		return "primes-100000-150000-.json";
	} else {
		return "primes-150000-200000-.json";
	}
};

export default async function prime(
	req: NextApiRequest,
	res: NextApiResponse<Result>
) {
	if (req.method === "GET") {
		const nb_str = req.query.n;

		let nb: bigint = getNombre(nb_str);
		//console.log("Resultat pour nb = " + nb.toString());
		let resu: Result = {
			index: nb.toString(),
			premiers: ["2"],
			isError: nb === -1n ? true : false,
		};

		if (resu.isError) {
			res.status(500).json(resu);
			return;
		}

		const jsonDirectory = path.join(process.cwd(), "json");
		const filename = getFileName(nb);
		if (filename === "ERR") {
			resu.premiers = ["2"];
			resu.isError = true;
			console.log("Filename = ERR");
		} else {
			//console.log("Filename = " + filename);
			//Read the json data file data.json
			const fileContents = await fs.readFile(
				jsonDirectory + "/" + filename,
				"utf8"
			);
			const d: { index: number; nb: number }[] = JSON.parse(fileContents);
			/*			console.log(
				"longueur du tableau lu JSON = " +
					d.length +
					" avec index = " +
					(nb - 1n).toString()
			); */

			const index_souhaite = nb - 1n;

			const i = d.findIndex((v) => {
				return BigInt(v.index) === index_souhaite;
			});

			if (i > -1) {
				//console.log("index trouvé = " + i);
				let resultats: string[] = [];
				let tmp_index = 9;
				if (i < tmp_index) {
					tmp_index = i;
				}
				while (tmp_index >= 0) {
					const tmp_nb = d[i - tmp_index].nb;
					resultats.push(tmp_nb.toString());
					tmp_index--;
				}
				resu.premiers = resultats;
				resu.isError = false;
			} else {
				//console.log("index non trouvé (" + i + ")");
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
