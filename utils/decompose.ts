export type DecParams = {
    nb1: bigint;
    nb2: bigint;
}

export type Decomposition = string[];

const euclide = (nb: bigint) => {
    let dec: Decomposition = [];
    const moitie = nb / 2n;
    let div = nb;
    
    for (let index = 2n; index < moitie + 1n; index = index + 1n) {
        if (index > 3n) {
            if (index % 2n === 0n) {
                // sauter les multiples de deux
                continue;
            }
            if (index % 3n === 0n) {
                // sauter les multiples de 3
                continue;
            }
            // diviser par index et compter le nombre de fois qu'on peut le faire.
            div = div / index;
            let rest = div % index;
            while (rest === 0n) {
                dec.push(index.toString());
            }
            // ajouter index dans la table des multiples déjà traités.

        } else if(index === 2n) {
            let div = nb / index;
            let rest = nb % index;
            while (rest === 0n) {
                dec.push("2");
            }
        } else {

        }

    }
}

const decompose = (params : DecParams) =>{
    const n1 = params.nb1;
    const n2 = params.nb2;

    const resu1: Decomposition = [];
    const resu2: Decomposition = [];
    const resu: Decomposition[] = []
    resu1.push("nb1-1");
    resu1.push("nb1-2");
    resu1.push('nb1-3');
    resu2.push("nb2-1");
	resu2.push("nb2-2");
	resu2.push("nb2-3");

    resu.push(resu1);
    resu.push(resu2);
    return resu;
};




export default decompose;