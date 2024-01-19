import { useState, useRef, useEffect } from 'react';
import Editor from "@monaco-editor/react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { MonacoBinding } from "y-monaco";

function App() {
  const editorRef = useRef(null);
  const yTextInputRef = useRef(null); // Y.Text 객체를 위한 ref
  const yTextInputRef2 = useRef(null);//text2

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;

    // YJS 초기화
    const doc = new Y.Doc();
    const provider = new WebrtcProvider("test-room", doc);
    const yTextEditor = doc.getText("monaco");
    new MonacoBinding(yTextEditor, editor.getModel(), new Set([editor]), provider.awareness);

    // 입력 필드용 Y.Text 객체
    const yTextInput = doc.getText("textinput1");
    const yTextInput2 = doc.getText("textinput2");
    yTextInputRef.current = yTextInput;
    yTextInputRef2.current = yTextInput2;

    // 입력 필드 동기화를 위한 Y.Text 객체 관찰
    yTextInput.observe(() => {
      const inputElement = document.getElementById('yjs-input');
      if (inputElement) {
        inputElement.value = yTextInput.toString();
      }
    });

    yTextInput2.observe(() => {
      const inputElement = document.getElementById('yjs-input2');
      if(inputElement){
        inputElement.value = yTextInput2.toString();
      }
    });


  }

  // // 입력 필드 값 변경 처리
  // function handleInputChange(event) {
  //   const value = event.target.value;
  //   if (yTextInputRef.current) {
  //     yTextInputRef.current.delete(0, yTextInputRef.current.length);
  //     yTextInputRef.current.insert(0, value);
  //   }
  // }

  const handleInputChange = (event, yTextRef) => {
    const value = event.target.value;
    if(yTextRef.current)
    {
      console.log(event)
      console.log(value)
      console.log(yTextRef)
      yTextRef.current.delete(0, yTextRef.current.length);
      yTextRef.current.insert(0, value);
    }
  };

  return (
    <div>
      <h2>Hello</h2>
      <input
        id="yjs-input"
        type="text"
        onChange = {(e) => {handleInputChange(e, yTextInputRef)}}
        placeholder="Type here..."
      />

      <input
        id="yjs-input2"
        type="text"
        onChange = {(e) => {handleInputChange(e, yTextInputRef2)}}
        placeholder="Type here..."
      />
      <Editor
        height="100vh"
        width="100vw"
        theme="vs-dark"
        onMount={handleEditorDidMount}
      />
    </div>
  );
}

export default App;
