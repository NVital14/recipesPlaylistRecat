import React, { useState } from 'react';

const CITIES = [
    'New York',
    'San Francisco',
    'Tokyo',
    'London',
    'Paris'
];

const ListGroup = (props) => {
    const [text, setText] = useState();
    const [items, setItems] = useState(CITIES);

    const addItem = (text) => {
        setItems((items) => [...items, text]);
    }

    return (
        <div>
            <h1>List</h1>
            <input value={text} onChange={(e) => setText(e.target.value)} />
            <ul className="list-group">
                {items.map((item) => {
                    return <li>{item}</li>;
                })}
            </ul>
            <button onClick={() => addItem(text)}>Add</button>
        </div>
    );
}

export default ListGroup;