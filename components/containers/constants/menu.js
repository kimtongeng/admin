
const data = [
    {
        icon: 'exclude',
        label: 'dashboard',
        key: 'dashboard',
        to: `/dashboard`,
    },
    {
        icon: 'people',
        label: 'user_management',
        to: `/user`,
        subs: [
            {
                icon: 'caret-right',
                label: 'role',
                to: `/user/role`,
                key: 'user_role',
            },
            {
                icon: 'caret-right',
                label: 'list',
                to: `/user/list`,
                key: 'user_list',
            },
            {
                icon: 'caret-right',
                label: 'log',
                to: `/user/log`,
                key: 'user_log',
            },
        ],
    },
    {
        icon: 'truck',
        label: 'supplier',
        to: '/supplier',
        key: 'supplier',
    },
    {
        icon: 'trophy',
        label: 'sale_agent',
        to: '/sale_agent',
        key: 'sale_agent',
    },
    {
        icon: 'person-fill',
        label: 'customer',
        to: '/customer',
        key: 'customer',
    },
    {
        label: 'stock_and_warehouse',
        to: '/stock',
        icon: 'box-seam',
        key: 'stock_and_warehouse',
        subs: [
            {
                label: 'warehouse',
                to: '/stock/warehouse',
                icon: 'caret-right',
                key: 'warehouse',
            },
            {
                label: 'stock_adjustment',
                to: '/stock/stock_adjustment',
                icon: 'caret-right',
                key: 'stock_adjustment',
            },
            {
                label: 'stock_transfer',
                to: '/stock/stock_transfer',
                icon: 'caret-right',
                key: 'stock_transfer',
            },
        ],
    },
    {
        label: 'product_management',
        to: '/product',
        icon: 'music-player',
        key: 'product_management',
        subs: [
            {
                label: 'product',
                to: '/product_management/product',
                icon: 'basket2',
                key: 'product',
            },
            {
                label: 'category',
                to: '/product_management/category',
                icon: 'columns-gap',
                key: 'category',
            },
            {
                label: 'variation',
                to: '/product_management/variation',
                icon: 'bezier',
                key: 'variation',
            },
            {
                label: 'brand',
                to: '/product_management/brand',
                icon: 'award',
                key: 'brand',
            },
            {
                label: 'unit_type',
                to: '/product_management/unit_type',
                icon: 'bounding-box',
                key: 'unit_type',
            },
            {
                label: 'tag',
                to: '/product_management/tag',
                icon: 'tag',
                key: 'tag',
            },
            {
                label: 'modifier',
                to: '/product_management/modifier',
                icon: 'brush',
                key: 'modifier',
            },
        ],
    },
    {
        label: 'setting',
        to: '/setting',
        icon: 'gear',
        key: 'setting',
        subs: [
            {
                label: 'prefix_code',
                to: '/setting/prefix_code',
                icon: 'caret-right',
                key: 'prefix_code',
            },
            {
                icon: 'award',
                label: 'currency',
                to: '/currency',
                key: 'currency',
            },
            {
                icon: 'building',
                label: 'company',
                to: '/company',
                key: 'company',
            },
            {
                icon: 'shop',
                label: 'branch',
                to: '/branch',
                key: 'branch',
            },
        ],
    },
    {
        label: 'developer',
        to: '/developer',
        icon: 'code',
        key: 'developer',
        subs: [
            {
                label: 'module',
                to: '/developer/module',
                icon: 'caret-right',
                key: 'module',
            },
        ],
    },
]
export default data
