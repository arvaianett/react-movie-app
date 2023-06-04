import { Input, Button } from 'antd';
import { useState } from "react"
import '../App.css';
import { React, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { api, Layout } from "../App.js";

const EditMovie = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [ageLimit, setAgeLimit] = useState("");
    const { id } = useParams();

    //get data for edit page
    useEffect(() => {
        fetch(api + '/' + id)
            .then(response => response.json())
            .then(data => {
                setTitle(data.title)
                setDescription(data.description)
                setAgeLimit(data.ageLimit)
            });
      }, []);
    
    //edit data action
    const handleAddSubmit = (e) => {
        e.preventDefault();
        let data = {
            title: title,
            description: description,
            ageLimit: ageLimit
        }
        editData(JSON.stringify(data));
      };

    //edit data put
    const editData = (data) => {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: data
        };
        fetch(api + '/' + id, requestOptions)
            .then(async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson && await response.json();
    
                if (!response.ok) {
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                } else {
                    alert('Ok');
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
                alert(error);
            });
    }

    //render edit page
    return(
        <div>
            <Layout></Layout>
            <Button className="back-button"><Link to={`/`}>Back to list</Link></Button>
            <form className='add-form'>
                <label className="form-label" htmlFor="title">Title</label>
                <Input value={title} name="title" type="text" onChange={(event) => setTitle(event.target.value)} required/>
                <label className="form-label" htmlFor="description">Description</label>
                <Input value={description} name="description" type="text" onChange={(event) => setDescription(event.target.value)} required/>
                <label className="form-label" htmlFor="age-limit">Age limit</label>
                <Input value={ageLimit} name="age-limit" type="number" min={0} max={18} onChange={(event) => setAgeLimit(event.target.value)} required/>
            <Button className="add-movie-button-edit" onClick={handleAddSubmit}>Update movie</Button>
        </form>
      </div>
    )
  }

export default EditMovie;
