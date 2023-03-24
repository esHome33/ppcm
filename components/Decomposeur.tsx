import {
	Button,
	CircularProgress,
	Container,
	List,
	ListItem,
	TextField,
	Typography,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Data } from "../pages/api/eratos";
import { Decomposition } from "../utils/decompose";
import ResuCard from "./ResuCard";

const Decomposeur = () => {
	const [resVisible, setResVisible] = useState<boolean>(false);
	const [attenteVisible, setAttenteVisible] = useState<boolean>(false);
	const [btnDisabled, setbtnDisable] = useState<boolean>(false);
	const [val_nb1, setVal_nb1] = useState<bigint>(0n);
	const [val_nb2, setVal_nb2] = useState<bigint>(0n);
	const [duree_calcul, setDuree_calcul] = useState<string | undefined>(undefined);

	const [dec1, setdec1] = useState<Decomposition>([]);
	const [dec2, setdec2] = useState<Decomposition>([]);

	const chg_nb1 = (val: string) => {
		setResVisible(false);
		setAttenteVisible(false);
		setVal_nb1(BigInt(val));
		//console.log("NB 1 changé : " + val_nb1 + " !");
	};

	const chg_nb2 = (val: string) => {
		setResVisible(false);
		setAttenteVisible(false);
		setVal_nb2(BigInt(val));
		//console.log("NB 2 changé : " + val_nb2 + " !");
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
			const ss = (millis - Math.floor(mn)*60000) / 1000
			return mn.toFixed(0) + " mn " + ss.toFixed(0) + " s";
		} else {
			const hh = millis / 3600000;
			const mn = (millis - Math.floor(hh) * 3600000) / 60000;
			const ss = (millis - Math.floor(mn) * 60000 - Math.floor(hh) * 3600000) / 1000;
			return hh.toFixed(0) + " h " + mn.toFixed(0) + " mn " + ss.toFixed(0) + " s";
		}
	}

	/*const goCalc = () => {
		let p: DecParams = {
			nb1: BigInt(val_nb1),
			nb2: BigInt(val_nb2),
		};
		setAttenteVisible(true);
		let resu = decompose(p);
		setResVisible(true);
		setAttenteVisible(false);
		setdec1(resu[0]);
		setdec2(resu[1]);
		//console.log(resu);
	};*/

	const goCalc2 = () => {
		setAttenteVisible(true);
		setResVisible(false);
		setbtnDisable(true);
		const t_depart = new Date();
		axios
			.post<Data>("api/eratos", {
				n1: val_nb1.toString(),
				n2: val_nb2.toString(),
			})
			.then((response) => {
				const d1 = response.data.dec_n1;
				const d2 = response.data.dec_n2;
				const t_arrivee = new Date();
				const diff =  t_arrivee.getTime() - t_depart.getTime();
				setDuree_calcul(formateMS(diff));
				setAttenteVisible(false);
				setResVisible(true);
				setbtnDisable(false);
				setdec1(d1);
				setdec2(d2);
			})
			.catch((err) => {
				if (axios.isAxiosError(err)) {
					setdec1([err.name , err.message, ""+err.status]);
					setdec2(["Erreur AXIOS"]);
				} else {
					setdec1(["Erreur au niveau du serveur !"]);
				}
				setAttenteVisible(false);
				setResVisible(true);
				setbtnDisable(false);
			});
	};

	return (
		<>
			<Container className="rounded-lg flex flex-col w-8/12 p-4 gap-3">
				<List>
					<ListItem>
						<TextField
							id="nb1"
							label="nombre 1"
							fullWidth
							onChange={(e) => {
								if (e.target.value.length > 14) {
									toast.error(
										"La représentation de nombres à plus de 14 chiffres est impossible",
										{ duration: 2000 }
									);
									return;
								}
								if (e.target.value.length > 8) {
									toast.error(
										"La décomposition de nombres à plus de 9 chiffres est excessivement longue !",
										{ duration: 2000 }
									);
								}
								try {
									chg_nb1(e.target.value);
								} catch (error) {
									toast.error("Seuls des nombres sont autorisés !");
								}
							}}
							variant="outlined"
						/>
					</ListItem>
					<ListItem>
						<TextField
							id="nb1"
							label="nombre 2"
							variant="outlined"
							fullWidth
							onChange={(e) => {
								if (e.target.value.length > 14) {
									toast.error(
										"La représentation de nombres à plus de 14 chiffres est impossible",
										{ duration: 2000 }
									);
									return;
								}
								if (e.target.value.length > 8) {
									toast.error(
										"La décomposition de nombres à plus de 9 chiffres est excessivement longue !",
										{ duration: 2000 }
									);
								}
								try {
									chg_nb2(e.target.value);
								} catch (error) {
									toast.error("Seuls des nombres sont autorisés !");
								}
							}}
						/>
					</ListItem>
					<ListItem>
						<Button
							variant="contained"
							className="text-white bg-slate-500"
							fullWidth
							disabled={btnDisabled}
							onClick={() => {
								goCalc2();
							}}
						>
							Go
						</Button>
					</ListItem>
					{attenteVisible ? (
						<ListItem>
							<CircularProgress className="mr-4" />
							<Typography variant="body2">
								Calcul en cours ...
							</Typography>
						</ListItem>
					) : null}

					{resVisible ? (
						<ListItem>
							<ResuCard
								nombre1={val_nb1}
								decomp1={dec1}
								nombre2={val_nb2}
								decomp2={dec2}
								duree = {duree_calcul}
							/>
						</ListItem>
					) : null}
				</List>
			</Container>
		</>
	);
};

export default Decomposeur;
