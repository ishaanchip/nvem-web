import React, {useState, useEffect, useRef} from 'react'
import "./CodingTerminal.css"

//images & icons


//intercomponent imports
import { runCode, verifyCode } from './terminalHelper';
import { fetchNvemAccount } from "../../../generalHelper/simpleRoutes.js"


//external dependenices
import Editor from '@monaco-editor/react';
import { Button, Spinner } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';


const CodingTerminal = ({course_name, accountEmail, setCodeTaskProgress}) => {
    //1. code input
        const [userCode, setUserCode] = useState("");
        const editorRef = useRef()

        const onMount = (editor) =>{
            editorRef.current = editor;
            editor.focus();
        }

        const {data: code} = useQuery({
            queryKey:['code-history-data'],
            queryFn:async() => fetchNvemAccount(accountEmail, 'course_history'),
            staleTime:0
        })

        useEffect(() =>{
            if (code){
                setUserCode(code[0][course_name]['code_history'])
            }
        }, [code])




    //2. code output
        const [terminalOutput, setTerminalOutput] = useState("")
        const [errorOutput, setErrorOutput] = useState(false);
        const {data: terminalData, isFetching:fetchingTerminalResults, refetch:refetchingTerminalResults} = useQuery({
            queryKey:['terminal-output-data'],
            queryFn:async () => runCode(course_name, accountEmail, userCode),
            staleTime:0
        })



        useEffect(() =>{
            console.log(terminalData)
            if (terminalData?.run.stderr.length > 0){
                setErrorOutput(true)
                setTerminalOutput(terminalData?.run.stderr)
            }
            else{        
                setErrorOutput(false)
                setTerminalOutput(terminalData?.run.stdout)
            }
            verifyCode(course_name, terminalData?.run.stdout).then(data => setCodeTaskProgress(data))
        }, [terminalData])


        

    

    


  return (
    <div className='terminal-area'>
            <Editor 
                width="65%"
                height="600px" 
                theme='vs-dark'
                defaultLanguage="python" 
                value={userCode}
                onChange={(value) => setUserCode(value)}
                onMount={onMount}
                options={{
                    quickSuggestions: false,
                    suggestOnTriggerCharacters: false,
                    wordBasedSuggestions: false,
                    parameterHints: {
                        enabled: false
                    },
                    snippetSuggestions: "none",
                    tabCompletion: "off",
                    inlineSuggest: false,
                }}
            />
            <div className="output-code">
                <Button w="20%" m="2%" onClick={() => refetchingTerminalResults()}>Run Code</Button>

                <div className="output-results">
                    {
                        fetchingTerminalResults === true
                        ?
                        <Spinner
                            color="blue.400"
                            css={{ "--spinner-track-color": "colors.gray.200" }}
                        />
                        :
                        <h3 style={errorOutput === true ? {'color':'red'}: {}}>{terminalOutput}</h3>

                    }

                </div>

            </div>
    </div>
  )
}

export default CodingTerminal