import React, { useState, useRef } from 'react';
import './App.css';
import Draggable from 'react-draggable';
import { Resizable } from 'react-resizable';
import axios from 'axios';

function App() {
  const [image, setImage] = useState('');
  const [text, setText] = useState('');
  const [textElements, setTextElements] = useState([]);
  const [previewTextSize, setPreviewTextSize] = useState({ width: 200, height: 50 });
  const [selectedTextIndex, setSelectedTextIndex] = useState(null);
  const imageContainerRef = useRef(null);

  const fetchImage = async () => {
    try {
      const response = await axios.get(
        'https://api.unsplash.com/photos/random?client_id=MhG5VmMenYXEw6Ju_MK28Ue3TqXuI8QfI5LqiPj0Hks'
      );
      setImage(response.data.urls.regular);
    } catch (error) {
      console.error(error);
    }
  };

  const addText = () => {
    if (text) {
      setTextElements([...textElements, { text, x: 10, y: 10 }]);
      setText('');
    }
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleDrag = (index, deltaPosition) => {
    const newElements = [...textElements];
    newElements[index].x += deltaPosition.x;
    newElements[index].y += deltaPosition.y;
    setTextElements(newElements);
  };

  const handleResize = (index, size) => {
    const newElements = [...textElements];
    newElements[index].width = size.width;
    newElements[index].height = size.height;
    setTextElements(newElements);
  };
  const handlePreviewResize = (event, { size }) => {
    setPreviewTextSize(size);
  };

  const handleTextClick = (index) => {
    setSelectedTextIndex(index);
    setText(textElements[index].text);
  };
  const updateText = () => {
    if (selectedTextIndex !== null && text !== '') {
      const updatedElements = [...textElements];
      updatedElements[selectedTextIndex].text = text;
      setSelectedTextIndex(null);
      setTextElements(updatedElements);
      setText('');
    }
  };
  return (
    <div className="Body">
      <header className="Bodyheader">
        <h1>Photo Fetch</h1>
        <button onClick={fetchImage}>Fetch Image</button>
        <div className="image-container" ref={imageContainerRef}>
          {image && <img src={image} alt="Fetched" />}
          {textElements.map((element, index) => (
            <Draggable
              key={index}
              onDrag={(e, data) => handleDrag(index, data)}
              bounds="parent"
              defaultPosition={{ x: element.x, y: element.y }}
            >
              <Resizable
                width={element.width || 200}
                height={element.height || 50}
                onResize={(e, data) => handleResize(index, data.size)}
              >
                <div className={`text-box  ${index === selectedTextIndex ? 'selected' : ''}`}
                  onClick={() => handleTextClick(index)}>
                  <p>{element.text}</p>
                </div>
              </Resizable>
            </Draggable>
          ))}
        </div>
        <div className='operation'>
          <input
            type="text"
            placeholder="Enter Text"
            value={text}
            onChange={handleTextChange}
          />
          <button className="foradd" onClick={addText}>Add Text</button>
          <button  className="forupdate" onClick={updateText} disabled={selectedTextIndex === null}>
            Update Text
          </button>
        </div>
        <div className="text-preview">
          <h3>Your text:</h3>
          <p>{text}</p>
        </div>
      </header>
    </div>
  );
}

export default App;
