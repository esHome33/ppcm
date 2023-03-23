import {
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	Container,
	TextField,
	Typography,
} from "@mui/material";
import { useState } from "react";
import decompose, { Decomposition, DecParams } from "../utils/decompose";
import ResuCard from "./ResuCard";

const Decomposeur = () => {
	const [resVisible, setResVisible] = useState<boolean>(false);
	const [val_nb1, setVal_nb1] = useState<bigint>(0n);
	const [val_nb2, setVal_nb2] = useState<bigint>(0n);
	const [dec1, setdec1] = useState<Decomposition>([]);
	const [dec2, setdec2] = useState<Decomposition>([]);

	const chg_nb1 = (val: string) => {
		setResVisible(false);
		setVal_nb1(BigInt(val));
		console.log("NB 1 changé : " + val_nb1 + " !");
	};

	const chg_nb2 = (val: string) => {
		setResVisible(false);
		setVal_nb2(BigInt(val));
		console.log("NB 2 changé : " + val_nb2 + " !");
	};

	const goCalc = () => {
		let p: DecParams = {
			nb1: val_nb1,
			nb2: val_nb2,
		};

		let resu = decompose(p);
		setResVisible(true);
		setdec1(resu[0]);
		setdec2(resu[1]);
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
					<ResuCard
						nombre1={val_nb1}
						decomp1={dec1}
						nombre2={val_nb2}
						decomp2={dec2}
					/>
					<Card
						className="bg-orange-50"
						variant="elevation"
					>
						<CardHeader
							className=" text-sm text-teal-700"
							title={"Résultat :"}
						/>
						<CardContent>
							<Typography>
								{val_nb1.toString() +
									" est produit de " +
									dec1.toString()}
							</Typography>
							<Typography>
								<br></br>
							</Typography>
							<Typography>
								{val_nb2.toString() +
									" est produit de " +
									dec2.toString()}
							</Typography>
						</CardContent>
					</Card>
				</Box>
			</Container>
		</>
	);
};

export default Decomposeur;
