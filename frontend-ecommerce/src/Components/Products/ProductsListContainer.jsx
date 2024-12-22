import React from 'react'

export const ProductsListContainer = ({ loading, products }) => {
    return (
        <div className='productsContainer'>
            {loading ? <p>Fetching...</p> :
                !products?.payload?.length == 0 &&
                <ul className='products'>
                    {
                        products?.payload?.map(pr => (
                            <li key={pr._id} className='product'>
                                <img src={pr.thumbnails[0]} alt={pr.title} />
                                <h3>{pr.title}</h3>
                                <p>{pr.category}</p>
                                <button>asdf</button>
                            </li>
                        ))
                    }
                </ul>
            }
        </div>
    )
}
