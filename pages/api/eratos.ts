import type { NextApiRequest, NextApiResponse } from "next";
import decompose, { Decomposition, DecParams } from "../../utils/decompose";

export type Data = {
	n1: number;
	dec_n1: Decomposition;
	n2: number;
	dec_n2: Decomposition;
};

const errorData: Data = {
	n1: 0,
	dec_n1: ["Rien"],
	n2: 0,
	dec_n2: ["Rien"],
};

export default function eratos(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const meth = req.method;
	if (meth === "POST") {
		// get the two numbers
		let n1: number = 0;
		let n2: number = 0;
		try {
			n1 = Number(req.body.n1);
		} catch (error) {
			errorData.dec_n1 = ["Erreur lors conversion nombre 1"];
			res.status(501).json(errorData);
			return;
		}
		try {
			n2 = Number(req.body.n2);
		} catch (error) {
			errorData.dec_n2 = ["Erreur lors conversion nombre 2"];
			res.status(501).json(errorData);
			return;
		}

		const p: DecParams = {
			nb1: BigInt(n1),
			nb2: BigInt(n2),
		};
		const resultat_dec = decompose(p);
		const OKData: Data = {
			n1: n1,
			n2: n2,
			dec_n1: resultat_dec[0],
			dec_n2: resultat_dec[1],
		};
		res.status(200).json(OKData);
	} else {
		errorData.dec_n1 = ["Protocole " + meth + " non accepté par le serveur"];
		errorData.dec_n2 = ["Protocole " + meth + " non accepté par le serveur"];
		res.status(501).json(errorData);
	}
}
