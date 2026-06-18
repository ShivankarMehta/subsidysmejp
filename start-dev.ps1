$nodeBin = "C:\Users\Shivanker\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin"
$env:PATH = "$nodeBin;$env:PATH"
& "node_modules\.bin\next.CMD" dev -p 3001
