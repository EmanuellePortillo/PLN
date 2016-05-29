/**/
var r = new FileReader();
function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files; // FileList object.

    // files is a FileList of File objects. List some properties.
    var output = [];
    var ban = false;
    for (var i = 0, f; f = files[i]; i++) {
        if(f.type == 'text/plain' ){
            output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                f.size, ' bytes, last modified: ',
                f.lastModifiedDate.toLocaleDateString(), '</li>');
            r.onload = function(e) { 
                var contents = e.target.result;
                $('#texto').val($('#texto').val()+contents+"\n");
            }
            r.readAsText(f);  
            ban = true;
        }                                   
    }
    //if(ban){
        document.getElementById('list').innerHTML += output.join('');   
    //}   
}

function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}
// Setup the dnd listeners.
var dropZone = document.getElementById('drop_zone');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);
var ban_stemmer = false;
var vacios = 0;
jQuery(document).ready(function(e){
    function make_stemmer(){
        var text = [];
        if(ban_stemmer == false){
            var lines = jQuery('#texto').val().split("\n"); ///([\wáéíóú]+) ?(\n\r?)?/gi
            jQuery('#texto').val("");
            //var new_lines = []
            var evento = new Event('actualizar');           
            for (var i = 0; i < lines.length; i++) {                
                var line = lines[i];
                if(line == '') {
                    vacios++;
                    continue;
                }
                words = line.split(/([\wñáéíóú]+)+/i);
                console.log(words);
                var worker = new Worker('stemmer.js');

                worker.onmessage = function(e) {
                    //document.getElementById("PiValue").innerHTML = e.data.PiValue;
                    text[e.data.i] = e.data.words.join("").replace(/\s+/," ");
                    if(text.contar()+vacios == e.data.lines){
                        text_stemmer(text);
                    }
                    jQuery('#progreso').attr("aria-valuenow",e.data.i/e.data.lines.length*100).css('width',(e.data.i/e.data.lines.length*100) + "%").html(Math.round(e.data.i/e.data.lines.length*100,2)+" % ");
                };
                worker.onerror = function(e) {
                    alert('Error: Line ' + e.lineno + ' in ' + e.filename + ': ' + e.message);
                };

                //start the worker
                worker.postMessage({ 
                    'value': {'palabras':words,'contador':i,'lines':lines.length}
                });
                /*setTimeout(function(words,i,lines){
                    var new_words = [];
                    for(j = 0; j < words.length; j++){
                        var word = words[j];                    
                        new_words.push(Stemmer.stemm(word));                    
                    }
                    jQuery('#texto').val(jQuery('#texto').val()+new_words.join(" ") + "\n");
                    
                    jQuery('#progreso').attr("aria-valuenow",i/lines.length*100).css('width',(i/lines.length*100) + "%").html(Math.round(i/lines.length*100,2)+" % ");
                }.bind(this,words,i,lines),8);*/
            }
            ban_stemmer = true;
        }
    }
    jQuery('.btn>input').click(function(evt){
        if(jQuery('#texto').val() != ''){
            if(this.id == 'stemmer'){
                make_stemmer();
            }
            jQuery(this).prop('checked',true);
            jQuery(this).addClass("active");
        }
    });
    jQuery('#del-dig').click(function(e){
        var re = /([^a-zA-Z0-9@_-]\d+)([^a-zA-Z0-9@_-])/g; 
        var str =jQuery('#texto').val();
        var m;
        var new_str;
        if(str!=""){
            str = str.replace(/\n|\r/g," *@@* ");
            new_str = str.replace(re," ");
            while(new_str.indexOf(' *@@* ')!=-1){
                new_str = new_str.replace(" *@@* ","\n");
            }
        }
        jQuery('#texto').val(new_str) 
    });
    jQuery('#del-gui').click(function(e){
        var re = /(\W-+)/g; 
        var str =jQuery('#texto').val();
        var m;
        var new_str;
        if(str!=""){
        str = str.replace(/\n|\r/g," *@@* ");
        new_str = str.replace(re," ");
        while(new_str.indexOf(' *@@* ')!=-1){
            new_str = new_str.replace(" *@@* ","\n");
        }
                
        }
        jQuery('#texto').val(new_str) 
    });
});
Array.prototype.contar = function(){
    return this.filter(function(value) { return value !== undefined }).length;
}
function text_stemmer(texto){
    texto.forEach(function(element) {
        jQuery('#texto').val(jQuery('#texto').val()+element + "\n");
    }, this);
}