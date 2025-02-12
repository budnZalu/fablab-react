import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb } from 'react-bootstrap';
import './Breadcrumbs.css'

interface BreadcrumbsProps {
    items: { label: string, path: string }[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
    return (
        <Breadcrumb>
            {items.map((item, index) => (
                <Breadcrumb.Item key={index} active={index === items.length - 1}>
                    {index === items.length - 1 ? item.label : <Link to={item.path}>{item.label}</Link>}
                </Breadcrumb.Item>
            ))}
        </Breadcrumb>
    );
};

export default Breadcrumbs;
