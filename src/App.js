import React , { useState } from 'react';
import './App.css';

function App() {

  const [searchResult, setSearchResult] = useState([]);
  const [searchWord, setSearchWord] = useState('');
  const [nominees, setNominees] = useState([]);

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
      setSearchWord(title);
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
  // Check if nominations<5 then add item to nominations 
  function addNom(e) 
  {
    let name = e.currentTarget.getAttribute("item"); 
    if( nominees.length < 5 && nominees.indexOf(name) < 0 )
      setNominees( [...nominees, name] );
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
                item="search" 
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
      <h4>Results for '{searchWord}'</h4>
      <div className="inner">
        {searchResult.length? searchResult.map(
                    (item) => 
                      nominees.indexOf(item) < 0 ? 
                        <li className="nombar">
                          {item}
                          {nominees.length < 5 ?
                            <span className="hide"
                                  item={item}
                                  onClick={addNom}>
                              Nominate 
                            </span>
                          : null}
                        </li>
                      : null
                      )
          : <p> No matched movie </p>
        }
      </div>
    </div>
    <div className="half shaded short">
      <h4>Nominations</h4>
        <div className="inner">
        {nominees.length? nominees.map(
                    item => <li className="nombar" >
                            {item}
                            <span className="hide"
                                  name={item}
                                  onClick={remNom}>
                              Remove 
                            </span>
                           </li> )
          : <p>Search and add up to 5 nominees.</p>
        } 
        { 
         nominees.length >= 5 ?
          <p className="warning">YOU HAVE SELECTED ALL YOUR 5 NOMINEES.  </p>
          : null
        }
        </div>
    </div>  
  </div>
  );
}

export default App;
