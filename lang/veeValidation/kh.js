export default {
  name: 'kh',
  messages: {
    _default: (field) => `${field} ត្រូវតែទាមទារ។`,
    after: (field, [target, inclusion]) =>
      `${field} ត្រូវតែបន្ទាប់ពី ${
        inclusion ? 'ឬក៏ស្មើ ' : ''
      }${target}។`,
    alpha_dash: (field) =>
      `The ${field} field may contain alpha-numeric characters as well as dashes and underscores.`,
    alpha_num: (field) =>
      `The ${field} field may only contain alpha-numeric characters.`,
    alpha_spaces: (field) =>
      `The ${field} field may only contain alphabetic characters as well as spaces.`,
    alpha: (field) =>
      `The ${field} field may only contain alphabetic characters.`,
    before: (field, [target, inclusion]) =>
      `${field} ត្រូវតែមុន ${inclusion ? 'ឬក៏ស្មើ ' : ''}${target}។`,
    between: (field, [min, max]) =>
      `${field} ត្រូវតែរវាង ${min} និង ${max}។`,
    confirmed: (field) => `${field} មិនត្រូវគ្នា។`,
    credit_card: (field) => `${field} មិនត្រឹមត្រូវទេ។`,
    date_between: (field, [min, max]) =>
      `${field} ត្រូវតែរវាង ${min} និង ${max}។`,
    date_format: (field, [format]) => `${field} ត្រូវតែជាទម្រង់ ${format}។`,
    decimal: (field, [decimals = '*'] = []) =>
      `${field} ត្រូវតែជាលេខហើយអាចមាន ${
        !decimals || decimals === '*' ? '' : decimals
      } ចំណុចទសភាគ។`,
    digits: (field, [length]) =>
      `${field} ត្រូវតែជាលេខនិងមាន ${length} ខ្ទង់។`,
    dimensions: (field, [width, height]) =>
      `${field} ត្រូវតែ ${width} ភីកសែល x ${height} ភីកសែល។`,
    email: `សូមបញ្ចូលអ៊ីមែលឣោយត្រឹមត្រូវ។`,
    ext: (field) => `${field} ត្រូវតែជាឯកសារដែលត្រឹមត្រូវ។`,
    image: (field) => `${field} ត្រូវតែជារូបភាព។`,
    included: (field) => `${field} ត្រូវតែជាតម្លៃដែលត្រឹមត្រូវ។`,
    integer: (field) => `${field} ត្រូវតែជាចំនួនគត់។`,
    ip: (field) => `${field} ត្រូវតែជា ip ដែលត្រឹមត្រូវ។`,
    length: (field, [length, max]) => {
      if (max) {
        return `${field} ប្រវែងត្រូវតែរវាង ${length} និង ${max}.`
      }
      return `${field} ប្រវែងត្រូវតែ ${length}។`
    },
    max: (field, [length]) => `${field} មិនអាចធំជាង ${length} តួអក្សរ។`,
    max_value: (field, [max]) => `${field} ត្រូវតែ ${max} ឬក៏តិចជាងនេះ។`,
    mimes: (field) => `${field} ត្រូវតែជាប្រភេទឯកសារត្រឹមត្រូវ។`,
    min: (field, [length]) =>
      `${field} ត្រូវតែយ៉ាងហោចណាស់ ${length} តួអក្សរ។`,
    min_value: (field, [min]) => `${field} ត្រូវតែ ${min} ឬក៏ច្រើនជាងនេះ។`,
    excluded: (field) => `${field} ត្រូវតែជាតម្លៃដែលត្រឹមត្រូវ។`,
    numeric: (field) => `${field} ត្រូវតែជាលេខ។`,
    regex: (field) => `${field} ទ្រង់ទ្រាយមិនត្រឹមត្រូវ។`,
    required: (field) => `សូមបញ្ចូល ${field}។`,
    size: (field, [size]) =>
      `${field} ទំហំត្រូវតែតិចជាង ${formatFileSize(size)}។`,
    url: (field) => `${field} មិនមែនជា URL ត្រឹមត្រូវទេ។`,
    strong_password: `លេខសម្ងាត់ត្រូវតែមានយ៉ាងហោចណាស់ ៨ តួអក្សរពីអក្សរធំ, អក្សរតូចនិងលេខ។`,
    url_http_or_https: (field) =>
      `${field} មិនមែនជា URL ត្រឹមត្រូវទេ។ នៅខាងមុខត្រូវតែមាន http:// ឬ https://`,
    url_youtube: field =>
      `${field} មិនមែនជា URL ត្រឹមត្រូវទេ។ URL ត្រូវតែជា url youtube តែប៉ុណ្ណោះ។`
  },
}
