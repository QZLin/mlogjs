import "./style.css";
import Editor, { EditorProps, Monaco } from "@monaco-editor/react";
import { Compiler } from "mlogjs";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import SplitPane from "react-split-pane";
import lib from "mlogjs/lib!raw";
import { editor } from "monaco-editor";

export function App() {
  const compiler = useMemo(() => new Compiler(), []); // for future editor upgrades
  const [compiled, setCompiled] = useState("");
  const [code, setCode] = useState(localStorage.getItem("code") ?? "");
  const [monaco, setMonaco] = useState<Monaco>(null);
  const [editor, setEditor] = useState<editor.IStandaloneCodeEditor>(null);

  const onMount: EditorProps["onMount"] = (editor, monaco) => {
    const defaults = monaco.languages.typescript.typescriptDefaults;
    defaults.setCompilerOptions({
      noLib: true,
      allowNonTsExtensions: true,
    });
    for (const [name, content] of lib) {
      defaults.addExtraLib(content, name);
    }
    setMonaco(monaco);
    setEditor(editor);
  };

  function compileAndShow() {
    if (!editor) return;
    const model = editor.getModel();
    const [output, error, [node]] = compiler.compile(code);
    const markers: editor.IMarkerData[] = [];
    if (error) {
      if (node) {
        const { start, end } = node.loc;
        markers.push({
          message: error.message,
          startLineNumber: start.line,
          startColumn: start.column + 1,
          endLineNumber: end.line,
          endColumn: end.column + 1,
          severity: monaco.MarkerSeverity.Error,
        });
      }
      setCompiled(error.message);
    } else {
      setCompiled(output);
    }
    localStorage.setItem("code", code);
    monaco.editor.setModelMarkers(model, "mlogjs", markers);
  }

  useEffect(compileAndShow, [code, editor]);

  return (
    <Fragment>
      <SplitPane split="horizontal" defaultSize="50%">
        <Editor
          onChange={setCode}
          language="typescript"
          onMount={onMount}
          value={code}
        />
        <Editor value={compiled} options={{ readOnly: true }}></Editor>
      </SplitPane>
    </Fragment>
  );
}
