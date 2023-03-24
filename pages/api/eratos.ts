import type { NextApiRequest, NextApiResponse } from "next";
import decompose, { Decomposition, DecParams } from "../../utils/decompose";

export type Data = {
	n1: bigint;
	dec_n1: Decomposition;
	n2: bigint;
	dec_n2: Decomposition;
};

const errorData: Data = {
	n1: 0n,
	dec_n1: ["Rien"],
	n2: 0n,
	dec_n2: ["Rien"],
};

export default function eratos(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const meth = req.method;
	if (meth === "POST") {
		// get the two numbers
		let n1: bigint = 0n;
		let n2: bigint = 0n;
		try {
			console.log( "Nombre 1 = " + req.body.n1);
			n1 = BigInt(req.body.n1);
		} catch (error) {
			errorData.dec_n1 = ["Erreur lors conversion nombre 1"];
			res.status(501).json(errorData);
			return;
		}
		try {
			console.log("Nombre 1 = " + req.body.n1);
			n2 = BigInt(req.body.n2);
		} catch (error) {
			errorData.dec_n2 = ["Erreur lors conversion nombre 2"];
			res.status(501).json(errorData);
			return;
		}

		console.log("transfo de N1 et N2 en BigInt réussie");
		const p: DecParams = {
			nb1: n1,
			nb2: n2,
		};
		let resultat_dec: Decomposition[] = [['dummy1'],['dummy2']];
		try {
			resultat_dec = decompose(p);
			
		} catch (error) {
			resultat_dec = [["catch1"], ["catch2"]];
		}
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
