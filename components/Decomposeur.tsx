import {
	Button,
	CircularProgress,
	Container,
	List,
	ListItem,
	TextField,
	Typography,
} from "@mui/material";
import { useState } from "react";
import decompose, { Decomposition, DecParams } from "../utils/decompose";
import ResuCard from "./ResuCard";

const Decomposeur = () => {
	const [resVisible, setResVisible] = useState<boolean>(false);
	const [attenteVisible, setAttenteVisible] = useState<boolean>(false);
	const [val_nb1, setVal_nb1] = useState<bigint>(0n);
	const [val_nb2, setVal_nb2] = useState<bigint>(0n);
	const [dec1, setdec1] = useState<Decomposition>([]);
	const [dec2, setdec2] = useState<Decomposition>([]);
	let timerValue: number = 0;

	const chg_nb1 = (val: string) => {
		setResVisible(false);
		setAttenteVisible(false);
		setVal_nb1(BigInt(val));
		console.log("NB 1 changé : " + val_nb1 + " !");
	};

	const chg_nb2 = (val: string) => {
		setResVisible(false);
		setAttenteVisible(false);
		setVal_nb2(BigInt(val));
		console.log("NB 2 changé : " + val_nb2 + " !");
	};

	const goCalc = () => {
		let p: DecParams = {
			nb1: val_nb1,
			nb2: val_nb2,
		};
		setAttenteVisible(true);
		let resu = decompose(p);
		setResVisible(true);
		setAttenteVisible(false);
		setdec1(resu[0]);
		setdec2(resu[1]);
		console.log(resu);
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
								chg_nb1(e.target.value);
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
								chg_nb2(e.target.value);
							}}
						/>
					</ListItem>
					<ListItem>
						<Button
							variant="contained"
							className="text-white bg-slate-500"
							fullWidth
							onClick={() => {
								goCalc();
							}}
						>
							Go
						</Button>
					</ListItem>
					{attenteVisible ? (
						<ListItem>
							<CircularProgress className="mr-4" />
							<Typography variant="body2">
								Calcul en cours {" (" + timerValue + "%)"}
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
							/>
						</ListItem>
					) : null}
				</List>
			</Container>
		</>
	);
};

export default Decomposeur;
