export class QuantityValue{

 constructor( private quantityToUse:number,private measure:string){}
 public getquantityToUse(): number {
  return this.quantityToUse;
}
public setquantityToUse(value: number): void {
  this.quantityToUse = value;
}
public getMeasure(): string {
  return this.measure;
}
public setMeasure(value: string): void {
  this.measure = value;
}
}
