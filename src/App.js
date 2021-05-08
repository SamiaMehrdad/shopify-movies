import React , { useState } from 'react';
import './App.css';

function App() {

  const [searchResult, setSearchResult] = useState([]);
  const [seed, setSeed] = useState('');
  const [noms, setNoms] = useState([]);

  //----------------------------------
  async function searchAPI( title )
  {
    const OMDB_URL = "http://www.omdbapi.com/?apikey=27c4a699&type=movie&s="; // base URL for calling OMDB API
    let movieTitle = title.replace(' ', '+'); // API call needs '+' instead of space. OMDB docs
    const res = await fetch( OMDB_URL+movieTitle )
    if(res.ok) 
      return res.json();
    console.log("ERROR: ", res[0]);  
  }
  
  //----------------------------------
  function formatedSearch( title )
  {
    if( title.length < 3 )
    return;
    
    searchAPI( title ).then( resObj => {
      let result = [];
      if( resObj.Search )
      resObj.Search.map( movie => {
              // API returns duplicated results that should be filtered
              if( result.indexOf(movie) < 0 ) // check if movie already is not in the result
              {
                // movie title should be limited to 40 characters + '...'
                let data = stringLimiter(movie.Title, 36) + ' (' + movie.Year + ')';
                result.push(data);
              }
            })
      setSearchResult([...result]);
      setSeed(title);
      return result;
    });
  }
  
  //----------------------------------
  function stringLimiter( str, max )
  {
    let result = str;
    if (str.length > max)
    {
      result = str.substring(0, max-3)+"...";
    }
    return result;
  }
  //----------------------------------
  function addNom(e) 
  {
    let name = e.currentTarget.getAttribute("name"); 
    if( noms.length < 5 && noms.indexOf(name) < 0 )
      setNoms( [...noms, name] );
  }
  //----------------------------------
  const remNom = (e) =>{
    
  }
  
  return (
    <div className="App">
    <h2>The Shoppies</h2>
    <div className="shaded">
      <h4>Movie title</h4>
      
      <div className="border">
        {'\u{1F50D}'} {/* long unicode formatting: search icon */}
        <input type="text" 
                name="search" 
                placeholder="some letters"
                onChange={ 
                          e => {
                            e.preventDefault();
                            formatedSearch(e.target.value);
                                }
                        }  
        />
      </div>
    </div>
    <div className="half shaded short">
      <h4>Results for '{seed}'</h4>
      <div className="inner">
        {searchResult.length? 
          searchResult.map( (movie) => noms.indexOf(movie) < 0 ? 
                                        <li className="nombar">
                                         {movie}
                                         {noms.length < 5 ?
                                           <span className="hide"
                                                name={movie}
                                                onClick={addNom}>
                                             Nominate 
                                           </span>
                                          : null}
                                        </li>
                                      : null
                                     )
          : <p> No matched movie </p>}
      </div>
    </div>
    <div className="half shaded short">
      <h4>Nominations</h4>
        <div className="inner">
        {noms.length?
          noms.map( nom => <li className="nombar" 
                               name={nom}>
                            {nom}
                            <span className="hide"
                                  name={nom}
                                  onClick={remNom}>
                                   Remove 
                            </span>
                           </li> )
          : <p>Search and add up to 5 nominees.</p>
        } 
        { 
         noms.length >= 5 ?
          <p className="warning">YOU HAVE SELECTED ALL YOUR 5 NOMINEES.  </p>
          : null
        }
        </div>
    </div>  
  </div>
  );
}

export default App;
