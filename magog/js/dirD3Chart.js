// directive to draw a donut chart from an object called 'data' that has labels and counts

app.directive('d3Chart', function(){
    function link(scope, el, attr){
        var color = d3.scale.category10();
        var width = 500;
        var height = 500;
        var legendRectSize = 18;
        var legendSpacing = 4;
        var donutWidth = 75;
        var radius = Math.min(width, height) / 2;

        var svg = d3.select(el[0]).append('svg')
            .attr({width: width, height: height})
            .append('g')
            .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

        var arc = d3.svg.arc()
            .outerRadius(radius)
            .innerRadius(radius - donutWidth);

        var pie = d3.layout.pie()
            .sort(null)
            .value(function(d){ return d.value; });

        var tooltip = d3.select('#chart')
            .append('div')
            .attr('class', 'tooltip');

        tooltip.append('div')
            .attr('class', 'label');
        tooltip.append('div')
            .attr('class', 'count');
        tooltip.append('div')
            .attr('class', 'percent');

        var path = svg.selectAll('path');

        scope.$watch('data', function(data){
            scope.data = data;
            path = path.data(pie(data));
            path.enter().append('path');
            path.attr('d', arc);
            path.style('stroke', 'white');
            path.attr('fill', function(d, i){
                return color(d.data.name);
            });
            path.exit().remove();
            var legend = svg.selectAll('.legend')
                .data(color.domain())
                .enter()
                .append('g')
                .attr('class', 'legend')
                .attr('transform', function(d, i) {
                    var height = legendRectSize + legendSpacing;
                    var offset =  height * color.domain().length / 2;
                    var horz = -2 * legendRectSize;
                    var vert = i * height - offset;
                    return 'translate(' + horz + ',' + vert + ')';
                });
            legend.append('rect')
                .attr('width', legendRectSize)
                .attr('height', legendRectSize)
                .style('fill', color)
                .style('stroke', color);
            legend.append('text')
                .attr('x', legendRectSize + legendSpacing)
                .attr('y', legendRectSize - legendSpacing)
                .text(function(d) { return d; }
            );
        }, true);
    }
    return {
        link: link,
        restrict: 'E',
        scope: { data: '=' }
    };
});