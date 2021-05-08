import React , { useState } from 'react';
import './App.css';

function App() {

  const [searchResult, setSearchResult] = useState([]);
  const [seed, setSeed] = useState('');

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
    if( title.length < 3 )
      return;

    searchAPI( title ).then( resObj => {
    //console.log(resObj.Search);
    let result = [];
    if(resObj.Search )
      resObj.Search.map( movie => {
        // movie title should be limited to 40 characters + '...'
          let data = stringLimiter(movie.Title, 37)+' ('+movie.Year+')';
          result.push(data);
      })
    setSearchResult([...result]);
    setSeed(title);
    //console.log(result);
    return result;
    });
  }

  function stringLimiter( str, max )
  {
    let result = str;
    if (str.length > max)
    {
      result = str.substring(0, max-3)+"...";
    }
    return result;
  }
  //console.log("S+",searchResult);
  
  return (
  <div className="App">
    <h2>The Shoppies</h2>
    <div className="wide shaded">
      <h4>Movie title</h4>
      
      <div className="round border">
        {'\u{1F50D}'} {/* long unicode formatting */}
        <input type="text" 
                name="search" 
                placeholder="some letters"
                onChange={ 
                          e => {
                            formatedSearch(e.target.value);
                                }
                        }  
        />
      </div>
    </div>
    <div className="half shaded short">
      <h4>Results for '{seed}'</h4>
      <div className="inner">
        {/* {formatedSearch ("mission")} */}
        {searchResult.length? 
          searchResult.map( movie=> <li className="nombar">
                                      {movie}
                                      <span className="hide"> Nominate></span>
                                    </li> )
          : <p> No matched movie </p>}
      </div>
    </div>
    <div className="half shaded short">
      <h4>Nominations</h4>
    </div>  
  </div>
  );
}

export default App;
