languages['c'] = {
    defaultCode: '#include <stdio.h>\n/**\n *comment\n *block comment\n */\nint main()\n{\n    //inline comment\n    printf(\"Hello, World \\n\");\n    return 0;\n}',
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
                },
            ]
        },
        {
            'name': 'constant',
            'pattern': [
                'null', "NULL",
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
                'auto',
                'break',
                'continue', 'case', 'const', 'char',
                'double', 'do', 'default',
                'else', 'extern', 'enum',
                'for', 'float',
                'goto',
                'if', 'int',
                'long',
                'return', 'register',
                'short', 'static', 'struct', 'switch', 'signed', 'sizeof',
                'typedef',
                'unsigned', 'union',
                'void', 'volatile',
                'while',
            ]
        },
        {
            'name': 'functions',
            'pattern': [
                'abs',
                'ceil',
                'exit',
                'floor',
                'getchar',
                'isupper', 'islower', 'isalpha', 'isdigit',
                'printf', 'putchar', 'pow',
                'rand',
                'scanf', 'strcpy', 'strcmp', 'srand', 'system', 'sqrt',
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