// 各ページを名前空間に管理
const config = {
  initialPage: document.getElementById("initialPage"),
  mainPage: document.getElementById("mainPage")
};

// ユーザー情報
class User {
  // 初期値（name, age, days, money, items）
  // name;age;days;money;clickCount;incomePerClick;incomePerSec;stock;items
  constructor(name, age, days, money, items) {
    this.name = name;
    this.age = age;
    this.days = days;
    this.money = money;
    this.clickCount = 0;// クリック数
    this.incomePerClick = 25; // 1クリックあたりの利益
    this.incomePerSec = 0;// 1秒あたりの利益
    this.stock = 0;// ETFの購入数
    this.items = items;
  }
};

// アイテム情報
class Items {
  // 初期値（name, type, currentAmount, maxAmount, perMoney, perRate, price, url）
  // name;type;currentAmount;maxAmount;perMoney;perRate;price;url;
  constructor(name, type, currentAmount, maxAmount, perMoney, perRate, price, url) {
    this.name = name;
    this.type = type;
    this.currentAmount = currentAmount;
    this.maxAmount = maxAmount;
    this.perMoney = perMoney;
    this.perRate = perRate;
    this.price = price;
    this.url = url;
  }
};

// レンダリング用
class View {
  // ログインページ
  static createInitialPage() {
    const container = document.createElement("div");
    container.classList.add("vh-100", "d-flex", "justify-content-center", "align-items-center")
    container.innerHTML = `
      <div class="bg-white text-center p-4">
        <h2 class="pb-3">Clicker Empire Game</h2>
        <form>
          <div class="form-row pb-3 row">
            <div class="col">
              <input type="text" class="form-control" placeholder="Your name" value="name">
            </div>
          </div>
        </form>
        <div class="row justify-content-between">
          <div class="col-6">
            <button type="submit" class="btn btn-primary col-12" id="newGame">New</button>
          </div>
          <div class="col-6">
            <button type="submit" class="btn btn-primary col-12" id="login">Login</button>
          </div>
        </div>
      </div>`;
    config.initialPage.append(container);
  }

  // メインページ
  static createMainPage(user) {
    // 雛形を作成
    const container = document.createElement("div");
    container.innerHTML = `
      <div class="d-flex justify-content-center p-md-5 pb-5" style='height:100vh;'>
        <div class="bg-navy p-2 d-flex col-md-11 col-lg-10">
          <div class="bg-dark p-2 col-4" id="burgerStatus">
          </div>
          <div class="col-8">
            <div class="p-1 bg-navy" id="userInfo">
            </div>
            <div class="bg-dark mt-2 p-1 overflow-auto flowHeight" id="displayItems">
            </div>
            <div class="d-flex justify-content-end mt-2">
              <div class="border p-2 mr-2 hover" id="reset">
                <i class="fas fa-undo fa-2x text-white"></i>
              </div>
              <div class="border p-2 hover" id="save">
                <i class="fas fa-save fa-2x text-white"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    config.mainPage.append(container);

    // ハンバーガーの状態・ユーザー情報・アイテム情報を各divにアセンブル
    document.getElementById("burgerStatus").append(View.createBurgerStatus(user));
    document.getElementById("userInfo").append(View.createUserInfo(user));
    document.getElementById("displayItems").append(View.createItemPage(user));
    // リセットボタンのクリックイベント

    // 保存ボタンのクリックイベント
    const saveBtn = document.querySelector("#save");
    saveBtn.addEventListener("click", () => {
      // ユーザー情報を保存
      Controller.saveUserDate(user);
      // タイマーを止める
      Controller.stopTimer(user);
      // 初期ページに遷移
      Controller.initializePage();
    });
  }

  static createBurgerStatus(user) { }

  static createUserInfo(user) {
    const container = document.createElement("div");
    container.classList.add("d-flex","flex-wrap","p-1")
    container.innerHTML = `
      <div class="text-white text-center col-12 col-sm-6 userInfoBorder">
        <p>${user.name}</p>
      </div>
      <div class="text-white text-center col-12 col-sm-6 userInfoBorder">
        <p>${user.age} years old</p>
      </div>
      <div class="text-white text-center col-12 col-sm-6 userInfoBorder">
        <p>${user.days} days</p>
      </div>
      <div class="text-white text-center col-12 col-sm-6 userInfoBorder">
        <p>￥${user.money}</p>
      </div>
    `;
    return container;
  }

  static createItemPage(user) { }
};
// 入力→操作
class Controller {
  setTimerID;

  static startGame() {

    // 初期ページ設定
    View.createInitialPage();

    const newGameBtn = document.getElementById("newGame");
    newGameBtn.addEventListener("click", () => {
      const userName = config.initialPage.querySelector("input").value;
      if (userName == "") alert("新しい名前を入力してください。");
      else if (Controller.getUserData(userName) != null) alert("ユーザーがすでに存在しています。ログインしてください。");
      else {
        // Userオブジェクトを生成してMainへ遷移
        const user = Controller.createInitialUserAccount(userName);
        Controller.moveInitialToMain(user);
      };
    });
    const loginBtn = document.getElementById("login");
    loginBtn.addEventListener("click", () => {
      const userName = config.initialPage.querySelector("input").value;
      if (userName == "") alert("名前を入力してください。");
      else if (Controller.getUserData(userName) == null) alert("ユーザーが存在しません。別の名前を入力してください。");
      else {
        Controller.moveInitialToMain(user);
      };
    });

  }
  // Mainを表示
  static moveInitialToMain(user) {
    config.initialPage.classList.add("d-none");
    View.createMainPage(user);
    Controller.startTimer(user);
  };

  static initializePage() {
    config.initialPage.classList.remove("d-none");
    config.initialPage.innerHTML = "";
    config.mainPage.innerHTML = "";
    Controller.startGame();
  }

  static startTimer(user) {
    Controller.setTimerID = setInterval(() => {
      user.days+=15;
      if(user.days % 360 == 0) user.age++;
      user.money += user.days * user.incomePerSec ;
      Controller.updateUserAccount(user);
    }, 1000)
  }
  static stopTimer(){
    clearInterval(Controller.setTimerID);
  }

  static createInitialUserAccount(userName) {
    let itemsList = [
      new Items("Flip machine", "ability", 0, 500, 25, 0, 15000, "https://cdn.pixabay.com/photo/2019/06/30/20/09/grill-4308709_960_720.png"),
      new Items("ETF Stock", "investment", 0, -1, 0, 0.1, 300000, "https://cdn.pixabay.com/photo/2016/03/31/20/51/chart-1296049_960_720.png"),
      new Items("ETF Bonds", "investment", 0, -1, 0, 0.07, 300000, "https://cdn.pixabay.com/photo/2016/03/31/20/51/chart-1296049_960_720.png"),
      new Items("Lemonade Stand", "realState", 0, 1000, 30, 0, 30000, "https://cdn.pixabay.com/photo/2012/04/15/20/36/juice-35236_960_720.png"),
      new Items("Ice Cream Truck", "realState", 0, 500, 120, 0, 100000, "https://cdn.pixabay.com/photo/2020/01/30/12/37/ice-cream-4805333_960_720.png"),
      new Items("House", "realState", 0, 100, 32000, 0, 20000000, "https://cdn.pixabay.com/photo/2016/03/31/18/42/home-1294564_960_720.png"),
      new Items("TownHouse", "realState", 0, 100, 64000, 0, 40000000, "https://cdn.pixabay.com/photo/2019/06/15/22/30/modern-house-4276598_960_720.png"),
      new Items("Mansion", "realState", 0, 20, 500000, 0, 250000000, "https://cdn.pixabay.com/photo/2017/10/30/20/52/condominium-2903520_960_720.png"),
      new Items("Industrial Space", "realState", 0, 10, 2200000, 0, 1000000000, "https://cdn.pixabay.com/photo/2012/05/07/17/35/factory-48781_960_720.png"),
      new Items("Hotel Skyscraper", "realState", 0, 5, 25000000, 0, 10000000000, "https://cdn.pixabay.com/photo/2012/05/07/18/03/skyscrapers-48853_960_720.png"),
      new Items("Bullet-Speed Sky Railway", "realState", 0, 1, 30000000000, 0, 10000000000000, "https://cdn.pixabay.com/photo/2013/07/13/10/21/train-157027_960_720.png")
    ]
    return new User(userName, 20, 0, 50000, itemsList);
  }

  static updateUserAccount(user) {
    const userInfo = document.getElementById("userInfo");
    userInfo.querySelector("div").innerHTML = `
      <div class="text-white text-center col-12 col-sm-6 userInfoBorder">
        <p>${user.name}</p>
      </div>
      <div class="text-white text-center col-12 col-sm-6 userInfoBorder">
        <p>${user.age} years old</p>
      </div>
      <div class="text-white text-center col-12 col-sm-6 userInfoBorder">
        <p>${user.days} days</p>
      </div>
      <div class="text-white text-center col-12 col-sm-6 userInfoBorder">
        <p>￥${user.money}</p>
      </div>
    `;
  }

  // ローカルストレージに保存
  static saveUserDate(user) {
    localStorage.setItem(user.name, JSON.stringify(user));
    alert("データを保存しました。終了します。");
  }

  static getUserData(userName) {

  }
};

Controller.startGame();