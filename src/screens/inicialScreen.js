import React, { useContext, useEffect, useRef, useState } from 'react';
import '../firebaseConfig';
import { auth } from '../firebaseConfig';
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import rpImg from '../images/rp.png';
import RecipeItem from '../components/recipeItem';
import FilterButton from '../components/filterButton';
import ViewRecipe from '../components/viewRecipe';
import AppBar from '../components/bar';
import Pagination from '../components/pagination';
import { ROUTES } from '../App';



function InicialScreen() {
  // const user = useContext(AuthContext);
  let user = useRef();
  const [storedRecipes, setStoredRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [admin, setAdmin] = useState([]);
  const [selected, setSelected] = useState(null);
  const [width, setWidth] = useState(window.innerWidth);

  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 8;
  const db = getFirestore();

  const lastRecipeIndex = currentPage * recipesPerPage;
  const firstRecipeIndex = lastRecipeIndex - recipesPerPage;
  const currentRecipes = storedRecipes.slice(firstRecipeIndex, lastRecipeIndex);
  const navigate = useNavigate();


  useEffect(() => {
    if (auth.currentUser == null) {
      navigate(ROUTES.LOG_IN);
    }
    else {
      user.current = auth.currentUser.uid;
      inic();
      window.addEventListener('resize', () => { setWidth(window.innerWidth) });

      return () => {
        window.removeEventListener('resize', () => { setWidth(window.innerWidth) });
      };
    }

  }, [])

  useEffect(() => {
    if (auth.currentUser != null) {
      whenViewRecipeIsOpen();
    }
  }, [isOpen])

  const fetchDataFromFirestore = async (col, set) => {
    
    const querySnapshot = await getDocs(collection(db, col));
    const temporaryArr = [];
    querySnapshot.forEach((doc) => {
      temporaryArr.push(doc.data());
    });
    set(temporaryArr);

  };

  const fetchFavoritesFromFirestore = async () => {
    const querySnapshot = await getDocs(query(collection(db, "favorites"), where('userId', '==', user.current)));
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



  return (

    <div className="App">
      <AppBar admin={admin} user={user.current}></AppBar>
      <div className='scrollable' style={{ height: 'calc(100vh - 52px)', overflowY: 'auto' }} >
        <center>
          <img src={rpImg} style={{ width: width <= 1050 ? '100%' : width <= 1300 ? '70%' : width <= 1800 ? '60%' : '45%' }} />
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: width <= 1050 ? '100%' : width <= 1800 ? '70%' : '45%', marginTop: '4%' }}>

            <FilterButton category="Aperitivo" storedRecipes={storedRecipes} setStoredRecipes={setStoredRecipes}></FilterButton>
            <FilterButton category="Entrada" storedRecipes={storedRecipes} setStoredRecipes={setStoredRecipes}></FilterButton>
            <FilterButton category="Sopa" storedRecipes={storedRecipes} setStoredRecipes={setStoredRecipes}></FilterButton>
            <FilterButton category="Peixe" storedRecipes={storedRecipes} setStoredRecipes={setStoredRecipes}></FilterButton>
            <FilterButton category="Sobremesa" storedRecipes={storedRecipes} setStoredRecipes={setStoredRecipes}></FilterButton>
            <FilterButton category="Vegetariano" storedRecipes={storedRecipes} setStoredRecipes={setStoredRecipes}></FilterButton>
            <FilterButton category="Vegan" storedRecipes={storedRecipes} setStoredRecipes={setStoredRecipes}></FilterButton>
            <FilterButton category="Bebida" storedRecipes={storedRecipes} setStoredRecipes={setStoredRecipes}></FilterButton>

          </div>
          <div><FilterButton category="Limpar" storedRecipes={storedRecipes} setStoredRecipes={setStoredRecipes}></FilterButton></div>
          <div style={{
            width: width <= 800 ? '100%' : '720px'
          }}>

            {currentRecipes.map((item, index) => (
              <RecipeItem key={item.id} item={item} isOpen={isOpen} setIsOpen={setIsOpen} setSelected={setSelected}> </RecipeItem>))}
          </div>

          <ViewRecipe isOpen={isOpen} setIsOpen={setIsOpen} data={selected}
            isFavorite={isFavorite} setIsFavorite={setIsFavorite} user={user.current} btnFavorite={true} />
          <Pagination
            totalRecipes={storedRecipes.length}
            recipesPerPage={recipesPerPage}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          ></Pagination>
        </center >
      </div>

    </div >

  );
}

export default InicialScreen;