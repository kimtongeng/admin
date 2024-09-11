<template>
<div>
  <b-row>
    <b-col cols="12">
        <b-card class="mb-4" :title="$t('icons.simplelineicons') +' ('+simplelineicons.length+ ' icons)'">
            <div class="simple-line-icons">
                <div class="glyph" v-for="(icon, index) in simplelineicons" :key="index">
                <div :class="'glyph-icon ' + icon"/>
                <div class="class-name">{{icon}}</div>
                </div>
            </div>
        </b-card>
    </b-col>

    <b-col cols="12">
        <b-card class="mb-4" :title="$t('icons.iconsmind')">
            <div class="mind-icons">
              <div class="mb-5" v-for="(group, parentIndex) in iconsmind" :key="parentIndex">
                <h6 class="mb-4">{{group.title}}</h6>
                
                <div class="glyph" v-for="(icon, iconIndex) in group.icons" :key="`${parentIndex}_${iconIndex}`">
                  <div :class="'glyph-icon ' + icon"/>
                  <div class="class-name">{{icon}}</div>
                </div>
                <div class="clearfix"></div>
              </div>
            </div>
        </b-card>
    </b-col>

  </b-row>
  </div>
</template>
<script>
import { iconsmind, simplelineicons } from '~/data/icons'
export default {
  layout: 'app',
  data () {
    return {
      simplelineicons,
      iconsmind
    }
  }
}
</script>
