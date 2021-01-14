import React, { useEffect, useState } from 'react';
import { Table, Input, Button } from 'reactstrap';

import './css/style.css';

import Breadcrumbs from '../../../components/admin/Breadcrumbs';
import userAPI from '../../../api/common/user';
import systemConstant from '../../../config/constant';
import searchEngine from './services/search-engine';
import { FaSearch, FaSync } from 'react-icons/fa';

function ListUser() {
  // --- State
  // Main
  const [users, setUsers] = useState([]);
  // Input
  const [keySearchInput, setKeySearchInput] = useState('');

  // --- Effect hook
  useEffect(() => {
    userAPI.getAll()
    .then(data => {
      if (data.ok) {
        setUsers(data.items);
      }
    });
  }, []);

  // --- Handle functions
  const handleKeySearchInputChange = event => {
    setKeySearchInput(event.target.value);
  };

  const handleSearchButtonOnClick = event => {
    event.preventDefault();
    if(keySearchInput) {
      const result = searchEngine.search(keySearchInput, users);
      setUsers(result);
      setKeySearchInput('');
    }
  };

  const handleRefreshButtonOnClick = event => {
    event.preventDefault();
    window.open(window.location.href, '_self')
  };
  
  const handleDetailButtonOnClick = id => {
    window.open(systemConstant.CLIENT_URL + '/admin/edit-user/' + id, '_self')
  };

  const handleMatchesPlayedButtonOnClick = id => {
    window.open(systemConstant.CLIENT_URL + '/user-matches/' + id, '_self')
  };

  return(
    <>
      <Breadcrumbs currentItem="List users" />
      <div className="d-flex justify-content-between table-header">
        <h3>Users Table</h3>
        <div className="d-flex">
          <Input placeholder="Nhập từ khóa tìm kiếm..."
          value={keySearchInput}
          onChange={handleKeySearchInputChange}></Input>
          <Button onClick={handleSearchButtonOnClick}><FaSearch /></Button>
          &nbsp;
          <Button color="primary" onClick={handleRefreshButtonOnClick}><FaSync /></Button>
        </div>
      </div>
      <div className="body">
        <Table responsive bordered>
          <thead>
            <tr>
              <th></th>
              <th>Username</th>
              <th>Name</th>
              <th>Role</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
          {(!users || users.length === 0) &&
            <tr>
              <td colspan={5}>No one, please refresh table for the next search :(</td>
            </tr>
          }
          {
            users && users.map((item, index) => {
              return (
                <tr key={item.id}>
                  <td scope="row">{index + 1}</td>
                  <td>{item.username}</td>
                  <td>{item.name}</td>
                  <td>{item.role}</td>
                  <td>
                    <Button color="success" onClick={() => handleDetailButtonOnClick(item._id.toString())}>Detail</Button>
                    &nbsp;&nbsp;&nbsp;
                    <Button color="danger" onClick={() => handleMatchesPlayedButtonOnClick(item._id.toString())}>Matches Played</Button>
                  </td>
                </tr>
              );
            })
          }
          </tbody>
        </Table>
      </div>
    </>
  );
}

export default ListUser;