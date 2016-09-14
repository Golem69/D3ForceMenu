
    var r = 200;
    var pi = 3.14;
    var xnode = 90;
    var ynode = 90;

    var width = $(window).width(), height = $(window).height();
    var fill = d3.scale.category20();

    // container
    var divs = d3.select("#menu-chart");
    var svg = divs.append("svg").attr("width", width).attr("height", height);
    //datas
    var nodes = d3.select("#list").selectAll("li")[0];
    var count = nodes.length;
    nodes.forEach(function(d,i){
        if(i == 0){
            d.x = width / 2; d.y = height / 2;
        }else{
            d.y = (height / 2) - (r * Math.cos(2 * i * pi / (count - 1))) + 100;
            d.x = (width / 2) - (r * Math.sin(2 * i * pi / (count - 1))) + 100;
        }
    });

    var links = nodes.slice(1).map(function(d) {
        return {source: d, target: d.parentNode.parentNode};
    });

    //simulation
    var force = d3.layout.force()
            .charge(-(r*10))
            .nodes(nodes)
            .links(links)
            .linkDistance(r)
            .size([width, height])
            .start();

    var nodediv = divs.selectAll(".nodediv")
            .data(nodes)
            .enter().append("div")
            .html(function(d,i){ return innernode(d,i); })
            .attr("class", "nodediv")
            .attr("style", function(d) {
                return "top: " + (d.y - ynode/2) + "px; left: " + (d.x - xnode/2) + "px;";
            })
            .call(force.drag);

    var link = svg.selectAll(".link")
            .data(links)
            .enter().append("line")
            .attr("class", "link")
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

    force.on("tick", function() {

        nodediv.attr("style", function(d){
            return "top: " + (d.y - ynode/2) + "px; left: " + (d.x - xnode/2) + "px;";
        });

        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
    });


    $(window).bind('resize', function(){
        width = $(window).width();
        height = $(window).height();
        svg.attr("width", width).attr("height",height);
        force.size([width, height]);
        force.start();
    });

    function innernode(d,i){
        if(i > 0){return d.innerHTML;}else{return "Home";} return false;
    }

