import {
	Button,
	Container,
	List,
	ListItem,
	TextField,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Result } from "../pages/api/prime";
import axios from "axios";

type Props = {
	nombre: string;
	storeValue: (val: string) => void;
};

const Quantieme = (props: Props) => {
	const param = props.nombre;
	const [val, setVal] = useState<number|"">("");
	const [prem, setPrem] = useState([""]);
	const [affdetail, setAffdetail] = useState(false);
	const [erreur, setErreur] = useState(false);

	useEffect(() => {
		if (param) {
			if (param === "") {
				setVal(param);
			} else {
				setVal(Number(param));
			}
		}
	},[]);

	const chercheNb = (nb: number) => {
		axios
			.get<Result>("/api/prime?n=" + nb)
			.then((resp) => {
				const une_erreur = resp.data.isError;
				if (une_erreur) {
					setErreur(true);
					setPrem(["Erreur recherche premiers"]);
				} else {
					setErreur(false);
					setPrem(resp.data.premiers);
				}
			})
			.catch((err: { message: string }) => {
				setErreur(true);
				setPrem([err.message]);
			});
	};


	return (
		<>
			<Typography className="mt-3">
				Indiquez le numéro d'ordre du nombre premier que vous souhaitez voir
				afficher (maxi : 400000° pour le moment).
			</Typography>
			<div className="flex flex-col">
				<TextField
					variant="outlined"
					label="numéro du nombre premier cherché"
					sx={{ height: "100%", maxWidth: "80%", marginTop: "15px" }}
					onChange={(e) => {
						e.preventDefault();
						setAffdetail(false);
						const val = e.target.value;
						if (val === "0" || val === "") {
							setVal("");
							props.storeValue(val);
							return;
						}
						let vel_num: number;
						try {
							vel_num = Number(val);
							setVal(vel_num);
							props.storeValue(val);
						} catch (error) {
							vel_num = 0;
						}
					}}
					value={val}
				/>
				<Button
					variant="contained"
					className="bg-blue-700 text-white"
					sx={{ maxWidth: "80%", marginTop: "8px" }}
					onClick={(e) => {
						e.preventDefault();
						if (val === "") {
							return;
						}
						if (val > 0) {
							chercheNb(val);
							setAffdetail(true);
						}
					}}
					disabled={val === 0 || val === ""}
				>
					Cherche
				</Button>
			</div>

			<br />

			{affdetail ? (
				<Container
					sx={{
						maxWidth: "70%",
					}}
				>
					{val === 0 || val === "" ? (
						<>
							<Typography className="mt-4">
								entrez l&apos;index du nombre premier cherché
							</Typography>
						</>
					) : erreur ? null : (
						<Typography
							sx={{
								marginX: "auto",
								marginTop: "2px",
							}}
						>
							{val <= 9 ? (
								<>
									Voici les {val} nombres précédant le {val}° nombre
									premier
								</>
							) : (
								<>
									Voici les 10 nombres précédant le {val}° nombre
									premier
								</>
							)}
						</Typography>
					)}

					<br />

					<List
						sx={{
							backgroundColor: "#E8F0FE",
							borderRadius: "13px",
							borderWidth: "5px",
							borderColor: "#2871DB",
							color: "#2828FF",

							maxWidth: "90%",
							minWidth: "30%",
						}}
						disablePadding
					>
						{prem.map((premier, index) => {
							let ecart = 9;
							if (val === "") {
								return null;
							}
							if (val <= 9) {
								ecart = val - 1;
							}
							if (erreur) {
								return (
									<ListItem
										key={index}
										sx={{
											lineHeight: "10px",
										}}
									>
										{premier}
									</ListItem>
								);
							} else {
								return (
									<ListItem
										key={index}
										sx={{
											lineHeight: "10px",
											marginX: "auto",
										}}
									>
										<span className="text-xs  italic mr-2">
											{index + val - ecart + "e :"}{" "}
										</span>{" "}
										<span className="font-bold">{premier}</span>
									</ListItem>
								);
							}
						})}
					</List>
				</Container>
			) : null}
		</>
	);
};

export default Quantieme;
