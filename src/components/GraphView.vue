<template>
    <div class="graphview">
        <div class="row">
            <span class="label">Country</span>
            <el-select v-model="selectedCountryCode" class="select" placeholder="Select" @change="select_country">
                <el-option v-for="(item, index) in countryCode" :key="index" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
        </div>
        <hr />
        <div class="row">
            <span class="label">Outbreak Start Date</span>
            <el-date-picker v-model="datestart" class="input" type="date" placeholder="Enter Start date">
            </el-date-picker>
        </div>
        <div class="row">
            <span class="label">Estimated Outbreak End Date</span>
            <el-date-picker placeholder="Enter End Date" class="input" v-model="dateend" type="date"> </el-date-picker>
        </div>
        <div class="row" v-show="false">
            <span class="label">Gaussian Function</span>
            <el-input placeholder="Enter Function" class="input" v-model="mathfunction"></el-input>
        </div>
        <div class="row">
            <span class="label">Estimated total number infected</span>
            <el-input placeholder="Enter Factor k" class="input" v-model="k"></el-input>
        </div>
        <div class="row">
            <span class="label">Estimate date to peak</span>
            <el-input placeholder="" class="input" :value="date_to_peak" readonly></el-input>
            <!-- v-model="mean" -->
        </div>
        <div class="row" v-show="editMode">
            <span class="label">Mean</span>
            <el-input placeholder="" class="input" v-model="mean"></el-input>
            <!-- v-model="mean" -->
        </div>
        <div class="row" v-show="editMode">
            <span class="label">Standard Deviance (dev)</span>
            <el-input placeholder="Enter Standard Deviance  (dev)" class="input" v-model="dev"></el-input>
        </div>

        <hr />

        <div class="row">
            <el-button style="width: 30%" @click="plot_graph()">PLOT</el-button>
        </div>

        <div class="row" v-show="realtotalcases != 0">
            <span class="label">Actual Total number infected</span>
            <el-input placeholder="" class="input" v-model="realtotalcases"></el-input>
        </div>

        <div id="my_graph" v-loading="graph_loading"></div>
    </div>
</template>

<style scoped>
.row {
    padding: 10px;
}
.row .label {
    display: inline-block;
    width: 30%;
}
.row .input {
    width: 60%;
}
.row .select {
    width: 60%;
}

#my_graph {
    width: 90%;
    margin: auto;
    padding-top: 20px;
    padding-bottom: 20px;
}
</style>
<script>
import FunctionCalculator from "../js/functioncalculator.js";
//import * as d3 from "d3";
import plotter from "../js/plotter.js";
import covid19api from "../js/covid19info.js";
import countrycodes from "../js/countrycode.js";
import { create, all } from "mathjs";

class CountryCovidData {
    constructor(opts) {
        this.opts = Object.assign({ data: [] }, opts);
    }

    get_new_cases_for_day() {
        let ret = [];
        let prevVal = 0;
        let data = this.opts.data;
        data.result.forEach((item, index) => {
            ret.push({ x: index, y: item.confirmed - prevVal });
            prevVal = item.confirmed;
        });
        return ret;
    }

    get_new_cases_with_media_to_3_gg() {
        let new_cases = this.get_new_cases_for_day();
        let ret = [];
        let math = create(all, {});

        let len = new_cases.length;
        for (let i = 0; i < len; i++) {
            let c0 = 0;
            if (i - 1 >= 0) c0 = new_cases[i - 1].y;
            let c1 = new_cases[i + 0].y;
            let c2 = 0;
            if (i + 1 < len - 1) c2 = new_cases[i + 1].y;

            // Caso ultimi 2 campioni
            if (i >= len - 2) {
                c0 = new_cases[len - 3].y;
                c1 = new_cases[len - 2].y;
                c2 = new_cases[len - 1].y;
            }

            let m = math.mean(c0, c1, c2);
            ret.push({ x: i, y: m });
        }

        return ret;
    }

    get_total_cases() {
        let nbData = this.opts.data.result.length;
        if (nbData == 0) return 0;
        return this.opts.data.result[nbData - 1].confirmed;
    }
}

export default {
    name: "GraphView",
    props: {
        msg: String
    },
    data() {
        return {
            selectedCountryCode: "ITA",
            countryCode: countrycodes,
            mathfunction: "{k}((1 / ({dev} * sqrt(2*pi))) * (e) ^ (-(x-{mean})^2/(2*{dev}^2)))",
            datestart: "2020-02-22",
            dateend: "2020-05-22",
            // Gaussiana
            k: 100,
            dev: 1,
            mean: 30,
            graph_loading: false,
            //---------------------
            realtotalcases: 0,
            editMode: true
        };
    },
    mounted() {
        this.select_country();
    },
    computed: {
        date_to_peak: state => {
            return state.add_days_to_startdate(state.mean);
        }
    },
    methods: {
        convert_date_to_string(date) {
            const __ = n => {
                return n < 10 ? "0" + n : n;
            };
            if (date instanceof Date) {
                date = [date.getFullYear(), __(date.getMonth() + 1), __(date.getDate())].join("-");
            }
            return date;
        },
        select_country() {
            //console.log(this)
            let graph = new plotter({
                selectorId: "my_graph",
                startdate: new Date(this.datestart)
            });
            graph.clear();

            let selected = this.selectedCountryCode;
            let item = null;
            this.countryCode.forEach(el => {
                if (el.value == selected) {
                    item = el;
                    return false;
                }
            });

            if (item) {
                this.k = item.k;
                this.dev = item.dev;
                this.mean = item.mean;
                this.k = item.k;
                this.datestart = item.datestart;
                this.dateend = this.add_days_to_startdate(item.mean * 2, true);
            }
            this.realtotalcases = 0;
        },
        get_gaussian_function() {
            let func = this.mathfunction;
            func = func.replace("{k}", this.k);
            func = func.replace(/{dev}/g, this.dev);
            func = func.replace("{mean}", this.mean);
            return func;
        },
        add_days_to_startdate(days, checkNow) {
            const _MS_PER_DAY = 1000 * 60 * 60 * 24;
            let a = new Date(this.datestart);
            var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
            var utc2 = utc1 + days * _MS_PER_DAY;
            var date = new Date(utc2);
            if (checkNow) {
                let now = new Date();
                if (date < now) {
                    date = new Date(now.getTime() + 7 * _MS_PER_DAY);
                }
            }
            return this.convert_date_to_string(date);
        },
        get_diff_date() {
            const _MS_PER_DAY = 1000 * 60 * 60 * 24;
            let a = new Date(this.datestart);
            let b = new Date(this.dateend);
            var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
            var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

            return Math.floor((utc2 - utc1) / _MS_PER_DAY);
        },
        async plot_graph() {
            this.graph_loading = true;
            let graph = new plotter({
                selectorId: "my_graph",
                startdate: new Date(this.datestart)
            });
            graph.clear();

            let fc = new FunctionCalculator({
                xmin: 0,
                xmax: this.get_diff_date(),
                func: this.get_gaussian_function()
            });

            let gaussiana = fc.evaluateFunction();
            let api = new covid19api();
            let data = await api.CountryTimeSeriesData(
                this.selectedCountryCode,
                this.convert_date_to_string(this.datestart),
                this.convert_date_to_string(this.dateend)
            );

            let CCD = new CountryCovidData({ data: data });

            // console.log(data)

            graph.plot(gaussiana, true, "forecast");
            //console.log(data)
            graph.plot(CCD.get_new_cases_with_media_to_3_gg(), false, "real");
            this.graph_loading = false;
            this.realtotalcases = CCD.get_total_cases();
        }
    }
};
</script>
