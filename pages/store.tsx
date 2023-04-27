import { Container, List, ListItem, Typography } from "@mui/material";
import { useLocalStorage } from "@rehooks/local-storage/lib/use-localstorage";
import { GetBigintFromString, PrimeKey } from "../utils/localst";

const Store = () => {
	const [primeList] = useLocalStorage<string[]>(PrimeKey, ["000"]);
	let premiers: bigint[] = [];
	if (primeList) premiers = GetBigintFromString(primeList);

	return (
		<Container sx={{ width: "80%", alignContent: "center" }}>
			<List
				className="bg-orange-100"
				dense
			>
				<ListItem
					key={-1}
					sx={{
						width: "100%",
						backgroundColor: "bisque",
						textAlign: "center",
						marginLeft: "auto",
						marginRight: "auto",
						padding: "8px",
						display: "block",
					}}
				>
					<Typography variant="body2">
						contenu de votre local storage
					</Typography>
				</ListItem>
				{premiers.map((elt, index) => {
					return (
						<ListItem key={index}>
							<Typography variant="body2">
								{"n°" + (index + 1)} <span className="mx-4"> : </span>{" "}
								{"  " + elt.toString()}
							</Typography>
							<br />
						</ListItem>
					);
				})}
			</List>
		</Container>
	);
};

export default Store;
