<template>
  <div>
    <div class="glide details" ref="carouselImages">
      <div data-glide-el="track" class="glide__track">
        <div class="glide__slides">
          <div v-for="(item,index) in settingsImages.data" :key="`glide_${index}`">
            <div class="glide__slide">
              <img
                class="responsive border-0 border-radius img-fluid mb-3"
                alt="img"
                :src="item.image"
                onerror="this.src='/no-cover.png'"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="glide thumbs" ref="carouselThumbs" v-show="settingsThumbs.data.length > 1">
      <div data-glide-el="track" class="glide__track">
        <div class="glide__slides">
          <div v-for="(item,index) in settingsThumbs.data" :key="`thumb_${item.id}`"
               :class='index===activeIndex ? "glide__slide active" : "glide__slide"' @click="onThumbClick(index)">
            <img
              class="responsive border-0 border-radius img-fluid"
              alt="detail"
              :src="item.image"
              onerror="this.src='/no-cover.png'"
            />
          </div>
        </div>
      </div>
      <div v-if="renderArrows" class="glide__arrows" data-glide-el="controls">
        <button class="glide__arrow glide__arrow--left" data-glide-dir="<"><i class="simple-icon-arrow-left"></i>
        </button>
        <button class="glide__arrow glide__arrow--right" data-glide-dir=">"><i class="simple-icon-arrow-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex';
import Glide from '@glidejs/glide'
import "@glidejs/glide/dist/css/glide.core.min.css";

import {
  getDirectionGlideComponentThumbs
} from '../../plugins/utils/util';

export default {
  props: {
    settingsImages: Object,
    // {
    //     type: String,
    //     startAt: Number,
    //     perView: Number,
    //     focusAt: Number,
    //     gap: Number,
    //     autoplay: Boolean,
    //     hoverpause: Boolean,
    //     keyboard: Boolean,
    //     bound: Boolean,
    //     swipeThreshold: [Number, Boolean],
    //     dragThreshold: [Number, Boolean],
    //     perTouch: [Number, Boolean],
    //     touchRatio: Number,
    //     touchAngle: Number,
    //     animationDuration: Number,
    //     rewind: Boolean,
    //     rewindDuration: Number,
    //     animationTimingFunc: String,
    //     direction: String,
    //     peek: Object,
    //     breakpoints: Object,
    //     classes: Object,
    //     throttle: Number,
    //     data: Array,
    // },
    settingsThumbs: Object,
    // {
    //     type: String,
    //     startAt: Number,
    //     perView: Number,
    //     focusAt: Number,
    //     gap: Number,
    //     autoplay: Boolean,
    //     hoverpause: Boolean,
    //     keyboard: Boolean,
    //     bound: Boolean,
    //     swipeThreshold: [Number, Boolean],
    //     dragThreshold: [Number, Boolean],
    //     perTouch: [Number, Boolean],
    //     touchRatio: Number,
    //     touchAngle: Number,
    //     animationDuration: Number,
    //     rewind: Boolean,
    //     rewindDuration: Number,
    //     animationTimingFunc: String,
    //     direction: String,
    //     peek: Object,
    //     breakpoints: Object,
    //     classes: Object,
    //     throttle: Number,
    //     data: Array,
    // },
    id: String,
    className: String
  },
  data() {
    return {
      total: this.settingsImages.data.length,
      activeIndex: 0,
      thumbsPerView: Math.min(this.settingsThumbs.perView, this.settingsImages.data.length),
      renderArrows: true,
      resizeTimeOut: -1,
      mountTimeOut: -1,
    }
  },
  computed: {
    ...mapGetters({
      // menuType: 'getMenuType',
    })
  },
  watch: {
    menuType: function (val) {
      this.onResize();
    },
  },
  created() {
    let thumbBreakpoints = this.settingsThumbs.breakpoints;
    let newBreakpoints = {};
    for (var prop in thumbBreakpoints) {
      newBreakpoints[prop] = {
        "perView": Math.min(thumbBreakpoints[prop]["perView"], this.total)
      }

    }
    this.settingsThumbs.breakpoints = newBreakpoints;
  },
  mounted() {
    this.glideCarouselImages = new Glide(this.$refs.carouselImages, {
      ...this.settingsImages,
      direction: getDirectionGlideComponentThumbs().direction
    });
    this.glideCarouselImages.mount();

    this.glideCarouselThumbs = new Glide(this.$refs.carouselThumbs, {
      ...this.settingsThumbs,
      direction: getDirectionGlideComponentThumbs().direction
    });
    this.glideCarouselThumbs.mount();

    this.glideCarouselThumbs.on("resize", this.thumbsResize);
    this.glideCarouselImages.on("swipe.end", this.imagesSwipeEnd);

    this.mountTimeOut = setTimeout(() => {
      var event = document.createEvent("HTMLEvents");
      event.initEvent("resize", false, false);
      window.dispatchEvent(event);
      this.glideCarouselImages.on("resize", this.onResize);
    }, 500);
  },
  beforeDestroy() {
    clearTimeout(this.resizeTimeOut);
    clearTimeout(this.mountTimeOut);
    this.glideCarouselImages.destroy();
    this.glideCarouselThumbs.destroy();
  },
  methods: {
    onThumbClick(index) {
      this.activeIndex = index;
      this.glideCarouselImages.go("=" + index);
    },

    thumbsResize() {
      let perView = Math.min(this.settingsThumbs.perView, this.settingsImages.data.length);
      this.thumbsPerView = perView;
      if (this.total <= perView) {
        this.renderArrows = false;
      }
    },
    imagesSwipeEnd() {
      let gap = this.glideCarouselThumbs.index + this.thumbsPerView;
      this.activeIndex = this.glideCarouselImages.index;
      if (this.activeIndex >= gap) {
        this.glideCarouselThumbs.go(">");
      }
      if (this.activeIndex < this.glideCarouselThumbs.index) {
        this.glideCarouselThumbs.go("<");
      }
    },
    onResize() {
      clearTimeout(this.resizeTimeOut);
      this.resizeTimeOut = setTimeout(() => {
        this.glideCarouselImages.update();
        this.glideCarouselThumbs.update();
        this.resizeTimeOut = -1;
      }, 500);
    },
  }

}
</script>
<style>
.glide.thumbs .glide__slide {
  text-align: center;
  opacity: .4;
  -webkit-transition: opacity .2s;
  transition: opacity .2s;
}

.glide.thumbs .glide__slide.active, .glide.thumbs .glide__slide:hover {
  opacity: 1;
}

.glide.thumbs .glide__arrows {
  display: flex;
  justify-content: space-between;
  margin-top: -52px;
}

.glide.thumbs .glide__arrows .glide__arrow--left, .glide.thumbs .glide__arrows .glide__arrow--right {
  border: initial;
  background: initial;
  -webkit-box-shadow: initial;
  box-shadow: none;
  font-size: 20px;
  color: #008ecc;
}

.glide.thumbs .glide__arrows .glide__arrow--left {
  margin-left: -30px;
}

.glide.thumbs .glide__arrows .glide__arrow--right {
  margin-right: -30px;
}

.glide.thumbs .glide__slide img {
  width: 100px !important;
  height: 80px !important;
  margin-bottom: 0;
}

.glide.details .glide__slide img {
  width: 100% !important;
  height: 433px !important;
  object-fit: cover !important;
}
</style>
