const reg = /^[a-zA-Z]+(_[a-zA-Z0-9]+|[a-zA-Z0-9]*)*$/

console.log(reg.test('a'))
console.log(reg.test('a_1'))
console.log(reg.test('a_aa'))
console.log(reg.test('a_aa'))
console.log(reg.test('a_aa_a'))
console.log(reg.test('a_aa_0'))
console.log(reg.test('a_aa_a0'))
console.log(reg.test('a0'))

console.log(reg.test('a__0'))
console.log(reg.test('a__a'))
