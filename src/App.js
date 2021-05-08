import React , {useRef, useState } from 'react';
import './App.css';

function App() {

  const [searchResult, setSearchResult] = useState([]);
  async function searchAPI( title )
  {
    const OMDB_URL = "http://www.omdbapi.com/?apikey=27c4a699&type=movie&s=";
    let movieTitle = title.replace(' ', '+');
    const res = await fetch( OMDB_URL+movieTitle )
    if(res.ok) 
        return res.json();
    console.log("ERROR: ", res[0]);  
  }

  function formatedSearch( title )
  {
    searchAPI( title ).then( resObj => {
    //console.log(resObj.Search);
    let result = [];
    if(resObj.Search )
      resObj.Search.map( movie => {
          let data = movie.Title+' ('+movie.Year+')';
          result.push(data);
      })
    setSearchResult([...result]);
    console.log(result);
    return result;
    });
  }

  
  //console.log("S+",searchResult);
  
  return (
    <div className="App">
    The Shoppies

    {formatedSearch ("rambo")}
    {searchResult.length? 
      searchResult.map( movie=> <div>{movie}</div> )
      : <p> No matched movie </p>}
    </div>
  );
}

export default App;
