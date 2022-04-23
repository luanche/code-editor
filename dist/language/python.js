languages['python'] = {
    defaultCode: '#!/usr/bin/python\n\n\'\'\'\ncomment\nblock comment\n\'\'\'\nprint("Hello, World!")',
    grammars: [
        {
            'grammars': [
                {
                    'name': 'comment',
                    'pattern': /'''[\s\S]*?'''|"""[\s\S]*?"""$/gm
                },
                {
                    'name': 'string',
                    'pattern': /'[^\r\n]*?'|"[^\r\n]*?"/g
                },
                {
                    'name': 'comment.inline',
                    'pattern': /(\#)[\s\S]*?$/gm
                },
            ]
        },

        {
            'name': 'constant',
            'pattern': [
                "False", "True", "None"
            ]
        },
        {
            'name': 'operator',
            'pattern': /\+|\!|\-|&(gt|lt|amp);|\||\*|\/|\=/g
        },
        {
            'name': 'integer',
            'pattern': /\b(0x[\da-f]+|\d+)\b/g
        },
        {
            'name': 'keywords',
            'pattern': [
                'and', 'as', 'assert',
                'break',
                'class', 'continue',
                'def', 'del',
                'elif', 'else', 'except',
                'finally', 'for', 'from',
                'global',
                'if', 'import', 'in', 'is',
                'lambda',
                'nonlocal', 'not',
                'or',
                'pass',
                'raise', 'return',
                'try',
                'while', 'with',
                'yield',
            ]
        },
        {
            'name': 'functions',
            'pattern': [
                'abs', 'all', 'any',
                'basestring', 'bin', 'bool', 'bytearray',
                'callable', 'chr', 'classmethod', 'cmp', 'compile', 'complex',
                'divmod', 'delattr', 'dict', 'dir',
                'enumerate', 'eval', 'execfile', 'exec',
                'file', 'filter', 'float', 'format', 'frozenset',
                'getattr', 'globals',
                'hasattr', 'hash', 'help', 'hex',
                'input', 'int', 'isinstance', 'issubclass', 'iter', 'id',
                'len', 'list', 'locals', 'long',
                'map', 'max', 'memoryview', 'min',
                'next',
                'open', 'ord', 'object', 'oct',
                'pow', 'print', 'property',
                'range', 'raw_input', 'reduce', 'reload', 'repr', 'reverse', 'round',
                'staticmethod', 'str', 'sum', 'super', 'set', 'setattr', 'slice', 'sorted',
                'tuple', 'type',
                'unichr', 'unicode',
                'vars',
                'xrange',
                'zip',
                '__import__',
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