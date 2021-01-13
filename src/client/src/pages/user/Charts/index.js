import React, { useEffect, useState } from 'react';
import { FaTrophy } from 'react-icons/fa';
import { Table } from 'reactstrap';
import Badge from 'reactstrap/lib/Badge';

import chartsAPI from '../../../api/user/charts';

function Charts() {
  // --- State
  // Main
  const [charts, setCharts] = useState([]);

  // --- Effect hook
  useEffect(() => {
    chartsAPI.getAll()
    .then(data => {
      if(data.ok) {
        setCharts(data.items);
      }
    })
  }, []);

  return(
    <div className="app-container">
      <div className="title">
        <h1>Charts</h1>
      </div>
      <hr />
      <div className="subtitle">
        <h5></h5>
      </div>
      <div className="body col-lg-12">
        <Table responsive bordered>
          <thead>
            <tr>
              <th></th>
              <th>Username</th>
              <th>Name</th>
              <th>Trophy</th>
            </tr>
          </thead>
          <tbody>
          {
            charts && charts.map((item, index) => {
              return (
                <tr key={item.id}>
                  <td scope="row">
                    {index === 0 && 
                      <Badge color="danger">
                        #{index + 1}
                      </Badge>
                    }
                    {index === 1 && 
                      <Badge color="success">
                        #{index + 1}
                      </Badge>
                    }
                    {index === 2 && 
                      <Badge color="primary">
                        #{index + 1}
                      </Badge>
                    }
                    {index > 2 && 
                      <div>
                        #{index + 1}
                      </div>
                    }
                  </td>
                  <td>{item.username}</td>
                  <td>{item.name}</td>
                  <td>{item.trophies} <FaTrophy fill="orange" /></td>
                </tr>
              );
            })
          }
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default Charts;