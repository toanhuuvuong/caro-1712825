import React from 'react';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { FaHome } from 'react-icons/fa';

import './css/style.css';

function Breadcrumbs({ items, currentItem }) {
  return (
    <Breadcrumb className="shadow-sm bg-white rounded">
      <BreadcrumbItem><a href="/admin/dashboard"><FaHome /></a></BreadcrumbItem>
      {
        items && items.map(item => {
          return <BreadcrumbItem><a href={item.href}>{item.name}</a></BreadcrumbItem>
        })
      }
      <BreadcrumbItem active>{currentItem}</BreadcrumbItem>
    </Breadcrumb>
  );
}

export default Breadcrumbs;