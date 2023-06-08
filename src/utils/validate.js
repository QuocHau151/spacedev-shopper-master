
// rules = {
//     name: [
//         { required: true }
//     ],
//     email: [
//         { required: true },
//         { regex: 'email' }
//     ],
//     phone: [
//         { required: true },
//         { regex: 'phone' }
//     ]
// }


// forms = {
//     name: 'Dang Thuyen Vuong',
//     email: 'dangthuyenvuong@gmail.com',
//     phone: '0949816596'
// }

// errorObj = {
//     name: 'Please fill in this field'
// }


const REGEXP = {
    email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    phone: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
    url: /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
}

const ERROR_MESSAGE = {
    required: 'Please fill in this field',
    regexp: 'Field not like format',
    minMax: (min, max) => `Xin vui lòng nhập từ ${min}-${max} ký tự`,
    confirm: (field) => `Xin vui lòng điến giống ${field}`
}




/**
 * 
 * @param {*} rules
 * @param {*} form 
 * @returns plan error object
 */
export const validate = (rules, forms) => {
    const errorObject = {}
    for (let name in rules) {
        for (let rule of rules[name]) {
            if(typeof rule === 'function') {
                let error = rule(forms[name], forms) 
                if(error) {
                    errorObject[name] = error
                    break;
                }
            }

            if (rule.required) {
                if(typeof forms[name] === 'boolean' && !forms[name]) {

                }else if (typeof forms[name] !== 'boolean' && !forms[name]?.trim?.()) {
                    errorObject[name] = rule.message || ERROR_MESSAGE.required
                    break;
                }
            }


            if (rule.regexp && forms[name]) {
                let regexp = rule.regexp
                if (regexp in REGEXP) {
                    regexp = REGEXP[regexp]
                } else if (!(regexp instanceof RegExp)) {
                    regexp = new RegExp()
                }

                if (!regexp.test(forms[name])) {
                    errorObject[name] = rule.message || ERROR_MESSAGE.regexp
                    break;

                }
            }

            if (rule.min || rule.max) {
                if (forms[name]?.length < rule.min || forms[name]?.length > rule.max) {
                    errorObject[name] = rule.message || ERROR_MESSAGE.minMax(rule.min, rule.max)
                    break;

                }
            }

            if(rule.confirm) {
                if(Boolean(forms[rule.confirm]) !== Boolean(forms[name]) || forms[rule.confirm] !== forms[name]) {
                    errorObject[name] = rule.message || ERROR_MESSAGE.confirm(rule.confirm)
                    break;

                }
            }
        }
    }

    return errorObject
}
