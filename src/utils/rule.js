export const required = (message = 'Trường này không được để trống') => ({
    required: true,
    message
})

export const regexp = (pattern, message = 'Vui lòng nhập đúng định dạng') => ({
    regexp: pattern,
    message
})


export const minMax = (min, max, message = 'Vui lòng nhập đúng độ dài chuỗi') => ({
    min, max, message
})

export const confirm = (field, message = `Vui lòng nhập giống ${field}`) => ({
    confirm: field,
    message
})

const SPECIAL_REGEXP = /[^A-Za-z 0-9]/
const NUMBER_REGEXP = /[0-9]/
const LOWERCASE_REGEXP = /[a-z]/
const UPPERCASE_REGEXP = /[A-Z]/

const PASSWORD_REGEXP = [SPECIAL_REGEXP, NUMBER_REGEXP, LOWERCASE_REGEXP, UPPERCASE_REGEXP]

export const password = (level = 4, message = 'Vui lòng nhập password đủ mạnh') => (value) => {

    let _checkNumber = level
    for (let i = 0; i < PASSWORD_REGEXP.length; i++) {
        if (PASSWORD_REGEXP[i].test(value)) {
            _checkNumber--
        }
        if (_checkNumber === 0) break;
    }

    return _checkNumber > 0 ? message : undefined
}

export const requiredLetter = (length, message = `Vui lòng điền ít nhất ${length} ký tự`) => (value) => {
    return value?.trim()?.split(' ').length < length ? message : undefined
} 