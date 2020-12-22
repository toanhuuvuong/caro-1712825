import React from 'react';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { FaHome } from 'react-icons/fa';

function Header({ items, currentItem }) {
  return (
    <div>
      <Breadcrumb>
        <BreadcrumbItem><a href="/dashboard"><FaHome /></a></BreadcrumbItem>
        {
          items && items.map(item => {
            return <BreadcrumbItem><a href={item.href}>{item.name}</a></BreadcrumbItem>
          })
        }
        <BreadcrumbItem active>{currentItem}</BreadcrumbItem>
      </Breadcrumb>
    </div>
  );
}

export default Header;