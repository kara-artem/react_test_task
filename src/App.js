import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, Container, TextField, List, ListItem, ListItemText } from '@material-ui/core';
import Async from 'react-async';
import './App.css';

const useStyles = makeStyles((theme) => ({
  header: {
    paddingTop: theme.spacing(2),
  },
  title: {
    fontSize: '2em',
    textAlign: 'left',
  },
  search: {
    width: '30vw',
  },
  wrapSearch: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: '15px',
  },
  dataList: {
    paddingLeft: '15px',
  },
}));

const loadUsers = async () =>
  await fetch('http://www.json-generator.com/api/json/get/cpVPfDAPAO?indent=2')
    .then((res) => res)
    .then((res) => res.json());

const App = () => {
  const classes = useStyles();
  const history = useHistory();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const currentUrl = window.location.pathname.substr(1);
    if (currentUrl) return setSearchTerm(decodeURI(currentUrl));
  }, []);

  const handleChange = (event) => {
    history.push(`/${event.target.value}`);
    setSearchTerm(event.target.value);
  };

  return (
    <div className="App">
      <header className={classes.header}>
        <Container fixed>
          <h1 className={classes.title}>React App Collaboration Exercise Basic Search</h1>
          <div className={classes.wrapSearch}>
            <TextField
              value={searchTerm}
              onChange={handleChange}
              className={classes.search}
              id="outlined-basic"
              label="Start typing"
              variant="outlined"
            />
          </div>
          <Async promiseFn={loadUsers}>
            {({ data, err, isLoading }) => {
              if (isLoading) return 'Loading...';
              if (err) return `Something went wrong: ${err.message}`;
              if (data) {
                const results = !searchTerm
                  ? data.body
                  : data.body.filter((person) => person.toLowerCase().includes(searchTerm.toLocaleLowerCase()));
                return (
                  <List className={classes.dataList}>
                    {results.map((item) => (
                      <ListItem key={item}>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                  </List>
                );
              }
            }}
          </Async>
        </Container>
      </header>
    </div>
  );
};

export default App;
