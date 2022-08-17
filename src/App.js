import { useEffect, useState } from "react";
import { fetchAllPokemon, fetchPokemonDetailsByName, fetchEvolutionChainById } from "./api";

function App() {
    const [pokemonIndex, setPokemonIndex] = useState([])
    const [pokemon, setPokemon] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const [pokemonDetails, setPokemonDetails] = useState()

    useEffect(() => {
        const fetchPokemon = async () => {
            const {results: pokemonList} = await fetchAllPokemon()

            setPokemon(pokemonList)
            setPokemonIndex(pokemonList)
            setPokemonDetails()
        }

        fetchPokemon().then(() => {
            /** noop **/
        })
    }, [])

    const onSearchValueChange = (event) => {
        const value = event.target.value
        setSearchValue(value)
        if (!value) {
            setPokemonIndex(pokemon);
            return;
        } 

        setPokemonIndex(
            pokemon.filter(monster => monster.name.includes(value))
        )
    }

    const onGetDetails = (name) => async () => {
        const fetchOnePokemon = async (name) => {
            const details = await fetchPokemonDetailsByName(name);
            const chain = await fetchEvolutionChainById(details.id);

            setPokemonDetails({
                ...details,
                ...chain,
            })
        }

        fetchOnePokemon(name)
    }

    const getEvolutionChain = (chain) => {
        let evolutions = [chain?.species.name];
        let chainPt = chain;

        while(chainPt) {
            if (chainPt.evolves_to.length) {
                chainPt = chainPt.evolves_to[0];
                evolutions.push(chainPt.species.name);
            } else {
                chainPt = undefined;
            }
        }

        return evolutions.join(" ");
    }

    return (
        <div className={'pokedex__container'}>
            <div className={'pokedex__search-input'}>
                <input value={searchValue} onChange={onSearchValueChange} placeholder={'Search Pokemon'}/>
            </div>
            <div className={'pokedex__content'}>
                {pokemon.length > 0 && (
                    <div className={'pokedex__search-results'}>
                        {
                            !searchValue || (searchValue && pokemonIndex.length) ? pokemonIndex.map(monster => {
                                return (
                                    <div className={'pokedex__list-item'} key={monster.name}>
                                        <div>
                                            {monster.name}
                                        </div>
                                        <button onClick={onGetDetails(monster.name)}>Get Details</button>
                                    </div>
                                )
                            }) : <div>No results found</div>
                        }
                    </div>
                )}
                {
                    pokemonDetails && (
                        <div className={'pokedex__details'}>
                            <div className="pokedex__details_header">{pokemonDetails.name}</div>
                            <div className="pokedex__details_typesandmoves">
                                <div>
                                    <div className="pokedex__details_header">Types</div>
                                    <ul>
                                        {pokemonDetails.types?.map(type => (<li key={type.slot}>{type.type.name}</li>))}
                                    </ul>
                                </div>
                                <div>
                                    <div className="pokedex__details_header">Moves</div>
                                    <ul>
                                        {pokemonDetails.moves?.slice(0,4).map((move, idx) => (<li key={idx}>{move.move.name}</li>))}
                                    </ul>
                                </div>
                            </div>
                            <div>
                                <div className="pokedex__details_header">Evolutions</div>
                                <div className="pokedex_details-evolutions">{getEvolutionChain(pokemonDetails.chain)}</div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
}

export default App;
