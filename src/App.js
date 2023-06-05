import './App.css';
import React, { useEffect } from 'react';
import { useState, useMemo } from "react"
import { Button, Input, Tooltip } from 'antd';
import { EditFilled, DeleteFilled, PlusCircleFilled, FormOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";

const App = () => {
  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState(null);

  const [arrow, setArrow] = useState('Show');

  //ant design function for tooltip
  const mergedArrow = useMemo(() => {
    if (arrow === 'Hide') {
      return false;
    }

    if (arrow === 'Show') {
      return true;
    }

    return {
      pointAtCenter: true,
    };
  }, [arrow]);

  //search function for age limit
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
        if (+e.ageLimit <= helperSearchValue) {
          return e;
        }
      });
      setFilteredData(filteredData);
    }
  }

  //delete data
  const deleteMovie = (e, id) => {
    e.preventDefault();
    fetch(api + '/' + id, { method: 'DELETE' })
      .then(async response => {
        const data = await response.json();
        console.log(data)
        // check for error response
        if (!response.ok) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
        }
        alert('ok');
    })
    .catch(error => {
        console.error('There was an error!', error);
    });
  }

  //get data for table
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

  //datatable for home page
  const Table = (props) => {
    return(
      <table className="data-table">
        <thead className='data-table-head'>
          <tr>
            <th className='data-table-th'>Title</th>
            <th>Description</th>
            <th>Age limit</th>
            <th><Button><Link to="/add-movie"><PlusCircleFilled />Add movie</Link></Button></th>
          </tr>
        </thead>
        <tbody>
          {props.dataSource.map((data, i) => (
            <tr>
              <td className="data-table-td" key={i + data._id + 'title'}>{data.title}</td>
              <td key={i + data._id + 'description'}>{data.description}</td>
              <td key={i + data._id + 'ageLimit'}>{data.ageLimit}</td>
            <td>
              <div className="app-action-button-details">
              
              <Tooltip placement="top" title="Details" arrow={mergedArrow}>
                <Button><Link to={`/movie-details/${data._id}`}
                  state={{ data }}><FormOutlined /></Link>
                </Button>
              </Tooltip>
              </div>
              <div className="app-action-button-edit">
                <Tooltip placement="top" title="Edit" arrow={mergedArrow}>
                  <Button><Link to={`/edit-movie/${data._id}`}><EditFilled /></Link></Button>
                </Tooltip>
              </div>
              <div className="app-action-button-delete">
                <Tooltip placement="top" title="Delete" arrow={mergedArrow}>
                  <Button onClick={(e) => deleteMovie(e, data._id)}><DeleteFilled /></Button>
                </Tooltip>
              </div>
            </td>
          </tr>
          ))}
        </tbody>
      </table>
    )
  }

  //render home page
  if (loading) return <h1>Loading...</h1>;
  if (error) return <pre>{JSON.stringify(error)}</pre>
  if (!data || !data || data.length === 0)
    return (
      <div>
        <Layout></Layout>
        <Button className="add-movie-button"><Link to="/add-movie"><PlusCircleFilled />Add movie</Link></Button>
      </div>
    )
  if (data && data.length > 0)
    return (
      <div>
        <Layout></Layout>
        <div className="search-bar">
          <label htmlFor="age-limit-filter" className="age-limit-label">Age limit filter</label>
          <Input name="age-limit-filter" value={searchValue} onChange={(event) => searchTable(event)}/>
        </div>
        <div>
          <Table dataSource={filteredData}/>
        </div>
      </div>
    );
}

export default App;

//ccrudcrud api
export const api = `https://crudcrud.com/api/5a161ac0b4404f56a522e3b269ae4841/movie`;

//basic layout for all pages
export const Layout = () => {
  return(
    <div className="movies">
      <img className="cover-img" src={require('./assets/cover.jpg')} alt="Film rolls cover"/>
      <header className="movies-header">
        MY MOVIES
      </header>
    </div>
  )
}