import { Button } from 'antd';
import { useState } from "react"
import '../App.css';
import { React, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { api } from "../App.js";

const MovieDetail = (props) => {

    const [data, setData] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        fetch(api + '/' + id)
            .then(response => response.json())
            .then(data => setData({ data: data }));
      }, []);
    

    if (!data)
    return(<h2>No data</h2>)
    if (data)
    return(
        <div className="movies">
            <img className="cover-img" src={require('../assets/cover.jpg')} alt="Film rolls cover"/>
            <header className="movies-header">
                My movies
            </header>
            <Button className="back-button"><Link to={`/`}>Back to list</Link></Button>
            <div className='movie-details'>
                <h2>Movie details</h2>
                <p>ID: {id} {data.data.title}</p>
                <p>Title: {data.data.title}</p>
                <p>Description: {data.data.description}</p>
                <p>Age limit: {data.data.ageLimit}</p>
            </div>
        </div>
    )
  }

export default MovieDetail;
