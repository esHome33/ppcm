import { List, ListItem, Typography } from "@mui/material";
import { useLocalStorage } from "@rehooks/local-storage/lib/use-localstorage";
import { useEffect } from "react";
import { GetBigintFromString, PrimeKey } from "../utils/localst";

const Store = () => {
	const [primeList] = useLocalStorage<string[]>(PrimeKey);
	let premiers: bigint[] = [];
	useEffect(() => {
		if (primeList) premiers = GetBigintFromString(primeList);
	}, [primeList]);

	return (
		<List
			className="bg-orange-200"
			dense
		>
			<ListItem>
				<Typography variant="body2">
					contenu local storage {primeList}
				</Typography>
			</ListItem>
			{premiers.map((elt) => {
				return (
					<ListItem>
						<Typography variant="body2">{elt.toString()}</Typography>
					</ListItem>
				);
			})}
		</List>
	);
};

export default Store;
