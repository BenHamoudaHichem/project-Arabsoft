export class QuantityValue{

 constructor( protected quantityToUse:number,protected measure:string){}
 public getquantityToUse() {
  return this.quantityToUse;
}
public setquantityToUse(value: number): void {
  this.quantityToUse = value;
}
public getMeasure() {
  return this.measure;
}
public setMeasure(value: string): void {
  this.measure = value;
}
}
