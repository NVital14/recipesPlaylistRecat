import React, { useState } from 'react';
import { getFirestore, addDoc, collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { getStorage, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import '../firebaseConfig';
import '../App.css';
import { Form, FormItem, Input, FormGroup, Select, Option, Label, TextArea, Button, Dialog } from '@ui5/webcomponents-react';
import UploadAndDisplayImage from '../components/uploadAndDisplayImage';
import '@ui5/webcomponents-icons/dist/AllIcons.js';



const NewRecipe = ({ isOpen, setIsOpen }) => {
    const [inputTitle, setInputTitle] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [inputTime, setInputTime] = useState('');
    const [inputCategory, setInputCategory] = useState('');
    const [inputComplexity, setInputComplexity] = useState('');
    const [inputAffordability, setInputAffordability] = useState('');
    const [inputIngredients, setInputIngredients] = useState('');
    const [inputSteps, setInputSteps] = useState('');


    async function saveRecipe() {
        try {
            if (inputTitle != '' && inputTime != '' && inputIngredients != '' && inputSteps != '') {
                const db = getFirestore();
                const storage = getStorage();
                let url;
                console.log(selectedImage);
                if (selectedImage) {
                    const storageRef = ref(storage, `/imagens/${crypto.randomUUID()}`);
                    const uploadTask = await uploadBytesResumable(storageRef, selectedImage);
                    console.log('upload');
                    console.log('url', uploadTask.ref)
                    url = await getDownloadURL(uploadTask.ref);
                    url = url.toString().trim();
                }
    
                let values = {
                    title: inputTitle,
                    time: inputTime,
                    category: inputCategory == "" ? "Aperitivo" : inputCategory,
                    image: selectedImage ? url : null,
                    complexity: inputComplexity == "" ? "Simples" : inputComplexity,
                    affordability: inputAffordability == "" ? "Acessível" : inputComplexity,
                    ingredients: inputIngredients,
                    steps: inputSteps
                };
                
                const docRef = await addDoc(collection(db, "myRecipes"), values);
                values['id'] = docRef.id;
                await updateDoc(doc(db, 'myRecipes/' + docRef.id), {
                    id: values.id,
                });
                setIsOpen(false);
                setInputTitle('');
                setInputTime('');
                setInputIngredients('');
                setInputSteps('');
                setInputAffordability('');
                setInputCategory('');
                setInputComplexity('');
                setSelectedImage(null);
                alert("Receita guardada com sucesso"); 
            }
            else {
                alert("Os campos do título, do tempo, dos ingredientes e dos passos, são de preenchimento obrigatório");
            }
            
        } catch (error) {
            alert("Não foi possível guardar a receita");
        }
    }


    return (
        <Dialog
            style={{ width: '50%' }}
            open={isOpen}
            onAfterClose={() => {
                setIsOpen(false); setInputTitle('');
                setInputTime('');
                setInputIngredients('');
                setInputSteps('');
                setInputAffordability('');
                setInputCategory('');
                setInputComplexity('');
                setSelectedImage(null);
            }}
            footer={<div><Button
                className='btnOthers'
                icon="save"
                onClick={() => saveRecipe()}
            >
                Guardar
            </Button>
                <Button className='btnOthers' onClick={() => setIsOpen(false)}>Fechar</Button></div>}
        >
            <Form
                backgroundDesign="Transparent"
                columnsL={1}
                columnsM={1}
                columnsS={1}
                columnsXL={1}

                titleText="Inserir Receita"
            >
                <FormItem label="Título">
                    <Input value={inputTitle}
                        onChange={(e) => setInputTitle(e.target.value)} style={{
                            width: '50%'
                        }} />
                </FormItem>
                <FormItem label="Imagem">
                    <UploadAndDisplayImage selectedImage={selectedImage} setSelectedImage={setSelectedImage}></UploadAndDisplayImage>
                </FormItem>
                <FormGroup titleText="Detalhes">
                    <FormItem label="Tempo">
                        <Input value={inputTime}
                            onChange={(e) => setInputTime(e.target.value)} />
                    </FormItem>
                    <FormItem label="Complexidade">
                        <Select value={inputComplexity} onChange={(e) => setInputComplexity(e.target.value)}>
                            <Option>
                                Simples
                            </Option>
                            <Option>
                                Médio
                            </Option>
                            <Option>
                                Difícil
                            </Option>
                        </Select>
                    </FormItem>

                    <FormItem label="Acessibilidade">
                        <Select value={inputAffordability} onChange={(e) => setInputAffordability(e.target.value)}>
                            <Option>
                                Acessível
                            </Option>
                            <Option>
                                Caro
                            </Option>
                            <Option>
                                Muito Caro
                            </Option>
                        </Select>
                    </FormItem>

                    <FormItem label="Categoria">
                        <Select value={inputCategory} onChange={(e) => setInputCategory(e.target.value)}>
                            <Option>
                                Aperitivo
                            </Option>
                            <Option>
                                Entrada
                            </Option>
                            <Option>
                                Sopa
                            </Option>
                            <Option>
                                Carne
                            </Option>
                            <Option>
                                Peixe
                            </Option>
                            <Option>
                                Sobremesa
                            </Option>
                            <Option>
                                Vegetariano
                            </Option>
                            <Option>
                                Vegan
                            </Option>
                            <Option>
                                Bebida
                            </Option>
                        </Select>
                    </FormItem>

                </FormGroup>
                <FormGroup titleText="Receita">

                    <FormItem label={<Label style={{ alignSelf: 'start', paddingTop: '0.25rem' }}>Ingredientes</Label>}>
                        <TextArea
                            value={inputIngredients}
                            onChange={(e) => setInputIngredients(e.target.value)}
                            placeholder="-1ºIngrediente"
                            growing={true}
                            rows={5}

                            style={{ width: '80%' }}
                        />
                    </FormItem>
                    <FormItem label={<Label style={{ alignSelf: 'start', paddingTop: '0.25rem' }}>Passos</Label>}>
                        <TextArea
                            value={inputSteps}
                            onChange={(e) => setInputSteps(e.target.value)}
                            placeholder="-1ºPasso "
                            growing={true}
                            rows={5}
                            style={{ width: '80%' }}
                        />
                    </FormItem>
                </FormGroup>

            </Form>
        </Dialog>
    );
};

export default NewRecipe;
