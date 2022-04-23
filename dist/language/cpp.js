languages['cpp'] = {
    defaultCode: '#include <iostream>\n/**\n *comment\n *block comment\n */\nusing namespace std;\nint main()\n{\n    //inline comment\n    cout << \"Hello, world!\" << endl;\n    return 0;\n}',
    grammars: [
        {
            'grammars': [
                {
                    'name': 'string',
                    'pattern': /'[^\r\n]*?'|"[^\r\n]*?"/g
                },
                {
                    'name': 'comment',
                    'pattern': /\/\*[\s\S]*?\*\/|(\/\/)[\s\S]*?$/gm
                }
            ]
        },
        {
            'name': 'constant',
            'pattern': [
                "true", "false", "null"
            ]
        },
        {
            'name': 'include',
            'pattern': /#include[\s]+?&lt;[\w\.]+?&gt;/g
        },
        {
            'name': 'operator',
            'pattern': /\+|\!|\-|&(gt|lt|amp);|\||\*|\/|\=|\&|\^/g
        },
        {
            'name': 'integer',
            'pattern': /\b(0x[\da-f]+|\d+)\b/g
        },
        {
            'name': 'keywords',
            'pattern': [
                'asm', 'auto',
                'bool', 'break',
                'class', 'char', 'const', 'const_cast', 'case', 'catch', 'continue',
                'double', 'dynamic_cast', 'do', 'default', 'delete',
                'enum', 'explicit', 'export', 'extern', 'else',
                'float', 'for', 'friend',
                'goto',
                'int', 'if', 'inline',
                'long',
                'mutable',
                'namespace', 'new',
                'operator',
                'private', 'protected', 'public',
                'register', 'reinterpret_cast', 'return',
                'short', 'struct', 'signed', 'static', 'static_cast', 'switch', 'sizeof',
                'typedef', 'typeid', 'typename', 'template', 'this', 'throw', 'try',
                'union', 'unsigned', 'using',
                'void', 'virtual', 'volatile',
                'while', 'wchar_t',
            ]
        },
        {
            'name': 'functions',
            'pattern': [
                'abs',
                'cout', 'cin', 'ceil',
                'endl', 'exit',
                'floor',
                'isupper', 'islower', 'isalpha', 'isdigit',
                'pow',
                'rand',
                'setw', 'setfill', 'strcpy', 'strcmp', 'sqrt', 'srand', 'system',
                'time', 'toupper', 'tolower',
            ]
        },
        {
            'name': 'custom.functions',
            'pattern': /\b([A-Za-z_][A-Za-z1-9_]*)(?=\()\b/g
        },
        {
            'name': 'custom.variable',
            'pattern': /\b([A-Za-z_][A-Za-z1-9_]*)\b/g
        },
    ]
};