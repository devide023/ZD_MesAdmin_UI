<template>
  <div>
    <el-table
      :data="datalist"
      border
      ref="maintable"
      :height="tableheight"
      @selection-change="handleSelectionChange"
      :row-class-name="tableRowClassName"
      :row-key="RowKey"
      header-cell-class-name="tb_header_bg"
      :tree-props="this.treeprops"
    >
      <el-table-column v-if="isselect" type="selection"></el-table-column>
      <el-table-column
        v-for="(col, idx) in collist"
        :key="idx"
        :prop="col.prop"
        :label="col.label"
        :width="col.width"
        :min-width="col.minWidth"
        :type="col.type"
        :header-align="col.headeralign"
        :align="col.align"
        :column-key="idx.toString()"
        :fixed="col.fixed"
        :sortable="col.sortable"
        :show-overflow-tooltip="col.overflowtooltip"
      >
        <template slot-scope="scope">
          <template v-if="scope.row.isedit">
            <template v-if="col.coltype === 'string' && iscoledit(col.prop)">
              <template v-if="col.suggest">
                <el-autocomplete
                  popper-class="my-autocomplete"
                  v-model="scope.row[col.prop]"
                  :trigger-on-focus="false"
                  :fetch-suggestions="
                    (key, cb) => fetchSuggestions(key, cb, scope.row, col)
                  "
                  @select="(item) => ddl_handleSelect(item, scope.row, col)"
                  placeholder="关键字过滤"
                  style="width: 100%"
                >
                  <i class="el-icon-search el-input__icon" slot="suffix"> </i>
                  <template slot-scope="{ item }">
                    <div class="name">{{ item.value }}</div>
                    <span class="addr">{{ item.label }}</span>
                  </template>
                </el-autocomplete>
              </template>
              <template v-else>
                <el-input
                  v-model.trim="scope.row[col.prop]"
                  clearable
                ></el-input>
              </template>
            </template>
            <template v-else-if="col.coltype === 'list' && iscoledit(col.prop)">
              <template v-if="col.remote">
                <!-- 多选情况 -->
                <template v-if="col.multiple && col.selectedvals && !scope.row.isdb">
                  <el-select
                    v-model.trim="scope.row[col.selectedvals]"
                    filterable
                    remote
                    :multiple="col.multiple"
                    collapse-tags
                    :remote-method="(q) => remote_method(q, col, scope.row)"
                    placeholder="关键字过滤"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="(item, i) in scope.row.remotelist"
                      :key="i"
                      :label="item.label"
                      :value="item.value"
                    >
                      <template v-if="!col.hideoptionval">
                        <span style="float: left">{{ item.label }}</span>
                        <span
                          style="float: right; color: #8492a6; font-size: 13px"
                          >{{ item.value }}</span
                        >
                      </template>
                    </el-option>
                  </el-select>
                </template>
                <template v-else>
                  <el-select
                    v-model.trim="scope.row[col.prop]"
                    filterable
                    remote
                    :remote-method="(q) => remote_method(q, col, scope.row)"
                    placeholder="关键字过滤"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="(item, i) in scope.row.remotelist"
                      :key="i"
                      :label="item.label"
                      :value="item.value"
                    >
                      <template v-if="!col.hideoptionval">
                        <span style="float: left">{{ item.label }}</span>
                        <span
                          style="float: right; color: #8492a6; font-size: 13px"
                          >{{ item.value }}</span
                        >
                      </template>
                    </el-option>
                  </el-select>
                </template>
              </template>
              <template v-else>
                <!-- 多选情况 -->
                <template v-if="col.multiple && col.selectedvals && !scope.row.isdb">
                  <el-select
                    v-model="scope.row[col.selectedvals]"
                    clearable
                    filterable
                    :allow-create="col.allowcreate"
                    :multiple="col.multiple"
                    collapse-tags
                    placeholder="请选择"
                    style="width: 100%"
                    @change="
                      (val) => col_ddl_change_handle(val, scope.row, col)
                    "
                    @clear="() => col_ddl_clear_handle(scope.row, col)"
                  >
                    <el-option
                      v-for="(item, i) in col.relation
                        ? scope.row[col.relation]
                        : col.options"
                      :key="i"
                      :label="item.label"
                      :value="item.value"
                      :disabled="item.disabled"
                    >
                      <template v-if="!col.hideoptionval">
                        <span style="float: left">{{ item.label }}</span>
                        <span
                          style="float: right; color: #8492a6; font-size: 13px"
                          >{{ item.value }}</span
                        >
                      </template>
                    </el-option>
                  </el-select>
                </template>
                <template v-else>
                  <el-select
                    v-model="scope.row[col.prop]"
                    clearable
                    filterable
                    :allow-create="col.allowcreate"
                    placeholder="请选择"
                    style="width: 100%"
                    @change="
                      (val) => col_ddl_change_handle(val, scope.row, col)
                    "
                    @clear="() => col_ddl_clear_handle(scope.row, col)"
                  >
                    <el-option
                      v-for="(item, i) in col.relation
                        ? scope.row[col.relation]
                        : col.options"
                      :key="i"
                      :label="item.label"
                      :value="item.value"
                      :disabled="item.disabled"
                    >
                      <template v-if="!col.hideoptionval">
                        <span style="float: left">{{ item.label }}</span>
                        <span
                          style="float: right; color: #8492a6; font-size: 13px"
                          >{{ item.value }}</span
                        >
                      </template>
                    </el-option>
                  </el-select>
                </template>
              </template>
            </template>
            <template v-else-if="col.coltype === 'bool' && iscoledit(col.prop)">
              <el-switch
                v-model="scope.row[col.prop]"
                :active-value="col.activevalue"
                :inactive-value="col.inactivevalue"
              >
              </el-switch>
            </template>
            <template v-else-if="col.coltype === 'int' && iscoledit(col.prop)">
              <el-input-number
                v-model.number="scope.row[col.prop]"
                :step="1"
                style="width: 90px"
              ></el-input-number>
            </template>
            <template v-else-if="col.coltype === 'date' && iscoledit(col.prop)">
              <el-date-picker
                v-model="scope.row[col.prop]"
                type="date"
                value-format="yyyy-MM-dd"
                style="width: 130px"
              />
            </template>
            <template
              v-else-if="col.coltype === 'datetime' && iscoledit(col.prop)"
            >
              <el-date-picker
                v-model="scope.row[col.prop]"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 120px"
              />
            </template>
            <template v-else-if="col.coltype === 'rate' && iscoledit(col.prop)">
              <el-rate v-model.number="scope.row[col.prop]"></el-rate>
            </template>
            <template
              v-else-if="col.coltype === 'image' && iscoledit(col.prop)"
            >
              <el-upload
                class="avatar-uploader"
                auto-upload
                :headers="headers"
                :action="col.action"
                :show-file-list="false"
                :multiple="false"
                :accept="col.accept || ''"
                :on-success="col.upload_success"
                :before-upload="col.before_upload"
                :data="{ rowkey: scope.row.rowkey }"
              >
                <div slot="default">
                  <img
                    v-if="
                      col.subprop
                        ? scope.row[col.prop][col.subprop]
                        : scope.row[col.prop]
                    "
                    :src="
                      rooturl +
                      '/upload/image/' +
                      (col.subprop
                        ? scope.row[col.prop][col.subprop]
                        : scope.row[col.prop])
                    "
                    class="avatar"
                  />
                  <i v-else class="el-icon-plus avatar-uploader-icon" />
                </div>
                <div slot="file" slot-scope="{ file }">
                  <img
                    class="el-upload-list__item-thumbnail"
                    :src="file.url"
                    alt=""
                  />
                  <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-preview">
                      <i class="el-icon-zoom-in"></i>
                    </span>
                  </span>
                </div>
              </el-upload>
            </template>
            <template v-else>
              {{ scope.row[col.prop] }}
            </template>
          </template>
          <template v-else>
            <template v-if="col.coltype === 'datetime'">
              {{
                col.subprop
                  ? scope.row[col.prop][col.subprop]
                  : scope.row[col.prop] | parseTime("{y}-{m}-{d} {h}:{i}:{s}")
              }}
            </template>
            <template v-else-if="col.coltype === 'date'">
              {{
                col.subprop
                  ? scope.row[col.prop][col.subprop]
                  : scope.row[col.prop] | parseTime("{y}-{m}-{d}")
              }}
            </template>
            <template v-else-if="col.coltype === 'image'">
              <el-image
                v-if="
                  col.subprop
                    ? scope.row[col.prop][col.subprop]
                    : scope.row[col.prop]
                "
                :src="
                  rooturl +
                  '/upload/image/' +
                  (col.subprop
                    ? scope.row[col.prop][col.subprop]
                    : scope.row[col.prop])
                "
                :preview-src-list="
                  col.subprop
                    ? scope.row[col.prop][col.subprop]
                    : scope.row[col.prop] | showpreviewlist
                "
                class="avatar"
              >
              </el-image>
            </template>
            <template v-else-if="col.coltype === 'progress'">
              <el-progress
                :percentage="
                  (col.subprop
                    ? scope.row[col.prop][col.subprop]
                    : scope.row[col.prop]) > 100
                    ? 100
                    : col.subprop
                    ? scope.row[col.prop][col.subprop]
                    : scope.row[col.prop]
                "
                text-inside
                :stroke-width="15"
              ></el-progress>
            </template>
            <template v-else-if="col.coltype === 'rate'">
              <el-rate v-model="scope.row[col.prop]" disabled></el-rate>
            </template>
            <template v-else-if="col.options && col.istag">
              <el-tag
                :type="
                  col.subprop
                    ? scope.row[col.prop][col.subprop]
                    : scope.row[col.prop] | showname(col.tagtypes)
                "
                >{{
                  col.subprop
                    ? scope.row[col.prop][col.subprop]
                    : scope.row[col.prop] | showname(col.options)
                }}</el-tag
              >
            </template>
            <template v-else-if="col.options">
              {{
                col.subprop
                  ? scope.row[col.prop][col.subprop]
                  : scope.row[col.prop] | showname(col.options)
              }}
            </template>
            <template v-else-if="col.isicon">
              <template
                v-if="
                  (col.subprop
                    ? scope.row[col.prop][col.subprop]
                    : scope.row[col.prop] || ''
                  ).indexOf('el-icon') !== -1
                "
              >
                <i
                  :class="
                    col.subprop
                      ? scope.row[col.prop][col.subprop]
                      : scope.row[col.prop]
                  "
                ></i>
              </template>
              <template v-else>
                <svg-icon
                  :icon-class="
                    col.subprop
                      ? scope.row[col.prop][col.subprop]
                      : scope.row[col.prop] || ''
                  "
              /></template>
            </template>
            <template v-else>
              {{
                col.subprop
                  ? scope.row[col.prop][col.subprop]
                  : scope.row[col.prop]
              }}
            </template>
          </template>
        </template>
      </el-table-column>
      <el-table-column
        v-if="isoperate"
        header-align="center"
        align="center"
        width="50"
        label="操作"
        fixed="right"
      >
        <template v-slot="scope">
          <slot name="operate" :row="scope.row"></slot>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :total="resultcount"
      :current-page="pageindex"
      :page-size="pagesize"
      :page-sizes="[20, 50, 100, 200]"
      layout="total, sizes, prev, pager, next"
      background
      style="text-align: right"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import { newGuid } from "@/utils/index";
export default {
  data() {
    return {
      tableheight: 800,
      rooturl: window.winconfig.production.VUE_APP_ROOT,
      fullpath: "",
      cur_page_permis: [],
      preview_list: [],
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    };
  },
  props: {
    datalist: {
      type: Array,
      default: function () {
        return [];
      },
    },
    collist: {
      type: Array,
      default: function () {
        return [];
      },
    },
    multipleSelection: {
      type: Array,
      default: function () {
        return [];
      },
    },
    isselect: {
      type: Boolean,
      default: true,
    },
    isoperate: {
      type: Boolean,
      default: true,
    },
    treeprops: {
      type: Object,
    },
    tbheight: {
      type: Number,
    }, //行背景信息
    trbginfo: {
      type: Array,
      default: function () {
        return [
          {
            colname: "",
            logiclist: [],
          },
        ];
      },
    },
    pageindex: {
      type: Number,
      default: 1,
    },
    pagesize: {
      type: Number,
      default: 20,
    },
    pageindexHandle: {
      type: Function,
    },
    pagesizeHandle: {
      type: Function,
    },
    resultcount: {
      type: Number,
      default: 0,
    },
  },
  filters: {
    showname: function (value, options) {
      try {
        if (options) {
          if (typeof value === "object") {
            let find = options.filter((i) => value.some((j) => j === i.value));
            if (find.length > 0) {
              return find.map((i) => i.label).join(",");
            } else {
              return value;
            }
          } else {
            let fitem = options.filter((i) => i.value === value);
            if (fitem.length > 0) {
              return fitem.map((i) => i.label).join(",");
            } else {
              return value;
            }
          }
        }
      } catch (error) {
        return value;
      }
    },
    showpreviewlist: function (val) {
      let ls = [];
      ls.push(window._this.rooturl + "/upload/image/" + val);
      return ls;
    },
  },
  computed: {},
  activated() {
    this.$refs.maintable.doLayout();
  },
  mounted() {
    window._this = this;
    this.fullpath = this.$router.currentRoute.fullPath;
    this.cur_page_permis = this.$store.getters.pagepermis;
    this.$nextTick(function () {
      this.sizechangeHandle();
    });
  },
  beforeMount() {
    window.addEventListener("resize", this.sizechangeHandle);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.sizechangeHandle);
  },
  methods: {
    handleSelectionChange(val) {
      this.$emit("update:multipleSelection", val);
    },
    handleCurrentChange(index) {
      if (typeof this.pageindexHandle === "function") {
        this.pageindexHandle(index);
      } else {
        this.$message.error("pageindexHandle不是函数");
      }
    },
    handleSizeChange(value) {
      if (typeof this.pagesizeHandle === "function") {
        this.pagesizeHandle(value);
      } else {
        this.$message.error("pagesizeHandle不是函数");
      }
    },
    sizechangeHandle() {
      if (this.tbheight) {
        this.tableheight = this.tbheight;
      } else {
        let bodyheight = document.body.offsetHeight;
        this.tableheight = bodyheight - 155;
      }
    },
    tableRowClassName({ row, idx }) {
      let rowclassname = "";
      this.trbginfo.forEach((bginfoitem) => {
        let cellvalue = row[bginfoitem.colname];
        let logiclist = bginfoitem.logiclist;
        if (logiclist instanceof Array) {
          for (let index = 0; index < logiclist.length; index++) {
            const i = logiclist[index];
            if (i.logic === "=") {
              if (i.val0 === cellvalue) {
                rowclassname = i.classname;
                break;
              }
            } else if (i.logic === "in") {
              if (i.val0 instanceof Array) {
                let _pos = i.val0.findIndex((i) => i === cellvalue);
                if (_pos !== -1) {
                  rowclassname = i.classname;
                  break;
                }
              }
            } else if (i.logic === "between") {
              if (i.val0 <= cellvalue && cellvalue < i.val1) {
                rowclassname = i.classname;
                break;
              }
            } else if (i.logic === ">") {
              if (cellvalue > i.val0) {
                rowclassname = i.classname;
                break;
              }
            } else if (i.logic === ">=") {
              if (cellvalue >= i.val0) {
                rowclassname = i.classname;
                break;
              }
            } else if (i.logic === "<") {
              if (cellvalue < i.val0) {
                rowclassname = i.classname;
                break;
              }
            } else if (i.logic === "<=") {
              if (cellvalue <= i.val0) {
                rowclassname = i.classname;
                break;
              }
            } else if (i.logic === "<>") {
              if (cellvalue !== i.val0) {
                rowclassname = i.classname;
                break;
              }
            }
          }
        }
      });
      return rowclassname;
    },
    iscoledit(colname) {
      let path = this.fullpath;
      var finditem = this.cur_page_permis.filter((t) => t.path === path);
      let efields = [];
      if (finditem.length > 0) {
        efields = finditem[0].permis.editfields;
      }
      let pos = efields.findIndex((i) => {
        return i === colname;
      });
      return pos !== -1;
    },
    clearSelection() {
      this.$refs.maintable.clearSelection();
    },
    RowKey(row) {
      if (!row.rowkey) {
        row.rowkey = newGuid();
      }
      if (this.treeprops) {
        if (Object.keys(this.treeprops).length > 0) {
          return row.id;
        } else {
          return row.rowkey;
        }
      } else {
        return row.rowkey;
      }
    },
    selectHandle(fnname) {
      try {
        this.$basepage[fnname]();
      } catch (error) {
        this.$message.error(error);
      }
    },
    doLayout() {
      this.$refs.maintable.doLayout();
    },
    col_ddl_change_handle(val, row, col) {
      if (col.change_fn_name) {
        if (typeof col.change_fn_name === "function") {
          col.change_fn_name(this, this.collist, val, row);
        } else {
          this.$basepage[col.change_fn_name](this.collist, val, row);
        }
      }
    },
    col_ddl_clear_handle(row, col) {
      if (col.clear_fn_name) {
        if (typeof col.clear_fn_name === "function") {
          col.clear_fn_name(this, row, col);
        } else {
          this.$basepage[col.clear_fn_name](row, col);
        }
      }
    },
    remote_method(q, col, row) {
      if (col.remote) {
        if (typeof col.remote === "function") {
          col.remote(q, this, row);
        }
      } else {
        this.$message.error("远程查询不是一个函数");
      }
    },
    fetchSuggestions(key, cb, row, col) {
      if (typeof col.suggest_fn_name === "function") {
        col.suggest_fn_name(this, key, cb, row, col);
      } else {
        this.$basepage[col.suggest_fn_name](this, key, cb, row, col);
      }
    },
    ddl_handleSelect(item, row, col) {
      if (typeof col.select_fn_name === "function") {
        col.select_fn_name(this, item, row, col);
      } else {
        this.$basepage[col.select_fn_name](this, item, row, col);
      }
    },
  },
  watch: {
    datalist(val) {
      this.doLayout();
    },
  },
};
</script>

<style lang="scss">
.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .addr {
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
}
</style>