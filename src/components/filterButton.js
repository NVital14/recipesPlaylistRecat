import React, { useEffect, useState } from 'react';
import { getFirestore, addDoc, collection, getDocs, query, where } from "firebase/firestore";
import '../firebaseConfig';
import '../App.css';
import { Button } from '@ui5/webcomponents-react';


const FilterButton = (props) => {
    const db = getFirestore();


    async function getCategoryRecipes() {

        const querySnapshot = await getDocs(query(collection(db, "myRecipes"), where('category', '==',  props.category )));
        const temporaryArr = [];
        querySnapshot.forEach((doc) => {
            temporaryArr.push(doc.data());
        });
        props.setStoredRecipes(temporaryArr);

    }


    return (
        <Button className='btnFilter' onClick={getCategoryRecipes} >{props.category}</Button>

    );

};

export default FilterButton;
