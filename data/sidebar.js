export const sidebar = [
 
  {
    label: 'dashboard',
    icon: 'simple-icon-layers',
    key: 'dashboard',
    to: `/dashboard`,
  },
  {
    label: 'contact',
    icon: 'iconsminds-profile',
    key: 'contact',
    to: `/contact`,
  },
  {
    label: 'notification',
    icon: 'simple-icon-bell',
    to: 'notifications/',
    key: 'notifications',
    subs: [
      {
        icon: 'simple-icon-envelope-letter',
        label: 'broadcast',
        to: '/notifications/broadcast',
        key: 'broadcast',
      },
      {
        icon: 'simple-icon-layers',
        label: 'admin_notification_list',
        to: '/notifications/list',
        key: 'admin_notification_list',
      },
    ],
  },
  {
    label: 'banner_management',
    icon: 'simple-icon-grid',
    to: 'banner_management/',
    key: 'banner_management',
    subs: [
      {
        icon: 'simple-icon-screen-desktop',
        label: 'banner',
        to: '/banner_management/banner',
        key: 'banner',
      },
      {
        icon: 'simple-icon-docs',
        label: 'position_banner',
        to: '/banner_management/position',
        key: 'position',
      },
    ],
  },
  {
    label: 'video_management',
    icon: 'simple-icon-social-youtube',
    to: 'video_management/',
    key: 'video_management',
    subs: [
      {
        icon: 'iconsminds-film',
        label: 'video',
        to: '/video_management/video',
        key: 'video',
      },
      {
        icon: 'iconsminds-video',
        label: 'position_video',
        to: '/video_management/position',
        key: 'position',
      },
    ],
  },
  {
    label: 'business',
    to: '/business',
    icon: 'iconsminds-financial',
    key: 'business',
    subs: [
      {
        icon: 'iconsminds-hotel',
        label: 'business_type',
        to: '/business/business_type',
        key: 'business_type',
      },
      {
        icon: 'iconsminds-hotel',
        label: 'property',
        to: '/business/property',
        key: 'property',
      },
      {
        icon: 'iconsminds-location-2',
        label: 'attraction',
        to: '/business/attraction',
        key: 'attraction',
      },
      {
        label: 'shop',
        subs: [
          {
            icon: 'iconsminds-shop-3',
            label: 'shop_list',
            to: '/business/shop/shop_list',
            key: 'shop_list',
          },
          {
            icon: 'iconsminds-shop-2',
            label: 'shop_category',
            to: '/business/shop/shop_category',
            key: 'shop_category',
          },
        ],
      },
      {
        label: 'charity_donor',
        subs: [
          {
            icon: 'iconsminds-male-female',
            label: 'charity_list',
            to: '/business/charity/charity_list',
            key: 'charity_list',
          },
          {
            icon: 'iconsminds-male-female',
            label: 'charity_category',
            to: '/business/charity/charity_category',
            key: 'charity_category',
          },
        ],
      },
      {
        label: 'accommodation',
        subs: [
          {
            icon: 'iconsminds-hotel',
            label: 'accommodation_list',
            to: '/business/accommodation/accommodation_list',
            key: 'accommodation_list',
          },
          {
            icon: 'iconsminds-check',
            label: 'attribute',
            to: '/business/accommodation/attribute',
            key: 'attribute',
          },
          {
            icon: 'iconsminds-hotel',
            label: 'accommodation_category',
            to: '/business/accommodation/accommodation_category',
            key: 'accommodation_category',
          },
        ],
      },
      {
        label: 'massage_place',
        subs: [
          {
            icon: 'iconsminds-male-female',
            label: 'massage_list',
            to: '/business/massage/massage_list',
            key: 'massage_list',
          },
          {
            icon: 'simple-icon-user-female',
            label: 'massage_therapist_list',
            to: '/business/massage/massage_therapist_list',
            key: 'massage_therapist_list',
          },
        ],
      },
      {
        label: 'society_security',
        subs: [
          {
            icon: 'iconsminds-calendar-4',
            label: 'event_type',
            to: '/business/society_security/event_type',
            key: 'event_type',
          },
          {
            icon: 'iconsminds-conference',
            label: 'position_group',
            to: '/business/society_security/position_group',
            key: 'position_group',
          },
          {
            icon: 'simple-icon-key',
            label: 'security_code',
            to: '/business/society_security/security_code',
            key: 'security_code',
          },
          {
            icon: 'iconsminds-male-female',
            label: 'recipient',
            to: '/business/society_security/news_recipient',
            key: 'news_recipient',
          },
        ],
      },
      {
        label: 'ktv_place',
        subs: [
          {
            icon: 'iconsminds-male-female',
            label: 'ktv_list',
            to: '/business/ktv/ktv_list',
            key: 'ktv_list',
          },
        ],
      },
      {
        label: 'delivery',
        subs: [
          {
            icon: 'iconsminds-scooter',
            label: 'vehicle_type',
            to: '/business/delivery/vehicle_type',
            key: 'vehicle_type',
          },
          {
            icon: 'simple-icon-docs',
            label: 'item_type',
            to: '/business/delivery/item_type',
            key: 'item_type',
          },
        ],
      },
    ],
  },
  {
    label: 'setting',
    to: '/setting',
    icon: 'simple-icon-settings',
    key: 'setting',
    subs: [
      {
        icon: 'simple-icon-support',
        label: 'general_setting',
        to: '/setting/general_setting',
        key: 'general_setting',
      },
      {
        icon: 'iconsminds-monitor---phone',
        label: 'app_country',
        to: '/setting/app_country',
        key: 'app_country',
      },
      {
        icon: 'iconsminds-download',
        label: 'api_version',
        to: '/setting/api_version',
        key: 'api_version',
      },
      {
        icon: 'simple-icon-wallet',
        label: 'bank_account',
        to: '/setting/bank_account',
        key: 'bank_account',
      },
      {
        icon: 'simple-icon-call-out',
        label: 'support',
        to: '/setting/support',
        key: 'support',
      },
      {
        icon: 'iconsminds-security-settings',
        label: 'privacy_policy',
        to: '/setting/privacy_policy',
        key: 'privacy_policy',
      },
      {
        label: 'user',
        subs: [
          {
            icon: 'simple-icon-key',
            label: 'user_role',
            to: '/setting/user/role',
            key: 'user_role',
          },
          {
            icon: 'simple-icon-user',
            label: 'user_list',
            to: '/setting/user/list',
            key: 'user_list',
          },
          {
            icon: 'simple-icon-notebook',
            label: 'user_log',
            to: '/setting/user/log',
            key: 'user_log',
          },
        ],
      },
    ],
  },
  {
    label: 'developer',
    to: '/developer',
    icon: 'iconsminds-coding',
    key: 'developer',
    subs: [
      {
        label: 'icon',
        to: '/developer/icon',
        icon: 'iconsminds-friendster',
        key: 'icon',
      },
      {
        label: 'default_form',
        to: '/developer/default_form',
        icon: 'iconsminds-mail-3',
        key: 'default_form',
      },
      {
        label: 'support_management',
        to: '/developer/support_management',
        icon: 'iconsminds-old-telephone',
        key: 'support_management',
      },
      {
        label: 'prefix_code',
        to: '/developer/prefix_code',
        icon: 'iconsminds-last-fm',
        key: 'prefix_code',
      },
      {
        label: 'module',
        to: '/developer/module',
        icon: 'iconsminds-venn-diagram',
        key: 'module',
      },
    ],
  },
  {
    label: 'fake-dashboard',
    icon: 'simple-icon-layers',
    key: 'fake-dashboard',
    to: `/fake-dashboard`,
  },
  {
    label: 'fake-type-item',
    icon: 'iconsminds-shopping-basket',
    key: 'fake-type-item',
    to: `/fake-type-item`,
  },
]
