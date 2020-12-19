import React, { useState, useEffect, useRef } from 'react'

import Card from '../UI/Card'
import './Search.css'

const Search = React.memo(props => {

  const { onSearchIngredients } = props
  const [searchInput, setSearchInput] = useState('')
  const inputRef = useRef()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput === inputRef.current.value) {
        const query = searchInput.length === 0 ? '' : `?orderBy="title"&equalTo="${searchInput}"`
        fetch('https://react-hooks-3903d-default-rtdb.firebaseio.com/ingredients.json' + query)
          .then(response => response.json())
          .then(responseData => {
            const loadedIngredients = []

            for (let key in responseData) {
              loadedIngredients.push({
                id: key,
                title: responseData[key].title,
                amount: responseData[key].amount
              })
            }
            onSearchIngredients(loadedIngredients)
          })
      }
    }, 500)

    return () => {
      clearTimeout(timer)
    }
  }, [searchInput, onSearchIngredients, inputRef])

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            type="text"
            ref={inputRef}
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)} />
        </div>
      </Card>
    </section>
  )
})

export default Search
