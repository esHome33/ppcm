import type { NextApiRequest, NextApiResponse } from "next";
import decompose, {
	Decomposition,
	DecParams,
	EuclideResponse,
} from "../../utils/decompose";

export type Data = {
	dec_n1: { dec: Decomposition; nb: string; isError: boolean };
	dec_n2: { dec: Decomposition; nb: string; isError: boolean };
};

const errorData: Data = {
	dec_n1: {
		dec: ["Rien"],
		nb: "0",
		isError: true,
	},
	dec_n2: {
		dec: ["Rien"],
		nb: "0",
		isError: true,
	},
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
			n1 = BigInt(req.body.n1);
		} catch (error) {
			errorData.dec_n1.dec = ["Erreur lors conversion nombre 1"];
			errorData.dec_n1.nb = req.body.n1;
			res.status(501).json(errorData);
			return;
		}
		try {
			n2 = BigInt(req.body.n2);
		} catch (error) {
			errorData.dec_n2.dec = ["Erreur lors conversion nombre 2"];
			errorData.dec_n1.nb = req.body.n2;
			res.status(501).json(errorData);
			return;
		}

		//console.log("transfo de N1 et N2 en BigInt réussie");
		const p: DecParams = {
			nb1: n1,
			nb2: n2,
		};

		let resultat_dec: EuclideResponse[];
		try {
			resultat_dec = decompose(p);
		} catch (error) {
			const resp1 = {
				dec: ["decompose nb1 server error : " + JSON.stringify(error)],
				nb: p.nb1,
				isError: true,
			};
			const resp2 = {
				dec: ["decompose nb2 server error : " + JSON.stringify(error)],
				nb: p.nb2,
				isError: true,
			};
			resultat_dec = [resp1, resp2];
		}

		const OKData: Data = {
			dec_n1: {
				dec: resultat_dec[0].dec,
				nb: resultat_dec[0].nb.toString(),
				isError: resultat_dec[0].isError,
			},
			dec_n2: {
				dec: resultat_dec[1].dec,
				nb: resultat_dec[1].nb.toString(),
				isError: resultat_dec[1].isError,
			},
		};
		res.status(200).json(OKData);
	} else {
		errorData.dec_n1.dec = [
			"Protocole " + meth + " non accepté par le serveur",
		];
		errorData.dec_n2.dec = [
			"Protocole " + meth + " non accepté par le serveur",
		];
		res.status(501).json(errorData);
	}
}
