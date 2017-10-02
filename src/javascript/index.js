
import '../css/app.sass'

export class Parser {
  constructor(TEXTAREA) {

    this.analisysArr = [];

    TEXTAREA.addEventListener("keyup", (event) => {
      this.parse(event.target.value);
    });
    this.parse(TEXTAREA.value);
  }

  trim(text) {
    text = text.replace(/(\n|\r)/g,"");
    return text.replace(/(^\s*|\s*$)/g,"");
  }

  searchMatchFlag(text, serarchPoint) {
    let matchFlag = null;
    if (serarchPoint === "start") {
      matchFlag = text.match(/^(\{|\[)/);
    }
    else if (serarchPoint === "end") {
      matchFlag = text.match(/(\}|\])$/);
    }
    if (matchFlag === null) {
      console.log('error');
      return;
    }
    return matchFlag[0];
  }

  compareMatchFlag(startFlag, endFlag) {
    if (startFlag === "{" && endFlag !== "}") {
      return true;
    }
    if (startFlag === "[" && endFlag !== "]") {
      return true;
    }
    return false;
  }

  removeMatchFlagString(text) {
    text = text.replace(/^(\{|\[)/,"");
    text = text.replace(/(\}|\])$/,"");
    return text;
  }

  parse(original) {
    let text = this.trim(original);
    let startMatchFlag = this.searchMatchFlag(text, "start");
    let endMatchFlag = this.searchMatchFlag(text, "end");
    this.analisysArr.push(startMatchFlag);

    if (this.compareMatchFlag(startMatchFlag, endMatchFlag)) {
      console.log('notmatchflag');
      return;
    }
    text = this.removeMatchFlagString(text);
    text.split(",").forEach((item) => {
      this.analisysArr.push(item);
    });

    this.analisysArr.push(endMatchFlag);
    console.log(this.analisysArr);
  }
  /*
  printArr() {
  }
  */

}


