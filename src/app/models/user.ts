import { Address } from './Address';

export class User {
  constructor(
    private id: string,
    private firstName: string,
    private lastName: string,
    private identifier: string,
    private password: string,
    private address: Address,
    private tel: string,
    private roles: string[]
  ) {}

  public getRoles(): string[] {
    return this.roles;
  }
  public setRoles(value: string[]): void {
    this.roles = value;
  }

  public getId(): string {
    return this.id;
  }
  public setId(value: string): void {
    this.id = value;
  }

  public getfirstName(): string {
    return this.firstName;
  }
  public setfirstName(value: string): void {
    this.firstName = value;
  }

  public getlastName(): string {
    return this.lastName;
  }
  public setlastNamme(value: string): void {
    this.lastName = value;
  }

  public getPassword(): string {
    return this.password;
  }
  public setPassword(value: string): void {
    this.password = value;
  }

  public getIdentifier(): string {
    return this.identifier;
  }
  public setIdentifier(value: string): void {
    this.identifier = value;
  }

  public getTel(): string {
    return this.tel;
  }
  public setTel(value: string): void {
    this.tel = value;
  }

  public getAddress(): Address {
    return this.address;
  }
  public setAddress(value: Address): void {
    this.address = value;
  }
}
