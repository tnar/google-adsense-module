import Vue from 'vue'

const AdsByGoogleComponent = {
  render (h) {
    return h(
      'ins',
      {
        'class': ['adsbygoogle'],
        style: this.adStyle,
        attrs: {
          'data-ad-client': this.adClient,
          'data-ad-slot': this.adSlot || null,
          'data-ad-format': this.adFormat,
          'data-ad-layout': this.adLayout || null,
          'data-ad-layout-key': this.adLayoutKey || null,
          'data-page-url': this.pageUrl ? this.pageUrl : null,
          'data-analytics-uacct': this.analyticsUacct ? this.analyticsUacct : null,
          'data-analytics-domain-name': this.analyticsDomainName ? this.analyticsDomainName : null,
          'data-adtest': <%= options.test ? '\'on\'' : 'null' %>
        }
      }
    )
  },
  props: {
    adClient: {
      type: String,
      default: '<%= options.id %>'
    },
    adSlot: {
      type: String
    },
    adFormat: {
      type: String,
      default: 'auto'
    },
    adLayout: {
      type: String
    },
    adLayoutKey: {
      type: String
    },
    adStyle: {
      type: Object,
      default () {
        return {
          display: 'block'
        }
      }
    },
    pageUrl: {
      type: String
    },
    analyticsUacct: {
      type: String,
      default: '<%= options.analyticsUacct %>'
    },
    analyticsDomainName: {
      type: String,
      default: '<%= options.analyticsDomainName %>'
    },
    includeQuery: {
      type: Boolean,
      default: <%= options.includeQuery %>
    }
  },
  mounted () {
    this.showAd()
  },
  methods: {
    showAd () {
      this.$nextTick(() => {
        try {
          // Once DOM did render component request a new advert
          (window.adsbygoogle = window.adsbygoogle || []).push({})
        } catch (error) {
          console.error(error)
        }
      })
    }
  }
}

// Register our ad component under the desired tag name
Vue.component('<%= options.tag %>', AdsByGoogleComponent)
