import { Button } from 'antd';
import { useState } from "react"
import '../App.css';
import { React, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { api, Layout } from "../App.js";

const MovieDetail = () => {

    const [data, setData] = useState(null);
    const { id } = useParams();

    //get data for movie details page
    useEffect(() => {
        fetch(api + '/' + id)
            .then(response => response.json())
            .then(data => setData({ data: data }));
      }, []);
    

    //render movie details page
    if (!data)
    return(<h2>No data</h2>)
    if (data)
    return(
        <div>
            <Layout></Layout>
            <div className="movies">
                <Button className="back-button"><Link to={`/`}>Back to list</Link></Button>
                <div className='movie-details'>
                    <h2>Movie details</h2>
                    <p>ID: {id}</p>
                    <p>Title: {data.data.title}</p>
                    <p>Description: {data.data.description}</p>
                    <p>Age limit: {data.data.ageLimit}</p>
                </div>
            </div>
        </div>
    )
  }

export default MovieDetail;
