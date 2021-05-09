import React , { useState } from 'react';
import './App.css';

function App() {

  const [searchResult, setSearchResult] = useState([]);
  const [searchWord, setSearchWord] = useState('');
  const [nominees, setNominees] = useState([]);

  //----------------------------------
  // Async function to call API for search in titles and return json response
  //----------------------------------
  async function searchAPI( title )
  {
    const OMDB_URL = "http://www.omdbapi.com/?apikey=27c4a699&type=movie&s="; // base URL for calling OMDB API
    const movieTitle = title.replace(' ', '+'); // API call needs '+' instead of space. OMDB docs
    const res = await fetch( OMDB_URL+movieTitle )
    if(res.ok) 
      return res.json();
    console.log("ERROR: ", res[0]);  
  }
  
  //----------------------------------
  // Call searchAPI() and return array of results in format of MovieTitle(year)
  //----------------------------------
  function formatedSearch( title )
  {
    if( title.length < 3 ) //searching for just 2 letters is useless 
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
  // Trim str to max and add '...' at the end if needed
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
  //----------------------------------
  function addNom(e) 
  {
    let item = e.currentTarget.getAttribute("item"); 
    if( nominees.length < 5 ) // it is not ness in this version because <nominate> button will be hided after 5 nominee 
    {
      setNominees( [...nominees, item] );
      const index = searchResult.indexOf(item);
      searchResult.splice(index,1);
      setSearchResult([...searchResult])  ;
    }
    // console.log(nominees, searchResult);
  }
  //----------------------------------
  // Remove item from nominees and add it back to searchResult
  //----------------------------------
  const remNom = (e) =>{
    let item = e.currentTarget.getAttribute("item"); 
    // remove item from nominees array
    let index = nominees.indexOf( item );
    nominees.splice(index, 1);
    setNominees([...nominees]);
    //add item back to searchResult list
    setSearchResult( [...searchResult, item] );
    console.log(nominees, searchResult);
  }
  //-----------------------------------------
  return (
    <div className="App">
    <h2>The Shoppies</h2>
    <div className="shaded">
      <h4>Movie title</h4>
      
      <div className="border">
        {'\u{1F50D}'} {/* long unicode formatting: search icon */}
        <input type="text" 
                item="search" 
                placeholder="Enter three or more letters"
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
                      )
          : <p> No matched movie </p>
        }
      </div>
    </div>
    <div className="half shaded short">
      <h4>Nominations</h4>
        <div className="inner">
        {nominees.length? nominees.map(
                    item => 
                        <li className="nombar" >
                          {item}
                          <span className="hide"
                                item={item}
                                onClick={remNom}>
                            Remove 
                          </span>
                          </li> 
                      )
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
