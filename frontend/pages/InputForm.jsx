import React, { useState } from 'react';
//import { useNavigate } from 'react-router-dom';
//import { Link } from 'react-router-dom';




const InputForm = ({ onSendMessage }) => {
  //const [record, setRecord] = useState('');
  const [inputText, setInputText] = useState('');
 

  const handleInputChange = (event) => {
    const value = event.target.value;
    if (value.length <= 200) {
      setInputText(value);
      
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    onSendMessage(inputText);
    setInputText('');
  };
  

  return (
    <div className="input-form">
      
      <textarea
        className="custom-textarea"
        rows={5}
        cols={50}
        value={inputText}
        onChange={handleInputChange}
        placeholder={`Enter message for the people who are working on this project (maximum 200 characters)`}
      />
      <p className="characters-remaining">Characters remaining: {200 - inputText.length}</p>

      <style jsx>{`
        .input-form {
          background-color: #FFFAD7;
          border: 1px solid #ccc;
          padding: 15px;
          margin-bottom: 20px;
          border-radius: 10px;
          height: 150px;
	      width: 400px;
         
        }
        
        .custom-textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          resize: vertical;
          background-color: #f5f5f5;
          color: #27374D;
        }

        .characters-remaining {
          color: #999;
        }
      `}</style>
    </div>
  );
};

export default InputForm;
