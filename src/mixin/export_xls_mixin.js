import {parseTime} from '@/utils/index';
export const export_xls_mixin = {
    methods: {
        export_handle(fields, expdata) {
            const loading = this.$loading({
                lock: true,
                text: '正在导出数据',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            let colnames = fields.map(i => i.label);
            import('@/vendor/Export2Excel').then(excel => {
                const data = this.formatJson(fields, expdata);
                excel.export_json_to_excel({
                    header: colnames,
                    data,
                    filename: '',
                    autoWidth: false,
                    bookType: 'xlsx'
                })
                loading.close();
            })
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => {
                if (j.coltype === 'date' || j.coltype==='datetime') {
                    return parseTime(v[j.prop]);
                }
                else if (j.subprop){
                    return v[j.prop][j.subprop];
                }
                else {
                    return v[j.prop]
                }
            }));
        }
    },
}