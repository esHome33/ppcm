import {
	Button,
	CircularProgress,
	Container,
	List,
	ListItem,
	TextField,
	Typography,
} from "@mui/material";
import useLocalStorage from "@rehooks/local-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Data } from "../pages/api/eratos";
import decompose, {
	Decomposition,
	DecParams,
	EmptyEuclideResponse,
	EuclideResponse,
} from "../utils/decompose";
import { PrimeKey, AddToPrimesList } from "../utils/localst";
import ResuCard from "./ResuCard";
import { useRouter } from "next/router";

type Props = {
	local: boolean;
};

const Decomposeur = (props: Props) => {
	const [resVisible, setResVisible] = useState<boolean>(false);
	const [attenteVisible, setAttenteVisible] = useState<boolean>(false);
	const [btnDisabled, setbtnDisable] = useState<boolean>(false);
	const [val_nb1, setVal_nb1] = useState<bigint>(0n);
	const [val_nb2, setVal_nb2] = useState<bigint>(0n);
	const [duree_calcul, setDuree_calcul] = useState<string | undefined>(
		undefined
	);

	const [dec1, setdec1] = useState<EuclideResponse>(EmptyEuclideResponse);
	const [dec2, setdec2] = useState<EuclideResponse>(EmptyEuclideResponse);

	const [primes, setPrimes] = useLocalStorage<string[]>(PrimeKey);

	useEffect(() => {
		if (resVisible) {
			window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
		} else {
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	}, [resVisible]);

	const router = useRouter();

	const chg_nb1 = (val: string) => {
		setResVisible(false);
		setAttenteVisible(false);
		setDuree_calcul(undefined);
		let nombre: bigint = 0n;
		try {
			nombre = BigInt(val);
			setVal_nb1(nombre);
		} catch (ex: any) {
			throw new Error(ex.message);
		}
	};

	const chg_nb2 = (val: string) => {
		setResVisible(false);
		setAttenteVisible(false);
		setDuree_calcul(undefined);
		let nombre: bigint = 0n;
		try {
			nombre = BigInt(val);
			setVal_nb2(nombre);
		} catch (ex: any) {
			throw new Error(ex.message);
		}
	};

	const formateMS = (millis: number) => {
		if (millis < 1100) {
			return millis + " ms";
		} else if (millis < 60000) {
			const m_in_sec = millis / 1000;
			const m_s_arrondi = m_in_sec.toFixed(1);
			return m_s_arrondi + " s";
		} else if (millis < 3600000) {
			const mn = millis / 60000;
			const ss = (millis - Math.floor(mn) * 60000) / 1000;
			return mn.toFixed(0) + " mn " + ss.toFixed(0) + " s";
		} else {
			const hh = millis / 3600000;
			const mn = (millis - Math.floor(hh) * 3600000) / 60000;
			const ss =
				(millis - Math.floor(mn) * 60000 - Math.floor(hh) * 3600000) / 1000;
			return (
				hh.toFixed(0) +
				" h " +
				mn.toFixed(0) +
				" mn " +
				ss.toFixed(0) +
				" s"
			);
		}
	};

	//setPrimes(storePrimes([3n, 7n, 9n], ""));

	/**
	 * décomposition exécutée sur le client (utilise les promesses mais bloque quand même l'ui).
	 */
	const decomposer = () => {
		let DD: Date;
		DD = new Date();
		let p: DecParams = {
			nb1: BigInt(val_nb1),
			nb2: BigInt(val_nb2),
		};

		const prom = new Promise<EuclideResponse[]>((resolve, reject) => {
			try {
				let resu = decompose(p);
				resolve(resu);
			} catch (error) {
				reject(error);
			}
		});
		prom
			.then((res) => {
				let l1: string[] | null = [];
				let l2: string[] | null = [];
				if (!res[0].isError) {
					l1 = AddToPrimesList(res[0].dec, primes);
				}
				if (!res[1].isError) {
					l2 = AddToPrimesList(res[1].dec, l1);
				}
				setPrimes(l2);
				setdec1(res[0]);
				setdec2(res[1]);
				const DA = new Date();
				const ecart = DA.getTime() - DD.getTime();
				setDuree_calcul(formateMS(ecart));
				setAttenteVisible(false);
				setResVisible(true);
				setbtnDisable(false);
			})
			.catch((err) => {
				setdec1({
					dec: ["Erreur calcul", JSON.stringify(err)],
					nb: 0n,
					isError: true,
				});
				setdec2({ dec: ["//"], nb: 0n, isError: true });
				const DA = new Date();
				const ecart = DA.getTime() - DD.getTime();
				setDuree_calcul(formateMS(ecart));
				setAttenteVisible(false);
				setResVisible(true);
				setbtnDisable(false);
			});
	};

	/**
	 * fonction de décomposition localisée sur le client (fonction decomposer())
	 */
	const goCalc = () => {
		setbtnDisable(true);
		setAttenteVisible(true);
		setResVisible(false);

		// lancer la décomposition après un court (300ms) délai d'attente afin que l'affichage
		// se remette à jour.
		setTimeout(() => {
			decomposer();
		}, 400);
	};

	/**
	 * decomposition lancée sur le serveur
	 */
	const runOnServer = () => {
		const t_depart = new Date();
		axios
			.post<Data>("api/eratos", {
				n1: val_nb1.toString(),
				n2: val_nb2.toString(),
			})
			.then((response) => {
				const d1 = response.data.dec_n1;
				const d2 = response.data.dec_n2;
				const d1_ok: EuclideResponse = {
					dec: d1.dec,
					nb: BigInt(d1.nb),
					isError: d1.isError,
				};
				const d2_ok: EuclideResponse = {
					dec: d2.dec,
					nb: BigInt(d2.nb),
					isError: d2.isError,
				};
				// store the new primes in local storage
				let l1: string[] | null = [];
				let l2: string[] | null = [];
				if (!d1_ok.isError) {
					l1 = AddToPrimesList(d1_ok.dec, primes);
				}
				if (!d2_ok.isError) {
					l2 = AddToPrimesList(d2_ok.dec, l1);
				}
				// store the new prime list
				setPrimes(l2);
				// determine the total compute time used.
				const t_arrivee = new Date();
				const diff = t_arrivee.getTime() - t_depart.getTime();
				setDuree_calcul(formateMS(diff));
				setAttenteVisible(false);
				setResVisible(true);
				setbtnDisable(false);
				setdec1(d1_ok);
				setdec2(d2_ok);
			})
			.catch((err) => {
				if (axios.isAxiosError(err)) {
					const msg = err.message;
					if (msg.includes("504")) {
						setdec1({
							dec: ["Le temps de calcul max est dépassé (10s)"],
							nb: 0n,
							isError: true,
						});
						setdec2({
							dec: ["Le service est gratuit"],
							nb: 0n,
							isError: true,
						});
					} else {
						setdec1({
							dec: [err.name, err.message],
							nb: 0n,
							isError: true,
						});
						setdec2({ dec: [""], nb: 0n, isError: true });
					}
				} else {
					setdec1({
						dec: ["Erreur au niveau du serveur !"],
						nb: 0n,
						isError: true,
					});
				}
				setAttenteVisible(false);
				setResVisible(true);
				setbtnDisable(false);
			});
	};

	/**
	 * fonction de décomposition localisée sur le serveur
	 */
	const goCalc2 = () => {
		setAttenteVisible(true);
		setResVisible(false);
		setbtnDisable(true);
		setTimeout(() => {
			runOnServer();
		}, 400);
	};

	/**
	 * Vérifie la saisie utilisateur, stocke la valeur et renvoie un message qui sera transmis à l'utilisateur
	 * par un toast.
	 * @param nbre le nombre saisi par l'utilisateur
	 * @param numero 1 ou 2 = le numéro de la variable à décomposer dans laquelle on va ranger le nombre si tout va bien
	 */
	const filtreNombre: (nbre: string, numero: number) => string = (
		nbre,
		numero
	) => {
		nbre = nbre.split(" ").join("");
		if (nbre.length > 34) {
			return "Les nombres de plus de 34 chiffres ne sont pas traités.";
		}
		if (numero === 1) {
			try {
				chg_nb1(nbre);
			} catch (error: any) {
				return "Il faut un nombre sans caractères et de moins de 35 chiffres.";
			}
		} else if (numero === 2) {
			try {
				chg_nb2(nbre);
			} catch (error: any) {
				return "Il faut un nombre sans caractères et de moins de 35 chiffres.";
			}
		}
		if (nbre.length > 16) {
			return "Ca peut prendre beaucoup de temps (plus d'une minute) ...";
		} else {
			return "";
		}
	};

	return (
		<>
			<Container className="rounded-lg flex flex-col w-8/12 p-4 gap-3">
				<List>
					<ListItem>
						<TextField
							id="nb1"
							label="nombre 1"
							variant="outlined"
							fullWidth
							onChange={(e) => {
								const msg = filtreNombre(e.target.value, 1);
								if (msg.length > 0) {
									toast.error(msg, {
										duration: 1300,
									});
								}
							}}
							value={val_nb1.toString()}
						/>
					</ListItem>
					<ListItem>
						<TextField
							id="nb1"
							label="nombre 2"
							variant="outlined"
							fullWidth
							onChange={(e) => {
								const msg = filtreNombre(e.target.value, 2);
								if (msg.length > 0) {
									toast.error(msg, {
										duration: 1300,
									});
								}
							}}
							value={val_nb2.toString()}
						/>
					</ListItem>
					<ListItem>
						<Button
							variant="contained"
							className="text-white bg-slate-500"
							fullWidth
							disabled={btnDisabled}
							onClick={() => {
								if (props.local) {
									goCalc2();
								} else {
									goCalc();
								}
							}}
						>
							{props.local ? "Go (serveur)" : "Go (en local)"}
						</Button>
					</ListItem>
					{attenteVisible ? (
						<ListItem className="mx-auto">
							<CircularProgress className="mr-4" />
							<Typography variant="body2">
								Calcul en cours ...
							</Typography>
						</ListItem>
					) : null}

					{resVisible ? (
						<>
							<ListItem>
								<ResuCard
									nombre1={val_nb1}
									decomp1={dec1.dec}
									decomp1_nb={dec1.nb.toString()}
									nombre2={val_nb2}
									decomp2={dec2.dec}
									decomp2_nb={dec2.nb.toString()}
									duree={duree_calcul}
								/>
							</ListItem>
							<ListItem
								alignItems="center"
								className="flex flex-auto text-center justify-center"
							>
								<Button
									sx={{ marginX: "2px" }}
									variant="contained"
									className="flex mx-2 bg-blue-800 text-white hover:bg-blue-300 hover:text-orange-900"
									onClick={() => {
										let msg = "";
										let msg1 = "";
										let msg2 = "";
										let d1, d2: Decomposition;
										d1 = dec1.dec;
										d2 = dec2.dec;
										let cpt = 0;
										if (
											d1.length === 1 &&
											d1[0] !== "1" &&
											d1[0] !== "0"
										) {
											if (0n === dec1.nb) {
												msg1 = "";
											} else {
												msg1 = dec1.nb.toString();
												cpt++;
											}
										}
										if (
											d2.length === 1 &&
											d2[0] !== "1" &&
											d2[0] !== "0"
										) {
											if (0n === dec2.nb) {
												msg2 = "";
											} else {
												msg2 = dec2.nb.toString();
												cpt++;
											}
										}
										if (msg1.length > 0 || msg2.length > 0) {
											if (cpt === 1) {
												if (msg1.length === 0) {
													msg = msg2 + " est premier ";
												} else if (msg2.length === 0) {
													msg = msg1 + " est premier ";
												} else {
												}
											} else if (cpt === 2) {
												msg =
													msg1 +
													" et " +
													msg2 +
													" sont premiers !";
											} else {
												msg =
													"je n'ai rien à dire sur vos nombres...";
											}
											toast.success(msg);
										} else {
											toast.success(
												"Vos nombres ne sont pas des nombres premiers ! PGCD et le PPCM à venir ...",
												{ duration: 1900 }
											);
										}
										let chaine_query1: string = "";
										for (const elt of dec1.dec) {
											chaine_query1 += elt + ",";
										}
										let chaine_query2: string = "";
										for (const elt of dec2.dec) {
											chaine_query2 += elt + ",";
										}
										chaine_query1 = chaine_query1.slice(
											0,
											chaine_query1.length - 1
										);
										chaine_query2 = chaine_query2.slice(
											0,
											chaine_query2.length - 1
										);
										chaine_query1 += "";
										chaine_query2 += "";

										let query_string: string = "";
										if (chaine_query1 === "0") {
											if (chaine_query2 === "0") {
												// ne rien faire
											} else {
												// n'envoyer que la chaine 2
												query_string += "dec2=" + chaine_query2;
												router.push("/analyse?" + query_string);
											}
										} else {
											if (chaine_query2 === "0") {
												query_string += "dec1=" + chaine_query1;
												router.push("/analyse?" + query_string);
											} else {
												query_string +=
													"dec1=" +
													chaine_query1 +
													"&dec2=" +
													chaine_query2;
												router.push("/analyse?" + query_string);
											}
										}
									}}
								>
									Analyse
								</Button>
								<Button
									sx={{ marginX: "2px" }}
									variant="contained"
									className="flex mx-2 bg-blue-800 text-white hover:bg-blue-300 hover:text-orange-900"
									onClick={() => {
										window.scrollTo({ top: 0, behavior: "smooth" });
									}}
								>
									UP
								</Button>
							</ListItem>
						</>
					) : null}
				</List>
			</Container>
		</>
	);
};

export default Decomposeur;
