    
// В данную функцию можно передать любое значение через !!(пример returnTrue0(!!1)),
// кроме null,undefined,0,false,''
//если так нельзя и надо передать конкретное значение тогда это будет true
function returnTrue0(a) {
  return a;
}
//любая строка состоящая из 4 символов
function returnTrue1(a) {
  return typeof a !== 'object' && !Array.isArray(a) && a.length === 4;
}
//любые значения, кроме примитивных ({},[] и т.д), а также NaN
function returnTrue2(a) {
  return a !== a;
}
//returnTrue3([1], 1, [1])
function returnTrue3(a, b, c) {
  return a && a == b && b == c && a != c;
}
//9007199254740991
function returnTrue4(a) {
  return (a++ !== a) && (a++ === a);
}
//returnTrue5([0])
function returnTrue5(a) {
  return a in a;
}
//returnTrue6([0])
function returnTrue6(a) {
  return a[a] == a;
}
// returnTrue7(-0, 0)
function returnTrue7(a, b) {
  return a === b && 1/a < 1/b; 
}
