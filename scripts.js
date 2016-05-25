/**/
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
            var r = new FileReader();
            r.onload = function(e) { 
                var contents = e.target.result;
                $('#texto').html($('#texto').html()+contents+"\n");
            }
            r.readAsText(f);  
            ban = true;
        }                                   
    }
    if(ban){
        document.getElementById('list').innerHTML += output.join('');   
    }   
}

function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}
jQuery
// Setup the dnd listeners.
var dropZone = document.getElementById('drop_zone');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);