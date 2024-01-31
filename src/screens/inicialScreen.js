import React, { useContext, useEffect, useState } from 'react';
import '../firebaseConfig';
import { app, auth } from '../firebaseConfig';
import { getFirestore, collection, getDocs, query, where, firestore } from "firebase/firestore";
import rpImg from '../images/rp.png';
import RecipeItem from '../components/recipeItem';
import NewRecipe from './newRecipe';
import FilterButton from '../components/filterButton';
import ViewRecipe from '../components/viewRecipe';
import AppBar from '../components/bar';
import { AuthContext } from '../App';
import Pagination from '../components/pagination';
import { async } from '@firebase/util';



function InicialScreen() {
  // const user = useContext(AuthContext);
  const user = auth.currentUser.uid;
  const [storedRecipes, setStoredRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [admin, setAdmin] = useState([]);
  const [selected, setSelected] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 8;
  const db = getFirestore();

  const lastRecipeIndex = currentPage * recipesPerPage;
  const firstRecipeIndex = lastRecipeIndex - recipesPerPage;
  const currentRecipes = storedRecipes.slice(firstRecipeIndex, lastRecipeIndex);

  const fetchDataFromFirestore = async (col, set) => {
    const querySnapshot = await getDocs(collection(db, col));
    const temporaryArr = [];
    querySnapshot.forEach((doc) => {
      temporaryArr.push(doc.data());
    });
    set(temporaryArr);

  };

  const fetchFavoritesFromFirestore = async () => {
    const querySnapshot = await getDocs(query(collection(db, "favorites"), where('userId', '==', user)));
    const temporaryArr = [];
    querySnapshot.forEach((doc) => {
      temporaryArr.push(doc.data());
    });
    setFavorites(temporaryArr);
  };

  function isTheRecipeAFavorite() {
    for (let i = 0; i < favorites.length; i++) {
      if (selected?.id === favorites[i]?.recipeId) {
        setIsFavorite(true);
        break;
      }
      else {
        setIsFavorite(false);
      }
    }


  }
  async function inic() {
    await fetchDataFromFirestore("myRecipes", setStoredRecipes);
    await fetchDataFromFirestore("admin", setAdmin);
    await fetchFavoritesFromFirestore();    
  }
  
  async function whenViewRecipeIsOpen() {
    await fetchFavoritesFromFirestore(); 
    isTheRecipeAFavorite();
  }
  useEffect(() => {

    inic();
  }, [])


  useEffect(() => {
    whenViewRecipeIsOpen();
  }, [isOpen])

  return (

    <div className="App">
      <AppBar admin={admin} user={user}></AppBar>
      <center>
        <img src={rpImg} />
        <div style={{ display: 'flex', width: '50%', marginTop: '4%' }}>

          <FilterButton category="Aperitivo" storedRecipes={storedRecipes} setStoredRecipes={setStoredRecipes}></FilterButton>
          <FilterButton category="Entrada" storedRecipes={storedRecipes} setStoredRecipes={setStoredRecipes}></FilterButton>
          <FilterButton category="Sopa" storedRecipes={storedRecipes} setStoredRecipes={setStoredRecipes}></FilterButton>
          <FilterButton category="Peixe" storedRecipes={storedRecipes} setStoredRecipes={setStoredRecipes}></FilterButton>
          <FilterButton category="Sobremesa" storedRecipes={storedRecipes} setStoredRecipes={setStoredRecipes}></FilterButton>
          <FilterButton category="Vegetariano" storedRecipes={storedRecipes} setStoredRecipes={setStoredRecipes}></FilterButton>
          <FilterButton category="Vegan" storedRecipes={storedRecipes} setStoredRecipes={setStoredRecipes}></FilterButton>
          <FilterButton category="Bebida" storedRecipes={storedRecipes} setStoredRecipes={setStoredRecipes}></FilterButton>
        </div>

        <div style={{
          width: '720px'
        }}>

          {currentRecipes.map((item, index) => (
            <RecipeItem key={item.id}  item={item} isOpen={isOpen} setIsOpen={setIsOpen} setSelected={setSelected}> </RecipeItem>))}
        </div>

        <ViewRecipe isOpen={isOpen} setIsOpen={setIsOpen} data={selected}
          isFavorite={isFavorite} setIsFavorite={setIsFavorite} user={user} btnFavorite={true} />
        <Pagination
          totalRecipes={storedRecipes.length}
          recipesPerPage={recipesPerPage}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        ></Pagination>
      </center >
    </div >

  );
}

export default InicialScreen;