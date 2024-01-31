import '../App.css';
import { Card, Icon } from '@ui5/webcomponents-react';


const RecipeItem = ({ setIsOpen,setSelected, ...props }) => {

    return (
        <center>
            <div className='height-div'></div>
            <Card style={{
                width: '100%'
            }}
                onClick={() => {
                    setIsOpen(true)
                    setSelected(props.item)
                }}>
                <div>
                    <p className='recipe-title'> {props.item.title}</p>
                    <img src={props.item.image} style={{width:'95%'}}></img>
                    <center>
                        <div style={{ display: 'flex', height: '40px' }} >
                            <div style={{ display: 'flex', width: '33%', margin: '12px' }} >
                                <Icon name="lateness"/>
                                <span>{props.item.time}</span>
                                <span style={{ marginRight: '4px' }} >min</span>
                            </div>
                            <div style={{ display: 'flex', width: '33%', margin: '12px' }} >
                                <Icon name="suitcase" />
                                <span>{props.item.complexity}</span>
                            </div>
                            <div style={{ display: 'flex', width: '33%', margin: '12px' }} >
                                <Icon name="lead"/>
                                <span>{props.item.affordability}</span>

                            </div>
                        </div>
                    </center>
                </div>
            </Card>

        </center >
    );
};

export default RecipeItem;
