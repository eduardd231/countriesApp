import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, InputGroup, FormControl, Button, Dropdown } from 'react-bootstrap';
import './App.css';

function App() {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterOptions, setFilterOptions] = useState({
    smallerThanLithuania: false,
    inOceania: false,
  });

  const lithuaniaArea = countries.find(
    (country) => country.name === 'Lithuania'
  )?.area;

  useEffect(() => {
    axios
      .get('https://restcountries.com/v2/all?fields=name,region,area')
      .then((res) => {
        setCountries(res.data);
        setFilteredCountries(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    let newFilteredCountries = [...countries];

    if (filterOptions.smallerThanLithuania && lithuaniaArea) {
      newFilteredCountries = newFilteredCountries.filter(
        (country) => country.area < lithuaniaArea
      );
    }

    if (filterOptions.inOceania) {
      newFilteredCountries = newFilteredCountries.filter(
        (country) => country.region === 'Oceania'
      );
    }

    newFilteredCountries.sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();

      if (sortOrder === 'asc') {
        return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
      } else {
        return nameA > nameB ? -1 : nameA < nameB ? 1 : 0;
      }
    });

    setFilteredCountries(newFilteredCountries);
  }, [countries, filterOptions, sortOrder]);

  const handleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleFilterChange = (filterName) => {
    setFilterOptions({
      ...filterOptions,
      [filterName]: !filterOptions[filterName],
    });
  };

  return (
    <div className="App">
      <h1>Countries</h1>
      <div className="filter-controls">
        <div>
          <Button variant="primary" onClick={handleSort}>
            Sort {sortOrder === 'asc' ? 'Descending' : 'Ascending'}
          </Button>
        </div>
        <div>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Filters
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleFilterChange('smallerThanLithuania')}>
                {filterOptions.smallerThanLithuania ? '✔' : ''} Smaller than Lithuania
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleFilterChange('inOceania')}>
                {filterOptions.inOceania ? '✔' : ''} In Oceania
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      <div className="table-wrapper">
        <Table striped bordered hover className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Region</th>
              <th>Area</th>
            </tr>
          </thead>
          <tbody>
            {filteredCountries.map((country, index) => (
              <tr key={index}>
                <td>{country.name}</td>
                <td>{country.region}</td>
                <td>{country.area}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
  
            }

export default App;
