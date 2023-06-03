import { Input, Button } from 'antd';
import { useState } from "react"
import '../App.css';
import React from 'react';
import { api } from "../App.js";
import { Link } from "react-router-dom";

const AddMovie = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [ageLimit, setAgeLimit] = useState("");
    
      const handleAddSubmit = (e) => {
        e.preventDefault();
        let data = {
            title: title,
            description: description,
            ageLimit: ageLimit
        }
        postData(JSON.stringify(data));
      };
    
      const postData = (data) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: data
        };
        fetch(api, requestOptions)
            .then(async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson && await response.json();
    
                if (!response.ok) {
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                } else {
                    alert('Ok'); //valami szebbet csinalni
                    setTitle("");
                    setDescription("");
                    setAgeLimit("");
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }
    return(
        <div className="movies">
            <img className="cover-img" src={require('../assets/cover.jpg')} alt="Film rolls cover"/>
            <header className="movies-header">
                My movies
            </header>
            <Button className="back-button"><Link to={`/`}>Back to list</Link></Button>
            <form className="add-form">
                <label className="form-label" htmlFor="title">Title</label>
                <Input value={title} name="title" type="text" onChange={(event) => setTitle(event.target.value)} required/>
                <label className="form-label" htmlFor="description">Description</label>
                <Input value={description} name="description" type="text" onChange={(event) => setDescription(event.target.value)} required/>
                <label className="form-label" htmlFor="age-limit">Age limit</label>
                <Input value={ageLimit} name="age-limit" type="number" min={0} max={18} onChange={(event) => setAgeLimit(event.target.value)} required/>
                <Button onClick={handleAddSubmit}>Add movie</Button>
            </form>
            {/* <Alert
      message="Warning Text Warning Text Warning TextW arning Text Warning Text Warning TextWarning Text"
      type="warning"
      closable
      onClose={onClose}
    /> */}
      </div>
    )
  }

export default AddMovie;
