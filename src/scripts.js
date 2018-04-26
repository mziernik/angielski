var voicelist = responsiveVoice.getVoices();
var fileName = "plik.txt";

function playWord(edit, voice, onDone) {

    var text = edit.value;
    edit.style.backgroundColor = "yellow";
    setTimeout(function () {
        if (!text) {
            onDone();
            return;
        }
        var en = voice.indexOf("nglish") > 0;
        var words = text.split(",");

        function playInternal() {
            responsiveVoice.speak(words.shift().trim(), voice, {
                //   pitch: 2,
                rate: en ? 0.6 : 0.85,
                volume: 1,
                onstart: function () {
                    edit.style.backgroundColor = "lime";
                },
                onend: function () {
                    if (words.length) return setTimeout(playInternal, 200);
                    edit.style.backgroundColor = null;
                    onDone();
                }
            });
        }

        playInternal();
    }, 1000);

}

function playRow(tr, onDone) {
    if (!tr) return;
    var edits = tr.getElementsByTagName("INPUT");
    playWord(edits[0], "Polish Female", function () {
        playWord(edits[1], "US English Female", function () {
            if (onDone) onDone(tr);
        })
    });
}

function playAll() {
    function internalPlay(tr) {
        playRow(tr, function (t) {
            internalPlay(t.nextSibling);
        });
    };
    internalPlay(document.getElementById("tbl").getElementsByTagName("tr")[0]);
}


function save() {
    var rows = document.getElementById("tbl").getElementsByTagName("tr");
    var text = "";
    for (var i = 0; i < rows.length; i++) {
        var edits = rows[i].getElementsByTagName("input");
        text += edits[0].value + " : " + edits[1].value + "\n";
    }
    var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
    saveAs(blob, fileName);
}

addEventListener("keydown", function (e) {
    if (e.ctrlKey && !e.altKey && e.code == 'KeyS') {
        e.cancelBubble = true;
        e.preventDefault();
        save();
    }
});
addEventListener("load", function () {
    addRow("", "");
});


function addRow(pl, en, parent) {
    function onKeyDown(e) {

        function getRow() {
            var row = e.currentTarget;
            while (row.nodeName !== "TR")
                row = row.parentNode;
            return row;
        }

        if (e.keyCode === 13) {
            var tr = getRow();
            addRow("", "", getRow());
        }

        if ((e.keyCode === 8 || e.keyCode === 46) && e.ctrlKey) {
            var row = getRow();
            row.parentNode.removeChild(row);
        }
    }

    var tbl = document.getElementById("tbl");
    var tr = document.createElement("tr");
    if (parent)
        parent.parentNode.insertBefore(tr, parent.nextSibling);
    else
        tbl.appendChild(tr);

    var td = document.createElement("td");
    tr.appendChild(td);
    var edtPl = document.createElement("input");
    td.appendChild(edtPl);
    edtPl.value = (pl || "").trim();
    edtPl.onkeydown = onKeyDown;
    edtPl.focus();

    var td = document.createElement("td");
    tr.appendChild(td);
    var edtEn = document.createElement("input");
    td.appendChild(edtEn);
    edtEn.value = (en || "").trim();
    edtEn.onkeydown = onKeyDown;

    var td = document.createElement("td");
    tr.appendChild(td);
    var a = document.createElement("a");
    a.innerText = "odtwórz";
    td.appendChild(a);
    a.href = "javascript:void(0)";
    a.onclick = function () {
        playRow(tr);
    };

}

function load(file) {

    fileName = file.name;
    document.title = fileName;
    var reader = new FileReader();
    reader.onload = function () {
        var text = reader.result;
        document.getElementById("tbl").innerHTML = "";

        text.split("\n").forEach(function (line) {
            var words = line.split(":");
            if (!words) return;
            if (words.length === 1 && !words[0].trim()) return;
            addRow(words[0], words[1]);
        })

    };
    reader.readAsText(file);
}

addEventListener("drop", function (e) {
    e.stopPropagation();
    e.preventDefault();
    var file = e.dataTransfer.files[0];
    if (file) load(file);
})

addEventListener("dragover", function FileDragHover(e) {
    e.stopPropagation();
    e.preventDefault();
    e.target.className = (e.type == "dragover" ? "hover" : "");
})



