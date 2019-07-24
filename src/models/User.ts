export default class User {

  // tslint:disable-next-line:variable-name
  public _id?: string;
  public isRootAdmin?: boolean;
  public email: string;
  public password: string;
  public name: string;
  public language: string;
  public profilePicture: string;
  public savedHymns?: string[];

  constructor(
    email: string,
    password: string,
    name: string,
    language: string,
    profilePicture?: string,
    savedHymns?: string[],
  ) {
    this.email = email;
    this.password = password;
    this.name = name;
    this.language = language;
    this.profilePicture = profilePicture || "";
    this.savedHymns = savedHymns;
  }

}
