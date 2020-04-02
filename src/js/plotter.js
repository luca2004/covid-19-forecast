
import Plotly from 'plotly.js';


class Plotter{

    constructor(opts){
        this.opts = Object.assign( {
            selectorId: 'graphdiv', startdate: null
        }, opts );
    }

    clear(){
        let element = document.getElementById( this.opts.selectorId );
        element.innerHTML = '';
    }

    get_xAxis( x ){
        const _MS_PER_DAY = 1000 * 60 * 60 * 24;
        function __(n){   return n < 10 ? '0'+n : ''+n; }
        if(this.opts.startdate){
            let date = new Date( (this.opts.startdate.getTime() + x * _MS_PER_DAY) );
            return date.getFullYear()+'-'+__(date.getMonth()+1)+'-'+__(date.getDate());
        }
        
        return x;
    }
    convert_data_to_arrays(data){
        let xArray = [];
        let yArray = [];
    
        data.forEach(el => {                
          xArray.push( this.get_xAxis( el.x ) );
          yArray.push( el.y );
        });

        return { x: xArray, y: yArray };
    }

    plot(data, bNew, name){
        let element = document.getElementById( this.opts.selectorId );

        data = this.convert_data_to_arrays( data );

        if(name == null)    name = 'trace';
        var trace = Object.assign({
            type: 'scatter',
            name: name            
        }, data);
        
        let config = {
            scrollZoom: true,
            showSendToCloud: false,
            showEditInChartStudio: false,
            displaylogo: false,
            modeBarButtonsToRemove: ['toImage', 'sendDataToCloud', 'toggleSpikelines', 'resetViews', 'toggleHover',
                                'zoomInGeo', 'zoomOutGeo', 'resetGeo', 'hoverClosestGeo', 
                                'hoverClosestGl2d', 'hoverClosestPie',
                                'hoverClosestCartesian', 'hoverCompareCartesian', 'resetViewMapbox']
        }

        var layout = {
            title: '&nbsp;&nbsp;',
            xaxis: {
              title: 'days'
            },
            yaxis: {
              title: 'daily new cases'
            }
          };
        if(bNew){
            Plotly.newPlot( element, [ trace ], layout, {showSendToCloud:true} );
        }
        else{
            Plotly.plot( element, [ trace ], layout, config );
        }
    }

}

export default Plotter;