import { useEffect, useState } from "react"
import { getFullPokedexNumber, getPokedexNumber } from "../utils"
import TypeCard from './TypeCard'
import Modal from "./Modal"
export default function PokeCard(props) {
    const { selectedPokemon } = props
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [skill, setSkill] = useState(null)
    const [loadingSkill, setLoadingSkill] = useState(null)

    const { name, height, abilities, stats, types, moves, sprites } = data || {}

    // console.log(sprites);


    const imgList = Object.keys(sprites || {}).filter(val => {
        if (!sprites[val]) { return false }
        if (['versions', 'other'].includes(val)) { return false }
        return true
    })

    console.log(imgList);
    async function fetchMoveData(move, moveUrl) {
        if (loadingSkill || !localStorage || !moveUrl) { return }
        //check cache for move 
        let c = {}
        if (localStorage.getItem('pokemon-moves')) {
            c = JSON.parse(localStorage.getItem('pokemon-moves'))
            if (move in c) {
                setSkill(c[move])
                console.log('found move in cache');

            }
        }
        try {
            setLoadingSkill(true)
            const res = await fetch(moveUrl)
            const moveData = await res.json()
            console.log("fetched move from ap i ", move);
            const description = moveData?.flavor_text_entries
    ?.find(val => val.version_group.name === 'firered-leafgreen')?.flavor_text;


            const skillData = {
                name: move,
                description
            }
            setSkill(skillData)
            c[move] = skillData
            localStorage.setItem('pokemon-moves', JSON.stringify(c))
        } catch (error) {
            console.log(error);

        } finally {
            setLoadingSkill(false)
        }
    }

    useEffect(() => {
        if (loading || !localStorage) { return }

        let cache = {}
        if (localStorage.getItem('pokedex')) {
            cache = JSON.parse(localStorage.getItem('pokedex'))
            console.log(cache);

        }
        if (selectedPokemon in cache) {
            setData(cache[selectedPokemon])
            console.log('Found pokemon in cache');

            return
        }
        //we passes all the cache and need to fetch data from api 

        async function fetchPokemonData() {
            setLoading(true)
            try {
                const baseUrl = "https://pokeapi.co/api/v2/"
                const suffix = "pokemon/" + getPokedexNumber(selectedPokemon)
                const fullUrl = baseUrl + suffix
                const res = await fetch(fullUrl)
                const pokemonData = await res.json()
                setData(pokemonData)
        console.log("Fetched pokemon data from api");

        cache[selectedPokemon] = pokemonData
        localStorage.setItem('pokedex', JSON.stringify(cache))
    } catch (error) {
        console.log(error.message);
    } finally {
        setLoading(false)
    }
}

fetchPokemonData()

    }, [selectedPokemon])
if (loading || !data) {
    return (
        <div>
            <h4>Loading...</h4>
        </div>
    )
}

return (
    <div className="poke-card">
        {skill && (<Modal handleCloseModal={() => { setSkill(null) }}>
            <div>
                <h6>Name</h6>
                <h2>{skill.name.replaceAll('-',' ')}</h2>
            </div>
            <div><h6>Description</h6>
                <p>{skill.description}</p></div>
        </Modal>)}
        <div>
            <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
            <h2>{name}</h2>
        </div>
        <div className="type-container">
            {
                types.map((typeOb, typeIndex) => {
                    return (
                        <TypeCard key={typeIndex} type={typeOb?.type?.name} />
                    )
                })
            }
        </div>
        <img className="default-img" src={"/pokemon/" + getFullPokedexNumber(selectedPokemon) + ".png"} alt={`${name}-large-img`} />
        <div className="img-container">
            {imgList.map((spriteUrl, spriteIndex) => {
                const imgUrl = sprites[spriteUrl]
                return (
                    <img key={spriteIndex} src={imgUrl} alt={`${name}-img-${spriteUrl}`} />
                )
            })}
        </div>
        <h3>Stats</h3>
        <div className="stats-card">
            {stats.map((statObj, statIndex) => {
                const { stat, base_stat } = statObj
                return (
                    <div key={statIndex} className="stat-item">
                        <p>{stat?.name?.replaceAll('-', ' ')}</p>
                        <h4>{base_stat}</h4>
                    </div>
                )
            })

            }
        </div>
        <h3>Moves</h3>
        <div className="pokemon-move-grid">
            {
                moves.map((moveObj, moveIndex) => {
                    return (
                        <button className="button-card pokemon-move" key={moveIndex} onClick={() => {
                            fetchMoveData(moveObj?.move?.name,moveObj?.move?.url)
                        }}>
                            <p>{moveObj?.move?.name.replaceAll('-', ' ')}</p>
                        </button>
                    )
                })
            }
        </div>
    </div>
)
}

// why do we do await res.json ? and when will be the fetch pokemon data function be called and also is local storage avaliable to us all the times thats why the
// first guard clause returns false when !localStorage is read true please explain the purpose
//  of first guard clause as well and also explain the whole code in great detail and simple
//  words 