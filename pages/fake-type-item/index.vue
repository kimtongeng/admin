<template>
  
  <div>
    <div v-if="showModal">
      <Modal
         @closeModal="closeModal"
        :modal-type="modalType"
        :formData="formData"
      >

      </Modal>
    </div>
    <i-form 
    :button-add="true"
    :title="$t('type item')"
    :enable-table-action="true"
    @addClick="add"
    :table-header="header"
    :table-data="formData"
    

    :pagination="pagination"
    @paginationClick="get()"

    
    :enable-sort="true"
    :sort-by.sync="sortBy"
    :sort-type.sync="sortType"
    @sortChange="get()"

    :filter="filter"
    @searchInput="get(false)"

    :button-refresh="true"
    @refreshClick="refresh()"

    :enable-date-picker="true"
    :date-picker-props="datePickerProps"
    @datePickerSelected="datePickerSelected"

    :enable-filter="true"
    @filterClick="get()"
    @resetFilterClick="resetFilter"
    >
  
 
    <template #filter>
      <!-- business_owner_name-->
        <b-col cols="12" lg="4" xl="4">
          <b-form-group
            :label="$t('name')"
            label-for="name"
            label-class="control-label"
          >
            <b-multi-select
              v-model="filter.typeName"
              :multiple="false"
              label="name"
              track-by="name"
              :options="nameTypeItem"
              :placeholder="$t('name')"
              @reset="resetNameType"
              
            >
            </b-multi-select>
          </b-form-group>
        </b-col>

        <b-col cols="12" lg="4" xl="4">
          <b-row>
            <b-col cols="6">
              <b-form-group
                :label="$t('order_number_min')"
                label-for="order_number_min"
                label-class="control-label"
              >
                <b-form-input
                  v-model="filter.min"
                  min="0"
                  type="number"
                  :placeholder="$t('order_number_min')"
                />
              </b-form-group>
            </b-col>
            <b-col cols="6">
              <b-form-group
                :label="$t('order_number_max')"
                label-for="order_number_max"
                label-class="control-label"
              >
                <b-form-input
                  v-model="filter.max"
                  min="0"
                  type="number"
                  :placeholder="$t('order_number_max')"
                />
              </b-form-group>
            </b-col>
          </b-row>
        </b-col>

        <b-col cols="12" lg="4" xl="4">
          <b-row>
            <!-- Open Time & Close Time -->
        <b-col cols="12" lg="6" xl="6">
          <b-form-group
            :label="$t('after_time')"
            label-for="after_time"
            label-class="control-label"
          >
            <b-form-timepicker
              v-model="filter.afterTime"
              :hour12="false"
              show-seconds
              :placeholder="$t('after_time')"
              close-button-variant="outline-danger"
              :label-close-button="$t('close')"
            ></b-form-timepicker>
          </b-form-group>
        </b-col>
        <b-col cols="12" lg="6" xl="6">
          <b-form-group
            :label="$t('before_time')"
            label-for="before_time"
            label-class="control-label"
          >
            <b-form-timepicker
              v-model="filter.beforeTime"
              :hour12="false"
              show-seconds
              :placeholder="$t('before_time')"
              close-button-variant="outline-danger"
              :label-close-button="$t('close')"
            ></b-form-timepicker>
          </b-form-group>
        </b-col>
          </b-row>
        </b-col>

    </template>


    <template #cell(action)="row">
      <i-table-action-dropdown
        module-key="default_form"
        :enable-edit-action="true"
        @editClick="editItem(row.item)"
        :enable-delete-action="true"
        @deleteClick="deleteItem(row.item)"
      >
        
      </i-table-action-dropdown>
    </template>

    <template #cell(image)="row">
      <i-table-image-viewer
        :image="row.item.image"
        :popover-image-height="200"
        :popover-image-width="500"
        path="delivery\item_type\"
      ></i-table-image-viewer>
    </template>

    <template #cell(created_at)="row">
      {{ row.item.created_at | dateTimeFormat }}
    </template>

    </i-form>
  </div>
</template>

<script>
import iForm from '../../components/IDGForm/iForm.vue'
import Modal from './components/Modal.vue';
import swal from 'sweetalert2'

  export default {
  components: { iForm,Modal },
    layout:"app",
    data(){
      return{
        nameTypeItem:[],
        datePickerProps: {
          editable: false,
          type: 'datetime',
          range: true,
          date_time_value: [],
          // single_date_time: '',
          show_select_time_btn: true,
          show_confirm_btn: true,
          format: 'DD/MM/YYYY HH:mm:ss',
          value_type: 'YYYY-MM-DD HH:mm:ss',
        },
        header:[
          {
            key:"id",
            label:this.$t("id"),
            sortable:true
          },
          {
            key:"name",
            label:this.$t("name"),
            sortable:true

          },
          {
          key: 'image',
          label: this.$t('image'),
        
          thClass: 'imageThWidth',
        },
        {
          key:"numberOrder",
          label:this.$t("order_number"),
          sortable:true

        },
        {
          key:"created_at",
          label:this.$t("created_at"),
          sortable:true
        }
        ],
        filter:{
          search:null,
          datePicker:null,
          typeName:null,
          min:null,
          max:null,
          afterTime:null,
          beforeTime: null,
        },

        sortBy:"created_at",
        sortType:"asc",
        apiUrl: process.env.API_URL,
        showModal:false,
        modalType:0,

        formData:{},

        pagination: {
        current_page: 2,
        per_page: 10,
        total: 0,
        to: 0,
        from: 0,
        last_page: 0,
      },

      }
    },
    created(){

      this.get();
      this.getFilterData();
    },
    methods:{
      resetFilter(){
        this.filter.search = null;
        this.filter.typeName = null;
        this.filter.min = null;
        this.filter.max = null;
        this.filter.datePicker = null;
        this.filter.afterTime = null;
        this.filter.beforeTime = null;
      },
      getFilterData(){
        this.$axios.$post("typeItemFake/get",{loading:false}).then(({data})=>{
          this.nameTypeItem = data.map((item,index)=>({id:index,name:item.name})); 
          
        })
      },
      resetNameType(){
        this.filter.typeName = null;
      },
      add(){
        this.showModal=true
        this.modalType=1;
      },
      editItem(item){
        this.formData=item;
        this.showModal=true;
        this.modalType=2;
      },
      closeModal(data){
        this.showModal=false;
        this.get()
        this.modalType=0;
      },
      get(loading = true){

        const input = {
          page: this.pagination.current_page,
          table_size: this.pagination.per_page,
          sort_by:this.sortBy,
          sort_type:this.sortType,
          filter : this.filter
        }
        input.loading = loading;
          this.$axios.$post("typeItemFake/get",input).then(({data,pagination})=>{
          this.formData = data;
          this.pagination = pagination;  
        })
      },
     
      deleteItem(item) {
      let vm = this
      swal.fire({
        title: vm.$t('are_you_sure'),
        text: vm.$t('cannot_revert_this'),
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: vm.$t('ok'),
        cancelButtonText: vm.$t('cancel'),
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return new Promise((resolve) => {
            const data={
              id:item.id
            };
            vm.$axios
              .$post('typeItemFake/delete', data)
              .then(({data}) => {
                swal.close()
                vm.$notify(
                  'success',
                  vm.$t('support_management'),
                  vm.$t('done')
                )
                vm.get()
              })
          })
        },
        allowOutsideClick: () => !swal.isLoading(),
      })
      },
      refresh(){
      this.get();
      },
      datePickerSelected(date){
      this.filter.datePicker = date;
      this.get();
      }
    }

  }
</script>

<style lang="scss" scoped>

</style>