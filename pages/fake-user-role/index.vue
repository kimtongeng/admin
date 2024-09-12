<template>
  <div>
   <i-form
   :title="$t(titleForm)"
   :table-header="tableHeader"
   :enable-table-action="true"
   :button-add="true"
   @addClick="add()"
   >

   </i-form>
  </div>
</template>

<script>
import { BIconTelephoneMinusFill } from 'bootstrap-vue';
import iForm from '~/components/IDGForm/iForm.vue';

  export default {
    layout:"app",
    components:{
      iForm
    },
    data(){
      return{
        titleForm:"user_role",

        tableHeader:[
          {
            key:"role",
            label:this.$t("role")
          },
          {
            key:"user_type",
            label:this.$t("user_type")
          },
          {
            key:"description",
            label:this.$t("description")
          },
          {
            key:"created_at",
            label:this.$t("created_at")
          }
        ]

      }
    },

    methods:{
      add(){
       this.$router.push("/fake-user-role/action?type=add");
      }
    }

  }
</script>

<style lang="scss" scoped>

</style>