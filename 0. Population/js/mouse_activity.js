function hover_circle(){
    d3.selectAll(".nodes")
        .on('mouseover',function(d,i){
            d3.select(this).attr('fill','White');
            d3.select(this).attr('stroke','#212121');
            d3.select(this).attr('stroke-width','2px');

            let total_population = d['total_'+d.target_time];
            let male_ratio = Math.round((d['male_'+d.target_time] / total_population)*10000)/100;
            let female_ratio =  Math.round((d['female_'+d.target_time] / total_population)*10000)/100;

            let xCenter = +d3.select(this).attr('cx');
            let yCenter = +d3.select(this).attr('cy');
            let xLoc;
            let yLoc;
            let rad =  +d.Radius;

            if(xCenter>300&&yCenter>300){
                xLoc = xCenter-rad-130;
                yLoc = yCenter-rad-100;
            }
            else if(xCenter>300&&yCenter<300){
                xLoc = xCenter-rad-130;
                yLoc = yCenter + rad;
            }
            else if(xCenter<300&&yCenter<300){
                xLoc = xCenter+rad;
                yLoc = yCenter+rad;
            }
            else{
                xLoc = xCenter+rad;
                yLoc = yCenter-rad-100;
            }

            let tooltip = d3.select('#container')
                .append('g')
                .attr('id','tooltip')
                .attr('transform','translate('+xLoc+','+yLoc+')');

            tooltip.append('rect')
                .attr('width',130)
                .attr('height',100)
                .attr('fill','rgba(255,255,255,0.95)')
                .attr('stroke','#212121');


            tooltip.append('text')
                .text(d['adm_cd2'])
                .attr('fill','#212121')
                .attr('x',5)
                .attr('y',18)
                .style('font-size','14px')
                .style('font-weight','bold');

            if(d.target_time==='avg'){
                tooltip.append('text')
                    .text('Time: Average')
                    .attr('fill','#212121')
                    .attr('x',5)
                    .attr('y',37);
            }

            else{
                tooltip.append('text')
                    .text('Time: '+ d.target_time)
                    .attr('fill','#212121')
                    .attr('x',5)
                    .attr('y',37);
            }

            tooltip.append('text')
                .text('Total: ' + Math.round(total_population).toLocaleString())
                .attr('fill','#212121')
                .attr('x',5)
                .attr('y',55);

            tooltip.append('text')
                .text('Female: '+female_ratio+'%')
                .attr('fill','#212121')
                .attr('x',5)
                .attr('y',73);

            tooltip.append('text')
                .text('Male: '+male_ratio+'%')
                .attr('fill','#212121')
                .attr('x',5)
                .attr('y',91);
        });

    d3.selectAll(".nodes")
        .on('mouseout',function(d,i){
            if(!d3.select(this).attr('class').includes('clicked')){
                if (colormode === 'Monochrome') {
                    d3.select(this).attr('fill', '#212121');
                } else {
                    d3.select(this).attr('fill', c => cScale(c['gu']));
                }
                d3.select(this).attr('stroke','none');
            }
            d3.select('#tooltip').remove();
        });
}

function click_bubble() {
    d3.selectAll('.nodes')
        .on('click', function (d, i) {

            d3.select('.clicked').attr('stroke', 'none');

            if (colormode === 'Monochrome') {
                d3.select('.clicked').attr('fill', '#212121');
            } else {
                d3.select('.clicked').attr('fill', c => cScale(c['gu']));
            }

            if (d3.select(this).attr('class').includes('clicked')){
                d3.select('.clicked').classed('clicked', false);
            } else{
                d3.select('.clicked').classed('clicked', false);
                d3.select(this).classed('clicked', true);
                d3.select(this).attr('fill', 'White');
                d3.select(this).attr('stroke', '#212121');
                d3.select(this).attr('stroke-width', '2px');
                let id = d3.select(this).attr('id');
                let target_data = store.living_pop.filter(d=>d.adm_cd2===id)[0];
                update_linechart(target_data);
            }

        });
}

let dragTime = d3.drag()
    .on('drag', function() {
        let xPosition = d3.event.x;
        if(xPosition>=15 && xPosition<610){
            let time = Math.round(timeScaler.invert(xPosition));
            xPosition = timeScaler(time);
            d3.select(this).attr("cx", xPosition);
            console.log(pastSelect);
            if(pastSelect !== undefined){
                d3.select('#lineChart'+pastSelect)
                    .transition()
                    .attr('r',2)
                    .attr('fill','#212121');

                d3.select('#timeLabel'+pastSelect)
                    .style('display','none');
            }
            if(time===0){
                time = 'avg'
            }
            else{
                time = time -1;


                d3.select('#lineChart'+time)
                    .transition()
                    .attr('r',7)
                    .attr('fill','#F44336');

                d3.select('#timeLabel'+time)
                    .style('display','block');

                pastSelect = time;
            }

            update_radius(store.living_pop,simulation,time);

        }});