import React, { useState, useEffect, useCallback } from 'react'

import IngredientForm from './IngredientForm'
import IngredientList from './IngredientList'
import ErrorModal from '../UI/ErrorModal'
import Search from './Search'

function Ingredients() {

  const [ingredients, setIngredients] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()

  useEffect(() => {
    console.log('test_useEffect', ingredients)
  }, [ingredients])

  const ingredientHandler = (ingredient) => {
    if (ingredient.title !== '' && ingredient.amount !== '') {
      setIsLoading(true)
      fetch('https://react-hooks-3903d-default-rtdb.firebaseio.com/ingredients.json', {
        method: 'POST',
        body: JSON.stringify(ingredient),
        headers: { 'Content-Type': 'application/json' }
      })
        .then(response => {
          setIsLoading(false)
          return response.json()
        })
        .then(responseData => {
          setIngredients(preData => [
            ...preData,
            { id: responseData.name, ...ingredient }]
          )
        })
        .catch(err => {
          setError(err.message)
          setIsLoading(false)
        })
    }

  }

  const onSearchIngredients = useCallback(searchInput => {
    setIngredients(searchInput)
  }, [])


  const removeIngredientsHandler = (id) => {
    setIsLoading(true)
    fetch(`https://react-hooks-3903d-default-rtdb.firebaseio.com/ingredients/${id}.json`,
      {
        method: 'DELETE'
      })
      .then(res => {
        setIsLoading(false)
        setIngredients(preIngredients =>
          preIngredients.filter(ingredient => ingredient.id !== id)
        )
      })
      .catch(err => {
        setError(err.message)
        setIsLoading(false)
      })
  }

  const closeErrorModal = () => {
    setError(null)
  }

  return (
    <div className="App">
      {error && <ErrorModal onClose={closeErrorModal}>{error}</ErrorModal>}
      <IngredientForm
        ingredientHandler={ingredientHandler}
        loading={isLoading} />

      <section>
        <Search onSearchIngredients={onSearchIngredients} />
        <IngredientList
          ingredients={ingredients}
          onRemoveItem={removeIngredientsHandler} />
      </section>
    </div>
  )
}

export default Ingredients
