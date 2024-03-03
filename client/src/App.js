import './App.css';
import React from 'react';
import axios from 'axios';

export default class App extends React.Component {

  state = {
    recipes: []
  }

  componentDidMount() {
    this.refreshRecipes()
  }

  deleteRecipe(id) {
    axios.delete(`/api/recipes/` + id)
      .then(res => {
        this.refreshRecipes()
      })
  }

  addRecipe(temp, cook_minutes, shake_times, notes) {
    axios.post(`api/recipes`, {
      "temp": temp,
      "cook_minutes": cook_minutes,
      "shake_times": shake_times,
      "notes": notes
    })
      .then(res => {
        this.refreshRecipes()
      })
  }

  refreshRecipes() {
    axios.get(`/api/recipes`)
      .then(res => {
        this.setState({ recipes: res.data });
      })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>This is the Air Fry Recipe Database</p>
          <ul>
            {this.state.recipes}
            {/* {
          this.state.recipes
            .map(recipe =>
              <li key={recipe.id}>{recipe.name}</li>
            )
        } */}
          </ul>
        </header>
      </div>

    )
  }
}