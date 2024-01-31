import { Button } from '@ui5/webcomponents-react';
import React from 'react'

const Pagination = ({ totalRecipes, recipesPerPage, setCurrentPage, currentPage }) => {
    let pages = [];
    for (let i = 1; i <= Math.ceil(totalRecipes / recipesPerPage); i++) {
        pages.push(i);
    }

    return (
        <div>
            {
                pages.map((page, index) => {
                    return <Button className={page == currentPage ? 'active' : 'btnOthers'} key={index} onClick={() => { setCurrentPage(page); document.getElementsByClassName('scrollable')[0].scrollTo(0, 0); }}>{page}</Button>
                })
            }
        </div>
    )
}

export default Pagination;