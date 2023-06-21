import type { NextApiRequest, NextApiResponse } from "next";
import Approximateur from "../../lib/approximateur";

/**
 * cet API rend ce type de données
 */
export type ApproxData = {
	/**
	 * le nombre de départ
	 */
	nombre: number;
	/**
	 * le nombre premier juste inférieur au nombre de départ
	 */
	nombre_avant: number;
	/**
	 * l'index du nombre premier juste inférieur au nombre de départ
	 */
	index_nombre_avant: number;

	/**
	 * le nombre premier juste supérieur au nombre de départ
	 */
	nombre_apres: number;
	/**
	 * l'index du nombre premier juste supérieur au nombre de départ
	 */
	index_nombre_apres: number;
	/**
	 * si le retour est une erreur
	 */
	error: boolean;
};

export default async function approx(
	req: NextApiRequest,
	res: NextApiResponse<ApproxData>
) {
	const meth = req.method;
	if (meth === "POST") {
		/// récup du nombre dans la requête
		const nb = Number(req.body.nombre);
		let approximateur: Approximateur;
		try {
			approximateur = await Approximateur.CreateNewApproximateur(nb);
			const resu: ApproxData = {
				nombre: approximateur.getNumber(),
				nombre_apres: approximateur.getPremierApres(),
				nombre_avant: approximateur.getPermierAvant(),
				index_nombre_apres: approximateur.getIndexPremierApres(),
				index_nombre_avant: approximateur.getIndexPremierAvant(),
				error: false,
			};
			res.status(200).json(resu);
		} catch (error) {
			const resu: ApproxData = {
				nombre: nb,
				nombre_apres: -1,
				nombre_avant: -1,
				index_nombre_apres: -1,
				index_nombre_avant: -1,
				error: true,
			};
			res.status(501).json(resu);
		}
	} else {
		const resu: ApproxData = {
			nombre: -1,
			nombre_apres: -1,
			nombre_avant: -1,
			index_nombre_apres: -1,
			index_nombre_avant: -1,
			error: true,
		};
		res.status(501).json(resu);
	}
}
