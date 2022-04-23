var languages = new Object();
function Editor(id, options) {

    var outterID = id,
        outter = $("#" + outterID),
        inner = null,
        textarea = null,
        pre = null,
        preCaret = null,
        spanRow = null,
        spanCol = null,
        countTab = 4,
        language = 'c',
        languageOption = null,
        autoCompleteDiv = null,
        autoCompleteList = [],
        barckets = {
            34: {
                left: "\"",
                right: "\""
            },
            39: {
                left: "'",
                right: "'"
            },
            40: {
                left: "(",
                right: ")"
            },
            91: {
                left: "[",
                right: "]"
            },
            123: {
                left: "{",
                right: "}"
            }
        },

        code = "",
        codeReplaced = "",
        defaultCode = "",
        grammars = [];

    class UndoStack {
        currentPos;
        topPos;
        undoStack;

        constructor() {
            this.currentPos = 0;
            this.topPos = this.currentPos;
            this.undoStack = [];
            this.undoStack[0] = {
                value: textarea.val(),
                selectionStart: textarea.val().length,
                selectionEnd: textarea.val().length
            };
        }

        add2Undo() {
            if (this.undoStack[this.currentPos].value != textarea.val()) {
                var ele = textarea.get(0);
                //console.log(ele.selectionStart, ele.selectionEnd);
                this.undoStack[++this.currentPos] = {
                    value: textarea.val(),
                    selectionStart: ele.selectionStart,
                    selectionEnd: ele.selectionEnd
                };
                this.topPos = this.currentPos;
            }
        }

        reDo() {
            if (this.currentPos < this.topPos) {
                textarea.val(this.undoStack[++this.currentPos].value);
                var ele = textarea.get(0);
                ele.selectionStart = this.undoStack[this.currentPos].selectionStart;
                ele.selectionEnd = this.undoStack[this.currentPos].selectionEnd;
                _syncText();
            }
        }

        unDo() {
            if (this.currentPos > 0) {
                this.add2Undo();
                //console.log(this.undoStack, this.currentPos, this.topPos);
                textarea.val(this.undoStack[--this.currentPos].value);
                var ele = textarea.get(0);
                ele.selectionStart = this.undoStack[this.currentPos].selectionStart;
                ele.selectionEnd = this.undoStack[this.currentPos].selectionEnd;
                _syncText();
            }
        }

    }

    class AutoComplete {
        leftCode;
        rightCode;
        lastWord;
        isHidden;
        elements;
        activeNum;
        list;

        constructor() {
            this.leftCode = "";
            this.rightCode = "";
            this.lastWord = "";
            this._hidden();
            this.elements = [];
            this.activeNum = 0;
            this.list = [];
        }

        replaceltgt(str) {
            return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        }

        getReplacedSplitCode() {
            return {
                leftCode: this.replaceltgt(this.leftCode),
                rightCode: this.replaceltgt(this.rightCode)
            };
        }

        getUnreplacedSplitCode() {
            return {
                leftCode: this.leftCode,
                rightCode: this.rightCode
            };
        }

        getLastWord() {
            return this.lastWord;
        }

        updateUnreplacedSplitCode() {
            var pos = _getRowCol().currentPos;
            var tmpStr = code;
            this.leftCode = tmpStr.substring(0, pos);
            this.rightCode = tmpStr.substring(pos, tmpStr.length);
        }

        updateLastWord() {
            var arr = this.leftCode.split(/\b/);
            this.lastWord = arr[arr.length - 1];
        }

        update() {
            this.updateUnreplacedSplitCode();
            this.updateLastWord();

        }

        _isEmpty(str) {
            if (typeof str == "undefined" || str == null || str == "") {
                return true;
            } else {
                return false;
            }
        }

        _hidden() {
            autoCompleteDiv.css("visibility", "hidden");
            this.isHidden = true;
        }

        _unHidden() {
            autoCompleteDiv.css("visibility", "visible");
            this.isHidden = false;
        }

        upkey() {
            if (this.activeNum < this.list.length - 1) {
                this.activeNum++;
                this._append2div();
            }
        }

        downkey() {
            if (this.activeNum > 0) {
                this.activeNum--;
                this._append2div();
            }
        } s

        clickItem() {
            $("#" + outterID + " .auto-div .active").click();
        }

        _setScrollTop() {
            if (!$("#" + outterID + " .auto-div .active").position()) return;

            $("#" + outterID + " .auto-div").scrollTop(0);
            var activeTop = ($("#" + outterID + " .auto-div .active").position().top);
            var activeHeight = $("#" + outterID + " .auto-div .active").height();
            var divHeight = $("#" + outterID + " .auto-div").height();

            var scrollTop = 0;
            if (activeTop + activeHeight > divHeight) {
                scrollTop = activeTop + activeHeight - divHeight;
            }

            $("#" + outterID + " .auto-div").scrollTop(scrollTop);

        }

        _append2div() {
            var list = this.list;
            autoCompleteDiv.html("");
            var classes = {
                "keywords": "uil uil-bookmark keywords",
                "functions": "uil uil-box functions",
                "custom functions": "uil uil-box functions",
                "custom variable": "uil uil-layers variable",
            }
            for (var i = 0; i < list.length; i++) {
                var active = "inactive";
                if (i == this.activeNum) {
                    active = "active";
                }
                autoCompleteDiv.append(
                    "<div class='" + active + "' data-word='"
                    + list[i].word
                    + "'><i class='"
                    + classes[list[i].name]
                    + "'>  </i><span class='"
                    + list[i].name + "'>"
                    + list[i].word
                    + "</span></div>"
                );
            }
            this._addClickListener();
            this._setScrollTop();
        }

        _addClickListener() {
            var splitCode = this.getUnreplacedSplitCode();
            var leftCode = splitCode.leftCode;
            var rightCode = splitCode.rightCode;
            var lastWord = this.lastWord;

            var elements = $("#" + outterID + " .auto-div div");
            this.elements = elements;

            for (var i = 0; i < elements.length; i++) {
                elements[i].onclick = function () {
                    textarea.val(leftCode.substring(0, leftCode.length - lastWord.length) + rightCode);
                    undoObj.add2Undo();
                    var word = this.getAttribute("data-word");
                    var newCode = leftCode.substring(0, leftCode.length - lastWord.length) + word + rightCode;
                    textarea.val(newCode);
                    var ele = textarea.get(0);
                    textarea.focus();
                    ele.selectionStart = ele.selectionEnd = newCode.length - rightCode.length;
                    _syncText();
                    undoObj.add2Undo();
                    autoCompleteObj._hidden();
                }
            }
        }

        display2div() {
            var list = this.generateList();
            this.list = list;
            if (list.length == 0) {
                this._hidden();
            }
            this.activeNum = 0;
            this._append2div();
        }

        generateList() {
            var list = [];
            var lastWord = this.lastWord;
            if (this._isEmpty(lastWord)) {
                return list;
            }
            function searchWords(arr, name) {
                for (var i = 0; i < arr.length; i++) {
                    var num = arr[i].indexOf(lastWord);
                    if (num == 0 && arr[i] != lastWord) {
                        list[list.length] = {
                            name: name,
                            word: arr[i]
                        }
                    }
                }
            }
            //console.log(autoCompleteList);
            for (var key in autoCompleteList) {
                searchWords(autoCompleteList[key], key);
            }

            var customArr = $("#" + outterID + " #editor-pre .custom");
            var customWords = [];
            for (var i = 0; i < customArr.length; i++) {
                var existFlag = false;
                var name = customArr[i].className;
                var word = customArr[i].innerHTML;
                if (typeof customWords[name] == "undefined") {
                    customWords[name] = [];
                }
                for (var j = 0; j < customWords[name].length; j++) {
                    if (word == customWords[name][j]) {
                        existFlag = true;
                    }
                }
                if (!existFlag) {
                    customWords[name][customWords[name].length] = word;
                }
            }

            for (var key in customWords) {
                searchWords(customWords[key], key);
            }
            return list;
        }
    }

    var autoCompleteObj, undoObj;
    var isCtrl, isShift;
    __init();

    function __init() {
        __initDivs()
        _getOptions();
        languageOption = languages[language];
        _generateLanguageGrammars();
        textarea.val(defaultCode);
        autoCompleteObj = new AutoComplete();
        __bindFunctions();
        _syncText();
        undoObj = new UndoStack();
        isCtrl = false;
        isShift = false;
    }

    function __initDivs() {
        outter.append("<div class=\"editor-inner\"></div>");
        inner = $("#" + outterID + " .editor-inner");

        inner .append("<textarea id=\"editor-textarea\" class=\"editor editor-textarea\"></textarea>");
        inner .append("<pre id=\"editor-pre\" class=\"editor editor-pre\"></pre>");
        inner .append("<pre id=\"caret-pre\" class=\"editor caret-pre \"></pre>");
        inner .append("<div class=\"editor auto-div\"></div>");
        outter.append("<div class=\"row-col\">Row: <span id=\"row\">0</span>, Col: <span id=\"col\">0</span></div>");

        
        autoCompleteDiv = $("#" + outterID + " .auto-div");
        spanRow         = $("#" + outterID + " #row");
        spanCol         = $("#" + outterID + " #col");
        textarea        = $("#" + outterID + " #editor-textarea");
        pre             = $("#" + outterID + " #editor-pre");
        preCaret        = $("#" + outterID + " #caret-pre");

        inner .css("position", "relative");
        pre   .css("min-height", "500px");
        outter.css("box-shadow", "2px 2px 6px rgb(100, 100, 100)");
        // inner.css("overflow-y", "auto");
        // inner.css("max-height", "500px");
        
    }

    function _getOptions() {
        if (options !== undefined) {
            if (options.language !== undefined) {
                language = options.language;
            }
        }
    }

    function __generateRegExpByArray(array) {
        var str = '\\b(' + array[0];
        for (var i = 1; i < array.length; i++) {
            str += ('|' + array[i]);
        }
        str += ')(?=\\(|\\b)';
        return new RegExp(str, 'g');
    }

    function _addWords2List(arr, name) {
        //console.log(arr);
        autoCompleteList[name] = [];
        for (var i = 0; i < arr.length; i++) {
            autoCompleteList[name][autoCompleteList[name].length] = arr[i];
        }
    }

    function _generateLanguageGrammars() {
        defaultCode = languageOption.defaultCode;
        var languageGrammars = languageOption.grammars;
        for (var i = 0; i < languageGrammars.length; i++) {
            if (languageGrammars[i].grammars == undefined) {
                grammars[i] = [];
                grammars[i][0] = languageGrammars[i];
            } else {
                grammars[i] = languageGrammars[i].grammars;
            }
            for (var j = 0; j < grammars[i].length; j++) {
                if (!!grammars[i][j].pattern.length) {
                    _addWords2List(grammars[i][j].pattern, grammars[i][j].name);
                    grammars[i][j].pattern = __generateRegExpByArray(grammars[i][j].pattern);
                }
            }
        }

        console.log(grammars);
    }




    function __bindFunctions() {
        textarea.bind("input", function () {
            _syncText();
        });

        textarea.click(function () {
            showRowCol();
            autoCompleteObj._hidden();
        });
        textarea.select(function () {
            showRowCol();
            autoCompleteObj._hidden();
        });

        textarea.keydown(function (event) {
            if (event.which === 17)
                isCtrl = true;
            if (event.which === 16)
                isShift = true;
            if (event.which === 90 && isCtrl === true && isShift === false) {
                //console.log("Ctrl+Z");
                undoObj.unDo();
            }
            if (event.which === 90 && isCtrl === true && isShift === true) {
                //console.log("Ctrl+Shift+Z");
                undoObj.reDo();
            }
        }).keyup(function (event) {
            if (event.which === 17)
                isCtrl = false;
            if (event.which === 16)
                isShift = false;
        });

        textarea.keydown(function (event) {
            var key = event.which;
            //console.log("keydown: " + key);
            switch (key) {
                case 8:
                case 46:
                    undoObj.add2Undo();
                    deleteBrakets(this, key);
                    break;
                case 9:
                    if (autoCompleteObj.isHidden) {
                        addTab();
                        undoObj.add2Undo();
                        _syncText();
                    } else {
                        autoCompleteObj.clickItem();
                    }
                    event.preventDefault();
                    break;
                case 32:
                    undoObj.add2Undo();
                    break;
                case 13:
                    if (autoCompleteObj.isHidden) {
                        autoIndent();
                        undoObj.add2Undo();
                    } else {
                        autoCompleteObj.clickItem();
                    }
                    event.preventDefault();
                    break;
                case 38:
                    if (!autoCompleteObj.isHidden) {
                        autoCompleteObj.downkey();
                        event.preventDefault();
                    }

                    break;
                case 40:
                    if (!autoCompleteObj.isHidden) {
                        autoCompleteObj.upkey();
                        event.preventDefault();
                    }
                    break;
            }
        });
        textarea.keypress(function (event) {
            var key = event.which;
            var flag = true;
            switch (key) {
                case 34:
                case 39:
                case 40:
                case 91:
                case 123:
                    addBrackets(key);
                    flag = false;
                    break;
            }
            //console.log("keypress: " + key);
            autoCompleteObj._unHidden();
            return flag;
        });

        textarea.keyup(function (event) {
            var key = event.which;
            switch (key) {
                case 37:
                case 39:
                    if (autoCompleteObj.isHidden) {
                        showRowCol();
                    } else {
                        autoCompleteObj._hidden();
                    }
                    break;
                case 38:
                case 40:
                    if (autoCompleteObj.isHidden) {
                        showRowCol();
                    } else {
                        event.preventDefault();
                    }
                    break;
            }
            //console.log("keyup: " + key);
        });
    }

    function _generateWhiteStr(length) {
        var str = "";
        for (let i = 0; i < length; i++) {
            str += " ";
        }
        return str;
    }

    function autoIndent() {
        var insertStr = "\n";
        var data = _getRowCol();
        var lastLine = code.split(/[\r\n]/)[data.row - 1];
        var matches = lastLine.match(/^\s+/g);
        var count = 0;
        if (matches !== null) {
            count = matches[0].length;
        }
        insertStr += _generateWhiteStr(count);
        //console.log(count, insertStr);
        addExpressContent(insertStr, true);
        if (
            (/([\{\[\(]\s*)$/g.test(lastLine.substring(0, data.col - 1))
                && /^(\s*[\}\]\)])/g.test(lastLine.substring(data.col - 1, lastLine.length)))
            || /([\:]\s*)$/g.test(lastLine.substring(0, data.col - 1))
        ) {
            addExpressContent(_generateWhiteStr(countTab), true);
            addExpressContent("\n" + _generateWhiteStr(count, false));
        }
    }

    function addTab() {
        addExpressContent(_generateWhiteStr(countTab), true);
    }

    function addBrackets(key) {
        addExpressContent(barckets[key].left, true);
        addExpressContent(barckets[key].right, false);
    }

    function addExpressContent(str, move) {
        var obj = textarea.get(0);
        if (document.selection) {
            var sel = document.selection.createRange();
            sel.text = str;
        } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
            var startPos = obj.selectionStart;
            var endPos = obj.selectionEnd;
            var cursorPos = startPos;
            var tmpStr = obj.value;

            //console.log(startPos, endPos, cursorPos, tmpStr);
            obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
            if (move) {
                cursorPos += str.length;
            }
            obj.selectionStart = obj.selectionEnd = cursorPos;
        } else {
            obj.value += str;
        }
        undoObj.add2Undo();
        _syncText();
    }

    function matchBrakets(left, right) {
        var flag = false;
        for (var key in barckets) {
            if (left == barckets[key].left && right == barckets[key].right) {
                flag = true;
            }
        }
        return flag;
    }

    function deleteBrakets(obj, key) {
        if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
            var startPos = obj.selectionStart;
            var endPos = obj.selectionEnd;
            var cursorPos = startPos;
            var tmpStr = obj.value;

            var left = tmpStr.substring(cursorPos - 1, cursorPos);
            var right = tmpStr.substring(cursorPos, cursorPos + 1)
            if (matchBrakets(left, right)) {
                if (key == 8) {
                    obj.value = tmpStr.substring(0, cursorPos) + tmpStr.substring(cursorPos + 1, tmpStr.length);
                } else if (key == 46) {
                    obj.value = tmpStr.substring(0, cursorPos - 1) + tmpStr.substring(cursorPos, tmpStr.length);
                    _syncText();
                    cursorPos--;
                }
                obj.selectionStart = obj.selectionEnd = cursorPos;
            }
            obj.selectionStart
        }
    }


    function _addClass(el, class_name) {
        el.className += el.className ? ' ' + class_name : class_name;
    }

    function _getRowCol() {
        currentPos = textarea.get(0).selectionEnd;
        codeSplited = code.substring(0, currentPos).split(/[\r\n]/);
        row = codeSplited.length;
        col = codeSplited[codeSplited.length - 1].length + 1;
        ret = {
            currentPos: currentPos,
            row: row,
            col: col
        };

        return ret;
    }

    function showRowCol() {
        var caretPos = _getRowCol();
        spanRow.html(caretPos.row);
        spanCol.html(caretPos.col);
        _syncTextCaret();
    }



    function _syncTextCaret() {
        autoCompleteObj.update();
        var splitCode = autoCompleteObj.getReplacedSplitCode();
        preCaret.html(splitCode.leftCode + "<span id='caret'></span>" + splitCode.rightCode);
        var caret = $("#" + outterID + " #caret");
        autoCompleteDiv.offset({ top: caret.offset().top + caret.height(), left: caret.offset().left });

        autoCompleteObj.display2div();
    }

    function _syncText() {
        code = textarea.val();
        codeReplaced = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        pre.html(highlight(codeReplaced, grammars));
        showRowCol();
        //console.log("sync");
        textarea.css("height", pre.css("height"));
    }

    function highlight(codeReplaced, grammars) {
        var matches = [];

        function _inPartOf(start1, end1, start2, end2) {
            if (start2 >= start1 && start2 <= end1) {
                return true;
            }

            return end2 >= start1 && end2 <= end1;
        }

        function _intersects(start1, end1, start2, end2) {
            return _inPartOf(start1, end1, start2, end2) || _inPartOf(start2, end2, start1, end1);
        }

        function _patternsExec(grammarsLevel, execCode) {
            var patternMatches = [];
            for (var i = 0; i < grammarsLevel.length; i++) {
                if (new RegExp(grammarsLevel[i].pattern).test(execCode) == true) {
                    var temp = new RegExp(grammarsLevel[i].pattern).exec(execCode);
                    var pos = execCode.search(new RegExp(grammarsLevel[i].pattern));
                    var replacement = temp[0];
                    patternMatches[patternMatches.length] = {
                        'name': grammarLevel[i].name,
                        'replacement': replacement,
                        'pos': pos
                    }
                }
            }
            var patternMatch;
            var minPos = execCode.length;
            //console.log(patternMatches);
            for (var i = 0; i < patternMatches.length; i++) {
                if (patternMatches[i].pos < minPos) {
                    patternMatch = patternMatches[i];
                    minPos = patternMatch.pos;
                } else if (patternMatches[i].pos == minPos && patternMatches[i].replacement.length > patternMatch.replacement.length) {
                    patternMatch = patternMatches[i];
                    minPos = patternMatch.pos;
                }
            }

            if (patternMatches.length == 0) {
                return false;
            }
            return patternMatch;
        }

        for (var i = 0; i < grammars.length; i++) {
            var unHighlightCode = codeReplaced;
            var grammarLevel = grammars[i];
            var index = 0;
            var patternMatch;
            while ((patternMatch = _patternsExec(grammarLevel, unHighlightCode)) !== false) {
                var posStart = patternMatch.pos + index;
                var posEnd = posStart + patternMatch.replacement.length;
                index = posEnd;
                var match = {
                    'name': patternMatch.name,
                    'replacement': patternMatch.replacement,
                    'posStart': posStart,
                    'posEnd': posEnd
                };

                var flag = true;
                for (var j = 0; j < matches.length; j++) {
                    if (_intersects(matches[j].posStart, matches[j].posEnd - 1, match.posStart, match.posEnd - 1)) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    matches[matches.length] = match;
                }
                unHighlightCode = codeReplaced.substr(index);
            }
        }

        function compare(property) {
            return function (a, b) {
                var value1 = a[property];
                var value2 = b[property];
                return value1 - value2;
            }
        }

        matches = matches.sort(compare('posStart'));

        //console.log(matches);

        var highlightCode = "";
        unHighlightCode = codeReplaced;

        function wrapCodeInSpan(name, code) {
            return '<span class="' + name.replace(/\./g, ' ') + '">' + code + '</span>';
        }

        index = 0;
        for (var i = 0; i < matches.length; i++) {
            highlightCode =
                highlightCode +
                unHighlightCode.substr(index, matches[i].posStart - index) +
                wrapCodeInSpan(matches[i].name, matches[i].replacement)
                ;
            index = matches[i].posStart + matches[i].replacement.length;
        }
        highlightCode += (unHighlightCode.substr(index) + '<span class="end"> </span>');

        return highlightCode;
    }

    return {
        textarea: textarea,
        pre: pre,
        getCode: () => code,
        getHighlightCode: () => pre.html(),
    }

}
