const Search = ({query, onQueryChange}) =>{
    return(
        <div className="text-center py-2">
            <input type="text" name="query" id="query" value={query} onChange={(event => {onQueryChange(event.target.value)})} placeholder="Search by Name..." />
        </div>
    )
}

export default Search;