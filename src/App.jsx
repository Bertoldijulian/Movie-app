import React, { useEffect, useState } from 'react';
import axios from 'axios'
import Youtube from 'react-youtube';
import './App.css'; 

function App() {
  const Api_TMDB_Url = 'https://api.themoviedb.org/3';
  const Api_TMDB_Key = '5dca6d497224a44120bcde92f03fb5cc';
  const Image_TMDB = 'https://image.tmdb.org/t/p/original';
  const Image_TMBD_Url = 'https://image.tmdb.org/t/p/original';
  

  const [movies, setMovies] = useState ([]);
  const [srcKey, setSrckey] = useState ('');
  const [trailer, setTrailer] = useState (null);
  const [playing, setPlaying] = useState (false);
  const [movie, setMovie] = useState ({title: 'Loading Movies'});

  
  const fetchMovies = async(srcKey) => {
    const type = srcKey ? 'search' : 'discover';
    const {data: {results}, } = await axios.get(`${Api_TMDB_Url}/${type}/movie`, {
      params: {
        api_key : Api_TMDB_Key,
        query : srcKey,
      },
    });
  
    setMovies(results)
    setMovie(results[0])

    if(results.length) {
      await fetchMovie(results[0].id)
    }
  };


  const fetchMovie = async(id) => {
    const {data} = await axios.get(`${Api_TMDB_Key}/movie/${id}`, {
      params: {
        api_key : Api_TMDB_Key,
        append_to_response: "movies",
      }
    })

    if(data.movies && data.movies.results) {
      const trailer = data.movies.results.find(
        (mov) => mov.movies === "Official trailer"
      )
      setTrailer(trailer ? trailer : data.movies.results[0])
    }

    setMovie(data)
  };
  
  const movieSelect = async(movie) =>{
    fetchMovie(movie.id)
    setMovie(movie)
    window.scrollTo (0, 0);
  };

  const searchMovies = (e) => {
    e.preventDefault();
    fetchMovies(srcKey)
  };

  useEffect(() => {
    fetchMovies(); // eslint-disable-next-line 
  }, []);  
  
  return (
    
    <div className="App">
      <nav>
        <form onSubmit={searchMovies}>
          <label for="search">Search movie</label>
          <input id="search" type="search" placeholder="Search..." onChange={(e) => setSrckey(e.target.value)} />
          <button type="submit">Go</button>    
        </form>
      </nav>

      
      <div>
        <div>
          {movie ? (
            <div
              className="viewtrailer"
              style={{
                backgroundImage: `url("${Image_TMDB}${movie.backdrop_path}")`,
              }}
            >
              {playing ? (
                <>
                  <Youtube
                    videoId={trailer.key}
                    className=""
                    containerClassName={"youtube-container"}
                    opts={{
                      width: "100%",
                      height: "100%",
                      playerVars: {
                        autoplay: 1,
                        controls: 0,
                        cc_load_policy: 0,
                        fs: 0,
                        iv_load_policy: 0,
                        modestbranding: 0,
                        rel: 0,
                        showinfo: 0,
                      },
                    }}
                  />
                  <button onClick={() => setPlaying(false)} className="">
                    Close
                  </button>
                </>
              ) : (
                <div className="">
                  <div className="">
                    {trailer ? (
                      <button
                        className=""
                        onClick={() => setPlaying(true)}
                        type="button"
                      >
                        Play Trailer
                      </button>
                    ) : (
                      "Sorry, no trailer available"
                    )}
                    <h1 className="">{movie.title}</h1>
                    <p className="">{movie.overview}</p>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
      
      
      <div>
        <h1>MOVIES</h1>
      </div>
      <div className='container'>
        {movies.map((ms) => (
          <div key={ms.id} className='cta' onClick={() => movieSelect(ms)}>
            <img src={`${Image_TMBD_Url + ms.poster_path}`} alt="" className='img'/>
            <div className='text'>
              <h3>{ms.title}</h3>
              <p>{ms.overview}</p>
            </div>
          </div>
            
        ))}
      </div>
    </div>
        
  );
}

export default App;
