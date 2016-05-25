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
// Setup the dnd listeners.
var dropZone = document.getElementById('drop_zone');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);
var ban_stemmer = false;
jQuery(document).ready(function(e){
    function make_stemmer(){
        if(ban_stemmer == false){
            var words = jQuery('#texto').val().split(" "); ///([\wáéíóú]+) ?\n\r?/gi
            var new_words = [];
            for (var i = 0; i < words.length; i++) {
                var element = words[i];
                new_words.push(Stemmer.stemm(element));
            }
            jQuery('#texto').val(new_words.join(" "));
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
})