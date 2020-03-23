
jQuery.fn.getPath = function () {
    if (this.length != 1) throw 'Requires one element.';

    var path, node = this;
    while (node.length) {
        var realNode = node[0], name = realNode.localName;
        if (!name) break;
        name = name.toLowerCase();

        var parent = node.parent();

        var siblings = parent.children(name);
        if (siblings.length > 1) { 
            name += ':eq(' + siblings.index(realNode) + ')';
        }

        path = name + (path ? '>' + path : '');
        node = parent;
    }

    return path;
};
function editElement(el) {
    $(el).find('.column').each(function (i, column) {
        $(column).find('*:eq(0)').each(function (i,inner) {
            console.log(inner)
          })

    })
}
console.log('')

$(function () {
    initDrag()
});
function initDrag(){
    $('.vhc-content > *').each(function (i, el) {
        $(el).draggable({
            start: function () {
                editElement(el)
                $(el).addClass('drag')
            },
            stop: function () {
                $(el).removeClass('drag')
                
            }
        })
    })
}