import {
	Box,
	Button,
	Card,
	CardHeader,
	Container,
	TextField,
} from "@mui/material";
import { ChangeEvent, useState } from "react";
import decompose, { DecParams } from "../utils/decompose";

const Decomposeur = () => {
	const [resVisible, setResVisible] = useState<boolean>(true);
	const [val_nb1, setVal_nb1] = useState<bigint>(0n);
	const [val_nb2, setVal_nb2] = useState<bigint>(0n);

	const chg_nb1 = (val: string) => {
		setVal_nb1(BigInt(val));
		console.log("NB 1 changé : " + val_nb1 + " !");
	};

	const chg_nb2 = (val: string) => {
		setVal_nb2(BigInt(val));
		console.log("NB 2 changé : " + val_nb2 + " !");
	};

	const goCalc = () => {
		let p: DecParams = {
			nb1: val_nb1,
			nb2: val_nb2,
		};

		let resu = decompose(p);
		console.log(resu);
	};

	return (
		<>
			<Container className="rounded-lg flex flex-col w-8/12 p-4 gap-3">
				<TextField
					id="nb1"
					label="nombre 1"
					onChange={(e) => {
						chg_nb1(e.target.value);
					}}
					variant="outlined"
				/>
				<TextField
					id="nb1"
					label="nombre 2"
					variant="outlined"
					onChange={(e) => {
						chg_nb2(e.target.value);
					}}
				/>
				<Button
					variant="contained"
					className="text-white bg-slate-500"
					onClick={() => {
						goCalc();
					}}
				>
					Go
				</Button>
				<Box visibility={resVisible ? "visible" : "hidden"}>
					<Card>
						<CardHeader>Résultat</CardHeader>
					</Card>
				</Box>
			</Container>
		</>
	);
};

export default Decomposeur;
