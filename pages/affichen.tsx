import {
	Button,
	Container,
	List,
	ListItem,
	TextField,
	Typography,
} from "@mui/material";
import Layout from "../components/Layout";
import { useState } from "react";
import axios from "axios";
import { Result } from "./api/prime";

const Affichen = () => {
	const [val, setVal] = useState(0);
	const [prem, setPrem] = useState([""]);
	const [affdetail, setAffdetail] = useState(false);
	const [erreur, setErreur] = useState(false);

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
			.catch((err) => {
				setErreur(true);
				setPrem([err.message]);
			});
	};

	return (
		<>
			<Layout
				title="Afficher un nombre premier"
				about_invisible
			>
				<Container
					className="container mx-auto"
					sx={{
						display: "flex",
						flexDirection: "column",
						width: "90%",
						justifyContent: "center",
						textJustify: "auto",
					}}
				>
					<Typography className="mt-4 text-center w-11/12">
						Indiquez le numéro d'ordre du nombre premier que vous
						souhaitez voir afficher (maxi : 200001° pour le moment).
					</Typography>
					<TextField
						variant="outlined"
						label="numéro du nombre premier cherché"
						sx={{ height: "100%", maxWidth: "90%", marginTop: "15px" }}
						onChange={(e) => {
							e.preventDefault();
							setAffdetail(false);
							const val = e.target.value;
							let vel_num: number;
							try {
								vel_num = Number(val);
								setVal(vel_num);
							} catch (error) {
								vel_num = 0;
							}
						}}
					/>
					<Button
						variant="contained"
						className="bg-blue-700 text-white"
						sx={{ maxWidth: "90%", marginTop: "8px" }}
						onClick={(e) => {
							e.preventDefault();
							if (val > 0) {
								chercheNb(val);
								setAffdetail(true);
							}
						}}
					>
						Cherche
					</Button>
				</Container>
				<br />

				{affdetail ? (
					<Container
						className="container mx-auto"
						sx={{
							display: "flex",
							flexDirection: "column",
							width: "90%",
							justifyContent: "center",
							textJustify: "auto",
						}}
					>
						{val === 0 ? (
							<>
								<Typography className="mt-4">
									entrez l&apos;index du premier cherché
								</Typography>
							</>
						) :
							(erreur) ? null :
							
								<Typography className="mt-4" sx={{marginX:'auto'}}>
									{val <= 9 ? (
										<>
											Voici les {val} nombres précédant le {val}°
											nombre premier
										</>
									) : (
										<>
											Voici les 10 nombres précédant le {val}°
											nombre premier
										</>
									)}
								</Typography>
							}
							
						<br />

						<List
							sx={{
								backgroundColor: "#EFF",
								maxWidth: "70%",
								borderRadius: "13px",
								borderWidth: "10px",
								borderColor: '#DDDDFF',
								color: '#057',
								display: 'flex',
								flexDirection: 'column',
								marginX: 'auto',
								paddingX:'5px',
								minWidth:'30%'
							}}
							disablePadding
						>
							{prem.map((premier, index) => {
								let ecart = 9;
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
										}}
										>
											{index + val - ecart + "e :  " + premier}
										</ListItem>
								);
							}
							})}
						</List>
					</Container>
				) : null}
				<br />
				<br />
			</Layout>
		</>
	);
};

export default Affichen;
