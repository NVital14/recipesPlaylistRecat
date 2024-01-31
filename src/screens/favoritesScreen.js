import React, { useContext, useEffect, useState } from 'react';
import '../firebaseConfig';
import { auth } from '../firebaseConfig';
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import AppBar from '../components/bar';
import RecipeItem from '../components/recipeItem';
import ViewRecipe from '../components/viewRecipe';
import { AuthContext } from '../App';
import { async } from '@firebase/util';




function FavoritesScreen() {
    // const user = useContext(AuthContext);
    const user = auth.currentUser.uid;
    const [favorites, setFavorites] = useState([]);
    const [favoriteRecipes, setFavoriteRecipes] = useState([]);
    const [storedRecipes, setStoredRecipes] = useState([]);
    const [selected, setSelected] = useState(null);
    const [isFavorite, setIsFavorite] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [admin, setAdmin] = useState([]);
    const db = getFirestore();


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
        console.log('Fetch favorites');
        console.log(temporaryArr);

        setFavorites(temporaryArr);

    };


    async function inic() {
        await fetchDataFromFirestore("myRecipes", setStoredRecipes);
        await fetchDataFromFirestore("admin", setAdmin);
        await fetchFavoritesFromFirestore();
    }

    async function whenViewRecipeIsOpen() {
        await fetchFavoritesFromFirestore();

    }
    useEffect(() => {
        inic();
    }, [])

    useEffect(() => {
        whenViewRecipeIsOpen();
    }, [isOpen])



    return (
        <div>
            <AppBar admin={admin} user={user}></AppBar>
            {console.log('a construir')}
            {favorites.length >= 1 ?
                <center>
                    <div style={{
                        width: '720px'
                    }}>
                        {favorites.map((item) =>
                        (storedRecipes
                            .filter(recipe => recipe.id == item.recipeId)
                            .map(filteredRecipe =>
                                (<RecipeItem key={filteredRecipe.id} item={filteredRecipe} isOpen={isOpen} setIsOpen={setIsOpen} setSelected={setSelected}>  </RecipeItem>))))}

                        <ViewRecipe isOpen={isOpen} setIsOpen={setIsOpen} data={selected}
                            isFavorite={isFavorite} setIsFavorite={setIsFavorite} user={user} btnFavorite={true} btnCRUD={false} />

                    </div>
                </center>
                : <center> <p className='recipe-title'>Ainda não tem favoritos! Comece a adicionar!!</p> </center>}

        </div>
    );
}

export default FavoritesScreen;