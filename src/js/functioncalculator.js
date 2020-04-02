import { create, all } from 'mathjs'



class FunctionCalculator{

    constructor( opts ){
        this.xmin = 0;
        this.xmax = 60;

        this.opts = Object.assign( { 
            xmin: 0, xmax: 60, func: '-2x^2 + 120 * x'
        }, opts )

    }

    evaluateFunction(  ){

        const config = { }
        let math = create(all, config)

        let opts = this.opts;
        const f0 = math.compile(opts.func);
        let hyst = [];
        for(let i = opts.xmin; i < opts.xmax; i++){
            const scope3 = {
                x: i
            }
            hyst.push( { x: i, y: f0.evaluate(scope3)  }   );
        }

        return hyst;
    }
}

export default FunctionCalculator;