class TaTest {
  constructor() {
    this.version = "0.1a";
    this.ltm = Date.now();
    this.host = window.location.pathname.toLowerCase().replace(/\W/g, "");
    this.lsd = JSON.parse(localStorage.getItem(this.host));
  }

  coba = {
    f1: (param) => {
      console.log(param);
    },
    f2: () => {
      console.log(this.ltm);
    }
  };

}

let tt = new TaTest();