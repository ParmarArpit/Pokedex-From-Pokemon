export default function Header(props){
    const {handleToggleMenu} = props
    return (
        <header>
            <button onClick={handleToggleMenu} className="open-nav">
                <i className="fa-solid fa-bars"></i>
            </button>
            <h1 className="text-gradient">Pokedex</h1>
        </header>
    )
}