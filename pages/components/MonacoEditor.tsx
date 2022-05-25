import React, { useRef, useState } from "react";
import dynamic from 'next/dynamic'
import styles from '../../styles/Editor.module.scss'
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { useEffect } from "react";

import { useMonaco } from '@monaco-editor/react'
import * as Monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { useCallback } from "react";
import { themes } from "../data";

const Editor = dynamic(
  () => import('@monaco-editor/react'),
  { ssr: false }
)
export interface Cursor {
    line: number,
    col: number,
    userId?: string
}
interface Props {
  value: string;
  otherCursor: Cursor;
  onCursorPositionChange: (cur: Cursor) => void
  onChange: (value?: string) => void;
}
const MonacoEditorComponent = ({ otherCursor, onChange, onCursorPositionChange, value }: Props) => {
  const { language, fontSize, theme } = useSelector((state: RootState) => state.settings)

  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor>(null)
  const monaco = useMonaco()

  // useEffect(() => {
  //   editorRef?.current?.deltaDecorations([], [{
  //     range: new Monaco.Range(otherCursor.line, otherCursor.col, otherCursor.line, otherCursor.col + 1), options: { className: 'my-cursor' }
  //   }])
  // }, [otherCursor])

  function handleEditorDidMount(editor, monaco) {
    editor.onDidChangeCursorPosition((e) => {
      if (onCursorPositionChange) {
        onCursorPositionChange({
          line: e.position.lineNumber,
          col: e.position.column
        })
      }
    })
    editorRef.current = editor; 
  }

  const applyTheme = useCallback((theme, data) => {
    monaco?.editor?.defineTheme(theme, data);
      monaco?.editor?.setTheme(theme);
  }, [monaco?.editor])

  useEffect(() => {
    async function downloadAndApply() {
      const themeValue = themes[theme]
      const res = await fetch(`/themes/${themeValue}.json`)
      const data = await res.json()
      applyTheme(theme, data)
    }
    downloadAndApply()
  }, [theme, applyTheme])

  return (
    <Editor
      height="100vh"
      className={styles.container}
      theme='vs-dark'
      onMount={handleEditorDidMount}
      defaultLanguage="javascript"
      language={language}
      value={value}
      options={{
        fontSize
      }}
      onChange={(val) => onChange(val)}
    />
  );
};

export default MonacoEditorComponent;
