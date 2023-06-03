import './App.css';
import React, { useEffect } from 'react';
import { useState } from "react"
import { Button, Input } from 'antd';
import { EditFilled, DeleteFilled, PlusCircleFilled, FormOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";

const App = () => {
  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState(null);

  const searchTable = newSearchValue => {
    newSearchValue.preventDefault();
    let helperSearchValue = '';

    if (searchValue === null || searchValue === '') {
      setSearchValue(+newSearchValue.nativeEvent.data);
      helperSearchValue = +newSearchValue.nativeEvent.data;
    } else if ((searchValue !== null || searchValue !== '') 
        && newSearchValue.nativeEvent.data !== null) {
      let e = searchValue + newSearchValue.nativeEvent.data;
      setSearchValue(e);
      helperSearchValue = e;
    } else if ((searchValue !== null || searchValue !== '') 
        && newSearchValue.nativeEvent.data === null) {
          let e = helperSearchValue;
          e = e.substring(0, e.length - 1);
          setSearchValue(e);
          helperSearchValue = e;
    }

    if (helperSearchValue === '' || helperSearchValue === null) {
      setFilteredData(data);
    } else {
      let filteredData = data.filter(e => {
        if (+e.ageLimit < helperSearchValue) {
          return e;
        }
      });
      setFilteredData(filteredData);
    }
  }

  const SearchBar = () => {
    return(
      <Input className="search-bar" value={searchValue} onChange={(event) => searchTable(event)}/>
    )
  }

  const deleteMovie = (e, id) => {
    e.preventDefault();
    fetch(api + '/' + id, { method: 'DELETE' })
      .then(async response => {
        const data = await response.json();

        // check for error response
        if (!response.ok) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
        }
    })
    .catch(error => {
        console.error('There was an error!', error);
    });
  }

  useEffect(() => {
    setLoading(true);
    fetch(
      api,
    )
      .then((response) => response.json())
      .then((resp) => {
        setFilteredData(resp);
        setData(resp);
        return resp;
      })
      .then(() => setLoading(false))
      .catch(setError);
  }, []);

  const Table = (props) => {
    return(
      <table className="data-table">
        <thead>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Age limit</th>
          <th><Button><Link to="/add-movie"><PlusCircleFilled />Add movie</Link></Button></th>
        </tr>
        </thead>
        <tbody>
          {props.dataSource.map((data, i) => (
            <tr>
            <td key={i + data._id + 'title'}>{data.title}</td>
            <td key={i + data._id + 'description'}>{data.description}</td>
            <td key={i + data._id + 'ageLimit'}>{data.ageLimit}</td>
            <td>
              <Button><Link to={`/movie-details/${data._id}`}
              state={{ data }} className="app-action-button-details"><FormOutlined /></Link></Button>
              <Button><Link to={`/edit-movie/${data._id}`} className="app-action-button-edit"><EditFilled /></Link></Button>
              <Button onClick={(e) => deleteMovie(e, data._id)} className="app-action-button-delete"><DeleteFilled /></Button>
            </td>
          </tr>
          ))}
        </tbody>
      </table>
    )
  }

  if (loading) return <h1>Loading...</h1>;
  if (error) return <pre>{JSON.stringify(error)}</pre>
  if (!data || !data || data.length === 0)
    return (
      <div className="movies">
      <img className="cover-img" src={require('./assets/cover.jpg')} alt="Film rolls cover"/>
      <header className="movies-header">
        My movies
      </header>
      <Button><Link to="/add-movie"><PlusCircleFilled />Add movie</Link></Button>
      </div>
    )
  if (data && data.length > 0)
    return (
      <div className="movies">
      <img className="cover-img" src={require('./assets/cover.jpg')} alt="Film rolls cover"/>
      <header className="movies-header">
        My movies
      </header>
      <SearchBar searchTable={searchTable} />
      <div>
        <Table dataSource={filteredData}/>
      </div>
    </div>
    );
}

export default App;

export const api = `https://crudcrud.com/api/27ff99d6ce15412c81fcbe17d5636f47/movie`;
